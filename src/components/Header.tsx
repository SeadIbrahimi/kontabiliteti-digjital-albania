
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, FileText } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Sistemi i Kontabilitetit
              </h1>
              <p className="text-sm text-gray-500">
                {user?.role === 'admin' ? 'Panel Administrimi' : 'Panel Klienti'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-600" />
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              {user?.businessName && (
                <p className="text-xs text-gray-500">{user.businessName}</p>
              )}
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Dil
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
