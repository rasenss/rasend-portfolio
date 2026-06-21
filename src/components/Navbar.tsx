import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Menu, X, User, LayoutGrid, Award, Briefcase, FileText, Send, Volume2, VolumeX } from 'lucide-react';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  triggerHaptic: (style?: 'light' | 'medium' | 'heavy' | 'success' | 'error') => void;
  isPlaying: boolean;
  onToggleMusic: () => void;
}

export default function Navbar({ isDark, onToggleTheme, triggerHaptic, isPlaying, onToggleMusic }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [entryComplete, setEntryComplete] = useState(false);

  const isNavigating = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Dynamic tracking of scroll positioning with IntersectionObserver and passive scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Force 'connect' (Contact) section to highlight when reached the extreme bottom of the page
      if (!isNavigating.current) {
        const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
        if (isAtBottom) {
          setActiveSection('connect');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // IntersectionObserver for active section highlighting
    const sections = ['hero', 'about', 'skills', 'certifications', 'resume', 'portfolio', 'connect'];
    const observerOptions = {
      root: null,
      rootMargin: '-35% 0px -55% 0px', // Focuses active section on the current visual viewing sweet spot
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isNavigating.current) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  const menuItems = [
    { label: 'About', href: '#about', icon: User, key: 'about' },
    { label: 'Skills', href: '#skills', icon: LayoutGrid, key: 'skills' },
    { label: 'Certifications', href: '#certifications', icon: Award, key: 'certifications' },
    { label: 'Resume', href: '#resume', icon: FileText, key: 'resume' },
    { label: 'Portfolio', href: '#portfolio', icon: Briefcase, key: 'portfolio' },
    { label: 'Contact', href: '#connect', icon: Send, key: 'connect' },
  ];

  const handleLinkClick = (href: string) => {
    triggerHaptic('light');
    setIsOpen(false);
    
    const targetKey = href.replace('#', '');
    setActiveSection(targetKey);
    
    // Temporarily disable the scroll observer callbacks to avoid multi-section bubble jumping
    isNavigating.current = true;
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Resume observer tracking after the smooth-scroll completes
    scrollTimeout.current = setTimeout(() => {
      isNavigating.current = false;
    }, 850);
  };

  return (
    <>
      {/* Top sticky navbar navigation container */}
      <motion.header
        id="navbar-header"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onAnimationComplete={() => setEntryComplete(true)}
        style={entryComplete ? { transform: 'none' } : undefined}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-[padding] duration-300 ${
          scrolled 
            ? 'py-3' 
            : 'py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className={`flex items-center justify-between rounded-full px-6 py-3 transition-[padding,background-color,border-color,box-shadow] duration-500 ${
            scrolled
              ? isDark 
                ? 'glass-panel-dark shadow-2xl' 
                : 'glass-panel-light shadow-xl'
              : 'bg-transparent border border-transparent'
          }`}>
            
            {/* Logo Signature */}
            <a 
              href="#hero" 
              onClick={(e) => { e.preventDefault(); handleLinkClick('#hero'); }}
              className="text-xl font-bold font-display tracking-tight flex items-center gap-1 group"
              id="navbar-logo"
            >
              <span className={`h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse`}></span>
              <span className={isDark ? 'text-white group-hover:text-blue-400 transition-colors' : 'text-gray-900 group-hover:text-blue-600 transition-colors'}>
                Rasendriya
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1" id="navbar-desktop-menu">
              {menuItems.map((item) => {
                const isActive = activeSection === item.key;
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); handleLinkClick(item.href); }}
                    className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive 
                        ? isDark ? 'text-white' : 'text-gray-900 font-semibold'
                        : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="navBubble"
                        className={`absolute inset-0 rounded-full z-[-1] ${
                          isDark ? 'bg-white/10 border border-white/5' : 'bg-gray-200 border border-gray-300/20'
                        }`}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    {item.label}
                  </a>
                );
              })}
            </nav>

            {/* Right side widgets: Theme toggle, Music play, and mobile menu trigger */}
            <div className="flex items-center gap-3">
              {/* Music Ambient Backsound Toggle Switch */}
              <button
                id="music-toggle-btn"
                onClick={onToggleMusic}
                className={`relative h-10 w-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                  isDark 
                    ? 'bg-white/10 hover:bg-white/15 text-blue-400 border border-white/5' 
                    : 'bg-black/5 hover:bg-black/10 text-blue-600 border border-black/5'
                }`}
                title={isPlaying ? "Mute backsound music" : "Enable backsound music"}
              >
                <motion.div
                  initial={false}
                  animate={{ scale: isPlaying ? [1, 1.12, 1] : 1 }}
                  transition={isPlaying ? { repeat: Infinity, duration: 1.8, ease: "easeInOut" } : undefined}
                  whileTap={{ scale: 0.85 }}
                >
                  {isPlaying ? (
                    <div className="relative">
                      <Volume2 size={18} />
                      {/* Micro pulsating beacon indicator denoting active soundtrack playing */}
                      <span className="absolute -top-1 -right-1.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </span>
                    </div>
                  ) : (
                    <VolumeX size={18} className={isDark ? "text-gray-500" : "text-gray-400"} />
                  )}
                </motion.div>
              </button>

              {/* Theme Toggle Switch */}
              <button
                id="theme-toggle-btn"
                onClick={() => { triggerHaptic('heavy'); onToggleTheme(); }}
                className={`relative h-10 w-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                  isDark 
                    ? 'bg-white/10 hover:bg-white/15 text-blue-400 border border-white/5' 
                    : 'bg-black/5 hover:bg-black/10 text-blue-600 border border-black/5'
                }`}
                title="Toggle visual mode"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isDark ? 180 : 0, scale: 1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </motion.div>
              </button>

              {/* Mobile menu button */}
              <button
                id="mobile-menu-trigger"
                onClick={() => { triggerHaptic('medium'); setIsOpen(!isOpen); }}
                className={`md:hidden p-2 rounded-full border transition-all duration-300 ${
                  isDark 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' 
                    : 'bg-black/5 border-black/5 hover:bg-black/10 text-gray-900'
                }`}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>
      </motion.header>

      {/* Mobile Glass Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`fixed top-[74px] left-4 right-4 z-40 p-5 rounded-3xl md:hidden max-h-[80vh] overflow-y-auto ${
              isDark 
                ? 'bg-gray-950/95 border border-white/10 shadow-2xl backdrop-blur-lg text-white' 
                : 'bg-white/95 border border-gray-200 shadow-2xl backdrop-blur-lg text-gray-900'
            }`}
          >
            <div className="flex flex-col gap-2">
              <span className={`text-xs uppercase tracking-wider font-mono px-3 mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Navigation Menu
              </span>
              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                const isActive = activeSection === item.key;
                return (
                  <motion.a
                    key={item.key}
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); handleLinkClick(item.href); }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-medium transition-all duration-200 ${
                      isActive
                        ? isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-500/5 text-blue-600 border border-blue-500/10'
                        : isDark ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-black/5 text-gray-700'
                    }`}
                  >
                    <Icon size={18} className={isActive ? (isDark ? 'text-blue-400' : 'text-blue-600') : (isDark ? 'text-gray-400' : 'text-gray-500')} />
                    <span>{item.label}</span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
