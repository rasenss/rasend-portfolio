import { Project, Certification, TimelineItem, SkillItem } from './types';

export const personalInfo = {
  name: "Rasendriya Khansa Jolankarfyan",
  title: "AI Data Annotator | Student College | Designer & Developer",
  email: "rasuen27@gmail.com",
  phone: "+62 881 0261 38014",
  location: "Pacitan, East Java, Indonesia",
  roleDescription: "Computer Science Student | AI Data Annotator | UI/UX Designer",
  bio: "I am a Computer Science undergraduate student working as an AI Data Annotator. I have a deep passion for web design, programming, and UI/UX design. In my role as an AI Data Annotator, I focus on dataset quality, precision labeling, and performance evaluation to support modern AI applications. I combine my experiences in computer science, interactive design, and structured workflows to build user-friendly, clean, and highly functional digital portfolios.",
  quote: "“Imagination is more important than knowledge. For knowledge is limited to all we now know and understand, while imagination embraces the entire world, and all there ever will be to know and understand.” ― Albert Einstein",
  socials: {
    linkedin: "https://www.linkedin.com/in/rasendriya-khansa/",
    github: "https://github.com/rasenss",
    discord: "https://discord.com/users/_.rasend",
    instagram: "https://www.instagram.com/rasendkhansa",
    email: "mailto:rasuen27@gmail.com"
  }
};

export const skills: SkillItem[] = [
  {
    name: "Red Hat Enterprise Linux",
    category: "Infrastructure",
    description: "Red Hat Academy Program graduate skilled in Linux administration, storage partitioning, user permissions, and bash automation.",
    icon: "Terminal",
    level: 82
  },
  {
    name: "AWS Cloud Foundations",
    category: "Cloud",
    description: "AWS Academy certified Cloud Foundations specialist capable of managing core services, scaling EC2 instances, and securing VPC configurations.",
    icon: "Cloud",
    level: 85
  },
  {
    name: "Cybersecurity & Incident Response",
    category: "Security",
    description: "Security Blue Team training in junior analysis, threat intelligence, log forensics, vulnerability scanning, and alert triaging.",
    icon: "Shield",
    level: 78
  },
  {
    name: "Responsive Web Design",
    category: "Development",
    description: "freeCodeCamp and Dicoding certified in HTML5, CSS3, Flexbox/Grid layouts, custom media queries, and semantic accessibility standards.",
    icon: "Layout",
    level: 92
  },
  {
    name: "JavaScript (ES6+)",
    category: "Development",
    description: "Dicoding certified in advanced vanilla JS patterns, functional logic, DOM manipulation, asynchronous fetching, and web APIs.",
    icon: "Code2",
    level: 88
  },
  {
    name: "SQL & Databases",
    category: "Development",
    description: "Dicoding certified in database administration, writing high-performance SQL queries, multi-table joins, aggregates, and database schemas.",
    icon: "Database",
    level: 85
  },
  {
    name: "React.js Development",
    category: "Development",
    description: "Scrimba certified React developer skilled in hooks, state synchronization, interactive routes, and responsive UI components.",
    icon: "Globe",
    level: 83
  },
  {
    name: "AI Data Annotation & Evaluation",
    category: "Development",
    description: "Experienced in performing highly accurate text & image annotations, data categorization, and user preference evaluations to ensure dataset quality and accuracy.",
    icon: "Sparkles",
    level: 90
  },
  {
    name: "Project Management",
    category: "Management",
    description: "Skill Academy certified in foundational Agile/Scrum project methodologies, stakeholder collaboration, and backlog prioritization.",
    icon: "Briefcase",
    level: 80
  },
  {
    name: "IT Product Sales",
    category: "Business",
    description: "Tomoru certified in IT solutions consulting, client success modeling, product-led sales architectures, and conversational systems.",
    icon: "TrendingUp",
    level: 84
  }
];

