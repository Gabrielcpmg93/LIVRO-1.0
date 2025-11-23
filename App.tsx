import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { FeedPost } from './components/FeedPost';
import { Editor } from './components/Editor';
import { SettingsModal } from './components/SettingsModal';
import { NavTab, Book } from './types';
import { Search, Grid, Bookmark, UserCheck, Menu, PlusSquare, ArrowLeft } from 'lucide-react';

const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Pôr do sol incrível hoje! 🌅',
    author: 'Marcos_Viajante',
    authorAvatar: 'https://picsum.photos/id/1011/100/100',
    coverUrl: 'https://picsum.photos/id/1015/800/800', // Landscape/Squareish
    rating: 5.0,
    likesCount: 1240,
    commentsCount: 45,
    isFree: true,
    series: 'Viagens',
    category: 'Lifestyle',
    isLiked: true,
    content: `A natureza nunca decepciona. Depois de uma longa caminhada, essa vista fez tudo valer a pena. #nature #travel #peace`
  },
  {
    id: '2',
    title: 'Café da manhã dos campeões ☕️',
    author: 'Foodie_Life',
    authorAvatar: 'https://picsum.photos/id/1027/100/100',
    coverUrl: 'https://picsum.photos/id/1060/800/1000', // Portrait
    rating: 4.8,
    likesCount: 856,
    commentsCount: 12,
    isFree: true,
    series: 'Gastronomia',
    category: 'Comida',
    isLiked: false,
    content: `Começando o dia com energia! Panquecas, frutas e muito café. Qual o seu café da manhã preferido? 👇`
  },
  {
    id: '3',
    title: 'Novo setup de trabalho 💻',
    author: 'Tech_Guru',
    authorAvatar: 'https://picsum.photos/id/1/100/100',
    coverUrl: 'https://picsum.photos/id/1/800/800',
    rating: 4.9,
    likesCount: 2300,
    commentsCount: 156,
    isFree: true,
    category: 'Tech',
    isLiked: false,
    content: `Minimalismo é a chave para a produtividade. O que acharam do novo teclado mecânico?`
  },
  {
    id: '4',
    title: 'Arte urbana em SP 🎨',
    author: 'Urban_Art',
    authorAvatar: 'https://picsum.photos/id/103/100/100',
    coverUrl: 'https://picsum.photos/id/103/800/1200',
    rating: 4.5,
    likesCount: 54,
    commentsCount: 2,
    isFree: true,
    category: 'Arte',
    isLiked: false,
    content: `Caminhando pelo centro e encontrei essa obra prima.`
  }
];

