import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MoreVertical, Send, Paperclip, Image as ImageIcon, ArrowLeft, Menu, X } from 'lucide-react';
import { marketplaceModels } from '../data/marketplaceModels';
import { useAuth } from '../contexts/AuthContext';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // Get available models for conversations
  const availableModels = marketplaceModels.filter(model => !model.isBlackedOut && !model.fullyClaimed);

  // Initialize chat messages with welcome messages
  useEffect(() => {
    const initialMessages = {};
    availableModels.forEach(model => {
      initialMessages[model.id] = [{
        id: 1,
        text: `Hey! I'm ${model.name.split(' ')[0]}. What's on your mind? 😊`,
        sender: 'model',
        timestamp: new Date(Date.now() - Math.random() * 86400000) // Random time in last 24h
      }];
    });
    setChatMessages(initialMessages);
  }, []);

  // Filter conversations based on search
  const filteredModels = availableModels.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get messages for selected chat
  const currentMessages = selectedChat ? (chatMessages[selectedChat.id] || []) : [];

  // Handle sending a message
  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: currentMessages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...currentMessages, newMessage]
    }));

    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: currentMessages.length + 2,
        text: "That's interesting! Tell me more 😊",
        sender: 'model',
        timestamp: new Date()
      };
      setChatMessages(prev => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), aiResponse]
      }));
    }, 1000);
  };

  // Get last message for a conversation
  const getLastMessage = (modelId) => {
    const messages = chatMessages[modelId] || [];
    if (messages.length === 0) return 'Start a conversation...';
    const lastMsg = messages[messages.length - 1];
    return lastMsg.text.length > 40 ? lastMsg.text.substring(0, 40) + '...' : lastMsg.text;
  };

  // Get last message time
  const getLastMessageTime = (modelId) => {
    const messages = chatMessages[modelId] || [];
    if (messages.length === 0) return '';
    const lastMsg = messages[messages.length - 1];
    return lastMsg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Auto-select chat based on URL parameter or first available
  useEffect(() => {
    const modelIdParam = searchParams.get('modelId');
    if (modelIdParam && filteredModels.length > 0) {
      const modelId = parseInt(modelIdParam);
      const model = filteredModels.find(m => m.id === modelId);
      if (model && (!selectedChat || selectedChat.id !== modelId)) {
        setSelectedChat(model);
        return;
      }
    }
    // If no modelId param or model not found, select first if nothing selected
    if (!selectedChat && filteredModels.length > 0) {
      setSelectedChat(filteredModels[0]);
    }
  }, [searchParams, filteredModels.length]);

  // Close menu when chat changes
  useEffect(() => {
    setShowMenu(false);
  }, [selectedChat]);

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Navigation */}
      <nav className="bg-black border-b border-gray-800 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Mobile Hamburger Menu - Far Left */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white p-2 -ml-4"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link to="/discover" className="flex items-center">
                <img src="/logo.png" alt="Eromify" className="h-40 w-auto" />
              </Link>
            </div>
            {/* Sign In and Get Started - Right side */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link to="/login" className="text-white hover:text-gray-300 text-sm font-medium">Sign In</Link>
              <Link to="/register" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/discover" onClick={() => setMobileMenuOpen(false)} className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">Home</Link>
              <Link to="/chat" onClick={() => setMobileMenuOpen(false)} className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">Chat</Link>
              <Link to="/generation" onClick={() => setMobileMenuOpen(false)} className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">Generate Image</Link>
              <Link to="/ai-girlfriend-pricing" onClick={() => setMobileMenuOpen(false)} className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">Pricing</Link>
              <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">Account</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Chat Interface */}
      <div className="flex-1 flex overflow-hidden min-h-0 max-h-full">
        {/* Conversations List */}
        <div className={`${selectedChat ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 border-r border-gray-800 bg-[#1A1A1A] flex-col min-h-0`}>
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-800 flex-shrink-0">
            <h2 className="text-xl font-semibold mb-4">Chat</h2>
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for a profile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {filteredModels.map((model) => (
              <div
                key={model.id}
                onClick={() => setSelectedChat(model)}
                className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-900 transition-colors ${
                  selectedChat?.id === model.id ? 'bg-gray-900' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={model.images[0]}
                      alt={model.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-white font-medium truncate">{model.name}</h3>
                      <span className="text-gray-400 text-xs flex-shrink-0 ml-2">
                        {getLastMessageTime(model.id)}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm truncate">
                      {getLastMessage(model.id)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${selectedChat ? 'flex' : 'hidden lg:flex'} flex-1 flex-col bg-black min-h-0 overflow-hidden`}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors mr-2"
                  >
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={selectedChat.images[0]}
                      alt={selectedChat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{selectedChat.name}</h3>
                    <p className="text-gray-400 text-xs">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative">
                  <button 
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowMenu(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-20">
                        <button
                          onClick={() => {
                            if (selectedChat) {
                              // Reset chat - clear messages and add welcome message
                              setChatMessages(prev => ({
                                ...prev,
                                [selectedChat.id]: [{
                                  id: 1,
                                  text: `Hey! I'm ${selectedChat.name.split(' ')[0]}. What's on your mind? 😊`,
                                  sender: 'model',
                                  timestamp: new Date()
                                }]
                              }));
                            }
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-4 py-3 text-white hover:bg-gray-800 transition-colors text-sm"
                        >
                          Reset Chat
                        </button>
                        <button
                          onClick={() => {
                            if (selectedChat) {
                              // Delete chat - remove messages and deselect
                              setChatMessages(prev => {
                                const newMessages = { ...prev };
                                delete newMessages[selectedChat.id];
                                return newMessages;
                              });
                              setSelectedChat(null);
                            }
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-4 py-3 text-red-400 hover:bg-gray-800 transition-colors text-sm border-t border-gray-700"
                        >
                          Delete Chat
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4" id="messages" style={{ minHeight: 0 }}>
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-gray-800 text-white'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                      }`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-3 sm:p-4 border-t border-gray-800 bg-black flex-shrink-0">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0">
                    <Paperclip className="w-5 h-5 text-gray-400" />
                  </button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    placeholder="Write a message..."
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 sm:py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm sm:text-base min-w-0"
                    autoFocus
                  />
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">Select a conversation</h3>
                <p className="text-gray-400">Choose an influencer from the list to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

