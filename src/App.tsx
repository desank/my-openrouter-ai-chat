import React, { useState, useEffect, useCallback } from 'react';
import ApiKeyInput from './components/ApiKeyInput';

const CHAT_HISTORY_STORAGE = 'myapp_chat_histories';

interface Message {
  role: string;
  content: string;
}

interface ChatSession {
  id: number;
  title: string;
  messages: Message[];
  timestamp: string;
}

function saveChatHistory(session: ChatSession) {
  const histories: ChatSession[] = JSON.parse(localStorage.getItem(CHAT_HISTORY_STORAGE) || '[]');
  histories.unshift(session);
  localStorage.setItem(CHAT_HISTORY_STORAGE, JSON.stringify(histories));
}

function getChatHistories(): ChatSession[] {
  return JSON.parse(localStorage.getItem(CHAT_HISTORY_STORAGE) || '[]');
}

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [currentChat, setCurrentChat] = useState<Message[]>([]);
  const [histories, setHistories] = useState<ChatSession[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<ChatSession | null>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    setHistories(getChatHistories());
  }, []);

  const handleApiKeyChange = useCallback((key: string) => {
    setApiKey(key);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = { role: 'user', content: input };
    setCurrentChat([...currentChat, newMsg]);
    setInput('');
    // Here you would send the message to your backend/AI API using apiKey
  };

  const handleEndSession = () => {
    if (currentChat.length > 0) {
      const session: ChatSession = {
        id: Date.now(),
        title: currentChat[0]?.content?.slice(0, 20) || 'Chat',
        messages: currentChat,
        timestamp: new Date().toISOString(),
      };
      saveChatHistory(session);
      setHistories(getChatHistories());
      setCurrentChat([]);
    }
  };

  const handleSelectHistory = (history: ChatSession) => {
    setSelectedHistory(history);
  };

  const handleBackToChat = () => {
    setSelectedHistory(null);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside style={{ width: 260, borderRight: '1px solid #ccc', padding: 16, boxSizing: 'border-box' }}>
        <h3>Previous Chats</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {histories.map((h) => (
            <li key={h.id} style={{ marginBottom: 8 }}>
              <button
                style={{ width: '100%', textAlign: 'left', padding: 8, border: 'none', background: '#f5f5f5', cursor: 'pointer' }}
                onClick={() => handleSelectHistory(h)}
              >
                {h.title} <br />
                <small>{new Date(h.timestamp).toLocaleString()}</small>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main style={{ flex: 1, padding: 24 }}>
        <ApiKeyInput onApiKeyChange={handleApiKeyChange} />
        {selectedHistory ? (
          <div>
            <h4>Chat History</h4>
            <ul>
              {selectedHistory.messages.map((m, i) => (
                <li key={i}><b>{m.role}:</b> {m.content}</li>
              ))}
            </ul>
            <button onClick={handleBackToChat}>Back to Chat</button>
          </div>
        ) : (
          <div>
            <h4>Current Chat</h4>
            <ul>
              {currentChat.map((m, i) => (
                <li key={i}><b>{m.role}:</b> {m.content}</li>
              ))}
            </ul>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              style={{ width: '80%', marginRight: 8 }}
            />
            <button onClick={handleSend}>Send</button>
            <button onClick={handleEndSession} style={{ marginLeft: 8 }}>End Chat Session</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;