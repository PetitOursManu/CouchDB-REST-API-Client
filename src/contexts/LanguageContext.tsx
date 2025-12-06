import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Header
    'header.title': 'CouchDB REST Client',
    'header.subtitle': 'Interface de gestion de base de données moderne',
    'header.disconnect': 'Déconnexion',
    
    // Connection Panel
    'connection.title': 'Se connecter à CouchDB',
    'connection.subtitle': 'Entrez les détails de votre serveur CouchDB pour commencer',
    'connection.instructions': 'Instructions de connexion :',
    'connection.instruction1': "L'URL ne doit pas contenir le protocole (http:// ou https://)",
    'connection.instruction2': 'Utilisez le format :',
    'connection.instruction3': 'Le port par défaut de CouchDB est 5984',
    'connection.instruction4': 'Cochez "Connexion HTTPS/SSL" si votre serveur utilise SSL',
    'connection.serverUrl': 'URL du serveur',
    'connection.serverUrlPlaceholder': 'localhost:5984 ou monserveur.com:5984',
    'connection.serverUrlWarning': '⚠️ Sans protocole (pas de http:// ou https://)',
    'connection.database': 'Nom de la base de données',
    'connection.databasePlaceholder': 'ma-base-de-donnees',
    'connection.databaseHelp': 'Nom exact de votre base de données CouchDB',
    'connection.username': "Nom d'utilisateur",
    'connection.usernamePlaceholder': 'admin',
    'connection.usernameHelp': 'Votre identifiant CouchDB',
    'connection.password': 'Mot de passe',
    'connection.passwordPlaceholder': '••••••••',
    'connection.passwordHelp': 'Votre mot de passe CouchDB',
    'connection.useSSL': 'Utiliser une connexion HTTPS/SSL',
    'connection.useSSLHelp': 'Activez cette option si votre serveur CouchDB utilise SSL (https)',
    'connection.saveCredentials': 'Sauvegarder les identifiants (chiffrés)',
    'connection.saveCredentialsHelp': 'Les identifiants seront stockés localement de manière sécurisée',
    'connection.connecting': 'Connexion en cours...',
    'connection.connect': 'Se connecter à la base de données',
    
    // Document List
    'documents.title': 'Documents',
    'documents.refresh': 'Actualiser',
    'documents.new': 'Nouveau document',
    'documents.search': 'Rechercher des documents...',
    'documents.filter': 'Filtrer',
    'documents.filterAll': 'Tous les documents',
    'documents.filterRecent': 'Récents en premier',
    'documents.noMatch': 'Aucun document ne correspond à votre recherche',
    'documents.noFound': 'Aucun document trouvé',
    'documents.fields': 'champs',
    
    // Document Editor
    'editor.edit': 'Modifier le document',
    'editor.new': 'Nouveau document',
    'editor.copy': 'Copier JSON',
    'editor.delete': 'Supprimer le document',
    'editor.save': 'Enregistrer',
    'editor.create': 'Créer',
    'editor.invalidJson': 'JSON invalide :',
    'editor.mustContain': 'Le document doit contenir les champs _id et _rev',
    'editor.syntaxError': 'Erreur de syntaxe JSON',
    'editor.deleteConfirm': 'Supprimer le document ?',
    'editor.deleteWarning': 'Cette action ne peut pas être annulée. Le document sera définitivement supprimé.',
    'editor.cancel': 'Annuler',
    'editor.confirmDelete': 'Supprimer',
    
    // Form Mode
    'form.items': 'Éléments',
    'form.addItem': 'Ajouter un élément',
    'form.newItem': 'Nouvel élément',
    'form.editItem': 'Modifier l\'élément #',
    'form.title': 'Titre',
    'form.titlePlaceholder': 'Entrez le titre',
    'form.description': 'Description',
    'form.descriptionPlaceholder': 'Entrez la description',
    'form.imageUrl': 'URL de l\'image',
    'form.imageUrlPlaceholder': 'https://example.com/image.jpg',
    'form.category': 'Catégorie',
    'form.categoryPlaceholder': 'Entrez la catégorie',
    'form.keywords': 'Mots-clés (séparés par des virgules)',
    'form.keywordsPlaceholder': 'mot-clé1, mot-clé2, mot-clé3',
    'form.add': 'Ajouter',
    'form.save': 'Enregistrer',
    'form.cancel': 'Annuler',
    'form.showDetails': 'Afficher les détails',
    'form.hideDetails': 'Masquer les détails',
    'form.noDescription': 'Aucune description',
    'form.image': 'Image :',
    'form.keywordsList': 'Mots-clés :',
    'form.noItems': 'Aucun élément pour le moment',
    'form.addFirstItem': 'Ajouter votre premier élément',
    'form.requiredFields': 'Le titre et la description sont requis',
    'form.untitled': 'Sans titre',
    
    // Status Bar
    'status.connected': 'Connecté',
    'status.disconnected': 'Déconnecté',
    'status.documents': 'documents',
    'status.lastSync': 'Dernière synchronisation :',
    
    // Errors
    'error.title': 'Erreur',
    'error.connection': 'Échec de la connexion',
    'error.loadDocuments': 'Impossible de charger les documents',
    'error.saveDocument': 'Impossible d\'enregistrer le document',
    'error.createDocument': 'Impossible de créer le document',
    'error.deleteDocument': 'Impossible de supprimer le document',
    
    // Empty State
    'empty.noDocument': 'Aucun document sélectionné',
    'empty.selectOrCreate': 'Sélectionnez un document dans la liste ou créez-en un nouveau pour commencer'
  },
  en: {
    // Header
    'header.title': 'CouchDB REST Client',
    'header.subtitle': 'Modern Database Management Interface',
    'header.disconnect': 'Disconnect',
    
    // Connection Panel
    'connection.title': 'Connect to CouchDB',
    'connection.subtitle': 'Enter your CouchDB server details to get started',
    'connection.instructions': 'Connection instructions:',
    'connection.instruction1': "URL must not contain the protocol (http:// or https://)",
    'connection.instruction2': 'Use the format:',
    'connection.instruction3': 'Default CouchDB port is 5984',
    'connection.instruction4': 'Check "HTTPS/SSL Connection" if your server uses SSL',
    'connection.serverUrl': 'Server URL',
    'connection.serverUrlPlaceholder': 'localhost:5984 or myserver.com:5984',
    'connection.serverUrlWarning': '⚠️ Without protocol (no http:// or https://)',
    'connection.database': 'Database name',
    'connection.databasePlaceholder': 'my-database',
    'connection.databaseHelp': 'Exact name of your CouchDB database',
    'connection.username': 'Username',
    'connection.usernamePlaceholder': 'admin',
    'connection.usernameHelp': 'Your CouchDB username',
    'connection.password': 'Password',
    'connection.passwordPlaceholder': '••••••••',
    'connection.passwordHelp': 'Your CouchDB password',
    'connection.useSSL': 'Use HTTPS/SSL connection',
    'connection.useSSLHelp': 'Enable this option if your CouchDB server uses SSL (https)',
    'connection.saveCredentials': 'Save credentials (encrypted)',
    'connection.saveCredentialsHelp': 'Credentials will be stored locally in a secure manner',
    'connection.connecting': 'Connecting...',
    'connection.connect': 'Connect to database',
    
    // Document List
    'documents.title': 'Documents',
    'documents.refresh': 'Refresh',
    'documents.new': 'New Document',
    'documents.search': 'Search documents...',
    'documents.filter': 'Filter',
    'documents.filterAll': 'All Documents',
    'documents.filterRecent': 'Recent First',
    'documents.noMatch': 'No documents match your search',
    'documents.noFound': 'No documents found',
    'documents.fields': 'fields',
    
    // Document Editor
    'editor.edit': 'Edit Document',
    'editor.new': 'New Document',
    'editor.copy': 'Copy JSON',
    'editor.delete': 'Delete Document',
    'editor.save': 'Save',
    'editor.create': 'Create',
    'editor.invalidJson': 'Invalid JSON:',
    'editor.mustContain': 'Document must contain _id and _rev fields',
    'editor.syntaxError': 'Invalid JSON syntax',
    'editor.deleteConfirm': 'Delete Document?',
    'editor.deleteWarning': 'This action cannot be undone. The document will be permanently deleted.',
    'editor.cancel': 'Cancel',
    'editor.confirmDelete': 'Delete',
    
    // Form Mode
    'form.items': 'Items',
    'form.addItem': 'Add Item',
    'form.newItem': 'New Item',
    'form.editItem': 'Edit Item #',
    'form.title': 'Title',
    'form.titlePlaceholder': 'Enter title',
    'form.description': 'Description',
    'form.descriptionPlaceholder': 'Enter description',
    'form.imageUrl': 'Image URL',
    'form.imageUrlPlaceholder': 'https://example.com/image.jpg',
    'form.category': 'Category',
    'form.categoryPlaceholder': 'Enter category',
    'form.keywords': 'Keywords (comma-separated)',
    'form.keywordsPlaceholder': 'keyword1, keyword2, keyword3',
    'form.add': 'Add',
    'form.save': 'Save',
    'form.cancel': 'Cancel',
    'form.showDetails': 'Show details',
    'form.hideDetails': 'Hide details',
    'form.noDescription': 'No description',
    'form.image': 'Image:',
    'form.keywordsList': 'Keywords:',
    'form.noItems': 'No items yet',
    'form.addFirstItem': 'Add your first item',
    'form.requiredFields': 'Title and description are required',
    'form.untitled': 'Untitled',
    
    // Status Bar
    'status.connected': 'Connected',
    'status.disconnected': 'Disconnected',
    'status.documents': 'documents',
    'status.lastSync': 'Last sync:',
    
    // Errors
    'error.title': 'Error',
    'error.connection': 'Connection failed',
    'error.loadDocuments': 'Failed to load documents',
    'error.saveDocument': 'Failed to save document',
    'error.createDocument': 'Failed to create document',
    'error.deleteDocument': 'Failed to delete document',
    
    // Empty State
    'empty.noDocument': 'No Document Selected',
    'empty.selectOrCreate': 'Select a document from the list or create a new one to get started'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['fr']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
