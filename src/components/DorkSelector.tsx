import React from 'react';
import { GoogleDork } from '../types';
import { googleDorks, dorkCategories } from '../dorks';
import { Filter, CheckCircle } from 'lucide-react';

interface DorkSelectorProps {
  selectedDorks: string[];
  onDorkToggle: (dorkId: string) => void;
}

export function DorkSelector({ selectedDorks, onDorkToggle }: DorkSelectorProps) {
  const dorksByCategory = googleDorks.reduce((acc, dork) => {
    if (!acc[dork.category]) {
      acc[dork.category] = [];
    }
    acc[dork.category].push(dork);
    return acc;
  }, {} as Record<string, GoogleDork[]>);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Filter className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Filtros Google Dorks</h2>
      </div>
      
      <div className="space-y-8">
        {Object.entries(dorksByCategory).map(([category, dorks]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
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
  );
}