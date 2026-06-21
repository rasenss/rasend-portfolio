import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Sparkles, Bot, User, CornerDownLeft, Minimize2, Circle, Cpu } from "lucide-react";

export function ConciergeBotIcon({ className = "w-6 h-6", size }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Headband / Outer shell & Mic Headset Boom - matching request */}
      <path
        d="M 15 48 A 34 34 0 1 1 50 82 L 41 82"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Mic Tip (small vertical bar) */}
      <path
        d="M 41 82 L 41 74"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Left Ear Cushion */}
      <rect x="9" y="40" width="8" height="15" rx="3.5" fill="currentColor" />

      {/* Right Ear Cushion */}
      <rect x="83" y="40" width="8" height="15" rx="3.5" fill="currentColor" />

      {/* Central Robot Antenna */}
      <path d="M 50 34 L 50 25" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <circle cx="50" cy="21" r="5" fill="currentColor" />

      {/* Head Box Frame */}
      <rect x="25" y="34" width="50" height="38" rx="14" stroke="currentColor" strokeWidth="7" fill="none" />

      {/* Two pill-shaped eyes */}
      <rect x="37" y="44" width="6" height="11" rx="3" fill="currentColor" />
      <rect x="57" y="44" width="6" height="11" rx="3" fill="currentColor" />

      {/* Solid smiling mouth */}
      <path d="M 39 60 L 61 60 Q 50 65 39 60 Z" fill="currentColor" />
    </svg>
  );
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface RasendAIProps {
  isDark: boolean;
  triggerHaptic: (style?: "light" | "medium" | "heavy" | "success" | "error") => void;
}

