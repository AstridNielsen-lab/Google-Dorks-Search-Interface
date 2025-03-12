import React from 'react';
import { Github, Facebook, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-600 text-sm flex items-center justify-center md:justify-start">
              Feito com <Heart className="w-4 h-4 text-red-500 mx-1" /> por Like Look Solutions
            </p>
            <p className="text-gray-400 text-xs mt-1">
              © 2024 Todos os direitos reservados
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/AstridNielsen-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-2"
            >
              <Github size={20} />
              <span className="text-sm">GitHub</span>
            </a>
            <a
              href="https://www.facebook.com/likelooksolutions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-2"
            >
              <Facebook size={20} />
              <span className="text-sm">Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}