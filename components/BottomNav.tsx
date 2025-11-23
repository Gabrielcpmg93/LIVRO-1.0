
import React from 'react';
import { Home, Search, PlusSquare, Heart, User, ShoppingBag } from 'lucide-react';
import { NavTab } from '../types';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Busca' },
    { id: 'create', icon: PlusSquare, label: 'Postar' }, 
    { id: 'store', icon: ShoppingBag, label: 'Loja' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <div className="sticky bottom-0 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 px-6 py-3 z-50 safe-area-bottom">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button 
              key={item.id}
              onClick={() => onTabChange(item.id as NavTab)}
              className="flex flex-col items-center justify-center p-2 transition-transform active:scale-90"
            >
              <Icon 
                  size={item.id === 'create' ? 28 : 26} 
                  strokeWidth={isActive ? 2.8 : 2}
                  className={`${isActive ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
