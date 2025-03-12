import React from 'react';
import { MessageSquare, Calendar, Search } from 'lucide-react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';

interface ChatHistoryProps {
  messages: Message[];
  onSelectMessage: (content: string) => void;
}

export function ChatHistory({ messages, onSelectMessage }: ChatHistoryProps) {
  const chatHistory = messages.filter(msg => msg.role === 'user');

  if (chatHistory.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-50 rounded-lg">
          <MessageSquare className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Histórico de Conversas</h2>
      </div>

      <div className="space-y-4">
        {chatHistory.map((message) => (
          <div
            key={message.id}
            className="group p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all duration-200 cursor-pointer"
            onClick={() => onSelectMessage(message.content)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="line-clamp-2 text-gray-900">
                  <ReactMarkdown className="prose max-w-none text-sm">
                    {message.content}
                  </ReactMarkdown>
                </div>
                {message.keywords && message.keywords.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="p-1 rounded-lg text-purple-600 hover:bg-purple-100 transition-colors"
                  title="Usar esta busca"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{new Date(parseInt(message.id)).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}