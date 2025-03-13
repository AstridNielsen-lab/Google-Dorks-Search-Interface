import React, { useState } from 'react';
import { LogIn, Mail, Phone } from 'lucide-react';
import { UserData } from '../types';
import { getUserData } from '../services/storage';
import { checkSubscription } from '../services/mercadopago';

interface LoginFormProps {
  onComplete: (userData: UserData) => void;
}

export function LoginForm({ onComplete }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    whatsapp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if user has an active subscription
      const isSubscribed = await checkSubscription(formData.email);
      
      if (!isSubscribed) {
        setError('Assinatura não encontrada. Por favor, verifique seus dados ou faça uma nova assinatura.');
        return;
      }

      // Get stored user data
      const userData = getUserData();
      
      if (!userData || userData.email !== formData.email || userData.whatsapp !== formData.whatsapp) {
        setError('Email ou WhatsApp incorretos. Por favor, verifique seus dados.');
        return;
      }

      // Login successful
      onComplete(userData);
    } catch (error) {
      console.error('Login error:', error);
      setError('Ocorreu um erro ao fazer login. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <LogIn className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Login
            </h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </div>
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp (sua senha)</span>
                </div>
              </label>
              <input
                type="tel"
                id="whatsapp"
                required
                placeholder="(11) 99999-9999"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Entrar</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-500 text-center">
            Use seu email e número de WhatsApp cadastrado para acessar
          </p>
        </div>
      </div>
    </div>
  );
}