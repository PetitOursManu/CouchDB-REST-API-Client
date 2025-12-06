import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Save, Trash2, Copy, Check, AlertCircle, Loader2, Plus, Edit2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Document, DocumentItem } from '../types';
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
  const [viewMode, setViewMode] = useState<'json' | 'form'>('json');
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [editingItem, setEditingItem] = useState<DocumentItem | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Format the document for display
    const displayDoc = { ...document };
    setContent(JSON.stringify(displayDoc, null, 2));
    setError(null);
    
    // Load items if they exist
    if (document.items && Array.isArray(document.items)) {
      setItems(document.items);
    } else {
      setItems([]);
    }
  }, [document]);

  const handleSave = () => {
    try {
      let parsed: any;
      
      if (viewMode === 'json') {
        parsed = JSON.parse(content);
      } else {
        // Save from form mode
        parsed = JSON.parse(content);
        parsed.items = items;
      }
      
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

  const getNextItemId = (): string => {
    if (items.length === 0) return '1';
    const maxId = Math.max(...items.map(item => parseInt(item.id) || 0));
    return (maxId + 1).toString();
  };

  const handleAddItem = () => {
    const newItem: DocumentItem = {
      id: getNextItemId(),
      title: '',
      description: '',
      imageUrl: '',
      category: '',
      keywords: []
    };
    setEditingItem(newItem);
    setIsNewItem(true);
  };

  const handleEditItem = (item: DocumentItem) => {
    setEditingItem({ ...item });
    setIsNewItem(false);
  };

  const handleSaveItem = () => {
    if (!editingItem) return;

    if (!editingItem.title || !editingItem.description) {
      setError('Title and description are required');
      return;
    }

    let updatedItems: DocumentItem[];
    
    if (isNewItem) {
      updatedItems = [...items, editingItem];
    } else {
      updatedItems = items.map(item => 
        item.id === editingItem.id ? editingItem : item
      );
    }
    
    setItems(updatedItems);
    
    // Update the JSON content
    const parsed = JSON.parse(content);
    parsed.items = updatedItems;
    setContent(JSON.stringify(parsed, null, 2));
    
    setEditingItem(null);
    setIsNewItem(false);
    setError(null);
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    
    // Update the JSON content
    const parsed = JSON.parse(content);
    parsed.items = updatedItems;
    setContent(JSON.stringify(parsed, null, 2));
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setIsNewItem(false);
    setError(null);
  };

  const toggleItemExpansion = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {document._id ? 'Edit Document' : 'New Document'}
          </h2>
          <div className="flex items-center space-x-2">
            <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-slate-600">
              <button
                onClick={() => setViewMode('json')}
                className={clsx(
                  'px-3 py-1.5 text-sm font-medium transition-colors',
                  viewMode === 'json' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                )}
              >
                JSON
              </button>
              <button
                onClick={() => setViewMode('form')}
                className={clsx(
                  'px-3 py-1.5 text-sm font-medium transition-colors',
                  viewMode === 'form' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                )}
              >
                Form
              </button>
            </div>
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

      <div className="flex-1 relative overflow-hidden">
        {viewMode === 'json' ? (
          <Editor
            height="100%"
            defaultLanguage="json"
            value={content}
            onChange={(value) => {
              setContent(value || '');
              validateJSON(value || '');
              // Sync items when JSON changes
              try {
                const parsed = JSON.parse(value || '{}');
                if (parsed.items && Array.isArray(parsed.items)) {
                  setItems(parsed.items);
                }
              } catch {}
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
        ) : (
          <div className="h-full overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Items ({items.length})
                </h3>
                <button
                  onClick={handleAddItem}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>

              {editingItem && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700">
                  <h4 className="text-md font-semibold mb-4 text-gray-900 dark:text-white">
                    {isNewItem ? 'New Item' : `Edit Item #${editingItem.id}`}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={editingItem.title}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                        placeholder="Enter title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description *
                      </label>
                      <textarea
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                        rows={3}
                        placeholder="Enter description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Image URL
                      </label>
                      <input
                        type="text"
                        value={editingItem.imageUrl}
                        onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={editingItem.category}
                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                        placeholder="Enter category"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Keywords (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={editingItem.keywords.join(', ')}
                        onChange={(e) => setEditingItem({ 
                          ...editingItem, 
                          keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>
                    <div className="flex items-center justify-end space-x-3 pt-2">
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveItem}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                      >
                        {isNewItem ? 'Add' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-xs font-mono bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">
                              ID: {item.id}
                            </span>
                            {item.category && (
                              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                {item.category}
                              </span>
                            )}
                          </div>
                          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-1">
                            {item.title || 'Untitled'}
                          </h4>
                          <button
                            onClick={() => toggleItemExpansion(item.id)}
                            className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                          >
                            {expandedItems.has(item.id) ? (
                              <>
                                <ChevronUp className="w-4 h-4" />
                                <span>Hide details</span>
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4" />
                                <span>Show details</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {expandedItems.has(item.id) && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-700 space-y-2">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {item.description || 'No description'}
                          </p>
                          {item.imageUrl && (
                            <div>
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Image:</span>
                              <a 
                                href={item.imageUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline ml-2"
                              >
                                {item.imageUrl}
                              </a>
                            </div>
                          )}
                          {item.keywords.length > 0 && (
                            <div>
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Keywords:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.keywords.map((keyword, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {items.length === 0 && !editingItem && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <p className="mb-4">No items yet</p>
                    <button
                      onClick={handleAddItem}
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Add your first item
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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
