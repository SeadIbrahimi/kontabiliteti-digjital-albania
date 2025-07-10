
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { FileText, Check, Clock, User } from 'lucide-react';
import { Document } from '@/types/document';
import { useNotifications } from '@/contexts/NotificationContext';

interface DocumentManagementProps {
  documents: Document[];
  clients: Array<{ id: string; name: string; businessName?: string }>;
  onDocumentProcessed: (documentId: string) => void;
}

interface ProcessedDocument {
  documentId: string;
  isProcessed: boolean;
  processedAt?: Date;
}

const DocumentManagement: React.FC<DocumentManagementProps> = ({ 
  documents, 
  clients, 
  onDocumentProcessed 
}) => {
  const { addNotification } = useNotifications();
  const [processedDocs, setProcessedDocs] = useState<ProcessedDocument[]>([]);

  const isDocumentProcessed = (documentId: string) => {
    return processedDocs.find(pd => pd.documentId === documentId)?.isProcessed || false;
  };

  const handleDocumentProcess = (document: Document, isProcessed: boolean) => {
    setProcessedDocs(prev => {
      const existing = prev.find(pd => pd.documentId === document.id);
      if (existing) {
        return prev.map(pd => 
          pd.documentId === document.id 
            ? { ...pd, isProcessed, processedAt: isProcessed ? new Date() : undefined }
            : pd
        );
      } else {
        return [...prev, { 
          documentId: document.id, 
          isProcessed, 
          processedAt: isProcessed ? new Date() : undefined 
        }];
      }
    });

    if (isProcessed) {
      const client = clients.find(c => c.id === document.clientId);
      
      // Dërgo njoftim tek klienti
      addNotification({
        clientId: document.clientId,
        type: 'document_processed',
        title: 'Dokumenti u Regjistrua',
        message: `Dokumenti "${document.fileName}" është regjistruar me sukses nga kontabilisti.`,
        documentId: document.id,
        isRead: false,
      });

      toast({
        title: "Dokumenti u shënua si i regjistruar",
        description: `Klienti ${client?.name} do të marrë njoftim për dokumentin "${document.fileName}"`,
      });

      onDocumentProcessed(document.id);
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.name} (${client.businessName || ''})` : 'Unknown Client';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('sq-AL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const pendingDocuments = documents.filter(doc => !isDocumentProcessed(doc.id));
  const processedDocuments = documents.filter(doc => isDocumentProcessed(doc.id));

  return (
    <div className="space-y-6">
      {/* Dokumentet në pritje */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            Dokumentet në Pritje
            <Badge variant="secondary">{pendingDocuments.length}</Badge>
          </CardTitle>
          <CardDescription>
            Dokumentet që presin për t'u regjistruar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingDocuments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nuk ka dokumente në pritje
            </p>
          ) : (
            <div className="space-y-3">
              {pendingDocuments.map(doc => (
                <Card key={doc.id} className="border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <FileText className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{doc.fileName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <User className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {getClientName(doc.clientId)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Ngarkuar: {formatDate(doc.uploadDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`process-${doc.id}`}
                          checked={isDocumentProcessed(doc.id)}
                          onCheckedChange={(checked) => 
                            handleDocumentProcess(doc, checked as boolean)
                          }
                        />
                        <label 
                          htmlFor={`process-${doc.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          Regjistruar
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dokumentet e regjistruara */}
      {processedDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Dokumentet e Regjistruara
              <Badge variant="secondary">{processedDocuments.length}</Badge>
            </CardTitle>
            <CardDescription>
              Dokumentet që janë regjistruar me sukses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {processedDocuments.slice(0, 10).map(doc => {
                const processedInfo = processedDocs.find(pd => pd.documentId === doc.id);
                return (
                  <Card key={doc.id} className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <FileText className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{doc.fileName}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <User className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">
                                {getClientName(doc.clientId)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Regjistruar: {processedInfo?.processedAt ? formatDate(processedInfo.processedAt) : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <Badge variant="default" className="bg-green-600">
                          <Check className="h-3 w-3 mr-1" />
                          Regjistruar
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentManagement;
