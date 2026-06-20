import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface WindowControlsProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export const WindowControls: React.FC<WindowControlsProps> = ({
  onClose,
  onMinimize,
  onMaximize,
}) => {
  const [hovered, setHovered] = useState(false);
  const [clickedColor, setClickedColor] = useState<string | null>(null);

  const handleAction = (type: 'black' | 'blue' | 'white', callback?: () => void) => {
    setClickedColor(type);
    setTimeout(() => setClickedColor(null), 800);
    if (callback) {
      callback();
    }
  };

  return (
    <div 
      className="flex gap-2 items-center relative z-10"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Close Dot (Black) */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.85 }}
        onClick={() => handleAction('black', onClose)}
        className="h-3.5 w-3.5 rounded-full bg-black border border-white/40 flex items-center justify-center relative cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
        title="Close"
      >
        <AnimatePresence>
          {hovered && (
            <motion.svg
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="w-1.5 h-1.5 text-white absolute"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M3 3 L9 9 M9 3 L3 9" />
            </motion.svg>
          )}
        </AnimatePresence>
        {clickedColor === 'black' && (
          <motion.span 
            layoutId="ripple-black"
            className="absolute inset-0 rounded-full bg-white opacity-40"
            initial={{ scale: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </motion.button>

      {/* Minimize Dot (Blue) */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.85 }}
        onClick={() => handleAction('blue', onMinimize)}
        className="h-3.5 w-3.5 rounded-full bg-[#2563eb] border border-blue-700 flex items-center justify-center relative cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-300"
        title="Minimize"
      >
        <AnimatePresence>
          {hovered && (
            <motion.svg
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="w-1.5 h-1.5 text-white absolute"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M2 6 H10" />
            </motion.svg>
          )}
        </AnimatePresence>
        {clickedColor === 'blue' && (
          <motion.span 
            layoutId="ripple-blue"
            className="absolute inset-0 rounded-full bg-blue-300 opacity-40"
            initial={{ scale: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </motion.button>

      {/* Maximize Dot (White) */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.85 }}
        onClick={() => handleAction('white', onMaximize)}
        className="h-3.5 w-3.5 rounded-full bg-white border border-black/30 flex items-center justify-center relative cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
        title="Maximize"
      >
        <AnimatePresence>
          {hovered && (
            <motion.svg
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="w-1.5 h-1.5 text-black absolute"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M3 6 H9 M6 3 V9" />
            </motion.svg>
          )}
        </AnimatePresence>
        {clickedColor === 'white' && (
          <motion.span 
            layoutId="ripple-white"
            className="absolute inset-0 rounded-full bg-blue-400 opacity-40"
            initial={{ scale: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </motion.button>
    </div>
  );
};
