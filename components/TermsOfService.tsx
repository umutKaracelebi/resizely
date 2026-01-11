import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Terms of Service</h1>
      
      <div className="space-y-8 text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Resizely, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">2. Usage License</h2>
          <p className="mb-4">
            Resizely is a free tool provided for personal and commercial use. You are free to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>Use the tool to process an unlimited number of images.</li>
            <li>Use the processed images for any purpose, commercial or private.</li>
          </ul>
          <p className="mt-4">
            However, you may not attempt to reverse engineer the code, sell access to the tool, or use the tool for any illegal activities.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. Disclaimer</h2>
          <p className="bg-slate-800/50 p-6 rounded-lg border-l-4 border-amber-500">
            The materials and tools on Resizely are provided on an 'as is' basis. Resizely makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">4. Limitations</h2>
          <p>
            In no event shall Resizely be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Resizely's website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">5. Browser Compatibility</h2>
          <p>
            Since Resizely relies on modern web technologies (HTML5 Canvas, File API), we cannot guarantee full functionality on outdated browsers (e.g., Internet Explorer). We recommend using the latest versions of Chrome, Firefox, Safari, or Edge.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;