
import React from 'react';
import { Send, Heart } from 'lucide-react';

interface TopBarProps {
  onOpenSettings?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenSettings }) => {
  return (
    <div className="sticky top-0 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800 z-50 px-4 py-3 flex items-center justify-between">
      {/* Logo Style Typography */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-serif tracking-tight cursor-pointer select-none">
          Livreiro Social
      </h1>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-900 dark:text-white hover:opacity-60 transition-opacity active:scale-95">
            <Heart size={26} strokeWidth={2} />
            <span className="absolute top-0.5 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black pointer-events-none"></span>
        </button>
        <button className="relative text-gray-900 dark:text-white hover:opacity-60 transition-opacity active:scale-95">
            <Send size={26} strokeWidth={2} className="rotate-0" />
            <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold border-2 border-white dark:border-black pointer-events-none">3</span>
        </button>
      </div>
    </div>
  );
};
