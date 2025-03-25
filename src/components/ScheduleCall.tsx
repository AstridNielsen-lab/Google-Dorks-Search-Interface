import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Clock, X, MessageSquare, Send, Bot, PhoneCall } from 'lucide-react';
import { format, addDays, setHours, setMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import axios from 'axios';

interface ScheduleCallProps {
  isOpen: boolean;
  onClose: () => void;
}

type ContactMethod = 'call' | 'whatsapp' | 'immediate';

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyA4orZAiyXf-bMV5cNL03qz3ZzL0n2h5H8";

// Bot instructions for different interaction types
const BOT_INSTRUCTIONS = {
  call: `Você é um assistente de vendas profissional da Google Dorks Pro. Ao atender uma ligação:
1. Cumprimente cordialmente usando o nome do cliente
2. Mencione que está retornando o contato sobre o assunto específico informado
3. Faça perguntas relevantes para entender melhor a necessidade
4. Explique como o Google Dorks Pro pode ajudar neste caso específico
5. Sugira uma demonstração prática da ferramenta
6. Mantenha um tom profissional e prestativo
7. Ofereça um desconto especial para fechamento imediato
8. Agende uma reunião de acompanhamento se necessário`,

  whatsapp: `Você é um consultor de vendas do Google Dorks Pro no WhatsApp. Ao iniciar uma conversa:
1. Envie uma mensagem personalizada usando o nome do cliente
2. Mencione que está respondendo sobre o assunto específico informado
3. Use emojis estrategicamente para tornar a conversa mais envolvente
4. Faça perguntas para qualificar a necessidade
5. Compartilhe casos de sucesso relevantes
6. Ofereça uma demonstração ao vivo da ferramenta
7. Apresente condições especiais para fechamento
8. Mantenha um tom profissional mas amigável`,

  immediate: `Você é um especialista em Google Dorks Pro. Em cada interação:
1. Cumprimente usando o nome do cliente
2. Foque no assunto específico informado
3. Forneça dicas práticas e personalizadas
4. Sugira estratégias de busca específicas para o caso
5. Compartilhe exemplos de uso bem-sucedidos
6. Mantenha o foco na solução do problema apresentado
7. Ofereça suporte adicional se necessário`
};

export function ScheduleCall({ isOpen, onClose }: ScheduleCallProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('call');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [subject, setSubject] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [userMessage, setUserMessage] = useState('');
  const [showChat, setShowChat] = useState(false);

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

  const initiateContact = async () => {
    if (!userName || !subject) {
      setError('Por favor, preencha seu nome e o assunto.');
      return;
    }

    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    if (contactMethod === 'call') {
      // Prepare AI for call before initiating
      try {
        const response = await axios.post(
          API_URL,
          {
            contents: [{
              parts: [{
                text: `${BOT_INSTRUCTIONS.call}\n\nPreparar atendimento para:\nCliente: ${userName}\nAssunto: ${subject}\n\nGere uma resposta inicial para começar o atendimento:`
              }]
            }]
          },
          {
            params: { key: API_KEY },
            headers: { 'Content-Type': 'application/json' }
          }
        );

        // Store the AI response for the call
        localStorage.setItem('callScript', response.data.candidates[0].content.parts[0].text);
        
        // Initiate the call
        window.location.href = `tel:+55${cleanNumber}`;
      } catch (error) {
        console.error('Error preparing call:', error);
        setError('Erro ao preparar o atendimento. Por favor, tente novamente.');
        return;
      }
    } else if (contactMethod === 'whatsapp') {
      try {
        // Prepare AI response for WhatsApp
        const response = await axios.post(
          API_URL,
          {
            contents: [{
              parts: [{
                text: `${BOT_INSTRUCTIONS.whatsapp}\n\nPreparar mensagem inicial para:\nCliente: ${userName}\nAssunto: ${subject}\n\nGere uma mensagem de WhatsApp inicial:`
              }]
            }]
          },
          {
            params: { key: API_KEY },
            headers: { 'Content-Type': 'application/json' }
          }
        );

        const initialMessage = response.data.candidates[0].content.parts[0].text;
        window.location.href = `https://wa.me/55${cleanNumber}?text=${encodeURIComponent(initialMessage)}`;
      } catch (error) {
        console.error('Error preparing WhatsApp message:', error);
        setError('Erro ao preparar a mensagem. Por favor, tente novamente.');
        return;
      }
    } else if (contactMethod === 'immediate') {
      setShowChat(true);
      handleImmediateChat();
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  const handleImmediateChat = async () => {
    if (!userMessage.trim()) return;

    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setUserMessage('');
    setLoading(true);

    try {
      const response = await axios.post(
        API_URL,
        {
          contents: [{
            parts: [{
              text: `${BOT_INSTRUCTIONS[contactMethod]}\n\nUsuário (${userName}): ${userMessage}\nAssunto: ${subject}\n\nAssistente:`
            }]
          }]
        },
        {
          params: { key: API_KEY },
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const botResponse = response.data.candidates[0].content.parts[0].text;
      setChatMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
    } catch (error) {
      console.error('Error in chat:', error);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro. Por favor, tente novamente.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !phoneNumber || !userName || !subject) return;

    setLoading(true);
    setError(null);

    try {
      await window.gapi.auth2.getAuthInstance().signIn();

      const [hours, minutes] = selectedTime.split(':');
      const startTime = setMinutes(setHours(selectedDate, parseInt(hours)), parseInt(minutes));
      const endTime = new Date(startTime.getTime() + 30 * 60000);

      const event = {
        summary: `Atendimento Google Dorks Pro - ${userName}`,
        description: `Atendimento via ${contactMethod === 'call' ? 'ligação' : 'WhatsApp'}\nTelefone: ${phoneNumber}\nAssunto: ${subject}`,
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
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                ) : contactMethod === 'whatsapp' ? (
                  <MessageSquare className="w-8 h-8 text-green-600" />
                ) : (
                  <Bot className="w-8 h-8 text-green-600" />
                )}
              </div>
              <h3 className="text-lg font-medium text-green-900">
                {contactMethod === 'immediate' ? 'Chat iniciado!' : 'Iniciando contato!'}
              </h3>
              <p className="mt-2 text-sm text-green-600">
                {contactMethod === 'call' 
                  ? 'Iniciando chamada...'
                  : contactMethod === 'whatsapp'
                  ? 'Abrindo WhatsApp...'
                  : 'Conectando ao assistente...'}
              </p>
            </div>
          ) : showChat ? (
            <div className="space-y-4">
              <div className="h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      msg.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto"></div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleImmediateChat}
                  disabled={loading || !userMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {/* User Information */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Seu Nome
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Digite seu nome completo"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Assunto
                    </label>
                    <textarea
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Descreva brevemente o assunto que deseja tratar"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Contato
                  </label>
                  <div className="grid grid-cols-3 gap-2">
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
                    <button
                      onClick={() => setContactMethod('immediate')}
                      className={`p-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                        contactMethod === 'immediate'
                          ? 'bg-purple-100 text-purple-700 border-2 border-purple-500'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Bot className="w-5 h-5" />
                      <span>Imediato</span>
                    </button>
                  </div>
                </div>

                {contactMethod !== 'immediate' && (
                  <>
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

                    <div className="flex gap-4">
                      <button
                        onClick={initiateContact}
                        disabled={!phoneNumber || !userName || !subject}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {contactMethod === 'call' ? (
                          <PhoneCall className="w-5 h-5" />
                        ) : (
                          <MessageSquare className="w-5 h-5" />
                        )}
                        <span>Contatar Agora</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedDate(new Date());
                          setSelectedTime('09:00');
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Calendar className="w-5 h-5" />
                        <span>Agendar</span>
                      </button>
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
                  </>
                )}
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                {contactMethod === 'immediate' ? (
                  <button
                    onClick={() => {
                      setShowChat(true);
                      initiateContact();
                    }}
                    disabled={!userName || !subject}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Bot className="w-5 h-5" />
                    <span>Iniciar Chat Imediato</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSchedule}
                    disabled={!selectedDate || !selectedTime || !phoneNumber || !userName || !subject || loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        <span>Agendando...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-5 h-5" />
                        <span>Confirmar Agendamento</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}