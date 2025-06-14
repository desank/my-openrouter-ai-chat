import React from 'react';
import { MessageCircle, Plus, Trash2, Settings, ChevronRight, ChevronLeft } from 'lucide-react';
import { ConversationType } from '../types';

interface ConversationSidebarProps {
  conversations: ConversationType[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onOpenSettings: () => void;
  isOpen: boolean;
  onClose: () => void;
  clearAllConversations: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function ConversationSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onOpenSettings,
  isOpen,
  onClose,
  clearAllConversations,
  collapsed,
  onToggleCollapse,
}: ConversationSidebarProps) {
  if (!isOpen && window.innerWidth < 1024) return null;

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`h-full z-50 flex flex-col transition-all duration-200
          ${collapsed ? 'w-16' : 'w-80'}
          bg-white/90 backdrop-blur-md border-r border-white/20`}
      >
        {/* Collapse/Expand Button */}
        <button
          onClick={onToggleCollapse}
          className="absolute -right-4 top-6 z-50 bg-white border border-gray-200 rounded-full shadow p-1 hover:bg-gray-100 transition-colors"
          style={{ width: 32, height: 32 }}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Header */}
        <div className={`p-4 border-b border-gray-200/50 ${collapsed ? 'flex flex-col items-center' : ''}`}>
          <div className={`flex items-center justify-between mb-4 ${collapsed ? 'flex-col space-y-2' : ''}`}>
            {!collapsed && (
              <>
                <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
                <button
                  onClick={onOpenSettings}
                  className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-600" />
                </button>
              </>
            )}
            {collapsed && (
              <button
                onClick={onOpenSettings}
                className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>

          <button
            onClick={onNewConversation}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
              ${collapsed
                ? 'justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              }`}
            title="New Conversation"
          >
            <Plus className="w-4 h-4" />
            {!collapsed && <span>New Conversation</span>}
          </button>
          <div>
            <label htmlFor="model-select" className="text-xs text-gray-700">Model:</label>
            <select
              id="model-select"
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value)}
              className="w-full px-2 py-1 rounded border border-gray-300 text-xs mb-2"
            >
              {models.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name || model.id}
                  {model.pricing && model.pricing.prompt === 0 && model.pricing.completion === 0
                    ? ' (Free)'
                    : ' (Paid)'}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={clearAllConversations}
            className={`w-full flex items-center space-x-2 px-3 py-2 mt-2 rounded-lg transition-all duration-200 border border-red-200
              ${collapsed
                ? 'justify-center bg-red-50 text-red-700'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            title="Clear All"
          >
            <Trash2 className="w-4 h-4" />
            {!collapsed && <span>Clear All</span>}
          </button>
        </div>
        {/* Conversation List */}
        <div className={`flex-1 overflow-y-auto ${collapsed ? 'pt-4' : ''}`}>
          {conversations.length === 0 ? (
            !collapsed && <div className="text-gray-400 text-center mt-8">No conversations yet.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {conversations.map((conv) => (
                <li
                  key={conv.id}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                    conv.id === currentConversationId
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onSelectConversation(conv.id)}
                  title={conv.title}
                >
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className={`truncate font-medium text-gray-900 ${collapsed ? 'text-xs' : ''}`}>
                      {collapsed ? <MessageCircle className="w-5 h-5 text-blue-600" /> : conv.title}
                    </span>
                    {!collapsed && (
                      <span className="text-xs text-gray-500">
                        {conv.messages.length} message{conv.messages.length !== 1 ? 's' : ''} • {formatDate(conv.updatedAt)}
                      </span>
                    )}
                  </div>
                  {!collapsed && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                      className="ml-2 p-1 rounded hover:bg-red-50"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                    </button>
                  )}

                  <ul>
                    {conversations.map(conv => (
                      <li key={conv.id} className="flex flex-col px-4 py-2">
                        <span className="font-medium truncate">{conv.title}</span>
                        <span className="text-xs text-gray-400">
                          {conv.model}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}