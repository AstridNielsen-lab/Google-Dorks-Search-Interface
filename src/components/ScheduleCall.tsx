import React, { useState, useEffect, useRef } from 'react';
import { Phone, Calendar, Clock, X, MessageSquare, AlertTriangle, Stethoscope, Scissors, Heart, Shield, UserCog, ShoppingCart, CreditCard, Mic, MicOff } from 'lucide-react';
import { format, addDays, setHours, setMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getSchedulingRecommendations, chatWithGemini } from '../services/gemini';

interface ScheduleCallProps {
  isOpen: boolean;
  onClose: () => void;
}

type ContactMethod = 'call' | 'whatsapp';

type ServiceType = 
  | 'medical'
  | 'beauty'
  | 'rehab'
  | 'police'
  | 'emergency'
  | 'elderly'
  | 'shopping'
  | 'financial';

interface ServiceOption {
  id: ServiceType;
  name: string;
  icon: React.ReactNode;
  description: string;
  urgent: boolean;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
}

const serviceOptions: ServiceOption[] = [
  {
    id: 'medical',
    name: 'Agendamento Médico',
    icon: <Stethoscope className="w-5 h-5" />,
    description: 'Consultas e exames médicos',
    urgent: false
  },
  {
    id: 'beauty',
    name: 'Salão de Beleza',
    icon: <Scissors className="w-5 h-5" />,
    description: 'Serviços de beleza e estética',
    urgent: false
  },
  {
    id: 'rehab',
    name: 'Clínica de Recuperação',
    icon: <Heart className="w-5 h-5" />,
    description: 'Tratamento para dependência química',
    urgent: true
  },
  {
    id: 'police',
    name: 'Emergência Policial',
    icon: <Shield className="w-5 h-5" />,
    description: 'Ocorrências e denúncias',
    urgent: true
  },
  {
    id: 'emergency',
    name: 'Emergência Médica',
    icon: <AlertTriangle className="w-5 h-5" />,
    description: 'Atendimento médico urgente',
    urgent: true
  },
  {
    id: 'elderly',
    name: 'Assistência ao Idoso',
    icon: <UserCog className="w-5 h-5" />,
    description: 'Cuidados especializados',
    urgent: false
  },
  {
    id: 'shopping',
    name: 'Lista de Compras',
    icon: <ShoppingCart className="w-5 h-5" />,
    description: 'Auxílio com compras',
    urgent: false
  },
  {
    id: 'financial',
    name: 'Negociação Financeira',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Contas e dívidas',
    urgent: false
  }
];

export function ScheduleCall({ isOpen, onClose }: ScheduleCallProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('call');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [recommendations, setRecommendations] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (window.SpeechRecognition || (window as any).webkitSpeechRecognition) {
      recognition.current = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'pt-BR';

      recognition.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        handleSendMessage(transcript);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (selectedService) {
      loadRecommendations();
      const service = serviceOptions.find(opt => opt.id === selectedService);
      if (service) {
        addBotMessage(`Olá! Vou ajudar você com o agendamento para ${service.name}. Como posso auxiliar?`);
      }
    }
  }, [selectedService]);

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
      clientId: '576436264059-uvrrmedk2s5sc29frk7hs377ailql9t1.apps.googleusercontent.com',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: 'https://www.googleapis.com/auth/calendar.events'
    });
  };

  const toggleListening = () => {
    if (!recognition.current) return;

    if (isListening) {
      recognition.current.stop();
    } else {
      try {
        recognition.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const addBotMessage = async (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: false
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      const response = await chatWithGemini(text.trim());
      addBotMessage(response);
    } catch (error) {
      console.error('Error getting bot response:', error);
      addBotMessage('Desculpe, não consegui processar sua mensagem. Como posso ajudar de outra forma?');
    }
  };

  const loadRecommendations = async () => {
    if (!selectedService) return;
    
    const service = serviceOptions.find(opt => opt.id === selectedService);
    if (!service) return;

    const recs = await getSchedulingRecommendations(service.name);
    setRecommendations(recs);
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
    const service = serviceOptions.find(opt => opt.id === selectedService);
    
    if (contactMethod === 'call') {
      window.location.href = `tel:+55${cleanNumber}`;
    } else {
      const message = `Olá! Seu agendamento para ${service?.name} em ${format(selectedDate, 'dd/MM/yyyy')} às ${selectedTime} foi confirmado.`;
      window.location.href = `https://wa.me/55${cleanNumber}?text=${encodeURIComponent(message)}`;
    }
  };

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !phoneNumber || !selectedService) return;

    setLoading(true);
    setError(null);

    try {
      await window.gapi.auth2.getAuthInstance().signIn();

      const [hours, minutes] = selectedTime.split(':');
      const startTime = setMinutes(setHours(selectedDate, parseInt(hours)), parseInt(minutes));
      const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 minutes duration

      const service = serviceOptions.find(opt => opt.id === selectedService);

      const event = {
        summary: `Atendimento: ${service?.name}`,
        description: `Tipo: ${service?.name}\nMétodo: ${contactMethod === 'call' ? 'Ligação' : 'WhatsApp'}\nTelefone: ${phoneNumber}`,
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

  const selectedServiceOption = serviceOptions.find(opt => opt.id === selectedService);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <Phone className="w-6 h-6" />
            Agendar Atendimento
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
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
              {/* Service Type Selection */}
              {!selectedService ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {serviceOptions.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        service.urgent
                          ? 'border-red-200 hover:border-red-400 bg-red-50'
                          : 'border-blue-200 hover:border-blue-400 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          service.urgent ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          {service.icon}
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600">{service.description}</p>
                          {service.urgent && (
                            <span className="inline-flex items-center px-2 py-1 mt-2 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Urgente
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Selected Service Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        selectedServiceOption?.urgent ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {selectedServiceOption?.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{selectedServiceOption?.name}</h3>
                        <p className="text-sm text-gray-600">{selectedServiceOption?.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedService(null);
                        setMessages([]);
                      }}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Chat Interface */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div 
                      ref={chatContainerRef}
                      className="h-60 overflow-y-auto mb-4 space-y-4"
                    >
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-xl p-3 ${
                              message.isUser
                                ? 'bg-blue-100 text-blue-900'
                                : 'bg-white border border-gray-200 text-gray-900'
                            }`}
                          >
                            {message.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={toggleListening}
                        className={`p-2 rounded-lg transition-colors ${
                          isListening
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                      >
                        {isListening ? (
                          <MicOff className="w-5 h-5" />
                        ) : (
                          <Mic className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleSendMessage(inputMessage)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  {recommendations && (
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Recomendações</h4>
                      <div className="text-sm text-blue-800 whitespace-pre-line">
                        {recommendations}
                      </div>
                    </div>
                  )}

                  {/* Contact Method */}
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

                  {/* Phone Number */}
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

                  {/* Date Selection */}
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

                  {/* Time Selection */}
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

                  {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
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
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}