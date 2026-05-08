import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';

const quickQuestions = [
  "What crops grow best here?",
  "How much water does rice need?",
  "Signs of nitrogen deficiency?",
  "Best fertilizer for tomatoes?"
];

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am CropSense AI. How can I help you with your farming today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('token');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e, directMessage = null) => {
    if (e) e.preventDefault();
    const userText = (directMessage || input).trim();
    if (!userText) return;

    const newMsg = { id: Date.now(), text: userText, sender: 'user' };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const stored = localStorage.getItem('farmData');
      let location = null, weather = null, soilData = null;
      if (stored) {
        try {
          const farmD = JSON.parse(stored);
          location = farmD.location;
          weather = farmD.weather;
          soilData = farmD.soil;
        } catch(e) {}
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { message: userText, location, weather, soilData };
      const res = await axios.post('/api/chat', payload, config);
      
      const botMsg = { id: Date.now() + 1, text: res.data.reply, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sorry, I couldn't connect. Please try again.", sender: 'bot', isError: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>🤖 Ask AI Assistant</h2>
        <p>Get instant advice on crops, fertilizers, and pest control.</p>
      </div>

      <div className="chat-box card" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <div className="messages-area">
          {messages.map(msg => (
            <div key={msg.id} className={`message-bubble ${msg.sender} ${msg.isError ? 'error-bubble' : ''}`}>
              <div className="bubble-content">{msg.text}</div>
            </div>
          ))}
          {isTyping && (
            <div className="message-bubble bot typing">
              <span className="dot"></span><span className="dot"></span><span className="dot"></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          {quickQuestions.map((q, idx) => (
            <button 
              key={idx} 
              onClick={() => setInput(q)}
              style={{
                background: '#e8f5e9', 
                color: '#2e7d32', 
                border: '1px solid #a5d6a7',
                borderRadius: '20px', 
                padding: '6px 14px', 
                fontSize: '0.8rem',
                cursor: 'pointer', 
                margin: '4px', 
                display: 'inline-block'
              }}
            >
              {q}
            </button>
          ))}
        </div>

        <form className="chat-input-area" onSubmit={(e) => handleSend(e, null)}>
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Ask a question..." 
          />
          <button type="submit" disabled={isTyping || !input.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
