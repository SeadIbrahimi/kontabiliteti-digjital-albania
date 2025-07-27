
export type DocumentCategory = 'shpenzime' | 'blerje' | 'import' | 'export' | 'note_debiti' | 'kthim' | 'note_krediti';
export type PaymentStatus = 'paguar' | 'borxh';
export type PaymentMethod = 'kesh' | 'banke';
export type DocumentStatus = 'uploaded' | 'pending_approval' | 'approved' | 'rejected' | 'registered';

export interface Document {
  id: string;
  clientId: string;
  fileName: string;
  fileUrl: string;
  category: DocumentCategory;
  uploadDate: Date;
  fileSize: number;
  fileType: string;
  status: DocumentStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  rejectionReason?: string;
  assignedEmployeeId?: string;
  approvedBy?: string;
  approvedAt?: Date;
  registeredBy?: string;
  registeredAt?: Date;
}

export const categoryLabels: Record<DocumentCategory, string> = {
  shpenzime: 'Shpenzime',
  blerje: 'Blerje',
  import: 'Import',
  export: 'Export',
  note_debiti: 'Notë Debiti',
  kthim: 'Kthim',
  note_krediti: 'Notë Krediti'
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  paguar: 'Paguar',
  borxh: 'Borxh'
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  kesh: 'Kesh (Arkë)',
  banke: 'Bankë'
};
