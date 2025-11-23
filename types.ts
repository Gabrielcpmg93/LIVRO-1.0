
export interface Book {
  id: string;
  title: string;
  author: string;
  authorAvatar?: string; // Avatar do autor
  coverUrl: string;
  rating: number;
  likesCount?: number; // Quantidade de likes visual
  commentsCount?: number; // Quantidade de comentários visual
  price?: number;
  isFree?: boolean;
  category?: string;
  series?: string;
  content?: string;
  isLiked?: boolean; // Estado do like
}

export interface CategorySection {
  title: string;
  books: Book[];
}

export type NavTab = 'home' | 'search' | 'create' | 'store' | 'profile';

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export const PAGE_DELIMITER = '\n\n<!-- PAGE_BREAK -->\n\n';
