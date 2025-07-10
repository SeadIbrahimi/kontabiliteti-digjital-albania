
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppNotification, DeadlineType, defaultDeadlines } from '@/types/notification';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  checkDeadlines: () => void;
  requestNotificationPermission: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  };

  const showBrowserNotification = (title: string, message: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
  };

  const addNotification = (notification: Omit<AppNotification, 'id' | 'createdAt'>) => {
    const newNotification: AppNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Shfaq browser notification
    showBrowserNotification(newNotification.title, newNotification.message);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const checkDeadlines = () => {
    if (!user || user.role !== 'client') return;

    const today = new Date();
    
    defaultDeadlines.forEach(deadline => {
      const nextDeadline = new Date();
      if (deadline.monthlyDay) {
        nextDeadline.setDate(deadline.monthlyDay);
        if (nextDeadline <= today) {
          nextDeadline.setMonth(nextDeadline.getMonth() + 1);
        }
      }

      const daysUntilDeadline = Math.ceil((nextDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDeadline <= deadline.daysBefore && daysUntilDeadline > 0) {
        // Kontrollo nëse njoftimi është dërguar tashmë për këtë afat
        const existingNotification = notifications.find(n => 
          n.type === 'deadline_reminder' && 
          n.deadline?.toDateString() === nextDeadline.toDateString()
        );

        if (!existingNotification) {
          addNotification({
            clientId: user.id,
            type: 'deadline_reminder',
            title: `Paralajmërim: ${deadline.name}`,
            message: `${deadline.description} - Afati: ${nextDeadline.toLocaleDateString('sq-AL')} (${daysUntilDeadline} ditë të mbetura)`,
            deadline: nextDeadline,
            isRead: false,
          });
        }
      }
    });
  };

  // Kontrollo afatet çdo ditë në mëngjes
  useEffect(() => {
    const checkDaily = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0); // 9:00 AM

      const timeUntilTomorrow = tomorrow.getTime() - now.getTime();
      
      setTimeout(() => {
        checkDeadlines();
        setInterval(checkDeadlines, 24 * 60 * 60 * 1000); // Çdo 24 orë
      }, timeUntilTomorrow);
    };

    checkDaily();
    checkDeadlines(); // Kontrollo menjëherë
  }, [user]);

  // Request permission kur komponenti ngrihet
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const value = {
    notifications: notifications.filter(n => n.clientId === user?.id),
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    checkDeadlines,
    requestNotificationPermission,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
