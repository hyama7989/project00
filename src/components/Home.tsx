import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, Menu, Settings, Edit, LogOut, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';

export default function Home() {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { state, dispatch } = useApp();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date().toISOString(),
      isUser: true,
      emotion: 'neutral'
    };

    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(message),
        timestamp: new Date().toISOString(),
        isUser: false,
        emotion: detectEmotion(message)
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: aiMessage });
    }, 1000);

    setMessage('');
  };

  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      "I understand how you're feeling. Would you like to talk more about what's on your mind?",
      "It sounds like you're going through something important. I'm here to listen.",
      "Thank you for sharing that with me. How are you feeling right now?",
      "That's a really meaningful thought. What would help you feel better today?",
      "I hear you. Sometimes talking through our feelings can be really helpful."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const detectEmotion = (text: string): string => {
    if (text.toLowerCase().includes('happy') || text.toLowerCase().includes('good')) return 'happy';
    if (text.toLowerCase().includes('sad') || text.toLowerCase().includes('down')) return 'sad';
    if (text.toLowerCase().includes('angry') || text.toLowerCase().includes('mad')) return 'angry';
    if (text.toLowerCase().includes('anxious') || text.toLowerCase().includes('worried')) return 'anxious';
    return 'neutral';
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Voice input implementation would go here
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.div 
          className="p-4 border-b border-gray-700/50 flex justify-between items-center backdrop-blur-md bg-gray-800/30"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Emotion Companion
          </h1>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {state.chatMessages.length === 0 && (
            <motion.div 
              className="text-center text-gray-400 mt-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-lg mb-2">Welcome to your personal emotion companion</p>
              <p>Share your thoughts and feelings - I'm here to listen and support you.</p>
            </motion.div>
          )}
          
          {state.chatMessages.map((msg, index) => (
            <motion.div
              key={msg.id}
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                msg.isUser 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'bg-gray-700/50 backdrop-blur-md border border-gray-600/50'
              }`}>
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <motion.div 
          className="p-4 border-t border-gray-700/50 backdrop-blur-md bg-gray-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts and feelings..."
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              />
            </div>
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-3 rounded-xl transition-all duration-300 ${
                isRecording 
                  ? 'bg-red-500 text-white shadow-red-500/25' 
                  : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              type="submit"
              className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      </div>

      {/* Sidebar */}
      <motion.div
        className={`w-80 bg-gray-800/50 backdrop-blur-md border-l border-gray-700/50 transition-all duration-300 ${
          showSidebar ? 'translate-x-0' : 'translate-x-full'
        } fixed right-0 top-0 h-full z-40`}
        initial={false}
        animate={{ x: showSidebar ? 0 : '100%' }}
      >
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{state.user?.username}</h2>
              <p className="text-gray-400">{state.user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setShowEditProfile(true)}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <Edit className="w-5 h-5" />
              <span>Edit Profile</span>
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
}