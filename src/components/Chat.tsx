import React, { useState } from 'react';
import axios from 'axios';
import './Chat.css';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: {
    japanese: string;
    english: string;
  };
  showEnglish: boolean;
}


const Chat: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: string = input;
    setChatHistory(prev => [...prev, { sender: 'user', text: { japanese: userMessage, english: '' }, showEnglish: false }]);
    setInput('');

    try {
      const response = await axios.post('http://localhost:3001/api/openai', { prompt: userMessage });
      const { japanese, english } = response.data;
      setChatHistory(prev => [...prev, { sender: 'ai', text: { japanese, english }, showEnglish: false }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleTranslation = (index: number) => {
    setChatHistory(prev => prev.map((msg, i) => {
      if (i === index && msg.sender === 'ai') {
        return { ...msg, showEnglish: !msg.showEnglish };
      }
      return msg;
    }));
  };
  

  return (
    <div className='chat-container'>
      <div className="chat-history">
        {chatHistory.map((msg, index) => (
          <div className={`message-wrapper ${msg.sender}`} key={index} onClick={() => msg.sender === 'ai' && toggleTranslation(index)}>
            <div className={`message ${msg.sender}`}>
              {msg.sender === 'ai'
                ? (msg.showEnglish ? msg.text.english : msg.text.japanese)
                : msg.text.japanese // User messages in Japanese
              }
            </div>
            {msg.sender === 'ai' && <div className="translate-text">Tap to translate</div>}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
  
  
};

export default Chat;