export default function RasendAI({ isDark, triggerHaptic }: RasendAIProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content: "Halo! I am **Rasend Assistance**, your premium portfolio copilot. 🌟\n\nI can guide you through Rasendriya's professional expertise, timeline experiences at OneForma, academic credentials from Siber Muhammadiyah University, Red Hat Enterprise Linux configurations, or help you contact him.\n\nWhat would you like to explore today?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  const feedRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to latest reply
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTo({
        top: feedRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 250);
      setUnreadCount(0);
    }
  }, [isOpen]);

  // Handle screen resize or layout orientation changes
  useEffect(() => {
    const handleLayoutShift = () => {
      if (isOpen && feedRef.current) {
        // Maintain scrolled down focus during viewport shifts
        setTimeout(() => {
          if (feedRef.current) {
            feedRef.current.scrollTop = feedRef.current.scrollHeight;
          }
        }, 80);
      }
    };
    window.addEventListener("resize", handleLayoutShift);
    window.addEventListener("orientationchange", handleLayoutShift);
    return () => {
      window.removeEventListener("resize", handleLayoutShift);
      window.removeEventListener("orientationchange", handleLayoutShift);
    };
  }, [isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    triggerHaptic("medium");
    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const messagesPayload = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesPayload }),
      });

      let data: any = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { error: text.slice(0, 150) || `HTTP error ${res.status} returned by server.` };
      }

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            role: "assistant",
            content: data.reply,
          },
        ]);
        triggerHaptic("success");
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            role: "assistant",
            content: `⚠️ **Server connection note**:\n${data.error || "Unable to acquire completion right now. Make sure the GEMINI_API_KEY is properly set in Settings."}`
          },
        ]);
        triggerHaptic("error");
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          role: "assistant",
          content: "❌ Sorry, I encountered a communication problem. Please ensure your GEMINI_API_KEY is saved in the AI Studio Settings panel and your server is operational."
        },
      ]);
      triggerHaptic("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage(inputValue);
    }
  };

  // Safe and fast HTML-free custom renderer to translate bullet lists and bold formatting inside model replies
  const renderMessageContent = (text: string) => {
    const paragraphs = text.split("\n\n");
    return paragraphs.map((para, pIdx) => {
      // Look for bullet lists
      if (para.startsWith("- ") || para.startsWith("* ")) {
        const lines = para.split("\n");
        return (
          <ul key={pIdx} className="list-disc pl-5 my-2 space-y-1 text-sm font-sans">
            {lines.map((ln, lIdx) => {
              const cleaned = ln.replace(/^[-*]\s+/, "");
              return <li key={lIdx}>{renderInlineFormats(cleaned)}</li>;
            })}
          </ul>
        );
      }

      // Standard paragraphs
      const lines = para.split("\n");
      return (
        <p key={pIdx} className="text-sm leading-relaxed mb-2 font-sans whitespace-pre-line">
          {lines.map((line, lIdx) => (
            <span key={lIdx}>
              {renderInlineFormats(line)}
              {lIdx < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      );
    });
  };

  const renderInlineFormats = (text: string) => {
    // Basic bold markdown parser (**bold**)
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={match.index} className="text-blue-400 font-bold font-sans">
          {match[1]}
        </strong>
      );
      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-[9999999] select-none pointer-events-none flex flex-col items-end gap-4" id="rasend-ai-root">
      <AnimatePresence>
        {/* Launch Floating Chat Card */}
        {isOpen && (
          <motion.div
            key="rasend-chat-card"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className={`w-[calc(100vw-32px)] sm:w-[420px] max-w-full h-[540px] max-h-[75vh] sm:max-h-[82vh] rounded-[24px] sm:rounded-[32px] overflow-hidden border flex flex-col shadow-2xl backdrop-blur-lg relative pointer-events-auto ${
              isDark 
                ? "bg-zinc-950/20 border-white/10 text-white shadow-black/60" 
                : "bg-white/40 border-white/40 text-zinc-900 shadow-zinc-400/20"
            }`}
          >
            {/* Absolute Liquid Glass Animated Backlight Globs */}
            <div className={`absolute -top-10 -left-10 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none ${
              isDark ? "bg-blue-500" : "bg-blue-400"
            } animate-pulse [animation-duration:6s]`}></div>
            <div className={`absolute -bottom-10 -right-10 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none ${
              isDark ? "bg-indigo-500" : "bg-indigo-300"
            } animate-pulse [animation-duration:8s]`}></div>

            {/* Glossy Refraction Sheen Overlay (Visual Glass Reflection Accent) */}
            <div className="absolute inset-x-0 top-0 h-[150px] bg-gradient-to-b from-white/15 to-transparent pointer-events-none z-0"></div>

            {/* Ambient visual guide inside bot header */}
            <div className={`p-5 border-b relative shrink-0 overflow-hidden z-10 ${
              isDark 
                ? "border-white/5 bg-gradient-to-r from-blue-900/30 via-indigo-950/10 to-transparent" 
                : "border-white/30 bg-gradient-to-r from-blue-100/40 via-indigo-50/20 to-transparent"
            }`}>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  {/* Glowing Liquid Sphere Container */}
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <ConciergeBotIcon className="w-5.5 h-5.5 text-white relative z-10" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold tracking-tight font-sans text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                        Rasend Assistance
                      </h4>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </div>
                    <p className={`text-[10px] font-mono uppercase tracking-widest ${
                      isDark ? "text-zinc-400" : "text-zinc-500"
                    }`}>Digital Concierge Agent</p>
                  </div>
                </div>

                {/* Close triggers */}
                <button
                  onClick={() => {
                    triggerHaptic("heavy");
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-xl transition-all relative z-20 ${
                    isDark 
                      ? "hover:bg-white/5 text-zinc-400 hover:text-white" 
                      : "hover:bg-zinc-100/50 text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  <Minimize2 size={16} />
                </button>
              </div>
            </div>

            {/* Conversation Core */}
            <div
              ref={feedRef}
              className={`flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin relative z-10 ${
                isDark ? "scrollbar-track-transparent scrollbar-thumb-white/10" : "scrollbar-track-transparent scrollbar-thumb-zinc-300"
              }`}
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-3 max-w-[85%] ${
                      msg.role === "user" ? "ml-auto" : "mr-auto"
                    }`}
                  >
                    {msg.role !== "user" && (
                      <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shrink-0 self-start mt-1">
                        <Sparkles size={14} className="animate-pulse" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 leading-relaxed shadow-sm ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs"
                          : isDark
                            ? "bg-white/[0.04] border border-white/5 text-zinc-100 rounded-tl-xs backdrop-blur-md"
                            : "bg-black/[0.02] border border-black/5 text-zinc-800 rounded-tl-xs backdrop-blur-md"
                      }`}
                    >
                      {renderMessageContent(msg.content)}
                    </div>
                  </motion.div>
                ))}

                {/* Loading feedback loader */}
                {isLoading && (
                  <motion.div
                    key="chat-loading-spinner"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-3 max-w-[80%]"
                  >
                    <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shrink-0">
                      <Sparkles size={14} className="animate-spin" />
                    </div>
                    <div className={`rounded-2xl px-4 py-3 border flex items-center gap-2 ${
                      isDark 
                        ? "bg-white/[0.04] border-white/5 text-zinc-400" 
                        : "bg-black/[0.02] border-black/5 text-zinc-500"
                    }`}>
                      <Circle size={8} className="fill-blue-500 text-blue-500 animate-bounce [animation-delay:-0.3s]" />
                      <Circle size={8} className="fill-indigo-500 text-indigo-500 animate-bounce [animation-delay:-0.15s]" />
                      <Circle size={8} className="fill-purple-500 text-purple-500 animate-bounce" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Keyboard Inputs */}
            <div className={`p-4 border-t shrink-0 relative z-10 ${
              isDark ? "border-white/5 bg-zinc-950/30" : "border-black/5 bg-white/30"
            }`}>
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask Rasend Assistance..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className={`w-full rounded-2xl pr-12 pl-4 py-3.5 text-sm transition-all focus:outline-none focus:ring-1 ${
                    isDark 
                      ? "bg-white/5 border-white/10 text-white focus:border-blue-500 focus:ring-blue-500/10 placeholder-zinc-500" 
                      : "bg-zinc-100/80 border-black/10 text-zinc-900 focus:border-blue-500 focus:ring-blue-500/5 placeholder-zinc-400"
                  }`}
                />
                
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  className={`absolute right-2.5 p-2 rounded-xl transition-all ${
                    inputValue.trim() && !isLoading
                      ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md shadow-blue-500/10 cursor-pointer"
                      : isDark
                        ? "text-zinc-600 cursor-not-allowed"
                        : "text-zinc-400 cursor-not-allowed"
                  }`}
                >
                  <Send size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2.5 px-1">
                <span className={`text-[10px] flex items-center gap-1 font-mono ${
                  isDark ? "text-zinc-500" : "text-zinc-400"
                }`}>
                  <Sparkles size={10} className="text-blue-500" />
                  Powered by Gemini 3.5
                </span>
                
                <span className={`text-[10px] flex items-center gap-1 font-mono uppercase tracking-wider ${
                  isDark ? "text-zinc-600" : "text-zinc-400"
                }`}>
                  <span>Enter</span>
                  <CornerDownLeft size={8} />
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating launcher action bar bubble in liquid glass */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="rasend-ai-launcher"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            onClick={() => {
              triggerHaptic("heavy");
              setIsOpen(true);
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className={`h-14 w-14 rounded-full flex items-center justify-center cursor-pointer relative group border transition-all duration-300 shadow-xl pointer-events-auto ${
              isDark 
                ? "bg-zinc-950/40 border-white/10 text-white shadow-blue-900/10 hover:border-white/20" 
                : "bg-white/50 border-white/60 text-indigo-900 shadow-indigo-150/10 hover:border-white/80"
            } backdrop-blur-md`}
          >
            {/* Soft background pulse halo */}
            <div className="absolute inset-0 bg-blue-500/25 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <ConciergeBotIcon className="w-7 h-7 relative z-10 text-blue-500 transition-transform group-hover:scale-110 duration-300" />
            <Sparkles size={12} className="absolute top-2 right-2 text-indigo-400 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />

            {/* Unread badge notification alert indicator */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md ring-2 ring-white select-none scale-100 animate-bounce">
                {unreadCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}
