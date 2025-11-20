import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { BookSection } from './components/BookSection';
import { Editor } from './components/Editor';
import { Reader } from './components/Reader';
import { SettingsModal } from './components/SettingsModal';
import { NavTab, Book } from './types';
import { Heart } from 'lucide-react';

const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Renovação Social e Imortalidade',
    author: 'Grupo Marcos',
    coverUrl: 'https://picsum.photos/200/300?random=1',
    rating: 5.0,
    isFree: true,
    series: 'Livro 8',
    isLiked: false,
    content: `CAPÍTULO 1

O sol da manhã iluminava suavemente as colinas, trazendo consigo a promessa de um novo tempo. A sociedade, há muito estagnada em seus velhos costumes, começava a sentir os ventos da mudança soprarem através das ruas de paralelepípedos.

Não era apenas uma mudança política ou econômica, mas algo mais profundo, algo que tocava a alma de cada cidadão. Falava-se em renovação, não como uma reforma de estruturas físicas, mas como um renascimento de valores esquecidos. A imortalidade, antes um conceito abstrato discutido apenas por filósofos e teólogos, passava a ser encarada como a perenidade das ações humanas e do impacto que deixamos no mundo.

João, um jovem idealista, caminhava pela praça central observando as pessoas. Ele via em cada rosto a esperança e, ao mesmo tempo, o medo do desconhecido.`
  },
  {
    id: '2',
    title: 'Vampirização',
    author: 'Grupo Marcos',
    coverUrl: 'https://picsum.photos/200/300?random=2',
    rating: 4.8,
    isFree: true,
    series: 'Livro 2',
    isLiked: false,
    content: `PRÓLOGO

A noite estava densa, e o nevoeiro cobria a cidade como um manto gélido. Poucos ousavam sair de suas casas após o toque de recolher, mas Helena não tinha escolha. Precisava encontrar o remédio para sua mãe.

Enquanto apressava o passo pelas vielas estreitas, sentiu que estava sendo observada. Não era a primeira vez. Desde que os estranhos eventos começaram, a sensação de vigilância era constante.

Eles chamavam de "vampirização", mas não eram criaturas de dentes longos e capas pretas. Eram drenadores de energia, entidades sutis que se alimentavam do desânimo e do medo coletivo.`
  },
  {
    id: '3',
    title: 'Série Pontos Vitais da Evolução',
    author: 'Rev Ezagui',
    coverUrl: 'https://picsum.photos/200/300?random=3',
    rating: 4.9,
    price: 4.99,
    isFree: true,
    isLiked: false,
    content: `INTRODUÇÃO

A evolução não é uma linha reta. É uma espiral complexa, repleta de pontos vitais onde decisões cruciais determinam o destino de espécies inteiras. Neste volume, exploraremos os momentos em que a humanidade esteve à beira do abismo e como, através da intuição e da gratidão, conseguiu encontrar o caminho de volta à luz.`
  },
  {
    id: '4',
    title: 'O despertar da Consciência',
    author: 'Unknown',
    coverUrl: 'https://picsum.photos/200/300?random=4',
    rating: 4.5,
    isFree: true,
    isLiked: false,
    content: `CAPÍTULO ÚNICO

Acordar é fácil. Despertar é o desafio.

Todos os dias abrimos os olhos para o mundo físico, mas quantas vezes abrimos os olhos da mente para a realidade que nos cerca? O despertar da consciência é o ato deliberado de sair do piloto automático e assumir o controle da própria jornada.`
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('apps'); 
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

  const handleSaveBook = (title: string, content: string) => {
    const newBook: Book = {
      id: Date.now().toString(),
      title: title || 'Sem Título',
      author: 'Você',
      coverUrl: `https://picsum.photos/200/300?random=${Date.now()}`, 
      rating: 5.0,
      isFree: true,
      content: content,
      category: 'Meus Livros',
      isLiked: false
    };

    setMyBooks(prev => [newBook, ...prev]);
    setActiveTab('apps');
  };

  const handleToggleLike = (book: Book) => {
    setMyBooks(prevBooks => 
      prevBooks.map(b => 
        b.id === book.id ? { ...b, isLiked: !b.isLiked } : b
      )
    );
  };

  const renderContent = () => {
    if (activeTab === 'write') {
      return <Editor onSave={handleSaveBook} />;
    }

    if (activeTab === 'apps') {
      return (
        <div className="pb-20">
          <TopBar onOpenSettings={() => setShowSettings(true)} />
          <div className="pt-4">
              <BookSection 
                section={{
                  title: "Todos os Livros",
                  books: myBooks
                }} 
                onBookClick={(book) => setViewingBook(book)}
                onToggleLike={handleToggleLike}
              />
          </div>
        </div>
      );
    }

    if (activeTab === 'books') {
        const likedBooks = myBooks.filter(b => b.isLiked);
        return (
            <div className="pb-20">
              <TopBar onOpenSettings={() => setShowSettings(true)} />
              <div className="pt-4">
                  {likedBooks.length > 0 ? (
                      <BookSection 
                        section={{
                          title: "Meus Favoritos",
                          books: likedBooks
                        }} 
                        onBookClick={(book) => setViewingBook(book)}
                        onToggleLike={handleToggleLike}
                      />
                  ) : (
                      <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400 dark:text-gray-500">
                          <Heart size={48} className="mb-4 opacity-20" />
                          <p>Você ainda não curtiu nenhum livro.</p>
                          <p className="text-sm mt-2">Vá em "Apps" e clique no coração ❤️</p>
                      </div>
                  )}
              </div>
            </div>
        );
    }

    // Fallback for other tabs
    return (
      <div className="pb-20">
        <TopBar onOpenSettings={() => setShowSettings(true)} />
        <div className="pt-4 flex flex-col items-center justify-center h-[50vh] text-gray-400 dark:text-gray-500">
            <p>Em breve...</p>
        </div>
      </div>
    );
  };

  return (
    <div className={`${theme} min-h-screen flex justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-500`}>
        <div className="w-full max-w-md h-[100dvh] bg-white dark:bg-gray-900 flex flex-col relative shadow-2xl overflow-hidden transition-colors duration-500">
        
        <main className="flex-1 overflow-y-auto no-scrollbar bg-white dark:bg-gray-900 transition-colors duration-500">
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