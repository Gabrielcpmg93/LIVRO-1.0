
import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { Book } from '../types';

interface FeedPostProps {
  book: Book;
  onOpen: (book: Book) => void;
  onToggleLike: (book: Book) => void;
}

export const FeedPost: React.FC<FeedPostProps> = ({ book, onOpen, onToggleLike }) => {
  const [isLikedAnim, setIsLikedAnim] = useState(false);

  const handleLike = () => {
    onToggleLike(book);
    setIsLikedAnim(true);
    setTimeout(() => setIsLikedAnim(false), 300);
  };

  return (
    <div className="flex flex-col bg-white dark:bg-black mb-2 pb-2">
      {/* Post Header */}
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[1.5px] cursor-pointer">
             <img 
                src={book.authorAvatar || `https://ui-avatars.com/api/?name=${book.author}&background=random`} 
                alt={book.author} 
                className="w-full h-full rounded-full object-cover bg-white dark:bg-black p-[1px]"
             />
          </div>
          <div className="flex flex-col justify-center">
             <span className="text-sm font-semibold text-gray-900 dark:text-white leading-none cursor-pointer hover:underline">
                {book.author.toLowerCase().replace(/\s/g, '_')}
             </span>
             {book.category && <span className="text-[11px] text-gray-500 dark:text-gray-400">{book.category}</span>}
          </div>
        </div>
        <button className="text-gray-900 dark:text-white">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Image (Photo) */}
      <div 
        className="w-full relative cursor-pointer group bg-gray-100 dark:bg-gray-900"
        onDoubleClick={handleLike}
      >
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          className="w-full h-auto object-cover max-h-[600px] min-h-[300px]"
          loading="lazy"
        />
        
        {/* Heart Animation Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${isLikedAnim ? 'opacity-100' : 'opacity-0'}`}>
            <Heart size={100} className="fill-white text-white drop-shadow-lg animate-ping" />
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLike}
            className="hover:opacity-60 transition-opacity"
          >
            <Heart 
                size={26} 
                className={book.isLiked ? "fill-red-500 text-red-500" : "text-gray-900 dark:text-white"} 
            />
          </button>
          <button onClick={() => onOpen(book)} className="hover:opacity-60 transition-opacity">
            <MessageCircle size={26} className="text-gray-900 dark:text-white -rotate-90" />
          </button>
          <button className="hover:opacity-60 transition-opacity">
            <Send size={26} className="text-gray-900 dark:text-white" />
          </button>
        </div>
        <button className="hover:opacity-60 transition-opacity">
           <Bookmark size={26} className="text-gray-900 dark:text-white" />
        </button>
      </div>

      {/* Likes & Caption */}
      <div className="px-3 flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {book.likesCount ? `${book.likesCount.toLocaleString()} curtidas` : 'Seja o primeiro a curtir'}
        </span>
        
        <div className="text-sm text-gray-900 dark:text-white leading-tight">
          <span className="font-semibold mr-2">{book.author.toLowerCase().replace(/\s/g, '_')}</span>
          <span className="text-gray-800 dark:text-gray-200">{book.title}</span> 
          {book.content && (
              <span className="text-gray-600 dark:text-gray-400 font-normal ml-1">
                 - {book.content.substring(0, 60).replace(/[\n\r]/g, ' ')}...
              </span>
          )}
        </div>
        
        <button 
            onClick={() => onOpen(book)}
            className="text-gray-500 dark:text-gray-500 text-sm font-normal text-left"
        >
            Ver todos os {book.commentsCount || 0} comentários
        </button>
        <span className="text-[10px] text-gray-400 uppercase tracking-wide">Há 2 horas</span>
      </div>
    </div>
  );
};
