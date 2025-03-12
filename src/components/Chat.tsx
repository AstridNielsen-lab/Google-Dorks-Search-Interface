import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Plus, Volume2, VolumeX } from 'lucide-react';
import { chatWithGemini } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { Message, VoiceSettings } from '../types';
import { getUserData } from '../services/storage';
import { VoiceSettingsPanel } from './VoiceSettings';

interface ChatProps {
  onAddKeywords: (keywords: string[]) => void;
}

export function Chat({ onAddKeywords }: ChatProps) {
  const userData = getUserData();
  const firstName = userData?.name?.split(' ')[0] || 'Visitante';
  
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    role: 'assistant',
    content: `Ola ${firstName}! Sou Julio, seu especialista em Google Dorks. Como posso ajudar voce a encontrar leads qualificados hoje?`
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    gender: 'male',
    language: 'pt-BR',
    style: 'casual',
    rate: 1,
    pitch: 1
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthesis = window.speechSynthesis;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const speakMessage = (text: string) => {
    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceSettings.language;
    utterance.rate = voiceSettings.rate;
    utterance.pitch = voiceSettings.pitch;
    
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.includes(voiceSettings.language) && 
      ((voiceSettings.gender === 'male' && !voice.name.toLowerCase().includes('female')) ||
       (voiceSettings.gender === 'female' && voice.name.toLowerCase().includes('female')))
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    speechSynthesis.speak(utterance);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    const userMessageObj = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: userMessage
    };
    
    setMessages(prev => [...prev, userMessageObj]);
    setIsLoading(true);
    
    try {
      const response = await chatWithGemini(`${firstName} perguntou: ${userMessage}`);
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: response
      };

      setMessages(prev => [...prev, assistantMessage]);
      speakMessage(response);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Desculpe ${firstName}, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.`
      }]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const extractKeywords = (text: string) => {
    const words = text.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['como', 'para', 'que', 'com', 'dos', 'das'].includes(word));
    return [...new Set(words)].slice(0, 5);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-[600px]">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Julio - Especialista em Google Dorks</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            title="Configuracoes de voz"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              title="Parar leitura"
            >
              <VolumeX className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {showVoiceSettings && (
        <div className="p-4 border-b border-gray-200">
          <VoiceSettingsPanel
            settings={voiceSettings}
            onSettingsChange={setVoiceSettings}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
            }`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'assistant' ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              {message.role === 'assistant' ? (
                <Bot className="w-5 h-5 text-blue-600" />
              ) : (
                <User className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <div className={`flex-1 rounded-2xl p-4 ${
              message.role === 'assistant' 
                ? 'bg-blue-50 text-blue-900' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              <ReactMarkdown className="prose max-w-none">
                {message.content}
              </ReactMarkdown>
              {message.role === 'user' && (
                <button
                  onClick={() => onAddKeywords(extractKeywords(message.content))}
                  className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar palavras-chave
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 rounded-2xl p-4 bg-blue-50">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '200ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Descreva seu negocio e que tipo de leads voce procura..."
            className="w-full rounded-xl border-gray-200 pr-12 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}