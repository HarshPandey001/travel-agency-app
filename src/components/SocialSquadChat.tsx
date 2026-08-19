import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, Shield, User, Check, Users } from 'lucide-react';
import { UserProfile } from '../types';

interface SocialSquadChatProps {
  tripId: string;
  tripTitle: string;
  currentUser: UserProfile | null;
}

interface ChatMessage {
  id: string;
  senderName: string;
  senderGender: 'male' | 'female';
  role: 'Captain' | 'Traveler';
  avatar: string;
  text: string;
  timestamp: string;
}

export const SocialSquadChat: React.FC<SocialSquadChatProps> = ({
  tripId,
  tripTitle,
  currentUser
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      senderName: 'Vikram "Vicky" Negi',
      senderGender: 'male',
      role: 'Captain',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      text: `Welcome to the ${tripTitle} Squad! 🏔 I'm Vicky, your agency Trip Captain. Feel free to say hi and coordinate your packing!`,
      timestamp: 'Yesterday 06:30 PM'
    },
    {
      id: 'msg-2',
      senderName: 'Ananya Sharma',
      senderGender: 'female',
      role: 'Traveler',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      text: 'Hey everyone! Traveling solo from Gorakhpur. Excited for the bonfires and cafe crawl! 🔥',
      timestamp: 'Today 10:15 AM'
    },
    {
      id: 'msg-3',
      senderName: 'Rohan Gupta',
      senderGender: 'male',
      role: 'Traveler',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      text: 'Hey Ananya! I am joining from Lucknow Hub. Bringing my acoustic guitar for the night bonfire! 🎸',
      timestamp: 'Today 11:40 AM'
    }
  ]);

  const [inputMsg, setInputMsg] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: currentUser?.name || 'Traveler',
      senderGender: currentUser?.gender || 'female',
      role: currentUser?.isAdmin ? 'Captain' : 'Traveler',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      text: inputMsg.trim(),
      timestamp: 'Just now'
    };

    setMessages([...messages, newMsg]);
    setInputMsg('');
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-2xl">
      
      {/* Squad Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-base font-bold font-display text-white">Pre-Trip Social Squad Room</h4>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Live Squad Hub
              </span>
            </div>
            <p className="text-xs text-slate-400">Connect with fellow travelers and your Trip Captain before boarding.</p>
          </div>
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80 max-h-72 overflow-y-auto space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="flex items-start space-x-3 text-xs">
            <img
              src={m.avatar}
              alt={m.senderName}
              className="w-8 h-8 rounded-full object-cover border border-slate-700 flex-shrink-0"
            />
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-white">{m.senderName}</span>
                  {m.role === 'Captain' ? (
                    <span className="bg-amber-400/20 text-amber-300 text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-md border border-amber-400/30">
                      ★ Trip Captain
                    </span>
                  ) : (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      m.senderGender === 'female' ? 'bg-pink-950 text-pink-300 border border-pink-500/30' : 'bg-sky-950 text-sky-300 border border-sky-500/30'
                    }`}>
                      {m.senderGender === 'female' ? '♀ Female Traveler' : '♂ Male Traveler'}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500">{m.timestamp}</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">{m.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder={currentUser ? "Introduce yourself or ask a question to the squad..." : "Sign in to chat with fellow travelers..."}
          disabled={!currentUser}
          className="flex-1 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!currentUser || !inputMsg.trim()}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1 shadow-md disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>

    </div>
  );
};
