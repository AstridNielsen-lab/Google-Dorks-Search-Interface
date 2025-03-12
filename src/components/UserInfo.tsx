import React from 'react';
import { MapPin, Mail, Phone, User } from 'lucide-react';
import { UserData } from '../types';

interface UserInfoProps {
  userData: UserData;
}

export function UserInfo({ userData }: UserInfoProps) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span>{userData.name}</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              <span>{userData.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              <span>{userData.whatsapp}</span>
            </div>
          </div>
          {userData.location && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>
                {userData.location.latitude.toFixed(6)}, {userData.location.longitude.toFixed(6)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}