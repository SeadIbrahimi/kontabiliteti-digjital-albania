
export interface Notification {
  id: string;
  clientId: string;
  type: 'document_processed' | 'deadline_reminder';
  title: string;
  message: string;
  documentId?: string;
  deadline?: Date;
  isRead: boolean;
  createdAt: Date;
}

export interface DeadlineType {
  id: string;
  name: string;
  category: string;
  daysBefore: number;
  monthlyDay?: number; // për afatet mujore (p.sh. dita 20 e çdo muaji)
  description: string;
}

export const defaultDeadlines: DeadlineType[] = [
  {
    id: 'tvsh',
    name: 'Deklarimi i TVSH-së',
    category: 'tvsh',
    daysBefore: 3,
    monthlyDay: 20,
    description: 'Afati për deklarimin e TVSH-së'
  },
  {
    id: 'pagat',
    name: 'Dorëzimi i Pagave',
    category: 'shpenzime',
    daysBefore: 2,
    monthlyDay: 15,
    description: 'Afati për dorëzimin e pagave'
  },
  {
    id: 'blerje',
    name: 'Deklarimi i Blerjeve',
    category: 'blerje',
    daysBefore: 3,
    monthlyDay: 25,
    description: 'Afati për deklarimin e blerjeve'
  }
];
