'use client';

import React, { useState, FormEvent, useRef, useEffect } from 'react';

// Define the structure of a message
interface Message {
  role: 'user' | 'bot';
  content: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the message list whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Handle the form submission (when user sends a message)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send the user's message to our new API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      const botMessage: Message = { role: 'bot', content: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        role: 'bot',
        content: 'Sorry, I am having trouble connecting. Please try again later.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* The Chat Popup Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chat-popup-button"
          title="Open F1 Chat"
        >
          {/* Simple Chat Icon (SVG) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      )}

      {/* The Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <h3>F1 Chat Assistant</h3>
            <button onClick={() => setIsOpen(false)} title="Close Chat">
              &times;
            </button>
          </div>

          {/* Message List */}
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <p>{msg.content}</p>
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <p><i>Thinking...</i></p>
              </div>
            )}
            {/* Empty div to force scroll to bottom */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="chat-form">
            <input
              type="text"
              className="chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about F1..."
              disabled={isLoading}
            />
            <button type="submit" className="chat-send" disabled={isLoading}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;