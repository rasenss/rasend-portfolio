import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Copyright, Code2 } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Resume from './components/Resume';
import Portfolio from './components/Portfolio';
import Connect from './components/Connect';
import QuotesRotator from './components/QuotesRotator';
import { personalInfo } from './data';

export default function App() {
  // Theme state defaulting to Light Mode as requested
  const [isDark, setIsDark] = useState<boolean>(() => {
    return false; // Light mode by default!
  });

  // Apply CSS class lists on theme modification
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.style.backgroundColor = '#050505'; // True Immersive Dark Background
      root.style.color = '#ffffff'; // Immersive text-white
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#fafafa'; // neutral-50
      root.style.color = '#111827'; // gray-900
    }
  }, [isDark]);

  // Haptic feedback emulator using browser APIs
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(10); // Subtle 10ms click vibration
      } catch (err) {
        // Safe lock, vibration might be blocked by environment constraints
      }
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`min-h-screen relative font-sans transition-all duration-500 overflow-x-hidden ${isDark ? 'dark bg-[#050505] text-white' : 'bg-neutral-50 text-gray-900'}`}>
      
      {/* Immersive Atmospheric Backdrop Glowing meshes */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[140px] transition-all duration-500 ${
          isDark ? 'bg-blue-600/10' : 'bg-blue-300/5'
        }`}></div>
        <div className={`absolute bottom-0 right-0 w-[800px] h-[800px] rounded-full blur-[160px] transition-all duration-500 ${
          isDark ? 'bg-blue-500/5' : 'bg-blue-300/5'
        }`}></div>
        <div className={`absolute top-[45%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[150px] opacity-15 transition-all duration-500 bg-blue-500/5`}></div>
      </div>

      {/* Structured Layout Items */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Absolute floating Header Navbar */}
        <Navbar isDark={isDark} onToggleTheme={toggleTheme} triggerHaptic={triggerHaptic} />

        {/* Content sections cascade */}
        <main className="flex-grow">
          {/* Hero segment */}
          <Hero isDark={isDark} triggerHaptic={triggerHaptic} />

          {/* About segment */}
          <About isDark={isDark} triggerHaptic={triggerHaptic} />

          {/* Separation subtle line and tag marker */}
          <HorizontalSeparator isDark={isDark} />

          {/* Skills Grid */}
          <Skills isDark={isDark} triggerHaptic={triggerHaptic} />

          <HorizontalSeparator isDark={isDark} />

          {/* Achievements Certifications ledger list */}
          <Certifications isDark={isDark} triggerHaptic={triggerHaptic} />

          <HorizontalSeparator isDark={isDark} />

          {/* Timeline Resume milestones */}
          <Resume isDark={isDark} triggerHaptic={triggerHaptic} />

          <HorizontalSeparator isDark={isDark} />

          {/* Creative layout Portfolio */}
          <Portfolio isDark={isDark} triggerHaptic={triggerHaptic} />

          <HorizontalSeparator isDark={isDark} />

          {/* Signal Connection anchors */}
          <Connect isDark={isDark} triggerHaptic={triggerHaptic} />
        </main>

        {/* Roman Empire Cinematic Animated Footer */}
        <footer className={`transition-all duration-500 border-t py-12 px-6 sm:px-12 text-center relative z-10 overflow-hidden ${
          isDark 
            ? 'bg-black border-blue-500/10' 
            : 'bg-white border-blue-500/15'
        }`}>
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            
            {/* Animated Quotes Rotator inside footer */}
            <div className="mb-10 w-full flex justify-center">
              <QuotesRotator isDark={isDark} triggerHaptic={triggerHaptic} variant="footer" />
            </div>

            {/* Bottom Classical Roman Numeral Ledger Copyright */}
            <div className="flex flex-col items-center gap-3">
              <span className={`font-roman tracking-[0.18em] text-[10px] sm:text-xs uppercase ${
                isDark ? 'text-blue-500/40' : 'text-blue-850/55'
              }`}>
                © MMXXVI · RASENDRIYA KHANSA · OMNIA OPERA
              </span>
              
              {/* Secret interactive credits toggle */}
              <div className={`flex items-center gap-4 text-[9px] font-mono transition-colors mt-3 ${
                isDark ? 'text-blue-500/20 hover:text-blue-500/40' : 'text-blue-500/40 hover:text-blue-500/60'
              }`}>
                <span>REFINED IN Pacitan</span>
                <span>•</span>
                <span>LATITUDE -8.203°</span>
              </div>
            </div>

          </div>
        </footer>

      </div>
    </div>
  );
}

// Compact helper Separator element
function HorizontalSeparator({ isDark }: { isDark: boolean }) {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-0">
      <div className={`h-[1px] w-full ${isDark ? 'bg-white/[0.05]' : 'bg-black/[0.05]'}`} />
    </div>
  );
}
