import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Upload, FileText, X } from 'lucide-react';
import { DocumentCategory, PaymentStatus, PaymentMethod, categoryLabels, paymentStatusLabels, paymentMethodLabels } from '@/types/document';

interface EnhancedDocumentUploadProps {
  onUpload: (files: File[], category: DocumentCategory, paymentStatus?: PaymentStatus, paymentMethod?: PaymentMethod) => void;
}

const EnhancedDocumentUpload: React.FC<EnhancedDocumentUploadProps> = ({ onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>('shpenzime');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<PaymentStatus | ''>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | ''>('');
  const [isDragging, setIsDragging] = useState(false);

  // Categories that require payment status
  const categoriesWithPayment: DocumentCategory[] = ['shpenzime', 'blerje', 'import', 'export'];
  
  const showPaymentStatus = categoriesWithPayment.includes(selectedCategory);
  const showPaymentMethod = showPaymentStatus && selectedPaymentStatus === 'paguar';

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const validFiles = Array.from(files).filter(file => {
      const isValidType = file.type.includes('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      
      if (!isValidType) {
        toast({
          title: "Tip skedari i pavlefshëm",
          description: `${file.name} - Vetëm foto dhe PDF janë të lejuara`,
          variant: "destructive",
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "Skedari shumë i madh",
          description: `${file.name} - Madhësia maksimale është 10MB`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (category: DocumentCategory) => {
    setSelectedCategory(category);
    // Reset payment fields when changing category
    setSelectedPaymentStatus('');
    setSelectedPaymentMethod('');
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Nuk ka skedare",
        description: "Ju lutem zgjidhni së paku një skedar për të ngarkuar",
        variant: "destructive",
      });
      return;
    }

    // Validate payment status for required categories
    if (showPaymentStatus && !selectedPaymentStatus) {
      toast({
        title: "Statusi i pagesës i kërkuar",
        description: "Ju lutem zgjidhni statusin e pagesës për këtë kategori",
        variant: "destructive",
      });
      return;
    }

    // Validate payment method when status is 'paguar'
    if (showPaymentMethod && !selectedPaymentMethod) {
      toast({
        title: "Mënyra e pagesës e kërkuar",
        description: "Ju lutem zgjidhni mënyrën e pagesës",
        variant: "destructive",
      });
      return;
    }

    onUpload(
      selectedFiles, 
      selectedCategory,
      selectedPaymentStatus || undefined,
      selectedPaymentMethod || undefined
    );
    
    setSelectedFiles([]);
    setSelectedPaymentStatus('');
    setSelectedPaymentMethod('');
    
    toast({
      title: "Ngarkimi i suksesshëm",
      description: `${selectedFiles.length} skedare u ngarkuan në kategorinë "${categoryLabels[selectedCategory]}"`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Ngarko Dokumente
        </CardTitle>
        <CardDescription>
          Ngarko foto ose PDF të faturave dhe dokumenteve të tjera
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Kategoria</label>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payment Status Selection */}
        {showPaymentStatus && (
          <div>
            <label className="text-sm font-medium mb-2 block">Statusi i Pagesës</label>
            <Select value={selectedPaymentStatus} onValueChange={(value: PaymentStatus) => setSelectedPaymentStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Zgjidh statusin e pagesës" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(paymentStatusLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Payment Method Selection */}
        {showPaymentMethod && (
          <div>
            <label className="text-sm font-medium mb-2 block">Mënyra e Pagesës</label>
            <Select value={selectedPaymentMethod} onValueChange={(value: PaymentMethod) => setSelectedPaymentMethod(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Zgjidh mënyrën e pagesës" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(paymentMethodLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Tërhiq skedarët këtu ose kliko për të zgjedhur
          </p>
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="outline" className="cursor-pointer" asChild>
              <span>Zgjidh Skedarët</span>
            </Button>
          </label>
          <p className="text-xs text-gray-500 mt-2">
            PNG, JPG, PDF deri në 10MB
          </p>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Skedarët e zgjedhur:</h4>
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(1)} MB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button onClick={handleUpload} className="w-full bg-blue-600 hover:bg-blue-700">
          Ngarko Dokumentet
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnhancedDocumentUpload;