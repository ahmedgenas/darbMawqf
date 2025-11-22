export interface FineRecord {
  fineNumber: string;
  plateNumber: string;
  fineDate: string;
  fineType: string; // Arabic description
  fineTypeEn: string; // English description
  fineAmount: number;
  referenceNo: string;
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface ExtractedResult {
  fileName: string;
  data: FineRecord[];
}