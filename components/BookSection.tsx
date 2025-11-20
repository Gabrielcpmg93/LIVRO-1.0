import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Book, CategorySection } from '../types';
import { BookCard } from './BookCard';

interface BookSectionProps {
  section: CategorySection;
  onBookClick?: (book: Book) => void;
  onToggleLike?: (book: Book) => void;
}

export const BookSection: React.FC<BookSectionProps> = ({ section, onBookClick, onToggleLike }) => {
  return (
    <div className="mb-6 pl-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pr-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{section.title}</h2>
        <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowRight size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* List */}
      <div className="flex overflow-x-auto no-scrollbar pb-2 pr-5">
        {section.books.map((book) => (
          <BookCard 
            key={book.id} 
            book={book} 
            onClick={onBookClick} 
            onToggleLike={onToggleLike}
          />
        ))}
      </div>
    </div>
  );
};