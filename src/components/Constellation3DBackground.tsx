import React, { useEffect, useRef } from 'react';

interface Constellation3DBackgroundProps {
  isDark: boolean;
  isPlaying?: boolean;
}

interface Star3D {
  x: number;          // 3D coordinate X
  y: number;          // 3D coordinate Y
  z: number;          // 3D coordinate Z (depth)
  baseSize: number;   // size of the star
  brightness: number; // base brightness
  pulseSpeed: number; // twinkle speed multiplier
  pulsePhase: number; // twinkle offset phase
  r: number;          // Red color channel
  g: number;          // Green color channel
  b: number;          // Blue color channel
  speedFactor: number;// individual star speed variation
}

export default function Constellation3DBackground({ isDark, isPlaying = false }: Constellation3DBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isOver: false });
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const scrollRef = useRef({ currentY: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Adjust resolution for high-DPI displays to ensure ultra-sharp stars
    const adjustResolution = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    adjustResolution();
    window.addEventListener('resize', adjustResolution);

    // Track mouse coordinates for interactive parallax camera shifts
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) * 2 - 1;
      mouseRef.current.isOver = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
      mouseRef.current.isOver = false;
    };

    // Track touch coordinates for mobile screens
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseRef.current.targetX = (touch.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.targetY = (touch.clientY / window.innerHeight) * 2 - 1;
        mouseRef.current.isOver = true;
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
      mouseRef.current.isOver = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    // Track page scroll coordinates
    const handleScroll = () => {
      scrollRef.current.targetY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Configuration
    const maxDepth = 1500;
    
    // Dynamic Performance scaling based on viewport width:
    // This allows buttery-smooth 60fps on mobile while presenting a breathtakingly full starfield on desktop.
    const isMobileDevice = window.innerWidth < 768;
    const starCount = isMobileDevice ? 150 : 350;
    const stars: Star3D[] = [];

    // Helper to distribute stars with pre-parsed RGB tuples
    const getRandomStarRGB = (isDarkTheme: boolean) => {
      const darkColors = [
        { r: 255, g: 255, b: 255 }, // Pure brilliant white (high weight)
        { r: 255, g: 255, b: 255 },
        { r: 255, g: 255, b: 255 },
        { r: 167, g: 139, b: 250 }, // Cosmic Lavender/Violet glow (Aesthetic)
        { r: 56, g: 189, b: 248 },  // Vibrant sky-blue
        { r: 224, g: 242, b: 254 }, // Soft ice blue star (O/B type)
        { r: 244, g: 63, b: 94 },   // Soft cosmic rose (Aesthetic)
        { r: 254, g: 243, b: 199 }, // Golden amber star (M/K type)
      ];
      const lightColors = [
        { r: 29, g: 78, b: 216 },   // High-contrast celestial royal blue
        { r: 67, g: 56, b: 202 },   // Deep celestial indigo
        { r: 109, g: 40, b: 217 },  // Mystic cosmic violet
        { r: 15, g: 118, b: 110 },  // Space emerald teal
        { r: 190, g: 24, b: 74 },   // Celestial rose/ruby
        { r: 180, g: 83, b: 9 },    // Golden solar amber
      ];
      const list = isDarkTheme ? darkColors : lightColors;
      return list[Math.floor(Math.random() * list.length)];
    };

    // Initialize 3D Star Coordinates with a natural cosmic scale distribution
    for (let i = 0; i < starCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.pow(Math.random(), 0.75) * 1700; // Expanded radius for gorgeous dispersion
      
      // We categorize stars into three distinct aesthetic tiers:
      const rand = Math.random();
      let baseSize = 0.5;
      let brightness = 0.35 + Math.random() * 0.5;
      let pulseSpeed = 0.5 + Math.random() * 1.5;

      if (rand < 0.65) {
        // Fine Star Dust
        baseSize = 0.40 + Math.random() * 0.50;
        brightness = 0.40 + Math.random() * 0.45;
        pulseSpeed = 0.3 + Math.random() * 1.0;
      } else if (rand < 0.92) {
        // Medium Shimmering Stars
        baseSize = 1.0 + Math.random() * 0.9;
        brightness = 0.65 + Math.random() * 0.35;
        pulseSpeed = 0.6 + Math.random() * 1.4;
      } else {
        // Super-giants with rich glows
        baseSize = 2.0 + Math.random() * 1.8;
        brightness = 0.90 + Math.random() * 0.10;
        pulseSpeed = 0.8 + Math.random() * 1.8;
      }

      const rgb = getRandomStarRGB(isDark);

      stars.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius * 0.85,
        z: Math.random() * maxDepth,
        baseSize,
        brightness,
        pulseSpeed,
        pulsePhase: Math.random() * Math.PI * 2,
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        speedFactor: 0.6 + Math.random() * 0.8,
      });
    }

    // Render / Animation Loop
    const tick = () => {
      // 1. Render Atmospheric Gradient Background matching the user's reference image
      if (isDark) {
        // Draw deep space linear base gradient
        const spaceGrad = ctx.createLinearGradient(0, 0, 0, height);
        spaceGrad.addColorStop(0, '#010105'); // Absolute top pitch-black outer space
        spaceGrad.addColorStop(0.5, '#03030c'); // Deep navy/black transition
        spaceGrad.addColorStop(1, '#060714'); // Rich indigo/black space horizon
        ctx.fillStyle = spaceGrad;
        ctx.fillRect(0, 0, width, height);

        // Add 2 immersive radial glows (Cosmic Nebulae) that float slowly over time
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        // Core Nebula 1: Soft mystical violet/indigo glow near bottom center
        const neb1X = width * 0.5 + Math.sin(timeRef.current * 0.15) * 80;
        const neb1Y = height * 0.7 + Math.cos(timeRef.current * 0.12) * 50;
        const neb1Rad = Math.min(width, height) * 0.85;
        const neb1Grad = ctx.createRadialGradient(neb1X, neb1Y, 10, neb1X, neb1Y, neb1Rad);
        neb1Grad.addColorStop(0, 'rgba(30, 27, 75, 0.28)'); // Deep rich indigo
        neb1Grad.addColorStop(0.4, 'rgba(23, 15, 51, 0.12)'); // Deep violet
        neb1Grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = neb1Grad;
        ctx.beginPath();
        ctx.arc(neb1X, neb1Y, neb1Rad, 0, Math.PI * 2);
        ctx.fill();

        // Core Nebula 2: Subtle cyan/teal dust cloud on left margin
        const neb2X = width * 0.15 + Math.cos(timeRef.current * 0.08) * 100;
        const neb2Y = height * 0.35 + Math.sin(timeRef.current * 0.1) * 60;
        const neb2Rad = Math.min(width, height) * 0.55;
        const neb2Grad = ctx.createRadialGradient(neb2X, neb2Y, 5, neb2X, neb2Y, neb2Rad);
        neb2Grad.addColorStop(0, 'rgba(8, 145, 178, 0.06)'); // Cyan space gas
        neb2Grad.addColorStop(0.5, 'rgba(3, 105, 161, 0.02)'); // Soft sky blue dust
        neb2Grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = neb2Grad;
        ctx.beginPath();
        ctx.arc(neb2X, neb2Y, neb2Rad, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      } else {
        // Pristine, minimalist light workspace theme gradient
        const lightGrad = ctx.createLinearGradient(0, 0, 0, height);
        lightGrad.addColorStop(0, '#fdfdfd'); // Pure clean cosmic white sky
        lightGrad.addColorStop(0.5, '#f5f7fa');
        lightGrad.addColorStop(1, '#e2e8f0'); // Soft silver horizon
        ctx.fillStyle = lightGrad;
        ctx.fillRect(0, 0, width, height);

        // Add 2 immersive radial light pastel glows (Watercolor Cosmic Nebulae for Light theme)
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';

        // Light Core Nebula 1: Soft warm peach/amber sun dust near bottom center
        const neb1X = width * 0.6 + Math.sin(timeRef.current * 0.12) * 80;
        const neb1Y = height * 0.65 + Math.cos(timeRef.current * 0.1) * 50;
        const neb1Rad = Math.min(width, height) * 0.75;
        const neb1Grad = ctx.createRadialGradient(neb1X, neb1Y, 10, neb1X, neb1Y, neb1Rad);
        neb1Grad.addColorStop(0, 'rgba(253, 230, 138, 0.42)'); // Warm golden peach glow
        neb1Grad.addColorStop(0.4, 'rgba(244, 143, 177, 0.18)'); // Soft warm rose/pink
        neb1Grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = neb1Grad;
        ctx.beginPath();
        ctx.arc(neb1X, neb1Y, neb1Rad, 0, Math.PI * 2);
        ctx.fill();

        // Light Core Nebula 2: Soft cool sky-blue/lavender cloud on upper left
        const neb2X = width * 0.2 + Math.cos(timeRef.current * 0.08) * 100;
        const neb2Y = height * 0.3 + Math.sin(timeRef.current * 0.11) * 60;
        const neb2Rad = Math.min(width, height) * 0.55;
        const neb2Grad = ctx.createRadialGradient(neb2X, neb2Y, 5, neb2X, neb2Y, neb2Rad);
        neb2Grad.addColorStop(0, 'rgba(186, 230, 253, 0.55)'); // Bright ethereal ice-blue
        neb2Grad.addColorStop(0.5, 'rgba(216, 180, 254, 0.22)'); // Pastel lavender mist
        neb2Grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = neb2Grad;
        ctx.beginPath();
        ctx.arc(neb2X, neb2Y, neb2Rad, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // Smoothly interpolate scrolling position for lag-free vertical panning
      scrollRef.current.currentY += (scrollRef.current.targetY - scrollRef.current.currentY) * 0.075;
      const scrollOffset = scrollRef.current.currentY * 0.32;

      // Smoothly interpolate mouse position for fluid 3D tilt
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      // Base time drift
      const speedMultiplier = isPlaying ? 3.8 : 1.0;
      timeRef.current += 0.002 * speedMultiplier;

      // Define camera focus center, offset smoothly by interactive mouse tilt
      const cx = width / 2 - mouseRef.current.x * 90;
      const cy = height / 2 - mouseRef.current.y * 70;

      // Standard focal length for realistic perspective mapping
      const fov = 380;
      const boxHeight = height * 4;

      // Single-pass render loop for 100% efficient draw calls (zero GC overhead)
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // 2. Flyby 3D forward motion: decrease Z coordinate to fly closer
        const flightSpeed = (isPlaying ? 4.8 : 1.1) * star.speedFactor;
        star.z -= flightSpeed;

        // If star passes the screen, warp it seamlessly back to the infinite far plane
        if (star.z <= 10) {
          star.z = maxDepth;
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.pow(Math.random(), 0.75) * 1700;
          star.x = Math.cos(angle) * radius;
          star.y = Math.sin(angle) * radius * 0.85;
          
          // Re-apply tier characteristics on wrap to maintain rich diversity
          const rand = Math.random();
          if (rand < 0.65) {
            star.baseSize = 0.40 + Math.random() * 0.50;
            star.brightness = 0.40 + Math.random() * 0.45;
          } else if (rand < 0.92) {
            star.baseSize = 1.0 + Math.random() * 0.9;
            star.brightness = 0.65 + Math.random() * 0.35;
          } else {
            star.baseSize = 2.0 + Math.random() * 1.8;
            star.brightness = 0.90 + Math.random() * 0.10;
          }
          star.pulsePhase = Math.random() * Math.PI * 2;
        }

        // 3. Infinite Vertical Wrap-Around scrolling
        let virtualY = star.y - scrollOffset;
        virtualY = ((virtualY + boxHeight / 2) % boxHeight);
        if (virtualY < 0) virtualY += boxHeight;
        virtualY -= boxHeight / 2;

        // Camera orbit yaw/pitch rotation based on cosmic clock + mouse
        const yawAngle = timeRef.current * 0.015 - mouseRef.current.x * 0.05;
        const pitchAngle = mouseRef.current.y * 0.04;

        const cosYaw = Math.cos(yawAngle);
        const sinYaw = Math.sin(yawAngle);
        const cosPitch = Math.cos(pitchAngle);
        const sinPitch = Math.sin(pitchAngle);

        // Yaw rotation (around Y axis)
        let rx = star.x * cosYaw - star.z * sinYaw;
        let rz = star.x * sinYaw + star.z * cosYaw;

        // Pitch rotation (around X axis)
        let ry = virtualY * cosPitch - rz * sinPitch;
        rz = virtualY * sinPitch + rz * cosPitch;

        // Check if the star is behind the camera frustum
        if (rz <= 10) continue;

        // Perspective Projection
        const scale = fov / rz;
        const sx = cx + rx * scale;
        const sy = cy + ry * scale;

        // Exclude stars that project far outside screen bounds
        if (sx < -100 || sx > width + 100 || sy < -100 || sy > height + 100) {
          continue;
        }

        // Fog / Depth opacity mapping
        let depthFog = 1.0 - rz / maxDepth;
        let opacity = depthFog;

        // Fade out stars when they are extremely close (rz < 150) to make transition flawless
        if (rz < 150) {
          opacity *= (rz - 10) / 140;
        }

        // Twinkle calculation
        const freq1 = Math.sin(timeRef.current * 2.5 * star.pulseSpeed + star.pulsePhase);
        const freq2 = Math.cos(timeRef.current * 1.1 * star.pulseSpeed + star.pulsePhase * 1.6);
        const microScintillation = Math.sin(timeRef.current * 7.5 * star.pulseSpeed + star.pulsePhase * 2.0) * 0.12;
        
        const twinkle = (freq1 * 0.30 + freq2 * 0.20 + microScintillation + 0.65) * star.brightness;
        
        // Base opacities are boosted for spectacular visibility
        const finalAlpha = Math.max(isDark ? 0.28 : 0.38, Math.min(1.0, (opacity * 0.65 + 0.35) * twinkle * (isDark ? 0.98 : 0.88)));
        const size = Math.max(0.65, star.baseSize * scale * 0.52);

        // Render layered atmospheric bloom glows for larger stars with high-performance vector halos
        const bloomThreshold = isDark ? 1.4 : 1.75; // Pre-calibrated threshold to draw bloom halos only on giants
        if (size > bloomThreshold) {
          const auraRadius = size * (isDark ? 4.5 : 3.8);
          
          // Draw a soft outer atmosphere circle (super-fast hardware vector rendering)
          ctx.beginPath();
          ctx.arc(sx, sy, auraRadius, 0, Math.PI * 2);
          const alphaFactor = isDark ? 0.08 : 0.06;
          ctx.fillStyle = `rgba(${star.r}, ${star.g}, ${star.b}, ${(finalAlpha * alphaFactor).toFixed(2)})`;
          ctx.fill();

          // Draw an inner bright corona circle for extra lush richness
          ctx.beginPath();
          ctx.arc(sx, sy, size * 2.2, 0, Math.PI * 2);
          const innerAlphaFactor = isDark ? 0.18 : 0.13;
          ctx.fillStyle = `rgba(${star.r}, ${star.g}, ${star.b}, ${(finalAlpha * innerAlphaFactor).toFixed(2)})`;
          ctx.fill();
        }

        // Crisp star core circle (using highly performant pre-parsed channels)
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.r}, ${star.g}, ${star.b}, ${finalAlpha.toFixed(2)})`;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    tick();

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('resize', adjustResolution);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isDark, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen block z-0 overflow-hidden pointer-events-none transition-all duration-1000"
      style={{ opacity: isDark ? 1.0 : 0.9 }}
    />
  );
}
