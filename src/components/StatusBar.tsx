import React from 'react';
import { Activity, Database, Clock } from 'lucide-react';
import clsx from 'clsx';

interface StatusBarProps {
  isConnected: boolean;
  lastSync: Date | null;
  documentCount: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ isConnected, lastSync, documentCount }) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 px-4 py-2">
      <div className="container mx-auto flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Activity className={clsx(
              'w-4 h-4',
              isConnected ? 'text-green-500' : 'text-gray-400'
            )} />
            <span className={clsx(
              'font-medium',
              isConnected ? 'text-green-600 dark:text-green-400' : 'text-gray-500'
            )}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          {isConnected && (
            <>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Database className="w-4 h-4" />
                <span>{documentCount} documents</span>
              </div>
              
              {lastSync && (
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Last sync: {formatTime(lastSync)}</span>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="text-gray-500 dark:text-gray-400">
          CouchDB REST Client v1.0.0
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
