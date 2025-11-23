
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
            <button onClick={onCancel} className="text-gray-900 dark:text-white">
                <ArrowLeft size={24} />
            </button>
            <h1 className="font-bold text-lg text-gray-900 dark:text-white">Nova publicação</h1>
        </div>
        <button 
            onClick={handleSave}
            className="text-blue-500 font-semibold text-base hover:text-blue-600 px-2"
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
                        className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md"
                    >
                        Trocar Foto
                    </button>
                </>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
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
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                     <img src="https://ui-avatars.com/api/?name=Voce&background=000&color=fff" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                    <textarea 
                        placeholder="Escreva uma legenda..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="w-full min-h-[100px] resize-none outline-none text-base text-gray-900 dark:text-white bg-transparent placeholder-gray-400"
                    />
                    
                    <button 
                        onClick={handleAIGenerateCaption}
                        disabled={isGenerating || !coverImage}
                        className="flex items-center gap-2 text-xs font-medium text-purple-600 dark:text-purple-400 mt-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 w-fit px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                    >
                        <Sparkles size={14} />
                        {isGenerating ? 'Criando legenda...' : 'Gerar legenda com IA'}
                    </button>
                </div>
            </div>
        </div>

        {/* Settings */}
        <div className="border-t border-gray-100 dark:border-gray-800">
            <div className="px-4 py-3 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-900 dark:text-white font-medium">Marcar pessoas</span>
            </div>
            <div className="px-4 py-3 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-900 dark:text-white font-medium">Adicionar localização</span>
            </div>
        </div>
      </div>
    </div>
  );
};
