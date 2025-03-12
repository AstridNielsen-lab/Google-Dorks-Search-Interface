import React, { useState } from 'react';
import { X, Wand2, Copy, Check, Loader2 } from 'lucide-react';
import { generateKeywords } from '../services/gemini';

interface KeywordGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddKeywords: (keywords: string[]) => void;
}

export function KeywordGeneratorModal({ isOpen, onClose, onAddKeywords }: KeywordGeneratorModalProps) {
  const [businessDescription, setBusinessDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!businessDescription.trim() || loading) return;
    
    setLoading(true);
    try {
      const generatedKeywords = await generateKeywords(businessDescription);
      setKeywords(generatedKeywords);
    } catch (error) {
      console.error('Error generating keywords:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(keywords.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToSearch = () => {
    onAddKeywords(keywords.slice(0, 5));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-blue-600" />
            Gerador de Palavras-chave
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descreva seu negócio ou produto
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full rounded-xl border-gray-200 resize-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Ex: Vendo móveis planejados para escritório, com foco em ergonomia e design moderno..."
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={loading || !businessDescription.trim()}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="w-5 h-5 mr-2" />
                )}
                Gerar Palavras-chave
              </button>
            </div>

            {keywords.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Palavras-chave Sugeridas ({keywords.length})
                  </h3>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 mr-1 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 mr-1" />
                    )}
                    {copied ? 'Copiado!' : 'Copiar todas'}
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 max-h-[300px] overflow-y-auto">
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
                </div>
              </div>
            )}
          </div>
        </div>

        {keywords.length > 0 && (
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <button
              onClick={handleAddToSearch}
              className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Adicionar à Busca (5 principais)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}