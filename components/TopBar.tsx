
import React from 'react';
import { Bell } from 'lucide-react';

interface TopBarProps {
  onOpenSettings?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenSettings }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-md z-50 transition-colors duration-300 px-5 py-4">
      <div className="flex items-center justify-between">
        <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {greeting}, Leitor
            </span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight font-serif tracking-tight">
                Livreiro AI
            </h1>
        </div>

        <button 
            onClick={onOpenSettings}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
            <Bell size={20} />
        </button>
      </div>
    </div>
  );
};
