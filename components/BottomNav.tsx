import React from 'react';
import { Grid, Search, BookOpen, PenTool } from 'lucide-react';
import { NavTab } from '../types';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  
  const navItems = [
    { id: 'write', label: 'Escrever', icon: PenTool },
    { id: 'apps', label: 'Apps', icon: Grid },
    { id: 'search', label: 'Pesquisa', icon: Search },
    { id: 'books', label: 'Livros', icon: BookOpen },
  ];

  return (
    <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-2 pb-1 pt-2 flex justify-around items-center z-50 safe-area-bottom transition-colors duration-300">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;
        
        return (
          <button 
            key={item.id}
            onClick={() => onTabChange(item.id as NavTab)}
            className="flex flex-col items-center justify-center w-16 py-1 group"
          >
            <div className={`mb-1 rounded-full py-1 px-4 transition-colors ${isActive ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-transparent group-hover:bg-gray-50 dark:group-hover:bg-gray-800'}`}>
                 <Icon 
                    size={24} 
                    className={`${isActive ? 'text-blue-900 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} 
                    strokeWidth={isActive ? 2.5 : 2}
                />
            </div>
            <span className={`text-[12px] font-medium ${isActive ? 'text-gray-900 dark:text-gray-200' : 'text-gray-500 dark:text-gray-500'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};