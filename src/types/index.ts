export interface Connection {
  url: string;
  database: string;
  username: string;
  password: string;
  useSSL: boolean;
}

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  keywords: string[];
}

export interface Document {
  _id: string;
  _rev: string;
  items?: DocumentItem[];
  [key: string]: any;
}

export interface AppState {
  connection: Connection | null;
  isConnected: boolean;
  documents: Document[];
  selectedDocument: Document | null;
  isLoading: boolean;
  error: string | null;
  lastSync: Date | null;
}

export interface CouchDBResponse {
  ok?: boolean;
  id?: string;
  rev?: string;
  error?: string;
  reason?: string;
  rows?: any[];
  total_rows?: number;
}
