import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Save, Trash2, Copy, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Document } from '../types';
import clsx from 'clsx';

interface DocumentEditorProps {
  document: Document;
  onSave: (doc: Document | Partial<Document>) => void;
  onDelete?: (id: string, rev: string) => void;
  isLoading: boolean;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  document,
  onSave,
  onDelete,
  isLoading
}) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Format the document for display
    const displayDoc = { ...document };
    setContent(JSON.stringify(displayDoc, null, 2));
    setError(null);
  }, [document]);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(content);
      
      // Validate required fields for existing documents
      if (document._id && (!parsed._id || !parsed._rev)) {
        setError('Document must contain _id and _rev fields');
        return;
      }
      
      setError(null);
      onSave(parsed);
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (onDelete && document._id && document._rev) {
      onDelete(document._id, document._rev);
      setShowDeleteConfirm(false);
    }
  };

  const validateJSON = (value: string) => {
    try {
      JSON.parse(value);
      setError(null);
    } catch (e) {
      setError('Invalid JSON syntax');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {document._id ? 'Edit Document' : 'New Document'}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Copy JSON"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            {document._id && onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
                title="Delete Document"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={isLoading || !!error}
              className={clsx(
                'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors',
                'bg-indigo-600 hover:bg-indigo-700 text-white',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{document._id ? 'Save' : 'Create'}</span>
            </button>
          </div>
        </div>
        
        {document._id && (
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span>ID: <code className="bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded">{document._id}</code></span>
            <span>Rev: <code className="bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded">{document._rev}</code></span>
          </div>
        )}
      </div>

      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage="json"
          value={content}
          onChange={(value) => {
            setContent(value || '');
            validateJSON(value || '');
          }}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            formatOnPaste: true,
            formatOnType: true,
            wordWrap: 'on'
          }}
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-xl">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete Document?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This action cannot be undone. The document will be permanently deleted.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentEditor;