export const certifications: Certification[] = [
  {
    id: "cert_aws",
    title: "AWS Academy Graduate - AWS Academy Cloud Foundations",
    organization: "Amazon Web Services (AWS)",
    year: "2025",
    badges: ["AWS Cloud Foundations", "Core Services", "Cloud Security"],
    credentialId: "AWS-ACAD-FOUNDATIONS-419",
    credentialUrl: "https://www.credly.com/org/amazon-web-services",
    description: "Validates technical understanding of core AWS services (EC2, S3, RDS, IAM, VPC), billing architectures, global infrastructures, and foundational AWS security compliance frameworks.",
    imageUrl: "/certifications/img/AWS_Academy_Graduate___AWS_Academy_Cloud_Foundations_Badge.png",
    pdfUrl: "/certifications/AWS_Academy_Graduate___AWS_Academy_Cloud_Foundations_Badge20250508-27-6tn2kv.pdf"
  },
  {
    id: "cert_bestofnext",
    title: "Best Of Next'25",
    organization: "Google Cloud Asia Pacific",
    year: "2025",
    badges: ["Google Cloud", "Next-Gen Tech", "Cloud Innovation"],
    credentialId: "GCP-NEXT25-BEST",
    credentialUrl: "https://cloud.google.com/",
    description: "Awarded for active involvement, hands-on learning, and successful mastery of emerging generative AI models, deep analytic databases, and modern serverless ecosystems showcased in Google Cloud Next '25 series.",
    imageUrl: "/certifications/img/Best Of Next'25.png",
    pdfUrl: "/certifications/Best Of Next'25.pdf"
  },
  {
    id: "cert_blueteam",
    title: "Blue Team Junior Analyst Pathway",
    organization: "Security Blue Team",
    year: "2024",
    badges: ["Threat Detection", "Incident Response", "Security Monitoring"],
    credentialId: "SBT-JUNIOR-2024",
    credentialUrl: "https://securityblue.team/verify",
    description: "Comprehensive training in network defense mechanisms, log file analysis, computer forensics, and incident management cycles, enabling swift detection, triage, and threat mitigation.",
    imageUrl: "/certifications/img/Blue Team Junior Analyst Pathway.png",
    pdfUrl: "/certifications/Blue Team Junior Analyst Pathway.pdf"
  },
  {
    id: "cert_cloud_tech",
    title: "Cloud Technical Series",
    organization: "Google Cloud Asia Pacific",
    year: "2024",
    badges: ["Cloud Computing", "Infrastructure", "Modernization"],
    credentialId: "GCP-CTS-880",
    credentialUrl: "https://cloud.google.com/",
    description: "Deep dive into production deployment workflows, containerized microservices architectures, cloud identity/access management, and secure virtual networks orchestration.",
    imageUrl: "/certifications/img/Cloud Technical Series.png",
    pdfUrl: "/certifications/Cloud Technical Series.pdf"
  },
  {
    id: "cert_frontend_beginners",
    title: "Front-End Web Development for Beginners",
    organization: "freeCodeCamp",
    year: "2023",
    badges: ["HTML5", "CSS3", "Web Layouts"],
    credentialId: "FCC-FE-DEV-BEG",
    credentialUrl: "https://www.freecodecamp.org/",
    description: "Focuses on build blocks of the modern web, layout guidelines, style structures, standard responsive design patterns, and cross-browser alignment troubleshooting.",
    imageUrl: "/certifications/img/Front-End Web Development for Beginners.png",
    pdfUrl: "/certifications/Front-End Web Development for Beginners.pdf"
  },
  {
    id: "cert_start_prog",
    title: "Getting Started with Basic Programming to Become a Software Developer",
    organization: "Dicoding Indonesia",
    year: "2023",
    badges: ["Programming Basics", "Logic Patterns", "Computer Science"],
    credentialId: "MSFT-CODE-FOUND",
    credentialUrl: "https://learn.microsoft.com/",
    description: "Introduction to logical development design, standard data architectures, loop controls, standard programmatic procedures, code reusability strategies, and general SDLC lifecycles.",
    imageUrl: "/certifications/img/Getting Started with Basic Programming to Become a Software Developer.png",
    pdfUrl: "/certifications/Getting Started with Basic Programming to Become a Software Developer.pdf"
  },
  {
    id: "cert_it_sales",
    title: "IT Product Sales Specialist in B2b",
    organization: "Tomoru",
    year: "2024",
    badges: ["B2B Sales", "IT Products", "Client Consulting"],
    credentialId: "B2B-IT-SPLST-99",
    credentialUrl: "https://www.linkedin.com/",
    description: "Provides professional competence on commercial software product strategies, cloud contract structures, technical consultive engagements, and effective client solution scoping.",
    imageUrl: "/certifications/img/IT Product Sales Specialist in B2b.png",
    pdfUrl: "/certifications/IT Product Sales Specialist in B2b .pdf"
  },
  {
    id: "cert_js_basic",
    title: "Learn Basic JavaScript Programming",
    organization: "Dicoding Indonesia",
    year: "2023",
    badges: ["JavaScript Syntax", "Algorithms", "DOM Manipulation"],
    credentialId: "SL-JS-BASIC-11",
    credentialUrl: "https://www.sololearn.com/",
    description: "Validates foundational JavaScript concepts, primitive types structures, conditional flows, operations iteration, functional abstractions, array methods, and simple DOM interface bindings.",
    imageUrl: "/certifications/img/Learn Basic JavaScript Programming.png",
    pdfUrl: "/certifications/Learn Basic JavaScript Programming.pdf"
  },
  {
    id: "cert_ai_basic",
    title: "Learn Basic of AI",
    organization: "Google Cloud Asia Pacific",
    year: "2024",
    badges: ["Artificial Intelligence", "ML Concepts", "Prompt Design"],
    credentialId: "AI-FOUND-BASIC",
    credentialUrl: "https://cloud.google.com/training",
    description: "Introduces foundational mechanics of large AI projects, basic deep neural architectures, transformer models, machine learning classifications, and safe prompt structures.",
    imageUrl: "/certifications/img/Learn Basic of AI.png",
    pdfUrl: "/certifications/Learn Basic of AI.pdf"
  },
  {
    id: "cert_web_basic",
    title: "Learn Basic Web Programming",
    organization: "Dicoding Indonesia",
    year: "2023",
    badges: ["Web Foundations", "Semantic HTML", "CSS styling"],
    credentialId: "GL-WEB-BASIC-15",
    credentialUrl: "https://www.mygreatlearning.com/",
    description: "Highlights key structural markup practices, CSS selector properties, layout alignments using grid and flex containers, and responsive viewport sizing templates.",
    imageUrl: "/certifications/img/Learn Basic Web Programming.png",
    pdfUrl: "/certifications/Learn Basic Web Programming.pdf"
  },
  {
    id: "cert_pm_basic",
    title: "Learn the Basics of Project Management",
    organization: "Skill Academy by Ruangguru",
    year: "2024",
    badges: ["Project Management", "Agile Principles", "Scope Control"],
    credentialId: "PMI-BAS-2901",
    credentialUrl: "https://www.pmi.org/",
    description: "Deals with critical managerial cycles including project setup workflows, agile product backlogs design, timeline scheduling models, risk mitigations, and cross-team communications.",
    imageUrl: "/certifications/img/Learn the Basics of Project Management.png",
    pdfUrl: "/certifications/Learn the Basics of Project Management.pdf"
  },
  {
    id: "cert_react_apps",
    title: "Learn to Build Apps with React",
    organization: "Dicoding Indonesia",
    year: "2024",
    badges: ["React JS", "Component Hooks", "Interactive UI"],
    credentialId: "SCRIMBA-REACT-B",
    credentialUrl: "https://scrimba.com/",
    description: "Hands-on implementation of component logic trees, reactive props, state management controls via hooks, lists filtering, context APIs, and single-page applications setups.",
    imageUrl: "/certifications/img/Learn to Build Apps with React.png",
    pdfUrl: "/certifications/Learn to Build Apps with React.pdf"
  },
  {
    id: "cert_python_procedural",
    title: "Procedural Programming with Python",
    organization: "Dicoding Indonesia",
    year: "2023",
    badges: ["Python 3", "Procedural Logic", "Data Structures"],
    credentialId: "PY-INST-390",
    credentialUrl: "https://pythoninstitute.org/",
    description: "Evaluates comprehensive procedural logic features in Python: variables scoping, file parsing loops, basic modules utilization, error handling blocks, and core lists/tuples operations.",
    imageUrl: "/certifications/img/Procedural Programming with Python.png",
    pdfUrl: "/certifications/Procedural Programming with Python.pdf"
  },
  {
    id: "cert_redhat",
    title: "Red Hat Academy - Program Learner",
    organization: "Red Hat",
    year: "2024",
    badges: ["Linux Administration", "System Management", "Cloud Infrastructure"],
    credentialId: "RHA-9821039801",
    credentialUrl: "https://rha.redhat.com/verify",
    description: "Acquired fundamental and hands-on skills in managing Enterprise Linux platforms, handling system services, storage configurations, secure permissions administration, and foundational networking deployment.",
    imageUrl: "/certifications/img/RedHatCertificate.png",
    pdfUrl: "/certifications/RedHatCertificate.pdf"
  },
  {
    id: "cert_fcc_responsive",
    title: "Responsive Web Design freeCodeCamp",
    organization: "freeCodeCamp",
    year: "2024",
    badges: ["Responsive Layouts", "Flexbox & Grid", "Web Accessibility"],
    credentialId: "FCC-RESP-WEB-24",
    credentialUrl: "https://www.freecodecamp.org/certification/rasuen/responsive-web-design",
    description: "Validates 300+ hours of responsive design challenges covering flexbox layouts, CSS grid frameworks, media query triggers, typography hierarchies, and mobile accessibility compliance.",
    imageUrl: "/certifications/img/Responsive Web Design freeCodeCamp.png",
    pdfUrl: "/certifications/Responsive Web Design freeCodeCamp.pdf"
  },
  {
    id: "cert_sql",
    title: "Structured Query Language (SQL)",
    organization: "Dicoding Indonesia",
    year: "2023",
    badges: ["SQL Databases", "Queries", "Relational Structures"],
    credentialId: "SQL-DB-KAG23",
    credentialUrl: "https://www.kaggle.com/learn/intro-to-sql",
    description: "Hands-on training in SQL syntax, relational query filters, complex multi-table joins, subqueries, group by aggregates, and structural relational table schemas.",
    imageUrl: "/certifications/img/Structured Query Language (SQL).png",
    pdfUrl: "/certifications/Structured Query Language (SQL).pdf"
  }
];

