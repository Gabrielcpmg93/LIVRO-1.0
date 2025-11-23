
import React from 'react';
import { House, Search, PlusSquare, ShoppingBag, User } from 'lucide-react';
import { NavTab } from '../types';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  
  const navItems = [
    { id: 'home', icon: House },
    { id: 'search', icon: Search },
    { id: 'create', icon: PlusSquare }, // Destaque para criação
    { id: 'store', icon: ShoppingBag },
    { id: 'profile', icon: User },
  ];

  return (
    <div className="sticky bottom-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 px-4 pb-2 pt-3 flex justify-between items-center z-50 safe-area-bottom transition-colors duration-300">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;
        
        return (
          <button 
            key={item.id}
            onClick={() => onTabChange(item.id as NavTab)}
            className="flex flex-col items-center justify-center w-12 h-10 group"
          >
            <Icon 
                size={item.id === 'create' ? 28 : 26} 
                className={`${isActive ? 'text-black dark:text-white fill-current' : 'text-gray-500 dark:text-gray-400'}`} 
                strokeWidth={isActive ? 2.5 : 1.8}
                fill={isActive && item.id !== 'search' && item.id !== 'create' ? "currentColor" : "none"} // Search e Create geralmente não têm fill total
            />
          </button>
        );
      })}
    </div>
  );
};
