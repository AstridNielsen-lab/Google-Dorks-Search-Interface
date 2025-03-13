import React, { useState } from 'react';
import { Mail, Send, CreditCard, LogIn } from 'lucide-react';
import { UserData } from '../types';
import { saveUserData } from '../services/storage';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { checkSubscription } from '../services/mercadopago';
import { LoginForm } from './LoginForm';

// Initialize Mercado Pago
initMercadoPago('APP_USR-66b8867d-6e7c-4b7c-a441-167840b07da1');

interface UserRegistrationProps {
  onComplete: (userData: UserData) => void;
}

export function UserRegistration({ onComplete }: UserRegistrationProps) {
  const [email, setEmail] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Check if user already has an active subscription
      const isSubscribed = await checkSubscription(email);
      
      if (isSubscribed) {
        setShowLogin(true);
        return;
      }

      // Create preference ID for payment
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
            unit_price: 2.99
          }],
          payer: {
            email: email
          },
          external_reference: email,
          back_urls: {
            success: `${window.location.origin}?login=true`,
            failure: window.location.href,
            pending: window.location.href
          },
          auto_return: "approved",
          notification_url: "https://your-webhook-endpoint.com/notifications"
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao criar preferência de pagamento');
      }

      const data = await response.json();
      setPreferenceId(data.id);
      setShowPayment(true);

      // Save basic user data
      const userData: UserData = {
        email,
        name: email.split('@')[0], // Use email username as display name
        whatsapp: '', // No longer required
        browser: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          vendor: navigator.vendor,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };
      
      saveUserData(userData);
      
    } catch (error) {
      console.error('Error in registration:', error);
      setError('Ocorreu um erro ao processar seu cadastro. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Check URL parameters for login redirect
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === 'true') {
      setShowLogin(true);
    }
  }, []);

  if (showLogin) {
    return <LoginForm onComplete={onComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              {showPayment ? <CreditCard className="w-6 h-6 text-blue-600" /> : <Mail className="w-6 h-6 text-blue-600" />}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {showPayment ? 'Pagamento' : 'Nova Assinatura'}
            </h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!showPayment && (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Assinatura Premium</h3>
                  </div>
                  <p className="text-blue-800 mb-3">
                    Acesso completo a todas as funcionalidades por apenas R$ 2,99/mês
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>✓ Acesso ilimitado aos filtros avançados</li>
                    <li>✓ Gerador de palavras-chave premium</li>
                    <li>✓ Suporte prioritário</li>
                    <li>✓ Atualizações exclusivas</li>
                  </ul>
                </div>
              </>
            )}

            {showPayment && preferenceId ? (
              <div className="w-full">
                <Wallet initialization={{ preferenceId }} />
              </div>
            ) : (
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Continuar para pagamento</span>
                  </>
                )}
              </button>
            )}
          </form>

          {!showPayment && (
            <button
              onClick={() => setShowLogin(true)}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              <span>Já sou assinante</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}