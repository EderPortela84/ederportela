import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    THREE: any;
  }
}

const CityBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Import Three.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    
    script.onload = () => {
      initScene();
    };
    
    document.head.appendChild(script);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rendererRef.current && mountRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initScene = () => {
    if (!mountRef.current || !window.THREE) return;

    const { THREE } = window;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x222222, 1, 1000);
    
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current!.clientWidth / mountRef.current!.clientHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current!.clientWidth, mountRef.current!.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    mountRef.current!.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // City group
    const cityGroup = new THREE.Group();
    
    // Create buildings
    const buildings = [];
    const buildingCount = 40;
    
    for (let i = 0; i < buildingCount; i++) {
      const height = Math.random() * 8 + 2;
      const width = Math.random() * 1.5 + 0.5;
      const depth = Math.random() * 1.5 + 0.5;
      
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color().setHSL(0.6, 0.3, Math.random() * 0.3 + 0.1)
      });
      
      const building = new THREE.Mesh(geometry, material);
      building.castShadow = true;
      building.receiveShadow = true;
      
      // Position buildings in a grid with some randomness
      const angle = (i / buildingCount) * Math.PI * 2;
      const radius = Math.random() * 15 + 8;
      building.position.x = Math.cos(angle) * radius + (Math.random() - 0.5) * 3;
      building.position.y = height / 2;
      building.position.z = Math.sin(angle) * radius + (Math.random() - 0.5) * 3;
      
      // Add some windows (glowing cubes)
      const windowCount = Math.floor(height * 2);
      for (let w = 0; w < windowCount; w++) {
        if (Math.random() > 0.7) {
          const windowGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
          const windowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff88,
            transparent: true,
            opacity: 0.8
          });
          const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
          windowMesh.position.x = (Math.random() - 0.5) * width * 0.8;
          windowMesh.position.y = (Math.random() - 0.5) * height * 0.8;
          windowMesh.position.z = width / 2 + 0.05;
          building.add(windowMesh);
        }
      }
      
      buildings.push(building);
      cityGroup.add(building);
    }
    
    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x111111 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    cityGroup.add(ground);
    
    scene.add(cityGroup);
    
    // Camera position
    camera.position.set(0, 15, 25);
    camera.lookAt(0, 0, 0);
    
    sceneRef.current = scene;
    rendererRef.current = renderer;
    
    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Rotate the entire city
      cityGroup.rotation.y += 0.002;
      
      // Animate some buildings slightly
      buildings.forEach((building, index) => {
        building.rotation.y += Math.sin(Date.now() * 0.001 + index) * 0.0001;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  };

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 opacity-20"
      style={{ zIndex: -1 }}
    />
  );
};

export default CityBackground;