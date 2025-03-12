import React from 'react';
import { GoogleDork } from '../types';
import { googleDorks, dorkCategories } from '../dorks';
import { Filter } from 'lucide-react';

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
    <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Filtros Google Dorks</h2>
      </div>
      
      <div className="space-y-6">
        {Object.entries(dorksByCategory).map(([category, dorks]) => (
          <div key={category}>
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              {dorkCategories[category as keyof typeof dorkCategories]}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {dorks.map((dork) => (
                <label
                  key={dork.id}
                  className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedDorks.includes(dork.id)}
                    onChange={() => onDorkToggle(dork.id)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{dork.description}</p>
                    <p className="text-sm text-gray-500">{dork.operator}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}