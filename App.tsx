
import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { BookSection } from './components/BookSection';
import { Editor } from './components/Editor';
import { Reader } from './components/Reader';
import { SettingsModal } from './components/SettingsModal';
import { NavTab, Book } from './types';
import { Search, Play } from 'lucide-react';

const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Renovação Social e Imortalidade',
    author: 'Grupo Marcos',
    authorAvatar: 'https://picsum.photos/100/100?random=1',
    coverUrl: 'https://picsum.photos/400/500?random=1',
    rating: 5.0,
    likesCount: 1240,
    commentsCount: 45,
    isFree: true,
    series: 'Filosofia Moderna',
    category: 'Filosofia',
    isLiked: true,
    content: `CAPÍTULO 1

O sol da manhã iluminava suavemente as colinas, trazendo consigo a promessa de um novo tempo. A sociedade, há muito estagnada em seus velhos costumes, começava a sentir os ventos da mudança soprarem através das ruas de paralelepípedos.`
  },
  {
    id: '2',
    title: 'Vampirização',
    author: 'Rev. Ezagui',
    authorAvatar: 'https://picsum.photos/100/100?random=2',
    coverUrl: 'https://picsum.photos/400/500?random=2',
    rating: 4.8,
    likesCount: 856,
    commentsCount: 12,
    isFree: true,
    series: 'Mistérios Ocultos',
    category: 'Terror',
    isLiked: false,
    content: `PRÓLOGO

A noite estava densa, e o nevoeiro cobria a cidade como um manto gélido. Poucos ousavam sair de suas casas após o toque de recolher, mas Helena não tinha escolha. Precisava encontrar o remédio para sua mãe.`
  },
  {
    id: '3',
    title: 'Pontos Vitais da Evolução',
    author: 'Leitura BR',
    authorAvatar: 'https://picsum.photos/100/100?random=3',
    coverUrl: 'https://picsum.photos/400/500?random=3',
    rating: 4.9,
    likesCount: 2300,
    commentsCount: 156,
    price: 4.99,
    isFree: true,
    category: 'Ciência',
    isLiked: false,
    content: `INTRODUÇÃO

A evolução não é uma linha reta. É uma espiral complexa, repleta de pontos vitais onde decisões cruciais determinam o destino de espécies inteiras. Neste volume, exploraremos os momentos.`
  },
  {
    id: '4',
    title: 'O Despertar',
    author: 'Consciência Viva',
    authorAvatar: 'https://picsum.photos/100/100?random=4',
    coverUrl: 'https://picsum.photos/400/500?random=4',
    rating: 4.5,
    likesCount: 54,
    commentsCount: 2,
    isFree: true,
    category: 'Autoajuda',
    isLiked: false,
    content: `CAPÍTULO ÚNICO

Acordar é fácil. Despertar é o desafio. Todos os dias abrimos os olhos para o mundo físico, mas quantas vezes abrimos os olhos da mente para a realidade que nos cerca?`
  },
   {
    id: '5',
    title: 'Futuro Distante',
    author: 'AI Writer',
    authorAvatar: 'https://picsum.photos/100/100?random=5',
    coverUrl: 'https://picsum.photos/400/500?random=5',
    rating: 4.2,
    category: 'Ficção Científica',
    isLiked: false,
    content: `ANO 3042. A Terra não é mais a mesma.`
  }
];

