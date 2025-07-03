import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ThreeDoner() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const donerRef = useRef<THREE.Group | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Create 3D Döner Model
    const donerGroup = new THREE.Group();
    donerRef.current = donerGroup;

    // Create realistic döner texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create gradient base
      const gradient = ctx.createLinearGradient(0, 0, 512, 512);
      gradient.addColorStop(0, '#8B4513');
      gradient.addColorStop(0.3, '#CD853F');
      gradient.addColorStop(0.6, '#D2691E');
      gradient.addColorStop(1, '#A0522D');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
      
      // Add meat texture details
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = Math.random() * 8 + 2;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${139 + Math.random() * 50}, ${69 + Math.random() * 50}, ${19 + Math.random() * 30}, 0.6)`;
        ctx.fill();
      }
      
      // Add char marks
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const width = Math.random() * 20 + 5;
        const height = Math.random() * 3 + 1;
        
        ctx.fillStyle = `rgba(${50 + Math.random() * 30}, ${30 + Math.random() * 20}, ${10 + Math.random() * 15}, 0.8)`;
        ctx.fillRect(x, y, width, height);
      }
    }
    
    const donerTexture = new THREE.CanvasTexture(canvas);
    donerTexture.wrapS = THREE.RepeatWrapping;
    donerTexture.wrapT = THREE.RepeatWrapping;
    donerTexture.repeat.set(4, 2);

    // Döner cylinder (main meat) - more realistic proportions
    const donerGeometry = new THREE.CylinderGeometry(1.0, 1.3, 4.5, 32, 16);
    const donerMaterial = new THREE.MeshPhysicalMaterial({
      map: donerTexture,
      roughness: 0.9,
      metalness: 0.02,
      clearcoat: 0.1,
      clearcoatRoughness: 0.9,
      transmission: 0.0,
      ior: 1.4,
    });
    
    const donerMesh = new THREE.Mesh(donerGeometry, donerMaterial);
    donerMesh.castShadow = true;
    donerMesh.receiveShadow = true;
    donerGroup.add(donerMesh);

    // Döner layers (meat strips) - more realistic
    for (let i = 0; i < 12; i++) {
      const stripGeometry = new THREE.BoxGeometry(0.1, 0.3, 2.8);
      const stripMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(0.08, 0.7, 0.35 + Math.random() * 0.25),
        roughness: 0.95,
        metalness: 0.01,
        transparent: true,
        opacity: 0.85,
      });
      
      const stripMesh = new THREE.Mesh(stripGeometry, stripMaterial);
      const angle = (i / 12) * Math.PI * 2;
      const radius = 1.4 + Math.random() * 0.2;
      
      stripMesh.position.set(
        Math.cos(angle) * radius,
        -2 + Math.random() * 4,
        Math.sin(angle) * radius
      );
      stripMesh.rotation.y = angle;
      stripMesh.rotation.z = (Math.random() - 0.5) * 0.3;
      stripMesh.castShadow = true;
      donerGroup.add(stripMesh);
    }

    // Döner skewer (metal rod)
    const skewGeometry = new THREE.CylinderGeometry(0.08, 0.08, 5.5, 8);
    const skewMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x888888),
      roughness: 0.2,
      metalness: 0.9,
      clearcoat: 1.0,
    });
    
    const skewMesh = new THREE.Mesh(skewGeometry, skewMaterial);
    skewMesh.castShadow = true;
    donerGroup.add(skewMesh);

    // Döner top cap
    const capGeometry = new THREE.SphereGeometry(0.3, 16, 8);
    const capMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x666666),
      roughness: 0.3,
      metalness: 0.8,
    });
    
    const capMesh = new THREE.Mesh(capGeometry, capMaterial);
    capMesh.position.y = 2.5;
    capMesh.castShadow = true;
    donerGroup.add(capMesh);

    scene.add(donerGroup);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    // Point light for warm glow
    const pointLight = new THREE.PointLight(0xFF6B35, 1.5, 10);
    pointLight.position.set(-3, 0, 3);
    pointLight.castShadow = true;
    scene.add(pointLight);

    // Spot light for dramatic effect
    const spotLight = new THREE.SpotLight(0xFFD700, 2, 15, Math.PI / 6, 0.5, 2);
    spotLight.position.set(0, 8, 0);
    spotLight.target = donerGroup;
    spotLight.castShadow = true;
    scene.add(spotLight);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      // Continuous rotation
      if (donerRef.current) {
        donerRef.current.rotation.y += 0.01;
        donerRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // GSAP ScrollTrigger animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: mountRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          if (donerRef.current) {
            // Zoom and position based on scroll
            const progress = self.progress;
            
            // Scale effect
            const scale = 0.8 + (progress * 0.6);
            donerRef.current.scale.set(scale, scale, scale);
            
            // Position movement
            donerRef.current.position.y = Math.sin(progress * Math.PI * 2) * 2;
            donerRef.current.position.x = Math.cos(progress * Math.PI * 4) * 1;
            
            // Rotation speed based on scroll
            donerRef.current.rotation.z = progress * Math.PI * 2;
            
            // Camera movement
            camera.position.z = 8 - (progress * 3);
            camera.position.y = progress * 2;
            
            // Lighting intensity
            pointLight.intensity = 1.5 + (progress * 2);
            spotLight.intensity = 2 + (progress * 3);
          }
        }
      }
    });

    // Parallax effect
    gsap.to(donerGroup.rotation, {
      y: Math.PI * 4,
      scrollTrigger: {
        trigger: mountRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 2,
      }
    });

    // Handle resize
    const handleResize = () => {
      if (mountRef.current && camera && renderer) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      
      // Dispose geometries and materials
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      });
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed right-8 top-1/2 -translate-y-1/2 z-20 w-96 h-96 pointer-events-none"
      style={{ 
        background: 'radial-gradient(circle at center, rgba(255, 107, 53, 0.1) 0%, transparent 70%)'
      }}
    />
  );
}