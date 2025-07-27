import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Users, Plus, Edit, Trash2, User, TrendingUp, Star } from 'lucide-react';
import { Employee } from '@/types/employee';

interface EmployeeManagementProps {
  employees: Employee[];
  clients: Array<{ id: string; name: string; businessName?: string }>;
  onEmployeeAdd: (employee: Omit<Employee, 'id' | 'createdAt'>) => void;
  onEmployeeUpdate: (id: string, employee: Partial<Employee>) => void;
  onEmployeeDelete: (id: string) => void;
  onClientAssignment: (employeeId: string, clientIds: string[]) => void;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({
  employees,
  clients,
  onEmployeeAdd,
  onEmployeeUpdate,
  onEmployeeDelete,
  onClientAssignment
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
  });

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.username || !newEmployee.email) {
      toast({
        title: "Të dhëna të pakompletuara",
        description: "Plotëso të gjitha fushat e kërkuara",
        variant: "destructive",
      });
      return;
    }

    onEmployeeAdd({
      ...newEmployee,
      assignedClients: [],
      isActive: true,
    });

    setNewEmployee({ name: '', username: '', email: '', phone: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Punonjësi u shtua",
      description: `${newEmployee.name} u shtua në sistem`,
    });
  };

  const handleClientAssignment = (employeeId: string, clientIds: string[]) => {
    onClientAssignment(employeeId, clientIds);
    setIsAssignDialogOpen(false);
    
    toast({
      title: "Caktimi u përditësua",
      description: "Klientët u caktuan me sukses",
    });
  };

  const getEmployeePerformance = (employee: Employee) => {
    if (!employee.performance) return null;
    
    const { documentsProcessed, averageProcessingTime, clientSatisfactionScore } = employee.performance;
    
    return (
      <div className="flex items-center gap-4 text-xs text-gray-600">
        <span>Dok: {documentsProcessed}</span>
        <span>Kohë: {averageProcessingTime.toFixed(1)}h</span>
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-500" />
          <span>{clientSatisfactionScore.toFixed(1)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Menaxhimi i Punonjësve
              </CardTitle>
              <CardDescription>
                Shto, edito dhe cakto punonjës për klientë
              </CardDescription>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Shto Punonjës
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Shto Punonjës të Ri</DialogTitle>
                  <DialogDescription>
                    Plotëso të dhënat për punonjësin e ri
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Emri i Plotë *</Label>
                    <Input
                      id="name"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Emri dhe mbiemri"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      value={newEmployee.username}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="username"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@example.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Telefoni</Label>
                    <Input
                      id="phone"
                      value={newEmployee.phone}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+383 XX XXX XXX"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Anulo
                    </Button>
                    <Button onClick={handleAddEmployee}>
                      Shto Punonjës
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Employee List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map(employee => (
          <Card key={employee.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{employee.name}</h3>
                      <p className="text-xs text-gray-600">@{employee.username}</p>
                    </div>
                  </div>
                  <Badge variant={employee.isActive ? "default" : "secondary"}>
                    {employee.isActive ? "Aktiv" : "Jo-aktiv"}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-600">{employee.email}</p>
                  {employee.phone && (
                    <p className="text-xs text-gray-600">{employee.phone}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700">
                      Klientë të Caktuar
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {employee.assignedClients.length}
                    </Badge>
                  </div>
                  
                  {employee.assignedClients.length > 0 ? (
                    <div className="space-y-1">
                      {employee.assignedClients.slice(0, 2).map(clientId => {
                        const client = clients.find(c => c.id === clientId);
                        return client ? (
                          <div key={clientId} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                            {client.name}
                          </div>
                        ) : null;
                      })}
                      {employee.assignedClients.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{employee.assignedClients.length - 2} të tjera
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">Nuk ka klientë të caktuar</p>
                  )}
                </div>

                {/* Performance */}
                {getEmployeePerformance(employee)}

                <div className="flex justify-between gap-2">
                  <Dialog open={isAssignDialogOpen && selectedEmployee?.id === employee.id} 
                          onOpenChange={(open) => {
                            setIsAssignDialogOpen(open);
                            if (open) setSelectedEmployee(employee);
                          }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        Cakto Klientë
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cakto Klientë - {employee.name}</DialogTitle>
                        <DialogDescription>
                          Zgjidh klientët që do t'i caktosh këtij punonjësi
                        </DialogDescription>
                      </DialogHeader>
                      
                      <ClientAssignmentDialog
                        employee={employee}
                        clients={clients}
                        onAssign={handleClientAssignment}
                        onCancel={() => setIsAssignDialogOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEmployeeUpdate(employee.id, { isActive: !employee.isActive })}
                  >
                    {employee.isActive ? "Çaktivizo" : "Aktivizo"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {employees.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nuk ka punonjës</h3>
            <p className="text-gray-600 mb-4">Shto punonjësin e parë për të filluar</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              Shto Punonjës
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Component for client assignment dialog
const ClientAssignmentDialog: React.FC<{
  employee: Employee;
  clients: Array<{ id: string; name: string; businessName?: string }>;
  onAssign: (employeeId: string, clientIds: string[]) => void;
  onCancel: () => void;
}> = ({ employee, clients, onAssign, onCancel }) => {
  const [selectedClients, setSelectedClients] = useState<string[]>(employee.assignedClients);

  const handleClientToggle = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  return (
    <div className="space-y-4">
      <div className="max-h-64 overflow-y-auto space-y-2">
        {clients.map(client => (
          <div key={client.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`client-${client.id}`}
              checked={selectedClients.includes(client.id)}
              onChange={() => handleClientToggle(client.id)}
              className="rounded border-gray-300"
            />
            <label htmlFor={`client-${client.id}`} className="flex-1 text-sm">
              <div>
                <div className="font-medium">{client.name}</div>
                <div className="text-gray-600">{client.businessName}</div>
              </div>
            </label>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Anulo
        </Button>
        <Button onClick={() => onAssign(employee.id, selectedClients)}>
          Ruaj Caktimin
        </Button>
      </div>
    </div>
  );
};

export default EmployeeManagement;