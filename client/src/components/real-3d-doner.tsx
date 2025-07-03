import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Real3DDoner() {
  const donerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!donerRef.current) return;

    // GSAP ScrollTrigger for 3D transformations
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          if (donerRef.current) {
            const progress = self.progress;
            
            // 3D rotation and scaling
            const rotationY = progress * 720; // 2 full rotations
            const rotationX = Math.sin(progress * Math.PI * 4) * 30;
            const rotationZ = Math.cos(progress * Math.PI * 6) * 15;
            const scale = 0.8 + Math.sin(progress * Math.PI * 2) * 0.4;
            
            // Position movement
            const translateX = Math.sin(progress * Math.PI * 3) * 50;
            const translateY = Math.cos(progress * Math.PI * 2) * 30;
            
            gsap.set(donerRef.current, {
              rotationY,
              rotationX,
              rotationZ,
              scale,
              x: translateX,
              y: translateY,
              transformOrigin: "center center",
              transformStyle: "preserve-3d"
            });
          }
        }
      }
    });

    // Continuous rotation animation
    gsap.to(donerRef.current, {
      rotationY: "+=360",
      duration: 8,
      repeat: -1,
      ease: "none"
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-20 w-80 h-80 pointer-events-none">
      {/* 3D Döner Container */}
      <div 
        ref={donerRef}
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        {/* Döner Skewer */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-full rounded-full z-10"
          style={{
            background: 'linear-gradient(45deg, #888, #ccc, #888)',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.3)'
          }}
        />
        
        {/* Main Döner Meat Cylinder */}
        <div 
          className="absolute top-16 left-1/2 -translate-x-1/2 w-32 h-48 rounded-full"
          style={{
            background: `
              conic-gradient(from 0deg, 
                #8B4513 0deg, #CD853F 60deg, #D2691E 120deg, 
                #B8860B 180deg, #CD853F 240deg, #8B4513 300deg, #A0522D 360deg),
              radial-gradient(ellipse at center, 
                rgba(255, 255, 255, 0.1) 0%, 
                transparent 50%),
              linear-gradient(180deg, 
                rgba(255, 255, 255, 0.2) 0%, 
                transparent 30%, 
                rgba(0, 0, 0, 0.3) 70%, 
                rgba(0, 0, 0, 0.5) 100%)
            `,
            boxShadow: `
              0 0 30px rgba(255, 107, 53, 0.4),
              inset 0 0 30px rgba(0, 0, 0, 0.3),
              0 20px 40px rgba(0, 0, 0, 0.3)
            `,
            transform: 'rotateX(5deg) rotateY(5deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Meat texture overlay */}
          <div 
            className="absolute inset-0 rounded-full opacity-60"
            style={{
              background: `
                repeating-conic-gradient(from 0deg, 
                  transparent 0deg, 
                  rgba(139, 69, 19, 0.3) 10deg, 
                  transparent 20deg),
                repeating-radial-gradient(circle at center, 
                  transparent 0px, 
                  rgba(205, 133, 63, 0.2) 5px, 
                  transparent 10px)
              `
            }}
          />
          
          {/* Meat strips hanging */}
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-sm opacity-80"
              style={{
                width: '3px',
                height: `${15 + Math.random() * 20}px`,
                background: `linear-gradient(180deg, 
                  hsl(${25 + Math.random() * 15}, 70%, ${40 + Math.random() * 20}%), 
                  hsl(${20 + Math.random() * 10}, 60%, ${30 + Math.random() * 15}%))`,
                left: `${10 + (i * 5)}%`,
                bottom: '-10px',
                transform: `
                  rotateY(${i * 22.5}deg) 
                  translateZ(${64 + Math.random() * 10}px)
                  rotateX(${Math.random() * 20 - 10}deg)
                `,
                transformOrigin: 'top center',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>

        {/* Döner Top Cap */}
        <div 
          className="absolute top-12 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full"
          style={{
            background: 'linear-gradient(45deg, #666, #999, #666)',
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.3)'
          }}
        />

        {/* Döner Bottom Cap */}
        <div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 w-10 h-6 rounded-full"
          style={{
            background: 'linear-gradient(45deg, #666, #999, #666)',
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.3)'
          }}
        />

        {/* Atmospheric lighting effects */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, 
                rgba(255, 215, 0, 0.1) 0%, 
                transparent 50%),
              radial-gradient(circle at 70% 70%, 
                rgba(255, 107, 53, 0.1) 0%, 
                transparent 50%)
            `,
            filter: 'blur(10px)',
            transform: 'translateZ(100px)'
          }}
        />
      </div>
    </div>
  );
}