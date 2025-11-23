
import React from 'react';
import { Heart, MessageCircle, Plus } from 'lucide-react';

interface TopBarProps {
  onOpenSettings?: () => void;
}

const STORIES = [
  { name: 'Seu story', img: 'https://picsum.photos/100/100?random=99', isMe: true },
  { name: 'marcos_grp', img: 'https://picsum.photos/100/100?random=1' },
  { name: 'rev_ezagui', img: 'https://picsum.photos/100/100?random=2' },
  { name: 'leitura_br', img: 'https://picsum.photos/100/100?random=3' },
  { name: 'book_club', img: 'https://picsum.photos/100/100?random=4' },
  { name: 'editora_x', img: 'https://picsum.photos/100/100?random=5' },
];

export const TopBar: React.FC<TopBarProps> = ({ onOpenSettings }) => {
  return (
    <div className="sticky top-0 bg-white dark:bg-black z-50 shadow-sm dark:border-b dark:border-gray-800 transition-colors duration-300">
      {/* Header Row */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo Text (Instagram Style) */}
        <h1 className="text-2xl font-bold text-black dark:text-white" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.5px' }}>
          Livreiro
        </h1>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <button className="relative text-black dark:text-white hover:opacity-70 transition-opacity">
            <Heart size={24} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black"></span>
          </button>
          <button className="relative text-black dark:text-white hover:opacity-70 transition-opacity">
            <MessageCircle size={24} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
              3
            </span>
          </button>
        </div>
      </div>

      {/* Stories Row */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-3 border-b border-gray-100 dark:border-gray-800">
        {STORIES.map((story, index) => (
          <div key={index} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
            <div className={`p-[2px] rounded-full ${story.isMe ? 'bg-transparent' : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500'}`}>
              <div className="p-[2px] bg-white dark:bg-black rounded-full relative">
                <img 
                  src={story.img} 
                  alt={story.name} 
                  className="w-16 h-16 rounded-full object-cover"
                />
                {story.isMe && (
                   <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white dark:border-black">
                     <Plus size={12} />
                   </div>
                )}
              </div>
            </div>
            <span className="text-[11px] text-gray-900 dark:text-gray-200 truncate w-16 text-center">
              {story.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
