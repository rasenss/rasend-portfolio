export interface Project {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  figmaUrl?: string;
  linkedinUrl?: string;
  imageColor: string; // Dynamic background color styling for mockup/avatar
  imageUrl?: string;  // Visual thumbnail or mockup screenshot preview
}

export interface Certification {
  id: string;
  title: string;
  organization: string;
  year: string;
  badges: string[];
  credentialId?: string;
  credentialUrl?: string;
  description: string;
  imageUrl?: string;  // Scan or premium visual preview
  pdfUrl?: string;    // Direct URL to the uploaded PDF
}

export interface TimelineItem {
  id: string;
  title: string;
  organization: string;
  category: 'education' | 'experience' | 'certification' | 'skills';
  duration: string;
  location: string;
  description: string;
  details?: string[];
}

export interface SkillItem {
  name: string;
  description: string;
  icon: string; // Name of Lucide icon
  category: string;
  level: number; // 0-100 progress
}
