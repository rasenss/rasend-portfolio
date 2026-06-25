import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid, Code2, SquareTerminal, Wind, Server, Cloud, Cpu, Sparkles,
  Terminal, Shield, Layout, Database, Globe, Briefcase, TrendingUp,
  Award, ChevronRight, Check, Compass, BookOpen, Star, AlertCircle
} from 'lucide-react';
import { skills } from '../data';
import { WindowControls } from './WindowControls';

interface SkillsProps {
  isDark: boolean;
  triggerHaptic: () => void;
}

const skillBlueprints: {
  [key: string]: {
    subtitle: string;
    authority: string;
    role: string;
    summary: string;
    milestones: string[];
    focusArea: string;
  }
} = {
  "Red Hat Enterprise Linux": {
    subtitle: "Enterprise Infrastructure & Admin",
    authority: "Red Hat Academy Certified",
    role: "System Administrator",
    summary: "Comprehensive experience managing Enterprise Linux configurations, shell scripting, secure file permissions, process tracking, systemd daemon files, and network administration.",
    milestones: ["LVM Storage Configurations", "Systemd Services & Daemons", "User & Group Privilege Policies", "Secure Firewall Policies"],
    focusArea: "Deploying secure, high-uptime virtual hostings, managing enterprise-level security footprints, and designing shell automation scripts."
  },
  "AWS Cloud Foundations": {
    subtitle: "Resilient Multi-Tier Cloud Arch",
    authority: "AWS Academy Graduate",
    role: "Cloud Specialist",
    summary: "Equipped to design, migrate, and secure container and instance workloads across AWS. Skilled in VPC networks, security subnets, EC2 auto-scaling, RDS clusters, and IAM security controls.",
    milestones: ["Multi-AZ Subnet Partitioning", "IAM Security Governance", "EC2 Scaled Deployment", "S3 Storage Class Optimization"],
    focusArea: "Formulating reliable, fault-tolerant infrastructure maps on public cloud architectures to support modern continuous deployment flows."
  },
  "Cybersecurity & Incident Response": {
    subtitle: "Threat Defense & Forensic Logic",
    authority: "Security Blue Team Certified",
    role: "SOC Analyst",
    summary: "Skilled in analyzing packet dumps, vulnerability audits, threat intelligence tracking, alert management environments, and incident mitigation workflows.",
    milestones: ["Wireshark PCAP Investigation", "System Vulnerability Auditing", "Malware Threat Scenarios", "Incident Playbooks & Response"],
    focusArea: "Conducting proactive network defense audits and analyzing security postures to guarantee end-to-end data safety."
  },
  "Responsive Web Design": {
    subtitle: "Fluid Grid Interfaces & CSS3",
    authority: "freeCodeCamp Certified",
    role: "UI Engineer",
    summary: "Creating lightweight, mobile-first, fluid designs prioritizing visual consistency across viewports, semantic grids, and strict accessibility criteria.",
    milestones: ["Mobile-First Fluid Grids", "Flexbox & Grid Layouts", "W3C Semantic Standards", "Micro-Animations & Transitions"],
    focusArea: "Transforming design prototypes into elegant, fast-loading, responsive visual layouts that prioritize clean reading rhythm."
  },
  "JavaScript (ES6+)": {
    subtitle: "Vanilla Performance & Logic Flow",
    authority: "Dicoding Certified",
    role: "Core JavaScript Developer",
    summary: "Deep understanding of the V8 execution runtime: high-performance promise pipelines, asynchronous control flows, ES modules, and DOM rendering optimizations.",
    milestones: ["Async & Promise Pipelines", "ES6 Modules & Bindings", "Dynamic Array Processing", "Fetch API Integration"],
    focusArea: "Writing highly modular, performant client-side scripts and server logic with clean, modern vanilla JavaScript standards."
  },
  "SQL & Databases": {
    subtitle: "Relational Engines & Optimization",
    authority: "Dicoding Certified",
    role: "Database Administrator",
    summary: "Designing structured database schemas, multi-table joint optimizations, nested subqueries, cascading constraints, and transactional consistency rules.",
    milestones: ["Normalized Schema Planning", "High-Performance Table JOINs", "Structured Nested Queries", "Data Integrity Regulations"],
    focusArea: "Designing resilient relational database architectures and optimizing query parameters to maintain fast, safe database interactions."
  },
  "React.js Development": {
    subtitle: "Reactive Components & States",
    authority: "Scrimba Certified",
    role: "Frontend Developer",
    summary: "Building robust single-page applications. Proficient in customizable reactive states, functional hooks, memoization optimizations, and motion routing.",
    milestones: ["Custom Hook Refactoring", "Router State Transition Flows", "Framer Motion Animation", "Strict Virtual DOM Performance"],
    focusArea: "Developing intuitive web dashboards with fluid animations, dynamic data flows, and highly reusable React modular structures."
  },
  "Project Management": {
    subtitle: "Agile Lifecycles & Team Flow",
    authority: "Skill Academy Graduate",
    role: "Product Owner",
    summary: "Skilled in organizing agile sprint cycles, sorting critical backlog items, matching scrum velocities, and aligning project milestones with business targets.",
    milestones: ["Agile Sprint Planning", "Backlog Grooming & Priorities", "Scrum Team Synchronization", "Milestone Progress Tracking"],
    focusArea: "Facilitating clear, structured agile pipelines that empower technical teams to design and deploy features on schedule."
  },
  "IT Product Sales": {
    subtitle: "B2B Technology Consulting Pipelines",
    authority: "Tomoru Certified",
    role: "Account Executive",
    summary: "Specialist in consultative tech pitching, structuring active CRM customer leads, designing tailored vendor proposals, and client relationship retention.",
    milestones: ["Consultative Presentation Pitching", "CRM Funnel Operations", "B2B Proposal Structuring", "Client Retention Playbooks"],
    focusArea: "Aligning software-as-a-service or technical solutions with business needs through clear, professional value matching."
  },
  "AI Data Annotation & Evaluation": {
    subtitle: "LLM Alignment, RLHF & Core Dataset Quality",
    authority: "OneForma Remote Evaluator",
    role: "AI Annotation Specialist",
    summary: "Directly contributed to major global language model and conversational intelligence evaluation projects (specifically Lighthouse and Opal). Skilled in designing comprehensive textual annotations, prompt alignment reviews, semantic categorization, and comparative LLM response ranking.",
    milestones: ["Model Reinforcement (RLHF)", "Comparative Response Ranking", "Multi-Modal Curation & Alignment", "Deep Semantic Prompt Labeling"],
    focusArea: "Aligning next-generation large language models and multi-modal neural systems with strict guidelines on safety, truthfulness, and context accuracy."
  }
};

