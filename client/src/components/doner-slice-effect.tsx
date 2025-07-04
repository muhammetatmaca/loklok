import { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import donerImage from '@assets/image_1751586220043.png';

export default function DonerSliceEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const donerGroupRef = useRef<THREE.Group | null>(null);
  const plateRef = useRef<THREE.Mesh | null>(null);
  const knifeRef = useRef<THREE.Group | null>(null);
  const slicesRef = useRef<THREE.Group[]>([]);
  const animationIdRef = useRef<number | null>(null);
  const [isSlicing, setIsSlicing] = useState(false);

  const initThreeJS = useCallback(() => {
    if (!containerRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    // Camera - better angle to see everything
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(3, 2, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    // Create döner group
    const donerGroup = new THREE.Group();
    donerGroupRef.current = donerGroup;

    // Layered döner like in the image - tapered shape
    const layers = [];
    const totalHeight = 6;
    const layerCount = 30;
    const layerHeight = totalHeight / layerCount;

    for (let i = 0; i < layerCount; i++) {
      const progress = i / layerCount; // 0 to 1 from bottom to top
      const yPos = -totalHeight/2 + (i * layerHeight);
      
      // Tapered shape - wider at bottom, narrower at top
      const bottomRadius = 1.6 - (progress * 0.6); // 1.6 to 1.0
      const topRadius = 1.5 - (progress * 0.5); // 1.5 to 1.0
      
      const layerGeometry = new THREE.CylinderGeometry(topRadius, bottomRadius, layerHeight * 0.9, 32);
      
      // Alternating colors for meat layers like in the image
      const baseHue = 0.08; // Brown base
      const saturation = 0.7 + Math.random() * 0.2;
      const lightness = 0.2 + Math.random() * 0.3;
      
      // Some layers darker (cooked meat), some lighter
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
      layerMesh.castShadow = true;
      layerMesh.receiveShadow = true;
      
      layers.push(layerMesh);
      donerGroup.add(layerMesh);
    }

    // Döner hook at the top (like in the image)
    const hookGeometry = new THREE.TorusGeometry(0.3, 0.08, 8, 16, Math.PI);
    const hookMaterial = new THREE.MeshPhongMaterial({
      color: 0x444444,
      shininess: 100,
    });
    
    const hook = new THREE.Mesh(hookGeometry, hookMaterial);
    hook.position.y = totalHeight/2 + 0.5;
    hook.rotation.x = Math.PI;
    hook.castShadow = true;
    donerGroup.add(hook);

    // Döner skewer (thinner, like in image)
    const skewGeometry = new THREE.CylinderGeometry(0.04, 0.04, totalHeight + 1, 8);
    const skewMaterial = new THREE.MeshPhongMaterial({
      color: 0x555555,
      shininess: 100,
    });
    
    const skewMesh = new THREE.Mesh(skewGeometry, skewMaterial);
    skewMesh.castShadow = true;
    donerGroup.add(skewMesh);

    // Small cap at bottom
    const bottomCapGeometry = new THREE.SphereGeometry(0.15, 16, 8);
    const bottomCap = new THREE.Mesh(bottomCapGeometry, hookMaterial);
    bottomCap.position.y = -totalHeight/2 - 0.3;
    donerGroup.add(bottomCap);

    scene.add(donerGroup);

    // Create plate (larger and more visible)
    const plateGeometry = new THREE.CylinderGeometry(2.5, 2.5, 0.3, 32);
    const plateMaterial = new THREE.MeshPhongMaterial({
      color: 0xF5F5F5,
      shininess: 60,
      specular: 0x444444,
    });
    
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    plate.position.y = -4;
    plate.castShadow = true;
    plate.receiveShadow = true;
    plateRef.current = plate;
    scene.add(plate);

    // Add plate rim for better visibility
    const rimGeometry = new THREE.TorusGeometry(2.5, 0.1, 8, 32);
    const rimMaterial = new THREE.MeshPhongMaterial({
      color: 0xE0E0E0,
      shininess: 80,
    });
    
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.position.y = -3.8;
    rim.rotation.x = Math.PI / 2;
    scene.add(rim);

    // Create knife (larger and more visible)
    const knifeGroup = new THREE.Group();
    knifeRef.current = knifeGroup;

    // Knife blade (thinner)
    const bladeGeometry = new THREE.BoxGeometry(0.02, 1.2, 4);
    const bladeMaterial = new THREE.MeshPhongMaterial({
      color: 0xE8E8E8,
      shininess: 120,
      specular: 0xAAAAAA,
      reflectivity: 0.8,
    });
    
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.position.set(0, 0, 0);
    blade.castShadow = true;
    knifeGroup.add(blade);

    // Knife handle (bigger)
    const handleGeometry = new THREE.CylinderGeometry(0.2, 0.18, 1.5, 8);
    const handleMaterial = new THREE.MeshPhongMaterial({
      color: 0x4A2C17,
      shininess: 40,
    });
    
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(0, 0, -4);
    handle.rotation.x = Math.PI / 2;
    handle.castShadow = true;
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

    knifeGroup.position.set(2, 6, 0); // Start above döner
    knifeGroup.rotation.x = Math.PI / 6; // Tilt to point handle away from user
    knifeGroup.rotation.y = Math.PI; // Rotate 180 degrees so tip points left, handle points right
    knifeGroup.rotation.z = 0; // No z rotation needed now
    scene.add(knifeGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xFF6B35, 1, 10);
    pointLight.position.set(-3, 0, 3);
    scene.add(pointLight);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (donerGroup && !isSlicing) {
        donerGroup.rotation.y += 0.01;
      }

      // Knife cutting animation (back and forth)
      if (knifeGroup && !isSlicing) {
        const time = Date.now() * 0.002;
        knifeGroup.position.x = 2 + Math.sin(time) * 0.3; // Gentle back and forth movement
        knifeGroup.rotation.y = Math.sin(time * 0.7) * 0.1; // Slight rotation for cutting motion
      }

      renderer.render(scene, camera);
    };

    animate();

    // GSAP ScrollTrigger animations
    gsap.registerPlugin(ScrollTrigger);

    // Scroll-triggered slicing animation
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top center",
      end: "bottom center",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        
        if (progress > 0.2 && progress < 0.8) {
          // Knife animation - top-down slicing with cutting motion
          if (knifeRef.current) {
            const sliceProgress = (progress - 0.2) / 0.6; // 0 to 1
            knifeRef.current.position.y = 6 - sliceProgress * 8; // Move from top to bottom
            knifeRef.current.position.x = 2 + Math.sin(sliceProgress * Math.PI * 4) * 0.15; // Cutting motion
          }
          
          // Start slicing effect
          if (!isSlicing && progress > 0.4) {
            setIsSlicing(true);
            startSlicing();
          }
        }

        // Plate animation - stays below döner
        if (plateRef.current) {
          plateRef.current.position.y = -4; // Fixed position below döner
        }
      }
    });

    // Handle resize
    const handleResize = () => {
      if (containerRef.current && camera && renderer) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

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

    const platePosition = plateRef.current.position;

    // Create falling meat slices (individual pieces, not layers)
    donerGroupRef.current.children.forEach((child, index) => {
      if (child instanceof THREE.Mesh && child.userData.isSliceable) {
        const sliceIndex = child.userData.sliceIndex;
        
        // Only slice some layers randomly
        if (Math.random() > 0.05) { // Almost all layers will be sliced
          // Create small meat pieces that fall
          for (let i = 0; i < 8; i++) { // More pieces per layer
            const pieceGeometry = new THREE.BoxGeometry(
              0.1 + Math.random() * 0.05, // Smaller pieces
              0.05 + Math.random() * 0.03,
              0.1 + Math.random() * 0.05
            );
            const pieceMaterial = new THREE.MeshPhongMaterial({
              color: new THREE.Color(0xFF6B35), // Bright orange meat color
              shininess: 50,
              specular: 0x666666,
              emissive: new THREE.Color(0x331100), // Add glow
            });
            
            const piece = new THREE.Mesh(pieceGeometry, pieceMaterial);
            piece.position.copy(child.position);
            piece.position.x += (Math.random() - 0.5) * 1.0; // More spread
            piece.position.z += (Math.random() - 0.5) * 1.0;
            piece.position.y += 0.5; // Start higher for better visibility
            piece.castShadow = true;
            piece.receiveShadow = true;
            
            sceneRef.current?.add(piece);
            
            // Animate piece falling to plate (within plate bounds)
            const plateRadius = 2.2; // Slightly smaller than plate to stay within bounds
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * plateRadius * 0.8; // Stay within 80% of plate radius
            
            gsap.to(piece.position, {
              x: Math.cos(angle) * distance, // Polar coordinates to stay on plate
              y: -3.5, // Just above the plate
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

            // Remove piece after animation (longer duration)
            gsap.delayedCall(5 + sliceIndex * 0.1, () => {
              sceneRef.current?.remove(piece);
              piece.geometry.dispose();
              if (piece.material instanceof THREE.Material) {
                piece.material.dispose();
              }
            });
          }
          
          // Make the original layer thinner (sliced)
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
      className="absolute right-4 top-32 z-20 w-80 h-96 pointer-events-none"
      style={{
        background: 'radial-gradient(circle at center, rgba(255, 107, 53, 0.05) 0%, transparent 80%)'
      }}
    />
  );
}