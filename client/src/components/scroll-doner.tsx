import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function ScrollDoner() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Transform scroll progress to rotation values
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 720]); // Two full rotations
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [0, -15, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);
  
  // Add spring physics for smoother motion
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 30 });
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <div ref={ref} className="fixed right-8 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
      <motion.div
        className="doner-3d w-48 h-64"
        style={{
          rotateY: springRotateY,
          rotateX: springRotateX,
          scale: springScale,
        }}
      >
        {/* Döner Skewer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-full bg-gradient-to-b from-gray-300 via-gray-400 to-gray-600 rounded-full shadow-lg z-10"></div>
        
        {/* Döner Meat Cylinder */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-48">
          <div className="doner-meat w-full h-full relative">
            {/* Meat texture layers */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-full opacity-20"
                style={{
                  background: `conic-gradient(from ${i * 45}deg, 
                    #8B4513, #CD853F, #D2691E, #B8860B, 
                    #CD853F, #8B4513, #654321, #8B4513)`,
                  transform: `rotateZ(${i * 22.5}deg) scale(${1 - i * 0.02})`,
                }}
              />
            ))}
            
            {/* Meat surface details */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-orange-300/30 to-red-800/30"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-tl from-yellow-200/20 to-orange-600/20"></div>
            
            {/* Crispy edges */}
            <div className="absolute inset-0 rounded-full border-2 border-orange-400/50 shadow-inner"></div>
          </div>
        </div>
        
        {/* Heat glow effect */}
        <motion.div 
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              "0 0 20px rgba(255, 123, 89, 0.3)",
              "0 0 40px rgba(255, 123, 89, 0.5)",
              "0 0 20px rgba(255, 123, 89, 0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Smoke effects */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-8 bg-gradient-to-t from-gray-400/40 to-transparent rounded-full absolute"
              style={{ left: `${(i - 1) * 12}px` }}
              animate={{
                y: [-10, -40],
                opacity: [0.6, 0],
                scale: [1, 1.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}