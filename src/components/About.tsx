import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { User, Quote, Sparkles } from 'lucide-react';
import { personalInfo } from '../data';
import { WindowControls } from './WindowControls';

interface AboutProps {
  isDark: boolean;
  triggerHaptic: () => void;
}

export default function About({ isDark, triggerHaptic }: AboutProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const imageSources = [
    "/me.jpg",
    "/profile_avatar.jpg",
    "/me.png",
    "/profile_avatar.png"
  ];

  const handleImageError = () => {
    if (imageIndex < imageSources.length - 1) {
      setImageIndex(prev => prev + 1);
    } else {
      setImageError(true);
    }
  };

  // 3D Parallax Mouse Tracking on Portrait Card
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), { stiffness: 100, damping: 20 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const card = event.currentTarget.getBoundingClientRect();
    const width = card.width;
    const height = card.height;
    const mouseX = event.clientX - card.left - width / 2;
    const mouseY = event.clientY - card.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  }

  if (isClosed) {
    return (
      <section id="about" className="py-24 relative overflow-hidden px-4 md:px-0">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[300px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-3xl border p-8 flex flex-col items-center justify-center text-center gap-5 transition-all duration-300 w-full max-w-md ${
              isDark 
                ? 'bg-[#1c1c1e] border-[#2c2c2e] text-white shadow-xl' 
                : 'bg-[#fafafa] border-gray-200 text-gray-900 shadow-md'
            }`}
          >
            <div className="flex gap-1.5 items-center justify-center">
              <span className="h-3.5 w-3.5 rounded-full bg-[#ff5f56]" />
              <span className="h-3.5 w-3.5 rounded-full bg-gray-300" />
              <span className="h-3.5 w-3.5 rounded-full bg-gray-300" />
            </div>
            <p className="text-sm">About window is closed.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { triggerHaptic(); setIsClosed(false); setIsMinimized(false); }}
              className={`px-5 py-2.5 rounded-full border text-xs tracking-wider uppercase font-semibold transition-all duration-300 ${
                isDark 
                  ? 'bg-[#2c2c2e] border-white/10 text-white hover:bg-zinc-700' 
                  : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
              }`}
            >
              Launch About Column
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-24 relative overflow-hidden px-4 md:px-0">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Title */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-blue-500 font-mono text-sm font-semibold tracking-wider uppercase mb-3"
          >
            <User size={16} />
            <span>Discover Me</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight ${
              isDark ? 'text-white' : 'text-gray-950'
            }`}
          >
            About Me<span className="text-blue-500 font-extrabold gap-0">.</span>
          </motion.h2>
        </div>

        {/* Outer Section Card wrapped inside a macOS style window console */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className={`rounded-3xl overflow-hidden shadow-2xl transition-all duration-350 ${
            isDark 
              ? 'glass-panel-dark shadow-black/80' 
              : 'glass-panel-light shadow-zinc-200/50'
          }`}
        >
          {/* Window Upper Navigation TitleBar */}
          <div className={`flex items-center justify-between gap-2 px-4 sm:px-6 py-4 border-b select-none transition-all duration-350 ${
            isDark ? 'bg-[#18181b]/40 border-white/5' : 'bg-[#ffffff]/40 border-black/5'
          }`}>
            {/* Window Dots */}
            <WindowControls 
              onClose={() => { triggerHaptic(); setIsClosed(true); }}
              onMinimize={() => { triggerHaptic(); setIsMinimized(!isMinimized); }}
              onMaximize={() => { triggerHaptic(); setIsMinimized(false); }}
            />

            {/* Current File Path Address */}
            <div className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-xl font-mono text-[9px] sm:text-xs tracking-wider border max-w-[130px] min-[375px]:max-w-[180px] sm:max-w-md truncate ${
              isDark 
                ? 'bg-zinc-900/60 border-white/5 text-gray-400' 
                : 'bg-white border-gray-150 text-gray-600'
            }`}>
              /about
            </div>

            {/* Secure Token representation */}
            <span className="text-[10px] font-mono tracking-widest text-blue-500/60 font-bold hidden sm:inline" />
          </div>

          <motion.div
            animate={{ height: isMinimized ? '0px' : 'auto', opacity: isMinimized ? 0 : 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="p-6 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            
            {/* Interactive Portrait column */}
            <div className="md:col-span-4 flex flex-col items-center justify-center">
              <motion.div
                onMouseMove={handleMouseMove}
                onMouseEnter={() => { triggerHaptic(); setIsHovered(true); }}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                className="relative h-64 w-64 rounded-full p-1 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {/* Glowing Outer Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#dfc38a] via-[#cba358] to-[#ad8438] opacity-80 blur-md animate-pulse-slow" />
                
                {/* Inner Canvas */}
                <div className={`absolute inset-1 rounded-full overflow-hidden border-2 p-1.5 ${
                  isDark ? 'bg-gray-950 border-white/20' : 'bg-white border-black/10'
                }`}>
                  {/* Avatar Frame holding representation */}
                  <div className="relative h-full w-full rounded-full overflow-hidden bg-gradient-to-b from-[#cba358]/20 via-[#dfc38a]/10 to-transparent flex items-center justify-center">
                    
                    {!imageError ? (
                      <img
                        src={imageSources[imageIndex]}
                        alt="Rasendriya Khansa Jolankarfyan"
                        className="w-full h-full object-cover rounded-full"
                        onError={handleImageError}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      /* Abstract Portrait SVG Representation of developer student */
                      <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] rounded-full select-none" referrerPolicy="no-referrer">
                        <defs>
                          <linearGradient id="skinG" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ffdbb5" />
                            <stop offset="100%" stopColor="#f5af73" />
                          </linearGradient>
                          <linearGradient id="hairG" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1e293b" />
                            <stop offset="100%" stopColor="#0f172a" />
                          </linearGradient>
                          <linearGradient id="shirtG" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#cba358" />
                            <stop offset="150%" stopColor="#a37c35" />
                          </linearGradient>
                        </defs>
                        
                        {/* Grid background network */}
                        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.3" className={isDark ? 'text-white/5' : 'text-black/5'} />
                        <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.15" className={isDark ? 'text-white/5' : 'text-black/5'} />
                        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.15" className={isDark ? 'text-white/5' : 'text-black/5'} />
                        
                        {/* Shoulders / Shirt */}
                        <path d="M15,90 Q15,64 50,64 Q85,64 85,90 Z" fill="url(#shirtG)" />
                        <path d="M50,64 L50,75" stroke="#1d4ed8" strokeWidth="1" />
                        
                        {/* Neck */}
                        <rect x="44" y="52" width="12" height="15" rx="3" fill="url(#skinG)" />
                        
                        {/* Face */}
                        <circle cx="50" cy="40" r="15" fill="url(#skinG)" />
                        
                        {/* Hair */}
                        <path d="M34,38 Q50,22 66,38 Q66,28 60,25 Q50,23 40,25 Q34,28 34,38 Z" fill="url(#hairG)" />
                        <path d="M34,36 Q38,28 50,28 Q62,28 66,36 Q68,43 65,47 Q65,41 62,38 L60,38 Q58,42 50,42 Q42,42 40,38 L38,38 Q35,41 35,47 Q32,43 34,36 Z" fill="url(#hairG)" />
                        
                        {/* Glasses (representing student layout in image) */}
                        <rect x="38" y="36" width="10" height="7" rx="1.5" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
                        <rect x="52" y="36" width="10" height="7" rx="1.5" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
                        <line x1="48" y1="39" x2="52" y2="39" stroke="#e2e8f0" strokeWidth="0.8" />
                        
                        {/* Eyes behind glasses */}
                        <circle cx="43" cy="39" r="1" fill="#1e293b" />
                        <circle cx="57" cy="39" r="1" fill="#1e293b" />
                        
                        {/* Smile */}
                        <path d="M46,47 Q50,51 54,47" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeLinecap="round" />
                        
                        {/* Highlights */}
                        <circle cx="68" cy="22" r="2" fill="#60a5fa" className="animate-pulse" />
                        <circle cx="30" cy="65" r="1.5" fill="#3b82f6" className="animate-pulse-slow" />
                      </svg>
                    )}

                  </div>
                </div>

              </motion.div>
            </div>

            {/* Bio/Paragraph Column */}
            <div className="md:col-span-8 flex flex-col justify-center">
              <h3 className={`text-2xl font-bold font-display tracking-tight mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Rasendriya Khansa Jolankarfyan
              </h3>
              <p className="text-blue-500 font-medium text-sm mb-5 font-mono">
                {personalInfo.roleDescription}
              </p>
              
              <p className={`text-base leading-relaxed mb-6 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {personalInfo.bio}
              </p>

              {/* Quote Block from reference design */}
              <div className={`relative rounded-2xl p-5 border ${
                isDark 
                  ? 'bg-white/[0.02] border-white/5 text-gray-300' 
                  : 'bg-black/[0.01] border-black/5 text-gray-700'
              }`}>
                <Quote size={28} className="absolute -top-3 -left-2 text-blue-500/20" />
                <p className="font-sans italic text-sm sm:text-base pl-6 relative z-10 leading-relaxed">
                  {personalInfo.quote}
                </p>
              </div>
            </div>
          </div>
        </div>
        </motion.div>
      </motion.div>
      </div>
    </section>
  );
}
