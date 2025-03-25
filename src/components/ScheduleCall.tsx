import React, { useState } from 'react';
import { Phone, Calendar, Clock, X, Mail, ExternalLink, MessageCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ScheduleCallProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScheduleCall({ isOpen, onClose }: ScheduleCallProps) {
  const [selectedOption, setSelectedOption] = useState<'whatsapp' | 'email' | null>(null);

  if (!isOpen) return null;

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Olá! Gostaria de agendar uma demonstração do Google Dorks Pro.');
    window.open(`https://wa.me/5511992946628?text=${message}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent('Agendamento de Demonstração - Google Dorks Pro');
    const body = encodeURIComponent('Olá! Gostaria de agendar uma demonstração do Google Dorks Pro.');
    window.open(`mailto:juliocamposmachado@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Phone className="w-6 h-6 text-blue-600" />
            Agendar Atendimento
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Escolha como deseja agendar sua demonstração
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Nossa equipe está pronta para atender você pelos seguintes canais:
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-green-100 hover:border-green-300 bg-green-50 hover:bg-green-100 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-green-900">WhatsApp</h4>
                  <p className="text-sm text-green-700">Resposta em até 5 minutos</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-green-600" />
            </button>

            <button
              onClick={handleEmail}
              className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-blue-100 hover:border-blue-300 bg-blue-50 hover:bg-blue-100 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-blue-900">Email</h4>
                  <p className="text-sm text-blue-700">Resposta em até 24 horas</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-blue-600" />
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Horário de atendimento: Segunda a Sexta, 9h às 18h
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}