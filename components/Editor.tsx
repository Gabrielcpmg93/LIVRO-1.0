
import React, { useState, useRef } from 'react';
import { Sparkles, ArrowLeft, Image as ImageIcon, Check } from 'lucide-react';
import { generateBookContent } from '../services/geminiService';

interface EditorProps {
    onSave?: (title: string, content: string, coverImage: string | null) => void;
    onCancel?: () => void;
}

export const Editor: React.FC<EditorProps> = ({ onSave, onCancel }) => {
  const [caption, setCaption] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!coverImage) {
        alert("Escolha uma foto para postar!");
        return;
    }
    // For a photo post, the 'title' acts as the start of the caption, 'content' is the rest
    if (onSave) {
        onSave(caption.split('\n')[0], caption, coverImage);
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

  const handleAIGenerateCaption = async () => {
    if (!coverImage) return;
    setIsGenerating(true);
    
    // Simulating context based on image (in a real app we'd send the image to Gemini Vision)
    const result = await generateBookContent(`Escreva uma legenda curta, criativa e engajadora para uma foto de rede social. Use emojis. Estilo Instagram.`, "");
    
    if (result.text) {
        setCaption(result.text);
    }
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-black z-10">
        <div className="flex items-center gap-3">
            <button onClick={onCancel} className="text-gray-900 dark:text-white p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ArrowLeft size={24} />
            </button>
            <h1 className="font-bold text-lg text-gray-900 dark:text-white">Nova publicação</h1>
        </div>
        <button 
            onClick={handleSave}
            className="bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 px-4 py-1.5 rounded-lg transition-colors shadow-sm active:scale-95"
        >
            Compartilhar
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Image Preview / Upload Area */}
        <div className="w-full aspect-square bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-800 relative group cursor-pointer" onClick={() => !coverImage && fileInputRef.current?.click()}>
            {coverImage ? (
                <>
                    <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg text-xs font-semibold backdrop-blur-md hover:bg-black/80 transition-colors"
                    >
                        Trocar Foto
                    </button>
                </>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                    <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                        <ImageIcon size={32} />
                    </div>
                    <span className="font-semibold text-lg">Selecione uma foto</span>
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

        {/* Caption Input */}
        <div className="p-4">
            <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-800">
                     <img src="https://ui-avatars.com/api/?name=Voce&background=000&color=fff" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                    <textarea 
                        placeholder="Escreva uma legenda..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="w-full min-h-[120px] resize-none outline-none text-base text-gray-900 dark:text-white bg-transparent placeholder-gray-400 leading-relaxed"
                    />
                    
                    <button 
                        onClick={handleAIGenerateCaption}
                        disabled={isGenerating || !coverImage}
                        className="flex items-center gap-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 mt-2 px-3 py-2 rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:shadow-none"
                    >
                        <Sparkles size={14} className={isGenerating ? "animate-spin" : ""} />
                        {isGenerating ? 'Criando legenda...' : 'Gerar legenda com IA'}
                    </button>
                </div>
            </div>
        </div>

        {/* Settings */}
        <div className="border-t border-gray-100 dark:border-gray-800 mt-2">
            <div className="px-4 py-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors">
                <span className="text-gray-900 dark:text-white font-medium">Marcar pessoas</span>
            </div>
            <div className="px-4 py-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors">
                <span className="text-gray-900 dark:text-white font-medium">Adicionar localização</span>
            </div>
        </div>
      </div>
    </div>
  );
};
