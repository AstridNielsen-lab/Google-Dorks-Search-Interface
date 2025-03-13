import React from 'react';
import { X, Scale, Shield, FileText, Mail, Phone } from 'lucide-react';

interface CopyrightModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CopyrightModal({ isOpen, onClose }: CopyrightModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700 flex-shrink-0">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <Scale className="w-6 h-6" />
            Proteção Legal do Google Dorks Pro
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-6">
          <div className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Direitos Autorais e Propriedade Intelectual
              </h3>
              <div className="space-y-4 text-gray-700">
                <h4 className="font-medium">1.1. Lei de Direitos Autorais (Brasil)</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Lei nº 9.610/1998 – Lei de Direitos Autorais</li>
                  <li>Art. 7º: Protege programas de computador como obras intelectuais</li>
                  <li>Art. 24º: Garante direitos morais ao criador</li>
                  <li>Art. 29º: Regula cópias e distribuição</li>
                </ul>
                
                <h4 className="font-medium mt-4">1.2. Tratados Internacionais</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Convenção de Berna (1886)</li>
                  <li>Acordo TRIPS</li>
                  <li>Digital Millennium Copyright Act (DMCA)</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Proteção contra Plágio e Uso Indevido
              </h3>
              <div className="space-y-4 text-gray-700">
                <p>O uso não autorizado do Google Dorks Pro está sujeito a penalidades legais:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Art. 184 – Violação de direito autoral (2 a 4 anos de reclusão)</li>
                  <li>Art. 171 – Estelionato e fraude digital (1 a 5 anos)</li>
                  <li>Art. 195 da Lei de Propriedade Industrial</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Proteção do Código-fonte</h3>
              <div className="space-y-4 text-gray-700">
                <ul className="list-disc pl-5 space-y-2">
                  <li>LGPD (Lei nº 13.709/2018)</li>
                  <li>Marco Civil da Internet (Lei nº 12.965/2014)</li>
                  <li>Lei dos Crimes Cibernéticos (Lei nº 12.737/2012)</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Uso Ético e Responsável</h3>
              <div className="space-y-4 text-gray-700">
                <p>O Google Dorks Pro deve ser utilizado de forma ética, respeitando:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Privacidade e termos de uso do Google</li>
                  <li>LGPD - Lei nº 13.709/2018</li>
                  <li>Código Penal Brasileiro - Art. 154-A</li>
                </ul>
              </div>
            </section>

            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contato para Assuntos Legais</h3>
              <div className="space-y-2">
                <p className="text-gray-700"><strong>Julio Campos Machado</strong> (Criador e Desenvolvedor)</p>
                <p className="text-gray-700">Empresa: Like Look Solutions</p>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp: +55 11 99294-6628</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4" />
                  <span>Email: juliocamposmachado@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}