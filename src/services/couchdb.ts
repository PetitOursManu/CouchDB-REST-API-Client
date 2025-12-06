import { Connection, Document, CouchDBResponse } from '../types';
import CryptoJS from 'crypto-js';

export class CouchDBService {
  private connection: Connection;
  private baseUrl: string;
  private headers: Headers;

  constructor(connection: Connection) {
    this.connection = connection;
    const protocol = connection.useSSL ? 'https' : 'http';
    this.baseUrl = `${protocol}://${connection.url}/${connection.database}`;
    
    // Setup authentication headers
    const auth = btoa(`${connection.username}:${connection.password}`);
    this.headers = new Headers({
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Connection failed: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      throw error;
    }
  }

  async getAllDocuments(): Promise<Document[]> {
    try {
      const response = await fetch(`${this.baseUrl}/_all_docs?include_docs=true`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.statusText}`);
      }

      const data: CouchDBResponse = await response.json();
      
      // Filter out design documents and return regular documents
      return (data.rows || [])
        .filter(row => !row.id.startsWith('_design/'))
        .map(row => row.doc as Document);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      throw error;
    }
  }

  async getDocument(id: string): Promise<Document> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch document:', error);
      throw error;
    }
  }

  async createDocument(doc: Partial<Document>): Promise<Document> {
    try {
      // Generate a unique ID if not provided
      const docToCreate = {
        ...doc,
        _id: doc._id || this.generateId()
      };

      // Remove _rev for new documents
      delete docToCreate._rev;

      const response = await fetch(`${this.baseUrl}/${docToCreate._id}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(docToCreate)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.reason || 'Failed to create document');
      }

      const result: CouchDBResponse = await response.json();
      
      // Return the created document with its new revision
      return {
        ...docToCreate,
        _id: result.id!,
        _rev: result.rev!
      } as Document;
    } catch (error) {
      console.error('Failed to create document:', error);
      throw error;
    }
  }

  async saveDocument(doc: Document): Promise<Document> {
    try {
      if (!doc._id || !doc._rev) {
        throw new Error('Document must have _id and _rev for updates');
      }

      const response = await fetch(`${this.baseUrl}/${doc._id}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(doc)
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.error === 'conflict') {
          throw new Error('Document conflict: The document has been modified. Please refresh and try again.');
        }
        throw new Error(error.reason || 'Failed to save document');
      }

      const result: CouchDBResponse = await response.json();
      
      // Return the updated document with its new revision
      return {
        ...doc,
        _rev: result.rev!
      };
    } catch (error) {
      console.error('Failed to save document:', error);
      throw error;
    }
  }

  async deleteDocument(id: string, rev: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}?rev=${rev}`, {
        method: 'DELETE',
        headers: this.headers
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.reason || 'Failed to delete document');
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
      throw error;
    }
  }

  private generateId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Encryption utilities for storing credentials
export class CredentialManager {
  private static STORAGE_KEY = 'couchdb_credentials';
  private static ENCRYPTION_KEY = 'couchdb_client_2024';

  static saveCredentials(connection: Connection): void {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(connection),
      this.ENCRYPTION_KEY
    ).toString();
    
    localStorage.setItem(this.STORAGE_KEY, encrypted);
  }

  static loadCredentials(): Connection | null {
    const encrypted = localStorage.getItem(this.STORAGE_KEY);
    if (!encrypted) return null;

    try {
      const decrypted = CryptoJS.AES.decrypt(encrypted, this.ENCRYPTION_KEY);
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Failed to decrypt credentials:', error);
      return null;
    }
  }

  static clearCredentials(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
