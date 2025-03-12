import React, { useState, useEffect } from 'react';
import { Search, History, Trash2, Loader2, AlertCircle, Send, MessageSquare, Phone, Mail, ExternalLink, Heart, Star } from 'lucide-react';
import { SearchResult, SearchHistory, Message, ChatState } from './types';
import { mockSearch, mockChatResponse } from './mockApi';
import { formatPhoneNumber, generateUniqueId } from './utils';
import ReactMarkdown from 'react-markdown';

function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center z-50">
      <div className="text-center text-white">
        <Heart className="w-20 h-20 mx-auto mb-4 animate-pulse" />
        <h1 className="text-4xl font-bold mb-2">Google Dorks Pro</h1>
        <p className="text-xl opacity-90">Like Look Solutions</p>
        <div className="mt-8 text-sm opacity-75">
          <p>Desenvolvido por Julio Campos Machado</p>
          <a 
            href="https://wa.me/5511970603441" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-2 hover:underline"
          >
            <Phone className="w-4 h-4" />
            (11) 97060-3441
          </a>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [error, setError] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [showSplash, setShowSplash] = useState(true);
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    selectedKeywords: [],
    businessContext: ''
  });

  useEffect(() => {
    loadHistory();
    // Add initial greeting
    setChatState(prev => ({
      ...prev,
      messages: [{
        id: generateUniqueId(),
        role: 'assistant',
        content: 'Olá! Sou Julio, especialista em encontrar leads qualificados. Para ajudar você da melhor forma, preciso entender:\n\n1. Que tipo de produto ou serviço você oferece?\n2. Qual região você quer atender?\n3. Qual a faixa de preço do seu produto/serviço?',
      }]
    }));

    // Hide splash screen after 2 seconds
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const loadHistory = () => {
    const savedHistory = localStorage.getItem('searches');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  };

  const handleSearch = async () => {
    if (chatState.selectedKeywords.length === 0) {
      setError('Por favor, converse com o Julio para identificar palavras-chave');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const searchResults = await mockSearch(chatState.selectedKeywords, chatState.businessContext || '');
      setResults(searchResults);
      
      // Save to history
      const newHistory: SearchHistory = {
        keyword: chatState.selectedKeywords.join(', '),
        timestamp: new Date().toISOString(),
        resultCount: searchResults.length
      };
      
      const updatedHistory = [newHistory, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('searches', JSON.stringify(updatedHistory));
    } catch (err) {
      setError('Ocorreu um erro durante a busca');
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage: Message = {
      id: generateUniqueId(),
      role: 'user',
      content: chatInput
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }));
    setChatInput('');

    try {
      const { response, keywords, businessContext } = await mockChatResponse(chatInput);
      
      const assistantMessage: Message = {
        id: generateUniqueId(),
        role: 'assistant',
        content: response,
        keywords: keywords
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        selectedKeywords: [...new Set([...prev.selectedKeywords, ...keywords])],
        businessContext: businessContext
      }));
    } catch (err) {
      setError('Erro ao processar a mensagem');
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('searches');
  };

  return (
    <>
      {showSplash && <SplashScreen />}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-8 h-8 text-red-500" />
              <h1 className="text-4xl font-bold text-gray-900">
                Google Dorks Pro
              </h1>
            </div>
            <p className="text-gray-600">
              Converse com Julio, nosso especialista em Google Dorks, para otimizar sua busca
            </p>
          </header>

          <div className="grid md:grid-cols-[1fr_400px] gap-8">
            <main className="order-2 md:order-1">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {chatState.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                        {message.keywords && message.keywords.length > 0 && (
                          <div className="mt-2 text-sm">
                            <p className="font-semibold">Palavras-chave identificadas:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {message.keywords.map((keyword, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleChatSubmit} className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Descreva seu negócio e clientes ideais..."
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </div>

              {chatState.selectedKeywords.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
                  <h2 className="text-xl font-semibold mb-4">Palavras-chave Selecionadas</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {chatState.selectedKeywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-blue-100 text-blue-800"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )}
                    Buscar Leads Qualificados
                  </button>
                </div>
              )}

              {error && (
                <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  {error}
                </div>
              )}

              {results.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Search className="w-6 h-6" />
                    Resultados da Busca
                  </h2>
                  <div className="grid gap-6">
                    {results.map((result, index) => (
                      <article
                        key={index}
                        className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                      >
                        <div className="flex">
                          {result.thumbnail && (
                            <div className="w-32 h-32 flex-shrink-0">
                              <img
                                src={result.thumbnail}
                                alt={result.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                  {result.title}
                                </h3>
                                <a
                                  href={result.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm mb-4 flex items-center gap-1"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  {result.url}
                                </a>
                              </div>
                              {result.relevance && (
                                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full">
                                  <Star className="h-4 w-4 fill-current" />
                                  <span className="text-sm font-medium">{result.relevance}%</span>
                                </div>
                              )}
                            </div>
                            <p className="text-gray-600 mb-4">{result.snippet}</p>
                            <div className="grid grid-cols-2 gap-3">
                              {result.phones.map((phone, idx) => (
                                <a
                                  key={idx}
                                  href={`https://wa.me/${formatPhoneNumber(phone)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                  <Phone className="h-4 w-4" />
                                  {phone}
                                </a>
                              ))}
                              {result.emails.map((email, idx) => (
                                <a
                                  key={idx}
                                  href={`mailto:${email}`}
                                  className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                  <Mail className="h-4 w-4" />
                                  {email}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </main>

            <aside className="order-1 md:order-2">
              <div className="bg-white rounded-lg p-6 shadow-lg sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Histórico
                  </h2>
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-red-600 hover:text-red-700 transition-colors"
                      title="Limpar histórico"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
                {history.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhuma busca realizada</p>
                ) : (
                  <ul className="space-y-3">
                    {history.map((item, index) => (
                      <li
                        key={index}
                        className="text-sm p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <p className="font-medium text-gray-900">{item.keyword}</p>
                        <p className="text-gray-500 text-xs">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                        <p className="text-gray-600 text-xs">
                          {item.resultCount} resultados
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>
          </div>

          <footer className="mt-12 text-center text-sm text-gray-500">
            <p className="mb-2">
              Desenvolvido por{' '}
              <a 
                href="https://likelook.wixsite.com/solutions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 hover:underline"
              >
                Like Look Solutions
              </a>
            </p>
            <p>
              Aviso: Use esta ferramenta de forma ética e em conformidade com as
              leis locais e termos de serviço.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;