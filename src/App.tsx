import React, { useState, useEffect } from 'react';
import { Settings, MessageCircle, Send, Loader2, Key, X, Menu, Plus, Sparkles } from 'lucide-react';
import { useChat } from './hooks/useChat';
import { useConversations } from './hooks/useConversations';
import { Message } from './components/Message';
import { SettingsModal } from './components/SettingsModal';
import { ConversationSidebar } from './components/ConversationSidebar';

function App() {
  const {
    conversations,
    currentConversationId,
    getCurrentConversation,
    createNewConversation,
    selectConversation,
    addMessageToConversation,
    deleteConversation,
    clearAllConversations,
  } = useConversations();

  const currentConversation = getCurrentConversation();
  const currentMessages = currentConversation?.messages || [];
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const {
    isLoading,
    apiKey,
    setApiKey,
    sendMessage,
    error,
    clearError
  } = useChat({
    onMessageAdded: addMessageToConversation,
    currentMessages,
  });

  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!apiKey) {
      setShowApiKeyPrompt(true);
    }
  }, [apiKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    // Create new conversation if none exists
    if (!currentConversationId) {
      createNewConversation(input.trim());
    }

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    setShowApiKeyPrompt(false);
  };

  const handleNewConversation = () => {
    createNewConversation();
    setSidebarOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    selectConversation(id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      {/* Sidebar */}
    <ConversationSidebar
      conversations={conversations}
      currentConversationId={currentConversationId}
      onSelectConversation={handleSelectConversation}
      onNewConversation={handleNewConversation}
      onDeleteConversation={deleteConversation}
      onOpenSettings={() => setShowSettings(true)}
      isOpen={sidebarOpen || window.innerWidth >= 1024}
      onClose={() => setSidebarOpen(false)}
      clearAllConversations={clearAllConversations}
      collapsed={sidebarCollapsed}
      onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-md border-b border-white/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* Brand Logo */}
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              {/* Brand Name */}
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Quantum Quest</h1>
                <p className="text-sm text-gray-600">
                  {currentConversation ? currentConversation.title : 'Powered by DeepSeek R1'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleNewConversation}
                className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New</span>
              </button>
              
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Chat Area */}
        <main className="flex-1 px-6 py-6 pb-32 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {currentMessages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {conversations.length === 0 ? 'Welcome to Quantum Quest' : 'Start a New Conversation'}
                </h2>
                <p className="text-gray-600 mb-6">
                  {conversations.length === 0 
                    ? 'Start your first conversation with DeepSeek R1. Ask me anything!'
                    : 'Continue your AI journey with a fresh conversation.'
                  }
                </p>
                {!apiKey && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
                    <div className="flex items-center space-x-2 text-amber-800">
                      <Key className="w-4 h-4" />
                      <span className="text-sm font-medium">API Key Required</span>
                    </div>
                    <p className="text-amber-700 text-sm mt-1">
                      Configure your OpenRouter API key to start chatting.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {currentMessages.map((message) => (
                  <Message key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-red-800">
                  <span className="text-sm font-medium">{error}</span>
                </div>
                <button
                  onClick={clearError}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Input Area */}
        <div className="bg-white/70 backdrop-blur-md border-t border-white/20 p-6">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={apiKey ? "Type your message..." : "Configure API key first..."}
                  disabled={!apiKey || isLoading}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed pr-12"
                />
                {input && (
                  <button
                    type="button"
                    onClick={() => setInput('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={!input.trim() || !apiKey || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          apiKey={apiKey}
          onSave={setApiKey}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* API Key Prompt Modal */}
      {showApiKeyPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                API Key Required
              </h2>
              <p className="text-gray-600">
                Enter your OpenRouter API key to start chatting with AI.
              </p>
            </div>
            <SettingsModal
              apiKey=""
              onSave={handleApiKeySubmit}
              onClose={() => setShowApiKeyPrompt(false)}
              isInitialSetup={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;