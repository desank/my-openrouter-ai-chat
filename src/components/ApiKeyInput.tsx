import React, { useState, useEffect } from 'react';

const API_KEY_STORAGE = 'myapp_api_key';

export default function ApiKeyInput({ onApiKeyChange }) {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE);
    if (stored) {
      setApiKey(stored);
      onApiKeyChange(stored);
    }
  }, [onApiKeyChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApiKey(value);
    localStorage.setItem(API_KEY_STORAGE, value);
    onApiKeyChange(value);
  };

  return (
    <input
      type="password"
      value={apiKey}
      onChange={handleChange}
      placeholder="Enter API Key"
    />
  );
}