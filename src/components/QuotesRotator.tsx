import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { romanQuotes } from '../data';

interface QuotesRotatorProps {
  isDark: boolean;
  triggerHaptic: () => void;
  variant?: 'hero' | 'footer';
}

export default function QuotesRotator({ isDark, triggerHaptic, variant = 'footer' }: QuotesRotatorProps) {
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % romanQuotes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleNextQuote = () => {
    triggerHaptic();
    setQuoteIdx((prev) => (prev + 1) % romanQuotes.length);
  };

  const current = romanQuotes[quoteIdx];
  const quoteLetters = Array.from(`“${current.quote}”`);
  const translationWords = current.translation.split(" ");

  // Stagger configurations
  const quoteContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1,
      },
    },
  };

  const letterVariant = {
    hidden: { 
      opacity: 0, 
      y: 12, 
      scale: 0.9,
      filter: "blur(2px)" 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 14,
        stiffness: 110,
      }
    },
  };

  const translationContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.4,
      }
    }
  };

  const wordVariant = {
    hidden: { 
      opacity: 0, 
      y: 8, 
      filter: "blur(1px)" 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const isHero = variant === 'hero';

  return (
    <div 
      onClick={handleNextQuote}
      className={`relative cursor-pointer transition-all duration-300 select-none flex flex-col justify-center items-center text-center p-4 rounded-2xl group ${
        isHero 
          ? 'max-w-xl mx-auto my-6 bg-blue-500/[0.02] border border-blue-500/5 hover:bg-blue-500/[0.04] p-5 sm:p-6' 
          : 'min-h-[140px] w-full max-w-2xl'
      }`}
      title="Click to rotate wisdom"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={quoteIdx}
          className="w-full flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Main Latin Quote */}
          <motion.div
            variants={quoteContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center items-center"
          >
            <h3 className={`font-roman italic tracking-wide font-normal leading-relaxed text-center flex flex-wrap justify-center ${
              isHero 
                ? 'text-lg sm:text-xl md:text-2xl text-blue-600 dark:text-blue-400 font-semibold' 
                : isDark 
                  ? 'text-2xl sm:text-3xl md:text-3.5xl text-[#faf9f6]' 
                  : 'text-2xl sm:text-3xl md:text-3.5xl text-gray-900 font-medium'
            }`}>
              {quoteLetters.map((char, index) => (
                <motion.span
                  key={index}
                  variants={letterVariant}
                  className="inline-block origin-bottom"
                  style={{ marginRight: char === " " ? "0.25em" : "0px" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </h3>
          </motion.div>

          {/* Translation Subtitle */}
          <motion.div
            variants={translationContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center items-center mt-3"
          >
            <p className={`font-roman tracking-[0.12em] uppercase font-semibold text-[10px] sm:text-xs flex flex-wrap justify-center ${
              isHero
                ? isDark ? 'text-zinc-500 group-hover:text-zinc-400' : 'text-zinc-400 group-hover:text-zinc-500'
                : isDark ? 'text-blue-400/70 group-hover:text-blue-400' : 'text-blue-700/70 group-hover:text-blue-700'
            }`}>
              {translationWords.map((word, wordIdx) => (
                <motion.span
                  key={wordIdx}
                  variants={wordVariant}
                  className="inline-block mr-[0.35em]"
                >
                  {word}
                </motion.span>
              ))}
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Subtle indicator of interaction */}
      <div className={`absolute bottom-1 right-2 text-[8px] font-mono opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${
        isDark ? 'text-white' : 'text-black'
      }`}>
        TAP TO SKIP
      </div>
    </div>
  );
}
