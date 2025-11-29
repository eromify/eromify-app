import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MoreVertical, Send, ArrowLeft, Menu, X, Loader2 } from 'lucide-react';
import { marketplaceModels } from '../data/marketplaceModels';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { saveReturnPath } from '../utils/redirectHelper';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [sending, setSending] = useState(false);
  const processedChatsRef = useRef(new Set());

  // Get available models for conversations
  const availableModels = marketplaceModels.filter(model => !model.isBlackedOut && !model.fullyClaimed);

  // Hardcoded first messages - rotated across influencers
  const FIRST_MESSAGES = [
    "Hey trouble… I just got out of the shower and can't stop thinking about how much better it would've been if you were in here with me, hands everywhere, water running down your chest… tell me I'm not the only one picturing it right now 😈",
    "Currently lying in bed in the tiniest black lace set because I felt like being bad tonight… wish you were here to tell me exactly how you'd take it off me, slowly or all at once? 👀",
    "Random confession: I'm already soaked just thinking about how good you'd feel inside me. I shouldn't say that in the first message but fuck it, you look like the kind of trouble I need right now.",
    "Quick warning: I'm the type of girl your mom told you to stay away from… the kind who sends you nudes at work, whispers filthy things on calls, and ruins you for anyone else. Still want to say hi? 😈"
  ];

  // Get first message for a model (rotated based on model ID)
  const getFirstMessage = (modelId) => {
    // Use model ID to rotate through messages
    const messageIndex = modelId % FIRST_MESSAGES.length;
    return FIRST_MESSAGES[messageIndex];
  };

  // Initialize empty chat messages - conversations start empty
  useEffect(() => {
    const initialMessages = {};
    availableModels.forEach(model => {
      initialMessages[model.id] = []; // Start with empty conversations
    });
    setChatMessages(initialMessages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Check if we're coming from discover page (has modelId in URL)
  const modelIdFromUrl = searchParams.get('modelId');
  
  // Filter conversations - only show chats that have been opened (have messages)
  // BUT also include the chat from URL if it exists (even if not opened yet)
  const openedChats = availableModels.filter(model => {
    const messages = chatMessages[model.id] || [];
    const isFromUrl = modelIdFromUrl && parseInt(modelIdFromUrl) === model.id;
    return messages.length > 0 || isFromUrl; // Show if has messages OR is the one from URL
  });

  // Filter opened chats based on search
  const filteredModels = openedChats.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get messages for selected chat
  const currentMessages = selectedChat ? (chatMessages[selectedChat.id] || []) : [];

  // When a chat is selected, always show the first message
  useEffect(() => {
    if (!selectedChat) return;

    const modelId = selectedChat.id;
    
    // Only process each chat once
    if (processedChatsRef.current.has(modelId)) return;
    
    // Mark as processed immediately
    processedChatsRef.current.add(modelId);
    
    // Get first message instantly (no API call)
    setChatMessages(prev => {
      // Only add if still empty (user might have sent a message)
      const currentMessages = prev[modelId] || [];
      if (currentMessages.length === 0) {
        const firstMessage = getFirstMessage(modelId);
        const firstMessageObj = {
          id: Date.now(),
          text: firstMessage,
          sender: 'model',
          timestamp: new Date()
        };
        return {
          ...prev,
          [modelId]: [firstMessageObj]
        };
      }
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat?.id]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat || sending) return;

    const userMessage = {
      id: Date.now(),
      text: message.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    // Add user message immediately
    setChatMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...currentMessages, userMessage]
    }));

    const messageToSend = message.trim();
    setMessage('');
    setSending(true);

    try {

      // Prepare conversation history (last 10 messages for context)
      const historyForAPI = currentMessages
        .slice(-10)
        .map(msg => ({
          sender: msg.sender,
          text: msg.text
        }));

      // Call the API
      const response = await api.post('/ai-girlfriend-chat/message', {
        message: messageToSend,
        modelId: selectedChat.id,
        conversationHistory: historyForAPI
      });

      if (response.data.success && response.data.response) {
        const responseData = response.data.response;
        
        console.log('📥 [ChatPage] Received response:', {
          type: responseData.type,
          photoUrl: responseData.photoUrl,
          isSending: responseData.isSending,
          isPaid: responseData.isPaid
        });
        
        // Handle photo response
        if (responseData.type === 'photo' && responseData.isSending) {
          console.log('📸 [ChatPage] Processing photo response with URL:', responseData.photoUrl);
          // Show "sending photo" message
          const sendingMessage = {
            id: Date.now() + 1,
            text: responseData.text,
            sender: 'model',
            timestamp: new Date(responseData.timestamp || Date.now()),
            type: 'photo',
            isSending: true,
            photoUrl: responseData.photoUrl,
            isPaid: responseData.isPaid || false // Store subscription status
          };

          setChatMessages(prev => ({
            ...prev,
            [selectedChat.id]: [...(prev[selectedChat.id] || []), sendingMessage]
          }));

          // Simulate photo loading (1-2 seconds)
          setTimeout(() => {
            const photoMessage = {
              id: Date.now() + 2,
              text: responseData.photoUrl ? '' : 'Photo coming soon...',
              sender: 'model',
              timestamp: new Date(),
              type: 'photo',
              photoUrl: responseData.photoUrl,
              isSending: false,
              isPaid: responseData.isPaid || false // Store subscription status for blur logic
            };

            setChatMessages(prev => ({
              ...prev,
              [selectedChat.id]: prev[selectedChat.id].map(msg => 
                msg.id === sendingMessage.id ? photoMessage : msg
              )
            }));
          }, 1500);
        } else {
          // Regular text response
          const aiResponse = {
            id: Date.now() + 1,
            text: responseData.text,
            sender: 'model',
            timestamp: new Date(responseData.timestamp || Date.now())
          };

          setChatMessages(prev => ({
            ...prev,
            [selectedChat.id]: [...(prev[selectedChat.id] || []), aiResponse]
          }));
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      // Show error message
      const errorMsg = error.response?.data?.error || 'Failed to send message. Please try again.';
      toast.error(errorMsg);

      // If it's a limit error, show upgrade prompt
      if (error.response?.data?.upgradeRequired) {
        toast.error('Daily limit reached. Upgrade to premium for unlimited messages!', {
          duration: 5000
        });
      }

      // Still add a fallback message so conversation continues
      const fallbackResponse = {
        id: Date.now() + 1,
        text: "I'm having trouble responding right now. Can you try again?",
        sender: 'model',
        timestamp: new Date()
      };

      setChatMessages(prev => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), fallbackResponse]
      }));
    } finally {
      setSending(false);
    }
  };

  // Get last message for a conversation
  const getLastMessage = (modelId) => {
    const messages = chatMessages[modelId] || [];
    if (messages.length === 0) return 'No messages yet';
    const lastMsg = messages[messages.length - 1];
    // Handle photo messages
    if (lastMsg.type === 'photo') {
      return lastMsg.isSending ? 'Sending photo...' : (lastMsg.photoUrl ? 'Photo' : 'Photo coming soon...');
    }
    return lastMsg.text.length > 40 ? lastMsg.text.substring(0, 40) + '...' : lastMsg.text;
  };

  // Get last message time
  const getLastMessageTime = (modelId) => {
    const messages = chatMessages[modelId] || [];
    if (messages.length === 0) return '';
    const lastMsg = messages[messages.length - 1];
    return lastMsg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Auto-select chat based on URL parameter only (don't auto-select first)
  useEffect(() => {
    const modelIdParam = searchParams.get('modelId');
    if (modelIdParam && availableModels.length > 0) {
      const modelId = parseInt(modelIdParam);
      const model = availableModels.find(m => m.id === modelId);
      if (model && (!selectedChat || selectedChat.id !== modelId)) {
        setSelectedChat(model);
        // Ensure messages array exists for this model (empty initially)
        setChatMessages(prev => {
          if (!prev[modelId]) {
            return { ...prev, [modelId]: [] };
          }
          return prev;
        });
      }
    }
    // Don't auto-select first model - let user choose from the list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, availableModels.length]);

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
            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
              <Link to="/discover" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Home</Link>
              <Link to="/chat" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Chat</Link>
              <Link to="/generation" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Generate Image</Link>
              <Link to="/ai-girlfriend-pricing" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Pricing</Link>
              <Link to="/account" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Account</Link>
            </div>
            {/* Desktop Auth Buttons - Right */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" onClick={saveReturnPath} className="text-white hover:text-gray-300 text-sm font-medium">Sign In</Link>
              <Link to="/register" onClick={saveReturnPath} className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                Get Started
              </Link>
            </div>
            {/* Mobile Sign In and Get Started - Right side */}
            <div className="md:hidden flex items-center space-x-2">
              <Link to="/login" onClick={saveReturnPath} className="text-white hover:text-gray-300 text-sm font-medium">Sign In</Link>
              <Link to="/register" onClick={saveReturnPath} className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
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
            {filteredModels.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-gray-400 text-sm">No conversations yet</p>
                <p className="text-gray-500 text-xs mt-2">Start a chat from the discover page</p>
              </div>
            ) : (
              filteredModels.map((model) => (
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
              ))
            )}
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
                              const modelId = selectedChat.id;
                              // Reset chat - clear messages and allow first message to load again
                              processedChatsRef.current.delete(modelId);
                              setChatMessages(prev => ({
                                ...prev,
                                [modelId]: []
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
                {currentMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">No messages yet</p>
                      <p className="text-gray-500 text-xs mt-2">Start the conversation by sending a message</p>
                    </div>
                  </div>
                ) : (
                  currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.type === 'photo' ? (
                      // Photo message
                      <div className="max-w-[70%] rounded-2xl overflow-hidden bg-gray-800">
                        {msg.isSending ? (
                          // Loading state
                          <div className="px-4 py-3">
                            <p className="text-sm text-white mb-2">{msg.text}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full animate-pulse" style={{ width: '31%' }}></div>
                              </div>
                              <span className="text-xs text-gray-400">31%</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">This might take a few seconds</p>
                          </div>
                        ) : msg.photoUrl ? (
                          // Photo loaded - blur for free users, clear for paid users
                          <div className="relative">
                            <img 
                              src={msg.photoUrl} 
                              alt="Photo from model" 
                              className={`w-full max-w-md object-cover ${
                                msg.isPaid ? '' : 'blur-md'
                              }`}
                              style={msg.isPaid ? {} : { filter: 'blur(20px)' }}
                            />
                            {!msg.isPaid && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <div className="text-center px-4">
                                  <p className="text-white font-semibold mb-2">Unlock this photo</p>
                                  <p className="text-gray-300 text-sm mb-3">Subscribe to see unblurred photos</p>
                                  <Link 
                                    to="/ai-girlfriend-pricing" 
                                    className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
                                  >
                                    View Plans
                                  </Link>
                                </div>
                              </div>
                            )}
                            {msg.text && (
                              <p className="text-sm text-white px-4 py-2">{msg.text}</p>
                            )}
                            <p className="text-xs text-gray-400 px-4 pb-2">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        ) : (
                          // Photo URL not set yet
                          <div className="px-4 py-3">
                            <p className="text-sm text-white">{msg.text || 'Photo coming soon...'}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Regular text message
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
                    )}
                  </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="p-3 sm:p-4 border-t border-gray-800 bg-black flex-shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !sending) {
                        handleSendMessage();
                      }
                    }}
                    placeholder={sending ? "Sending..." : "Write a message..."}
                    disabled={sending}
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 sm:py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm sm:text-base min-w-0 disabled:opacity-50"
                    autoFocus
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || sending}
                    className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <Send className="w-5 h-5 text-white" />
                    )}
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

