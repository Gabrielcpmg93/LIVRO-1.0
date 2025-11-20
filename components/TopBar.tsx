import React from 'react';
import { Search, Mic, Settings } from 'lucide-react';

const TABS = ['E-books', 'Audiolivros', 'HQs', 'Vendas', 'Gêneros', 'Lançamentos'];

interface TopBarProps {
  onOpenSettings: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenSettings }) => {
  return (
    <div className="sticky top-0 bg-white dark:bg-gray-900 z-50 pb-2 shadow-sm dark:shadow-gray-800 transition-colors duration-300">
      {/* Search Row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 relative">
          <div className="flex items-center bg-surface dark:bg-gray-800 rounded-full h-12 px-4 shadow-sm border border-transparent focus-within:border-gray-300 dark:focus-within:border-gray-600 focus-within:bg-white dark:focus-within:bg-gray-800 focus-within:shadow-md transition-all">
            <Search size={20} className="text-gray-500 dark:text-gray-400 mr-3" />
            <input 
              type="text" 
              placeholder="Pesquisar livros" 
              className="bg-transparent flex-1 outline-none text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-500 text-[16px]"
            />
            <Mic size={20} className="text-gray-600 dark:text-gray-400 ml-2 cursor-pointer" />
          </div>
        </div>
        
        <button 
          onClick={onOpenSettings}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
          aria-label="Configurações"
        >
          <Settings size={24} />
        </button>

        <div className="flex-shrink-0 w-9 h-9 bg-green-800 rounded-full flex items-center justify-center text-white font-medium text-sm cursor-pointer select-none shadow-sm">
          C
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 mt-1">
        {TABS.map((tab, index) => (
          <button 
            key={tab}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              index === 0 
                ? 'text-primary border-b-2 border-primary rounded-none px-1 mx-2 dark:text-green-400 dark:border-green-400' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};