export default function Skills({ isDark, triggerHaptic }: SkillsProps) {
  const [selectedSkill, setSelectedSkill] = useState<string>("Red Hat Enterprise Linux");
  const [activeCategory, setActiveCategory] = useState<'all' | 'dev' | 'sys' | 'biz'>('all');
  const [isClosed, setIsClosed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Icon selector map
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    LayoutGrid,
    Code2,
    SquareTerminal,
    Wind,
    Server,
    Cloud,
    Terminal,
    Shield,
    Layout,
    Database,
    Globe,
    Briefcase,
    TrendingUp,
    Sparkles
  };

  // Category filter mechanism
  const filteredSkills = skills.filter(skill => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'dev') return skill.category === 'Development';
    if (activeCategory === 'sys') return ['Infrastructure', 'Cloud', 'Security'].includes(skill.category);
    if (activeCategory === 'biz') return ['Management', 'Business'].includes(skill.category);
    return true;
  });

  const activeBlueprint = skillBlueprints[selectedSkill] || {
    subtitle: "Adaptive Module Architecture",
    authority: "Standard Qualified",
    role: "Technical Specialist",
    summary: "Proven ability to solve specialized computer science challenges with highly secure, adaptable, and production-ready implementations.",
    milestones: ["Specialized Problem-Solving", "Continuous Delivery", "Agile Collaboration", "Quality Engineering"],
    focusArea: "Applying modular computer science fundamentals and modern standards to construct accessible and stable client environments."
  };

  const activeSkillObj = skills.find(s => s.name === selectedSkill) || skills[0];

  if (isClosed) {
    return (
      <section id="skills" className="py-24 relative overflow-hidden px-4 md:px-0">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[300px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-3xl border p-8 flex flex-col items-center justify-center text-center gap-5 transition-all duration-300 w-full max-w-sm ${
              isDark 
                ? 'bg-[#101015]/90 border-zinc-800 text-white shadow-xl' 
                : 'bg-zinc-100 border-zinc-200 text-gray-900 shadow-md'
            }`}
          >
            <div className="flex gap-1.5 items-center justify-center">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <span className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            </div>
            <p className="text-xs font-mono text-zinc-400">Skills section is closed.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { triggerHaptic(); setIsClosed(false); setIsMinimized(false); }}
              className={`px-5 py-2.5 rounded-full border text-[10px] font-mono tracking-wider uppercase font-bold transition-all duration-300 ${
                isDark 
                  ? 'bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800' 
                  : 'bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-50'
              }`}
            >
              Reopen Capabilities
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-24 relative overflow-hidden px-4 md:px-0">
      <div className="max-w-6xl mx-auto">
        
        {/* Modern, Editorial Section Header */}
        <div className="mb-14 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200/60 dark:border-zinc-805 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/15 font-mono text-xs font-bold tracking-wider uppercase mb-3">
              <Cpu size={12} />
              <span>Skills & Expertise</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-sans tracking-tight font-bold ${
              isDark ? 'text-white' : 'text-zinc-950 font-extrabold'
            }`}>
              My Skills & Capabilities
            </h2>
            <p className={`text-sm mt-3 max-w-xl leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Select a specialized domain card from my workforce stack to explore verified credentials, level of mastery, and core skill milestones.
            </p>
          </div>

          {/* Clean, minimalist Category Filter pill box */}
          <div className={`p-1 rounded-2xl border flex flex-wrap gap-1 md:self-end h-max max-w-max self-center ${
            isDark ? 'bg-zinc-950/80 border-zinc-900' : 'bg-zinc-100 border-zinc-200/60'
          }`}>
            {([
              { id: 'all', label: 'All Stack' },
              { id: 'dev', label: 'Development' },
              { id: 'sys', label: 'Systems & Cloud' },
              { id: 'biz', label: 'Business & PM' }
            ] as const).map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { triggerHaptic(); setActiveCategory(tab.id); }}
                  className="relative py-2 px-3.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer overflow-hidden outline-none"
                >
                  {isActive && (
                    <motion.span
                      layoutId="skillsCategoryPill"
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      className="absolute inset-0 bg-blue-605 text-white bg-blue-600 rounded-xl"
                    />
                  )}
                  <span className={`relative z-10 transition-colors ${
                    isActive 
                      ? 'text-white' 
                      : isDark 
                        ? 'text-zinc-400 hover:text-white' 
                        : 'text-zinc-550 hover:text-zinc-950'
                  }`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Dual Panel Deck with Mainframe Frame wrapping */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`rounded-3xl overflow-hidden shadow-xl transition-all duration-500 ${
            isDark 
              ? 'glass-panel-dark shadow-black/80' 
              : 'glass-panel-light shadow-zinc-200/20'
          }`}
        >
          {/* Mainframe Interface Header bar */}
          <div className={`flex items-center justify-between gap-2 px-4 sm:px-6 py-4 border-b select-none transition-all duration-350 ${
            isDark ? 'bg-[#18181b]/30 border-white/5' : 'bg-[#ffffff]/35 border-black/5'
          }`}>
            <WindowControls 
              onClose={() => { triggerHaptic(); setIsClosed(true); }}
              onMinimize={() => { triggerHaptic(); setIsMinimized(!isMinimized); }}
              onMaximize={() => { triggerHaptic(); setIsMinimized(false); }}
            />

            <div className={`px-4 py-1.5 rounded-xl font-mono text-[9px] sm:text-xs tracking-wider border select-all ${
              isDark 
                ? 'bg-zinc-900/60 border-zinc-800 text-zinc-400' 
                : 'bg-white border-zinc-150 text-zinc-650 shadow-sm'
            }`}>
              /skills/{selectedSkill.toLowerCase().replace(/\s+/g, '_')}
            </div>

            <div className="flex items-center gap-1.5" />
          </div>

          <motion.div
            animate={{ height: isMinimized ? '0px' : 'auto', opacity: isMinimized ? 0 : 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200/60 dark:divide-zinc-800/80">
              
              {/* Left Column: Skill Selector Node Stack (lg:col-span-5) */}
              <div className="lg:col-span-5 p-6 sm:p-8">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-450 dark:text-zinc-400 uppercase block mb-4 font-bold">
                    My Skills Registry ({filteredSkills.length})
                  </span>

                  {/* Dense list of items containing details */}
                  <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredSkills.map((skill) => {
                      const IconComponent = iconMap[skill.icon] || Code2;
                      const isSelected = selectedSkill === skill.name;
                      
                      let cardBg = '';
                      let iconBg = '';

                      if (isSelected) {
                        cardBg = isDark 
                          ? 'bg-blue-950/20 border-blue-500/50 shadow-lg shadow-blue-500/3 ring-1 ring-blue-500/20' 
                          : 'bg-blue-50/50 border-blue-300 shadow-md shadow-blue-500/2';
                        iconBg = 'bg-blue-600 text-white';
                      } else {
                        cardBg = isDark 
                          ? 'bg-zinc-950/20 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/10' 
                          : 'bg-white border-zinc-200 hover:bg-zinc-50/40 hover:border-zinc-300 shadow-sm';
                        iconBg = isDark ? 'bg-zinc-900 border border-zinc-800 text-zinc-400' : 'bg-zinc-100 border border-zinc-200 text-zinc-600';
                      }

                      return (
                        <motion.button
                          key={skill.name}
                          onClick={() => { triggerHaptic(); setSelectedSkill(skill.name); }}
                          whileHover={{ x: 3 }}
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          className={`w-full p-3.5 rounded-2xl border text-left flex items-center gap-4 transition-all duration-300 cursor-pointer outline-none ${cardBg}`}
                        >
                          {/* Circle Icon Frame */}
                          <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${iconBg}`}>
                            <IconComponent size={20} />
                          </div>

                          {/* Skill Info Block */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className={`font-sans font-semibold text-xs sm:text-sm truncate transition-colors ${
                                isSelected ? 'text-blue-650 dark:text-blue-400' : isDark ? 'text-zinc-200' : 'text-zinc-800'
                              }`}>
                                {skill.name}
                              </span>
                              <span className="font-mono text-xs font-bold text-blue-500 shrink-0">
                                {skill.level}%
                              </span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500 line-clamp-1">
                              {skill.description}
                            </p>
                          </div>

                          {/* Right caret or active circle */}
                          <div className="shrink-0 pl-1">
                            {isSelected ? (
                              <motion.div 
                                layoutId="activeSkillDot"
                                className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                              />
                            ) : (
                              <ChevronRight size={14} className="text-zinc-300 dark:text-zinc-700" />
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Deep Skill Analyzer & Highlights (lg:col-span-7) */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6 bg-gradient-to-br from-transparent to-blue-500/[0.015] dark:to-blue-500/[0.005]">
                <div className="flex flex-col h-full justify-between gap-6">
                  <div>
                    {/* Clean Skill Overview Header */}
                    <div className="mb-8 pb-6 border-b border-zinc-200/60 dark:border-zinc-800/80">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10">
                          {activeBlueprint.authority}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 italic">
                          {activeBlueprint.role}
                        </span>
                      </div>
                      <h3 className={`text-2xl font-bold tracking-tight mb-2 ${
                        isDark ? 'text-zinc-100' : 'text-zinc-900'
                      }`}>
                        {selectedSkill}
                      </h3>
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {activeBlueprint.summary}
                      </p>
                    </div>

                    {/* Selected Skill Milestones / Competencies list */}
                    <div className="mb-6">
                      <span className="text-[10px] font-mono tracking-[0.1em] text-zinc-405 uppercase block mb-3 font-semibold text-center sm:text-left">
                        Key Competencies & Milestones
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {activeBlueprint.milestones.map((milestone, idx) => (
                          <div 
                            key={idx}
                            className={`p-3 rounded-xl border flex items-center gap-2.5 text-[11px] font-sans transition-all duration-300 ${
                              isDark 
                                ? 'bg-[#0a0a10]/50 border-zinc-905 w-full hover:border-zinc-800' 
                                : 'bg-white shadow-sm border-zinc-200/60 w-full hover:bg-zinc-50/50 hover:border-zinc-350'
                            }`}
                          >
                            <div className="h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0">
                              <Check size={11} className="text-emerald-500" />
                            </div>
                            <span className={`font-medium truncate ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                              {milestone}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Practical Value & Real-World Application Panel */}
                  <div className={`p-5 rounded-2xl border flex gap-4 transition-all duration-300 ${
                    isDark 
                      ? 'bg-blue-950/5 border-blue-500/10' 
                      : 'bg-blue-50/20 border-blue-100'
                  }`}>
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                      <Award size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-xs font-mono uppercase tracking-wider mb-1.5 font-bold ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        My Skills Applied Focus
                      </h4>
                      <p className={`text-xs leading-relaxed transition-colors ${
                        isDark ? 'text-zinc-400' : 'text-zinc-600'
                      }`}>
                        My practical development and domain certification in <strong className={isDark ? 'text-zinc-200' : 'text-zinc-900'}>{selectedSkill}</strong> signifies a rigorous commitment to robust standards. I leverage this focus area to: <span className="italic">{activeBlueprint.focusArea}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Clean space */}
                <div className="pt-2 mt-2" />
              </div>

            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
