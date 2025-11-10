import React from 'react';

export function NewsletterSection() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-light mb-4">Stay in the loop</h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">Subscribe for new collections, exclusive offers, and eye-care tips.</p>
        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email"
            className="flex-1 px-5 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:border-white text-sm"
          />
          <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-light hover:bg-gray-100 transition-colors text-sm">
            Subscribe
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-4">By subscribing you agree to our Privacy Policy.</p>
      </div>
    </section>
  );
}