export const timelineItems: TimelineItem[] = [
  {
    id: "time_edu_1",
    title: "Undergraduate Student in Computer Science",
    organization: "Siber Muhammadiyah University",
    category: "education",
    duration: "2022 - 2026",
    location: "Special Region of Yogyakarta, Indonesia",
    description: "Pursuing a comprehensive Bachelor's degree in Computer Science, building stable software architectures, cloud computing skills, and cybersecurity protocols.",
    details: [
      "GPA: 3.51 out of 4.00",
      "Coursework: Red Hat Academy Program Learner (2024), Blue Team Junior Analyst Training, AWS Academy Cloud Foundations Learner"
    ]
  },
  {
    id: "time_exp_1",
    title: "Data Annotator",
    organization: "OneForma",
    category: "experience",
    duration: "April 2025 - Present",
    location: "USA (Remote)",
    description: "Contributed directly to major language and artificial intelligence evaluation initiatives, specifically the Lighthouse and Opal projects.",
    details: [
      "Executed high-quality text annotations, image annotation, and preference ranking evaluations to optimize machine learning models.",
      "Conducted thorough image curation and alignment reviews to ensure exact matches between visual and textual components.",
      "Collaborated strictly via formal written guidelines to secure premium accuracy and data quality standards."
    ]
  },
  {
    id: "time_exp_2",
    title: "Administrative Intern",
    organization: "Vriddhi Agency",
    category: "experience",
    duration: "February 2025 - April 2025",
    location: "Malang, East Java, Indonesia (Remote)",
    description: "Conducted high-volume target market research and coordinated outbound client outreach strategies to promote professional web designs.",
    details: [
      "Identified and investigated 10 or more target companies daily to update internal databases, highlighting prospects requiring web development solutions.",
      "Launched targeted email outreach campaigns utilizing promotional marketing content to pitch specialized web designs.",
      "Maintained pristine contact tracking archives and successfully finalized all assigned data management responsibilities inside strict 3-hour daily deadlines."
    ]
  },
  {
    id: "time_exp_3",
    title: "Co-Facilitator Intern",
    organization: "BTPN Syariah",
    category: "experience",
    duration: "October 2024 - January 2025",
    location: "Pacitan, East Java, Indonesia (On-Site)",
    description: "Empowered regional entrepreneurs with essential digital educational programs and business development frameworks.",
    details: [
      "Empowered 10 or more small and medium enterprises through active workshops and practical field mentoring.",
      "Secured a 71.3/100 client competency rating across established performance benchmarks.",
      "Instructed local entrepreneurs in creative problem-solving, Microsoft Office applications, and digital educational frameworks.",
      "Earned an official internship credential celebrating impactful facilitation and dedicated community empowerment."
    ]
  },
  {
    id: "time_exp_4",
    title: "Digital Marketing Intern - Market Report Team",
    organization: "GAOTek Inc",
    category: "experience",
    duration: "April 2024 - August 2024",
    location: "New York, USA (Remote)",
    description: "Spearheaded search engine optimization trends analysis and managed extensive market intelligence reporting structures.",
    details: [
      "Conducted comprehensive search engine optimization-driven market research and structured data assets inside Microsoft Excel.",
      "Produced and delivered 15 or more exhaustive market intelligence reports on a monthly schedule.",
      "Participated actively in weekly video conferences to align marketing tactics and share regional analytical observations."
    ]
  }
];

