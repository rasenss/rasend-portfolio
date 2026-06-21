import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Linkedin, MapPin, Phone, Mail, ChevronDown, ChevronUp, GraduationCap, Briefcase, Award, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { personalInfo, timelineItems, certifications, skills } from '../data';
import { WindowControls } from './WindowControls';

interface ResumeProps {
  isDark: boolean;
  triggerHaptic: (style?: 'light' | 'medium' | 'heavy' | 'success' | 'error') => void;
}

export default function Resume({ isDark, triggerHaptic }: ResumeProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'education' | 'experience'>('all');
  const [expandedId, setExpandedId] = useState<string | null>("time_exp_1"); // Default expand the latest freelance job
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Filter keys matching navigation
  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'education', label: 'Education' },
    { key: 'experience', label: 'Experience' },
  ] as const;

  // Triggering visual CV download simulation
  const handleDownloadCV = () => {
    triggerHaptic('heavy');
    if (downloading) return;
    setDownloading(true);
    setDownloadSuccess(false);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Colors setup
      const primaryColor = [37, 99, 235]; // #2563eb
      const darkColor = [31, 41, 55]; // #1f2937
      const grayColor = [107, 114, 128]; // #6b7280

      doc.setFont('helvetica', 'normal');

      // Title & Header Name
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text(personalInfo.name, 20, 20);

      // Contact details row
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      const contactText = `Pacitan, East Java, Indonesia  |  ${personalInfo.email}  |  ${personalInfo.phone}`;
      doc.text(contactText, 20, 26);
      
      const linksText = `linkedin.com/in/rasendriya-khansa  |  rasend-site.vercel.app`;
      doc.text(linksText, 20, 31);

      // Draw horizontal separator
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.4);
      doc.line(20, 35, 190, 35);

      // Section: Education
      let y = 43;
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('Education', 20, y);

      y += 6;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('Siber Muhammadiyah University, Special Region of Yogyakarta, Indonesia', 20, y);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text('Undergraduate Student in Computer Science Major  |  2022 - 2026', 20, y + 5);

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('•  GPA: 3.51 out of 4.00', 22, y + 10);
      
      const courseText = '•  Coursework: Red Hat Academy Program Learner (2024), Blue Team Junior Analyst Training, AWS Academy Cloud Foundations Learner';
      const linesCourse = doc.splitTextToSize(courseText, 160);
      doc.text(linesCourse, 22, y + 14);

      // Section: Professional Experience
      y += 18 + (linesCourse.length * 4.5);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('Experience', 20, y);

      // Job 1: OneForma
      y += 6;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('OneForma, USA (Remote)', 20, y);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text('Data Annotator  |  April 2025 - Present', 20, y + 5);

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      
      const oneFormaBullets = [
        "Contributed directly to major language and artificial intelligence evaluation initiatives, specifically the Lighthouse and Opal projects.",
        "Executed high-quality text annotations, image annotation, and preference ranking evaluations to optimize machine learning models.",
        "Conducted thorough image curation and alignment reviews to ensure exact matches between visual and textual components.",
        "Collaborated strictly via formal written guidelines to secure premium accuracy and data quality standards."
      ];

      let bulletY = y + 10;
      oneFormaBullets.forEach(bullet => {
        const lines = doc.splitTextToSize(bullet, 160);
        doc.text('•', 22, bulletY);
        doc.text(lines, 26, bulletY);
        bulletY += (lines.length * 4.5) + 0.5;
      });

      // Job 2: Vriddhi Agency
      y = bulletY + 2;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('Vriddhi Agency, Malang, East Java, Indonesia', 20, y);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text('Administrative Intern (Remote)  |  February 2025 - April 2025', 20, y + 5);

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);

      const vriddhiBullets = [
        "Identified and investigated 10 or more target companies daily to update internal databases, highlighting prospects requiring web development solutions.",
        "Launched targeted email outreach campaigns utilizing promotional marketing content to pitch specialized web designs.",
        "Maintained pristine contact tracking archives and successfully finalized all assigned data management responsibilities inside strict 3-hour daily deadlines."
      ];

      bulletY = y + 10;
      vriddhiBullets.forEach(bullet => {
        const lines = doc.splitTextToSize(bullet, 160);
        doc.text('•', 22, bulletY);
        doc.text(lines, 26, bulletY);
        bulletY += (lines.length * 4.5) + 0.5;
      });

      // Move GAOTek, BTPN and items to Page 2
      doc.addPage();
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text(`${personalInfo.name}  |  Resume`, 20, 15);
      doc.line(20, 17, 190, 17);

      // Job 3: BTPN Syariah
      y = 25;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('BTPN Syariah, Pacitan, East Java, Indonesia', 20, y);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text('Co-Facilitator Intern (On-Site)  |  October 2024 - January 2025', 20, y + 5);

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);

      const btpnBullets = [
        "Empowered 10 or more small and medium enterprises through active workshops and practical field mentoring.",
        "Secured a 71.3/100 client competency rating across established performance benchmarks.",
        "Instructed local entrepreneurs in creative problem-solving, Microsoft Office applications, and digital educational frameworks.",
        "Earned an official internship credential celebrating impactful facilitation and dedicated community empowerment."
      ];

      bulletY = y + 10;
      btpnBullets.forEach(bullet => {
        const lines = doc.splitTextToSize(bullet, 160);
        doc.text('•', 22, bulletY);
        doc.text(lines, 26, bulletY);
        bulletY += (lines.length * 4.5) + 0.5;
      });

      // Job 4: GAOTek Inc
      y = bulletY + 2;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('GAOTek Inc, New York, USA', 20, y);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text('Digital Marketing Intern - Market Report Team (Remote)  |  April 2024 - August 2024', 20, y + 5);

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);

      const gaotekBullets = [
        "Conducted comprehensive search engine optimization-driven market research and structured data assets inside Microsoft Excel.",
        "Produced and delivered 15 or more exhaustive market intelligence reports on a monthly schedule.",
        "Participated actively in weekly video conferences to align marketing tactics and share regional analytical observations."
      ];

      bulletY = y + 10;
      gaotekBullets.forEach(bullet => {
        const lines = doc.splitTextToSize(bullet, 160);
        doc.text('•', 22, bulletY);
        doc.text(lines, 26, bulletY);
        bulletY += (lines.length * 4.5) + 0.5;
      });

      // Section: Certifications & Projects
      y = bulletY + 6;
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('Certifications & Technical Projects', 20, y);

      const projectsList = [
        {
          title: "UI UX Designer Mini Course (Job Connector), Luar Sekolah  |  2024",
          bullets: [
            "Completed an intensive training regimen resolving practical user experience design challenges.",
            "Gathered experience in user research, digital wireframing, and interactive prototyping via Figma.",
            "Partnered with team members to design user-centric interfaces for final capstone presentations."
          ]
        },
        {
          title: "Responsive Web Design Learner, freeCodeCamp  |  2024",
          bullets: [
            "Finished over 300 hours of academic study covering HTML, CSS, and fluid responsive design.",
            "Gained professional certification by building mobile-friendly web apps that elevate digital accessibility."
          ]
        },
        {
          title: "Data Series 11.0 and Product Series 3.0, Dibimbing.id  |  2024",
          bullets: [
            "Executed a technical data engineering project using SQL and Google BigQuery to evaluate taxi dataset.",
            "Created a functional restaurant menu ordering prototype application applying comprehensive research systems."
          ]
        },
        {
          title: "Comprehensive Coding Camp, Dicoding Indonesia  |  2024",
          bullets: [
            "Obtained core proficiency in foundational programming mechanics, database systems, and problem-solving.",
            "Acquired credentials in Front-End Web Development for Beginners and Basic Web Programming."
          ]
        }
      ];

      y += 6;
      projectsList.forEach(proj => {
        if (y > 255) {
          doc.addPage();
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
          doc.text(`${personalInfo.name}  |  Resume`, 20, 15);
          doc.line(20, 17, 190, 17);
          y = 25;
        }

        doc.setFontSize(10.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        const linesTitle = doc.splitTextToSize(proj.title, 160);
        doc.text(linesTitle, 20, y);
        y += (linesTitle.length * 4.5) + 1;

        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        proj.bullets.forEach(b => {
          const lines = doc.splitTextToSize(b, 160);
          doc.text('•', 22, y);
          doc.text(lines, 26, y);
          y += (lines.length * 4.5) + 0.5;
        });
        y += 2.5;
      });

      // Section: Skills & Interests
      if (y > 235) {
        doc.addPage();
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        doc.text(`${personalInfo.name}  |  Resume`, 20, 15);
        doc.line(20, 17, 190, 17);
        y = 25;
      }

      y += 3;
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('Skills & Interests', 20, y);

      y += 6;
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      
      doc.text('Languages:', 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text('Native fluency in Bahasa Indonesia, professional capability in English with strong written/spoken communication.', 40, y);

      y += 6.5;
      doc.setFont('helvetica', 'bold');
      doc.text('Technical:', 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text('Confident command of HTML5, CSS3, JavaScript. Advanced Figma design (user interfaces, wireframing, styling).', 40, y);

      y += 6.5;
      doc.setFont('helvetica', 'bold');
      doc.text('Soft Skills:', 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text('Articulate communication, supreme teamwork, structured problem solving, extreme agile adaptability.', 40, y);

      y += 6.5;
      doc.setFont('helvetica', 'bold');
      doc.text('Interests:', 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text('Data Analyst modeling, Agile Project Management, Social Impact coordination, and interactive Web Design.', 40, y);

      // Save document
      doc.save('Rasendriya_Khansa_Jolankarfyan_CV.pdf');

      setDownloading(false);
      setDownloadSuccess(true);
      triggerHaptic('success');

      // Clear successful alert after 4 seconds
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 4000);

    } catch (err) {
      console.error('Failed to generate real PDF Resume:', err);
      setDownloading(false);
    }
  };

  const toggleExpand = (id: string) => {
    triggerHaptic('light');
    setExpandedId(expandedId === id ? null : id);
  };

  // Compile timeline data based on dynamic selected tabs
  const getFilteredItems = () => {
    if (activeTab === 'all') {
      return timelineItems;
    }
    
    if (activeTab === 'education' || activeTab === 'experience') {
      return timelineItems.filter(item => item.category === activeTab);
    }

    return [];
  };

  const filteredItems = getFilteredItems();

  if (isClosed) {
    return (
      <section id="resume" className="py-24 relative overflow-hidden px-4 md:px-0">
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
            <p className="text-sm">Resume section is closed.</p>
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
              Open Resume
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="resume" className="py-24 relative overflow-hidden px-4 md:px-0">
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
            <Briefcase size={16} />
            <span>Experience & Education</span>
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
            Resume<span className="text-blue-500 font-extrabold gap-0">.</span>
          </motion.h2>
          <span className={`text-sm mt-1.5 block font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            My Professional Journey
          </span>
        </div>

        {/* macOS Style Window Frame around Resume contents */}
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
              /resume
            </div>

            {/* Secure Token representation */}
            <span className="text-[10px] font-mono tracking-widest text-[#2563eb]/60 font-bold hidden sm:inline" />
          </div>

          <motion.div
            animate={{ height: isMinimized ? '0px' : 'auto', opacity: isMinimized ? 0 : 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="p-6 sm:p-10">

        {/* Professional Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`rounded-3xl p-6 sm:p-10 mb-12 ${
            isDark ? 'glass-panel-dark' : 'glass-panel-light'
          }`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className={`text-xl sm:text-2xl font-bold font-display tracking-tight mb-2 ${
                isDark ? 'text-white' : 'text-gray-950'
              }`}>
                {personalInfo.name}
              </h3>
              <p className="text-blue-500 text-sm font-mono font-medium mb-5">
                {personalInfo.roleDescription}
              </p>

              {/* Dynamic details listing */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-blue-500 dark:text-blue-400" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{personalInfo.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-blue-500 dark:text-blue-400" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{personalInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-blue-500 dark:text-blue-400" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{personalInfo.email}</span>
                </div>
              </div>
            </div>

            {/* Action buttons (Download & Linkedin link) */}
            <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
              <button
                id="resume-download-btn"
                onClick={handleDownloadCV}
                disabled={downloading}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 cursor-pointer shadow-md shadow-blue-500/10 ${
                  downloading 
                    ? 'bg-blue-600/50 text-white cursor-wait' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white hover:-translate-y-0.5'
                }`}
              >
                {downloading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Download size={16} />
                )}
                <span>{downloading ? 'Preparing CV...' : 'Download CV'}</span>
              </button>

              <a
                href={personalInfo.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={triggerHaptic}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold transition-all border duration-300 hover:-translate-y-0.5 ${
                  isDark 
                    ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' 
                    : 'bg-black/5 hover:bg-black/10 border-black/5 text-gray-900'
                }`}
              >
                <Linkedin size={16} className="text-blue-500" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Simulated CV success alert */}
          <AnimatePresence>
            {downloadSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="p-4 rounded-xl flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-sm font-mono"
              >
                <CheckCircle2 size={18} className="shrink-0" />
                <span className="font-semibold">Success:</span>
                <span>Rasendriya_Khansa_Jolankarfyan_CV.pdf downloaded successfully!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tab Switcher - macOS Tahoe Segmented Control */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-10 w-full max-w-full"
        >
          <div className="w-full max-w-[500px] px-4 sm:px-0">
            <div className={`p-1 rounded-2xl flex flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-none shadow-sm border ${
              isDark 
                ? 'bg-[#0b0c10] border-white/5 shadow-black/40' 
                : 'bg-zinc-100 border-zinc-200/80 shadow-zinc-200/30'
            }`}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  id={`tab-link-${tab.key}`}
                  onClick={() => { triggerHaptic('medium'); setActiveTab(tab.key); }}
                  className={`relative flex-1 shrink-0 px-4 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all duration-300 select-none cursor-pointer whitespace-nowrap text-center ${
                    activeTab === tab.key
                      ? isDark ? 'text-white' : 'text-zinc-900'
                      : isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-950'
                  }`}
                >
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="activeTabOutline"
                      className={`absolute inset-0 rounded-xl border z-0 ${
                        isDark 
                          ? 'bg-zinc-800 border-white/10 shadow-sm' 
                          : 'bg-white border-zinc-200/50 shadow-sm'
                      }`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Interactive Timeline layout */}
        <div className="relative border-l-2 border-dashed border-blue-500/30 ml-4 sm:ml-8 pl-8 sm:pl-12 flex flex-col gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              const isExpanded = expandedId === item.id;
              const isEdu = item.category === 'education';

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ 
                    opacity: { duration: 0.2 },
                    x: { duration: 0.2 },
                    layout: { type: 'spring', stiffness: 500, damping: 45 }
                  }}
                  exit={{ opacity: 0, x: 30 }}
                  layout
                  className="relative group"
                >
                  {/* Timeline bullet nodes */}
                  <div className={`absolute -left-[45px] sm:-left-[61px] top-4 h-8 w-8 rounded-full border-4 flex items-center justify-center transition-all duration-300 z-10 ${
                    isExpanded 
                      ? 'bg-blue-500 border-blue-500 text-white shadow-lg ring-4 ring-blue-500/15' 
                      : isDark 
                        ? 'bg-gray-950 border-gray-900 text-blue-400 group-hover:border-blue-500/40' 
                        : 'bg-white border-gray-200 text-blue-600 group-hover:border-blue-500/30'
                  }`}>
                    {isEdu ? <GraduationCap size={12} /> : <Briefcase size={12} />}
                  </div>

                  {/* Segment Content Card */}
                  <div
                    onClick={() => toggleExpand(item.id)}
                    className={`rounded-3xl p-6 transition-[background-color,border-color,box-shadow] duration-200 border cursor-pointer select-none ${
                      isExpanded
                        ? isDark 
                          ? 'bg-white/[0.03] border-blue-500/30 shadow-xl' 
                          : 'bg-black/[0.02] border-blue-500/20 shadow-lg'
                        : isDark
                          ? 'glass-panel-dark hover:border-white/10'
                          : 'glass-panel-light hover:border-black/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        {/* Milestone header info */}
                        <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                          <span className="text-blue-500 font-semibold font-mono text-xs sm:text-sm">
                            {item.organization}
                          </span>
                          <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>•</span>
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            isDark ? 'bg-white/5 text-gray-400' : 'bg-black/5 text-gray-600'
                          }`}>
                            {item.duration}
                          </span>
                        </div>

                        <h3 className={`text-lg sm:text-[1.3rem] font-bold font-display tracking-tight mb-2 transition-colors ${
                          isExpanded ? 'text-blue-500' : isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.title}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs font-mono text-gray-500">
                          <MapPin size={12} />
                          <span>{item.location}</span>
                        </div>
                      </div>

                      {/* Expand / Collapsible Arrow toggle widget */}
                      <button
                        className={`p-2 rounded-xl border transition-all ${
                          isDark 
                            ? 'bg-white/5 border-white/10 text-gray-300' 
                            : 'bg-black/5 border-black/5 text-gray-600'
                        }`}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>

                    <p className={`text-sm leading-relaxed mt-4 transition-colors duration-200 ${
                      isExpanded ? (isDark ? 'text-gray-300' : 'text-gray-700') : (isDark ? 'text-gray-400 line-clamp-1' : 'text-gray-600 line-clamp-1')
                    }`}>
                      {item.description}
                    </p>

                    {/* Smooth expansion drawer for deep details */}
                    <AnimatePresence>
                      {isExpanded && item.details && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          className="overflow-hidden border-t border-white/[0.05] dark:border-black/[0.05] mt-4 pt-4"
                        >
                          <span className={`text-[10px] font-mono block uppercase mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            Highlighted Accomplishments
                          </span>
                          <ul className="flex flex-col gap-2 font-sans text-sm pl-1">
                            {item.details.map((detail, dIdx) => (
                              <li key={dIdx} className="flex items-start gap-2">
                                <span className="text-blue-500 select-none mt-1 shrink-0">•</span>
                                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        </div>
        </motion.div>
      </motion.div>

      </div>
    </section>
  );
}
