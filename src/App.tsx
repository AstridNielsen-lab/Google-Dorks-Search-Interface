import React, { useState, useCallback, useEffect } from 'react';
import { Search, Filter, ExternalLink, Sparkles, HelpCircle, Wand2, Target, Phone, X, Facebook, Scale } from 'lucide-react';
import { DorkSelector } from './components/DorkSelector';
import { Footer } from './components/Footer';
import { SplashScreen } from './components/SplashScreen';
import { Chat } from './components/Chat';
import { HelpModal } from './components/HelpModal';
import { KeywordGeneratorModal } from './components/KeywordGeneratorModal';
import { UserRegistration } from './components/UserRegistration';
import { UserInfo } from './components/UserInfo';
import { CopyrightModal } from './components/CopyrightModal';
import { googleDorks } from './dorks';
import { Message, UserData } from './types';
import { saveSearch, getSearchHistory, SearchHistory, getUserData, saveUserData } from './services/storage';
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
  const [showKeywordGenerator, setShowKeywordGenerator] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [userData, setUserData] = useState<UserData | null>(getUserData());
  const [showPhoneInfo, setShowPhoneInfo] = useState(false);
  const [showCopyright, setShowCopyright] = useState(false);

  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  const handleUserRegistration = (data: UserData) => {
    setUserData(data);
    saveUserData(data);
  };

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
        content: `Busca configurada com os seguintes filtros:\n\n${
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
        content: 'Erro ao configurar a busca. Por favor, tente novamente.'
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

  if (!userData) {
    return <UserRegistration onComplete={handleUserRegistration} />;
  }

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <UserInfo userData={userData} />
      
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Search className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Google Dorks Pro
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-600">Like Look Solutions</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pb-2">
              <button
                onClick={() => setShowPhoneInfo(true)}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                <Phone className="w-5 h-5 mr-2" />
                <span>Falar com Robô</span>
              </button>
              <a
                href="https://ads.google.com/aw/campaigns/new/express"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                <Target className="w-5 h-5 mr-2" />
                <span>Google Ads</span>
              </a>
              <a
                href="https://www.facebook.com/business/tools/ads-manager"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-5 h-5 mr-2" />
                <span>Facebook Ads</span>
              </a>
              <button
                onClick={() => setShowKeywordGenerator(true)}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                <span>Palavras-chave</span>
              </button>
              <button
                onClick={() => setShowCopyright(true)}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
              >
                <Scale className="w-5 h-5 mr-2" />
                <span>Direitos Autorais</span>
              </button>
              <button
                onClick={() => setShowHelp(true)}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                <span>Ajuda</span>
              </button>
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

      {/* Phone Support Modal */}
      {showPhoneInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Phone className="w-6 h-6 text-blue-600" />
                Atendimento Telefônico
              </h2>
              <button
                onClick={() => setShowPhoneInfo(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Robôs de Atendimento AI</h3>
                <p className="text-blue-800">
                  Conheça nossa linha de robôs de atendimento alimentados por Inteligência Artificial, 
                  projetados para otimizar seu atendimento ao cliente 24/7.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 rounded-lg p-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Atendimento Especializado</h4>
                    <p className="text-gray-600">Nossa equipe está pronta para demonstrar como nossos robôs podem revolucionar seu atendimento.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 rounded-lg p-2">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Demonstração Personalizada</h4>
                    <p className="text-gray-600">Agende uma demonstração gratuita e veja nossos robôs em ação.</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <a
                  href="https://character.ai/chat/4vtMJ_iMDKjumbEaDrC3EkUKWQesu_Ap2kQ3Z6XX9Do"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  Falar com um Robô Agora
                </a>
                
                <p className="text-center mt-4 text-sm text-gray-500">
                  Horário de atendimento: Segunda a Sexta, 9h às 18h
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <KeywordGeneratorModal
        isOpen={showKeywordGenerator}
        onClose={() => setShowKeywordGenerator(false)}
        onAddKeywords={handleAddKeywords}
      />
      <CopyrightModal
        isOpen={showCopyright}
        onClose={() => setShowCopyright(false)}
      />
    </div>
  );
}

export default App;