import React, { useState, useEffect } from 'react';
import { Server, Lock, Database, Shield, Save, Loader2, Info } from 'lucide-react';
import { Connection } from '../types';
import { CredentialManager } from '../services/couchdb';
import { useLanguage } from '../contexts/LanguageContext';

interface ConnectionPanelProps {
  onConnect: (connection: Connection) => void;
}

const ConnectionPanel: React.FC<ConnectionPanelProps> = ({ onConnect }) => {
  const { t } = useLanguage();
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
            <p className="font-semibold mb-1">{t('connection.instructions')}</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>{t('connection.instruction1')}</li>
              <li>{t('connection.instruction2')} <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">serveur:port</code> ou <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">domaine.com:port</code></li>
              <li>{t('connection.instruction3')}</li>
              <li>{t('connection.instruction4')}</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Server className="w-4 h-4 mr-2" />
            {t('connection.serverUrl')}
          </label>
          <input
            type="text"
            value={formData.url}
            onChange={handleChange('url')}
            placeholder={t('connection.serverUrlPlaceholder')}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            required
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t('connection.serverUrlWarning')}
          </p>
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Database className="w-4 h-4 mr-2" />
            {t('connection.database')}
          </label>
          <input
            type="text"
            value={formData.database}
            onChange={handleChange('database')}
            placeholder={t('connection.databasePlaceholder')}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            required
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t('connection.databaseHelp')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Lock className="w-4 h-4 mr-2" />
              {t('connection.username')}
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={handleChange('username')}
              placeholder={t('connection.usernamePlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              required
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t('connection.usernameHelp')}
            </p>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Lock className="w-4 h-4 mr-2" />
              {t('connection.password')}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              placeholder={t('connection.passwordPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              required
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t('connection.passwordHelp')}
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
              {t('connection.useSSL')}
            </span>
          </label>
          <p className="ml-7 text-xs text-gray-500 dark:text-gray-400">
            {t('connection.useSSLHelp')}
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
              {t('connection.saveCredentials')}
            </span>
          </label>
          <p className="ml-7 text-xs text-gray-500 dark:text-gray-400">
            {t('connection.saveCredentialsHelp')}
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
              <span>{t('connection.connecting')}</span>
            </>
          ) : (
            <>
              <Database className="w-5 h-5" />
              <span>{t('connection.connect')}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ConnectionPanel;
