import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, TrashIcon, SunIcon, MoonIcon, Cog6ToothIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [modelInfo, setModelInfo] = useState({
    name: "HumanGPT",
    version: "1.0.0",
    description: "An advanced AI assistant powered by state-of-the-art language models.",
    capabilities: [
      "Natural conversation",
      "Code assistance",
      "Creative writing",
      "Problem solving",
      "Knowledge sharing"
    ]
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://insight-chatbot.app.n8n.cloud/webhook/humangpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatInput: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server did not return JSON');
      }

      const data = await response.json();
      
      if (!data || typeof data.output !== 'string') {
        throw new Error('Invalid response format from server');
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.output,
        timestamp: new Date().toLocaleTimeString(),
      }]);
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      if (error.message.includes('JSON')) {
        errorMessage = 'The server response was not in the expected format. Please try again.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = 'Unable to connect to the server. Please check your connection and try again.';
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date().toLocaleTimeString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-20'} transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 shadow-lg`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🤖</span>
              {isSidebarOpen && <h2 className="text-xl font-semibold dark:text-white">HumanGPT</h2>}
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {isSidebarOpen && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Model Information</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{modelInfo.description}</p>
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Capabilities</h4>
                  <ul className="space-y-1">
                    {modelInfo.capabilities.map((capability, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                        {capability}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Conversation Stats</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white dark:bg-gray-800 rounded p-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Messages</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{messages.length}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded p-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Words</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {messages.reduce((acc, msg) => acc + msg.content.split(' ').length, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Chat</h1>
              <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                {modelInfo.version}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>
              <button
                onClick={clearChat}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
              <button
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Cog6ToothIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl mb-4">🤖</span>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Welcome to HumanGPT</h2>
                <p className="text-gray-500 dark:text-gray-400">Start a conversation by typing a message below.</p>
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-gray-800 shadow-sm'
                }`}
              >
                <div className="prose prose-sm dark:prose-invert">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
                <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg px-4 py-2">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="border-t bg-white dark:bg-gray-800 p-4">
          <div className="max-w-7xl mx-auto flex space-x-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Type your message..."
              className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 p-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              rows="1"
              style={{ minHeight: '44px', maxHeight: '200px' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-primary-500 text-white rounded-lg px-4 py-2 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App; 