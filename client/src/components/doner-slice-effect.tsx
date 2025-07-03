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
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    // Create döner group
    const donerGroup = new THREE.Group();
    donerGroupRef.current = donerGroup;

    // Main döner cylinder
    const donerGeometry = new THREE.CylinderGeometry(1.0, 1.4, 6, 32, 20);
    const donerMaterial = new THREE.MeshPhongMaterial({
      color: 0xA0522D,
      shininess: 20,
      specular: 0x444444,
    });

    const donerMesh = new THREE.Mesh(donerGeometry, donerMaterial);
    donerMesh.castShadow = true;
    donerMesh.receiveShadow = true;
    donerGroup.add(donerMesh);

    // Döner layers with slice lines
    for (let i = 0; i < 20; i++) {
      const layerGeometry = new THREE.CylinderGeometry(1.05, 1.45, 0.15, 32);
      const layerMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.08, 0.8, 0.25 + Math.random() * 0.2),
        transparent: true,
        opacity: 0.8,
      });
      
      const layerMesh = new THREE.Mesh(layerGeometry, layerMaterial);
      layerMesh.position.y = -2.5 + (i * 0.25);
      layerMesh.userData = { originalY: layerMesh.position.y, sliceIndex: i };
      donerGroup.add(layerMesh);
    }

    // Döner skewer
    const skewGeometry = new THREE.CylinderGeometry(0.05, 0.05, 7, 8);
    const skewMaterial = new THREE.MeshPhongMaterial({
      color: 0x666666,
      shininess: 100,
    });
    
    const skewMesh = new THREE.Mesh(skewGeometry, skewMaterial);
    skewMesh.castShadow = true;
    donerGroup.add(skewMesh);

    // Hanging meat strips
    for (let i = 0; i < 24; i++) {
      const stripGeometry = new THREE.BoxGeometry(0.04, 0.3, 1.8);
      const stripMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.08, 0.8, 0.3 + Math.random() * 0.3),
        transparent: true,
        opacity: 0.9,
      });
      
      const stripMesh = new THREE.Mesh(stripGeometry, stripMaterial);
      const angle = (i / 24) * Math.PI * 2;
      const radius = 1.4 + Math.random() * 0.3;
      
      stripMesh.position.set(
        Math.cos(angle) * radius,
        -2 + Math.random() * 4,
        Math.sin(angle) * radius
      );
      stripMesh.rotation.y = angle;
      stripMesh.castShadow = true;
      donerGroup.add(stripMesh);
    }

    scene.add(donerGroup);

    // Create plate (initially below view)
    const plateGeometry = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const plateMaterial = new THREE.MeshPhongMaterial({
      color: 0xFFFFFF,
      shininess: 80,
    });
    
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    plate.position.y = -8;
    plate.castShadow = true;
    plate.receiveShadow = true;
    plateRef.current = plate;
    scene.add(plate);

    // Create knife
    const knifeGroup = new THREE.Group();
    knifeRef.current = knifeGroup;

    // Knife blade
    const bladeGeometry = new THREE.BoxGeometry(0.05, 0.8, 4);
    const bladeMaterial = new THREE.MeshPhongMaterial({
      color: 0xCCCCCC,
      shininess: 100,
      specular: 0x888888,
    });
    
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.position.set(2, 0, 0);
    knifeGroup.add(blade);

    // Knife handle
    const handleGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1, 8);
    const handleMaterial = new THREE.MeshPhongMaterial({
      color: 0x654321,
      shininess: 30,
    });
    
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(2.8, 0, 0);
    handle.rotation.z = Math.PI / 2;
    knifeGroup.add(handle);

    knifeGroup.position.set(4, 0, 0); // Start off-screen
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
        
        if (progress > 0.3 && progress < 0.7) {
          // Knife animation
          if (knifeRef.current) {
            knifeRef.current.position.x = 4 - (progress - 0.3) * 10;
            knifeRef.current.rotation.z = (progress - 0.3) * Math.PI * 4;
          }
          
          // Start slicing effect
          if (!isSlicing && progress > 0.4) {
            setIsSlicing(true);
            startSlicing();
          }
        }

        // Plate animation
        if (plateRef.current) {
          plateRef.current.position.y = -8 + progress * 6;
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
    if (!donerGroupRef.current) return;

    // Create falling slices
    donerGroupRef.current.children.forEach((child, index) => {
      if (child instanceof THREE.Mesh && child.userData.sliceIndex !== undefined) {
        const sliceIndex = child.userData.sliceIndex;
        
        // Animate slice falling
        gsap.to(child.position, {
          y: child.position.y - 6,
          x: (Math.random() - 0.5) * 2,
          z: (Math.random() - 0.5) * 2,
          duration: 1.5,
          delay: sliceIndex * 0.1,
          ease: "bounce.out"
        });

        gsap.to(child.rotation, {
          x: (Math.random() - 0.5) * Math.PI,
          z: (Math.random() - 0.5) * Math.PI,
          duration: 1.5,
          delay: sliceIndex * 0.1
        });
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