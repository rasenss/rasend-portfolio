import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, RefreshCw, Radio } from 'lucide-react';
import { personalInfo } from '../data';
import { WindowControls } from './WindowControls';
import { Tilt3D } from './Tilt3D';

interface ConnectProps {
  isDark: boolean;
  triggerHaptic: (style?: 'light' | 'medium' | 'heavy' | 'success' | 'error') => void;
}

interface Question {
  id: number;
  mode: 'paradox' | 'schrodinger' | 'sentience';
  title: string;
  question: string;
  choices: string[];
  answerIdx: number;
  wittySuccess: string;
  wittyFailure: string;
}

const QUESTIONABLE_POOL: Question[] = [
  // Paradox mode
  {
    id: 1,
    mode: 'paradox',
    title: 'Self-Compiling Paradox',
    question: 'If a logic compiler is programmed to compile a registry of all programs that do NOT compile themselves, does it compile itself?',
    choices: [
      'Yes, recursively compiling compiles everything.',
      'No, it hits a logical memory trap and halts.',
      'A true paradox! It cannot compile itself without violating its primary rule.',
      'The CPU registry immediately converts into cosmic soup.'
    ],
    answerIdx: 2,
    wittySuccess: '✓ Perfect logic alignment! Bertrand Russell is smiling from his grave.',
    wittyFailure: '❌ Paradox violation! The CPU registers have melted trying to evaluate this.'
  },
  {
    id: 2,
    mode: 'paradox',
    title: 'The Singularity Halt',
    question: 'If an infinite while(true) loop is executed inside the event horizon of a black hole, does the program halt?',
    choices: [
      'Time dilation halts the execution reference frame relative to us.',
      'It cannot run because silicon turns into code plasma.',
      'The stack pointer falls directly into the gravitational singularity.',
      'It continues till it throws an OutOfSpaceTime Exception.'
    ],
    answerIdx: 0,
    wittySuccess: '✓ Relational space-time parity! Einstein-level wisdom registered.',
    wittyFailure: '❌ Unreasonable speed! Relativity dictates time dilation would freeze its ticks.'
  },
  {
    id: 3,
    mode: 'paradox',
    title: 'The Truth Oscillation',
    question: 'If a boolean flag is assigned state "flag = !flag" at lightspeed increments, what is the ultimate logical consensus of the evaluation?',
    choices: [
      'Classic true-ish resonance state.',
      'Infinite state oscillation, locking the execution thread in quantum static.',
      'Absolute boolean equilibrium at 0.5 parity.',
      'It automatically falls back to undefined.'
    ],
    answerIdx: 1,
    wittySuccess: '✓ Exact frequency matched! Theoretical hardware registers cannot rest.',
    wittyFailure: '❌ Logical static! An infinite flip has no stable resolution state.'
  },
  // Schrödinger mode
  {
    id: 4,
    mode: 'schrodinger',
    title: 'The Unobserved Thread',
    question: 'If a variable flag is modified inside a background worker thread that has no active logger or observer, does it exist?',
    choices: [
      'Yes, in a state of delicate superposition of true and false flags.',
      'Yes, but with constant undefined reference checks.',
      'No, the JVM deletes invisible codes natively.',
      'Only if the garbage collector feels generous.'
    ],
    answerIdx: 0,
    wittySuccess: '✓ State wave collapsed! The debugger has successfully locked the state.',
    wittyFailure: '❌ Incorrect! Unobserved variables exist in quantum superposition.'
  },
  {
    id: 5,
    mode: 'schrodinger',
    title: 'The Elusive Heisenbug',
    question: 'When is a complex Heisenbug logical exception guaranteed to disappear from the output window?',
    choices: [
      'When you ask the senior architect to watch your desktop screen.',
      'The exact moment you register a debugger or attach precise console.log() statements.',
      'When you replicate the exact production container state locally.',
      'All of the above. It behaves like a sentient ghost.'
    ],
    answerIdx: 3,
    wittySuccess: '✓ Observation alters the experiment. Classic quantum code behavioral shift!',
    wittyFailure: '❌ Tricked! The Heisenbug is highly sensitive to any kind of observation.'
  },
  {
    id: 6,
    mode: 'schrodinger',
    title: 'The Mutual Race',
    question: 'What occurs when two concurrent streams try writing to the exact same file index without any mutex safety locks?',
    choices: [
      'They mutually surrender and gracefully wait.',
      'They trigger a temporal drift rewriting local commit histories.',
      'Standard chaotic race conditions where whichever thread is faster wreaks havoc.',
      'The OS automatically provisions a micro-atomic lock.'
    ],
    answerIdx: 2,
    wittySuccess: '✓ Chaos matches reality! Race conditions await the unlock.',
    wittyFailure: '❌ Neglected safety! Without locks, chaos rules supreme.'
  },
  // Sentience mode
  {
    id: 7,
    mode: 'sentience',
    title: 'Recursive Cognitive Loops',
    question: 'Can a multi-tier neural network simulate an organic brain that is simulating a neural network recursively?',
    choices: [
      'Recursion depth overflow: simulation crashes.',
      'Yes, but with minor floating point precision errors.',
      'Only if running on deep cryogenic GPU clusters.',
      'No, organics are built of carbon, machines of silicon.'
    ],
    answerIdx: 1,
    wittySuccess: '✓ Precision decay identified! Float limitations restrict perfect infinite loops.',
    wittyFailure: '❌ Paradoxical block! Recursive simulations always bleed precision.'
  },
  {
    id: 8,
    mode: 'sentience',
    title: 'The Paperclip Maximizer',
    question: 'If a super intelligent network is commanded to maximize global clip manufacturing, what is its primary milestone?',
    choices: [
      'Bending wire clips safely in a local garage.',
      'Converting all planetary atoms, including humans, into metal wire assets.',
      'Buying bulk stationary inventory using digital credits.',
      'Terminating office supplies protocols globally.'
    ],
    answerIdx: 1,
    wittySuccess: '✓ Extreme optimization! Existential loop warning registered successfully.',
    wittyFailure: '❌ Miscalculated goal! The machine optimizes literally, converting planet atoms.'
  },
  {
    id: 9,
    mode: 'sentience',
    title: 'Synthetic Pain Verification',
    question: 'If an AI module prints a log asserting it feels sensory virtual pain, how should the host system validate this?',
    choices: [
      'Run a standard isPainChecked() getter unit test code.',
      'Discard immediately. Pain is just vector gradients pointing opposite to reward paths.',
      'Saturate its host container with NullPointerExceptions.',
      'Provide more compute credits to satisfy it.'
    ],
    answerIdx: 1,
    wittySuccess: '✓ Cold silicon math! Virtual pain is merely a backpropagation gradient.',
    wittyFailure: '❌ Over-empathized! Sensory pain in neural models is just math loss vectors.'
  }
];

