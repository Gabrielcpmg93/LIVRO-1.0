
import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { BookSection } from './components/BookSection';
import { FeedPost } from './components/FeedPost';
import { Editor } from './components/Editor';
import { Reader } from './components/Reader';
import { SettingsModal } from './components/SettingsModal';
import { NavTab, Book } from './types';
import { Search } from 'lucide-react';

const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Renovação Social e Imortalidade',
    author: 'grupo_marcos',
    authorAvatar: 'https://picsum.photos/100/100?random=1',
    coverUrl: 'https://picsum.photos/400/500?random=1',
    rating: 5.0,
    likesCount: 1240,
    commentsCount: 45,
    isFree: true,
    series: 'Livro 8',
    isLiked: true,
    content: `CAPÍTULO 1

O sol da manhã iluminava suavemente as colinas, trazendo consigo a promessa de um novo tempo. A sociedade, há muito estagnada em seus velhos costumes, começava a sentir os ventos da mudança soprarem através das ruas de paralelepípedos.`
  },
  {
    id: '2',
    title: 'Vampirização',
    author: 'rev_ezagui',
    authorAvatar: 'https://picsum.photos/100/100?random=2',
    coverUrl: 'https://picsum.photos/400/500?random=2',
    rating: 4.8,
    likesCount: 856,
    commentsCount: 12,
    isFree: true,
    series: 'Livro 2',
    isLiked: false,
    content: `PRÓLOGO

A noite estava densa, e o nevoeiro cobria a cidade como um manto gélido. Poucos ousavam sair de suas casas após o toque de recolher, mas Helena não tinha escolha. Precisava encontrar o remédio para sua mãe.`
  },
  {
    id: '3',
    title: 'Série Pontos Vitais da Evolução',
    author: 'leitura_br',
    authorAvatar: 'https://picsum.photos/100/100?random=3',
    coverUrl: 'https://picsum.photos/400/500?random=3',
    rating: 4.9,
    likesCount: 2300,
    commentsCount: 156,
    price: 4.99,
    isFree: true,
    isLiked: false,
    content: `INTRODUÇÃO

A evolução não é uma linha reta. É uma espiral complexa, repleta de pontos vitais onde decisões cruciais determinam o destino de espécies inteiras. Neste volume, exploraremos os momentos.`
  },
  {
    id: '4',
    title: 'O despertar da Consciência',
    author: 'consciencia_viva',
    authorAvatar: 'https://picsum.photos/100/100?random=4',
    coverUrl: 'https://picsum.photos/400/500?random=4',
    rating: 4.5,
    likesCount: 54,
    commentsCount: 2,
    isFree: true,
    isLiked: false,
    content: `CAPÍTULO ÚNICO

Acordar é fácil. Despertar é o desafio. Todos os dias abrimos os olhos para o mundo físico, mas quantas vezes abrimos os olhos da mente para a realidade que nos cerca?`
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('home'); 
  const [myBooks, setMyBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [viewingBook, setViewingBook] = useState<Book | null>(null);
  
  // Theme & Settings State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('app_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
        setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('app_theme', newTheme);
  };

  const handleSaveBook = (title: string, content: string, coverImage: string | null) => {
    const newBook: Book = {
      id: Date.now().toString(),
      title: title || 'Sem Legenda',
      author: 'voce', // User ID style
      authorAvatar: 'https://ui-avatars.com/api/?name=Voce&background=000&color=fff',
      coverUrl: coverImage || `https://picsum.photos/400/500?random=${Date.now()}`, 
      rating: 5.0,
      isFree: true,
      content: content,
      category: 'Meus Livros',
      isLiked: false,
      likesCount: 0,
      commentsCount: 0
    };

    setMyBooks(prev => [newBook, ...prev]);
    setActiveTab('home');
  };

  const handleToggleLike = (book: Book) => {
    setMyBooks(prevBooks => 
      prevBooks.map(b => {
        if (b.id === book.id) {
            const isLiked = !b.isLiked;
            return { 
                ...b, 
                isLiked,
                likesCount: (b.likesCount || 0) + (isLiked ? 1 : -1)
            };
        }
        return b;
      })
    );
  };

  const renderContent = () => {
    if (activeTab === 'create') {
      return <Editor onSave={handleSaveBook} />;
    }

    if (activeTab === 'home') {
      return (
        <div className="pb-16">
          <TopBar onOpenSettings={() => setShowSettings(true)} />
          <div className="">
              {myBooks.map(book => (
                  <FeedPost 
                    key={book.id} 
                    book={book} 
                    onOpen={setViewingBook}
                    onToggleLike={handleToggleLike}
                  />
              ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'search') {
        return (
            <div className="p-4 pb-20">
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-2 mb-4">
                    <Search size={20} className="text-gray-500 mr-2" />
                    <input 
                        type="text" 
                        placeholder="Pesquisar" 
                        className="bg-transparent w-full outline-none text-gray-800 dark:text-gray-200"
                    />
                </div>
                <div className="grid grid-cols-3 gap-1">
                    {myBooks.map((book, i) => (
                        <div key={i} className="aspect-square relative" onClick={() => setViewingBook(book)}>
                            <img src={book.coverUrl} className="w-full h-full object-cover" />
                        </div>
                    ))}
                    {Array.from({length: 12}).map((_, i) => (
                         <div key={`rand-${i}`} className="aspect-square bg-gray-200 dark:bg-gray-800 relative">
                            <img src={`https://picsum.photos/300/300?random=${i+10}`} className="w-full h-full object-cover" />
                         </div>
                    ))}
                </div>
            </div>
        )
    }

    if (activeTab === 'store') {
        return (
            <div className="pb-20">
              <div className="px-4 py-3 border-b dark:border-gray-800">
                  <h2 className="font-bold text-xl dark:text-white">Loja de Livros</h2>
              </div>
              <div className="pt-4">
                  <BookSection 
                    section={{
                      title: "Destaques",
                      books: myBooks
                    }} 
                    onBookClick={(book) => setViewingBook(book)}
                    onToggleLike={handleToggleLike}
                  />
              </div>
            </div>
        );
    }

    if (activeTab === 'profile') {
        return (
            <div className="pb-20">
                <div className="px-4 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden border-2 border-gray-100 dark:border-gray-800">
                            <img src="https://ui-avatars.com/api/?name=Voce&background=000&color=fff" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex gap-6 text-center">
                            <div><div className="font-bold text-lg dark:text-white">12</div><div className="text-xs text-gray-500">Pubs</div></div>
                            <div><div className="font-bold text-lg dark:text-white">856</div><div className="text-xs text-gray-500">Seguidores</div></div>
                            <div><div className="font-bold text-lg dark:text-white">430</div><div className="text-xs text-gray-500">Seguindo</div></div>
                        </div>
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white">Você</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">Escritor(a) apaixonado(a) por ficção. 📚✨</div>
                    
                    <button 
                        onClick={() => setShowSettings(true)}
                        className="w-full py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-900 dark:text-white mb-6"
                    >
                        Editar Perfil
                    </button>

                    <div className="grid grid-cols-3 gap-1">
                        {myBooks.filter(b => b.author === 'voce').map((book, i) => (
                            <div key={i} className="aspect-square relative bg-gray-100" onClick={() => setViewingBook(book)}>
                                <img src={book.coverUrl} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return null;
  };

  return (
    <div className={`${theme} min-h-screen flex justify-center bg-gray-50 dark:bg-black transition-colors duration-500`}>
        <div className="w-full max-w-md h-[100dvh] bg-white dark:bg-black flex flex-col relative shadow-2xl overflow-hidden transition-colors duration-500">
        
        <main className="flex-1 overflow-y-auto no-scrollbar bg-white dark:bg-black transition-colors duration-500">
            {renderContent()}
        </main>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Overlays */}
        {viewingBook && (
            <Reader book={viewingBook} onBack={() => setViewingBook(null)} />
        )}

        <SettingsModal 
            isOpen={showSettings} 
            onClose={() => setShowSettings(false)}
            isDarkMode={theme === 'dark'}
            toggleTheme={toggleTheme}
        />
        </div>
    </div>
  );
};

export default App;
