import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Linkedin, Github, Instagram, Mail, ArrowUpRight } from 'lucide-react';
import { personalInfo } from '../data';

const DiscordIcon = ({ size = 20, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    {...props}
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.1825 0-2.1569-1.085-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0951 2.1568 2.419 0 1.3331-.9554 2.4189-2.1568 2.4189zm7.975 0c-1.1825 0-2.1569-1.085-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2107 0 2.1757 1.0951 2.1568 2.419 0 1.3331-.946 2.4189-2.1568 2.4189z" />
  </svg>
);

interface HeroProps {
  isDark: boolean;
  triggerHaptic: () => void;
}

const glyphs = "X#%&@?$+=*<>[]{}";

function DecryptText({ text, startDelay = 0.3, trigger = 0 }: { text: string; startDelay?: number; trigger?: number }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let isMounted = true;
    let frameId: number;
    const targetLength = text.length;

    // When trigger is clicked, make it feel more responsive by reducing delay
    const delay = trigger > 0 ? 0 : startDelay;

    const delayTimeout = setTimeout(() => {
      let frame = 0;
      const durationFrames = 10; // Rapid cybernetic decryption style

      const tick = () => {
        if (!isMounted) return;
        frame++;
        const progress = frame / durationFrames;

        if (progress >= 1) {
          setDisplayText(text);
          return;
        }

        // Calculate current state
        const decryptedCount = Math.floor(progress * targetLength);
        const nextText = text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < decryptedCount) {
              return char;
            }
            // Add a temporary scrambled character
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join("");

        setDisplayText(nextText);
        frameId = requestAnimationFrame(tick);
      };

      frameId = requestAnimationFrame(tick);
    }, delay * 1000);

    return () => {
      isMounted = false;
      clearTimeout(delayTimeout);
      cancelAnimationFrame(frameId);
    };
  }, [text, startDelay, trigger]);

  return (
    <span className="font-mono tracking-wide selection:bg-blue-500/20 relative inline-block">
      {/* Invisible placeholder containing the exact text to reserve correct layout dimensions */}
      <span className="opacity-0 select-none pointer-events-none block" aria-hidden="true">
        {text}
      </span>
      {/* Absolute overlay container containing the scrambling or decrypted text */}
      <span className="absolute inset-x-0 top-0 text-center">
        {displayText || text.split("").map(() => glyphs[Math.floor(Math.random() * glyphs.length)]).join("")}
      </span>
    </span>
  );
}

