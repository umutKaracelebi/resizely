import React, { useState, useEffect, useCallback } from 'react';
import DropZone from './components/DropZone';
import Controls from './components/Controls';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import Contact from './components/Contact';
import { ImageSettings, ImageState } from './types';
import { getImageDimensions, processImage, formatBytes } from './utils/imageUtils';

type ViewState = 'home' | 'privacy' | 'terms' | 'contact';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');

  const [appState, setAppState] = useState<ImageState>({
    originalFile: null,
    originalUrl: null,
    originalDimensions: { width: 0, height: 0 },
    processedBlob: null,
    processedUrl: null,
    processedSize: 0,
    isProcessing: false,
  });

  const [settings, setSettings] = useState<ImageSettings>({
    width: 0,
    height: 0,
    keepAspectRatio: true,
    quality: 0.9,
    format: 'image/jpeg',
    fillColor: '#ffffff',
    maintainTransparency: true,
  });

  // Dynamic Favicon Generation (Round Corners)
  useEffect(() => {
    const updateFavicon = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = "Anonymous"; 
      img.src = "https://resizely-logo.netlify.app/resizely-logo.png";
      
      img.onload = () => {
        ctx.clearRect(0, 0, 64, 64);
        ctx.beginPath();
        // Draw rounded rectangle manually for compatibility
        const r = 16; // 16px radius for 64px icon (soft round)
        ctx.moveTo(r, 0);
        ctx.lineTo(64 - r, 0);
        ctx.quadraticCurveTo(64, 0, 64, r);
        ctx.lineTo(64, 64 - r);
        ctx.quadraticCurveTo(64, 64, 64 - r, 64);
        ctx.lineTo(r, 64);
        ctx.quadraticCurveTo(0, 64, 0, 64 - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();
        ctx.clip();
        
        ctx.drawImage(img, 0, 0, 64, 64);
        
        try {
            const dataUrl = canvas.toDataURL('image/png');
            
            // Update standard icon
            const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
            if (link) link.href = dataUrl;
            
            // Update apple icon
            const appleLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
            if (appleLink) appleLink.href = dataUrl;
        } catch (e) {
            // Silently fail if CORS prevents canvas export
            console.debug('Favicon update failed due to CORS', e);
        }
      };
    };

    updateFavicon();
  }, []);

  // Handle file selection
  const handleFileSelect = async (file: File) => {
    try {
      const { width, height, src } = await getImageDimensions(file);
      
      setAppState(prev => ({
        ...prev,
        originalFile: file,
        originalUrl: src,
        originalDimensions: { width, height },
        processedBlob: null,
        processedUrl: null,
        isProcessing: true // Start initial processing
      }));

      // Set initial settings based on uploaded image
      const isPng = file.type === 'image/png' || file.type === 'image/webp';
      setSettings(prev => ({
        ...prev,
        width,
        height,
        format: file.type === 'image/png' ? 'image/png' : 'image/jpeg',
        maintainTransparency: isPng
      }));

    } catch (error) {
      console.error("Error loading image:", error);
      alert("Error loading image. Please try again.");
    }
  };

  // Process image when settings change (Debounced)
  useEffect(() => {
    if (!appState.originalUrl || settings.width === 0 || settings.height === 0) return;

    setAppState(prev => ({ ...prev, isProcessing: true }));

    const timer = setTimeout(async () => {
      try {
        if (appState.originalUrl) {
            const blob = await processImage(appState.originalUrl, settings);
            const url = URL.createObjectURL(blob);
            
            setAppState(prev => {
                // Revoke old URL to prevent memory leaks
                if (prev.processedUrl) URL.revokeObjectURL(prev.processedUrl);
                
                return {
                    ...prev,
                    processedBlob: blob,
                    processedUrl: url,
                    processedSize: blob.size,
                    isProcessing: false
                };
            });
        }
      } catch (error) {
        console.error("Processing error:", error);
        setAppState(prev => ({ ...prev, isProcessing: false }));
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [settings, appState.originalUrl]);

  // Validation
  const isValidDimensions = settings.width > 0 && settings.height > 0;

  const handleDownload = () => {
    if (!appState.processedUrl) return;
    
    // Safety check
    if (!isValidDimensions) {
        alert("Please enter valid width and height values (cannot be 0).");
        return;
    }
    
    const link = document.createElement('a');
    link.href = appState.processedUrl;
    
    // Create filename based on format
    const ext = settings.format.split('/')[1];
    const originalName = appState.originalFile?.name.split('.')[0] || 'resizely-image';
    link.download = `${originalName}-edited.${ext}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setAppState({
        originalFile: null,
        originalUrl: null,
        originalDimensions: { width: 0, height: 0 },
        processedBlob: null,
        processedUrl: null,
        processedSize: 0,
        isProcessing: false,
    });
  };

  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('home')}>
             {/* External Logo Image */}
             <div className="relative group">
                <div className="absolute -inset-1 bg-primary-500/50 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-500"></div>
                <img 
                  src="https://resizely-logo.netlify.app/resizely-logo.png" 
                  alt="Resizely Logo" 
                  className="relative w-10 h-10 md:w-12 md:h-12 rounded-lg object-contain shadow-xl transition-transform duration-300 group-hover:scale-105"
                />
             </div>
            <div className="text-xl font-bold tracking-tight text-white">Resizely</div>
          </div>
        </div>
      </header>

      {/* Main Content Router */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {currentView === 'privacy' && <PrivacyPolicy />}
        {currentView === 'terms' && <TermsOfService />}
        {currentView === 'contact' && <Contact />}
        
        {currentView === 'home' && (
            <>
                {!appState.originalFile ? (
                <div className="max-w-4xl mx-auto mt-8 md:mt-16 fade-in px-4">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-sm leading-tight">
                        Resize & Compress <br className="hidden md:block" /> Images Instantly
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        The fastest way to resize, optimize, and convert your photos. 
                        <span className="block mt-2 text-slate-400 font-medium">No server uploads. 100% Private. Free forever.</span>
                    </p>
                    </div>
                    
                    <DropZone onFileSelect={handleFileSelect} />
                    
                    {/* Value Props */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-center">
                        {[
                            { title: "Unlimited", desc: "Process as many images as you want with no file size limits." },
                            { title: "Private & Secure", desc: "All processing happens in your browser. Files never leave your device." },
                            { title: "Lightning Fast", desc: "Powered by WebAssembly for instant resizing and compression." }
                        ].map((item, i) => (
                            <div key={i} className="p-6 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-colors shadow-sm">
                                <h3 className="font-bold text-white mb-2 text-lg">{item.title}</h3>
                                <p className="text-slate-400 leading-snug">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* SEO Content: How it Works */}
                    <div className="mt-24 space-y-24 text-slate-300">
                        <section>
                            <h2 className="text-3xl font-bold text-white text-center mb-12">How to Resize Your Image?</h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="bg-slate-800/20 p-8 rounded-2xl border border-slate-800 hover:bg-slate-800/40 transition-colors relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl group-hover:scale-110 transition-transform">1</div>
                                    <h3 className="text-xl font-bold text-white mb-3">Upload Image</h3>
                                    <p className="text-slate-400">Drag and drop your JPG, PNG, or WEBP file into the box above. We support high-resolution photos directly from your camera or phone.</p>
                                </div>
                                <div className="bg-slate-800/20 p-8 rounded-2xl border border-slate-800 hover:bg-slate-800/40 transition-colors relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl group-hover:scale-110 transition-transform">2</div>
                                    <h3 className="text-xl font-bold text-white mb-3">Adjust Settings</h3>
                                    <p className="text-slate-400">Set your desired width and height in pixels or percentage. Choose the output format (JPEG, PNG, WEBP) and adjust quality slider.</p>
                                </div>
                                <div className="bg-slate-800/20 p-8 rounded-2xl border border-slate-800 hover:bg-slate-800/40 transition-colors relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl group-hover:scale-110 transition-transform">3</div>
                                    <h3 className="text-xl font-bold text-white mb-3">Download</h3>
                                    <p className="text-slate-400">Instantly download your optimized image. No waiting time, no queue, and absolutely no watermarks.</p>
                                </div>
                            </div>
                        </section>

                        {/* SEO Content: Detailed Features */}
                        <section className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-6">Why Use Resizely?</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="bg-primary-500/10 p-2 rounded-lg h-fit">
                                        <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">100% Secure & Private</h3>
                                        <p className="text-slate-400 text-sm mt-1">Unlike other tools, we don't send your images to a server. All magic happens locally in your browser, making it safe for sensitive documents and personal photos.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-primary-500/10 p-2 rounded-lg h-fit">
                                        <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">High Quality Compression</h3>
                                        <p className="text-slate-400 text-sm mt-1">Smart algorithms allow you to reduce file size significantly without visible quality loss. Perfect for website optimization and SEO.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-primary-500/10 p-2 rounded-lg h-fit">
                                        <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Universal Format Support</h3>
                                        <p className="text-slate-400 text-sm mt-1">Convert seamlessly between JPG, PNG, and WEBP formats. Need a transparent background? Use PNG. Need a small file size? Use WEBP.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-6">Supported Operations</h3>
                            <div className="flex flex-wrap gap-2 mb-8">
                                {['Resize Dimensions', 'Compress Size', 'Convert to JPG', 'Convert to PNG', 'Convert to WEBP', 'Change Aspect Ratio', 'Add Background Color'].map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300 border border-slate-600">{tag}</span>
                                ))}
                            </div>
                            <div className="bg-black/30 rounded-lg p-4 border border-slate-700/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-slate-500">Original</span>
                                    <span className="text-xs text-slate-500">Optimized</span>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary-500 w-[40%] shadow-[0_0_10px_rgba(14,165,233,0.5)]"></div>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-sm font-mono text-white">5 MB</span>
                                    <span className="text-sm font-mono text-primary-400">~800 KB</span>
                                </div>
                            </div>
                        </div>
                        </section>

                        {/* FAQ Section */}
                        <section className="pb-12">
                            <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    { q: "Is Resizely free to use?", a: "Yes, Resizely is completely free. There are no limits on the number of images you can process." },
                                    { q: "Do you store my photos?", a: "No. Your privacy is our priority. Images are processed directly in your browser using JavaScript and never uploaded to our servers." },
                                    { q: "What formats do you support?", a: "We support the most popular web image formats: JPEG, PNG, and WEBP for both input and output." },
                                    { q: "Can I resize images on my phone?", a: "Yes! Resizely is fully responsive and works perfectly on iOS and Android devices directly in the browser." },
                                    { q: "Why should I compress my images?", a: "Compressing images reduces file size, which makes websites load faster, improves SEO scores, and saves storage space." },
                                    { q: "How do I convert PNG to JPG?", a: "Simply upload your PNG file, select 'JPEG' from the format dropdown in the settings, and click Download." }
                                ].map((faq, i) => (
                                    <div key={i} className="bg-slate-800/30 p-6 rounded-xl border border-slate-800/50">
                                        <h3 className="font-bold text-white mb-2">{faq.q}</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
                ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                    {/* Editor Preview Area */}
                    <div className="lg:col-span-8 flex flex-col gap-4">
                    <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                            <button 
                                onClick={handleReset}
                                className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                                Back
                            </button>
                            <div className="flex gap-4 text-sm">
                                <div className="flex flex-col items-end">
                                    <span className="text-slate-400 text-xs">Original</span>
                                    <span className="font-medium text-slate-200">{formatBytes(appState.originalFile.size)}</span>
                                </div>
                                <div className="w-px bg-slate-700"></div>
                                <div className="flex flex-col items-start">
                                    <span className="text-primary-400 text-xs">New Size</span>
                                    <span className="font-bold text-primary-300">
                                        {appState.isProcessing ? '...' : formatBytes(appState.processedSize)}
                                    </span>
                                </div>
                            </div>
                    </div>

                    <div className="flex-1 bg-black/40 rounded-lg border border-slate-700/50 flex items-center justify-center p-8 relative overflow-hidden min-h-[500px]">
                        {/* Checkerboard background for transparency */}
                        <div className="absolute inset-0 opacity-20" style={{
                            backgroundImage: 'linear-gradient(45deg, #334155 25%, transparent 25%), linear-gradient(-45deg, #334155 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #334155 75%), linear-gradient(-45deg, transparent 75%, #334155 75%)',
                            backgroundSize: '20px 20px',
                            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                        }}></div>

                        {appState.processedUrl && (
                        <img
                            src={appState.processedUrl}
                            alt="Preview"
                            className="max-w-full max-h-[600px] object-contain shadow-2xl relative z-10 transition-all duration-300"
                            style={{ opacity: appState.isProcessing ? 0.5 : 1 }}
                        />
                        )}
                        
                        {appState.isProcessing && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-sm bg-black/10">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                            </div>
                        )}
                    </div>
                    </div>

                    {/* Sidebar Controls */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                    <Controls 
                        settings={settings} 
                        originalDimensions={appState.originalDimensions}
                        onChange={setSettings}
                    />
                    
                    <button
                        onClick={handleDownload}
                        disabled={appState.isProcessing || !isValidDimensions}
                        className={`
                            w-full py-4 rounded-lg font-bold text-lg shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 transition-all
                            ${(appState.isProcessing || !isValidDimensions)
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                                : 'bg-primary-600 hover:bg-primary-500 text-white hover:shadow-primary-500/40 hover:-translate-y-0.5'
                            }
                        `}
                    >
                        {isValidDimensions ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Download
                        </>
                        ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            Invalid Dimensions
                        </>
                        )}
                    </button>
                    </div>
                </div>
                )}
            </>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-12 text-slate-400 text-sm">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between gap-8 mb-8">
            <div className="max-w-sm">
                 <div className="flex items-center gap-4 mb-6 cursor-pointer group" onClick={() => navigateTo('home')}>
                    <div className="relative w-16 h-16 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                        {/* Glow effect - no box/frame */}
                        <div className="absolute inset-0 bg-primary-500/30 blur-2xl rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <img src="https://resizely-logo.netlify.app/resizely-logo.png" alt="Logo" className="w-12 h-12 object-contain relative z-10 drop-shadow-[0_0_10px_rgba(14,165,233,0.5)] rounded-lg" />
                    </div>
                    <span className="text-3xl font-bold text-white tracking-tight group-hover:text-primary-100 transition-colors">Resizely</span>
                 </div>
                 <p className="text-slate-500 leading-relaxed">The secure, fast, and free online image editor. Process images locally in your browser without compromising privacy.</p>
            </div>
            
            <div className="flex flex-col md:items-end">
                <h4 className="text-white font-bold mb-4">Legal & Support</h4>
                <ul className="space-y-3 md:text-right">
                    <li><button onClick={() => navigateTo('privacy')} className={`hover:text-primary-400 transition-colors ${currentView === 'privacy' ? 'text-primary-400' : ''}`}>Privacy Policy</button></li>
                    <li><button onClick={() => navigateTo('terms')} className={`hover:text-primary-400 transition-colors ${currentView === 'terms' ? 'text-primary-400' : ''}`}>Terms of Service</button></li>
                    <li><button onClick={() => navigateTo('contact')} className={`hover:text-primary-400 transition-colors ${currentView === 'contact' ? 'text-primary-400' : ''}`}>Contact</button></li>
                </ul>
            </div>
        </div>
        <div className="container mx-auto px-4 pt-8 border-t border-slate-800 text-center">
            <p>&copy; {new Date().getFullYear()} Resizely. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;