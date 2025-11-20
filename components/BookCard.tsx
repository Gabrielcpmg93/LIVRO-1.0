import React from 'react';
import { Book } from '../types';
import { Heart } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick?: (book: Book) => void;
  onToggleLike?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick, onToggleLike }) => {
  return (
    <div 
      className="flex flex-col w-[120px] min-w-[120px] mr-4 cursor-pointer group relative"
      onClick={() => onClick && onClick(book)}
    >
      {/* Book Cover */}
      <div className="relative w-full aspect-[2/3] mb-2 rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 group-hover:shadow-md transition-all">
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Like Button Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent opening the book
            onToggleLike && onToggleLike(book);
          }}
          className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-sm hover:scale-110 transition-transform shadow-sm"
        >
          <Heart 
            size={16} 
            className={book.isLiked ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-300"} 
          />
        </button>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-0.5">
        <h3 className="text-[13px] font-medium text-gray-900 dark:text-gray-200 leading-tight line-clamp-2 group-hover:text-primary dark:group-hover:text-green-400 transition-colors">
          {book.title}
        </h3>
        
        {book.series && (
            <span className="text-[11px] text-gray-500 dark:text-gray-500 line-clamp-1">
                {book.series}
            </span>
        )}
        {!book.series && (
             <span className="text-[11px] text-gray-500 dark:text-gray-500 line-clamp-1">
             Livro 1
         </span>
        )}
      </div>
    </div>
  );
};