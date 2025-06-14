import React, { useState, useEffect } from 'react';

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
  initialValue?: string;
}

const STORAGE_KEY = 'quantum-quest-api-key';

export default function ApiKeyInput({ onApiKeyChange, initialValue = '' }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState(initialValue);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setApiKey(stored);
      onApiKeyChange(stored);
    }
  }, [onApiKeyChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApiKey(value);
    localStorage.setItem(STORAGE_KEY, value);
    onApiKeyChange(value);
  };

  return (
    <input
      type="password"
      value={apiKey}
      onChange={handleChange}
      placeholder="sk-or-..."
      className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
      required
    />
  );
}