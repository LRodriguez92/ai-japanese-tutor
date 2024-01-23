import React, { useState } from 'react';
import axios from 'axios';
import './Chat.css';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

const Chat: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: string = input;
    setChatHistory(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');

    try {
      const response = await axios.post('http://localhost:3001/api/openai', { prompt: userMessage });
      setChatHistory(prev => [...prev, { sender: 'user', text: userMessage }, { sender: 'ai', text: response.data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <div className="chat-history">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
