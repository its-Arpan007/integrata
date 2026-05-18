"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Zap, Headphones, Coffee, Rocket, Lightbulb, Check } from "lucide-react";
import type { User } from "@/types";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  isSender: boolean;
  timestamp: string;
}

interface ChatModalProps {
  user: User | null;
  onClose: () => void;
}

export function ChatModal({ user, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const placeholders = [
    "pitch your chaotic startup idea...",
    "drop your 3 AM thoughts...",
    "describe your cursed hackathon plan...",
    "share your latest sleep-deprived idea...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user && messages.length === 0) {
      setMessages([
        {
          id: "1",
          text: `Hey! Thanks for accepting my ping. I'm really excited to connect with you about the project.`,
          isSender: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }
  }, [user, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || !user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isSender: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "That sounds awesome! What stack are you thinking of using?",
        "I totally agree. I've been experimenting with similar ideas recently.",
        "Could you tell me a bit more about how you usually handle the backend?",
        "Let's definitely set up a quick call later this week to hash out the details!",
        "Haha, classic developer struggle. I've been there."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isSender: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1500 + Math.random() * 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const sendQuickAction = (text: string) => {
    const newMessage: Message = { id: Date.now().toString(), text, isSender: true, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: "Let's do it! 🚀", isSender: false, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1500);
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center sm:items-end sm:justify-end sm:p-6 pointer-events-none"
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto sm:hidden" onClick={onClose} />
        
        <motion.div
          initial={{ y: "100%", opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: "100%", opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full h-full sm:h-[600px] sm:w-[400px] glass-static sm:rounded-2xl flex flex-col shadow-2xl pointer-events-auto border-t sm:border border-glass-border overflow-hidden"
        >
          {/* Chat Background Atmosphere */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-[url('/grid.svg')] bg-center opacity-[0.03] animate-[spin_120s_linear_infinite]" />
            <motion.div animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-32 -right-32 w-64 h-64 bg-accent-purple/20 blur-[80px] rounded-full" />
            <motion.div animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute -bottom-32 -left-32 w-64 h-64 bg-accent-pink/20 blur-[80px] rounded-full" />
          </div>

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between p-4 border-b border-glass-border/50 bg-bg-secondary/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover bg-bg-tertiary" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent-emerald border-2 border-bg-secondary" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  {user.name}
                  <span className="px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold bg-accent-emerald/10 text-accent-emerald">Online</span>
                </h3>
                {user.builderMood ? (
                  <p className="text-[10px] text-text-secondary mt-0.5 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-pink animate-pulse" />
                    {user.builderMood}
                  </p>
                ) : user.liveVibe ? (
                  <p className="text-[10px] text-text-secondary mt-0.5 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-pink animate-pulse" />
                    {user.liveVibe.status}
                  </p>
                ) : (
                  <p className="text-xs text-accent-emerald font-medium">Active now</p>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-target">
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {/* Shared Context Intro */}
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 mb-6">
              <div className="relative">
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-accent-emerald/20 blur-xl rounded-full" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-emerald/20 to-accent-cyan/20 border border-accent-emerald/30 flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <Zap className="w-8 h-8 text-accent-emerald" />
                </div>
              </div>
              
              <div>
                <h4 className="text-[11px] uppercase tracking-widest font-bold text-accent-emerald mb-1">Collaboration Initiated ⚡</h4>
                <p className="text-xs text-text-muted">You and {user.name} are now connected.</p>
              </div>

              {/* Shared Builder DNA Panel */}
              <div className="w-full text-left bg-black/40 border border-white/5 rounded-xl p-4 shadow-inner mt-2">
                <div className="text-[10px] uppercase font-bold text-accent-purple tracking-widest mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Shared Builder DNA
                </div>
                <div className="space-y-1.5">
                  {user.matchInsights?.length ? user.matchInsights.map((insight, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-text-primary">
                      <Check className="w-3 h-3 text-accent-emerald mt-0.5 shrink-0 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                      <span>{insight}</span>
                    </div>
                  )) : (
                    <>
                      <div className="flex items-start gap-2 text-[11px] text-text-primary"><Check className="w-3 h-3 text-accent-emerald mt-0.5 shrink-0" /><span>Both prefer shipping fast over sleeping</span></div>
                      <div className="flex items-start gap-2 text-[11px] text-text-primary"><Check className="w-3 h-3 text-accent-emerald mt-0.5 shrink-0" /><span>Similar chaotic debugging habits</span></div>
                    </>
                  )}
                </div>
              </div>

              {/* Collab Energy */}
              <div className="px-3 py-1.5 rounded-full bg-accent-pink/10 border border-accent-pink/20 text-[10px] font-bold text-accent-pink uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-pink animate-pulse" />
                Collab Energy: High Chaos
              </div>
            </div>

            {messages.map((msg) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id}
                className={cn(
                  "flex w-full",
                  msg.isSender ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                  msg.isSender 
                    ? "bg-gradient-to-br from-accent-purple to-accent-pink text-white rounded-tr-sm" 
                    : "bg-white/10 text-text-primary rounded-tl-sm"
                )}>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <span className={cn(
                    "text-[10px] mt-1 block",
                    msg.isSender ? "text-white/70 text-right" : "text-text-muted"
                  )}>
                    {msg.timestamp}
                  </span>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions & AI Icebreaker */}
          <div className="relative z-10 px-3 pb-1 pt-2 bg-gradient-to-t from-bg-secondary/90 to-transparent">
            {messages.length <= 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-3 p-3 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 cursor-pointer hover:bg-accent-cyan/15 transition-colors group" onClick={() => { setInput("You both claim to ship fast. Who actually tests their code?"); }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-3 h-3 text-accent-cyan animate-pulse" />
                  <span className="text-[9px] font-bold text-accent-cyan uppercase tracking-widest">AI Icebreaker Suggestion</span>
                </div>
                <p className="text-xs text-text-primary italic leading-snug">
                  &ldquo;You both claim to ship fast. Who actually tests their code?&rdquo;
                </p>
                <div className="mt-1 text-[8px] text-text-muted uppercase font-bold tracking-widest group-hover:text-accent-cyan transition-colors">
                  Tap to use ⚡
                </div>
              </motion.div>
            )}

            {/* Quick Actions Scroll Area */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
              <button onClick={() => sendQuickAction("Let's brainstorm a crazy idea 💡")} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors">
                <Lightbulb className="w-3 h-3 text-accent-purple" /> Pitch Idea
              </button>
              <button onClick={() => sendQuickAction("Sharing my 3AM coding playlist 🎧")} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors">
                <Headphones className="w-3 h-3 text-accent-pink" /> Share Playlist
              </button>
              <button onClick={() => sendQuickAction("Starting a late night session ☕")} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors">
                <Coffee className="w-3 h-3 text-amber-500" /> Late Night Session
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="relative z-10 p-3 bg-bg-secondary/80 backdrop-blur-md border-t border-glass-border/50">
            <div className="flex items-end gap-2 bg-black/40 rounded-xl border border-glass-border p-1 focus-within:border-accent-purple/50 focus-within:bg-black/60 focus-within:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholders[placeholderIdx]}
                className="flex-1 bg-transparent outline-none border-none focus:ring-0 text-sm p-2 resize-none max-h-32 min-h-[40px] text-text-primary placeholder-text-muted placeholder:transition-opacity transition-all"
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2.5 bg-accent-purple rounded-lg text-white disabled:opacity-50 hover:bg-accent-purple/90 transition-colors cursor-target shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
