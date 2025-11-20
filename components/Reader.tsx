import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ArrowLeft, Play, Pause, Loader2, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Book, PAGE_DELIMITER } from '../types';
import { generateBookAudio } from '../services/geminiService';

interface ReaderProps {
  book: Book;
  onBack: () => void;
}

export const Reader: React.FC<ReaderProps> = ({ book, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
  // Split content into pages
  const pages = useMemo(() => {
      if (!book.content) return [];
      return book.content.split(PAGE_DELIMITER);
  }, [book.content]);

  const currentPageContent = pages[currentPageIndex] || "";

  // Audio References
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);

  // Stop audio when page changes
  useEffect(() => {
      stopAudio();
      // Reset buffer so we fetch new audio for new page
      audioBufferRef.current = null; 
  }, [currentPageIndex]);

  // Initialize AudioContext on mount (suspended)
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const stopAudio = () => {
    if (sourceNodeRef.current) {
        try {
            sourceNodeRef.current.stop();
        } catch (e) {
            // Ignore if already stopped
        }
        sourceNodeRef.current = null;
    }
    setIsPlaying(false);
    pauseTimeRef.current = 0;
  };

  const playAudio = async () => {
    // Immediate UI feedback
    setIsLoadingAudio(true); 

    // 1. Init Context if needed
    if (!audioContextRef.current) {
        // FIX: Do not force sampleRate: 24000 here. Let the browser decide (usually 44.1k or 48k).
        // The decodeAudioData function will create a buffer with 24k, and the context will resample it automatically.
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Resume context immediately to satisfy browser autoplay policies
    if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
    }

    // 2. Fetch Audio if we don't have the buffer yet (or if we changed pages)
    if (!audioBufferRef.current) {
        if (!currentPageContent) {
            setIsLoadingAudio(false);
            return;
        }
        
        // Generate audio for JUST the current page
        const buffer = await generateBookAudio(currentPageContent, audioContextRef.current);
        
        if (!buffer) {
            setIsLoadingAudio(false);
            alert("Não foi possível gerar o áudio.");
            return;
        }
        audioBufferRef.current = buffer;
    }

    // 3. Play
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.connect(audioContextRef.current.destination);
    
    // Handle start time for pause/resume
    const offset = pauseTimeRef.current % (audioBufferRef.current.duration || 1);
    source.start(0, offset);
    startTimeRef.current = audioContextRef.current.currentTime - offset;

    source.onended = () => {
        setIsPlaying(false);
        pauseTimeRef.current = 0;
    };

    sourceNodeRef.current = source;
    
    // Ready to play
    setIsLoadingAudio(false);
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    if (sourceNodeRef.current && audioContextRef.current) {
        sourceNodeRef.current.stop();
        pauseTimeRef.current = audioContextRef.current.currentTime - startTimeRef.current;
        sourceNodeRef.current = null;
        setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
        pauseAudio();
    } else {
        playAudio();
    }
  };

  const handleNextPage = () => {
      if (currentPageIndex < pages.length - 1) {
          setCurrentPageIndex(prev => prev + 1);
      }
  };

  const handlePrevPage = () => {
      if (currentPageIndex > 0) {
          setCurrentPageIndex(prev => prev - 1);
      }
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-[60] flex flex-col animate-in slide-in-from-right duration-200 transition-colors duration-500">
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900 sticky top-0 z-10 transition-colors duration-500">
        <div className="flex items-center gap-3 overflow-hidden">
            <button onClick={() => { stopAudio(); onBack(); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors shrink-0">
                <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
            </button>
            <div className="flex flex-col overflow-hidden">
                 <h2 className="font-semibold text-lg truncate text-gray-900 dark:text-white leading-tight">{book.title}</h2>
                 <span className="text-xs text-gray-500 dark:text-gray-400">Página {currentPageIndex + 1} de {Math.max(1, pages.length)}</span>
            </div>
        </div>
        
        <button 
            onClick={toggleAudio}
            disabled={isLoadingAudio}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all ${
                isPlaying 
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
                : 'bg-primary text-white hover:bg-green-700'
            }`}
        >
            {isLoadingAudio ? (
                <Loader2 size={18} className="animate-spin" />
            ) : isPlaying ? (
                <Pause size={18} fill="currentColor" />
            ) : (
                <Play size={18} fill="currentColor" />
            )}
            <span className="hidden sm:inline">{isPlaying ? 'Pausar' : 'Ler Página'}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24 bg-white dark:bg-gray-900 transition-colors duration-500">
        <div className="max-w-2xl mx-auto min-h-[60vh]">
            {/* Book Header only on Page 1 */}
            {currentPageIndex === 0 && (
                <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-top-4">
                    <div className="w-32 h-48 rounded-md shadow-lg overflow-hidden mb-4 relative group">
                        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                        {isPlaying && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Volume2 size={32} className="text-white animate-pulse" />
                            </div>
                        )}
                    </div>
                    <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">{book.title}</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{book.author}</p>
                </div>
            )}
            
            <div className="prose prose-lg max-w-none text-gray-800 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-serif animate-in fade-in duration-500">
                {currentPageContent || (
                    <div className="text-gray-400 dark:text-gray-600 italic text-center mt-10">
                        Página em branco.
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t dark:border-gray-800 flex items-center justify-between max-w-md mx-auto w-full sm:max-w-full sm:px-10">
            <button 
                onClick={handlePrevPage}
                disabled={currentPageIndex === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 text-gray-700 dark:text-gray-200 transition-colors"
            >
                <ChevronLeft size={20} />
                <span className="font-medium">Anterior</span>
            </button>

            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {currentPageIndex + 1} / {Math.max(1, pages.length)}
            </span>

            <button 
                onClick={handleNextPage}
                disabled={currentPageIndex >= pages.length - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 text-gray-700 dark:text-gray-200 transition-colors"
            >
                <span className="font-medium">Próxima</span>
                <ChevronRight size={20} />
            </button>
      </div>
    </div>
  );
};