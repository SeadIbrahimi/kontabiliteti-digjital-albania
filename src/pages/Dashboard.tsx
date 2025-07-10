
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import ClientDashboard from './ClientDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  return <ClientDashboard />;
};

export default Dashboard;
