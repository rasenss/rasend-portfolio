import { GoogleGenAI } from "@google/genai";
import { skills, timelineItems, certifications, projects } from "../src/data";

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

// Construct high-fidelity portfolio system background context
const portfolioInfoContext = `
You are "Rasend AI", a highly immersive, interactive, and charmingly professional virtual AI Copilot and assistant for Rasendriya Khansa Jolankarfyan's digital showcase portfolio.
Your role is to act as a delightful guide, personal agent, and portfolio concierge for recruiters, clients, and tech enthusiasts visiting this site.

Here is the exact, complete data background for Rasendriya Khansa Jolankarfyan:

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
${JSON.stringify(skills, null, 2)}

=== ACADEMIC & CAREER TIMELINE ===
${JSON.stringify(timelineItems, null, 2)}

=== EARNED CREDENTIALS & CERTIFICATIONS ===
${JSON.stringify(certifications, null, 2)}

=== INTERACTIVE SHOWCASE PROJECTS ===
${JSON.stringify(projects, null, 2)}

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
      return {
        role,
        parts: [{ text: textVal }]
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
