import React from 'react';
import { Volume2, Settings2 } from 'lucide-react';
import { VoiceSettings } from '../types';

interface VoiceSettingsPanelProps {
  settings: VoiceSettings;
  onSettingsChange: (settings: VoiceSettings) => void;
}

export function VoiceSettingsPanel({ settings, onSettingsChange }: VoiceSettingsPanelProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Settings2 className="w-5 h-5 text-blue-600" />
        <h3 className="font-medium text-gray-900">Configuracoes de Voz</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Genero da Voz
          </label>
          <select
            value={settings.gender}
            onChange={(e) => onSettingsChange({ ...settings, gender: e.target.value as 'male' | 'female' })}
            className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="male">Masculino</option>
            <option value="female">Feminino</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Idioma
          </label>
          <select
            value={settings.language}
            onChange={(e) => onSettingsChange({ ...settings, language: e.target.value as 'pt-BR' | 'en-US' })}
            className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="pt-BR">Portugues (Brasil)</option>
            <option value="en-US">English (US)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estilo de Fala
          </label>
          <select
            value={settings.style}
            onChange={(e) => onSettingsChange({ ...settings, style: e.target.value as 'casual' | 'formal' | 'legal' })}
            className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="casual">Descontraido</option>
            <option value="formal">Formal</option>
            <option value="legal">Juridico</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Velocidade
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.rate}
            onChange={(e) => onSettingsChange({ ...settings, rate: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tom de Voz
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.pitch}
            onChange={(e) => onSettingsChange({ ...settings, pitch: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}