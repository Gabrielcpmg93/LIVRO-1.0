
import React from 'react';
import { Book } from '../types';
import { Star } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick?: (book: Book) => void;
  onToggleLike?: (book: Book) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick, size = 'md' }) => {
  const widthClass = size === 'sm' ? 'w-[100px]' : size === 'lg' ? 'w-[160px]' : 'w-[130px]';
  const titleSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div 
      className={`flex flex-col ${widthClass} flex-shrink-0 mr-5 cursor-pointer group snap-start`}
      onClick={() => onClick && onClick(book)}
    >
      {/* Book Cover with Realistic Shadow */}
      <div className="relative w-full aspect-[2/3] mb-3 rounded-md overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1">
        <h3 className={`${titleSize} font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2`}>
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {book.author}
        </p>
        
        {/* Rating or Info */}
        <div className="flex items-center gap-1 mt-0.5">
            <Star size={10} className="text-yellow-400 fill-current" />
            <span className="text-[10px] font-medium text-gray-400">{book.rating}</span>
        </div>
      </div>
    </div>
  );
};
