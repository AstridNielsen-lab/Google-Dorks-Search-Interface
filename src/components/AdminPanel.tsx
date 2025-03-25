import React from 'react';
import { Settings, Users, BarChart, LogOut, X } from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Painel Administrativo
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="text-white hover:text-red-200 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Usuários</h3>
              </div>
              <p className="text-gray-600">
                Total de usuários registrados: 0
              </p>
              <p className="text-gray-600">
                Usuários ativos hoje: 0
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Estatísticas</h3>
              </div>
              <p className="text-gray-600">
                Buscas realizadas: 0
              </p>
              <p className="text-gray-600">
                Leads encontrados: 0
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimas Atividades</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-600 text-center">
                Nenhuma atividade registrada
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}