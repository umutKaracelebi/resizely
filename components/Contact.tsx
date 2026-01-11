import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">Contact Us</h1>
      
      <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow for main card */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent blur-sm"></div>

        <p className="text-slate-300 text-center mb-8 text-lg">
          Have questions, suggestions, or found a bug? We'd love to hear from you.
        </p>

        <div className="space-y-6">
          <div className="group flex items-start gap-4 p-5 bg-slate-900/80 rounded-2xl border border-slate-700 shadow-[0_0_15px_rgba(14,165,233,0.1)] hover:shadow-[0_0_25px_rgba(14,165,233,0.2)] hover:border-primary-500/40 transition-all duration-300">
            <div className="bg-primary-500/10 p-3 rounded-xl group-hover:bg-primary-500/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400 group-hover:text-primary-300">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-primary-200 transition-colors">Email Support</h3>
              <p className="text-slate-400 text-sm mb-2">For general inquiries and technical support:</p>
              <a href="mailto:umutkaracelebi220@gmail.com" className="text-primary-400 hover:text-primary-300 font-medium transition-colors break-all">
                umutkaracelebi220@gmail.com
              </a>
            </div>
          </div>

          <div className="group flex items-start gap-4 p-5 bg-slate-900/80 rounded-2xl border border-slate-700 shadow-[0_0_15px_rgba(14,165,233,0.1)] hover:shadow-[0_0_25px_rgba(14,165,233,0.2)] hover:border-primary-500/40 transition-all duration-300">
            <div className="bg-primary-500/10 p-3 rounded-xl group-hover:bg-primary-500/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400 group-hover:text-primary-300">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-primary-200 transition-colors">Bug Reports</h3>
              <p className="text-slate-400 text-sm">
                Found an issue? Please let us know the details so we can fix it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;