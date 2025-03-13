import React from 'react';
import { ExternalLink, Database, Calendar, User } from 'lucide-react';
import { databaseDorks } from '../dorks';

export function DatabaseDorks() {
  const handleSearch = (dork: typeof databaseDorks[0]) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(dork.operator)}`;
    window.open(searchUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-50 rounded-lg">
          <Database className="w-6 h-6 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          Database Dorks Collection
        </h2>
      </div>

      <div className="space-y-4">
        {databaseDorks.map((dork) => (
          <div
            key={dork.id}
            className="p-4 rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50/30 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 flex-1">
                <h3 className="font-medium text-gray-900">{dork.description}</h3>
                <p className="text-sm font-mono text-gray-600">{dork.operator}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {dork.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {dork.author}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleSearch(dork)}
                className="flex items-center justify-center px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Search
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}