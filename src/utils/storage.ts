import { ConversationType } from '../types';

const STORAGE_KEYS = {
  API_KEY: 'quantum-quest-api-key',
  CONVERSATIONS: 'quantum-quest-conversations',
  CURRENT_CONVERSATION: 'quantum-quest-current-conversation',
} as const;

export const storage = {
  // API Key management
  getApiKey(): string | null {
    return localStorage.getItem(STORAGE_KEYS.API_KEY);
  },

  setApiKey(apiKey: string): void {
    localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
  },

  removeApiKey(): void {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
  },

  // Conversations management
  getConversations(): ConversationType[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (!stored) return [];
      
      const conversations = JSON.parse(stored);
      return conversations.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  },

  saveConversations(conversations: ConversationType[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  },

  getCurrentConversationId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_CONVERSATION);
  },

  setCurrentConversationId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_CONVERSATION, id);
  },

  removeCurrentConversationId(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_CONVERSATION);
  },
};