export const projects: Project[] = [
  {
    id: "proj_wellspark",
    title: "Mobile App Design",
    category: "Mobile-Design",
    subcategory: "UX/UI",
    description: "A sophisticated mobile application design focusing on user experience, healthy lifestyles, and modern design trends.",
    tags: ["UI/UX", "Mobile", "Healthtech"],
    demoUrl: "#",
    figmaUrl: "https://www.figma.com/community/file/1347842363347325628/healty-apps-mobile-apps",
    imageColor: "from-teal-400 to-emerald-600",
    imageUrl: "/Portfolio/Mobile-Design/HealtyApp-Design/COVER.png"
  },
  {
    id: "proj_login",
    title: "Login Page Design",
    category: "Mobile-Design",
    subcategory: "Interface",
    description: "UI/UX design for a login application focused on seamless user experience, responsive fields, and eye-friendly colors.",
    tags: ["UI/UX", "Mobile", "CSS Effects"],
    demoUrl: "#",
    figmaUrl: "https://www.figma.com/community/file/1352653945260305149/login-page",
    imageColor: "from-blue-500 to-indigo-600",
    imageUrl: "/Portfolio/Mobile-Design/Login-Page-Design/cover-login.png"
  },
  {
    id: "proj_social",
    title: "Social Media Poster",
    category: "Poster-Design",
    subcategory: "Marketing",
    description: "Multi-layered graphic design layouts curated for visual storytelling, utilizing high-contrast typography, minimalist frames, and bold gradient palettes.",
    tags: ["Graphic", "Branding", "Socials"],
    demoUrl: "#",
    githubUrl: "https://github.com/rasuen",
    imageColor: "from-pink-500 to-rose-600",
    imageUrl: "/Portfolio/Linkedin-Post/Poster-Design/instagram-poster.png"
  },
  {
    id: "proj_data",
    title: "Data Series",
    category: "Linkedin Post Design",
    subcategory: "Graphic Design",
    description: "Sleek and immersive information design demonstrating compound growth rates, dynamic microstructures, and abstract vector flowcharts.",
    tags: ["D3.js", "Infographics", "SVG"],
    demoUrl: "#",
    linkedinUrl: "https://www.linkedin.com/posts/rasendriya-khansa_data-series-dibimbing-activity-7232003209798541312-iYpo?utm_source=share&utm_medium=member_desktop",
    imageColor: "from-amber-400 to-orange-500",
    imageUrl: "/Portfolio/Linkedin-Post/Data-Series-11.0.png"
  },
  {
    id: "proj_menu",
    title: "Menu Design",
    category: "Simple-Design",
    subcategory: "Print",
    description: "A gorgeous luxury café menu mockup integrating clean layouts, item details, price indices, and micro-hover cards inspired by Italian espresso bars.",
    tags: ["Luxury", "Layout", "Print Design"],
    demoUrl: "#",
    imageColor: "from-yellow-600 to-amber-900",
    imageUrl: "/Portfolio/Linkedin-Post/Simple-Design/Menu.png"
  },
  {
    id: "proj_product",
    title: "Product Series 3.0",
    category: "Linkedin Post Design",
    subcategory: "Marketing",
    description: "An interactive landing page promoting mechanical keyboards with variable switches, visual configuration charts, and real-time custom preview boards.",
    tags: ["React Layout", "Motion v12", "Hardware"],
    demoUrl: "#",
    linkedinUrl: "https://www.linkedin.com/posts/rasendriya-khansa_product-series-30-activity-7179470267490992129-XuLa?utm_source=share&utm_medium=member_desktop",
    imageColor: "from-violet-500 to-purple-800",
    imageUrl: "/Portfolio/Linkedin-Post/Product-Series-Fair-3.0.png"
  },
  {
    id: "proj_skills",
    title: "Digital Skill Fair",
    category: "Linkedin Post Design",
    subcategory: "Development",
    description: "A comprehensive event hub supporting ticket bookings, real-time stage schedules, interactive workshop slots, and dynamic attendee badge previews.",
    tags: ["Full Stack", "Vite JS", "Interactive Map"],
    demoUrl: "#",
    linkedinUrl: "https://www.linkedin.com/posts/rasendriya-khansa_digital-skill-fair-230-activity-7157749829702504448-W4Tv?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEAlFlQBirN7t4_xc06vAv208Lpn81Qi_nU",
    imageColor: "from-cyan-500 to-blue-600",
    imageUrl: "/Portfolio/Linkedin-Post/Digital-Skill-fair-23.0.png"
  },
  {
    id: "proj_event",
    title: "Event Poster",
    category: "Poster-Design",
    subcategory: "Event",
    description: "A bold, geometric promotional visual utilizing custom SVG grids, beautiful overlapping shape masks, and deep contrasting background canvas options.",
    tags: ["Vector", "Poster", "Framer Canvas"],
    demoUrl: "#",
    imageColor: "from-fuchsia-500 to-pink-800",
    imageUrl: "/Portfolio/Linkedin-Post/Poster-Design/event-poster.png"
  },
  {
    id: "proj_techx_logo",
    title: "TechXperience Logo",
    category: "Logo",
    subcategory: "Logo Design",
    description: "A clean, technical corporate typographic vector logo design built for TechXperience, emphasizing professional brand identity.",
    tags: ["Logo", "Typography", "Vector"],
    demoUrl: "#",
    imageColor: "from-blue-600 to-indigo-900",
    imageUrl: "/Portfolio/Logo/TechXperience-Logo.png"
  },
  {
    id: "proj_bnw_logo",
    title: "BnW Minimalist Logo",
    category: "Logo",
    subcategory: "Logo Design",
    description: "High-contrast black and white corporate identity logo guidelines and premium monochrome mockup layouts.",
    tags: ["Monochrome", "Minimalist", "Vector"],
    demoUrl: "#",
    imageColor: "from-zinc-800 to-zinc-950",
    imageUrl: "/Portfolio/Logo/BnW-Logo.png"
  },
  {
    id: "proj_bnw_logo_2",
    title: "BnW Minimalist Logo II",
    category: "Logo",
    subcategory: "Logo Design Design",
    description: "Alternative typographic concept and visual geometry guidelines for the black and white corporate identity project.",
    tags: ["Monochrome", "Branding", "Alternative Logo"],
    demoUrl: "#",
    imageColor: "from-zinc-700 to-slate-900",
    imageUrl: "/Portfolio/Logo/BnW-2.png"
  },
  {
    id: "proj_emblem_logo",
    title: "Creative Emblem Logo",
    category: "Logo",
    subcategory: "Branding Design",
    description: "A secondary creative emblem and branded identity concept exploring custom symbology, clean margins, and eye-friendly layouts.",
    tags: ["Logo Design", "Emblem", "Creative Brand"],
    demoUrl: "#",
    imageColor: "from-blue-600 to-slate-800",
    imageUrl: "/Portfolio/Logo/logo2.jpg"
  }
];

export const romanQuotes = [
  { quote: "Carpe Diem", translation: "Seize the day" },
  { quote: "Veni, Vidi, Vici", translation: "I came, I saw, I conquered" },
  { quote: "Amor Fati", translation: "Love of fate" },
  { quote: "Memento Mori", translation: "Remember you must die" },
  { quote: "Ad Astra Per Aspera", translation: "To the stars through difficulties" }
];

