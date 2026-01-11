import React, { useState } from 'react';
import { ImageSettings } from '../types';

interface ControlsProps {
  settings: ImageSettings;
  originalDimensions: { width: number; height: number };
  onChange: (newSettings: ImageSettings) => void;
}

const Controls: React.FC<ControlsProps> = ({ settings, originalDimensions, onChange }) => {
  const [mode, setMode] = useState<'pixels' | 'percentage'>('pixels');
  const [isFillColorOpen, setIsFillColorOpen] = useState(false);
  
  // Calculate current percentages based on actual pixel settings for display in Percentage mode
  const widthPercent = originalDimensions.width ? Math.round((settings.width / originalDimensions.width) * 100) : 0;
  const heightPercent = originalDimensions.height ? Math.round((settings.height / originalDimensions.height) * 100) : 0;

  // Validation states
  const isWidthInvalid = settings.width === 0;
  const isHeightInvalid = settings.height === 0;

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>, dimension: 'width' | 'height') => {
    const valStr = e.target.value;
    
    // Handle empty input explicitly
    if (valStr === '') {
        let newWidth = settings.width;
        let newHeight = settings.height;
        
        if (dimension === 'width') {
            newWidth = 0;
            if (settings.keepAspectRatio) newHeight = 0;
        } else {
            newHeight = 0;
            if (settings.keepAspectRatio) newWidth = 0;
        }
        
        onChange({ ...settings, width: newWidth, height: newHeight });
        return;
    }

    let value = parseFloat(valStr);
    if (isNaN(value)) return;

    let newWidth = settings.width;
    let newHeight = settings.height;

    if (mode === 'pixels') {
        if (dimension === 'width') {
            newWidth = value;
            if (settings.keepAspectRatio && originalDimensions.width > 0) {
                const ratio = originalDimensions.width / originalDimensions.height;
                // Avoid division by zero issues or infinite if height is 0 (though originalDimensions check handles it)
                newHeight = Math.round(value / ratio);
            }
        } else {
            newHeight = value;
            if (settings.keepAspectRatio && originalDimensions.height > 0) {
                const ratio = originalDimensions.width / originalDimensions.height;
                newWidth = Math.round(value * ratio);
            }
        }
    } else {
        // Percentage mode logic
        if (dimension === 'width') {
            newWidth = Math.round(originalDimensions.width * (value / 100));
            if (settings.keepAspectRatio) {
                newHeight = Math.round(originalDimensions.height * (value / 100));
            }
        } else {
            newHeight = Math.round(originalDimensions.height * (value / 100));
            if (settings.keepAspectRatio) {
                newWidth = Math.round(originalDimensions.width * (value / 100));
            }
        }
    }

    // Allow 0 values during typing, don't force Math.max(1)
    onChange({ 
        ...settings, 
        width: Math.floor(newWidth), 
        height: Math.floor(newHeight) 
    });
  };

  const handleRatioToggle = () => {
    const newKeepAspectRatio = !settings.keepAspectRatio;
    let newSettings = { ...settings, keepAspectRatio: newKeepAspectRatio };
    
    // If enabling aspect ratio, snap height to match width based on original ratio
    if (newKeepAspectRatio && originalDimensions.width > 0) {
         const ratio = originalDimensions.width / originalDimensions.height;
         newSettings.height = Math.round(newSettings.width / ratio);
    }
    onChange(newSettings);
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...settings, quality: parseFloat(e.target.value) });
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...settings, format: e.target.value as ImageSettings['format'] });
  };

  const handlePercentageScale = (percent: number) => {
    const newWidth = Math.round(originalDimensions.width * (percent / 100));
    const newHeight = Math.round(originalDimensions.height * (percent / 100));
    onChange({ ...settings, width: newWidth, height: newHeight });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...settings, fillColor: e.target.value });
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-xl border border-slate-700 h-full">
      <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
        Settings
      </h2>

      {/* Resize Section */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-end mb-2">
            <label className="text-sm font-medium text-slate-300">Dimensions</label>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-slate-900 p-1 rounded-md mb-4">
            <button 
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'pixels' ? 'bg-slate-700 text-white shadow ring-1 ring-slate-600' : 'text-slate-400 hover:text-slate-200'}`}
                onClick={() => setMode('pixels')}
            >
                Pixels
            </button>
            <button 
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'percentage' ? 'bg-slate-700 text-white shadow ring-1 ring-slate-600' : 'text-slate-400 hover:text-slate-200'}`}
                onClick={() => setMode('percentage')}
            >
                Percentage
            </button>
        </div>
        
        {/* Preset Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-4">
            {[25, 50, 75, 100, 125, 150, 200, 300].map((p) => (
                <button 
                    key={p}
                    onClick={() => handlePercentageScale(p)}
                    className="bg-slate-700 hover:bg-slate-600 hover:text-white text-xs py-2 rounded text-slate-300 transition-colors border border-slate-600 hover:border-slate-500"
                >
                    %{p}
                </button>
            ))}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`text-xs block mb-1 ${isWidthInvalid ? 'text-red-400' : 'text-slate-400'}`}>
                {mode === 'pixels' ? 'Width (px)' : 'Width (%)'}
            </label>
            <input
              type="number"
              value={mode === 'pixels' ? (settings.width === 0 ? '' : settings.width) : (widthPercent === 0 ? '' : widthPercent)}
              onChange={(e) => handleDimensionChange(e, 'width')}
              placeholder="0"
              className={`w-full bg-slate-900 border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 transition-colors
                ${isWidthInvalid 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-slate-600 focus:border-primary-500 focus:ring-primary-500'
                }`}
            />
          </div>
          <div>
            <label className={`text-xs block mb-1 ${isHeightInvalid ? 'text-red-400' : 'text-slate-400'}`}>
                {mode === 'pixels' ? 'Height (px)' : 'Height (%)'}
            </label>
            <input
              type="number"
              value={mode === 'pixels' ? (settings.height === 0 ? '' : settings.height) : (heightPercent === 0 ? '' : heightPercent)}
              onChange={(e) => handleDimensionChange(e, 'height')}
              placeholder="0"
              className={`w-full bg-slate-900 border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 transition-colors
                ${isHeightInvalid 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-slate-600 focus:border-primary-500 focus:ring-primary-500'
                }`}
            />
          </div>
        </div>
        
        {/* Error Message for 0 dimensions */}
        {(isWidthInvalid || isHeightInvalid) && (
            <div className="flex items-center gap-2 mt-2 text-red-400 text-xs bg-red-400/10 p-2 rounded border border-red-400/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <span>Width and height cannot be 0.</span>
            </div>
        )}

        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            id="aspect"
            checked={settings.keepAspectRatio}
            onChange={handleRatioToggle}
            className="rounded border-slate-600 bg-slate-900 text-primary-500 focus:ring-offset-slate-800"
          />
          <label htmlFor="aspect" className="text-sm text-slate-300 cursor-pointer select-none">
            Maintain Aspect Ratio
          </label>
        </div>
      </div>

      <hr className="border-slate-700 my-6" />

      {/* Format & Background Section */}
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-slate-300 block mb-2">Format</label>
          <select
            value={settings.format}
            onChange={handleFormatChange}
            className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white focus:border-primary-500 focus:outline-none mb-4"
          >
            <option value="image/jpeg">JPEG (Best Compression)</option>
            <option value="image/png">PNG (Lossless, Transparent)</option>
            <option value="image/webp">WEBP (Modern, Fast)</option>
          </select>
        </div>

        {/* Background Color Settings - Collapsible - Only visible for JPEG */}
        {settings.format === 'image/jpeg' && (
            <div className="bg-slate-900/50 rounded-md border border-slate-700 overflow-hidden transition-all">
                <button 
                    onClick={() => setIsFillColorOpen(!isFillColorOpen)}
                    className="w-full flex items-center justify-between p-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
                >
                    <span>Background Color</span>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className={`transition-transform duration-200 ${isFillColorOpen ? 'rotate-180' : ''}`}
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
                
                {isFillColorOpen && (
                    <div className="p-3 pt-0 border-t border-slate-700/50 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="flex items-center gap-3 mt-3">
                            {/* Color Preview Swatch - Opens Native Picker */}
                            <div className="relative w-12 h-10 rounded-md overflow-hidden border border-slate-600 shadow-sm hover:border-primary-500 transition-colors shrink-0 group cursor-pointer">
                                <input
                                    type="color"
                                    value={settings.fillColor}
                                    onChange={handleColorChange}
                                    className="absolute -top-2 -left-2 w-20 h-20 p-0 m-0 border-none cursor-pointer opacity-0"
                                    title="Open Color Picker"
                                />
                                <div 
                                    className="w-full h-full"
                                    style={{ backgroundColor: settings.fillColor }}
                                />
                            </div>

                            {/* Hex Input */}
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={settings.fillColor.toUpperCase()}
                                    onChange={handleColorChange}
                                    placeholder="#FFFFFF"
                                    className="w-full bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-white font-mono text-sm focus:border-primary-500 focus:outline-none uppercase"
                                />
                            </div>
                        </div>
                        <p className="text-[10px] text-amber-500/80 mt-2">JPEG doesn't support transparency, background color will be used.</p>
                    </div>
                )}
            </div>
        )}

        {/* Quality Section */}
        {settings.format !== 'image/png' && (
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-slate-300">Quality</label>
              <span className="text-sm text-primary-400 font-mono">%{Math.round(settings.quality * 100)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.01"
              value={settings.quality}
              onChange={handleQualityChange}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
             <p className="text-xs text-slate-500 mt-2">Lower quality reduces file size.</p>
          </div>
        )}
        
        {settings.format === 'image/png' && (
             <p className="text-xs text-slate-500 bg-slate-900/50 p-2 rounded border border-slate-700">PNG is lossless, quality setting does not apply.</p>
        )}
      </div>
    </div>
  );
};

export default Controls;