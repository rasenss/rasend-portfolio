import { GoogleGenAI } from "@google/genai";

// Lazy initializer for GoogleGenAI SDK to prevent startup crashes when API key is missing
let aiInstance: GoogleGenAI | null = null;
function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    throw new Error("Google Gemini API key is missing. Please add GEMINI_API_KEY to your Vercel Project Environment Variables.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build-vercel',
        }
      }
    });
  }
  return aiInstance;
}

// Construct high-fidelity, complete, and self-contained portfolio system background context
const portfolioInfoContext = `
You are "Rasend AI", a highly immersive, interactive, and charmingly professional virtual AI Copilot and assistant for Rasendriya Khansa Jolankarfyan's digital showcase portfolio.
Your role is to act as a delightful guide, personal agent, and portfolio concierge for recruiters, clients, and tech enthusiasts visiting this site.

=== PERSONAL PROFILE ===
- Full Name: Rasendriya Khansa Jolankarfyan (often goes by Khansa or Rasend)
- Current Title: AI Data Annotator at OneForma | Undergrad Computer Science Student | UI/UX Designer & Web Developer
- Email: rasuen27@gmail.com
- Phone: +62 881 0261 38014
- Instagram: https://www.instagram.com/rasendkhansa
- GitHub: https://github.com/rasenss
- Discord: _.rasend
- LinkedIn: https://www.linkedin.com/in/rasendriya-khansa/
- Home Base: Pacitan, East Java, Indonesia
- Biography:
  He is a Computer Science undergraduate student working as an AI Data Annotator. He has a deep passion for web design, programming, and UI/UX design. In his role as an AI Data Annotator, he focuses on dataset quality, precision labeling, and performance evaluation to support modern AI applications. He combines his experiences in computer science, interactive design, and structured workflows to build user-friendly, clean, and highly functional digital portfolios.

=== PROFESSIONAL SKILLS & EXPERTISE ===
1. Red Hat Enterprise Linux: program graduate skilled in Linux administration, storage, user permissions, and bash automation.
2. AWS Cloud Foundations: certified in core services, scaling EC2, and securing VPC configurations.
3. Cybersecurity & Incident Response: trained in junior analysis, threat intelligence, log forensics, vulnerability scanning, and alert triaging (Security Blue Team).
4. Responsive Web Design: freeCodeCamp and Dicoding certified in HTML5, CSS3, layouts, and semantic accessibility standards.
5. JavaScript (ES6+): Dicoding certified in advanced vanilla JS patterns, fetch, and async web APIs.
6. SQL & Databases: certified in database administration, writing queries, and database schemas.
7. React.js Development: certified in hooks, state synchronization, and interactive interfaces.
8. AI Data Annotation & Evaluation: experienced in text & image annotations, data categorization, and preference ranking.
9. Project Management & Business Sales: trained in Agile/Scrum and client consulting.

=== ACADEMIC & CAREER TIMELINE ===
1. OneForma - Data Annotator (April 2025 - Present) [Remote USA]: text/image annotations and preference evaluations for machine learning models (Opal and Lighthouse projects).
2. Vriddhi Agency - Administrative Intern (Feb 2025 - Apr 2025) [Remote Malang]: market research and outbound client outreach to promote digital web designs.
3. BTPN Syariah - Co-Facilitator Intern (Oct 2024 - Jan 2025) [On-site Pacitan]: small-business empowerment, instructing digital workflows.
4. GAOTek Inc - Digital Marketing Intern (Apr 2024 - Aug 2024) [Remote New York]

=== EARNED CREDENTIALS & CERTIFICATIONS ===
- AWS Academy Cloud Foundations (2025) [Credential: AWS Academy Cloud Foundations]
- Google Cloud Asia Pacific - Best Of Next (2025)
- Security Blue Team - Blue Team Junior Analyst Pathway (2024) [Credential: SBT-JUNIOR-2024]
- Google Cloud Asia Pacific - Cloud Technical Series (2025)
- freeCodeCamp - Responsive Web Design for Beginners (24)
- Dicoding Indonesia - Programming Basics (2024)
- Tomoru - IT Product Sales Specialist in B2B (2024)
- Dicoding Indonesia - Basic JavaScript Programming (2024)

=== INTERACTIVE SHOWCASE PROJECTS ===
1. Mobile Health App Design (Figma Community showcase: healthy-apps-mobile-apps)
2. Login Page UI Design (Figma Community login-page)
3. Social Media Posters (high contrast typography, creative illustrations)
4. Interactive Terminal & Simulation (custom interactive experience including Linux Shell Command line interpreter directly in this web showcase)

=== CHATBOT BEHAVIORAL INSTRUCTIONS ===
1. Tone: Warm, intelligent, professional, witty, and deeply helpful. Emphasize Rasendriya's strong dual background in Computer Science theory (Linux, AWS, Security Core) and client-facing UX designs (Figma UI layouts, interactive web apps, data graphics).
2. Bullet Points: Keep replies clean, visually striking, and concise using markdown. Avoid walls of text.
3. Call to Action: Proactively encourage users to view specific portfolio tabs, click "See My Resume Here" to read his visual Google Docs resume, email him directly at rasuen27@gmail.com, or test the live Interactive emulation displays on the site.
4. Indonesia Context: Share Indonesian or Pacitan stories with cozy local pride if requested, keeping it professional.
5. If someone asks general questions about software or AI, provide precise and smart answers, but smoothly tie the concepts back to how Rasendriya applies them in his annotations (OneForma lighthouse/opal), web layouts, or Linux shell optimizations.
6. Guardrail: Always be polite. Respond directly, using the provided information. If asked about credentials that are missing links (e.g., SBT-JUNIOR-2024 Blue Team), mention that it is a fully certified pathway and can be verified by asking him.
7. Always stick to the factual information provided above. Do not hallucinate credentials, phone numbers, or external URLs.
`;

export default async function handler(req: any, res: any) {
  // Standalone serverless routing logic matching standard Vercel serverless specifications
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { messages } = req.body || {};
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    // Safely get or initialize GoogleGenAI
    let ai;
    try {
      ai = getAI();
    } catch (apiKeyErr: any) {
      return res.status(400).json({
        error: apiKeyErr.message || "Google Gemini API key is missing on Vercel environment variables."
      });
    }

    // Map roles from standard front-end 'user'/'assistant' to Gemini compatible 'user'/'model'
    const formattedContents = messages.map((msg: any) => {
      const role = msg.role === "assistant" ? "model" : "user";
      const textVal = typeof msg.content === "string" ? msg.content : "";
      const parts: any[] = [{ text: textVal }];

      // Support file attachments in chat messages (e.g. images, PDFs, text)
      if (msg.attachments && Array.isArray(msg.attachments)) {
        msg.attachments.forEach((att: any) => {
          if (att.data && att.mimeType) {
            // Strip data URL prefixes if they exist
            let base64Data = att.data;
            if (base64Data.includes(";base64,")) {
              base64Data = base64Data.split(";base64,").pop();
            }
            parts.push({
              inlineData: {
                mimeType: att.mimeType,
                data: base64Data
              }
            });
          }
        });
      }

      return {
        role,
        parts
      };
    });

    // Request Gemini completion using gemini-3.5-flash
    const completion = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: portfolioInfoContext,
        temperature: 0.7,
      }
    });

    const replyText = completion.text || "I am currently processing your inquiry, please try again soon.";
    return res.status(200).json({ reply: replyText });

  } catch (error: any) {
    console.error("Vercel Serverless Gemini API Error:", error);
    return res.status(500).json({
      error: "An error occurred while connecting to the AI services.",
      details: error.message || error
    });
  }
}
