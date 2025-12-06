import React, { useState } from 'react';
import { FileText, Plus, RefreshCw, Search, Filter, Loader2 } from 'lucide-react';
import { Document } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import clsx from 'clsx';

interface DocumentListProps {
  documents: Document[];
  selectedDocument: Document | null;
  onSelectDocument: (doc: Document) => void;
  onCreateNew: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  selectedDocument,
  onSelectDocument,
  onCreateNew,
  onRefresh,
  isLoading
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'recent'>('all');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(doc).toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (filterType === 'recent') {
      // Sort by _id if it contains timestamp, otherwise alphabetically
      return b._id.localeCompare(a._id);
    }
    return a._id.localeCompare(b._id);
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('documents.title')} ({documents.length})
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title={t('documents.refresh')}
            >
              <RefreshCw className={clsx('w-4 h-4', isLoading && 'animate-spin')} />
            </button>
            <button
              onClick={onCreateNew}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              title={t('documents.new')}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('documents.search')}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'recent')}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 dark:bg-slate-700 dark:text-white"
          >
            <option value="all">{t('documents.filterAll')}</option>
            <option value="recent">{t('documents.filterRecent')}</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && documents.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : sortedDocuments.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            {searchTerm ? t('documents.noMatch') : t('documents.noFound')}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {sortedDocuments.map(doc => (
              <button
                key={doc._id}
                onClick={() => onSelectDocument(doc)}
                className={clsx(
                  'w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors',
                  selectedDocument?._id === doc._id && 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-600'
                )}
              >
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {doc._id}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Rev: {doc._rev.substring(0, 8)}...
                    </p>
                    {Object.keys(doc).length > 2 && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        {Object.keys(doc).length - 2} {t('documents.fields')}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentList;
