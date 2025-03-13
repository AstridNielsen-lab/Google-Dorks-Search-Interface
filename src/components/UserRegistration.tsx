import React, { useState } from 'react';
import { Mail, Send, CreditCard } from 'lucide-react';
import { UserData } from '../types';
import { saveUserData } from '../services/storage';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Initialize Mercado Pago
initMercadoPago('APP_USR-66b8867d-6e7c-4b57-a441-167840b07da1');

interface UserRegistrationProps {
  onComplete: (userData: UserData) => void;
}

export function UserRegistration({ onComplete }: UserRegistrationProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });
  const [showPayment, setShowPayment] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create preference ID for payment
    try {
      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer APP_USR-2120017613674163-031300-fa2a42e0f08ec6db55f7bc4385024ba5-29008060',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: [{
            title: "Assinatura Google Dorks Pro",
            quantity: 1,
            currency_id: "BRL",
            unit_price: 9.99
          }],
          payer: {
            email: formData.email,
            name: formData.name
          },
          back_urls: {
            success: window.location.href,
            failure: window.location.href,
            pending: window.location.href
          },
          auto_return: "approved"
        })
      });

      const data = await response.json();
      setPreferenceId(data.id);
      setShowPayment(true);
    } catch (error) {
      console.error('Error creating payment preference:', error);
    }
    
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

            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Assinatura Premium</h3>
              </div>
              <p className="text-blue-800 mb-3">
                Acesso completo a todas as funcionalidades por apenas R$ 9,99/mês
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✓ Acesso ilimitado aos filtros avançados</li>
                <li>✓ Gerador de palavras-chave premium</li>
                <li>✓ Suporte prioritário</li>
                <li>✓ Atualizações exclusivas</li>
              </ul>
            </div>

            {showPayment && preferenceId ? (
              <div className="w-full">
                <Wallet initialization={{ preferenceId }} />
              </div>
            ) : (
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="w-5 h-5" />
                Cadastrar e Assinar
              </button>
            )}
          </form>

          <p className="mt-6 text-sm text-gray-500 text-center">
            Seus dados serão usados para personalizar sua experiência
          </p>
        </div>
      </div>
    </div>
  );
}