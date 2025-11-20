export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  rating: number;
  price?: number;
  isFree?: boolean;
  category?: string;
  series?: string;
  content?: string;
  isLiked?: boolean; // New property for favorites
}

export interface CategorySection {
  title: string;
  books: Book[];
}

export type NavTab = 'games' | 'apps' | 'search' | 'books' | 'write';

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}