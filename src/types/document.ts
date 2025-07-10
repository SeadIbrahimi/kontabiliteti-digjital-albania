
export type DocumentCategory = 'tvsh' | 'shpenzime' | 'blerje' | 'import' | 'tjera';

export interface Document {
  id: string;
  clientId: string;
  fileName: string;
  fileUrl: string;
  category: DocumentCategory;
  uploadDate: Date;
  fileSize: number;
  fileType: string;
}

export const categoryLabels: Record<DocumentCategory, string> = {
  tvsh: 'TVSH',
  shpenzime: 'Shpenzime',
  blerje: 'Blerje',
  import: 'Import',
  tjera: 'Të tjera'
};
