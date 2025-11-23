
import React from 'react';
import { Compass, Search, PenTool, ShoppingBag, Library } from 'lucide-react';
import { NavTab } from '../types';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  
  const navItems = [
    { id: 'home', icon: Compass, label: 'Explorar' },
    { id: 'search', icon: Search, label: 'Busca' },
    { id: 'create', icon: PenTool, label: 'Escrever' }, 
    { id: 'store', icon: ShoppingBag, label: 'Loja' },
    { id: 'profile', icon: Library, label: 'Estante' },
  ];

  return (
    <div className="sticky bottom-0 bg-white/95 dark:bg-black/95 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 px-6 pb-4 pt-3 z-50 safe-area-bottom transition-colors duration-300 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button 
              key={item.id}
              onClick={() => onTabChange(item.id as NavTab)}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                  isActive ? 'text-primary scale-110' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <Icon 
                  size={isActive ? 24 : 22} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className="transition-all"
              />
              <span className={`text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-0 scale-0 hidden'} transition-all`}>
                  {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
