import React from 'react';
import { MessageCircle, Plus, Trash2, Settings } from 'lucide-react';
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
  clearAllConversations: () => void; // <-- Add this prop
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
  clearAllConversations, // <-- Add this prop
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
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white/90 backdrop-blur-md border-r border-white/20 z-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
            <button
              onClick={onOpenSettings}
              className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          <button
            onClick={onNewConversation}
            className="w-full flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>
          <button
            onClick={clearAllConversations}
            className="w-full flex items-center space-x-2 px-3 py-2 mt-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all duration-200 border border-red-200"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>
        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="text-gray-400 text-center mt-8">No conversations yet.</div>
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
                >
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="truncate font-medium text-gray-900">{conv.title}</span>
                    <span className="text-xs text-gray-500">
                      {conv.messages.length} message{conv.messages.length !== 1 ? 's' : ''} • {formatDate(conv.updatedAt)}
                    </span>
                  </div>
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
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}