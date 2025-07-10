
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import NotificationBell from './NotificationBell';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Kontabiliteti Digjital
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user?.name}</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {user?.role === 'admin' ? 'Kontabilist' : 'Klient'}
              </span>
            </div>
            
            {user?.role === 'client' && <NotificationBell />}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Dil
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