export default function Hero({ isDark, triggerHaptic }: HeroProps) {
  const [nameTrigger, setNameTrigger] = useState(0);

  const handleNameClick = () => {
    triggerHaptic();
    setNameTrigger(prev => prev + 1);
  };

  const socialList = [
    { url: personalInfo.socials.linkedin, icon: Linkedin, color: 'hover:text-blue-500 hover:border-blue-500', name: 'LinkedIn' },
    { url: personalInfo.socials.github, icon: Github, color: 'hover:text-black dark:hover:text-white hover:border-gray-500', name: 'GitHub' },
    { url: personalInfo.socials.discord, icon: DiscordIcon, color: 'hover:text-blue-600 hover:border-blue-600', name: 'Discord' },
    { url: personalInfo.socials.instagram, icon: Instagram, color: 'hover:text-blue-500 hover:border-blue-500', name: 'Instagram' },
    { url: personalInfo.socials.email, icon: Mail, color: 'hover:text-blue-400 hover:border-blue-400', name: 'Email' }
  ];

  const handleStartProjectClick = () => {
    triggerHaptic();
    const contactSection = document.getElementById('connect');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const marqueeText = "• RASENDRIYA KHANSA JOLANKARFYAN • COMPUTER SCIENCE STUDENT • AI DATA ANNOTATOR • UI/UX DESIGNER • PORTFOLIO ";

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden"
    >
      {/* Immersive background glowing ambient bubbles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            x: [0, 25, -15, 0],
            y: [0, -35, 20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute top-1/4 left-1/4 h-80 w-80 rounded-full blur-3xl opacity-20 ${
            isDark ? 'bg-blue-900/15' : 'bg-blue-100/50'
          }`}
        />
        <motion.div 
          animate={{
            x: [0, -35, 25, 0],
            y: [0, 20, -35, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full blur-3xl opacity-15 ${
            isDark ? 'bg-blue-950/10' : 'bg-blue-50/40'
          }`}
        />
      </div>

      <div className="w-full max-w-4xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`relative rounded-[24px] sm:rounded-[40px] px-4 sm:px-12 py-12 sm:py-16 text-center ${
            isDark ? 'glass-panel-dark' : 'glass-panel-light'
          }`}
        >
          {/* Headline Name - Mechanical split-flap rolling billboard screen simulation */}
          <motion.h1
            id="hero-split-flap-title"
            onClick={handleNameClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 450, damping: 18 }}
            className={`text-2xl min-[375px]:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.2] mb-5 text-center flex flex-col items-center gap-1 sm:gap-2 cursor-pointer select-none group/name transition-colors duration-300 ${
              isDark 
                ? 'text-white hover:text-blue-400' 
                : 'text-zinc-950 hover:text-blue-600'
            }`}
            title="Click or tap to scramble / re-decrypt name"
          >
            <div className="flex flex-wrap justify-center gap-x-[0.3em] gap-y-1">
              <DecryptText text="Rasendriya" startDelay={0.02} trigger={nameTrigger} />
              <DecryptText text="Khansa" startDelay={0.08} trigger={nameTrigger} />
            </div>
            <DecryptText text="Jolankarfyan" startDelay={0.16} trigger={nameTrigger} />
            
            {/* Subtle interactive action floating label */}
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-semibold text-blue-500/0 group-hover/name:text-blue-500/60 dark:group-hover/name:text-blue-400/60 transition-all duration-300 select-none block mt-2 pointer-events-none">
              Click to Scramble
            </span>
          </motion.h1>

          {/* Subtitle / Focus Roles - Animated elegant responsive text block with layout switching */}
          <div className="mb-8 mt-6 flex justify-center min-h-8 md:h-8 items-center py-1 md:py-0">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`text-xs sm:text-base md:text-lg font-medium tracking-normal flex flex-wrap items-center justify-center gap-x-2 gap-y-1 min-[375px]:gap-x-3 ${
                isDark ? 'text-zinc-400' : 'text-zinc-650'
              }`}
            >
              <span className="font-semibold uppercase select-none whitespace-nowrap">
                Student College
              </span>
              <span className="text-blue-500 select-none font-bold">
                •
              </span>
              <span className="font-semibold uppercase select-none whitespace-nowrap">
                AI Data Annotator
              </span>
              <span className="text-blue-500 select-none font-bold">
                •
              </span>
              <span className="font-semibold uppercase select-none whitespace-nowrap">
                UI/UX Designer
              </span>
            </motion.p>
          </div>

          {/* Start a Project Action Call button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.35, ease: 'easeOut' }}
            className="flex justify-center mb-10"
          >
            <motion.button
              id="start-project-btn"
              onClick={handleStartProjectClick}
              whileHover={{ 
                scale: 1.05,
                boxShadow: isDark 
                  ? '0 10px 30px -10px rgba(255,255,255,0.15)' 
                  : '0 10px 30px -10px rgba(0,0,0,0.15)' 
              }}
              whileTap={{ scale: 0.98 }}
              className={`group flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-[background-color,color] duration-300 shadow-md cursor-pointer transform ${
                isDark 
                  ? 'bg-white text-gray-900 hover:bg-zinc-100 active:bg-zinc-200' 
                  : 'bg-zinc-900 text-white hover:bg-zinc-800 active:bg-black'
              }`}
            >
              <span>Start a Project</span>
              <ArrowUpRight size={18} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </motion.button>
          </motion.div>

          {/* Social Icons matching design */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.35 }}
            className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap"
          >
            {socialList.map((social, index) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={triggerHaptic}
                  initial={{ opacity: 0, scale: 0.85, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    delay: 0.42 + index * 0.02, 
                    duration: 0.3, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className={`h-11 w-11 flex items-center justify-center rounded-2xl border transition-[background-color,border-color,color] duration-300 ${
                    isDark 
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850 hover:border-zinc-700' 
                      : 'bg-zinc-100 border-zinc-200 text-zinc-500 hover:bg-zinc-200 hover:border-zinc-300'
                  } ${social.color}`}
                  title={social.name}
                >
                  <Icon size={18} />
                </motion.a>
              );
            })}
          </motion.div>

          {/* Solid running billboard banner (no transparency) as ticker */}
          <div className={`mt-10 overflow-hidden py-3 rounded-2xl border font-mono select-none ${
            isDark ? 'bg-[#050608] border-zinc-800 text-blue-400' : 'bg-zinc-100 border-zinc-200 text-blue-600'
          }`}>
            <div className="flex w-full overflow-hidden">
              <motion.div
                animate={{ x: [0, -1000] }}
                transition={{
                  ease: "linear",
                  duration: 25,
                  repeat: Infinity
                }}
                className="flex gap-8 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest shrink-0"
              >
                {Array(15).fill(marqueeText).map((txt, idx) => (
                  <span key={idx}>{txt}</span>
                ))}
              </motion.div>
            </div>
          </div>

        </motion.div>
      </div>

      {/* Decorative Slide Indicator for mouse scrolls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
      >
        <div className={`w-[2px] h-8 rounded-full ${isDark ? 'bg-white/20' : 'bg-gray-300'}`} />
        <span className={`text-[10px] font-mono tracking-widest uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Scroll Down
        </span>
      </motion.div>
    </section>
  );
}
