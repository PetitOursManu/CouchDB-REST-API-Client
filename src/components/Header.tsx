import React from 'react';
import { Database, Power, Shield, Server, Globe } from 'lucide-react';
import { Connection } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  isConnected: boolean;
  connection: Connection | null;
  onDisconnect: () => void;
}

const Header: React.FC<HeaderProps> = ({ isConnected, connection, onDisconnect }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('header.title')}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('header.subtitle')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'fr' | 'en')}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="fr">🇫🇷 Français</option>
                <option value="en">🇬🇧 English</option>
              </select>
            </div>

            {isConnected && connection && (
              <>
                <div className="flex items-center space-x-2 text-sm">
                  <Server className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {connection.database}@{connection.url}
                  </span>
                  {connection.useSSL && (
                    <Shield className="w-4 h-4 text-green-500" title="SSL Enabled" />
                  )}
                </div>
                <button
                  onClick={onDisconnect}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                >
                  <Power className="w-4 h-4" />
                  <span>{t('header.disconnect')}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
