import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
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
import RasendAI from './components/RasendAI';
import Constellation3DBackground from './components/Constellation3DBackground';

export default function App() {
  // Theme state defaulting to Light Mode as requested
  const [isDark, setIsDark] = useState<boolean>(() => {
    return false; // Light mode by default!
  });

  // Ambient audio state initialized to true
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and synchronise the background audio loop
  useEffect(() => {
    const audio = new Audio('/Backsound-Portfolio-Music-Rihanna.mp3');
    audio.loop = true;
    audio.volume = 0.35; // optimal friendly cozy volume
    audioRef.current = audio;

    // Direct immediate play attempt
    const attemptPlay = () => {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          cleanupListeners();
        })
        .catch((err) => {
          console.log("Autoplay was prevented by browser security rules. Interactive handlers will activate upon screen action.", err);
        });
    };

    attemptPlay();

    // Trigger audio block bypass silent listeners on any microscopic browser movement/hover
    const startAudioOnAction = () => {
      if (audio.paused) {
        audio.play()
          .then(() => {
            setIsPlaying(true);
            cleanupListeners();
          })
          .catch((err) => {
            console.log("Interactive audio unlock failed: ", err);
          });
      } else {
        cleanupListeners();
      }
    };

    const cleanupListeners = () => {
      window.removeEventListener('click', startAudioOnAction, { capture: true });
      window.removeEventListener('mousedown', startAudioOnAction, { capture: true });
      window.removeEventListener('keydown', startAudioOnAction, { capture: true });
      window.removeEventListener('touchstart', startAudioOnAction, { capture: true });
      window.removeEventListener('pointerdown', startAudioOnAction, { capture: true });
      window.removeEventListener('mousemove', startAudioOnAction, { capture: true });
      window.removeEventListener('scroll', startAudioOnAction, { capture: true });
      window.removeEventListener('wheel', startAudioOnAction, { capture: true });
    };

    window.addEventListener('click', startAudioOnAction, { capture: true });
    window.addEventListener('mousedown', startAudioOnAction, { capture: true });
    window.addEventListener('keydown', startAudioOnAction, { capture: true });
    window.addEventListener('touchstart', startAudioOnAction, { capture: true });
    window.addEventListener('pointerdown', startAudioOnAction, { capture: true });
    window.addEventListener('mousemove', startAudioOnAction, { capture: true });
    window.addEventListener('scroll', startAudioOnAction, { capture: true });
    window.addEventListener('wheel', startAudioOnAction, { capture: true });

    return () => {
      cleanupListeners();
      audio.pause();
    };
  }, []);

  // Sync state transitions safely
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.log("Audio play blocked by browser. Toggle button will recover.", err);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Toggle visual theme class tags
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

  // Premium synthetic haptic feedback engine (vibration + synthesized audio click)
  const triggerHaptic = (style: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
    // 1. Browser physical vibration support
    if ('vibrate' in navigator) {
      try {
        if (style === 'success') {
          navigator.vibrate([15, 45, 15, 45]);
        } else if (style === 'heavy') {
          navigator.vibrate(25);
        } else if (style === 'medium') {
          navigator.vibrate(15);
        } else if (style === 'error') {
          navigator.vibrate([30, 80, 40]);
        } else {
          navigator.vibrate(8); // Subtle 'light' feedback
        }
      } catch (err) {}
    }

    // 2. Synthesize an ultra-short, premium tactile pop/click using Web Audio API
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      const now = ctx.currentTime;
      
      if (style === 'success') {
        // Double chime/success feedback
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        gainNode.gain.setValueAtTime(0.06, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (style === 'heavy') {
        // Deep click, satisfying and solid
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.08);
        gainNode.gain.setValueAtTime(0.18, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (style === 'medium') {
        // High-contrast prompt click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.06);
        gainNode.gain.setValueAtTime(0.12, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.07);
      } else if (style === 'error') {
        // Error indicator dual drop
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(75, now + 0.12);
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.13);
      } else {
        // 'light' default: ultra quiet subtle tactile bubble tap (approx 35ms)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.03);
        
        // Super tiny click volume blending perfectly
        gainNode.gain.setValueAtTime(0.06, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch (e) {
      // Quiet fail if AudioContext is blocked or unsupported
    }
  };

  const handleToggleMusic = () => {
    triggerHaptic();
    setIsPlaying(!isPlaying);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`min-h-screen relative font-sans transition-colors duration-500 overflow-x-hidden ${isDark ? 'dark bg-[#050505] text-white' : 'bg-neutral-50 text-gray-900'}`}>
      
      <Constellation3DBackground isDark={isDark} isPlaying={isPlaying} />

      {/* Immersive Atmospheric Backdrop Glowing meshes */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[140px] bg-blue-500/10 transition-opacity duration-500 ${
          isDark ? 'opacity-100' : 'opacity-30'
        }`}></div>
        <div className={`absolute bottom-0 right-0 w-[800px] h-[800px] rounded-full blur-[160px] bg-blue-500/5 transition-opacity duration-500 ${
          isDark ? 'opacity-100' : 'opacity-40'
        }`}></div>
        <div className={`absolute top-[45%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[150px] bg-blue-500/5 opacity-15`}></div>
      </div>

      {/* Structured Layout Items */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Absolute floating Header Navbar */}
        <Navbar 
          isDark={isDark} 
          onToggleTheme={toggleTheme} 
          triggerHaptic={triggerHaptic} 
          isPlaying={isPlaying} 
          onToggleMusic={handleToggleMusic} 
        />

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

        {/* Beautiful Floating Card Footer Container */}
        <div className="px-6 pb-16 pt-4 relative z-10">
          <footer className={`max-w-6xl mx-auto transition-all duration-500 rounded-3xl py-12 px-6 sm:px-12 text-center border shadow-xl backdrop-blur-md overflow-hidden relative ${
            isDark 
              ? 'bg-black/40 border-blue-500/10 shadow-blue-950/10' 
              : 'bg-white/70 border-blue-500/15 shadow-blue-100/30'
          }`}>
            {/* Ambient inner soft glowing backdrop */}
            <div className={`absolute -right-20 -bottom-20 w-[300px] h-[300px] rounded-full blur-[100px] transition-opacity duration-500 pointer-events-none ${
              isDark ? 'bg-blue-500/5 opacity-100' : 'bg-blue-500/10 opacity-60'
            }`}></div>

            <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
              
              {/* Animated Quotes Rotator inside footer */}
              <div className="mb-10 w-full flex justify-center">
                <QuotesRotator isDark={isDark} triggerHaptic={triggerHaptic} variant="footer" />
              </div>

              {/* Bottom Classical Roman Numeral Ledger Copyright */}
              <div className="flex flex-col items-center gap-3">
                <span className={`font-roman tracking-[0.18em] text-[10px] sm:text-xs uppercase ${
                  isDark ? 'text-blue-500/40' : 'text-blue-800/55'
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
        
        {/* Floating AI Agent Copilot */}
        <RasendAI isDark={isDark} triggerHaptic={triggerHaptic} />

      </div>

    </div>
  );
}

// Compact helper Separator element
function HorizontalSeparator({ isDark }: { isDark: boolean }) {
  return <div className="py-5" />;
}
