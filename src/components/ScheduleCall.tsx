import React, { useState } from 'react';
import { 
  Phone, X, Mail, ExternalLink, MessageCircle, 
  Stethoscope, Scissors, Heart, Shield, AlertCircle,
  UserCog, ShoppingCart, CreditCard, Users
} from 'lucide-react';

interface ScheduleCallProps {
  isOpen: boolean;
  onClose: () => void;
}

type ServiceCategory = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  urgent: boolean;
  color: string;
};

export function ScheduleCall({ isOpen, onClose }: ScheduleCallProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showContactOptions, setShowContactOptions] = useState(false);

  if (!isOpen) return null;

  const serviceCategories: ServiceCategory[] = [
    {
      id: 'medical',
      title: 'Agendamento Médico',
      description: 'Consultas de rotina e especialidades',
      icon: <Stethoscope className="w-6 h-6" />,
      urgent: false,
      color: 'blue'
    },
    {
      id: 'beauty',
      title: 'Salão de Beleza',
      description: 'Cabelo, estética e bem-estar',
      icon: <Scissors className="w-6 h-6" />,
      urgent: false,
      color: 'pink'
    },
    {
      id: 'rehab',
      title: 'Clínica de Recuperação',
      description: 'Tratamento e apoio especializado',
      icon: <Heart className="w-6 h-6" />,
      urgent: false,
      color: 'purple'
    },
    {
      id: 'police',
      title: 'Emergência Policial',
      description: 'Assaltos e ocorrências',
      icon: <Shield className="w-6 h-6" />,
      urgent: true,
      color: 'red'
    },
    {
      id: 'emergency',
      title: 'Emergência Médica',
      description: 'Atendimento urgente',
      icon: <AlertCircle className="w-6 h-6" />,
      urgent: true,
      color: 'red'
    },
    {
      id: 'elderly',
      title: 'Assistência ao Idoso',
      description: 'Cuidados especializados',
      icon: <Users className="w-6 h-6" />,
      urgent: false,
      color: 'green'
    },
    {
      id: 'shopping',
      title: 'Lista de Compras',
      description: 'Assistência com compras',
      icon: <ShoppingCart className="w-6 h-6" />,
      urgent: false,
      color: 'yellow'
    },
    {
      id: 'bills',
      title: 'Negociação de Dívidas',
      description: 'Cartões e contas atrasadas',
      icon: <CreditCard className="w-6 h-6" />,
      urgent: false,
      color: 'orange'
    }
  ];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setShowContactOptions(true);
  };

  const handleBack = () => {
    setShowContactOptions(false);
    setSelectedService(null);
  };

  const handleWhatsApp = () => {
    const selectedServiceData = serviceCategories.find(s => s.id === selectedService);
    const message = encodeURIComponent(
      `Olá! Gostaria de agendar um atendimento para ${selectedServiceData?.title.toLowerCase()}.`
    );
    window.open(`https://wa.me/5511992946628?text=${message}`, '_blank');
  };

  const handleEmail = () => {
    const selectedServiceData = serviceCategories.find(s => s.id === selectedService);
    const subject = encodeURIComponent(`Agendamento - ${selectedServiceData?.title}`);
    const body = encodeURIComponent(
      `Olá! Gostaria de agendar um atendimento para ${selectedServiceData?.title.toLowerCase()}.`
    );
    window.open(`mailto:juliocamposmachado@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  const getEmergencyNumber = (serviceId: string): string => {
    switch (serviceId) {
      case 'police': return '190';
      case 'emergency': return '192';
      case 'elderly': return '100';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Phone className="w-6 h-6 text-blue-600" />
            {showContactOptions ? 'Escolha o Tipo de Contato' : 'Selecione o Serviço'}
          </h2>
          <div className="flex items-center gap-2">
            {showContactOptions && (
              <button
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-800"
              >
                Voltar
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!showContactOptions ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceCategories.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`w-full flex items-center p-4 rounded-xl border-2 transition-all duration-200
                    ${service.urgent 
                      ? 'border-red-200 hover:border-red-400 bg-red-50 hover:bg-red-100' 
                      : `border-${service.color}-100 hover:border-${service.color}-300 bg-${service.color}-50 hover:bg-${service.color}-100`
                    }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center
                      ${service.urgent ? 'bg-red-100' : `bg-${service.color}-100`}`}
                    >
                      {service.icon}
                    </div>
                    <div className="text-left">
                      <h4 className={`font-medium ${service.urgent ? 'text-red-900' : `text-${service.color}-900`}`}>
                        {service.title}
                      </h4>
                      <p className={`text-sm ${service.urgent ? 'text-red-700' : `text-${service.color}-700`}`}>
                        {service.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {selectedService && (
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {serviceCategories.find(s => s.id === selectedService)?.title}
                  </h3>
                  {getEmergencyNumber(selectedService) && (
                    <div className="mt-4 p-4 bg-red-50 rounded-lg border-2 border-red-200">
                      <p className="text-red-700 font-bold">
                        Emergência - Ligue {getEmergencyNumber(selectedService)}
                      </p>
                      <p className="text-sm text-red-600 mt-1">
                        Em caso de emergência, ligue imediatamente para o número acima
                      </p>
                    </div>
                  )}
                </div>
              )}

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
            </div>
          )}

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