import React, { useState, useCallback } from 'react';
import { Search, Filter } from 'lucide-react';
import { DorkSelector } from './components/DorkSelector';
import { googleDorks } from './dorks';
import { Message } from './types';
import ReactMarkdown from 'react-markdown';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDorks, setSelectedDorks] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);

  const generateGoogleSearchUrl = (query: string, selectedDorks: string[]): string => {
    const baseUrl = 'https://www.google.com/search?q=';
    
    // Get selected dork operators
    const dorkOperators = selectedDorks
      .map(id => {
        const dork = googleDorks.find(d => d.id === id);
        return dork?.operator || '';
      })
      .filter(Boolean);

    // Combine query with dork operators
    const searchTerms = [
      query,
      ...dorkOperators
    ].filter(Boolean);

    // Encode the search query
    const encodedQuery = encodeURIComponent(searchTerms.join(' '));
    
    return `${baseUrl}${encodedQuery}`;
  };

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      // Generate Google search URL with dorks
      const searchUrl = generateGoogleSearchUrl(searchQuery, selectedDorks);
      
      // Add message about the search
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🔍 Realizando busca no Google com os seguintes filtros:\n\n${
          selectedDorks
            .map(id => {
              const dork = googleDorks.find(d => d.id === id);
              return `- ${dork?.description}: \`${dork?.operator}\``;
            })
            .join('\n')
        }\n\nAbrindo resultados em uma nova aba...`
      }]);

      // Open Google search in new window
      window.open(searchUrl, '_blank');
    } catch (error) {
      console.error('Search error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: '❌ Erro ao realizar a busca. Por favor, tente novamente.'
      }]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedDorks]);

  const handleDorkToggle = (dorkId: string) => {
    setSelectedDorks(prev =>
      prev.includes(dorkId)
        ? prev.filter(id => id !== dorkId)
        : [...prev, dorkId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Google Dorks Pro</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Filtros */}
          <div className="lg:col-span-1">
            <DorkSelector
              selectedDorks={selectedDorks}
              onDorkToggle={handleDorkToggle}
            />
          </div>

          {/* Área de Busca e Resultados */}
          <div className="lg:col-span-2">
            {/* Campo de Busca */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label htmlFor="search" className="sr-only">
                    Buscar leads
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="search"
                      className="block w-full rounded-lg border-gray-300 pr-12 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Descreva seu negócio e que tipo de leads você procura..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                      <button
                        type="button"
                        onClick={handleSearch}
                        className="inline-flex items-center rounded border border-gray-200 px-2 font-sans text-sm font-medium text-gray-400 hover:border-blue-500 hover:text-blue-500"
                      >
                        <Search size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              {keywords.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Messages about search */}
            {messages.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 ${
                      message.role === 'assistant' ? 'pl-4 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <ReactMarkdown className="prose">
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ))}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-500">Preparando sua busca...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;