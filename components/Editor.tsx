
import React, { useState, useEffect } from 'react';
import { Sparkles, Save, Book, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { generateBookContent, suggestBookTitles } from '../services/geminiService';
import { PAGE_DELIMITER } from '../types';

interface EditorProps {
    onSave?: (title: string, content: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ onSave }) => {
  const [title, setTitle] = useState('');
  // State now holds an array of pages
  const [pages, setPages] = useState<string[]>(['']);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
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
        
        // Load pages or fallback to single page
        const content = parsed.content || '';
        if (content.includes(PAGE_DELIMITER)) {
            setPages(content.split(PAGE_DELIMITER));
        } else {
            setPages([content]);
        }
    }
  }, []);

  const handleSave = () => {
    // Join pages into a single string with the delimiter
    const fullContent = pages.join(PAGE_DELIMITER);
    
    localStorage.setItem('draft_book', JSON.stringify({ title, content: fullContent }));
    if (onSave) {
        onSave(title, fullContent);
    } else {
        alert('Rascunho salvo!');
    }
  };

  const handlePageChange = (index: number) => {
      if (index >= 0 && index < pages.length) {
          setCurrentPageIndex(index);
      }
  };

  const handleAddPage = () => {
      setPages([...pages, '']);
      setCurrentPageIndex(pages.length); // Go to the new page
  };

  const handleDeletePage = () => {
      if (pages.length <= 1) {
          setPages(['']); // Reset if it's the last one
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
    
    // Context includes previous page end and current page so far
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
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
        <div className="flex items-center gap-2">
            <Book className="text-primary" size={24} />
            <h1 className="font-bold text-lg text-gray-800 dark:text-gray-100">Estúdio de Criação</h1>
        </div>
        <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors"
        >
            <Save size={16} />
            Salvar
        </button>
      </div>

      {/* Main Writing Area */}
      <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full">
        
        {/* Only show title input on first page to keep UI clean, or always? Always is better for context. */}
        <input 
            type="text" 
            placeholder="Título do seu livro..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 border-none outline-none mb-6 bg-transparent"
        />

        {suggestedTitles.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <p className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase mb-2">Sugestões de Título (IA)</p>
                <div className="flex flex-wrap gap-2">
                    {suggestedTitles.map((t, i) => (
                        <button 
                            key={i} 
                            onClick={() => { setTitle(t); setSuggestedTitles([]); }}
                            className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>
        )}

        <div className="relative min-h-[50vh]">
            <span className="absolute -top-6 right-0 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Página {currentPageIndex + 1} de {pages.length}
            </span>
            <textarea 
                placeholder={`Escreva o conteúdo da página ${currentPageIndex + 1} aqui...`}
                value={pages[currentPageIndex]}
                onChange={(e) => updateCurrentPageContent(e.target.value)}
                className="w-full h-full min-h-[50vh] resize-none outline-none text-lg text-gray-700 dark:text-gray-300 leading-relaxed placeholder-gray-300 dark:placeholder-gray-600 bg-transparent pb-10"
            />
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 py-2 flex items-center justify-between">
        <button 
            onClick={() => handlePageChange(currentPageIndex - 1)}
            disabled={currentPageIndex === 0}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-30 text-gray-600 dark:text-gray-300"
        >
            <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {currentPageIndex + 1} / {pages.length}
            </span>
            
            {pages.length > 1 && (
                 <button 
                    onClick={handleDeletePage}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    title="Excluir página atual"
                >
                    <Trash2 size={16} />
                </button>
            )}

            <button 
                onClick={handleAddPage}
                className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-primary dark:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
                <Plus size={16} />
                Nova Página
            </button>
        </div>

        <button 
            onClick={() => handlePageChange(currentPageIndex + 1)}
            disabled={currentPageIndex === pages.length - 1}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-30 text-gray-600 dark:text-gray-300"
        >
            <ChevronRight size={20} />
        </button>
      </div>

      {/* AI Toolbar */}
      <div className="border-t dark:border-gray-800 bg-surface dark:bg-gray-800 p-4 sticky bottom-0">
        {!showPrompt ? (
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
                 <button 
                    onClick={() => setShowPrompt(true)}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                    <Sparkles size={18} className="text-purple-600 dark:text-purple-400" />
                    <span className="font-medium text-sm">Escrever com IA</span>
                </button>

                <button 
                    onClick={handleSuggestTitles}
                    disabled={isGenerating}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                    <Book size={18} className="text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-sm">{isGenerating ? 'Pensando...' : 'Sugerir Títulos'}</span>
                </button>
            </div>
        ) : (
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1">
                        <Sparkles size={12} />
                        GEMINI ASSISTANT (Página {currentPageIndex + 1})
                    </span>
                    <button onClick={() => setShowPrompt(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                        <ChevronLeft size={20} />
                    </button>
                </div>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ex: Descreva o protagonista entrando em uma caverna..."
                        className="flex-1 bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-900 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500 text-gray-900 dark:text-white"
                        onKeyDown={(e) => e.key === 'Enter' && handleAIWrite()}
                    />
                    <button 
                        onClick={handleAIWrite}
                        disabled={isGenerating}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium text-sm disabled:opacity-50 hover:bg-purple-700"
                    >
                        {isGenerating ? '...' : 'Gerar'}
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
