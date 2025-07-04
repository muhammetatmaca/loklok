import { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function DonerSliceEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const donerGroupRef = useRef<THREE.Group | null>(null);
  const plateRef = useRef<THREE.Mesh | null>(null);
  const knifeRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [isSlicing, setIsSlicing] = useState(false);

  const initThreeJS = useCallback(() => {
    if (!containerRef.current) return;

    // Check for WebGL support
    if (!window.WebGLRenderingContext) {
      console.warn('WebGL not supported');
      return;
    }

    // Detect mobile
    const isMobile = window.innerWidth < 768;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    // Camera - responsive settings
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 75 : 60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    
    // Adjust camera position for mobile
    if (isMobile) {
      camera.position.set(2, 1.5, 6);
    } else {
      camera.position.set(3, 2, 8);
    }
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer - mobile optimizations
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobile,
      alpha: true,
      powerPreference: isMobile ? "low-power" : "high-performance"
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    
    // Shadows only on desktop
    if (!isMobile) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Create döner group
    const donerGroup = new THREE.Group();
    donerGroupRef.current = donerGroup;

    // Layered döner - mobile optimized
    const layerCount = isMobile ? 20 : 30;
    const totalHeight = 6;
    const layerHeight = totalHeight / layerCount;

    for (let i = 0; i < layerCount; i++) {
      const progress = i / layerCount;
      const yPos = -totalHeight/2 + (i * layerHeight);
      
      const bottomRadius = 1.6 - (progress * 0.6);
      const topRadius = 1.5 - (progress * 0.5);
      
      const segments = isMobile ? 16 : 32; // Lower segments for mobile
      const layerGeometry = new THREE.CylinderGeometry(topRadius, bottomRadius, layerHeight * 0.9, segments);
      
      const baseHue = 0.08;
      const saturation = 0.7 + Math.random() * 0.2;
      const lightness = 0.2 + Math.random() * 0.3;
      const isDark = Math.random() > 0.6;
      const finalLightness = isDark ? lightness * 0.6 : lightness;
      
      const layerMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(baseHue, saturation, finalLightness),
        shininess: 15,
        specular: 0x222222,
      });
      
      const layerMesh = new THREE.Mesh(layerGeometry, layerMaterial);
      layerMesh.position.y = yPos;
      layerMesh.userData = { 
        originalY: yPos, 
        sliceIndex: i,
        isSliceable: true,
        bottomRadius,
        topRadius
      };
      layerMesh.castShadow = !isMobile;
      layerMesh.receiveShadow = !isMobile;
      
      donerGroup.add(layerMesh);
    }

    // Döner hook
    const hookGeometry = new THREE.TorusGeometry(0.3, 0.08, 8, 16, Math.PI);
    const hookMaterial = new THREE.MeshPhongMaterial({
      color: 0x444444,
      shininess: 100,
    });
    
    const hook = new THREE.Mesh(hookGeometry, hookMaterial);
    hook.position.y = totalHeight/2 + 0.5;
    hook.rotation.x = Math.PI;
    hook.castShadow = !isMobile;
    donerGroup.add(hook);

    // Döner skewer
    const skewGeometry = new THREE.CylinderGeometry(0.04, 0.04, totalHeight + 1, 8);
    const skewMaterial = new THREE.MeshPhongMaterial({
      color: 0x555555,
      shininess: 100,
    });
    
    const skewMesh = new THREE.Mesh(skewGeometry, skewMaterial);
    skewMesh.castShadow = !isMobile;
    donerGroup.add(skewMesh);

    // Bottom cap
    const bottomCapGeometry = new THREE.SphereGeometry(0.15, 16, 8);
    const bottomCap = new THREE.Mesh(bottomCapGeometry, hookMaterial);
    bottomCap.position.y = -totalHeight/2 - 0.3;
    donerGroup.add(bottomCap);

    scene.add(donerGroup);

    // Create plate
    const plateGeometry = new THREE.CylinderGeometry(2.5, 2.5, 0.3, 32);
    const plateMaterial = new THREE.MeshPhongMaterial({
      color: 0xF5F5F5,
      shininess: 60,
      specular: 0x444444,
    });
    
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    plate.position.y = -4;
    plate.castShadow = !isMobile;
    plate.receiveShadow = !isMobile;
    plateRef.current = plate;
    scene.add(plate);

    // Plate rim
    const rimGeometry = new THREE.TorusGeometry(2.5, 0.1, 8, 32);
    const rimMaterial = new THREE.MeshPhongMaterial({
      color: 0xE0E0E0,
      shininess: 80,
    });
    
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.position.y = -3.8;
    rim.rotation.x = Math.PI / 2;
    scene.add(rim);

    // Create knife
    const knifeGroup = new THREE.Group();
    knifeRef.current = knifeGroup;

    // Knife blade
    const bladeGeometry = new THREE.BoxGeometry(0.02, 1.2, 4);
    const bladeMaterial = new THREE.MeshPhongMaterial({
      color: 0xE8E8E8,
      shininess: 120,
      specular: 0xAAAAAA,
      reflectivity: 0.8,
    });
    
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.position.set(0, 0, 0);
    blade.castShadow = !isMobile;
    knifeGroup.add(blade);

    // Knife handle
    const handleGeometry = new THREE.CylinderGeometry(0.2, 0.18, 1.5, 8);
    const handleMaterial = new THREE.MeshPhongMaterial({
      color: 0x4A2C17,
      shininess: 40,
    });
    
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(0, 0, -4);
    handle.rotation.x = Math.PI / 2;
    handle.castShadow = !isMobile;
    knifeGroup.add(handle);

    // Knife guard
    const guardGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.3);
    const guardMaterial = new THREE.MeshPhongMaterial({
      color: 0x888888,
      shininess: 80,
    });
    
    const guard = new THREE.Mesh(guardGeometry, guardMaterial);
    guard.position.set(0, 0, -2.5);
    knifeGroup.add(guard);

    knifeGroup.position.set(1.5, 6, 0);
    knifeGroup.rotation.x = Math.PI / 6;
    knifeGroup.rotation.y = Math.PI;
    knifeGroup.rotation.z = 0;
    scene.add(knifeGroup);

    // Lighting - mobile optimized
    const ambientLight = new THREE.AmbientLight(0x404040, isMobile ? 0.8 : 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, isMobile ? 1.0 : 1.2);
    directionalLight.position.set(5, 10, 5);
    
    if (!isMobile) {
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
    }
    scene.add(directionalLight);

    // Additional light only on desktop
    if (!isMobile) {
      const pointLight = new THREE.PointLight(0xFF6B35, 1, 10);
      pointLight.position.set(-3, 0, 3);
      scene.add(pointLight);
    }

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (donerGroup && !isSlicing) {
        donerGroup.rotation.y += 0.01;
      }

      // Knife animation
      if (knifeGroup && !isSlicing) {
        const time = Date.now() * 0.002;
        knifeGroup.position.x = 1.5 + Math.sin(time) * 0.2;
        knifeGroup.rotation.y = Math.PI + Math.sin(time * 0.7) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Scroll-triggered animations
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top center",
      end: "bottom center",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        
        if (progress > 0.2 && progress < 0.8) {
          if (knifeRef.current) {
            const sliceProgress = (progress - 0.2) / 0.6;
            knifeRef.current.position.y = 6 - sliceProgress * 8;
            knifeRef.current.position.x = 1.5 + Math.sin(sliceProgress * Math.PI * 4) * 0.1;
          }
          
          if (!isSlicing && progress > 0.4) {
            setIsSlicing(true);
            startSlicing();
          }
        }

        if (plateRef.current) {
          plateRef.current.position.y = -4;
        }
      }
    });

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      });
    };
  }, [isSlicing]);

  const startSlicing = () => {
    if (!donerGroupRef.current || !plateRef.current) return;

    // Create falling meat pieces
    donerGroupRef.current.children.forEach((child, index) => {
      if (child instanceof THREE.Mesh && child.userData.isSliceable) {
        const sliceIndex = child.userData.sliceIndex;
        
        if (Math.random() > 0.05) {
          // Create meat pieces
          const pieceCount = window.innerWidth < 768 ? 4 : 8; // Fewer pieces on mobile
          
          for (let i = 0; i < pieceCount; i++) {
            const pieceGeometry = new THREE.BoxGeometry(
              0.1 + Math.random() * 0.05,
              0.05 + Math.random() * 0.03,
              0.1 + Math.random() * 0.05
            );
            const pieceMaterial = new THREE.MeshPhongMaterial({
              color: new THREE.Color(0xFF6B35),
              shininess: 50,
              specular: 0x666666,
              emissive: new THREE.Color(0x331100),
            });
            
            const piece = new THREE.Mesh(pieceGeometry, pieceMaterial);
            piece.position.copy(child.position);
            piece.position.x += (Math.random() - 0.5) * 1.0;
            piece.position.z += (Math.random() - 0.5) * 1.0;
            piece.position.y += 0.5;
            piece.castShadow = window.innerWidth >= 768;
            piece.receiveShadow = window.innerWidth >= 768;
            
            sceneRef.current?.add(piece);
            
            // Animate falling
            const plateRadius = 2.2;
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * plateRadius * 0.8;
            
            gsap.to(piece.position, {
              x: Math.cos(angle) * distance,
              y: -3.5,
              z: Math.sin(angle) * distance,
              duration: 2.0 + Math.random() * 1.0,
              delay: sliceIndex * 0.03,
              ease: "bounce.out"
            });

            gsap.to(piece.rotation, {
              x: (Math.random() - 0.5) * Math.PI * 4,
              y: (Math.random() - 0.5) * Math.PI * 4,
              z: (Math.random() - 0.5) * Math.PI * 4,
              duration: 2.0 + Math.random() * 0.8,
              delay: sliceIndex * 0.05,
              ease: "power2.out"
            });

            // Remove piece after animation
            gsap.delayedCall(5 + sliceIndex * 0.1, () => {
              sceneRef.current?.remove(piece);
              piece.geometry.dispose();
              if (piece.material instanceof THREE.Material) {
                piece.material.dispose();
              }
            });
          }
          
          // Make layer thinner
          gsap.to(child.scale, {
            y: 0.3,
            duration: 0.3,
            delay: sliceIndex * 0.05
          });
        }
      }
    });
  };

  useEffect(() => {
    const cleanup = initThreeJS();
    return cleanup;
  }, [initThreeJS]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-screen sticky top-0 z-10"
      style={{
        background: 'transparent',
        touchAction: 'pan-y' // Allow vertical scrolling on mobile
      }}
    />
  );
}