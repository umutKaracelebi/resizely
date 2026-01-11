import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Privacy Policy</h1>
      
      <div className="space-y-8 text-slate-300 leading-relaxed">
        <section className="bg-slate-800/30 p-8 rounded-xl border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">1. No Server Uploads</h2>
          <p>
            Resizely operates entirely within your web browser. When you "upload" an image, 
            it is never sent to our servers or any third-party cloud storage. All image processing 
            (resizing, compression, conversion) happens locally on your device using WebAssembly and JavaScript technologies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">2. Data Collection</h2>
          <p className="mb-4">
            Since we do not process your images on our servers, we do not collect, store, or share your visual content.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>We do not track individual user activity regarding the content of images.</li>
            <li>We do not use cookies for tracking personal behavior.</li>
            <li>We may use standard analytics tools (like simple page view counters) to understand general website traffic, but these do not identify you personally.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. Local Storage</h2>
          <p>
            The application may use your browser's local storage solely to remember your user interface preferences (like theme settings, if applicable). This data stays on your device.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">4. Third-Party Links</h2>
          <p>
            Our website may contain links to other websites. We are not responsible for the privacy practices of other sites. We encourage you to read their privacy statements.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">5. Updates</h2>
          <p>
            We may update this privacy policy from time to time. Changes will be posted on this page.
          </p>
          <p className="mt-4 text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;