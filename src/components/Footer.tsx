import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-black border-t border-emerald-500/20 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gray-400 flex items-center justify-center gap-2">
            Made with <Heart className="text-emerald-400" size={16} fill="currentColor" /> using React, Three.js & Tailwind CSS
          </p>
          <p className="text-gray-500 mt-2">
            © 2025 All rights reserved.
          </p>
          <p className="text-gray-600 mt-2">
            <a 
              href="/admin" 
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/admin');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="hover:text-emerald-400 transition-colors"
            >
              Admin
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
