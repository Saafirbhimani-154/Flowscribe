import React, { useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ConstellationCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  const stars = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      baseX: Math.random() * 100,
      baseY: Math.random() * 100,
      speed: Math.random() * 0.4 + 0.1, // varying drift speeds for parallax depth
      size: Math.random() * 2.5 + 0.5,
      animationDuration: Math.random() * 4 + 2,
      opacity: Math.random() * 0.8 + 0.2
    }));
  }, []);

  const quadrants = useMemo(() => [
    { topRange: [0, 30], leftRange: [70, 100], angle: -45 },  // Top-Right to Down-Left
    { topRange: [0, 30], leftRange: [0, 30], angle: -135 },   // Top-Left to Down-Right
    { topRange: [70, 100], leftRange: [0, 30], angle: 135 },  // Bottom-Left to Up-Right
    { topRange: [70, 100], leftRange: [70, 100], angle: 45 }  // Bottom-Right to Up-Left
  ], []);

  const showerStars = useMemo(() => {
    // 1. The Meteor Shower: 16 stars that fire in a tight 5-second cluster, repeating every 180 seconds (3 mins).
    return Array.from({ length: 21 }).map((_, i) => {
      const q = quadrants[Math.floor(Math.random() * quadrants.length)];
      const top = Math.random() * (q.topRange[1] - q.topRange[0]) + q.topRange[0];
      const left = Math.random() * (q.leftRange[1] - q.leftRange[0]) + q.leftRange[0];
      return {
        id: `shower-${i}`,
        top: `${top}%`,
        left: `${left}%`,
        angle: q.angle,
        delay: Math.random() * 8, // All 16 fire within the first 5 seconds of the cycle
        duration: Math.random() * 4 + 4 + 172 // ~5s flight + 175s empty space = 180s cycle
      };
    });
  }, [quadrants]);

  const normalStars = useMemo(() => {
    // 2. The Constant Flow: 9 stars, 15s flight time, staggered evenly every ~1.6s. 
    return Array.from({ length: 12 }).map((_, i) => {
      const q = quadrants[Math.floor(Math.random() * quadrants.length)];
      const top = Math.random() * (q.topRange[1] - q.topRange[0]) + q.topRange[0];
      const left = Math.random() * (q.leftRange[1] - q.leftRange[0]) + q.leftRange[0];
      return {
        id: `normal-${i}`,
        top: `${top}%`,
        left: `${left}%`,
        angle: q.angle,
        delay: i * 1.6, // Evenly spaced delays
        duration: 15 // Constant 15s loop
      };
    });
  }, [quadrants]);

  useEffect(() => {
    let mouseX = -1000;
    let mouseY = -1000;
    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;

    const updateStars = () => {
      time += 1;
      if (containerRef.current) {
        const starElements = containerRef.current.children;
        const width = window.innerWidth;
        const height = window.innerHeight;

        for (let i = 0; i < starElements.length; i++) {
          const el = starElements[i] as HTMLElement;
          
          const baseX = parseFloat(el.getAttribute('data-basex') || '0');
          const baseY = parseFloat(el.getAttribute('data-basey') || '0');
          const speed = parseFloat(el.getAttribute('data-speed') || '1');
          
          // Drift diagonally
          let currentX = (baseX / 100) * width + (time * speed);
          let currentY = (baseY / 100) * height + (time * speed);

          // Wrap around with a 100px buffer to prevent visible popping
          currentX = currentX % (width + 100);
          currentY = currentY % (height + 100);

          const dx = mouseX - currentX;
          const dy = mouseY - currentY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const maxDistance = 200; // Gravity warp radius
          let pullX = 0;
          let pullY = 0;
          let scale = 1;

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            pullX = dx * force * 0.2;
            pullY = dy * force * 0.2;
            scale = 1 + force * 0.8;
          }

          // Apply both drift position and gravity pull in one GPU-accelerated transform
          el.style.transform = `translate(${currentX + pullX}px, ${currentY + pullY}px) scale(${scale})`;
        }
      }
      animationFrameId = requestAnimationFrame(updateStars);
    };

    animationFrameId = requestAnimationFrame(updateStars);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          data-basex={star.baseX}
          data-basey={star.baseY}
          data-speed={star.speed}
          animate={{ opacity: [star.opacity * 0.2, star.opacity, star.opacity * 0.2] }}
          transition={{ repeat: Infinity, duration: star.animationDuration, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            boxShadow: `0 0 ${star.size * 3}px rgba(255, 255, 255, 0.8)`,
            // Removed CSS transition for transform to prevent stuttering since we update it every frame
          }}
        />
      ))}

      {/* The 3-Minute Meteor Shower */}
      {showerStars.map((ss) => (
        <div
          key={ss.id}
          className="shooting-star"
          style={{
            top: ss.top,
            left: ss.left,
            animation: `meteor-shower ${ss.duration}s linear infinite`,
            animationDelay: `${ss.delay}s`,
            '--angle': `${ss.angle}deg`
          } as React.CSSProperties}
        />
      ))}

      {/* The Constant Flow Stars */}
      {normalStars.map((ss) => (
        <div
          key={ss.id}
          className="shooting-star"
          style={{
            top: ss.top,
            left: ss.left,
            animation: `shooting-star ${ss.duration}s linear infinite`,
            animationDelay: `${ss.delay}s`,
            '--angle': `${ss.angle}deg`
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
