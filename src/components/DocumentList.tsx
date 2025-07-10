
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Eye, Calendar, Filter } from 'lucide-react';
import { Document, DocumentCategory, categoryLabels } from '@/types/document';

interface DocumentListProps {
  documents: Document[];
  showClientFilter?: boolean;
  clients?: Array<{ id: string; name: string; businessName?: string }>;
}

const DocumentList: React.FC<DocumentListProps> = ({ 
  documents, 
  showClientFilter = false, 
  clients = [] 
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedClient, setSelectedClient] = useState<string>('all');

  const months = [
    { value: 'all', label: 'Të gjitha muajt' },
    { value: '1', label: 'Janar' },
    { value: '2', label: 'Shkurt' },
    { value: '3', label: 'Mars' },
    { value: '4', label: 'Prill' },
    { value: '5', label: 'Maj' },
    { value: '6', label: 'Qershor' },
    { value: '7', label: 'Korrik' },
    { value: '8', label: 'Gusht' },
    { value: '9', label: 'Shtator' },
    { value: '10', label: 'Tetor' },
    { value: '11', label: 'Nëntor' },
    { value: '12', label: 'Dhjetor' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  const filteredDocuments = documents.filter(doc => {
    const docDate = new Date(doc.uploadDate);
    const monthMatch = selectedMonth === 'all' || docDate.getMonth() + 1 === parseInt(selectedMonth);
    const yearMatch = docDate.getFullYear().toString() === selectedYear;
    const clientMatch = selectedClient === 'all' || doc.clientId === selectedClient;
    
    return monthMatch && yearMatch && clientMatch;
  });

  const documentsByCategory = Object.keys(categoryLabels).reduce((acc, category) => {
    acc[category as DocumentCategory] = filteredDocuments.filter(doc => doc.category === category);
    return acc;
  }, {} as Record<DocumentCategory, Document[]>);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('sq-AL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.name} (${client.businessName || ''})` : 'Unknown Client';
  };

  const DocumentCard: React.FC<{ doc: Document }> = ({ doc }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{doc.fileName}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {categoryLabels[doc.category]}
                </Badge>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(doc.uploadDate)}
                </span>
              </div>
              {showClientFilter && (
                <p className="text-xs text-gray-600 mt-1">
                  {getClientName(doc.clientId)}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-1 ml-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtrat
          </CardTitle>
          <CardDescription>
            Filtro dokumentet sipas datës {showClientFilter && 'dhe klientit'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Muaji</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Viti</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {showClientFilter && (
              <div>
                <label className="text-sm font-medium mb-2 block">Klienti</label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Të gjithë klientët</SelectItem>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} ({client.businessName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="tvsh" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <TabsTrigger key={key} value={key} className="text-xs md:text-sm">
              {label}
              <Badge variant="secondary" className="ml-1 text-xs">
                {documentsByCategory[key as DocumentCategory]?.length || 0}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {Object.entries(categoryLabels).map(([key, label]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{label}</h3>
              <span className="text-sm text-gray-500">
                {documentsByCategory[key as DocumentCategory]?.length || 0} dokumente
              </span>
            </div>
            
            {documentsByCategory[key as DocumentCategory]?.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">Nuk ka dokumente në këtë kategori</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {documentsByCategory[key as DocumentCategory]?.map(doc => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DocumentList;
