import React, { useState, useEffect } from 'react';
import { Server, Lock, Database, Shield, Save, Loader2 } from 'lucide-react';
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Server className="w-4 h-4 mr-2" />
            Server URL
          </label>
          <input
            type="text"
            value={formData.url}
            onChange={handleChange('url')}
            placeholder="localhost:5984 or myserver.com:5984"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Database className="w-4 h-4 mr-2" />
            Database Name
          </label>
          <input
            type="text"
            value={formData.database}
            onChange={handleChange('database')}
            placeholder="my-database"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Lock className="w-4 h-4 mr-2" />
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={handleChange('username')}
              placeholder="admin"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Lock className="w-4 h-4 mr-2" />
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              required
            />
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
              Use HTTPS/SSL Connection
            </span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={saveCredentials}
              onChange={(e) => setSaveCredentials(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <Save className="w-4 h-4 mr-2" />
              Save credentials (encrypted)
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isConnecting}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Database className="w-5 h-5" />
              <span>Connect to Database</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ConnectionPanel;
