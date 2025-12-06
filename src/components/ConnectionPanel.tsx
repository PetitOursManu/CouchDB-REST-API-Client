import React, { useState, useEffect } from 'react';
import { Server, Lock, Database, Shield, Save, Loader2, Info } from 'lucide-react';
import { Connection } from '../types';
import { CredentialManager } from '../services/couchdb';

interface ConnectionPanelProps {
  onConnect: (connection: Connection) => void;
}

const ConnectionPanel: React.FC<ConnectionPanelProps> = ({ onConnect }) => {
  const [formData, setFormData] = useState<Connection>({
    url: '',
    database: '',
    username: '',
    password: '',
    useSSL: true
  });
  
  const [saveCredentials, setSaveCredentials] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Try to load saved credentials
    const saved = CredentialManager.loadCredentials();
    if (saved) {
      setFormData(saved);
      setSaveCredentials(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);

    try {
      if (saveCredentials) {
        CredentialManager.saveCredentials(formData);
      } else {
        CredentialManager.clearCredentials();
      }
      
      await onConnect(formData);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleChange = (field: keyof Connection) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'useSSL' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8">
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start space-x-2">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-semibold mb-1">Instructions de connexion :</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>L'URL ne doit pas contenir le protocole (http:// ou https://)</li>
              <li>Utilisez le format : <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">serveur:port</code> ou <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">domaine.com:port</code></li>
              <li>Le port par défaut de CouchDB est 5984</li>
              <li>Cochez "Connexion HTTPS/SSL" si votre serveur utilise SSL</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Server className="w-4 h-4 mr-2" />
            URL du serveur
          </label>
          <input
            type="text"
            value={formData.url}
            onChange={handleChange('url')}
            placeholder="localhost:5984 ou monserveur.com:5984"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            required
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            ⚠️ Sans protocole (pas de http:// ou https://)
          </p>
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Database className="w-4 h-4 mr-2" />
            Nom de la base de données
          </label>
          <input
            type="text"
            value={formData.database}
            onChange={handleChange('database')}
            placeholder="ma-base-de-donnees"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            required
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Nom exact de votre base de données CouchDB
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Lock className="w-4 h-4 mr-2" />
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={handleChange('username')}
              placeholder="admin"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              required
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Votre identifiant CouchDB
            </p>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Lock className="w-4 h-4 mr-2" />
              Mot de passe
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              required
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Votre mot de passe CouchDB
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.useSSL}
              onChange={handleChange('useSSL')}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <Shield className="w-4 h-4 mr-2" />
              Utiliser une connexion HTTPS/SSL
            </span>
          </label>
          <p className="ml-7 text-xs text-gray-500 dark:text-gray-400">
            Activez cette option si votre serveur CouchDB utilise SSL (https)
          </p>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={saveCredentials}
              onChange={(e) => setSaveCredentials(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder les identifiants (chiffrés)
            </span>
          </label>
          <p className="ml-7 text-xs text-gray-500 dark:text-gray-400">
            Les identifiants seront stockés localement de manière sécurisée
          </p>
        </div>

        <button
          type="submit"
          disabled={isConnecting}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Connexion en cours...</span>
            </>
          ) : (
            <>
              <Database className="w-5 h-5" />
              <span>Se connecter à la base de données</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ConnectionPanel;
