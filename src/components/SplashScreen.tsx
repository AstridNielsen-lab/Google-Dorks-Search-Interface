import React from 'react';
import { Search, Heart } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-50 to-white z-50 flex flex-col items-center justify-center">
      <div className="relative">
        <div className="animate-bounce">
          <Search size={64} className="text-blue-600" />
        </div>
        <div className="absolute -top-2 -right-2">
          <Heart 
            size={24} 
            className="text-red-500 animate-[pulse_1s_ease-in-out_infinite]" 
            fill="currentColor"
          />
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Google Dorks Pro Leads
        </h1>
        <p className="text-gray-600 text-lg">
          Like Look Solutions
        </p>
      </div>
      
      <div className="mt-12 relative">
        <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-[loading_2s_ease-in-out]" />
        </div>
      </div>
    </div>
  );
}