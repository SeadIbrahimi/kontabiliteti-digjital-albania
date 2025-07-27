
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'employee' | 'client';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  businessName?: string;
  assignedClients?: string[]; // For employees - list of client IDs they manage
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    role: 'admin',
    name: 'Kontabilisti Admin'
  },
  {
    id: '2',
    username: 'klient1',
    role: 'client',
    name: 'Agron Berisha',
    businessName: 'ABC Sh.p.k.'
  },
  {
    id: '3',
    username: 'klient2',
    role: 'client',
    name: 'Fatmira Krasniqi',
    businessName: 'XYZ L.L.C.'
  },
  {
    id: '4',
    username: 'employee1',
    role: 'employee',
    name: 'Besarta Morina',
    assignedClients: ['2']
  },
  {
    id: '5',
    username: 'employee2',
    role: 'employee',
    name: 'Driton Hoxha',
    assignedClients: ['3']
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication - in real app this would be API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.username === username);
    
    if (foundUser && password === '123') { // Simple demo password
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
