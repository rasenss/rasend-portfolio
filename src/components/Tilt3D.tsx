import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  max?: number; // Maximum tilt angle in degrees
  scale?: number; // Scale factor on hover
  key?: React.Key;
}

export function Tilt3D({ children, className = '', max = 12, scale = 1.03 }: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // x and y motion values representing mouse coordinates from -0.5 to 0.5
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Apply smooth springs on transforms to make transition feels organic
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), { stiffness: 120, damping: 20 });
  const hoverScale = useSpring(isHovered ? scale : 1, { stiffness: 180, damping: 18 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate values from -0.5 to 0.5 relative to center of the element
    const relativeX = (event.clientX - rect.left) / width - 0.5;
    const relativeY = (event.clientY - rect.top) / height - 0.5;

    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale: hoverScale,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`relative transition-shadow duration-300 ${className} ${
        isHovered ? 'shadow-2xl shadow-blue-500/10 z-20' : ''
      }`}
    >
      <div 
        style={{ 
          transform: 'translateZ(30px)', 
          transformStyle: 'preserve-3d' 
        }} 
        className="h-full w-full"
      >
        {children}
      </div>
    </motion.div>
  );
}