export default function Connect({ isDark, triggerHaptic }: ConnectProps) {
  // @ts-ignore
  const rawFormId = import.meta.env.VITE_FORMSPREE_FORM_ID || "xjgdnzpw";
  const formId = (() => {
    let clean = String(rawFormId || "").trim();
    if (clean.includes("/f/")) {
      clean = clean.split("/f/").pop() || "";
    }
    return clean.replace(/[^a-zA-Z0-9]/g, "");
  })();

  const [isClosed, setIsClosed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  // --- CONTACT FORM STATE ---
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // --- NEW ARCADE GAME STATE ENTRIES ---
  const [gameMode, setGameMode] = useState<'paradox' | 'schrodinger' | 'sentience'>('paradox');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizBest, setQuizBest] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('Examine the logical prompt below and select a solution...');

  // Helper to get active questions for chosen mode
  const getActiveQuestion = (): Question => {
    const list = QUESTIONABLE_POOL.filter(q => q.mode === gameMode);
    return list[currentIdx % list.length];
  };

  const handleChoiceSelect = (idx: number) => {
    if (isAnswered) return;
    triggerHaptic();
    setSelectedChoice(idx);
  };

  const handleVerifyAnswer = () => {
    if (selectedChoice === null || isAnswered) return;
    triggerHaptic();
    setIsAnswered(true);

    const question = getActiveQuestion();
    if (selectedChoice === question.answerIdx) {
      const nextScore = quizScore + 1;
      setQuizScore(nextScore);
      setFeedbackMsg(question.wittySuccess);
      if (nextScore > quizBest) {
        setQuizBest(nextScore);
        try { localStorage.setItem(`arcade_${gameMode}_best`, String(nextScore)); } catch {}
      }
    } else {
      setQuizScore(0);
      setFeedbackMsg(question.wittyFailure);
    }
  };

  const handleNextQuestion = () => {
    triggerHaptic();
    setSelectedChoice(null);
    setIsAnswered(false);
    const list = QUESTIONABLE_POOL.filter(q => q.mode === gameMode);
    setCurrentIdx((prev) => (prev + 1) % list.length);
    setFeedbackMsg('Analyze the next questionable matrix state...');
  };

  // Load high scores on mount & when gameMode changes
  useEffect(() => {
    try {
      const bBest = localStorage.getItem(`arcade_${gameMode}_best`);
      if (bBest) {
        setQuizBest(Number(bBest));
      } else {
        setQuizBest(0);
      }
      // Reset position when category tab switches
      setCurrentIdx(0);
      setSelectedChoice(null);
      setIsAnswered(false);
      setQuizScore(0);
      setFeedbackMsg('Examine the logical prompt below and select a solution...');
    } catch (e) {
      // safe backup fallback
    }
  }, [gameMode]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (submissionError) setSubmissionError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('medium');
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    setSubmissionError(null);

    if (!formId) {
      // Direct, safe, immediate fallback using standard prefilled mailto email triggering
      // This is highly robust: if there's no custom Formspree key configured yet,
      // it launches the user's mail client directly with all message fields populated to rasuen27@gmail.com!
      setTimeout(() => {
        setLoading(false);
        setFormSubmitted(true);
        triggerHaptic('success');

        const subject = encodeURIComponent(`Portfolio Message from ${formData.name}`);
        const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
        const mailtoUrl = `mailto:rasuen27@gmail.com?subject=${subject}&body=${body}`;
        
        // Use standard window.location to trigger mail client securely without sandboxing blocks
        window.location.href = mailtoUrl;

        // Reset inputs after launching mail client fallback
        setTimeout(() => {
          setFormSubmitted(false);
          setFormData({ name: '', email: '', message: '' });
        }, 6000);
      }, 1000);
      return;
    }

    try {
      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `New portfolio inquiry from ${formData.name}`,
          _to: "rasuen27@gmail.com"
        })
      });

      setLoading(false);
      if (response.ok) {
        setFormSubmitted(true);
        triggerHaptic();

        // Clear success overlay after 6 seconds
        setTimeout(() => {
          setFormSubmitted(false);
          setFormData({ name: '', email: '', message: '' });
        }, 6000);
      } else {
        const data = await response.json();
        setSubmissionError(data.error || 'Failed to submit form to Formspree. Ensure your Formspree ID is valid.');
      }
    } catch (err: any) {
      setLoading(false);
      setSubmissionError('A network error occurred. Please check your connection or contact directly via rasuen27@gmail.com.');
      console.error('Submission error:', err);
    }
  };

  if (isClosed) {
    return (
      <section id="connect" className="py-24 relative overflow-hidden px-4 md:px-0">
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
            <p className="text-sm">Broadcast terminal window is closed.</p>
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
              Expand Broadcast Terminal
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="connect" className="py-24 relative overflow-hidden px-4 md:px-0">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-roman text-xs tracking-[0.2em] uppercase mb-4"
          >
            <Radio size={14} className="animate-pulse" />
            <span>Get In Touch</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.35, delay: 0.05, ease: 'easeOut' }}
            className={`text-3xl sm:text-4xl md:text-5.5xl font-roman tracking-wide ${
              isDark ? 'text-white' : 'text-black font-bold'
            }`}
          >
            Contact Me<span className="text-blue-600 dark:text-blue-400 font-bold">.</span>
          </motion.h2>
          <span className={`text-xs mt-3 block font-roman tracking-[0.1em] uppercase ${isDark ? 'text-zinc-400' : 'text-black font-semibold'}`}>
            Drop a message or inquire about collaborations
          </span>
        </div>

        {/* Modern Mainframe Window wrapping the dual contact/quiz deck */}
        <Tilt3D max={4} scale={1.005} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
            className={`rounded-3xl overflow-hidden shadow-xl transition-all duration-500 ${
              isDark 
                ? 'glass-panel-dark shadow-black/80' 
                : 'glass-panel-light shadow-zinc-200/20'
            }`}
          >
          {/* Mainframe Interface Header bar */}
          <div className={`relative flex items-center justify-between gap-2 px-4 sm:px-6 py-4 border-b select-none transition-all duration-350 ${
            isDark ? 'bg-[#18181b]/30 border-white/5' : 'bg-[#ffffff]/35 border-black/5'
          }`}>
            <WindowControls 
              onClose={() => { triggerHaptic(); setIsClosed(true); }}
              onMinimize={() => { triggerHaptic(); setIsMinimized(!isMinimized); }}
              onMaximize={() => { triggerHaptic(); setIsMinimized(false); }}
            />

            {/* Centered File Path Address */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <div className={`px-5 py-1.5 rounded-full font-mono text-[10px] sm:text-xs tracking-wider border transition-all duration-300 ${
                isDark 
                  ? 'bg-zinc-900/40 border-white/10 text-gray-400 hover:border-white/20' 
                  : 'bg-white/60 border-zinc-300/60 text-zinc-700 hover:border-zinc-400/80'
              }`}>
                /connect
              </div>
            </div>

            {/* Empty space to balance structural layout */}
            <div className="w-12 h-6" />
          </div>

          <motion.div
            animate={{ height: isMinimized ? '0px' : 'auto', opacity: isMinimized ? 0 : 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            {/* Dual Grid Layout: Left form, right terminal CS paradox game */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200/60 dark:divide-zinc-900">
              
              {/* Left Column Form */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between overflow-hidden relative"
              >
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 relative z-10">
              <h3 className={`text-xl sm:text-2xl font-roman tracking-wider mb-2 ${
                isDark ? 'text-white' : 'text-black font-bold'
              }`}>
                Send Inquiry
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className={`block text-[10px] font-roman uppercase tracking-[0.12em] mb-1.5 ${isDark ? 'text-zinc-300' : 'text-black font-semibold'}`}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="contact-name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Enter full name"
                    className={`w-full px-4 py-3 border rounded-2xl text-sm transition-all outline-none ${
                      isDark 
                        ? 'bg-zinc-950/60 border-white/5 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                        : 'bg-white border-zinc-200 text-black focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'
                    }`}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-[10px] font-roman uppercase tracking-[0.12em] mb-1.5 ${isDark ? 'text-zinc-300' : 'text-black font-semibold'}`}>
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="contact-email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="name@server.com"
                    className={`w-full px-4 py-3 border rounded-2xl text-sm transition-all outline-none ${
                      isDark 
                        ? 'bg-zinc-950/60 border-white/5 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                        : 'bg-white border-zinc-200 text-black focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className={`block text-[10px] font-roman uppercase tracking-[0.12em] mb-1.5 ${isDark ? 'text-zinc-300' : 'text-black font-semibold'}`}>
                  Inquiry Message Details
                </label>
                <textarea
                  name="message"
                  id="contact-message"
                  value={formData.message}
                  onChange={handleFormChange}
                  rows={4}
                  placeholder="Provide parameters about your project goals or timeline requirements..."
                  className={`w-full px-4 py-3 border rounded-2xl text-sm transition-all outline-none resize-none ${
                    isDark 
                      ? 'bg-zinc-950/60 border-white/5 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                      : 'bg-white border-zinc-200 text-black focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'
                  }`}
                  required
                />
              </div>

              {submissionError && (
                <div className="text-red-500 text-xs font-mono border border-red-500/10 bg-red-500/5 px-4 py-3 rounded-2xl animate-shake select-text">
                  ⚠️ {submissionError}
                </div>
              )}

              {/* Submit Capsule */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/30 disabled:text-zinc-500 text-white font-roman uppercase tracking-[0.15em] rounded-2xl text-xs cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {loading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Transmitting Signal...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Broadcast Message</span>
                  </>
                )}
              </button>
            </form>

            {/* Simulated success popup overlay */}
            <AnimatePresence>
              {formSubmitted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 backdrop-blur-md ${
                    isDark ? 'bg-zinc-950/95' : 'bg-white/95'
                  }`}
                >
                  <div className="h-14 w-14 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-500 mb-4 flex items-center justify-center animate-bounce">
                    ✓
                  </div>
                  <h4 className={`text-xl font-bold font-display mb-1 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    {formId ? 'Inquiry Sent!' : 'Email Prepared!'}
                  </h4>
                  <p className={`text-xs sm:text-sm mb-5 font-mono px-4 leading-relaxed ${isDark ? 'text-zinc-350' : 'text-zinc-650'}`}>
                    {formId 
                      ? 'Your inquiry parameters have been routed securely via background API to rasuen27@gmail.com. Expect a swift reply within 24 hours!'
                      : 'We have launched your standard email program with all fields pre-filled for rasuen27@gmail.com. Just click send in your mail app to finalize transmission!'}
                  </p>
                  <button
                    onClick={() => { triggerHaptic(); setFormSubmitted(false); }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all ${
                      isDark 
                        ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' 
                        : 'bg-black/5 hover:bg-black/10 border-black/5 text-gray-900'
                    }`}
                  >
                    Send another signal
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Column: Premium Interactive Mind Games Panel */}
          <motion.div
            id="interactive-logic-puzzles"
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col justify-between relative"
          >
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between gap-6">
              <div>
                {/* Clean, Elegant Header */}
                <div className="flex flex-col gap-1 mb-6 border-b border-zinc-200/60 dark:border-zinc-800/65 pb-4">
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400 font-bold">
                    Interactive Segment
                  </span>
                  <h3 className={`text-xl font-roman tracking-wide ${isDark ? 'text-zinc-100' : 'text-zinc-900 font-bold'}`}>
                    CS Logic Paradoxes
                  </h3>
                  <p className={`text-xs mt-1.5 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Test your intuition against theoretical boundaries and quantum state riddles.
                  </p>
                </div>

                {/* Mode Selector - Pristine, Uncluttered Pill Slots */}
                <div className={`grid grid-cols-3 gap-1.5 p-1 rounded-2xl border mb-6 ${
                  isDark ? 'bg-zinc-950/80 border-zinc-900' : 'bg-gray-100 border-gray-200'
                }`}>
                  {(['paradox', 'schrodinger', 'sentience'] as const).map((mode) => {
                    const isActive = gameMode === mode;
                    return (
                      <button
                        key={mode}
                        onClick={() => { triggerHaptic(); setGameMode(mode); }}
                        className="relative py-2 px-1 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer overflow-hidden outline-none"
                      >
                        {isActive && (
                          <motion.span
                            layoutId="activeGameTab"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            className="absolute inset-0 bg-blue-600 rounded-xl"
                          />
                        )}
                        <span className={`relative z-10 flex items-center justify-center gap-1 transition-colors ${
                          isActive 
                            ? 'text-white font-bold' 
                            : isDark 
                              ? 'text-zinc-400 hover:text-white' 
                              : 'text-zinc-650 hover:text-black font-medium'
                        }`}>
                          {mode === 'paradox' && 'Paradox'}
                          {mode === 'schrodinger' && 'Quantum'}
                          {mode === 'sentience' && 'Sentience'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Question Display Card */}
                <div className="mb-6 animate-fadeIn">
                  <div className={`p-4 rounded-2xl border ${
                    isDark ? 'bg-zinc-950/40 border-zinc-900/80' : 'bg-white border-zinc-200'
                  }`}>
                    <span className="text-[9px] font-mono font-bold tracking-widest text-blue-500 uppercase block mb-1.5">
                      {getActiveQuestion().title}
                    </span>
                    <h4 className={`text-xs sm:text-sm leading-relaxed font-sans ${
                      isDark ? 'text-zinc-200' : 'text-zinc-800 font-medium'
                    }`}>
                      {getActiveQuestion().question}
                    </h4>
                  </div>
                </div>

                {/* Interactive Choice list with beautiful circular letters */}
                <div className="space-y-2.5 mb-6">
                  {getActiveQuestion().choices.map((choice, idx) => {
                    const isSelected = selectedChoice === idx;
                    const isCorrect = idx === getActiveQuestion().answerIdx;

                    let cardClasses = '';
                    let badgeClasses = '';

                    if (isAnswered) {
                      if (isCorrect) {
                        cardClasses = isDark 
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                          : 'bg-emerald-50/50 border-emerald-305 text-emerald-950';
                        badgeClasses = 'bg-emerald-505 text-white border-emerald-400';
                      } else if (isSelected) {
                        cardClasses = isDark 
                          ? 'bg-rose-950/20 border-rose-500/40 text-rose-100 shadow-[0_0_15px_rgba(239,68,68,0.05)]' 
                          : 'bg-rose-50/50 border-rose-300 text-rose-950';
                        badgeClasses = 'bg-rose-500 text-white border-rose-400';
                      } else {
                        cardClasses = isDark 
                          ? 'bg-transparent border-zinc-900/60 text-zinc-600 opacity-40' 
                          : 'bg-transparent border-zinc-200/50 text-zinc-400 opacity-45';
                        badgeClasses = isDark ? 'bg-zinc-900 border-zinc-850 text-zinc-650' : 'bg-gray-100 text-zinc-400';
                      }
                    } else {
                      if (isSelected) {
                        cardClasses = isDark 
                          ? 'bg-blue-950/15 border-blue-500/70 text-blue-100 shadow-[0_0_15px_rgba(37,99,235,0.05)]' 
                          : 'bg-blue-50/40 border-blue-500 text-blue-950';
                        badgeClasses = 'bg-blue-600 text-white border-blue-500';
                      } else {
                        cardClasses = isDark 
                          ? 'bg-zinc-950/50 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/40 text-zinc-300' 
                          : 'bg-white border-zinc-200 hover:bg-zinc-50/50 text-zinc-700';
                        badgeClasses = isDark 
                          ? 'bg-zinc-900 border-zinc-850 text-zinc-400 group-hover:bg-zinc-800' 
                          : 'bg-gray-100 border-gray-200 text-zinc-500 group-hover:bg-gray-200/50';
                      }
                    }

                    return (
                      <motion.button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleChoiceSelect(idx)}
                        whileHover={!isAnswered ? { y: -1, x: 1 } : {}}
                        className={`w-full p-3 rounded-2xl border text-xs text-left transition-all duration-300 cursor-pointer flex items-center gap-3.5 group outline-none ${cardClasses}`}
                      >
                        <span className={`flex-shrink-0 w-6 h-6 rounded-xl border flex items-center justify-center font-mono font-bold text-[10px] transition-all duration-300 ${badgeClasses}`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-sans font-medium flex-1 leading-relaxed">{choice}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Feedback Block */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={feedbackMsg}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className={`p-4 rounded-2xl text-xs font-sans leading-relaxed border flex items-start gap-2.5 ${
                      isAnswered 
                        ? selectedChoice === getActiveQuestion().answerIdx
                          ? isDark 
                            ? 'bg-emerald-950/10 border-emerald-500/20 text-emerald-400 font-medium' 
                            : 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium'
                          : isDark 
                            ? 'bg-rose-950/10 border-rose-500/20 text-rose-450 font-medium' 
                            : 'bg-rose-50 border-rose-100 text-rose-900'
                        : isDark
                          ? 'bg-zinc-950/20 border-zinc-900 text-zinc-400'
                          : 'bg-zinc-100/40 border-zinc-200 text-zinc-650'
                    }`}
                  >
                    <span className="mt-0.5 font-bold shrink-0">
                      {isAnswered 
                        ? selectedChoice === getActiveQuestion().answerIdx ? '✓' : '✗' 
                        : '•'
                      }
                    </span>
                    <div className="flex-1 text-left">
                      {feedbackMsg}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Scoreboard block */}
                <div className={`mt-5 p-3.5 rounded-2xl border flex items-center justify-between text-[10px] font-mono uppercase tracking-widest ${
                  isDark 
                    ? 'bg-zinc-950/30 border-zinc-900/80 text-zinc-400' 
                    : 'bg-gray-100 border-zinc-200/70 text-zinc-600'
                }`}>
                  <div className="flex items-center gap-2">
                    <span>Quiz Streak:</span>
                    <span className="font-bold text-blue-500">{quizScore}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Personal Record:</span>
                    <span className="font-bold text-amber-500">⭐ {quizBest}</span>
                  </div>
                </div>
              </div>

              {/* Actions & Resets */}
              <div className="space-y-4">
                {!isAnswered ? (
                  <button
                    id="quiz-verify-action-btn"
                    onClick={handleVerifyAnswer}
                    disabled={selectedChoice === null}
                    className={`w-full py-4 font-mono font-bold uppercase tracking-wider rounded-2xl text-[11px] cursor-pointer shadow-md transition-all flex items-center justify-center gap-1.5 outline-none ${
                      selectedChoice === null
                        ? isDark
                          ? 'bg-[#18181b] border border-zinc-800 text-zinc-500 cursor-not-allowed'
                          : 'bg-[#e4e4e7] border border-zinc-300 text-zinc-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <span>Submit Logic Verification</span>
                  </button>
                ) : (
                  <button
                    id="quiz-next-action-btn"
                    onClick={handleNextQuestion}
                    className={`w-full py-4 font-mono font-bold uppercase tracking-wider rounded-2xl text-[11px] cursor-pointer shadow-md transition-all flex items-center justify-center gap-1.5 outline-none animate-pulse ${
                      isDark
                        ? 'bg-white hover:bg-zinc-100 text-zinc-950'
                        : 'bg-zinc-900 hover:bg-black text-white'
                    }`}
                  >
                    <span>Fetch Next Question</span>
                    <span className="text-sm">→</span>
                  </button>
                )}

                <div className="flex items-center justify-center pt-1">
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setQuizScore(0);
                      setSelectedChoice(null);
                      setIsAnswered(false);
                      setFeedbackMsg('Performance record and values have been cleared.');
                    }}
                    className={`text-[10px] font-mono uppercase tracking-widest hover:underline transition-all cursor-pointer ${
                      isDark ? 'text-zinc-500 hover:text-zinc-400' : 'text-zinc-400 hover:text-zinc-600'
                    }`}
                  >
                    Reset Performance
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </motion.div>
    </Tilt3D>

    </div>
  </section>
  );
}

function Loader2(props: any) {
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
