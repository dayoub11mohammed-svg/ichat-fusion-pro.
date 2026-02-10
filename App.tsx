
import React, { useState, useEffect, useRef } from 'react';
import { AppView, Message, UserProfile } from './types';
import { getAIResponse } from './services/geminiService';
import { 
  ChevronLeft, 
  Send, 
  Camera, 
  Mic, 
  Phone, 
  Video, 
  MoreHorizontal, 
  Search, 
  Plus, 
  Settings, 
  MessageCircle, 
  Shield, 
  EyeOff, 
  Eye,
  Check,
  CheckCheck
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setView(AppView.CHATS);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date(),
      status: 'sent',
      type: 'text'
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsTyping(true);

    // AI simulation logic
    const chatHistory = messages.map(m => ({
      role: m.sender === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: m.text }]
    }));

    const aiReply = await getAIResponse(chatHistory, inputText);
    
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReply,
        timestamp: new Date(),
        status: 'read',
        type: 'text'
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  // Views rendering
  if (view === AppView.LOGIN) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-8">
        <div className="w-20 h-20 bg-gradient-to-tr from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mb-8 shadow-2xl animate-pulse">
          <MessageCircle size={48} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">iChat Fusion</h1>
        <p className="text-gray-400 mb-8 text-center">Telegram speed meets WhatsApp familiarity.</p>
        
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <input 
            type="text" 
            placeholder="Choose your username..."
            className="w-full bg-zinc-900 border-none rounded-xl py-4 px-6 text-white mb-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button 
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 font-semibold py-4 rounded-xl transition-all shadow-lg active:scale-95"
          >
            Start Messaging
          </button>
        </form>
      </div>
    );
  }

  if (view === AppView.CHATS) {
    return (
      <div className="h-screen bg-black flex flex-col">
        {/* iOS Styled Header */}
        <div className="ios-blur sticky top-0 z-50 px-4 pt-12 pb-4 border-b border-zinc-800">
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-bold">Chats</h2>
            <div className="flex space-x-4 mb-1">
              <Camera size={24} className="text-blue-500" />
              <Settings size={24} className="text-blue-500" />
            </div>
          </div>
          <div className="mt-4 bg-zinc-900 flex items-center rounded-xl px-3 py-2">
            <Search size={18} className="text-gray-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent border-none outline-none text-white w-full text-sm"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {/* Featured AI Contact */}
          <div 
            onClick={() => setView(AppView.ROOM)}
            className="flex items-center p-4 hover:bg-zinc-900 cursor-pointer border-b border-zinc-900 transition-colors"
          >
            <div className="relative">
              <img 
                src="https://picsum.photos/seed/ai/100/100" 
                className="w-14 h-14 rounded-full object-cover border border-zinc-700"
                alt="AI Assistant"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-black rounded-full"></div>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-white">Gemini Fusion Assistant</h3>
                <span className="text-xs text-gray-500">Online</span>
              </div>
              <p className="text-sm text-gray-400 truncate mt-1">
                {messages.length > 0 ? messages[messages.length-1].text : "Hi! I'm your hybrid AI assistant. Let's chat!"}
              </p>
            </div>
          </div>

          {/* Dummy Contacts */}
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center p-4 opacity-50 cursor-not-allowed border-b border-zinc-900">
              <img 
                src={`https://picsum.photos/seed/${i}/100/100`} 
                className="w-14 h-14 rounded-full object-cover grayscale"
                alt="User"
              />
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-white">Contact {i}</h3>
                  <span className="text-xs text-gray-500">Yesterday</span>
                </div>
                <p className="text-sm text-gray-400 truncate mt-1">Tap Gemini to start a real chat...</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Bar */}
        <div className="ios-blur border-t border-zinc-800 pb-8 pt-2 flex justify-around">
          <div className="flex flex-col items-center text-blue-500">
            <MessageCircle size={24} />
            <span className="text-[10px] mt-1">Chats</span>
          </div>
          <div className="flex flex-col items-center text-gray-500">
            <Phone size={24} />
            <span className="text-[10px] mt-1">Calls</span>
          </div>
          <div className="flex flex-col items-center text-gray-500">
            <Settings size={24} />
            <span className="text-[10px] mt-1">Settings</span>
          </div>
        </div>
      </div>
    );
  }

  if (view === AppView.ROOM) {
    return (
      <div className="h-screen bg-black flex flex-col relative overflow-hidden">
        {/* iOS Chat Header */}
        <div className="ios-blur sticky top-0 z-50 px-4 pt-12 pb-3 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => setView(AppView.CHATS)} className="text-blue-500 flex items-center">
              <ChevronLeft size={28} />
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold -ml-1 border-2 border-black">
                9+
              </div>
            </button>
            <div className="flex items-center ml-2">
              <img src="https://picsum.photos/seed/ai/100/100" className="w-10 h-10 rounded-full" />
              <div className="ml-3">
                <h4 className="font-bold text-sm">Gemini Assistant</h4>
                <p className="text-[10px] text-green-500">online</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-5 text-blue-500">
            <Video size={22} />
            <Phone size={22} />
            <button onClick={() => setIsPrivacyMode(!isPrivacyMode)} className={isPrivacyMode ? 'text-red-500' : 'text-blue-500'}>
              {isPrivacyMode ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>
        </div>

        {/* Chat Background & Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 relative" 
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #111 0%, #000 100%)`,
          }}
        >
          {messages.length === 0 && (
            <div className="text-center mt-20 text-gray-600 space-y-2">
              <Shield size={32} className="mx-auto mb-4 opacity-20" />
              <p className="text-xs uppercase tracking-widest font-bold">Encrypted End-to-End</p>
              <p className="text-sm px-10">Messages are secured with iOS Advanced Data Protection logic.</p>
            </div>
          )}

          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} group animate-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`
                max-w-[75%] rounded-2xl px-4 py-2 relative
                ${msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-zinc-800 text-white rounded-tl-none'}
                ${isPrivacyMode ? 'privacy-blur' : 'no-blur'}
                shadow-sm
              `}>
                <p className="text-[15px] leading-relaxed">{msg.text}</p>
                <div className={`flex items-center justify-end space-x-1 mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-zinc-500'}`}>
                  <span className="text-[10px]">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.sender === 'user' && (
                    <CheckCheck size={12} className={msg.status === 'read' ? 'text-blue-100' : 'text-blue-300'} />
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="bg-zinc-800 rounded-2xl px-4 py-3 flex space-x-1 items-center">
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="ios-blur px-2 pt-2 pb-8 border-t border-zinc-800 flex items-end space-x-2">
          <button className="p-2 text-blue-500">
            <Plus size={26} />
          </button>
          
          <div className="flex-1 bg-zinc-900 rounded-2xl px-3 py-2 flex items-center border border-zinc-800">
            <textarea 
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="iMessage"
              className="bg-transparent flex-1 text-white text-[15px] outline-none resize-none max-h-32"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            {inputText ? (
              <button 
                onClick={sendMessage}
                className="bg-blue-500 text-white p-1.5 rounded-full ml-2 active:scale-90 transition-transform"
              >
                <Send size={18} fill="currentColor" />
              </button>
            ) : (
              <div className="flex space-x-3 text-blue-500 ml-2">
                <Camera size={22} />
                <Mic size={22} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default App;
