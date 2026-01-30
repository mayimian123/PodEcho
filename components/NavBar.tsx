import React from 'react';
import { Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NavBar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-parchment/90 backdrop-blur-sm border-b border-platinum h-16 flex items-center justify-between px-6 lg:px-12">
      <Link to="/" className="flex items-center gap-2 group">
        <Radio className="w-8 h-8 text-toffee-brown group-hover:scale-110 transition-transform" />
        <span className="font-serif font-bold text-xl text-deep-space-blue">PodEcho</span>
      </Link>
      <div className="flex items-center gap-4">
        {/* Placeholder for future nav items */}
        <button className="text-sm font-medium text-slate-grey hover:text-toffee-brown transition-colors">
          Browse Podcasts
        </button>
      </div>
    </nav>
  );
};
