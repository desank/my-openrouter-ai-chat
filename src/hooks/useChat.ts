import { useState, useCallback, useEffect } from 'react';
import { MessageType } from '../types';
import { callOpenRouter } from '../utils/api';
import { storage } from '../utils/storage';

interface UseChatProps {
  onMessageAdded: (message: MessageType) => void;
  currentMessages: MessageType[];
  model: string;
}

export function useChat({ onMessageAdded, currentMessages, model }: UseChatProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKeyState] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = storage.getApiKey();
    if (savedApiKey) {
      setApiKeyState(savedApiKey);
    }
  }, []);

  // Save API key to localStorage when it changes
  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    if (key) {
      storage.setApiKey(key);
    } else {
      storage.removeApiKey();
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!apiKey) {
      setError('API key is required. Please configure it in settings.');
      return;
    }

    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    onMessageAdded(userMessage);
    setIsLoading(true);
    setError(null);

    try {
      // Include conversation context for better responses
      const contextMessages = [...currentMessages, userMessage].slice(-10); // Last 10 messages for context
      const response = await callOpenRouter(contextMessages, apiKey, model);
      
      const assistantMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      onMessageAdded(assistantMessage);
    } catch (err) {
      console.error('Chat error:', err);
      let errorMessage = 'An error occurred: ' + err;
      
      if (err instanceof Error) {
        if (err.message.includes('401') || err.message.includes('unauthorized')) {
          errorMessage = 'Invalid API key. Please check your OpenRouter API key.';
        } else if (err.message.includes('429')) {
          errorMessage = 'Rate limit exceeded. Please try again in a moment.';
        } else if (err.message.includes('quota')) {
          errorMessage = 'API quota exceeded. Please check your OpenRouter account.';
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, onMessageAdded, currentMessages]);

  return {
    isLoading,
    apiKey,
    setApiKey,
    sendMessage,
    error,
    clearError,
  };
}