
import React, { useState } from 'react';
import Header from '@/components/Header';
import DocumentList from '@/components/DocumentList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, FileText, Calendar, TrendingUp, Eye } from 'lucide-react';
import { Document } from '@/types/document';

const AdminDashboard: React.FC = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  
  // Mock data for demo
  const clients = [
    { id: '2', name: 'Agron Berisha', businessName: 'ABC Sh.p.k.' },
    { id: '3', name: 'Fatmira Krasniqi', businessName: 'XYZ L.L.C.' },
  ];

  // Mock documents for demo
  const allDocuments: Document[] = [
    {
      id: '1',
      clientId: '2',
      fileName: 'fatura-tvsh-mars-2024.pdf',
      fileUrl: '',
      category: 'tvsh',
      uploadDate: new Date('2024-03-15'),
      fileSize: 1024000,
      fileType: 'application/pdf',
    },
    {
      id: '2',
      clientId: '2',
      fileName: 'shpenzime-zyra-mars.jpg',
      fileUrl: '',
      category: 'shpenzime',
      uploadDate: new Date('2024-03-10'),
      fileSize: 2048000,
      fileType: 'image/jpeg',
    },
    {
      id: '3',
      clientId: '3',
      fileName: 'import-mallra-shkurt.pdf',
      fileUrl: '',
      category: 'import',
      uploadDate: new Date('2024-02-28'),
      fileSize: 1536000,
      fileType: 'application/pdf',
    },
  ];

  const stats = {
    totalClients: clients.length,
    totalDocuments: allDocuments.length,
    thisMonth: allDocuments.filter(doc => {
      const docDate = new Date(doc.uploadDate);
      const now = new Date();
      return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear();
    }).length,
    pendingReview: Math.floor(allDocuments.length * 0.3), // Mock pending count
  };

  const documentsToShow = selectedClientId 
    ? allDocuments.filter(doc => doc.clientId === selectedClientId)
    : allDocuments;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Klientë Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Dokumente Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Këtë Muaj</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Në Pritje</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingReview}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista e Klientëve
            </CardTitle>
            <CardDescription>
              Kliko në një klient për të parë dokumentet e tij
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card 
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedClientId === null ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedClientId(null)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Të gjithë klientët</h3>
                      <p className="text-sm text-gray-600">Shfaq të gjitha dokumentet</p>
                    </div>
                    <Badge variant="secondary">
                      {allDocuments.length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {clients.map(client => {
                const clientDocs = allDocuments.filter(doc => doc.clientId === client.id);
                return (
                  <Card 
                    key={client.id}
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedClientId === client.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedClientId(client.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{client.name}</h3>
                          <p className="text-sm text-gray-600">{client.businessName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {clientDocs.length}
                          </Badge>
                          <Eye className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <div>
          <DocumentList 
            documents={documentsToShow} 
            showClientFilter={selectedClientId === null}
            clients={clients}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
