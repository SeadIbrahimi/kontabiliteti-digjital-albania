export interface Employee {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  assignedClients: string[];
  createdAt: Date;
  isActive: boolean;
  performance?: {
    documentsProcessed: number;
    averageProcessingTime: number; // in hours
    clientSatisfactionScore: number; // 1-5
  };
}

export interface ClientAssignment {
  id: string;
  clientId: string;
  employeeId: string;
  assignedAt: Date;
  assignedBy: string; // admin user ID
}