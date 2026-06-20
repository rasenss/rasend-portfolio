# 🌟 Rasendriya Khansa Jolankarfyan — Interactive Portfolio

An elegant, highly interactive, and visually stunning interactive portfolio website. Designed as a macOS-style fluid glassmorphic workbench, this portfolio highlights skills, resume credentials, certified learning timelines, creative projects, and a dual-profile switch engine.

---

## 🚀 Key Features

*   **🎭 Dual Profile Persona Engine**: Interactive tab switcher in the Hero section enabling visitors to switch between two primary career contexts:
    *   **Creative Developer**: Highlighting modern web architecture, clean UI/UX design, custom layouts, and interactive tools.
    *   **AI Data Annotator**: Focusing on high-precision data labeling, semantic evaluation, and dataset quality curation.
*   **🕶️ 3D Parallax Portrait Interaction**: High-performance interactive card module that reacts smoothly to hover mouse positions.
*   **📸 Dynamic Portfolio Photo Loader**: Fully fault-tolerant portrait loader. It automatically searches for your picture at `/public/profile_avatar.jpg`. If found, it displays the picture flawlessly; if missing or in error, it falls back to a stunning adaptive vector avatar modeling of yourself (complete with your signature glasses and batik shirt!).
*   **📂 Multi-Window Desktop Layout**: A clean bento-inspired interface structured inside mock window components, with mini controls (minimize, close, maximize).
*   **📇 Certified Learning Timeline**: Interactive scrolling certifications timeline complete with image badge indicators.
*   **💻 Interactive Command Terminal**: Custom-built, responsive retro portfolio command panel for power-users.

---

## 🛠️ Tech Stack & Architecture

*   **Framework**: [React 19](https://react.dev) + [Vite](https://vitejs.dev)
*   **Language**: [TypeScript](https://www.typescriptlang.org) for strict type safety
*   **Animation**: [Framer Motion](https://motion.dev) (High-performance micro-interactions & physics-spring animations)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com) (Utility-first styling approach)
*   **Icons**: [Lucide React](https://lucide.dev)

---

## 📂 Project Structure

```text
├── public/                 # Static assets (images, PDFs, certifications)
│   ├── certifications/     # PDF & image files for certification badges
│   ├── Portfolio/          # Project mockup screenshots and files
│   └── profile_avatar.jpg  # [OPTIONAL] Drop your portfolio picture here!
├── src/
│   ├── components/         # Modular React components (Hero, About, Portfolio, etc.)
│   ├── data.ts             # Central file for biography, certificates, and metrics
│   ├── types.ts            # Type definitions for structural consistency
│   ├── App.tsx             # Theme provider and main layout coordinator
│   └── index.css           # Global custom styles and Tailwind context
```

---

## 📸 Personalizing Your Photo

To place your uploaded photo into the portfolio's **About Me** section:
1.  Name your picture file exactly **`profile_avatar.jpg`** (all lowercase).
2.  Move/paste it into the **`public`** folder of your project repository.
3.  Restart or refresh your browser. The site's dynamic asset loader will immediately render your portrait instead of the default avatar fallback!

---

## ⚙️ Local Development

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### Quick Start
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/rasenss/portfolio-rasend.git
    cd portfolio-rasend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run development server**:
    ```bash
    npm run dev
    ```
    Your local preview will open automatically at [http://localhost:3000](http://localhost:3000).

4.  **Production build**:
    ```bash
    npm run build
    ```
    Creates optimized, production-ready static files in the `/dist` folder.
