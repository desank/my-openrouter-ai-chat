import { useState, useCallback, useEffect } from 'react';
import { ConversationType, MessageType } from '../types';
import { storage } from '../utils/storage';

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Load conversations on mount
  useEffect(() => {
    const loadedConversations = storage.getConversations();
    setConversations(loadedConversations);
    
    const currentId = storage.getCurrentConversationId();
    if (currentId && loadedConversations.find(c => c.id === currentId)) {
      setCurrentConversationId(currentId);
    } else if (loadedConversations.length > 0) {
      // If no current conversation or it doesn't exist, select the most recent one
      const mostRecent = loadedConversations.sort((a, b) => 
        b.updatedAt.getTime() - a.updatedAt.getTime()
      )[0];
      setCurrentConversationId(mostRecent.id);
      storage.setCurrentConversationId(mostRecent.id);
    }
  }, []);

  const getCurrentConversation = useCallback((): ConversationType | null => {
    if (!currentConversationId) return null;
    return conversations.find(c => c.id === currentConversationId) || null;
  }, [conversations, currentConversationId]);

  const createNewConversation = useCallback((firstMessage?: string, model?: string): string => {
    const newConversation: ConversationType = {
      id: Date.now().toString(),
      title: firstMessage ?
        (firstMessage.length > 50 ? firstMessage.substring(0, 50) + '...' : firstMessage) :
        'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      model: model || 'deepseek/deepseek-r1-0528',
    };

    const updatedConversations = [newConversation, ...conversations];
    setConversations(updatedConversations);
    setCurrentConversationId(newConversation.id);
    
    storage.saveConversations(updatedConversations);
    storage.setCurrentConversationId(newConversation.id);
    
    return newConversation.id;
  }, [conversations]);

  const selectConversation = useCallback((id: string) => {
    setCurrentConversationId(id);
    storage.setCurrentConversationId(id);
  }, []);

  const addMessageToConversation = useCallback((message: MessageType) => {
    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id === currentConversationId) {
          const updatedConv = {
            ...conv,
            messages: [...conv.messages, message],
            updatedAt: new Date(),
          };
          
          // Update title if this is the first user message
          if (conv.messages.length === 0 && message.role === 'user') {
            updatedConv.title = message.content.length > 50 ? 
              message.content.substring(0, 50) + '...' : 
              message.content;
          }
          
          return updatedConv;
        }
        return conv;
      });
      
      storage.saveConversations(updated);
      return updated;
    });
  }, [currentConversationId]);

  const deleteConversation = useCallback((id: string) => {
    const updatedConversations = conversations.filter(c => c.id !== id);
    setConversations(updatedConversations);
    storage.saveConversations(updatedConversations);
    
    if (currentConversationId === id) {
      if (updatedConversations.length > 0) {
        const nextConversation = updatedConversations[0];
        setCurrentConversationId(nextConversation.id);
        storage.setCurrentConversationId(nextConversation.id);
      } else {
        setCurrentConversationId(null);
        storage.removeCurrentConversationId();
      }
    }
  }, [conversations, currentConversationId]);

  const clearAllConversations = useCallback(() => {
    setConversations([]);
    setCurrentConversationId(null);
    storage.saveConversations([]);
    storage.removeCurrentConversationId();
  }, []);

  return {
    conversations,
    currentConversationId,
    getCurrentConversation,
    createNewConversation,
    selectConversation,
    addMessageToConversation,
    deleteConversation,
    clearAllConversations,
  };
}