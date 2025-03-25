import React, { useState, useEffect } from 'react';
import { Bell, Mic, X, Shield, AlertTriangle } from 'lucide-react';

interface PermissionsConsentProps {
  onGranted: () => void;
}

export function PermissionsConsent({ onGranted }: PermissionsConsentProps) {
  const [showConsent, setShowConsent] = useState(true);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [microphonePermission, setMicrophonePermission] = useState<PermissionState>('prompt');

  useEffect(() => {
    // Check existing permissions
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    navigator.permissions.query({ name: 'microphone' as PermissionName })
      .then(result => {
        setMicrophonePermission(result.state);
      });
  }, []);

  const requestPermissions = async () => {
    try {
      // Request notification permission
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
      }

      // Request microphone permission
      const micPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
      micPermission.getTracks().forEach(track => track.stop()); // Clean up
      setMicrophonePermission('granted');

      // Save consent in localStorage
      localStorage.setItem('permissions-granted', 'true');
      
      // Notify parent component
      onGranted();
      setShowConsent(false);
    } catch (error) {
      console.error('Error requesting permissions:', error);
      alert('Erro ao solicitar permissões. Por favor, verifique as configurações do seu navegador.');
    }
  };

  if (!showConsent || localStorage.getItem('permissions-granted') === 'true') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Permissões Necessárias</h2>
          </div>
          <button
            onClick={() => setShowConsent(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-700">
                Para fornecer a melhor experiência possível, precisamos da sua permissão para:
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-lg p-2">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Notificações</h3>
                <p className="text-sm text-gray-600">
                  Permite que nosso assistente acompanhe e responda suas interações no WhatsApp em tempo real.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-lg p-2">
                <Mic className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Microfone</h3>
                <p className="text-sm text-gray-600">
                  Necessário para transcrição de áudio e interações por voz com nosso assistente.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={requestPermissions}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              Conceder Permissões
            </button>
            
            <p className="mt-4 text-sm text-gray-500 text-center">
              Ao conceder as permissões, você concorda com nossos{' '}
              <a href="#" className="text-blue-600 hover:underline">Termos de Uso</a> e{' '}
              <a href="#" className="text-blue-600 hover:underline">Política de Privacidade</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}