const CATEGORIES = ["Todos", "Romance", "Ficção", "Terror", "Autoajuda", "Negócios", "História"];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('home'); 
  const [myBooks, setMyBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [viewingBook, setViewingBook] = useState<Book | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  
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
      title: title || 'Sem Título',
      author: 'Você', 
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
            return { ...b, isLiked: !b.isLiked };
        }
        return b;
      })
    );
  };

  // Helper to filter books
  const filteredBooks = selectedCategory === "Todos" 
    ? myBooks 
    : myBooks.filter(b => b.category === selectedCategory);

  const renderContent = () => {
    if (activeTab === 'create') {
      return <Editor onSave={handleSaveBook} />;
    }

    if (activeTab === 'home') {
      const featuredBook = myBooks[0]; // Just taking the first as featured

      return (
        <div className="pb-20">
          <TopBar onOpenSettings={() => setShowSettings(true)} />
          
          {/* Categories Chips */}
          <div className="px-5 mb-6 overflow-x-auto no-scrollbar flex gap-2">
            {CATEGORIES.map(cat => (
                <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === cat 
                        ? 'bg-gray-900 text-white dark:bg-white dark:text-black' 
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                >
                    {cat}
                </button>
            ))}
          </div>

          {/* Featured Hero Section */}
          {selectedCategory === "Todos" && (
              <div className="px-5 mb-8">
                <div 
                    onClick={() => setViewingBook(featuredBook)}
                    className="relative w-full aspect-[2/1] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
                >
                    {/* Background Blur Image */}
                    <img src={featuredBook.coverUrl} className="absolute inset-0 w-full h-full object-cover opacity-50 blur-sm scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 p-5 w-full">
                        <span className="px-2 py-0.5 rounded bg-primary text-white text-[10px] font-bold uppercase tracking-wide mb-2 inline-block">
                            Destaque do Dia
                        </span>
                        <h2 className="text-xl font-bold text-white mb-1 line-clamp-1 font-serif">{featuredBook.title}</h2>
                        <p className="text-gray-300 text-xs mb-3 line-clamp-2">{featuredBook.content?.substring(0, 80)}...</p>
                        
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1 bg-white text-black px-3 py-1.5 rounded-full text-xs font-bold">
                                <Play size={12} fill="currentColor" /> Ler Agora
                            </button>
                        </div>
                    </div>
                    
                    {/* Floating Cover */}
                    <div className="absolute right-5 bottom-[-20px] w-24 aspect-[2/3] shadow-lg rounded-md overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-500 hidden sm:block">
                        <img src={featuredBook.coverUrl} className="w-full h-full object-cover" />
                    </div>
                </div>
              </div>
          )}

          {/* Horizontal Sections */}
          <BookSection 
            section={{ title: "Recomendados para você", books: filteredBooks }} 
            onBookClick={setViewingBook}
            onToggleLike={handleToggleLike}
          />

          <BookSection 
            section={{ title: "Mais lidos da semana", books: [...myBooks].reverse() }} 
            onBookClick={setViewingBook}
            onToggleLike={handleToggleLike}
          />
          
          <BookSection 
            section={{ title: "Novos Lançamentos", books: myBooks }} 
            onBookClick={setViewingBook}
            onToggleLike={handleToggleLike}
          />
        </div>
      );
    }

    if (activeTab === 'search') {
        return (
            <div className="p-5 pb-20 min-h-screen">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Explorar</h2>
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 mb-6">
                    <Search size={20} className="text-gray-500 mr-2" />
                    <input 
                        type="text" 
                        placeholder="Títulos, autores ou gêneros..." 
                        className="bg-transparent w-full outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 dark:text-white">Gêneros Populares</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {['Romance', 'Fantasia', 'Suspense', 'Negócios', 'História', 'Educação'].map((g, i) => (
                            <div key={i} className="h-20 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden group cursor-pointer">
                                <span className="font-bold text-gray-700 dark:text-gray-300 z-10">{g}</span>
                                <div className="absolute right-[-10px] bottom-[-10px] w-16 h-16 bg-current opacity-5 rounded-full group-hover:scale-150 transition-transform duration-500" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (activeTab === 'store') {
        return (
            <div className="pb-20">
               <div className="bg-gray-900 text-white p-8 mb-6 rounded-b-3xl">
                  <h2 className="font-serif text-3xl font-bold mb-2">Loja Premium</h2>
                  <p className="text-gray-400 text-sm">Adquira os best-sellers mundiais.</p>
               </div>
               <BookSection 
                 section={{ title: "Em oferta", books: myBooks }} 
                 onBookClick={setViewingBook}
               />
               <div className="px-5">
                   <div className="p-6 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="font-bold text-orange-800 dark:text-orange-200">Livreiro Premium</p>
                            <p className="text-xs text-orange-600 dark:text-orange-300">Acesso ilimitado a todos os livros.</p>
                        </div>
                        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold">Assinar</button>
                   </div>
               </div>
            </div>
        );
    }

    if (activeTab === 'profile') {
        return (
            <div className="pb-20 p-5">
                <div className="flex items-center gap-4 mb-8">
                     <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden shadow-md">
                        <img src="https://ui-avatars.com/api/?name=Voce&background=000&color=fff" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Você</h2>
                        <p className="text-sm text-gray-500">Membro desde 2024</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                     <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-center">
                         <span className="block text-2xl font-bold text-primary">12</span>
                         <span className="text-xs text-gray-500 uppercase">Livros Lidos</span>
                     </div>
                     <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-center">
                         <span className="block text-2xl font-bold text-primary">5</span>
                         <span className="text-xs text-gray-500 uppercase">Escritos</span>
                     </div>
                </div>

                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Minha Biblioteca</h3>
                <div className="grid grid-cols-3 gap-4">
                     {myBooks.map(book => (
                         <div key={book.id} onClick={() => setViewingBook(book)} className="cursor-pointer">
                             <div className="rounded-lg overflow-hidden shadow-sm aspect-[2/3] mb-2">
                                 <img src={book.coverUrl} className="w-full h-full object-cover" />
                             </div>
                             <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{book.title}</p>
                         </div>
                     ))}
                </div>
            </div>
        )
    }

    return null;
  };

  return (
    <div className={`${theme} min-h-screen flex justify-center bg-gray-100 dark:bg-black transition-colors duration-500`}>
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
