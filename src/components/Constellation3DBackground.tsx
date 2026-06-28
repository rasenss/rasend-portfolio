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
  color: string;      // RGB base color template
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
    const starCount = 1400; // Massively increased high-density celestial map!
    const stars: Star3D[] = [];

    // Helper to distribute stars with color variations representing real cosmic types
    const getRandomStarColor = (isDarkTheme: boolean) => {
      const darkColors = [
        'rgba(255, 255, 255, opacity)', // Pure brilliant white (high weight)
        'rgba(255, 255, 255, opacity)',
        'rgba(255, 255, 255, opacity)',
        'rgba(167, 139, 250, opacity)', // Cosmic Lavender/Violet glow (Aesthetic)
        'rgba(56, 189, 248, opacity)',  // Vibrant sky-blue
        'rgba(224, 242, 254, opacity)', // Soft ice blue star (O/B type)
        'rgba(244, 63, 94, opacity)',   // Soft cosmic rose (Aesthetic)
        'rgba(254, 243, 199, opacity)', // Golden amber star (M/K type)
      ];
      const lightColors = [
        'rgba(29, 78, 216, opacity)',   // High-contrast celestial royal blue
        'rgba(67, 56, 202, opacity)',   // Deep celestial indigo
        'rgba(109, 40, 217, opacity)',  // Mystic cosmic violet
        'rgba(15, 118, 110, opacity)',  // Space emerald teal
        'rgba(190, 24, 74, opacity)',   // Celestial rose/ruby
        'rgba(180, 83, 9, opacity)',    // Golden solar amber
      ];
      const list = isDarkTheme ? darkColors : lightColors;
      return list[Math.floor(Math.random() * list.length)];
    };

    // Initialize 3D Star Coordinates with a natural cosmic scale distribution
    for (let i = 0; i < starCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.pow(Math.random(), 0.75) * 1700; // Expanded radius for gorgeous dispersion
      
      // We categorize stars into three distinct aesthetic tiers:
      // Tier 1: Tiny, sparkling stellar dust particles (65% of stars)
      // Tier 2: Medium standard shimmering stars (27% of stars)
      // Tier 3: Rare brilliant major celestial nodes / super-giants with rich glows (8% of stars)
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

      stars.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius * 0.85,
        z: Math.random() * maxDepth,
        baseSize,
        brightness,
        pulseSpeed,
        pulsePhase: Math.random() * Math.PI * 2,
        color: getRandomStarColor(isDark),
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

      // Map, update, and sort stars for painter's depth rendering
      const projectedStars = stars
        .map((star) => {
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

          // 3. Infinite Vertical Wrap-Around scrolling:
          // Shifts the virtual Y coordinates based on page scroll, then wraps inside a 3D box height boundary.
          // This ensures that stars scroll dynamically with the user, creating beautiful parallax, 
          // AND guarantees stars never run out, remaining fully populated at the bottom of the long site.
          const boxHeight = height * 4;
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
          if (rz <= 10) return null;

          // Perspective Projection
          const scale = fov / rz;
          const sx = cx + rx * scale;
          const sy = cy + ry * scale;

          // Exclude stars that project far outside screen bounds
          if (sx < -200 || sx > width + 200 || sy < -200 || sy > height + 200) {
            return null;
          }

          // Fog / Depth opacity mapping
          // Deep stars are faint, approaching stars become bright, then fade out smoothly right before warping to prevent popping
          let depthFog = 1.0 - rz / maxDepth; // 0 (far) to 1 (near)
          let opacity = depthFog;

          // Fade out stars when they are extremely close (rz < 150) to make transition flawless
          if (rz < 150) {
            opacity *= (rz - 10) / 140;
          }

          return { sx, sy, scale, opacity, star, depth: rz };
        })
        .filter((item) => item !== null) as {
          sx: number;
          sy: number;
          scale: number;
          opacity: number;
          star: Star3D;
          depth: number;
        }[];

      // Sort by depth so stars are painted back-to-front (depth-buffer emulator)
      projectedStars.sort((a, b) => b.depth - a.depth);

      // Draw all Star Nodes
      projectedStars.forEach(({ sx, sy, scale, opacity, star }) => {
        // High-fidelity multi-frequency twinkle shimmer
        const freq1 = Math.sin(timeRef.current * 2.5 * star.pulseSpeed + star.pulsePhase);
        const freq2 = Math.cos(timeRef.current * 1.1 * star.pulseSpeed + star.pulsePhase * 1.6);
        const microScintillation = Math.sin(timeRef.current * 7.5 * star.pulseSpeed + star.pulsePhase * 2.0) * 0.12;
        
        const twinkle = (freq1 * 0.30 + freq2 * 0.20 + microScintillation + 0.65) * star.brightness;
        
        // Boosted base opacity so stars are clearly visible and sparkling across the entire depth range
        const finalAlpha = Math.max(isDark ? 0.25 : 0.35, Math.min(1.0, (opacity * 0.65 + 0.35) * twinkle * (isDark ? 0.98 : 0.88)));

        // Dynamic scale-adjusted size (slightly boosted size scaling factor)
        const size = Math.max(0.65, star.baseSize * scale * 0.52);

        // Render layered atmospheric bloom glows for larger bright stars in both dark and light modes
        const bloomThreshold = isDark ? 1.0 : 1.35; // Lower threshold in light theme for extra drama
        if (size > bloomThreshold) {
          ctx.save();
          // Use 'screen' for dark mode glow, and 'multiply' for soft, aesthetic light mode halos
          ctx.globalCompositeOperation = isDark ? 'screen' : 'multiply';

          const auraRadius = size * (isDark ? 6.0 : 5.0); // Richer stellar halo
          const auraGrad = ctx.createRadialGradient(sx, sy, size * 0.05, sx, sy, auraRadius);
          
          const alphaFactor = isDark ? 0.45 : 0.32; // Calibrated opacity for light vs dark halos
          const glowColor = star.color.replace('opacity', (finalAlpha * alphaFactor).toFixed(3));
          auraGrad.addColorStop(0, glowColor);
          auraGrad.addColorStop(0.35, star.color.replace('opacity', (finalAlpha * (isDark ? 0.18 : 0.12)).toFixed(3)));
          auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(sx, sy, auraRadius, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

        // Crisp star core circle
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = star.color.replace('opacity', finalAlpha.toFixed(2));
        ctx.fill();
      });

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
