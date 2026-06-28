import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, Layers, ArrowLeft, ArrowUpRight, Search, Heart, Smartphone, Monitor, Code, Palette, Printer, HeartCrack, Sparkles } from 'lucide-react';
import { projects } from '../data';
import { Project } from '../types';
import { WindowControls } from './WindowControls';
import { Tilt3D } from './Tilt3D';

interface PortfolioProps {
  isDark: boolean;
  triggerHaptic: () => void;
}

export default function Portfolio({ isDark, triggerHaptic }: PortfolioProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [likedProjects, setLikedProjects] = useState<{ [key: string]: boolean }>({});
  const [isClosed, setIsClosed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number; size: number; rotation: number; text: string }[]>([]);
  const [showAppreciateToast, setShowAppreciateToast] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open-active');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open-active');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open-active');
    };
  }, [selectedProject]);

  // Compile categories dynamically
  const categories = ['All', 'Linkedin Post Design', 'Logo', 'Mobile-Design', 'Poster-Design', 'Simple-Design'];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic();
    const isNowLiked = !likedProjects[id];
    setLikedProjects(prev => ({ ...prev, [id]: isNowLiked }));

    if (isNowLiked) {
      // Get click position (fallback to absolute coordinates or center screen if not clicked with exact coordinates)
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = rect.left + rect.width / 2;
      const clickY = rect.top;

      // Collection of warm appreciative emojis and icons
      const items = ['❤️', '💖', '✨', '💝', '💙', '💕', '🫶', '🔥', '🌟', '🕊️'];
      const newHearts = Array.from({ length: 14 }).map((_, i) => ({
        id: Date.now() + i + Math.random(),
        x: clickX,
        y: clickY,
        size: Math.random() * 16 + 14, // 14px to 30px
        rotation: (Math.random() - 0.5) * 80,
        text: items[Math.floor(Math.random() * items.length)]
      }));

      setFloatingHearts(prev => [...prev, ...newHearts]);
      setShowAppreciateToast(true);

      // Dismiss appreciate toast after 3 seconds
      const toastTimer = setTimeout(() => {
        setShowAppreciateToast(false);
      }, 3000);

      // Clean up single particles after animation completes
      const cleanTimer = setTimeout(() => {
        setFloatingHearts(prev => prev.filter(h => !newHearts.some(nh => nh.id === h.id)));
      }, 2500);
    }
  };

  const handleOpenProject = (project: Project) => {
    triggerHaptic();
    setSelectedProject(project);
  };

  const handleCloseProject = () => {
    triggerHaptic();
    setSelectedProject(null);
  };

  if (isClosed) {
    return (
      <section id="portfolio" className="py-24 relative overflow-hidden px-4 md:px-0">
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
            <p className="text-sm">Workspace window is closed.</p>
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
              Launch Workspace Window
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden px-4 md:px-0">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 text-blue-500 font-mono text-sm font-semibold tracking-wider uppercase mb-3"
          >
            <Layers size={16} />
            <span>Featured Projects</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.35, delay: 0.05, ease: 'easeOut' }}
            className={`text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight ${
              isDark ? 'text-white' : 'text-gray-950'
            }`}
          >
            My Portfolio<span className="text-blue-500 font-extrabold gap-0">.</span>
          </motion.h2>
          <span className={`text-sm mt-1.5 block font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Visual Layout Designs
          </span>
        </div>

        {/* macOS Style Window Frame around Portfolio contents */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
          className={`rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 mb-6 ${
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
              /portfolio
            </div>

            {/* Secure Token representation */}
            <span className="text-[10px] font-mono tracking-widest text-[#2563eb]/60 font-bold hidden sm:inline" />
          </div>

          <motion.div
            animate={{ height: isMinimized ? '0px' : 'auto', opacity: isMinimized ? 0 : 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-10">

        {/* Category filters - macOS Segmented Control */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-10 w-full max-w-full"
        >
          <div className="w-full max-w-2xl px-4 sm:px-0">
            <div className={`p-1 rounded-2xl flex flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-none shadow-sm border ${
              isDark 
                ? 'bg-[#0b0c10] border-white/5 shadow-black/40' 
                : 'bg-zinc-100 border-zinc-200/80 shadow-zinc-200/30'
            }`}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  id={`filter-portfolio-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => { triggerHaptic(); setActiveCategory(cat); }}
                  className={`relative flex-1 shrink-0 px-4 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all duration-300 select-none cursor-pointer whitespace-nowrap text-center ${
                    activeCategory === cat
                      ? isDark ? 'text-white' : 'text-zinc-900'
                      : isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-950'
                  }`}
                >
                  {activeCategory === cat && (
                    <motion.div
                      layoutId="activeCategoryOutline"
                      className={`absolute inset-0 rounded-xl border z-0 ${
                        isDark 
                          ? 'bg-zinc-800 border-white/10 shadow-sm' 
                          : 'bg-white border-zinc-200/50 shadow-sm'
                      }`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Grid mapping */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p, pIdx) => {
            const isLiked = likedProjects[p.id] || false;
            return (
              <Tilt3D key={`${activeCategory}-${p.id}`} max={6} scale={1.02} className="w-full h-full flex flex-col justify-between">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.28,
                    delay: Math.min(pIdx * 0.03, 0.18),
                    ease: [0.215, 0.610, 0.355, 1.000]
                  }}
                  onClick={() => handleOpenProject(p)}
                  className={`group rounded-3xl overflow-hidden cursor-pointer border flex flex-col justify-between h-full transform-gpu will-change-[transform,opacity] ${
                    isDark 
                      ? 'glass-panel-dark border-white/5 hover:border-white/10' 
                      : 'glass-panel-light border-black/5 hover:border-black/10'
                  }`}
                >
                
                {/* Decorative Mockup display frame representation */}
                <div className={`relative h-auto aspect-video w-full bg-gradient-to-tr ${p.imageColor} flex items-center justify-center overflow-hidden p-3`}>
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay group-hover:scale-105 transition-all duration-500" />
                  )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    
                    {/* SVG graphic representations of layouts overlayed when no image */}
                    {!p.imageUrl && (
                      <div className="relative w-full h-full flex items-center justify-center text-white font-mono scale-[0.88] group-hover:scale-[0.93] transition-transform duration-300">
                        <MockDesignSVG projectType={p.id} isDark={isDark} />
                      </div>
                    )}

                    {/* Floating pill overlays */}
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-black/60 text-white backdrop-blur-md border border-white/5">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                      <span>{p.subcategory}</span>
                    </div>

                    {/* Like Action Indicator */}
                    <motion.button
                      onClick={(e) => toggleLike(p.id, e)}
                      whileHover={{ scale: 1.2, rotate: [0, -8, 8, 0] }}
                      whileTap={{ scale: 0.85 }}
                      animate={{ 
                        scale: isLiked ? [1, 1.35, 1.1, 1] : 1,
                        borderColor: isLiked ? 'rgba(37,99,235,0.4)' : 'rgba(255,255,255,0.1)'
                      }}
                      className={`absolute top-4 right-4 p-2 rounded-xl text-white backdrop-blur-md border transition-colors ${
                        isLiked 
                          ? 'bg-blue-600/35 border-blue-500/30 text-blue-450 hover:bg-blue-600/50' 
                          : 'bg-black/45 hover:bg-black/60 border-white/10'
                      }`}
                    >
                      <Heart 
                        size={14} 
                        fill={isLiked ? '#2563eb' : 'transparent'} 
                        className={`transition-colors ${isLiked ? 'text-blue-500' : 'text-white'}`} 
                      />
                    </motion.button>
                  </div>

                  {/* Text details card */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className={`text-[10px] font-mono font-medium block mb-1 uppercase tracking-wider ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        {p.category}
                      </span>
                      <h3 className={`text-lg font-bold font-display tracking-tight leading-tight mb-2 group-hover:text-blue-500 transition-colors ${
                        isDark ? 'text-white' : 'text-gray-950'
                      }`}>
                        {p.title}
                      </h3>
                      <p className={`text-xs leading-relaxed mb-4 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {p.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/[0.05] dark:border-black/[0.05] pt-3.5 mt-auto">
                      <div className="flex flex-wrap gap-1">
                        {p.tags.slice(0, 2).map((t) => (
                          <span key={t} className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            isDark ? 'bg-white/5 text-gray-500' : 'bg-black/5 text-gray-400'
                          }`}>
                            {t}
                          </span>
                        ))}
                      </div>
                      {p.figmaUrl ? (
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          <span>Figma</span>
                          <ArrowUpRight size={12} />
                        </span>
                      ) : p.linkedinUrl ? (
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-550 dark:text-blue-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          <span>LinkedIn</span>
                          <ArrowUpRight size={12} />
                        </span>
                      ) : p.githubUrl && p.githubUrl !== '#' ? (
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          <span>GitHub</span>
                          <ArrowUpRight size={12} />
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                          <span>Details</span>
                        </span>
                      )}
                    </div>
                  </div>

                </motion.div>
              </Tilt3D>
              );
            })}
        </div>
        </div>
        </motion.div>
      </motion.div>

        {/* Immersive interactive live project simulator overlay */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-[9999] flex items-start md:items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseProject}
                className="fixed inset-0 bg-black/40 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className={`relative w-full max-w-4xl my-auto h-auto md:h-[80vh] rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col md:flex-row shadow-2xl border ${
                  isDark 
                    ? 'glass-panel-dark border-white/10 text-white' 
                    : 'glass-panel-light border-black/5 text-gray-950'
                }`}
              >
                {/* Left high-fidelity image visualization frame */}
                <div className={`w-full md:w-3/5 h-44 sm:h-56 md:h-full flex-shrink-0 relative bg-gradient-to-tr ${selectedProject.imageColor} flex items-center justify-center p-4 sm:p-6 overflow-hidden border-b md:border-b-0 md:border-r ${
                  isDark ? 'border-white/5' : 'border-black/5'
                }`}>
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                  
                  <div className="relative w-full h-full min-h-[120px] rounded-2xl overflow-hidden border border-white/15 dark:border-white/10 shadow-2xl bg-black/40 flex items-center justify-center p-4">
                    {selectedProject.imageUrl ? (
                      <img
                        src={selectedProject.imageUrl}
                        alt={selectedProject.title}
                        referrerPolicy="no-referrer"
                        className="max-w-full max-h-full w-auto h-auto object-contain"
                      />
                    ) : (
                      <div className="relative w-full h-full flex items-center justify-center text-white font-mono scale-[0.88]">
                        <MockDesignSVG projectType={selectedProject.id} isDark={isDark} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/5 shadow-inner pointer-events-none" />
                  </div>
                </div>

                {/* Right descriptions and metadata panel */}
                <div className="w-full md:w-2/5 flex-1 md:h-full overflow-y-auto p-5 sm:p-8 flex flex-col justify-between">
                  <div>
                    {/* Header bar controls */}
                    <div className="flex items-center justify-between mb-6">
                      <button
                        onClick={handleCloseProject}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all ${
                          isDark 
                            ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' 
                            : 'bg-black/5 hover:bg-black/10 border-black/5 text-gray-900'
                        }`}
                      >
                        <ArrowLeft size={12} />
                        <span>Back</span>
                      </button>
                      <span className="text-[10px] font-mono uppercase bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full border border-blue-500/20">
                        Design Showcase
                      </span>
                    </div>

                    <span className={`text-xs font-mono font-medium block uppercase tracking-wide mb-1 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      {selectedProject.category} • {selectedProject.subcategory}
                    </span>
                    <h3 className="text-2xl font-bold font-display tracking-tight leading-tight mb-4">
                      {selectedProject.title}
                    </h3>
                    <p className={`text-sm leading-relaxed mb-6 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {selectedProject.description}
                    </p>

                    {/* Attributes lists */}
                    <div className="mb-6">
                      <span className={`text-[10px] font-mono block uppercase mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Technologies applied
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tags.map((t) => (
                          <span
                            key={t}
                            className={`text-xs font-mono px-3 py-1 rounded-lg ${
                              isDark ? 'bg-white/5 text-gray-300' : 'bg-black/5 text-gray-700'
                            }`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* External CTA buttons */}
                  {(selectedProject.figmaUrl || selectedProject.linkedinUrl || (selectedProject.githubUrl && selectedProject.githubUrl !== '#')) && (
                    <div className="border-t border-white/[0.05] dark:border-black/[0.05] pt-6 mt-6 flex flex-col gap-3">
                      {selectedProject.figmaUrl && (
                        <a
                          href={selectedProject.figmaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={triggerHaptic}
                          className="group flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-all shadow-md shadow-blue-500/10 active:scale-[0.98]"
                        >
                          <span>Open Figma Design</span>
                          <ArrowUpRight size={14} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                      )}
                      {selectedProject.linkedinUrl && (
                        <a
                          href={selectedProject.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={triggerHaptic}
                          className="group flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98]"
                        >
                          <span>View LinkedIn Post</span>
                          <ArrowUpRight size={14} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                      )}
                      {selectedProject.githubUrl && selectedProject.githubUrl !== '#' && (
                        <a
                          href={selectedProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={triggerHaptic}
                          className="group flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-zinc-800 hover:bg-zinc-900 text-white text-sm font-semibold transition-all shadow-md shadow-zinc-800/10 active:scale-[0.98]"
                        >
                          <span>View GitHub Project</span>
                          <ArrowUpRight size={14} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                      )}
                    </div>
                  )}

                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>

      {/* Floating appreciation hearts/sparks */}
      <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
        <AnimatePresence>
          {floatingHearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ opacity: 1, scale: 0.2, x: heart.x, y: heart.y }}
              animate={{ 
                opacity: [1, 1, 0.8, 0], 
                scale: [0.2, 1.3, 1.5, 0.8],
                y: heart.y - 180 - (Math.random() * 100),
                x: heart.x + (Math.random() - 0.5) * 160,
                rotate: heart.rotation + (Math.random() - 0.5) * 60
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, ease: "easeOut" }}
              style={{
                position: 'fixed',
                left: 0,
                top: 0,
                fontSize: `${heart.size}px`,
                userSelect: 'none',
              }}
            >
              {heart.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Immersive appreciation response Toast */}
      <AnimatePresence>
        {showAppreciateToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: -20, scale: 0.8, x: '-50%' }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-10 left-1/2 z-[999999] pointer-events-none"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          >
            <div className={`px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 border backdrop-blur-md ${
              isDark 
                ? 'bg-zinc-950/95 border-blue-500/30 text-white shadow-[0_15px_35px_rgba(59,130,246,0.25)]' 
                : 'bg-white/95 border-blue-200 text-gray-900 shadow-[0_15px_35px_rgba(59,130,246,0.15)]'
            }`}>
              <motion.span 
                animate={{ scale: [1, 1.3, 1] }} 
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-lg"
              >
                ❤️
              </motion.span>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold leading-none tracking-tight">Apprecitation Spotted!</span>
                <span className="text-[10px] font-mono text-blue-500 font-semibold mt-1">Thank you for liking my work ✨</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ----------------------------------------------------
// static custom mini vector representations in grid view
// ----------------------------------------------------
function MockDesignSVG({ projectType, isDark }: { projectType: string; isDark: boolean }) {
  if (projectType === 'proj_wellspark') {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl bg-black/40 border border-white/10 p-3 h-32 w-24">
        <div className="flex items-center justify-between w-full border-b border-white/10 pb-1 text-[8px] tracking-widest text-blue-400">
          <span>09:41</span>
          <span>●</span>
        </div>
        <div className="h-6 w-full rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
          <span className="text-[7px]">Calm session</span>
        </div>
        <div className="flex-1 w-full flex items-center justify-center gap-1.5">
          <div className="h-10 w-4 bg-blue-500/10 rounded flex flex-col justify-end">
            <div className="h-6 bg-blue-400 rounded-sm" />
          </div>
          <div className="h-10 w-4 bg-blue-500/10 rounded flex flex-col justify-end">
            <div className="h-8 bg-blue-300 rounded-sm" />
          </div>
          <div className="h-10 w-4 bg-blue-500/10 rounded flex flex-col justify-end">
            <div className="h-4 bg-white rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (projectType === 'proj_login') {
    return (
      <div className="flex flex-col gap-2 rounded-2xl bg-white/25 dark:bg-black/45 border border-white/20 p-4 w-44 shadow-lg backdrop-blur-md">
        <div className="h-2 w-12 bg-white/40 dark:bg-white/20 rounded" />
        <div className="h-3 w-full bg-white/50 dark:bg-white/10 rounded" />
        <div className="h-3 w-full bg-white/50 dark:bg-white/10 rounded" />
        <div className="h-5.5 w-full bg-blue-500 rounded flex items-center justify-center text-[7px] font-bold">
          Submit
        </div>
      </div>
    );
  }

  if (projectType === 'proj_social') {
    return (
      <div className="relative shadow-2xl flex flex-col items-center justify-between h-32 w-32 bg-gray-900 border border-white/10 p-2 text-center rounded-xl font-display">
        <div className="text-[11px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
          EXPLORE NEW WORLD
        </div>
        <div className="h-10 w-10 rounded-full border border-blue-500/40 flex items-center justify-center">
          <Sparkles size={12} className="text-blue-400 animate-spin-slow" />
        </div>
        <div className="text-[7px] tracking-wide text-gray-400 font-mono">
          JOIN US • 2026
        </div>
      </div>
    );
  }

  if (projectType === 'proj_data') {
    return (
      <svg viewBox="0 0 100 60" className="w-40 h-24">
        <path d="M10,50 L30,20 L50,42 L70,12 L90,32" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="30" cy="20" r="3" fill="#2563eb" />
        <circle cx="70" cy="12" r="3" fill="#2563eb" />
        <path d="M10,50 L30,20 L50,42 L70,12 L90,32 L90,52 L10,52 Z" fill="url(#gradData)" opacity="0.15" />
        <defs>
          <linearGradient id="gradData" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (projectType === 'proj_menu') {
    return (
      <div className="flex flex-col gap-1.5 rounded-xl bg-blue-950/80 border border-blue-800/30 p-3.5 w-36 h-32 text-blue-100 font-sans">
        <div className="text-center font-display text-[8px] uppercase tracking-widest text-blue-400 border-b border-blue-800/40 pb-1 font-bold">
          BASIC COFFEE
        </div>
        <div className="flex items-center justify-between text-[7px]">
          <span>Espresso</span>
          <span className="text-blue-400">$3.00</span>
        </div>
        <div className="flex items-center justify-between text-[7px] border-t border-blue-900/40 pt-1">
          <span>Latte Macchiato</span>
          <span className="text-blue-400">$4.50</span>
        </div>
        <div className="flex items-center justify-between text-[7px] border-t border-blue-900/40 pt-1">
          <span>Cappuccino</span>
          <span className="text-blue-400">$4.25</span>
        </div>
      </div>
    );
  }

  if (projectType === 'proj_product') {
    return (
      <div className="flex flex-col gap-2 rounded-2xl bg-blue-950/60 border border-blue-800/30 p-3 w-40 h-28 font-sans">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <div className="h-1.5 w-12 bg-white/40 rounded" />
        </div>
        <div className="text-[8px] text-blue-300 font-bold font-display">Product Series 3.0</div>
        <div className="grid grid-cols-4 gap-1 flex-1">
          <div className="rounded bg-white/10 hover:bg-white/20 transition-colors" />
          <div className="rounded bg-white/10 hover:bg-white/20 transition-colors" />
          <div className="rounded bg-blue-500/40" />
          <div className="rounded bg-white/10 hover:bg-white/20 transition-colors" />
        </div>
      </div>
    );
  }

  if (projectType === 'proj_skills') {
    return (
      <div className="flex flex-col gap-1.5 rounded-2xl bg-blue-950/75 border border-blue-800/30 p-3 h-32 w-36">
        <div className="h-2.5 w-16 bg-blue-400/30 rounded" />
        <div className="text-[8px] font-bold text-white uppercase font-mono mb-1">SKILL FAIR 2026</div>
        <div className="flex-1 grid grid-cols-2 gap-1.5">
          <div className="rounded bg-blue-500/10 border border-blue-500/20" />
          <div className="rounded bg-blue-500/10 border border-blue-500/20" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-blue-950/40 border border-blue-800/20 rounded-2xl h-32 w-32 relative">
      <div className="h-12 w-12 rounded-lg border-2 border-dashed border-blue-500/30 flex items-center justify-center">
        <Sparkles size={20} className="text-blue-400 animate-pulse" />
      </div>
      <span className="text-[7px] uppercase mt-2 text-blue-300 font-mono tracking-widest">Posters</span>
    </div>
  );
}

// ----------------------------------------------------
// Rich Interactive Projects emulator frames and components
// ----------------------------------------------------
interface EmulatorProps {
  projectId: string;
  isDark: boolean;
  triggerHaptic: () => void;
}

function LiveProjectEmulator({ projectId, isDark, triggerHaptic }: EmulatorProps) {
  // --- WELLSPARK APP (MOBILE HEALTHTECH EMULATOR) ---
  if (projectId === 'proj_wellspark') {
    const [mood, setMood] = useState('Satisfied');
    const [calories, setCalories] = useState(380);
    const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
      breathe: true,
      cardio: false,
    });

    return (
      <div className="h-[280px] sm:h-[360px] w-[180px] sm:w-[220px] rounded-[36px] bg-gray-950 p-2.5 sm:p-3.5 border-4 border-gray-800 shadow-2xl flex flex-col justify-between font-sans text-white text-[10px]">
        {/* Dynamic Notch */}
        <div className="flex justify-between items-center px-1 mb-2">
          <span>09:41</span>
          <div className="h-3 w-16 bg-gray-900 rounded-full border border-gray-800" />
          <span>99%</span>
        </div>

        {/* Dashboard contents */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-xs">Mood Center</h4>
            <div className="grid grid-cols-3 gap-1 mt-1.5">
              {['Satisfied', 'Anxious', 'Productive'].map((m) => (
                <button
                  key={m}
                  onClick={() => { triggerHaptic(); setMood(m); }}
                  className={`py-1 rounded text-[7px] transition-all font-semibold ${
                    mood === m ? 'bg-blue-500 text-white font-bold' : 'bg-white/5 active:bg-white/10'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Stats track index */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/5 text-center">
            <span className="block text-gray-400 text-[8px] uppercase">Active Burn</span>
            <span className="text-sm font-bold text-blue-400">{calories} kcal</span>
            <button
              onClick={() => { triggerHaptic(); setCalories(c => c + 35); }}
              className="mt-1 px-3 py-0.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 font-semibold text-[7px] border border-blue-500/20 active:scale-95"
            >
              Do Jump Jack (+35)
            </button>
          </div>

          {/* Checklist */}
          <div>
            <span className="block text-gray-400 text-[8px] mb-1 uppercase">Today tasks</span>
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-1.5 bg-white/[0.03] p-1.5 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkedItems.breathe}
                  onChange={() => { triggerHaptic(); setCheckedItems(p => ({ ...p, breathe: !p.breathe })); }}
                  className="accent-blue-600"
                />
                <span className={checkedItems.breathe ? 'line-through text-gray-500' : ''}>Deep Breathing</span>
              </label>
              <label className="flex items-center gap-1.5 bg-white/[0.03] p-1.5 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkedItems.cardio}
                  onChange={() => { triggerHaptic(); setCheckedItems(p => ({ ...p, cardio: !p.breathe })); }}
                  className="accent-blue-600"
                />
                <span className={checkedItems.cardio ? 'line-through text-gray-500' : ''}>30 Min Cardio run</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer capsule bar */}
        <div className="h-1 w-20 bg-white/30 rounded-full mx-auto mt-2" />
      </div>
    );
  }

  // --- LOGIN UI (FUNCTIONAL GLASS INTERFACED FORM) ---
  if (projectId === 'proj_login') {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [logged, setLogged] = useState(false);

    const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      triggerHaptic();
      if (!userId || !password) return;
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        setLogged(true);
      }, 1500);
    };

    const handleReset = () => {
      triggerHaptic();
      setUserId('');
      setPassword('');
      setLogged(false);
    };

    return (
      <div className="w-64 sm:w-80 rounded-2xl p-5 sm:p-6 backdrop-blur-md bg-white/10 dark:bg-black/40 border border-white/20 text-white font-sans text-xs shadow-2xl relative">
        <h4 className="text-center text-sm font-bold font-display uppercase tracking-wider mb-4 border-b border-white/15 pb-2">
          {logged ? 'Access Authenticated' : 'Secure Session Login'}
        </h4>

        {logged ? (
          <div className="text-center py-6">
            <div className="h-10 w-10 bg-blue-500/20 border border-blue-500/40 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
              ✓
            </div>
            <p className="font-semibold text-blue-400">Welcome, {userId}!</p>
            <p className="text-gray-400 text-[10px] mt-1 mb-4">Web token securely encrypted.</p>
            <button
              onClick={handleReset}
              className="px-4 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-[10px] uppercase font-mono font-semibold text-white cursor-pointer active:scale-95"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-[9px] uppercase text-gray-300 font-mono mb-1">Username / Email</label>
              <input
                type="text"
                id="emulator-username"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="rasuen27@gmail.com"
                className="w-full px-3 py-2 border border-white/15 rounded bg-black/20 text-white outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase text-gray-300 font-mono mb-1">Cryptographic key</label>
              <input
                type="password"
                id="emulator-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-white/15 rounded bg-black/20 text-white outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/40 font-bold uppercase tracking-wider rounded text-[10px] cursor-pointer flex items-center justify-center gap-1 active:scale-95 transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  <span>DECRYPTING AUTHORIZATION...</span>
                </>
              ) : (
                <span>SUBMIT ACCESS KEY</span>
              )}
            </button>
          </form>
        )}
      </div>
    );
  }

  // --- MENU DESIGN (INTERACTIVE EXPENSIVE ITALIAN ESPRESSO BAR LIST) ---
  if (projectId === 'proj_menu') {
    const [prices, setPrices] = useState<{ [key: string]: number }>({
      Espresso: 3.00,
      Capuccino: 4.25,
      Macchiato: 4.50,
      Affogato: 5.00
    });

    const incrementPrice = (name: string) => {
      triggerHaptic();
      setPrices(p => {
        const currentVal = p[name] || 0;
        return { ...p, [name]: +(currentVal + 0.25).toFixed(2) };
      });
    };

    return (
      <div className="w-60 sm:w-72 bg-[#0a0f1d] border border-blue-900/30 rounded-2xl p-5 text-blue-100 font-sans shadow-2xl">
        <h4 className="text-center font-display text-[10px] tracking-widest uppercase font-bold text-blue-400 mb-3.5 border-b border-blue-800/30 pb-2">
          ☕ ITALIAN ESPRESSO INDEX
        </h4>
        <div className="flex flex-col gap-3">
          {Object.entries(prices).map(([name, price]) => {
            const priceNum = price as number;
            return (
              <div key={name} className="flex items-center justify-between group border-b border-dashed border-blue-900/30 pb-1">
                <div>
                  <span className="text-xs font-semibold block">{name}</span>
                  <span className="text-[8px] text-blue-500 italic block">Milano premium blend</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-400 font-mono">${priceNum.toFixed(2)}</span>
                  <button
                    onClick={() => incrementPrice(name)}
                    className="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[8px] font-bold hover:bg-blue-500 active:scale-90"
                    title="Raise pricing level"
                  >
                    +$0.25
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-center text-[7px] text-blue-500 font-mono tracking-widest mt-4">
          CRAFTED BY RASENDRIYA • 2026
        </p>
      </div>
    );
  }

  // --- SOCIAL MEDIA POSTER (DYNAMIC CANVAS WORD VECTORIZER) ---
  if (projectId === 'proj_social') {
    const [phrase, setPhrase] = useState('EXPLORE');
    const [colorIdx, setColorIdx] = useState(0);
    const colors = [
      'from-blue-600 to-blue-400',
      'from-white to-zinc-400',
      'from-zinc-100 via-zinc-400 to-zinc-500 dark:from-zinc-950 dark:via-zinc-800 dark:to-zinc-700',
      'from-blue-500 via-blue-700 to-blue-900'
    ];

    const phrases = ['EXPLORE', 'INNOVATE', 'DECORATE', 'DOMINATE'];

    const handleCycle = () => {
      triggerHaptic();
      setPhrase(phrases[(phrases.indexOf(phrase) + 1) % phrases.length]);
      setColorIdx((colorIdx + 1) % colors.length);
    };

    return (
      <div className="w-56 sm:w-64 h-[240px] sm:h-[300px] bg-zinc-950 rounded-2xl flex flex-col justify-between p-4 border border-zinc-800 text-center font-display shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-radial-gradient from-zinc-900 via-zinc-950 to-black z-0" />
        
        {/* Subtle grid backing lines */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-[0.03] border border-zinc-500" />

        <div className="relative z-10">
          <span className="text-[10px] tracking-widest font-mono text-zinc-500 uppercase block mb-1">
            Visual Poster Series
          </span>
          <span className="text-[8px] text-zinc-400 font-mono">№ 032-B7</span>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 my-auto">
          {/* Animated glow text header */}
          <motion.h4
            key={phrase}
            initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`text-2xl sm:text-3.5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r ${colors[colorIdx]}`}
          >
            {phrase}
          </motion.h4>
          <div className="h-0.5 w-12 bg-white/20 mt-1" />
          <span className="text-[9px] font-mono font-semibold tracking-wider text-white mt-1.5">
            THE NEW DIGITAL FRONTIER
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-2">
          <button
            onClick={handleCycle}
            className="px-4 py-2 border border-zinc-700 bg-white/5 active:bg-white/10 hover:border-zinc-500 text-[8px] uppercase tracking-wider font-mono font-bold rounded-lg text-white transition-all active:scale-95"
          >
            Cycle visual mood
          </button>
          <span className="text-[7px] text-zinc-600 font-mono uppercase tracking-widest">
            Design crafted by RKJ
          </span>
        </div>
      </div>
    );
  }

  // --- DATA SERIES (SVG D3-STYLE CHART SELECTOR) ---
  if (projectId === 'proj_data') {
    const [selectedStat, setSelectedStat] = useState<number>(0);
    const statsSets = [
      { year: '2022', data: [15, 30, 18, 48, 22, 58], color: '#3b82f6', label: 'Student Enrollment' },
      { year: '2024', data: [42, 10, 56, 32, 68, 12], color: '#60a5fa', label: 'Cyber Labs Deployed' },
      { year: '2026', data: [20, 52, 28, 62, 40, 78], color: '#ffffff', label: 'Cloud Infrastructure Nodes' }
    ];

    return (
      <div className="w-64 sm:w-80 rounded-2xl p-5 bg-gray-950 border border-gray-800 text-white font-mono text-[9px] shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-4">
          <span className="font-bold text-[10px] text-gray-300">DATA VISUALIZATION</span>
          <div className="flex gap-1.5">
            {statsSets.map((set, idx) => (
              <button
                key={set.year}
                onClick={() => { triggerHaptic(); setSelectedStat(idx); }}
                className={`px-2 py-0.5 rounded text-[8px] border transition-all ${
                  selectedStat === idx ? 'bg-white text-black font-bold border-white' : 'bg-transparent border-gray-800 hover:border-gray-700'
                }`}
              >
                {set.year}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-2 text-center text-xs font-semibold text-gray-100">
          {statsSets[selectedStat].label}
        </div>

        {/* Live Drawing SVG lines */}
        <div className="h-28 pr-1 relative flex items-end">
          <svg viewBox="0 0 100 65" className="w-full h-full">
            {/* Backgound Grid bars */}
            <line x1="0" y1="15" x2="100" y2="15" stroke="#1f2937" strokeWidth="0.5" />
            <line x1="0" y1="35" x2="100" y2="35" stroke="#1f2937" strokeWidth="0.5" />
            <line x1="0" y1="55" x2="100" y2="55" stroke="#1f2937" strokeWidth="0.5" />

            {/* Line graph outline */}
            <motion.path
              key={selectedStat}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
              d={`M0,${65 - statsSets[selectedStat].data[0]} L20,${65 - statsSets[selectedStat].data[1]} L40,${65 - statsSets[selectedStat].data[2]} L60,${65 - statsSets[selectedStat].data[3]} L80,${65 - statsSets[selectedStat].data[4]} L100,${65 - statsSets[selectedStat].data[5]}`}
              fill="none"
              stroke={statsSets[selectedStat].color}
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Glowing nodes */}
            {statsSets[selectedStat].data.map((yVal, xIdx) => (
              <circle
                key={xIdx}
                cx={xIdx * 20}
                cy={65 - yVal}
                r="2"
                fill={statsSets[selectedStat].color}
                className="animate-pulse"
              />
            ))}
          </svg>
        </div>

        <div className="flex items-center justify-between mt-3 text-gray-500">
          <span>INDEX 00</span>
          <span>INDEX 05</span>
        </div>
      </div>
    );
  }

  // --- MOCK FALLBACK DISPLAY (FOR PROJECTS LIKE SKILLS/EVENT) ---
  const [stars, setStars] = useState(4);
  return (
    <div className="w-56 rounded-2xl bg-black/40 border border-white/10 p-5 text-center text-white text-[10px] font-sans">
      <Sparkles size={24} className="mx-auto text-blue-400 mb-3 animate-spin-slow" />
      <h4 className="font-bold text-xs">Vector Creative Layout</h4>
      <p className="text-gray-400 mt-1 mb-4 leading-relaxed">
        High-fidelity vector illustrations crafted on Figma grids utilizing compound paths and secure mathematical meshes.
      </p>
      <div className="flex items-center justify-center gap-1.5">
        <span className="text-gray-400">Rate mock design:</span>
        <div className="flex gap-1">
          {[1,2,3,4,5].map((s) => (
            <button
              key={s}
              onClick={() => { triggerHaptic(); setStars(s); }}
              className={`text-xs ${s <= stars ? 'text-blue-500' : 'text-gray-600'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Global Loader component
export function Loader2(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${props.className}`}
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
