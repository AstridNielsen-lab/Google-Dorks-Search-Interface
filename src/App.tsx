import React, { useState, useCallback } from 'react';
import { Search, Filter, FileText } from 'lucide-react';
import { DorkSelector } from './components/DorkSelector';
import { mockSearch, mockChatResponse } from './mockApi';
import { SearchResult, Message } from './types';
import ReactMarkdown from 'react-markdown';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDorks, setSelectedDorks] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      // First get chat response to extract context and keywords
      const chatResponse = await mockChatResponse(searchQuery);
      
      // Add assistant message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: chatResponse.response,
        keywords: chatResponse.keywords
      }]);

      setKeywords(chatResponse.keywords);

      // Then perform search with extracted keywords and context
      const results = await mockSearch(
        chatResponse.keywords,
        chatResponse.businessContext,
        selectedDorks
      );
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
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

            {/* Chat Messages */}
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

            {/* Resultados */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-500">Buscando leads qualificados...</p>
              </div>
            ) : (
              searchResults.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                      Resultados da Busca
                    </h2>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {searchResults.map((result, index) => (
                      <li key={index} className="p-6 hover:bg-gray-50">
                        <div className="flex items-start space-x-6">
                          {result.thumbnail && (
                            <div className="flex-shrink-0">
                              <img
                                src={result.thumbnail}
                                alt=""
                                className="h-20 w-20 rounded-lg object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-medium text-blue-600 hover:underline">
                              <a href={result.url} target="_blank" rel="noopener noreferrer">
                                {result.title}
                              </a>
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">{result.snippet}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {result.emails.map((email, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800"
                                >
                                  {email}
                                </span>
                              ))}
                              {result.phones.map((phone, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center rounded-full bg-purple-100 px-3 py-0.5 text-sm font-medium text-purple-800"
                                >
                                  {phone}
                                </span>
                              ))}
                              {result.fileType && (
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-gray-800">
                                  <FileText size={14} className="mr-1" />
                                  {result.fileType.toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                              {result.relevance}% relevante
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;