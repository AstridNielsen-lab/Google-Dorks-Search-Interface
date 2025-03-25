import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Clock, X, MessageSquare } from 'lucide-react';
import { format, addDays, setHours, setMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ScheduleCallProps {
  isOpen: boolean;
  onClose: () => void;
}

type ContactMethod = 'call' | 'whatsapp';

export function ScheduleCall({ isOpen, onClose }: ScheduleCallProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('call');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Google Calendar API
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client:auth2', initClient);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initClient = () => {
    window.gapi.client.init({
      apiKey: 'AIzaSyA4orZAiyXf-bMV5cNL03qz3ZzL0n2h5H8',
      clientId: '29008060-app.apps.googleusercontent.com',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: 'https://www.googleapis.com/auth/calendar.events'
    });
  };

  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const initiateContact = () => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    if (contactMethod === 'call') {
      window.location.href = `tel:+55${cleanNumber}`;
    } else {
      window.location.href = `https://wa.me/55${cleanNumber}?text=Olá! Seu agendamento para ${format(selectedDate, 'dd/MM/yyyy')} às ${selectedTime} foi confirmado.`;
    }
  };

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !phoneNumber) return;

    setLoading(true);
    setError(null);

    try {
      await window.gapi.auth2.getAuthInstance().signIn();

      const [hours, minutes] = selectedTime.split(':');
      const startTime = setMinutes(setHours(selectedDate, parseInt(hours)), parseInt(minutes));
      const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 minutes duration

      const event = {
        summary: 'Atendimento Google Dorks Pro',
        description: `Atendimento via ${contactMethod === 'call' ? 'ligação' : 'WhatsApp'}\nTelefone: ${phoneNumber}`,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };

      await window.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event
      });

      setSuccess(true);
      initiateContact();
      
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error scheduling:', err);
      setError('Erro ao agendar. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {contactMethod === 'call' ? (
                  <Phone className="w-8 h-8 text-green-600" />
                ) : (
                  <MessageSquare className="w-8 h-8 text-green-600" />
                )}
              </div>
              <h3 className="text-lg font-medium text-green-900">Agendamento Confirmado!</h3>
              <p className="mt-2 text-sm text-green-600">
                {contactMethod === 'call' 
                  ? 'Iniciando chamada...'
                  : 'Abrindo WhatsApp...'}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Contato
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setContactMethod('call')}
                      className={`p-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                        contactMethod === 'call'
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Phone className="w-5 h-5" />
                      <span>Ligação</span>
                    </button>
                    <button
                      onClick={() => setContactMethod('whatsapp')}
                      className={`p-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                        contactMethod === 'whatsapp'
                          ? 'bg-green-100 text-green-700 border-2 border-green-500'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={15}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Data
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1, 2, 3].map((dayOffset) => {
                      const date = addDays(new Date(), dayOffset);
                      return (
                        <button
                          key={dayOffset}
                          onClick={() => setSelectedDate(date)}
                          className={`p-3 rounded-lg text-center transition-colors ${
                            format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                              ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="text-xs uppercase">
                            {format(date, 'EEE', { locale: ptBR })}
                          </div>
                          <div className="font-semibold">
                            {format(date, 'd')}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Horário
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 rounded-lg text-center transition-colors ${
                          selectedTime === time
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <button
                onClick={handleSchedule}
                disabled={!selectedDate || !selectedTime || !phoneNumber || loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Agendando...</span>
                  </>
                ) : (
                  <>
                    {contactMethod === 'call' ? (
                      <Phone className="w-5 h-5" />
                    ) : (
                      <MessageSquare className="w-5 h-5" />
                    )}
                    <span>Confirmar Agendamento</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}