import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, ShieldCheck, Award, ExternalLink, Calendar, Hash, X, Globe, Library, Folder, FileText, Image as ImageIcon, FileJson, Download, Copy, Check } from 'lucide-react';
import { certifications, personalInfo } from '../data';
import { Certification } from '../types';
import { WindowControls } from './WindowControls';
import { MyPdfViewer } from './MyPdfViewer';

interface CertificationsProps {
  isDark: boolean;
  triggerHaptic: () => void;
}

export default function Certifications({ isDark, triggerHaptic }: CertificationsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('All');
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [isClosed, setIsClosed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  // Derive unique list of organizations for filter options
  const organizations = ['All', ...Array.from(new Set(certifications.map((c) => c.organization)))];

  // Live filter computation
  const filteredCertifications = certifications.filter((cert) => {
    const matchesSearch = 
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.badges.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase())) ||
      cert.organization.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesOrg = selectedOrg === 'All' || cert.organization === selectedOrg;

    return matchesSearch && matchesOrg;
  });

  const handleShowCredential = (cert: Certification) => {
    triggerHaptic();
    setSelectedCert(cert);
  };

  const handleCloseCredential = () => {
    triggerHaptic();
    setSelectedCert(null);
  };

  if (isClosed) {
    return (
      <section id="certifications" className="py-24 relative overflow-hidden px-4 md:px-0">
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
            <p className="text-sm">Credentials window is closed.</p>
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
              Launch Credentials Registry
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="certifications" className="py-24 relative overflow-hidden px-4 md:px-0">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Title */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 text-blue-500 font-mono text-sm font-semibold tracking-wider uppercase mb-3"
          >
            <Award size={16} />
            <span>Achievements & Certifications</span>
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
            Certifications & Credentials<span className="text-blue-500 font-extrabold gap-0">.</span>
          </motion.h2>
        </div>

        {/* macOS Style Window Frame around Certifications contents */}
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
              /credentials
            </div>

            {/* Secure Token representation */}
            <span className="text-[10px] font-mono tracking-widest text-[#2563eb]/60 font-bold hidden sm:inline" />
          </div>

          <motion.div
            animate={{ height: isMinimized ? '0px' : 'auto', opacity: isMinimized ? 0 : 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={isMinimized ? 'overflow-hidden' : ''}
          >
            <div className="p-4 sm:p-10">

        {/* Filter Controls (Grounded search bar and custom dropdown card) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`rounded-3xl p-4 sm:p-6 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between ${
            isDark ? 'bg-white/[0.02] border border-white/5' : 'bg-black/[0.01] border border-black/5'
          }`}
        >
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Search className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`} size={18} />
            <input
              type="text"
              id="search-cert-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(4);
              }}
              placeholder="Search certifications or topics..."
              className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm transition-all duration-300 pointer-events-auto outline-none ${
                isDark 
                  ? 'bg-gray-900 border border-white/5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20' 
                  : 'bg-white border border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10'
              }`}
            />
          </div>

          {/* Org Selector Select */}
          <div className="relative w-full sm:w-auto flex items-center gap-3">
            <span className={`text-xs font-mono hidden sm:inline ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Filter:
            </span>
            <div className="relative w-full sm:w-56">
              <Filter className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`} size={16} />
              <select
                id="org-cert-select"
                value={selectedOrg}
                onChange={(e) => {
                  setSelectedOrg(e.target.value);
                  setVisibleCount(4);
                }}
                className={`w-full pl-10 pr-8 py-3 rounded-2xl text-sm appearance-none outline-none cursor-pointer font-medium transition-all duration-300 ${
                  isDark 
                    ? 'bg-gray-900 border border-white/5 text-white focus:border-blue-500' 
                    : 'bg-white border border-gray-200 text-gray-950 focus:border-blue-500'
                }`}
              >
                {organizations.map((org) => (
                  <option key={org} value={org}>
                    {org === 'All' ? 'All Organizations' : org}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                ▼
              </div>
            </div>
          </div>
        </motion.div>

        {/* Certifications Dynamic List Mapping */}
        <AnimatePresence mode="popLayout">
          {filteredCertifications.length > 0 ? (
            <div className="space-y-6">
              <motion.div 
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 45 }}
                className="flex flex-col gap-6"
              >
                {filteredCertifications.slice(0, visibleCount).map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10px' }}
                  transition={{ 
                    opacity: { duration: 0.2 },
                    y: { duration: 0.2 },
                    layout: { type: 'spring', stiffness: 500, damping: 45 }
                  }}
                  layout
                  className={`rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden ${
                    isDark 
                      ? 'glass-panel-dark hover:border-blue-500/20' 
                      : 'glass-panel-light hover:border-blue-500/10'
                  }`}
                >
                  {/* Left Column info details */}
                  <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
                    <div className="relative group/thumb h-20 w-28 sm:h-24 sm:w-36 rounded-2xl overflow-hidden shrink-0 border border-black/10 dark:border-white/10 shadow-sm flex items-center justify-center bg-black/5 dark:bg-white/5 p-1.5">
                      {cert.imageUrl ? (
                        <img
                          src={cert.imageUrl}
                          alt={cert.title}
                          referrerPolicy="no-referrer"
                          className="max-w-full max-h-full w-auto h-auto object-contain group-hover/thumb:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-white/5 text-blue-400' : 'bg-black/5 text-blue-600'}`}>
                          <ShieldCheck size={28} className="animate-pulse" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/10 group-hover/thumb:bg-black/0 transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className={`text-lg sm:text-xl font-bold font-display tracking-tight mb-1.5 ${
                        isDark ? 'text-white' : 'text-gray-950'
                      }`}>
                        {cert.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap mb-3 text-sm font-medium">
                        <span className="text-blue-500 font-semibold">{cert.organization}</span>
                        <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>•</span>
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{cert.year}</span>
                      </div>

                      {/* Display Badges */}
                      <div className="flex flex-wrap gap-2">
                        {cert.badges.map((badge) => (
                          <span
                            key={badge}
                            className={`text-xs font-mono px-3 py-1 rounded-full border ${
                              isDark 
                                ? 'bg-white/[0.02] border-white/5 text-gray-400' 
                                : 'bg-black/[0.01] border-black/5 text-gray-600'
                            }`}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column Action Blocks matching layout image */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto justify-stretch sm:justify-end mt-4 sm:mt-0 shrink-0">
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={triggerHaptic}
                      className={`w-full sm:w-auto text-center inline-flex items-center justify-center gap-1.5 px-4.5 py-3 rounded-2xl text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-md shadow-blue-500/10 active:scale-[0.98] duration-300 shrink-0`}
                    >
                      <span>Verification</span>
                      <ExternalLink size={12} className="shrink-0" />
                    </a>
                    <button
                      onClick={() => handleShowCredential(cert)}
                      className={`w-full sm:w-auto text-center inline-flex items-center justify-center gap-1.5 px-4.5 py-3 rounded-2xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all border duration-300 shrink-0 ${
                        isDark 
                          ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white active:bg-white/15' 
                          : 'bg-black/5 hover:bg-black/10 border-black/5 text-gray-950 active:bg-black/15'
                      }`}
                    >
                      <span>Credential Detail</span>
                    </button>
                  </div>

                </motion.div>
              ))}
            </motion.div>

            {filteredCertifications.length > visibleCount && (
              <div className="flex justify-center pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    triggerHaptic();
                    setVisibleCount((prev) => prev + 4);
                  }}
                  className={`px-8 py-3.5 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                    isDark 
                      ? 'bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/25 text-blue-400 hover:shadow-black/40' 
                      : 'bg-blue-50 hover:bg-blue-100 border border-blue-200/50 text-blue-600'
                  }`}
                >
                  <span>Load More Certifications</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    isDark ? 'bg-blue-500/15' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {filteredCertifications.length - visibleCount} remaining
                  </span>
                </motion.button>
              </div>
            )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-3xl p-12 text-center border ${
                isDark ? 'bg-white/[0.02] border-white/5 text-gray-400' : 'bg-black/[0.01] border-black/5 text-gray-600'
              }`}
            >
              <Library size={32} className="mx-auto text-blue-500/40 mb-3" />
              <p className="font-semibold text-lg mb-1">No certifications found</p>
              <p className="text-sm">Try searching other terminology or organizations.</p>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
        </motion.div>
      </motion.div>

        {/* Detailed Credential Popup Drawer/Modal */}
        <AnimatePresence>
          {selectedCert && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
              {/* Overlay Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseCredential}
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className={`relative w-full max-w-2xl max-h-[92vh] sm:max-h-[85vh] flex flex-col rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl z-10 border ${
                  isDark 
                    ? 'bg-[#0a0b10] border-white/10 text-white shadow-black/90' 
                    : 'bg-white border-gray-200 text-gray-950'
                }`}
              >
                {/* Close Button top-right */}
                <button
                  onClick={handleCloseCredential}
                  className={`absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full border z-20 transition-all cursor-pointer ${
                    isDark 
                      ? 'bg-black/60 hover:bg-black/80 border-white/10 text-white' 
                      : 'bg-white/60 hover:bg-white/80 border-black/5 text-gray-900'
                  }`}
                >
                  <X size={18} />
                </button>

                {/* Scrollable Container Body */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-9 pt-12 sm:pt-14 custom-scrollbar">
                  
                  {/* Badge Indicator tag */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-blue-500/10 text-blue-500 border border-blue-500/20 mb-5">
                    <ShieldCheck size={12} />
                    Verified Credential
                  </span>

                  {/* Info Block */}
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-display tracking-tight leading-tight mb-2 pr-8">
                    {selectedCert.title}
                  </h3>
                  <p className="text-blue-500 font-semibold mb-6">{selectedCert.organization}</p>

                  {/* Media Content Stage container */}
                  {selectedCert.pdfUrl ? (
                    <MyPdfViewer pdfUrl={selectedCert.pdfUrl} isDark={isDark} />
                  ) : (
                    selectedCert.imageUrl && (
                      <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden mb-6 border border-black/10 dark:border-white/10 shadow-inner flex items-center justify-center bg-black/5 dark:bg-white/5 p-4">
                        <img
                          src={selectedCert.imageUrl}
                          alt={selectedCert.title}
                          referrerPolicy="no-referrer"
                          className="max-w-full max-h-full w-auto h-auto object-contain"
                        />
                        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                      </div>
                    )
                  )}

                  {/* Timeline and Verification details table */}
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl mb-6 text-sm font-mono ${
                    isDark ? 'bg-white/[0.02] border border-white/5' : 'bg-black/[0.01] border border-black/5'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Issued Year:</span>
                      <span className="font-semibold">{selectedCert.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash size={16} className="text-gray-400" />
                      <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Cred ID:</span>
                      <span className="font-semibold">{selectedCert.credentialId || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <Globe size={16} className="text-gray-400 animate-pulse" />
                      <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Registry Verification Link:</span>
                      <a
                        href={selectedCert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={triggerHaptic}
                        className="text-blue-500 hover:underline flex items-center gap-1 font-semibold hover:text-blue-600"
                      >
                        <span>Verify Credentials portal</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>

                  {/* Skills Tag block */}
                  <div className="mb-6">
                    <span className={`text-[11px] font-mono block uppercase mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Verified Skills acquired
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedCert.badges.map((badge) => (
                        <span
                          key={badge}
                          className={`text-xs font-mono px-3 py-1 rounded-full border ${
                            isDark 
                              ? 'bg-white/[0.03] border-white/5 text-gray-300' 
                              : 'bg-black/[0.02] border-black/5 text-gray-700'
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Curriculum Description */}
                  <div className="mb-6">
                    <span className={`text-[11px] font-mono block uppercase mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Syllabus Mastery Topics
                    </span>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {selectedCert.description}
                    </p>
                  </div>

                  {/* Interactive Stamp representation at bottom inside scroll */}
                  <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between border-t pt-5 border-white/[0.05] dark:border-black/[0.05]">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs ring-4 ring-blue-500/5 shrink-0">
                        ✓
                      </div>
                      <span className={`text-xs font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Issuer Digital Signature Registered
                      </span>
                    </div>
                    <button
                      onClick={handleCloseCredential}
                      className={`w-full sm:w-auto text-center px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gray-500 hover:bg-gray-600 text-white transition-colors cursor-pointer`}
                    >
                      Close Panel
                    </button>
                  </div>

                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