export const App: React.FC = () => {
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

  const handleSavePost = (title: string, content: string, coverImage: string | null) => {
    const newBook: Book = {
      id: Date.now().toString(),
      title: title || 'Nova Foto',
      author: 'voce_oficial', 
      authorAvatar: 'https://ui-avatars.com/api/?name=Voce&background=000&color=fff',
      coverUrl: coverImage || `https://picsum.photos/400/500?random=${Date.now()}`, 
      rating: 5.0,
      isFree: true,
      content: content,
      category: 'Feed',
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
            return { 
                ...b, 
                isLiked: !b.isLiked,
                likesCount: b.isLiked ? (b.likesCount || 0) - 1 : (b.likesCount || 0) + 1
            };
        }
        return b;
      })
    );
  };

  // Helper to get the latest state of the viewing book (so likes update in real time in the modal)
  const currentViewBook = viewingBook ? (myBooks.find(b => b.id === viewingBook.id) || viewingBook) : null;

  const renderContent = () => {
    if (activeTab === 'create') {
      return <Editor onSave={handleSavePost} onCancel={() => setActiveTab('home')} />;
    }

    if (activeTab === 'home') {
      return (
        <div className="pb-10">
          <TopBar onOpenSettings={() => setShowSettings(true)} />
          
          <div className="flex flex-col">
              {/* Stories Bar (Optional touch) */}
              <div className="flex gap-4 p-4 overflow-x-auto no-scrollbar border-b border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col items-center gap-1 cursor-pointer group">
                      <div className="w-16 h-16 rounded-full border-2 border-gray-300 dark:border-gray-700 p-0.5 group-hover:border-gray-400 transition-colors">
                          <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-2xl font-light dark:text-white text-gray-400">+</div>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Seu story</span>
                  </div>
                  {[1,2,3,4,5].map(i => (
                       <div key={i} className="flex flex-col items-center gap-1 cursor-pointer">
                        <div className="w-16 h-16 rounded-full border-2 border-pink-500 p-0.5">
                             <img src={`https://picsum.photos/id/${100+i}/100/100`} className="w-full h-full rounded-full object-cover" />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 w-16 truncate text-center">user_{i}</span>
                    </div>
                  ))}
              </div>

              {/* Feed List */}
              <div className="flex flex-col">
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
        </div>
      );
    }

    if (activeTab === 'search') {
        return (
            <div className="pb-20">
                <div className="sticky top-0 bg-white dark:bg-black z-10 px-4 py-3">
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                        <Search size={18} className="text-gray-500 mr-2" />
                        <input 
                            type="text" 
                            placeholder="Pesquisar" 
                            className="bg-transparent w-full outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-0.5">
                    {[...myBooks, ...myBooks, ...myBooks].map((book, i) => (
                         <div 
                            key={i} 
                            onClick={() => setViewingBook(book)} 
                            className="aspect-square bg-gray-200 dark:bg-gray-800 cursor-pointer overflow-hidden relative group"
                        >
                             <img src={book.coverUrl} className="w-full h-full object-cover" />
                             {/* Hover effect for desktop, but subtle */}
                             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                         </div>
                    ))}
                </div>
            </div>
        )
    }

    if (activeTab === 'store') {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] p-8 text-center">
                <div className="w-24 h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                    <Bookmark size={40} className="text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Loja em breve</h2>
                <p className="text-gray-500 mt-2 max-w-xs">Aqui você poderá comprar filtros exclusivos e produtos dos seus criadores favoritos.</p>
                <button className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                    Ser notificado
                </button>
            </div>
        );
    }

    if (activeTab === 'profile') {
        return (
            <div className="pb-20 bg-white dark:bg-black min-h-screen">
                <div className="px-4 py-3 flex justify-between items-center sticky top-0 bg-white dark:bg-black z-10">
                     <h2 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-1">
                        voce_oficial <span className="w-2 h-2 rounded-full bg-red-500" />
                     </h2>
                     <div className="flex gap-4">
                        <PlusSquare size={24} className="text-gray-900 dark:text-white hover:opacity-70 cursor-pointer" />
                        <Menu size={24} className="text-gray-900 dark:text-white cursor-pointer hover:opacity-70" onClick={() => setShowSettings(true)} />
                     </div>
                </div>

                <div className="px-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
                            <img src="https://ui-avatars.com/api/?name=Voce&background=000&color=fff" className="w-full h-full rounded-full object-cover border-2 border-white dark:border-black" />
                        </div>
                        <div className="flex flex-1 justify-around text-center ml-4">
                             <div>
                                 <span className="block font-bold text-lg text-gray-900 dark:text-white">12</span>
                                 <span className="text-sm text-gray-500">Posts</span>
                             </div>
                             <div>
                                 <span className="block font-bold text-lg text-gray-900 dark:text-white">1.2K</span>
                                 <span className="text-sm text-gray-500">Seguidores</span>
                             </div>
                             <div>
                                 <span className="block font-bold text-lg text-gray-900 dark:text-white">340</span>
                                 <span className="text-sm text-gray-500">Seguindo</span>
                             </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <span className="font-bold text-gray-900 dark:text-white block">Você</span>
                        <p className="text-sm text-gray-700 dark:text-gray-300">📸 Fotógrafo & Leitor<br/>📍 São Paulo, BR<br/>🔗 meulink.bio</p>
                    </div>

                    <div className="flex gap-2">
                        <button className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-semibold py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Editar Perfil</button>
                        <button className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-semibold py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Compartilhar</button>
                        <button className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-2.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><UserCheck size={18}/></button>
                    </div>
                </div>

                {/* Highlights */}
                <div className="flex px-4 gap-4 overflow-x-auto no-scrollbar mb-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
                             <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1">
                                <div className="w-full h-full bg-gray-300 dark:bg-gray-700 rounded-full" />
                             </div>
                             <span className="text-xs text-gray-900 dark:text-white">Destaque {i}</span>
                        </div>
                    ))}
                </div>

                {/* Tab Selector */}
                <div className="flex border-t border-gray-100 dark:border-gray-800">
                    <button className="flex-1 py-2.5 flex justify-center border-b-[1.5px] border-black dark:border-white">
                        <Grid size={24} className="text-black dark:text-white" />
                    </button>
                    <button className="flex-1 py-2.5 flex justify-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                        <Bookmark size={24} className="text-gray-400" />
                    </button>
                    <button className="flex-1 py-2.5 flex justify-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                         <UserCheck size={24} className="text-gray-400" />
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-3 gap-0.5">
                     {myBooks.filter(b => b.author === 'voce_oficial' || true).map((book, i) => (
                         <div key={i} onClick={() => setViewingBook(book)} className="aspect-square bg-gray-100 dark:bg-gray-900 cursor-pointer relative group">
                             <img src={book.coverUrl} className="w-full h-full object-cover" />
                         </div>
                     ))}
                </div>
            </div>
        )
    }

    return (
        <div className={`${theme} min-h-screen flex justify-center bg-gray-100 dark:bg-black transition-colors duration-500`}>
            <div className="w-full max-w-md h-[100dvh] bg-white dark:bg-black flex flex-col relative shadow-2xl overflow-hidden transition-colors duration-500 border-x border-gray-200 dark:border-gray-800">
            
            <main className="flex-1 overflow-y-auto no-scrollbar bg-white dark:bg-black transition-colors duration-500">
                {renderContent()}
            </main>
    
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
            
            {/* Single Post View Overlay (Replaces Reader) */}
            {currentViewBook && (
                <div className="fixed inset-0 z-[60] bg-white dark:bg-black flex flex-col animate-in slide-in-from-right duration-200 w-full max-w-md mx-auto">
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-black z-10">
                        <button 
                            onClick={() => setViewingBook(null)}
                            className="text-gray-900 dark:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Explorar</span>
                            <span className="font-bold text-lg text-gray-900 dark:text-white leading-none">Publicação</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto bg-white dark:bg-black pb-20">
                        {/* Actual Feed Post */}
                        <FeedPost 
                            book={currentViewBook} 
                            onOpen={() => {}} 
                            onToggleLike={handleToggleLike}
                        />
                        
                        {/* Comments Section Mockup */}
                        <div className="px-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Comentários</h3>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0">
                                        <img src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} className="w-full h-full rounded-full" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            <span className="font-semibold mr-2">user_{i}</span>
                                            Foto incrível! 👏👏 Adorei as cores.
                                        </p>
                                        <div className="flex gap-4 mt-1">
                                            <span className="text-xs text-gray-500 cursor-pointer">Responder</span>
                                            <span className="text-xs text-gray-500 cursor-pointer">Curtir</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
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