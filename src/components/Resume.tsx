import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Linkedin, MapPin, Phone, Mail, ChevronDown, ChevronUp, GraduationCap, Briefcase, Award, CheckCircle2, Loader2, Sparkles, FileText, ExternalLink } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { personalInfo, timelineItems, certifications, skills } from '../data';
import { WindowControls } from './WindowControls';
import { Tilt3D } from './Tilt3D';

interface ResumeProps {
  isDark: boolean;
  triggerHaptic: (style?: 'light' | 'medium' | 'heavy' | 'success' | 'error') => void;
}

export default function Resume({ isDark, triggerHaptic }: ResumeProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'education' | 'experience'>('all');
  const [selectedItem, setSelectedItem] = useState<typeof timelineItems[0] | null>(null);
  const [selectedId, setSelectedId] = useState<string>("time_edu_1");
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
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
            className={`rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 mb-6 ${
              isDark 
                ? 'glass-panel-dark shadow-black/80 border border-white/10' 
                : 'glass-panel-light shadow-zinc-200/50 border border-zinc-200'
            }`}
          >
            {/* Window Upper Navigation TitleBar (matches your reference image exactly) */}
            <div className={`relative flex items-center justify-between px-6 py-4 border-b select-none transition-all duration-300 ${
              isDark ? 'bg-zinc-950/60 border-white/5' : 'bg-white/60 border-black/5'
            }`}>
              {/* Left side macOS Window Dots */}
              <WindowControls 
                onClose={() => { triggerHaptic(); setIsClosed(true); }}
                onMinimize={() => { triggerHaptic(); setIsMinimized(!isMinimized); }}
                onMaximize={() => { triggerHaptic(); setIsMinimized(false); }}
              />

              {/* Centered custom styled route pill precisely like your reference image */}
              <div className="absolute left-1/2 -translate-x-1/2">
                <div className={`px-5 py-1.5 rounded-full font-mono text-xs tracking-wider border transition-all duration-300 ${
                  isDark 
                    ? 'bg-zinc-900/40 border-white/10 text-gray-400 hover:border-white/20' 
                    : 'bg-white/60 border-zinc-300/60 text-zinc-700 hover:border-zinc-400/80'
                }`}>
                  /resume
                </div>
              </div>

              {/* Empty placeholder on the right side to keep structural symmetry */}
              <div className="w-12 h-6" />
            </div>

            <motion.div
              animate={{ height: isMinimized ? '0px' : 'auto', opacity: isMinimized ? 0 : 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="p-6 sm:p-10">

                {/* Professional Contact Card Banner */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`rounded-3xl p-6 sm:p-8 mb-10 ${
                    isDark ? 'bg-[#121318]/40 border border-white/[0.04]' : 'bg-white/40 border border-black/[0.04]'
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                      <h3 className={`text-xl sm:text-2xl font-bold font-display tracking-tight mb-2 ${
                        isDark ? 'text-white' : 'text-zinc-950'
                      }`}>
                        {personalInfo.name}
                      </h3>
                      <p className="text-blue-500 text-sm font-mono font-medium mb-4">
                        {personalInfo.roleDescription}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-blue-500" />
                          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{personalInfo.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-blue-500" />
                          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{personalInfo.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-blue-500" />
                          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{personalInfo.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Access Buttons */}
                    <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                      <a
                        id="resume-download-btn"
                        href="https://docs.google.com/document/d/1jFgRKWyeisAu92_FXd-f4d6Rj4rPX0C65yteQyZsAfA/edit?usp=drive_link"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => triggerHaptic('heavy')}
                        className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer shadow-md shadow-blue-500/10 bg-blue-500 hover:bg-blue-600 text-white hover:-translate-y-0.5"
                      >
                        <FileText size={14} />
                        <span>View Document CV</span>
                        <ExternalLink size={11} className="opacity-70" />
                      </a>

                      <a
                        href={personalInfo.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => triggerHaptic('light')}
                        className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold border duration-300 hover:-translate-y-0.5 ${
                          isDark 
                            ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' 
                            : 'bg-black/5 hover:bg-black/10 border-black/5 text-gray-900'
                        }`}
                      >
                        <Linkedin size={14} className="text-blue-500" />
                        <span>LinkedIn</span>
                      </a>
                    </div>
                  </div>
                </motion.div>

                {/* Tab Switcher / Segmented Filter */}
                <div className="flex justify-center mb-8">
                  <div className="w-full max-w-[450px]">
                    <div className={`p-1 rounded-2xl flex border ${
                      isDark 
                        ? 'bg-[#0b0c10] border-white/5 shadow-black/40' 
                        : 'bg-zinc-100 border-zinc-200/80 shadow-zinc-200/30'
                    }`}>
                      {tabs.map((tab) => (
                        <button
                          key={tab.key}
                          id={`tab-link-${tab.key}`}
                          onClick={() => { triggerHaptic('medium'); setActiveTab(tab.key); }}
                          className={`relative flex-1 px-3 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 select-none cursor-pointer text-center ${
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
                </div>

                {/* Main Split workspace (Desktop/Tablet) and Stacking List (Mobile) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 min-h-[480px]">
                  
                  {/* Left Column: Explorer Entry List (5 cols) */}
                  <div className="col-span-1 md:col-span-5 flex flex-col gap-3">
                    <div className={`text-[10px] font-mono font-bold uppercase tracking-wider mb-2 pl-2 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      Timeline entries ({filteredItems.length})
                    </div>
                    
                    <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                      {filteredItems.map((item) => {
                        const isEdu = item.category === 'education';
                        // Matches either desktop split active selection, or fallback
                        const isDesktopSelected = selectedId === item.id;
                        
                        return (
                          <motion.div
                            key={item.id}
                            onClick={() => {
                              triggerHaptic('light');
                              setSelectedId(item.id);
                              // On mobile screens, also open the full-screen details drawer overlay
                              if (window.innerWidth < 768) {
                                setSelectedItem(item);
                              }
                            }}
                            className={`group relative rounded-2xl p-4 border cursor-pointer select-none transition-all duration-200 ${
                              isDesktopSelected
                                ? isDark
                                  ? 'bg-blue-500/10 border-blue-500/40 shadow-sm shadow-blue-500/[0.02]'
                                  : 'bg-blue-500/5 border-blue-500/20 shadow-sm shadow-blue-500/[0.01]'
                                : isDark
                                  ? 'bg-zinc-900/30 border-white/[0.04] hover:bg-zinc-900/55 hover:border-white/10'
                                  : 'bg-white/40 border-black/[0.04] hover:bg-white/70 hover:border-black/10'
                            }`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            {/* Blue Glowing Indicator Bar on left for active item */}
                            {isDesktopSelected && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-500 rounded-r-full shadow-md shadow-blue-500/50" />
                            )}

                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                                isDesktopSelected
                                  ? 'bg-blue-500 text-white'
                                  : isDark
                                    ? 'bg-zinc-800 text-blue-400 group-hover:bg-zinc-700/80'
                                    : 'bg-zinc-100 text-blue-600 group-hover:bg-zinc-200/80'
                              }`}>
                                {isEdu ? <GraduationCap size={15} /> : <Briefcase size={15} />}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className={`text-[10px] font-mono font-bold truncate ${
                                    isDesktopSelected ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'
                                  }`}>
                                    {item.organization}
                                  </span>
                                  <span className="text-[9px] font-mono shrink-0 text-gray-400 dark:text-gray-500">
                                    {item.duration}
                                  </span>
                                </div>

                                <h4 className={`text-sm font-bold font-display tracking-tight transition-colors truncate ${
                                  isDesktopSelected ? 'text-blue-500' : isDark ? 'text-white' : 'text-zinc-900'
                                }`}>
                                  {item.title}
                                </h4>

                                <p className={`text-xs mt-1.5 line-clamp-1 ${
                                  isDark ? 'text-gray-400/80' : 'text-gray-500'
                                }`}>
                                  {item.description}
                                </p>
                              </div>
                            </div>

                            {/* Small trigger details badge on mobile */}
                            <div className="mt-2 flex md:hidden items-center justify-end gap-1 text-[10px] font-mono text-blue-500/80 font-semibold uppercase">
                              <span>Quick Look</span>
                              <ExternalLink size={10} />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Desktop Interactive Details Previewer (7 cols, hidden on small screens) */}
                  <div className="hidden md:flex md:col-span-7 flex-col h-full">
                    <div className={`text-[10px] font-mono font-bold uppercase tracking-wider mb-2 pl-2 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      Interactive Workspace Preview
                    </div>

                    {/* Find active selected entry */}
                    {(() => {
                      const activeItem = filteredItems.find(item => item.id === selectedId) || filteredItems[0] || timelineItems[0];
                      if (!activeItem) return null;

                      return (
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeItem.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className={`flex-1 rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 ${
                              isDark
                                ? 'bg-[#101014]/40 border-white/[0.04] shadow-inner shadow-black/30'
                                : 'bg-white/40 border-black/[0.04] shadow-inner'
                            }`}
                          >
                            <div>
                              {/* Header Title Information */}
                              <div className="flex items-start gap-4 mb-6">
                                <div className={`p-3.5 rounded-2xl shrink-0 ${
                                  isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-500/5 text-blue-600'
                                }`}>
                                  {activeItem.category === 'education' ? <GraduationCap size={28} /> : <Briefcase size={28} />}
                                </div>

                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-blue-500 font-bold font-mono text-sm">
                                      {activeItem.organization}
                                    </span>
                                    <span className="text-gray-400 dark:text-gray-500">•</span>
                                    <span className={`text-[11px] font-semibold font-mono px-2.5 py-0.5 rounded-full ${
                                      isDark ? 'bg-white/5 text-gray-400' : 'bg-black/5 text-gray-600'
                                    }`}>
                                      {activeItem.duration}
                                    </span>
                                  </div>

                                  <h3 className={`text-lg sm:text-xl font-bold font-display tracking-tight ${
                                    isDark ? 'text-white' : 'text-zinc-900'
                                  }`}>
                                    {activeItem.title}
                                  </h3>

                                  <div className="flex items-center gap-1.5 text-xs font-mono text-gray-500 dark:text-gray-400 mt-2">
                                    <MapPin size={12} className="text-blue-500/80" />
                                    <span>{activeItem.location}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Description body */}
                              <p className={`text-sm leading-relaxed mb-6 border-b pb-6 ${
                                isDark ? 'text-gray-300 border-white/[0.05]' : 'text-gray-600 border-black/[0.05]'
                              }`}>
                                {activeItem.description}
                              </p>

                              {/* Accomodation Details list */}
                              {activeItem.details && activeItem.details.length > 0 && (
                                <div className="space-y-3">
                                  <span className={`text-[10px] font-mono block uppercase tracking-wider ${
                                    isDark ? 'text-gray-500' : 'text-gray-400'
                                  }`}>
                                    Highlighted Accomplishments
                                  </span>
                                  <ul className="flex flex-col gap-3 font-sans text-xs sm:text-sm">
                                    {activeItem.details.map((detail, dIdx) => (
                                      <li key={dIdx} className="flex items-start gap-2.5 leading-relaxed">
                                        <span className="text-blue-500 select-none mt-1 shrink-0">•</span>
                                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{detail}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            {/* Panel bottom status bar */}
                            <div className="mt-8 pt-4 border-t border-dashed border-zinc-500/15 flex items-center justify-between text-[10px] font-mono text-gray-400 dark:text-gray-500">
                              <span>Path: /resume/{activeItem.id}</span>
                              <span className="text-blue-500/80">Interactive Workspace Active</span>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      );
                    })()}
                  </div>

                </div>

              </div>
            </motion.div>
          </motion.div>
        </div>

      </div>

      {/* macOS Quick Look Detail Modal Overlay (Mobile fallback - Optimized to run ultra lag-free without expensive filters) */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            {/* Dark background screen overlay (No backdrop-blur to secure solid high 60/120fps) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/80"
            />

            {/* Window Container */}
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              className={`relative w-full max-w-xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border ${
                isDark 
                  ? 'bg-[#0f0f12] border-white/10 text-white' 
                  : 'bg-white border-zinc-200 text-zinc-900'
              }`}
            >
              {/* macOS Window TitleBar */}
              <div className={`flex items-center justify-between px-6 py-4 border-b select-none ${
                isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-gray-50/50 border-black/5'
              }`}>
                {/* Dots */}
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => { triggerHaptic('light'); setSelectedItem(null); }}
                    className="h-3 w-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 flex items-center justify-center text-[8px] text-red-900 font-bold"
                  >
                    ×
                  </button>
                  <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                </div>
                
                <span className="text-[10px] font-mono tracking-wider text-gray-500 dark:text-gray-400">
                  Quick Look — {selectedItem.organization}
                </span>

                <div className="w-12" />
              </div>

              {/* Modal Body Scroll Container */}
              <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-start gap-4 mb-5">
                  <div className={`p-3 rounded-xl shrink-0 ${
                    isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-500/5 text-blue-600'
                  }`}>
                    {selectedItem.category === 'education' ? <GraduationCap size={24} /> : <Briefcase size={24} />}
                  </div>
                  <div className="min-w-0">
                    <span className="text-blue-500 font-bold font-mono text-xs">
                      {selectedItem.organization}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold font-display tracking-tight">
                      {selectedItem.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 mt-1">
                      <MapPin size={10} />
                      <span>{selectedItem.location}</span>
                    </div>
                  </div>
                </div>

                {/* Description block */}
                <p className={`text-xs leading-relaxed mb-5 border-b pb-4 ${
                  isDark ? 'text-gray-300 border-white/[0.05]' : 'text-gray-700 border-black/[0.05]'
                }`}>
                  {selectedItem.description}
                </p>

                {/* Highlighted Accomplishments details list */}
                {selectedItem.details && selectedItem.details.length > 0 && (
                  <div className="space-y-2">
                    <span className={`text-[10px] font-mono block uppercase tracking-wider ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      Highlighted Accomplishments
                    </span>
                    <ul className="flex flex-col gap-2.5 font-sans text-xs">
                      {selectedItem.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2">
                          <span className="text-blue-500 select-none mt-1 shrink-0">•</span>
                          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer Panel */}
              <div className={`px-6 py-4 flex justify-end border-t ${
                isDark ? 'bg-zinc-900/30 border-white/5' : 'bg-gray-50/30 border-black/5'
              }`}>
                <button
                  onClick={() => { triggerHaptic('light'); setSelectedItem(null); }}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-semibold font-mono tracking-wider uppercase transition-all duration-300 border ${
                    isDark 
                      ? 'bg-zinc-900 border-white/10 text-white hover:bg-zinc-800' 
                      : 'bg-white border-zinc-200 text-zinc-800 hover:bg-gray-50'
                  }`}
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
