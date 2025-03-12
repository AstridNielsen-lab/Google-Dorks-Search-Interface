import React, { useState, useCallback, useEffect } from 'react';
import { Search, Filter, ExternalLink, Sparkles, HelpCircle } from 'lucide-react';
import { DorkSelector } from './components/DorkSelector';
import { Footer } from './components/Footer';
import { SplashScreen } from './components/SplashScreen';
import { Chat } from './components/Chat';
import { HelpModal } from './components/HelpModal';
import { googleDorks } from './dorks';
import { Message } from './types';
import { saveSearch, getSearchHistory, SearchHistory } from './services/storage';
import ReactMarkdown from 'react-markdown';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDorks, setSelectedDorks] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [searchUrl, setSearchUrl] = useState<string>('');
  const [showSplash, setShowSplash] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);

  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  const generateGoogleSearchUrl = (query: string, selectedDorks: string[]): string => {
    const baseUrl = 'https://www.google.com/search?q=';
    
    const dorkOperators = selectedDorks
      .map(id => {
        const dork = googleDorks.find(d => d.id === id);
        return dork?.operator || '';
      })
      .filter(Boolean);

    const searchTerms = [
      query,
      ...dorkOperators
    ].filter(Boolean);
    
    return `${baseUrl}${encodeURIComponent(searchTerms.join(' '))}`;
  };

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const url = generateGoogleSearchUrl(searchQuery, selectedDorks);
      setSearchUrl(url);
      
      saveSearch({
        query: searchQuery,
        url,
        timestamp: Date.now(),
        keywords,
        dorks: selectedDorks
      });
      setSearchHistory(getSearchHistory());
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🔍 Busca configurada com os seguintes filtros:\n\n${
          selectedDorks
            .map(id => {
              const dork = googleDorks.find(d => d.id === id);
              return `- ${dork?.description}: \`${dork?.operator}\``;
            })
            .join('\n')
        }`
      }]);

    } catch (error) {
      console.error('Search error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: '❌ Erro ao configurar a busca. Por favor, tente novamente.'
      }]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedDorks, keywords]);

  const handleDorkToggle = (dorkId: string) => {
    setSelectedDorks(prev =>
      prev.includes(dorkId)
        ? prev.filter(id => id !== dorkId)
        : [...prev, dorkId]
    );
  };

  const handleAddKeywords = (newKeywords: string[]) => {
    setKeywords(prev => [...new Set([...prev, ...newKeywords])]);
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Search className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Google Dorks Pro
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowHelp(true)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                title="Ajuda"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-600">Like Look Solutions</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    className="block w-full rounded-xl border-gray-200 pr-12 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 text-gray-900 placeholder-gray-400"
                    placeholder="Descreva seu negócio e que tipo de leads você procura..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="inline-flex items-center rounded-lg border border-gray-200 px-4 font-medium text-gray-600 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200"
                    >
                      <Search size={18} className="mr-2" />
                      Buscar
                    </button>
                  </div>
                </div>

                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DorkSelector
              selectedDorks={selectedDorks}
              onDorkToggle={handleDorkToggle}
            />

            {searchUrl && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Search className="w-5 h-5 mr-2 text-blue-600" />
                  Prévia da Busca
                </h2>
                <div className="bg-gray-50 rounded-xl p-4 mb-4 break-all border border-gray-100">
                  <code className="text-sm text-gray-800">{searchUrl}</code>
                </div>
                <a
                  href={searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <ExternalLink size={18} className="mr-2" />
                  Abrir Busca no Google
                </a>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Chat onAddKeywords={handleAddKeywords} />

            {searchHistory.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Histórico de Buscas
                </h2>
                <div className="space-y-4">
                  {searchHistory.map((search, index) => (
                    <div key={index} className="p-4 rounded-lg bg-gray-50 space-y-2">
                      <p className="font-medium text-gray-900">{search.query}</p>
                      <div className="flex flex-wrap gap-2">
                        {search.keywords.map((keyword, i) => (
                          <span key={i} className="text-sm text-blue-600">#{keyword}</span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(search.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {messages.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 ${
                      message.role === 'assistant' ? 'pl-4 border-l-4 border-blue-500 py-2' : ''
                    }`}
                  >
                    <ReactMarkdown className="prose max-w-none">
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ))}
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600 font-medium">Preparando sua busca...</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}

export default App;