import React, { useState } from 'react';
import { X, Key, ExternalLink } from 'lucide-react';
import ApiKeyInput from './ApiKeyInput';

interface SettingsModalProps {
  apiKey: string;
  onSave: (apiKey: string) => void;
  onClose: () => void;
  isInitialSetup?: boolean;
}

export function SettingsModal({ apiKey, onSave, onClose, isInitialSetup = false }: SettingsModalProps) {
  const [localApiKey, setLocalApiKey] = useState(apiKey);

  const handleApiKeyChange = (value: string) => {
    setLocalApiKey(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localApiKey.trim()) {
      onSave(localApiKey.trim());
      if (!isInitialSetup) {
        onClose();
      }
    }
  };

  if (isInitialSetup) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <ApiKeyInput onApiKeyChange={handleApiKeyChange} />
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800 mb-2">
            Don't have an API key?
          </p>
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <span>Get one from OpenRouter</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
        >
          Save API Key
        </button>
      </form>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OpenRouter API Key
            </label>
            <ApiKeyInput onApiKeyChange={handleApiKeyChange} />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800 mb-2">
              Your API key is stored locally and never shared.
            </p>
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <span>Manage your keys on OpenRouter</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}