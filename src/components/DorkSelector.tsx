import React, { useState } from 'react';
import { GoogleDork } from '../types';
import { googleDorks, dorkCategories, smartSearches } from '../dorks';
import { Filter, CheckCircle, Search, Wand2, MapPin, Phone, FileText, Globe, Share2, Settings } from 'lucide-react';

interface DorkSelectorProps {
  selectedDorks: string[];
  onDorkToggle: (dorkId: string) => void;
}

export function DorkSelector({ selectedDorks, onDorkToggle }: DorkSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const dorksByCategory = googleDorks.reduce((acc, dork) => {
    if (!acc[dork.category]) {
      acc[dork.category] = [];
    }
    acc[dork.category].push(dork);
    return acc;
  }, {} as Record<string, GoogleDork[]>);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'location':
        return <MapPin className="w-5 h-5" />;
      case 'contact':
        return <Phone className="w-5 h-5" />;
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'domain':
        return <Globe className="w-5 h-5" />;
      case 'social':
        return <Share2 className="w-5 h-5" />;
      case 'technical':
        return <Settings className="w-5 h-5" />;
      default:
        return <Filter className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Smart Searches */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Wand2 className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Buscas Inteligentes</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {smartSearches.map((search) => (
            <button
              key={search.id}
              onClick={() => {
                // Clear previous selections
                selectedDorks.forEach(dork => onDorkToggle(dork));
                // Add new selections
                search.dorks.forEach(dork => {
                  if (!selectedDorks.includes(dork)) {
                    onDorkToggle(dork);
                  }
                });
              }}
              className="p-4 rounded-xl border-2 border-purple-100 hover:border-purple-300 bg-purple-50/30 hover:bg-purple-50 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-purple-600" />
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">{search.name}</h3>
                  <p className="text-sm text-gray-600">{search.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dork Categories */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Filter className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Filtros Avançados</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(dorkCategories).map(([category, label]) => (
            <button
              key={category}
              onClick={() => setActiveCategory(activeCategory === category ? null : category)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {getCategoryIcon(category)}
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {Object.entries(dorksByCategory)
            .filter(([category]) => !activeCategory || category === activeCategory)
            .map(([category, dorks]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  {getCategoryIcon(category)}
                  {dorkCategories[category as keyof typeof dorkCategories]}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {dorks.map((dork) => {
                    const isSelected = selectedDorks.includes(dork.id);
                    return (
                      <label
                        key={dork.id}
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            isSelected ? 'text-blue-600' : 'text-gray-300'
                          }`}>
                            <CheckCircle className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`font-medium ${
                              isSelected ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {dork.description}
                            </p>
                          </div>
                          <p className={`text-sm mt-1 font-mono ${
                            isSelected ? 'text-blue-700' : 'text-gray-500'
                          }`}>
                            {dork.operator}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onDorkToggle(dork.id)}
                          className="sr-only"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}