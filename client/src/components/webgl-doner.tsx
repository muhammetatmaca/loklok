import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function WebGLDoner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const donerGroupRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number | null>(null);

  const initThreeJS = useCallback(() => {
    if (!containerRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);
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
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    // Create döner group
    const donerGroup = new THREE.Group();
    donerGroupRef.current = donerGroup;

    // Create döner geometry - Main cylinder
    const donerGeometry = new THREE.CylinderGeometry(1.2, 1.5, 5, 32, 8);
    
    // Create realistic döner material
    const donerMaterial = new THREE.MeshPhongMaterial({
      color: 0x8B4513,
      shininess: 30,
      specular: 0x222222,
    });

    const donerMesh = new THREE.Mesh(donerGeometry, donerMaterial);
    donerMesh.castShadow = true;
    donerMesh.receiveShadow = true;
    donerGroup.add(donerMesh);

    // Add meat texture layers
    for (let i = 0; i < 8; i++) {
      const layerGeometry = new THREE.RingGeometry(1.1, 1.6, 16);
      const layerMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.08, 0.6, 0.4 + Math.random() * 0.2),
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      });
      
      const layerMesh = new THREE.Mesh(layerGeometry, layerMaterial);
      layerMesh.position.y = -2 + (i * 0.5);
      layerMesh.rotation.z = Math.random() * Math.PI * 2;
      layerMesh.castShadow = true;
      donerGroup.add(layerMesh);
    }

    // Döner skewer
    const skewGeometry = new THREE.CylinderGeometry(0.05, 0.05, 6, 8);
    const skewMaterial = new THREE.MeshPhongMaterial({
      color: 0x666666,
      shininess: 100,
      specular: 0x111111,
    });
    
    const skewMesh = new THREE.Mesh(skewGeometry, skewMaterial);
    skewMesh.castShadow = true;
    donerGroup.add(skewMesh);

    // Add hanging meat strips
    for (let i = 0; i < 20; i++) {
      const stripGeometry = new THREE.BoxGeometry(0.08, 0.3, 1.5);
      const stripMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.08, 0.7, 0.35 + Math.random() * 0.25),
        transparent: true,
        opacity: 0.8,
      });
      
      const stripMesh = new THREE.Mesh(stripGeometry, stripMaterial);
      const angle = (i / 20) * Math.PI * 2;
      const radius = 1.5 + Math.random() * 0.3;
      
      stripMesh.position.set(
        Math.cos(angle) * radius,
        -1 + Math.random() * 2,
        Math.sin(angle) * radius
      );
      stripMesh.rotation.y = angle;
      stripMesh.castShadow = true;
      donerGroup.add(stripMesh);
    }

    scene.add(donerGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xFF6B35, 1, 10);
    pointLight.position.set(-3, 0, 3);
    pointLight.castShadow = true;
    scene.add(pointLight);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (donerGroup) {
        donerGroup.rotation.y += 0.005;
        donerGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // GSAP ScrollTrigger animation
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(donerGroup.rotation, {
      y: Math.PI * 4,
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    gsap.to(donerGroup.scale, {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "center center",
        scrub: 1,
      }
    });

    gsap.to(donerGroup.position, {
      x: 2,
      y: 1,
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
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
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
  }, []);

  useEffect(() => {
    const cleanup = initThreeJS();
    return cleanup;
  }, [initThreeJS]);

  return (
    <div 
      ref={containerRef}
      className="fixed right-8 top-1/2 -translate-y-1/2 z-20 w-80 h-96 pointer-events-none"
      style={{
        background: 'radial-gradient(circle at center, rgba(255, 107, 53, 0.1) 0%, transparent 70%)'
      }}
    />
  );
}