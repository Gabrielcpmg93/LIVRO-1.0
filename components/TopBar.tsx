
import React from 'react';
import { Send, Heart } from 'lucide-react';

interface TopBarProps {
  onOpenSettings?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenSettings }) => {
  return (
    <div className="sticky top-0 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800 z-50 px-4 py-3 flex items-center justify-between">
      {/* Logo Style Typography */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-serif tracking-tight cursor-pointer">
          Livreiro Social
      </h1>

      <div className="flex items-center gap-5">
        <button className="relative text-gray-900 dark:text-white hover:opacity-70 transition-opacity">
            <Heart size={24} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black"></span>
        </button>
        <button className="relative text-gray-900 dark:text-white hover:opacity-70 transition-opacity">
            <Send size={24} className="rotate-0" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] flex items-center justify-center rounded-full font-bold border-2 border-white dark:border-black">3</span>
        </button>
      </div>
    </div>
  );
};
