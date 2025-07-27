
import React, { useState } from 'react';
import Header from '@/components/Header';
import DocumentUpload from '@/components/DocumentUpload';
import DocumentList from '@/components/DocumentList';
import { useAuth } from '@/contexts/AuthContext';
import { Document, DocumentCategory } from '@/types/document';

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);

  const handleUpload = (files: File[], category: DocumentCategory) => {
    const newDocuments: Document[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      clientId: user!.id,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file), // In real app, this would be the uploaded URL
      category,
      uploadDate: new Date(),
      fileSize: file.size,
      fileType: file.type,
      status: 'uploaded',
    }));

    setDocuments(prev => [...prev, ...newDocuments]);
  };

  // Filter documents for current user only
  const userDocuments = documents.filter(doc => doc.clientId === user?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <DocumentUpload onUpload={handleUpload} />
          </div>
          
          <div className="lg:col-span-2">
            <DocumentList documents={userDocuments} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
