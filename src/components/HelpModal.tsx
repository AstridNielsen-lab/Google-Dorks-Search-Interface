import React from 'react';
import { X, HelpCircle, Search, Filter, Tag, History } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            Como usar o Google Dorks Pro
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <section className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Busca Avançada
            </h3>
            <p className="text-gray-600">
              O Google Dorks Pro utiliza técnicas avançadas de busca para encontrar leads qualificados. 
              Descreva seu negócio e o tipo de leads que você procura no campo de busca.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              Filtros Google Dorks
            </h3>
            <p className="text-gray-600">
              Selecione os filtros relevantes para sua busca. Cada filtro usa operadores especiais do Google 
              para encontrar informações específicas como emails, telefones, documentos e mais.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              Palavras-chave
            </h3>
            <p className="text-gray-600">
              O sistema extrai automaticamente palavras-chave relevantes da sua busca. Você pode adicionar 
              mais palavras-chave manualmente para refinar os resultados.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              Histórico de Buscas
            </h3>
            <p className="text-gray-600">
              Suas buscas são salvas automaticamente para referência futura. Você pode acessar e reutilizar 
              buscas anteriores a qualquer momento.
            </p>
          </section>
        </div>

        <div className="p-6 bg-gray-50 rounded-b-2xl">
          <p className="text-sm text-gray-500">
            Lembre-se: Use esta ferramenta de forma ética e responsável, respeitando a privacidade 
            e os termos de serviço do Google.
          </p>
        </div>
      </div>
    </div>
  );
}