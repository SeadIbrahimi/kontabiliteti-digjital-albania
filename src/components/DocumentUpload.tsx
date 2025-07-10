
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Upload, FileText, X } from 'lucide-react';
import { DocumentCategory, categoryLabels } from '@/types/document';

interface DocumentUploadProps {
  onUpload: (files: File[], category: DocumentCategory) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>('tvsh');
  const [isDragging, setIsDragging] = useState(false);

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

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Nuk ka skedare",
        description: "Ju lutem zgjidhni së paku një skedar për të ngarkuar",
        variant: "destructive",
      });
      return;
    }

    onUpload(selectedFiles, selectedCategory);
    setSelectedFiles([]);
    
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
        <div>
          <label className="text-sm font-medium mb-2 block">Kategoria</label>
          <Select value={selectedCategory} onValueChange={(value: DocumentCategory) => setSelectedCategory(value)}>
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

export default DocumentUpload;
