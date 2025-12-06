import React, { useState, useEffect } from 'react';
import ConnectionPanel from './components/ConnectionPanel';
import DocumentList from './components/DocumentList';
import DocumentEditor from './components/DocumentEditor';
import StatusBar from './components/StatusBar';
import Header from './components/Header';
import { CouchDBService } from './services/couchdb';
import { Connection, Document, AppState } from './types';
import { Database, AlertCircle } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';

function App() {
  const { t } = useLanguage();
  const [appState, setAppState] = useState<AppState>({
    connection: null,
    isConnected: false,
    documents: [],
    selectedDocument: null,
    isLoading: false,
    error: null,
    lastSync: null
  });

  const [couchService, setCouchService] = useState<CouchDBService | null>(null);

  const handleConnect = async (connection: Connection) => {
    setAppState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const service = new CouchDBService(connection);
      const isValid = await service.testConnection();
      
      if (isValid) {
        setCouchService(service);
        setAppState(prev => ({
          ...prev,
          connection,
          isConnected: true,
          isLoading: false,
          lastSync: new Date()
        }));
        
        // Load documents after successful connection
        await loadDocuments(service);
      }
    } catch (error) {
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : t('error.connection')
      }));
    }
  };

  const handleDisconnect = () => {
    setCouchService(null);
    setAppState({
      connection: null,
      isConnected: false,
      documents: [],
      selectedDocument: null,
      isLoading: false,
      error: null,
      lastSync: null
    });
  };

  const loadDocuments = async (service?: CouchDBService) => {
    const activeService = service || couchService;
    if (!activeService) return;

    setAppState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const docs = await activeService.getAllDocuments();
      setAppState(prev => ({
        ...prev,
        documents: docs,
        isLoading: false,
        lastSync: new Date()
      }));
    } catch (error) {
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : t('error.loadDocuments')
      }));
    }
  };

  const handleSelectDocument = (doc: Document) => {
    setAppState(prev => ({ ...prev, selectedDocument: doc }));
  };

  const handleSaveDocument = async (doc: Document) => {
    if (!couchService) return;

    setAppState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const savedDoc = await couchService.saveDocument(doc);
      
      // Update the document in the list
      setAppState(prev => ({
        ...prev,
        documents: prev.documents.map(d => 
          d._id === savedDoc._id ? savedDoc : d
        ),
        selectedDocument: savedDoc,
        isLoading: false,
        lastSync: new Date()
      }));
    } catch (error) {
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : t('error.saveDocument')
      }));
    }
  };

  const handleCreateDocument = async (doc: Partial<Document>) => {
    if (!couchService) return;

    setAppState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const newDoc = await couchService.createDocument(doc);
      
      setAppState(prev => ({
        ...prev,
        documents: [...prev.documents, newDoc],
        selectedDocument: newDoc,
        isLoading: false,
        lastSync: new Date()
      }));
    } catch (error) {
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : t('error.createDocument')
      }));
    }
  };

  const handleDeleteDocument = async (id: string, rev: string) => {
    if (!couchService) return;

    setAppState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await couchService.deleteDocument(id, rev);
      
      setAppState(prev => ({
        ...prev,
        documents: prev.documents.filter(d => d._id !== id),
        selectedDocument: prev.selectedDocument?._id === id ? null : prev.selectedDocument,
        isLoading: false,
        lastSync: new Date()
      }));
    } catch (error) {
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : t('error.deleteDocument')
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header 
        isConnected={appState.isConnected}
        connection={appState.connection}
        onDisconnect={handleDisconnect}
      />
      
      <main className="container mx-auto px-4 py-6">
        {!appState.isConnected ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <Database className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {t('connection.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t('connection.subtitle')}
              </p>
            </div>
            <ConnectionPanel onConnect={handleConnect} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <DocumentList
                documents={appState.documents}
                selectedDocument={appState.selectedDocument}
                onSelectDocument={handleSelectDocument}
                onCreateNew={() => setAppState(prev => ({ 
                  ...prev, 
                  selectedDocument: { _id: '', _rev: '', data: {} } as Document 
                }))}
                onRefresh={() => loadDocuments()}
                isLoading={appState.isLoading}
              />
            </div>
            
            <div className="lg:col-span-2">
              {appState.selectedDocument ? (
                <DocumentEditor
                  document={appState.selectedDocument}
                  onSave={appState.selectedDocument._id ? handleSaveDocument : handleCreateDocument}
                  onDelete={appState.selectedDocument._id ? handleDeleteDocument : undefined}
                  isLoading={appState.isLoading}
                />
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 text-center">
                  <Database className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    {t('empty.noDocument')}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500">
                    {t('empty.selectOrCreate')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {appState.error && (
          <div className="fixed bottom-6 right-6 max-w-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 shadow-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-900 dark:text-red-200">{t('error.title')}</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{appState.error}</p>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <StatusBar
        isConnected={appState.isConnected}
        lastSync={appState.lastSync}
        documentCount={appState.documents.length}
      />
    </div>
  );
}

export default App;
