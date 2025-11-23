
import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { Book } from '../types';

interface FeedPostProps {
  book: Book;
  onOpen: (book: Book) => void;
  onToggleLike: (book: Book) => void;
}

export const FeedPost: React.FC<FeedPostProps> = ({ book, onOpen, onToggleLike }) => {
  return (
    <div className="flex flex-col bg-white dark:bg-black mb-4 border-b border-gray-100 dark:border-gray-800 pb-4 last:border-none">
      {/* Post Header */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[1.5px]">
             <img 
                src={book.authorAvatar || `https://ui-avatars.com/api/?name=${book.author}&background=random`} 
                alt={book.author} 
                className="w-full h-full rounded-full object-cover bg-white dark:bg-black p-[1px]"
             />
          </div>
          <div className="flex flex-col">
             <span className="text-sm font-semibold text-gray-900 dark:text-white leading-none">{book.author}</span>
             {book.series && <span className="text-[11px] text-gray-500">{book.series}</span>}
          </div>
        </div>
        <button className="text-gray-900 dark:text-white">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Image/Content */}
      <div 
        className="w-full aspect-[4/5] bg-gray-100 dark:bg-gray-900 overflow-hidden relative cursor-pointer"
        onClick={() => onOpen(book)}
      >
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          className="w-full h-full object-cover"
        />
        {/* Overlay hint */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-medium text-white">
           Ler Agora
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onToggleLike(book)}
            className="hover:scale-110 transition-transform"
          >
            <Heart 
                size={26} 
                className={book.isLiked ? "fill-red-500 text-red-500" : "text-gray-900 dark:text-white"} 
            />
          </button>
          <button className="hover:scale-110 transition-transform">
            <MessageCircle size={26} className="text-gray-900 dark:text-white -rotate-90" />
          </button>
          <button className="hover:scale-110 transition-transform">
            <Send size={26} className="text-gray-900 dark:text-white" />
          </button>
        </div>
        <button className="hover:scale-110 transition-transform">
           <Bookmark size={26} className="text-gray-900 dark:text-white" />
        </button>
      </div>

      {/* Likes & Caption */}
      <div className="px-3 flex flex-col gap-1">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {book.likesCount ? `${book.likesCount} curtidas` : 'Seja o primeiro a curtir'}
        </span>
        
        <div className="text-sm text-gray-900 dark:text-white">
          <span className="font-semibold mr-2">{book.author}</span>
          <span className="text-gray-800 dark:text-gray-200">{book.title}</span>
          <p className="text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 text-[13px]">
            {book.content ? book.content.substring(0, 100).replace(/[\n\r]/g, ' ') : "..."}
            <span className="text-gray-400 dark:text-gray-500 ml-1 cursor-pointer">mais</span>
          </p>
        </div>
        
        <button className="text-gray-500 dark:text-gray-500 text-xs font-medium text-left mt-1">
            Ver todos os {book.commentsCount || 0} comentários
        </button>
        <span className="text-[10px] text-gray-400 uppercase mt-1">Há 2 horas</span>
      </div>
    </div>
  );
};
