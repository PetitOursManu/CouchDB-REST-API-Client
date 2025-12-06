import React from 'react';
import { Activity, Database, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface StatusBarProps {
  isConnected: boolean;
  lastSync: Date | null;
  documentCount: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ isConnected, lastSync, documentCount }) => {
  const { t } = useLanguage();
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('default', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 px-4 py-2">
      <div className="container mx-auto flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Activity className={`w-4 h-4 ${isConnected ? 'text-green-500' : 'text-gray-400'}`} />
            <span className="text-gray-600 dark:text-gray-400">
              {isConnected ? t('status.connected') : t('status.disconnected')}
            </span>
          </div>
          
          {isConnected && (
            <>
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  {documentCount} {t('status.documents')}
                </span>
              </div>
              
              {lastSync && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {t('status.lastSync')} {formatTime(lastSync)}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="text-gray-500 dark:text-gray-500">
          CouchDB GUI Client v1.0.0
        </div>
      </div>
    </footer>
  );
};

export default StatusBar;
