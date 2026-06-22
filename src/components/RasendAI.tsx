import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Sparkles, Bot, User, CornerDownLeft, Minimize2, Circle, Cpu, Paperclip, Mic, Volume2, VolumeX, FileText, Info } from "lucide-react";

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
  attachments?: { name: string; mimeType: string; url: string; data: string }[];
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
      content: "Halo! I am **Rasend Assistance**, your portfolio copilot. 🌟\n\nI can guide you through Rasendriya's professional expertise, timeline experiences at OneForma, academic credentials from Siber Muhammadiyah University, Red Hat Enterprise Linux configurations, or help you contact him.\n\nNow, you can also **upload image/document files** and **speak directly elements with voice** to interact with me!\n\nWhat would you like to explore today?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  // States for File Upload & Speech integrations
  const [attachments, setAttachments] = useState<{ name: string; mimeType: string; url: string; data: string }[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showUploadInfo, setShowUploadInfo] = useState(false);

  const feedRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Setup Speech Recognition Web API (lag-free, fully responsive, zero-dependencies)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = false;
        // Supports conversational English & Indonesian inputs
        rec.lang = "en-US";

        rec.onresult = (e: any) => {
          const transcript = e.results[e.results.length - 1][0].transcript;
          setInputValue((prev) => (prev ? prev.trim() + " " + transcript.trim() : transcript.trim()));
          triggerHaptic("light");
        };

        rec.onerror = (err: any) => {
          console.warn("Speech recognition notice:", err.error);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  // Sync speech synthesis voice reload
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const handleVoicesChanged = () => {};
      window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice speech recognition is not supported as a native service in this browser. Please try Chrome or Safari!");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      triggerHaptic("medium");
    } else {
      setIsListening(true);
      try {
        recognitionRef.current.start();
        triggerHaptic("success");
      } catch (e) {
        console.warn("Failed starting speech recognition", e);
        setIsListening(false);
      }
    }
  };

  // Setup client-side Voice Synthesis audio output (SpeechSynthesis API)
  const stripMarkdownForSpeech = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1") // bold
      .replace(/\*(.*?)\*/g, "$1") // italics
      .replace(/`{1,3}[\s\S]*?`{1,3}/g, "") // code/pre formats
      .replace(/[-*]\s+/g, "") // bullet points
      .replace(/#+\s+/g, "") // headings
      .replace(/([:;_?!])/g, "$1 ") // extra pauses
      .replace(/⚠️|🌟|❌|💡/g, "") // emojis
      .trim();
  };

  const speakMessage = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop playing previous utterances
    setIsSpeaking(false);

    if (!text) return;

    const cleanedText = stripMarkdownForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanedText);

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith("en") && v.name.includes("Natural")) ||
                         voices.find(v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Apple"))) ||
                         voices.find(v => v.lang.startsWith("en")) ||
                         voices[0];

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Safe client-side file upload reading
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const loadedFiles = Array.from(e.target.files) as File[];

    if (attachments.length + loadedFiles.length > 5) {
      alert("Maximum Upload Limit: You can attach up to 5 files per message.");
      e.target.value = "";
      return;
    }

    const permittedMimeTypes = [
      "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
      "application/pdf", "text/plain", "text/markdown", "text/csv", "text/html", "text/css",
      "application/json", "application/javascript", "application/typescript", "text/javascript"
    ];

    loadedFiles.forEach((file) => {
      // 1. Max size validation
      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" is too large! Maximum allowed size is 5MB.`);
        return;
      }

      // 2. Mime type checks (permits images, standard text, PDFs, and general text/code documents)
      const isMimePermitted = permittedMimeTypes.some(type => file.type === type) || 
                              file.type.startsWith("image/") || 
                              file.type.startsWith("text/") ||
                              file.name.endsWith(".md") || 
                              file.name.endsWith(".csv") ||
                              file.name.endsWith(".json") ||
                              file.name.endsWith(".txt") ||
                              file.name.endsWith(".pdf");

      if (!isMimePermitted) {
        alert(`File "${file.name}" is not supported. Supported types: Images, PDFs, and Text (TXT, MD, CSV, JSON, CSS, JS, TS).`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setAttachments((prev) => [
          ...prev,
          {
            name: file.name,
            mimeType: file.type || "application/octet-stream",
            url: URL.createObjectURL(file),
            data: base64,
          }
        ]);
        triggerHaptic("light");
      };
      reader.readAsDataURL(file);
    });

    e.target.value = ""; // resets upload target pool
  };

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
    // Both text content and file uploaded are permitted message triggers
    if ((!textToSend.trim() && attachments.length === 0) || isLoading) return;

    triggerHaptic("medium");
    
    // Stop speaking and close speech recognition when sending
    stopSpeaking();
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    }

    const currentAttachments = [...attachments];
    setAttachments([]); // empty current files queue

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: textToSend,
      attachments: currentAttachments,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const messagesPayload = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
        attachments: msg.attachments ? msg.attachments.map(att => ({
          name: att.name,
          mimeType: att.mimeType,
          data: att.data
        })) : undefined
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

        // Automatically read aloud the AI response if speech mode is enabled
        if (speechEnabled) {
          speakMessage(data.reply);
        }
      } else {
        const errorMsg = data.error || "Unable to acquire completion right now.";
        const detailsMsg = data.details ? `\n\n**Details**: ${data.details}` : "";
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            role: "assistant",
            content: `⚠️ **Server connection note**:\n${errorMsg}${detailsMsg}\n\n*Tip: If you recently added ` + "`GEMINI_API_KEY`" + ` in Vercel, please **redeploy** your project on Vercel so the new variables take effect!*`
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

  // Safe and fast custom renderer to translate code blocks, inline code, lists, headers, and bold formatting inside model replies
  const renderMessageContent = (text: string) => {
    if (!text) return null;

    // Detect and parse code blocks wrapped in triple backticks
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const textSegment = text.substring(lastIndex, match.index);
        elements.push(...parseParagraphsAndLists(textSegment, `text-${lastIndex}`));
      }

      const language = match[1] || "code";
      const codeValue = match[2];
      elements.push(
        <div key={`code-${match.index}`} className="my-3 rounded-xl border border-black/10 dark:border-white/10 overflow-hidden shadow-sm max-w-full font-mono text-xs">
          <div className="flex items-center justify-between px-3 py-1.5 bg-black/[0.04] dark:bg-white/5 border-b border-black/10 dark:border-white/10 select-none">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">{language}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(codeValue);
                triggerHaptic("success");
              }}
              className="text-[10px] text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-mono transition-colors hover:underline cursor-pointer"
            >
              Copy
            </button>
          </div>
          <pre className="p-3 overflow-x-auto max-w-full whitespace-pre bg-black/[0.01]/70 dark:bg-zinc-950/40 text-zinc-800 dark:text-zinc-200 leading-normal scrollbar-thin">
            <code>{codeValue}</code>
          </pre>
        </div>
      );

      lastIndex = codeBlockRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      elements.push(...parseParagraphsAndLists(remainingText, `text-end-${lastIndex}`));
    }

    return elements;
  };

  const parseParagraphsAndLists = (text: string, baseKey: string): React.ReactNode[] => {
    const paragraphs = text.split("\n\n");
    return paragraphs.map((para, pIdx) => {
      const trimmedPara = para.trim();
      if (!trimmedPara) return null;

      // Look for bullet lists
      if (trimmedPara.startsWith("- ") || trimmedPara.startsWith("* ")) {
        const lines = para.split("\n");
        return (
          <ul key={`${baseKey}-${pIdx}`} className="list-disc pl-5 my-2 space-y-1.5 text-sm font-sans break-words [word-break:break-word] overflow-wrap-anywhere">
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
        <p key={`${baseKey}-${pIdx}`} className="text-sm leading-relaxed mb-2 font-sans whitespace-pre-line break-words [word-break:break-word] overflow-wrap-anywhere">
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
    const inlineCodeRegex = /`([^`]+)`/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = inlineCodeRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(...parseBoldFormats(text.substring(lastIndex, match.index)));
      }
      parts.push(
        <code key={`inline-code-${match.index}`} className="px-1.5 py-0.5 rounded-md font-mono text-xs bg-black/5 dark:bg-white/10 text-rose-600 dark:text-rose-400 break-all select-all font-semibold mx-0.5">
          {match[1]}
        </code>
      );
      lastIndex = inlineCodeRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(...parseBoldFormats(text.substring(lastIndex)));
    }

    return parts.length > 0 ? parts : text;
  };

  const parseBoldFormats = (text: string): React.ReactNode[] => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={`bold-${match.index}`} className="text-blue-600 dark:text-blue-400 font-bold font-sans">
          {match[1]}
        </strong>
      );
      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-[9999999] select-none pointer-events-none flex flex-col items-end gap-4" id="rasend-ai-root">
      <AnimatePresence mode="wait">
        {/* Launch Floating Chat Card */}
        {isOpen ? (
          <motion.div
            key="rasend-chat-card"
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
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

                <div className="flex items-center gap-1.5 relative z-25">
                  {/* Speech Toggle Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = !speechEnabled;
                      setSpeechEnabled(next);
                      triggerHaptic("medium");
                      if (next) {
                        speakMessage("Voice active. I will read replies out loud.");
                      } else {
                        stopSpeaking();
                      }
                    }}
                    title={speechEnabled ? "Mute auto-read" : "Speak replies aloud (Voice TTS)"}
                    className={`p-2 rounded-xl transition-all relative cursor-pointer ${
                      speechEnabled
                        ? "bg-blue-500/15 border border-blue-500/30 text-blue-400 hover:text-blue-300"
                        : isDark
                          ? "hover:bg-white/5 text-zinc-400 hover:text-white"
                          : "hover:bg-zinc-100/50 text-zinc-650 hover:text-zinc-950"
                    }`}
                  >
                    {speechEnabled ? (
                      <Volume2 size={16} className={isSpeaking ? "animate-bounce text-blue-400" : ""} />
                    ) : (
                      <VolumeX size={16} />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic("heavy");
                      stopSpeaking();
                      setIsOpen(false);
                    }}
                    className={`p-2 rounded-xl transition-all relative z-20 cursor-pointer ${
                      isDark 
                        ? "hover:bg-white/5 text-zinc-400 hover:text-white" 
                        : "hover:bg-zinc-100/50 text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    <Minimize2 size={16} />
                  </button>
                </div>
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
                    className={`flex gap-3 max-w-[92%] sm:max-w-[85%] group/msg relative ${
                      msg.role === "user" ? "ml-auto" : "mr-auto"
                    }`}
                  >
                    {msg.role !== "user" && (
                      <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shrink-0 self-start mt-1">
                        <Sparkles size={14} className="animate-pulse" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-4 leading-relaxed shadow-sm relative overflow-visible pb-6 break-words [word-break:break-word] overflow-wrap-anywhere ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs"
                          : isDark
                            ? "bg-white/[0.04] border border-white/5 text-zinc-100 rounded-tl-xs backdrop-blur-md"
                            : "bg-black/[0.02] border border-black/5 text-zinc-800 rounded-tl-xs backdrop-blur-md"
                      }`}
                    >
                      {/* Attached files output display */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {msg.attachments.map((file, fIdx) => (
                            <div 
                              key={fIdx} 
                              className={`rounded-xl overflow-hidden max-w-[200px] border ${
                                msg.role === "user" 
                                  ? "border-white/20 bg-white/10" 
                                  : isDark 
                                    ? "border-white/10 bg-white/5" 
                                    : "border-black/5 bg-black/5"
                              }`}
                            >
                              {file.mimeType.startsWith("image/") ? (
                                <img
                                  referrerPolicy="no-referrer"
                                  src={file.url || file.data}
                                  alt={file.name}
                                  className="w-full h-auto max-h-32 object-cover hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className={`p-2 flex items-center gap-1.5 text-xs font-mono truncate ${
                                  msg.role === "user" ? "text-white" : isDark ? "text-zinc-200" : "text-zinc-800"
                                }`}>
                                  <FileText size={12} className={msg.role === "user" ? "text-blue-200 shrink-0" : "text-blue-500 shrink-0"} />
                                  <span className="truncate max-w-[120px]" title={file.name}>{file.name}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {renderMessageContent(msg.content)}

                      {/* Manual Speak/Stop Playback Buttons for Assistant element */}
                      {msg.role === "assistant" && msg.id !== "initial" && (
                        <div className="absolute right-2.5 bottom-1 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (isSpeaking) {
                                stopSpeaking();
                              } else {
                                speakMessage(msg.content);
                              }
                            }}
                            title="Read out loud"
                            className={`p-1 rounded-lg border flex items-center gap-1 text-[10px] select-none transition-all cursor-pointer ${
                              isDark 
                                ? "bg-zinc-950 border-white/10 hover:bg-zinc-900 text-zinc-400 hover:text-white" 
                                : "bg-white border-zinc-250 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-950"
                            }`}
                          >
                            <Volume2 size={10} className={isSpeaking ? "animate-pulse text-blue-400" : ""} />
                            <span>Speak</span>
                          </button>
                        </div>
                      )}
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
              {/* Draft Attachments Preview */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 px-1 animate-fade-in relative z-20">
                  {attachments.map((file, fIdx) => (
                    <div 
                      key={fIdx} 
                      className={`relative flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-xl border text-xs font-sans ${
                        isDark 
                          ? "bg-white/5 border-white/10 text-white" 
                          : "bg-zinc-100 border-black/10 text-zinc-800"
                      }`}
                    >
                      {file.mimeType.startsWith("image/") ? (
                        <div className="h-6 w-6 rounded overflow-hidden shrink-0">
                          <img referrerPolicy="no-referrer" src={file.url} alt={file.name} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <FileText size={12} className="text-blue-550 shrink-0" />
                      )}
                      
                      <span className="truncate max-w-[100px] font-mono text-[11px]">{file.name}</span>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setAttachments((prev) => prev.filter((_, idx) => idx !== fIdx));
                          triggerHaptic("light");
                        }}
                        className={`p-0.5 rounded-md transition-all cursor-pointer ${
                          isDark ? "hover:bg-white/10 text-zinc-400 hover:text-white" : "hover:bg-zinc-200 text-zinc-650 hover:text-zinc-950"
                        }`}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="relative flex items-center gap-2">
                {/* File Upload Hidden Input Element */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                />

                {/* Left Inner Action Controls (Glass buttons) */}
                <div className="absolute left-2 flex items-center gap-1 z-10">
                  {/* Paperclip upload button */}
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic("light");
                      fileInputRef.current?.click();
                    }}
                    disabled={isLoading}
                    title="Attach image or document (max 5MB)"
                    className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                      isDark 
                        ? "hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-40" 
                        : "hover:bg-zinc-200/70 text-zinc-500 hover:text-zinc-950 disabled:opacity-40"
                    }`}
                  >
                    <Paperclip size={16} />
                  </button>

                  {/* Microphone speech input button */}
                  <button
                    type="button"
                    onClick={toggleListening}
                    disabled={isLoading}
                    title={isListening ? "Stop listening voice input" : "Speak to AI"}
                    className={`p-1.5 rounded-xl transition-all cursor-pointer relative ${
                      isListening
                        ? "bg-rose-500 text-white animate-pulse"
                        : isDark
                          ? "hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-40"
                          : "hover:bg-zinc-200/70 text-zinc-500 hover:text-zinc-955 disabled:opacity-40"
                    }`}
                  >
                    <Mic size={16} />
                    {isListening && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-450 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                      </span>
                    )}
                  </button>
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  placeholder={isListening ? "Dictating your speech..." : "Ask Rasend Assistance..."}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className={`w-full rounded-2xl pr-12 pl-20 py-3.5 text-base md:text-sm transition-all focus:outline-none focus:ring-1 ${
                    isDark 
                      ? "bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:ring-blue-500/10 placeholder-zinc-500" 
                      : "bg-zinc-100/80 border border-black/10 text-zinc-900 focus:border-blue-500 focus:ring-blue-500/5 placeholder-zinc-400"
                  }`}
                />
                
                {/* Send Button */}
                <button
                  type="button"
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={(attachments.length === 0 && !inputValue.trim()) || isLoading}
                  className={`absolute right-2.5 p-2 rounded-xl transition-all ${
                    (inputValue.trim() || attachments.length > 0) && !isLoading
                      ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md shadow-blue-500/10 cursor-pointer"
                      : isDark
                        ? "text-zinc-650 cursor-not-allowed"
                        : "text-zinc-400 cursor-not-allowed"
                  }`}
                >
                  <Send size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2.5 px-1 relative">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] flex items-center gap-1 font-mono ${
                    isDark ? "text-zinc-500" : "text-zinc-400"
                  }`}>
                    <Sparkles size={10} className="text-blue-500" />
                    Powered by Gemini 3.5
                  </span>

                  <span className="text-[10px] text-zinc-500/50 select-none">•</span>

                  {/* Upload Info Indicator */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUploadInfo(!showUploadInfo);
                        triggerHaptic("light");
                      }}
                      title="View file upload rules & limits"
                      className={`text-[10px] flex items-center gap-1 font-mono hover:underline cursor-pointer transition-all ${
                        isDark ? "text-zinc-550 hover:text-zinc-300" : "text-zinc-450 hover:text-zinc-700"
                      }`}
                    >
                      <Info size={10} className="text-indigo-450 dark:text-indigo-400" />
                      <span>Upload Limits</span>
                    </button>

                    <AnimatePresence>
                      {showUploadInfo && (
                        <>
                          <div 
                            className="fixed inset-0 z-[35]" 
                            onClick={() => setShowUploadInfo(false)} 
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            style={{ bottom: "calc(100% + 8px)" }}
                            className={`absolute left-0 z-40 w-64 p-3.5 rounded-2xl border shadow-xl flex flex-col gap-2 backdrop-blur-xl ${
                              isDark 
                                ? "bg-zinc-950/95 border-white/10 text-zinc-300 shadow-black/80" 
                                : "bg-white/95 border-zinc-200/85 text-zinc-700 shadow-zinc-200/70"
                            }`}
                          >
                            <div className="flex items-center justify-between pb-1 border-b border-zinc-800/10 dark:border-white/5">
                              <span className="text-xs font-bold text-blue-500 font-sans">Attachment Policy</span>
                              <button
                                type="button"
                                onClick={() => setShowUploadInfo(false)}
                                className="text-zinc-500 hover:text-zinc-350 cursor-pointer p-0.5"
                              >
                                <X size={10} />
                              </button>
                            </div>
                            <div className="text-[11px] font-sans space-y-1.5 leading-normal text-left">
                              <p>
                                • <strong className={isDark ? "text-white" : "text-zinc-950"}>Max quantity:</strong> Up to <span className="text-indigo-500 font-bold font-mono">5 files</span> per prompt.
                              </p>
                              <p>
                                • <strong className={isDark ? "text-white" : "text-zinc-950"}>Size limit:</strong> Max <span className="text-indigo-500 font-bold font-mono">5 MB</span> per file.
                              </p>
                              <p>
                                • <strong className={isDark ? "text-white" : "text-zinc-950"}>Permitted formats:</strong>
                                <span className={`block mt-1 p-1.5 rounded-lg text-[9.5px] font-mono leading-relaxed break-all ${
                                  isDark ? "bg-white/5 text-zinc-450" : "bg-black/[0.03] text-zinc-650"
                                }`}>
                                  Images (jpg, png, webp, gif, svg), PDFs, TXT, MD, CSV, JSON, CSS, JS, TS
                                </span>
                              </p>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <span className={`text-[10px] flex items-center gap-1 font-mono uppercase tracking-wider ${
                  isDark ? "text-zinc-600" : "text-zinc-400"
                }`}>
                  <span>Enter</span>
                  <CornerDownLeft size={8} />
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="rasend-ai-launcher"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
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
