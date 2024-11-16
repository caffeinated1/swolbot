import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: 'Hi! I am your personal chatbot. How can I help you?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return; // Prevent empty messages

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/chat', { message: input });
      const botMessage = { text: response.data.reply, sender: 'bot' };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([...messages, userMessage, { text: "Error connecting to server", sender: 'bot' }]);
    }

    setInput('');
    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <h1>SWOLBOT</h1>
      <div className="chat-box">
        {messages.map((message, index) => (
          <div key={index} className={`chat-bubble ${message.sender}`}>
            <p>{message.text}</p>
          </div>
        ))}
        {isLoading && (
          <div className="chat-bubble bot">
            <p>Typing...</p>
          </div>
        )}
        <div className="chat-avatar"></div>
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        aria-label="Message input"
      />
      <button onClick={handleSendMessage} aria-label="Send message">Send</button>
    </div>
  );
};

export default Chatbot;
