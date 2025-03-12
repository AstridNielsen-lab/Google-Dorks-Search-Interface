import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { UserData } from '../types';
import { saveUserData } from '../services/storage';

interface UserRegistrationProps {
  onComplete: (userData: UserData) => void;
}

export function UserRegistration({ onComplete }: UserRegistrationProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Preparar o corpo do email
    const emailBody = `
Nome: ${formData.name}
Email: ${formData.email}
WhatsApp: ${formData.whatsapp}
    `;
    
    // Criar o link mailto
    const mailtoLink = `mailto:juliocamposmachado@gmail.com?subject=Novo Registro de Usuário&body=${encodeURIComponent(emailBody)}`;
    
    // Criar objeto de usuário
    const userData: UserData = {
      name: formData.name,
      email: formData.email,
      whatsapp: formData.whatsapp,
      browser: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        vendor: navigator.vendor,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    // Salvar dados do usuário
    saveUserData(userData);
    
    // Abrir o cliente de email
    window.location.href = mailtoLink;
    
    // Completar o registro
    onComplete(userData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Cadastro de Usuário
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <input
                type="tel"
                id="whatsapp"
                required
                placeholder="(11) 99999-9999"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="w-5 h-5" />
              Cadastrar e Começar
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-500 text-center">
            Seus dados serão usados para personalizar sua experiência
          </p>
        </div>
      </div>
    </div>
  );
}