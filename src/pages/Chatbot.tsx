import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Plus, MessageSquare, Loader, User, Bot } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatbotService } from '../services/api';

const Chatbot: React.FC = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Add welcome message when component mounts
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      sender: 'assistant',
      content: t('chatbot.welcomeMessage'),
      timestamp: new Date().toISOString(),
    };
    
    setMessages([welcomeMessage]);
  }, [t]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await chatbotService.sendMessage(input.trim());
      
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        content: response.data.response || "I'm sorry, I couldn't process your message.",
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'assistant',
        content: "I'm sorry, there was an error processing your message. Please try again.",
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExampleClick = (example: string) => {
    setInput(example);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {t('chatbot.title')}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left sidebar (only on larger screens) */}
        <div className="hidden md:block">
          <div className="bg-white rounded-lg shadow-md p-4">
            <button className="btn btn-primary w-full mb-4 flex items-center justify-center">
              <Plus className="h-5 w-5 mr-2" />
              {t('chatbot.newChat')}
            </button>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700 mb-2">
                {t('chatbot.examples')}
              </h3>
              {t('chatbot.exampleQuestions', { returnObjects: true }).map((question: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(question)}
                  className="w-full text-left p-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main chat area */}
        <div className="md:col-span-3 flex flex-col h-[70vh]">
          <div className="bg-white rounded-lg shadow-md p-4 flex-grow flex flex-col">
            {/* Chat messages */}
            <div className="flex-grow overflow-y-auto mb-4 scrollbar-hide">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-3/4 rounded-lg p-3 ${
                      message.sender === 'user' 
                        ? 'bg-primary-100 text-gray-800 ml-12'
                        : 'bg-white border border-gray-200 text-gray-800 mr-12'
                    }`}
                  >
                    <div className="flex items-start">
                      {message.sender === 'assistant' && (
                        <Bot className="h-5 w-5 text-primary-600 mr-2 mt-1 flex-shrink-0" />
                      )}
                      {message.sender === 'user' && (
                        <User className="h-5 w-5 text-primary-600 mr-2 mt-1 flex-shrink-0" />
                      )}
                      <div>
                        <p className="whitespace-pre-line">{message.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <Bot className="h-5 w-5 text-primary-600 mr-2" />
                      <p className="text-gray-600">{t('chatbot.loading')}</p>
                      <Loader className="animate-spin h-4 w-4 ml-2 text-primary-600" />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input form */}
            <form onSubmit={handleSubmit} className="mt-auto">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('chatbot.placeholder')}
                  className="input-field pr-12"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-2 text-primary-600 hover:text-primary-700 disabled:text-gray-400"
                >
                  <Send className="h-6 w-6" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;