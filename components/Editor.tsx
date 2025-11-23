
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Save, Book, ChevronLeft, ChevronRight, Plus, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { generateBookContent, suggestBookTitles } from '../services/geminiService';
import { PAGE_DELIMITER } from '../types';

interface EditorProps {
    onSave?: (title: string, content: string, coverImage: string | null) => void;
}

export const Editor: React.FC<EditorProps> = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [pages, setPages] = useState<string[]>(['']);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);

  // Autosave simulation
  useEffect(() => {
    const saved = localStorage.getItem('draft_book');
    if (saved) {
        const parsed = JSON.parse(saved);
        setTitle(parsed.title || '');
        if(parsed.cover) setCoverImage(parsed.cover);
        
        const content = parsed.content || '';
        if (content.includes(PAGE_DELIMITER)) {
            setPages(content.split(PAGE_DELIMITER));
        } else {
            setPages([content]);
        }
    }
  }, []);

  const handleSave = () => {
    const fullContent = pages.join(PAGE_DELIMITER);
    
    localStorage.setItem('draft_book', JSON.stringify({ title, content: fullContent, cover: coverImage }));
    if (onSave) {
        onSave(title, fullContent, coverImage);
    } else {
        alert('Publicação salva!');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setCoverImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handlePageChange = (index: number) => {
      if (index >= 0 && index < pages.length) {
          setCurrentPageIndex(index);
      }
  };

  const handleAddPage = () => {
      setPages([...pages, '']);
      setCurrentPageIndex(pages.length);
  };

  const handleDeletePage = () => {
      if (pages.length <= 1) {
          setPages(['']);
          return;
      }
      const newPages = pages.filter((_, i) => i !== currentPageIndex);
      setPages(newPages);
      setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
  };

  const updateCurrentPageContent = (newText: string) => {
      const newPages = [...pages];
      newPages[currentPageIndex] = newText;
      setPages(newPages);
  };

  const handleAIWrite = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    
    const currentContent = pages[currentPageIndex];
    const context = (currentPageIndex > 0 ? pages[currentPageIndex - 1].slice(-500) : "") + "\n" + currentContent;

    const result = await generateBookContent(prompt, context);
    if (result.text) {
        updateCurrentPageContent(currentContent + "\n\n" + result.text);
    }
    setIsGenerating(false);
    setShowPrompt(false);
    setPrompt('');
  };

  const handleSuggestTitles = async () => {
      setIsGenerating(true);
      const fullContext = pages.join(' ').substring(0, 500);
      const titles = await suggestBookTitles(fullContext || "Uma história de aventura e mistério");
      setSuggestedTitles(titles);
      setIsGenerating(false);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black transition-colors duration-300">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-800 sticky top-0 bg-white dark:bg-black z-10">
        <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-gray-900 dark:text-white">Nova Publicação</h1>
        </div>
        <button 
            onClick={handleSave}
            className="text-blue-500 font-semibold text-base hover:text-blue-600"
        >
            Compartilhar
        </button>
      </div>

      {/* Main Writing Area */}
      <div className="flex-1 overflow-y-auto p-4 max-w-3xl mx-auto w-full">
        
        {/* Image Upload Section */}
        <div className="mb-6">
            {!coverImage ? (
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-48 bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors gap-2"
                >
                    <ImageIcon size={32} />
                    <span className="text-sm font-medium">Adicionar Foto / Capa</span>
                </button>
            ) : (
                <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden group">
                    <img src={coverImage} alt="Capa" className="w-full h-full object-cover" />
                    <button 
                        onClick={() => setCoverImage(null)}
                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
            />
        </div>

        <input 
            type="text" 
            placeholder="Escreva uma legenda ou título..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 border-none outline-none mb-4 bg-transparent"
        />

        {suggestedTitles.length > 0 && (
            <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Ideias</p>
                <div className="flex flex-wrap gap-2">
                    {suggestedTitles.map((t, i) => (
                        <button 
                            key={i} 
                            onClick={() => { setTitle(t); setSuggestedTitles([]); }}
                            className="bg-white dark:bg-black px-3 py-1 rounded-full text-xs border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>
        )}

        <div className="relative min-h-[30vh]">
            <textarea 
                placeholder="Escreva sua história aqui..."
                value={pages[currentPageIndex]}
                onChange={(e) => updateCurrentPageContent(e.target.value)}
                className="w-full h-full min-h-[30vh] resize-none outline-none text-base text-gray-800 dark:text-gray-200 leading-relaxed placeholder-gray-400 bg-transparent pb-10"
            />
        </div>
      </div>

      {/* Pagination Controls (Simplified for Insta-style) */}
      <div className="border-t dark:border-gray-800 bg-gray-50 dark:bg-black px-4 py-2 flex items-center justify-between">
        <button onClick={() => handlePageChange(currentPageIndex - 1)} disabled={currentPageIndex === 0} className="text-gray-500 disabled:opacity-30"><ChevronLeft size={20} /></button>
        <span className="text-xs text-gray-500">Página {currentPageIndex + 1}</span>
        <div className="flex gap-2">
            <button onClick={handleAddPage} className="text-blue-500"><Plus size={20} /></button>
            <button onClick={handleDeletePage} className="text-red-500"><Trash2 size={20} /></button>
        </div>
        <button onClick={() => handlePageChange(currentPageIndex + 1)} disabled={currentPageIndex === pages.length - 1} className="text-gray-500 disabled:opacity-30"><ChevronRight size={20} /></button>
      </div>

      {/* AI Toolbar */}
      <div className="border-t dark:border-gray-800 bg-white dark:bg-black p-3 sticky bottom-0">
        {!showPrompt ? (
            <div className="flex gap-3">
                 <button onClick={() => setShowPrompt(true)} className="flex-1 py-2 bg-gray-100 dark:bg-gray-900 rounded-lg text-gray-600 dark:text-gray-300 text-sm font-medium flex justify-center items-center gap-2">
                    <Sparkles size={16} /> AI Magic
                </button>
            </div>
        ) : (
            <div className="flex items-center gap-2">
                <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="O que escrever?"
                    className="flex-1 bg-gray-100 dark:bg-gray-900 rounded-full px-4 py-2 text-sm outline-none dark:text-white"
                />
                <button onClick={handleAIWrite} className="text-blue-500 font-medium text-sm p-2">
                    {isGenerating ? '...' : 'Gerar'}
                </button>
                <button onClick={() => setShowPrompt(false)}><X size={18} className="text-gray-500" /></button>
            </div>
        )}
      </div>
    </div>
  );
};
