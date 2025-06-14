import { MessageType } from '../types';

export async function callOpenRouter(
  messages: MessageType[],
  apiKey: string,
  model: string // <-- add model parameter
): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Quantum Quest',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model, // <-- use model parameter
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      max_tokens: 2000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || 
      `HTTP ${response.status}: ${response.statusText}`
    );
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid response format from OpenRouter API');
  }

  return data.choices[0].message.content;
}

export interface OpenRouterModel {
  id: string;
  name: string;
  pricing: {
    prompt: number | null;
    completion: number | null;
    currency: string;
  } | null;
  context_length: number;
  description?: string;
}

export async function fetchOpenRouterModels(apiKey: string): Promise<OpenRouterModel[]> {
  const response = await fetch('https://openrouter.ai/api/v1/models', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Quantum Quest',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch models');
  }
  const data = await response.json();
  return data.data as OpenRouterModel[];
}