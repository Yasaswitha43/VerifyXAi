import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

interface NodeData {
  name: string;
  category: string;
  color: string;
  glowColor: string;
  angle: number;
  radius: number;
  speed: number;
  yOffset: number;
  description: string;
}

export const DocumentIntelligenceCore3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Floating nodes data
  const nodes: NodeData[] = [
    { name: 'TEXT', category: 'Micro-Typography & OCR', color: '#06b6d4', glowColor: 'rgba(6, 182, 212, 0.4)', angle: 0, radius: 2.7, speed: 0.008, yOffset: 0.3, description: 'Kerning anomaly detection & subpixel font raster weights' },
    { name: 'IMAGE', category: 'Spectral & Compression', color: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.4)', angle: 1.25, radius: 2.9, speed: 0.007, yOffset: -0.4, description: 'Error Level Analysis (ELA) and generative synthesis noise' },
    { name: 'LAYOUT', category: 'Grid & Structural DNA', color: '#8b5cf6', glowColor: 'rgba(139, 92, 246, 0.4)', angle: 2.5, radius: 2.6, speed: 0.009, yOffset: 0.5, description: 'Mathematical alignment deviations and template distortion' },
    { name: 'METADATA', category: 'Cryptographic Provenance', color: '#10b981', glowColor: 'rgba(16, 185, 129, 0.4)', angle: 3.75, radius: 2.8, speed: 0.006, yOffset: -0.3, description: 'XMP editing history, EXIF timestamp forensics & SHA-256' },
    { name: 'RISK', category: 'Predictive Assessment', color: '#f43f5e', glowColor: 'rgba(244, 63, 94, 0.4)', angle: 5.0, radius: 3.1, speed: 0.0075, yOffset: 0.1, description: 'Multi-vector synthesis risk probability scoring' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0.8, 7.5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, theme === 'dark' ? 0.7 : 0.9);
    scene.add(ambientLight);

    const pointLightCyan = new THREE.PointLight(0x06b6d4, theme === 'dark' ? 3.5 : 2.5, 20);
    pointLightCyan.position.set(-3, 2, 4);
    scene.add(pointLightCyan);

    const pointLightViolet = new THREE.PointLight(0x8b5cf6, theme === 'dark' ? 3.5 : 2.5, 20);
    pointLightViolet.position.set(3, -2, 3);
    scene.add(pointLightViolet);

    const coreLight = new THREE.PointLight(0x38bdf8, 4.0, 10);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // 3. Central Glowing Intelligence Core
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner Glowing Core Sphere
    const innerGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0284c7,
      emissiveIntensity: theme === 'dark' ? 0.8 : 0.5,
      roughness: 0.2,
      metalness: 0.8
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerCore);

    // Outer Geodesic Wireframe Shell
    const outerGeo = new THREE.IcosahedronGeometry(1.25, 2);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: theme === 'dark' ? 0.35 : 0.25,
      roughness: 0.1
    });
    const outerWireframe = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerWireframe);

    // Secondary Nested Gyroscope Rings
    const ringGeo1 = new THREE.TorusGeometry(1.6, 0.015, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.4
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(1.9, 0.012, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.35
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    coreGroup.add(ring2);

    // 4. Floating Document Fragments (Transparent Glassy Geometric Layers)
    const docLayersGroup = new THREE.Group();
    scene.add(docLayersGroup);

    const docFragGeos = [
      new THREE.PlaneGeometry(1.1, 0.75),
      new THREE.PlaneGeometry(0.9, 0.65),
      new THREE.PlaneGeometry(0.8, 1.1),
      new THREE.PlaneGeometry(0.7, 0.5)
    ];

    const docFragments: THREE.Mesh[] = [];
    const fragPositions = [
      { x: -1.7, y: 1.1, z: 0.6, rotX: 0.2, rotY: 0.4, rotZ: 0.1 },
      { x: 1.8, y: -0.9, z: 0.8, rotX: -0.3, rotY: -0.5, rotZ: -0.1 },
      { x: 1.6, y: 1.3, z: -0.5, rotX: 0.4, rotY: -0.3, rotZ: 0.2 },
      { x: -1.5, y: -1.2, z: -0.4, rotX: -0.2, rotY: 0.6, rotZ: -0.2 }
    ];

    fragPositions.forEach((pos, idx) => {
      const mat = new THREE.MeshStandardMaterial({
        color: idx % 2 === 0 ? 0x0284c7 : 0x7c3aed,
        transparent: true,
        opacity: theme === 'dark' ? 0.22 : 0.18,
        roughness: 0.1,
        metalness: 0.5,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(docFragGeos[idx % docFragGeos.length], mat);
      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.rotation.set(pos.rotX, pos.rotY, pos.rotZ);

      // Add a subtle wireframe border to give document edge look
      const edges = new THREE.EdgesGeometry(docFragGeos[idx % docFragGeos.length]);
      const lineMat = new THREE.LineBasicMaterial({
        color: idx % 2 === 0 ? 0x38bdf8 : 0xa78bfa,
        transparent: true,
        opacity: 0.45
      });
      const line = new THREE.LineSegments(edges, lineMat);
      mesh.add(line);

      docLayersGroup.add(mesh);
      docFragments.push(mesh);
    });

    // 5. Orbital Feature Nodes (Text, Image, Layout, Metadata, Risk)
    const nodeObjectsGroup = new THREE.Group();
    scene.add(nodeObjectsGroup);

    const nodeMeshes: { mesh: THREE.Mesh; halo: THREE.Mesh; data: NodeData }[] = [];

    nodes.forEach(node => {
      const nodeGeo = new THREE.SphereGeometry(0.14, 16, 16);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(node.color),
        emissive: new THREE.Color(node.color),
        emissiveIntensity: 0.8,
        roughness: 0.2
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);

      // Pulsing halo around node
      const haloGeo = new THREE.SphereGeometry(0.24, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(node.color),
        transparent: true,
        opacity: 0.25,
        wireframe: true
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      nodeMesh.add(halo);

      nodeObjectsGroup.add(nodeMesh);
      nodeMeshes.push({ mesh: nodeMesh, halo, data: node });
    });

    // 6. Connecting Thin Dynamic Lines from Core to Nodes
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: theme === 'dark' ? 0.35 : 0.2
    });
    const linesGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(nodes.length * 2 * 3);
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const connectionLines = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(connectionLines);

    // 7. Ambient Particle Field
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleSpeeds: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      const r = 2.0 + Math.random() * 4.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePos[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      particlePos[i * 3 + 1] = r * Math.sin(phi);
      particlePos[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);

      particleSpeeds.push(0.2 + Math.random() * 0.5);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: theme === 'dark' ? 0x38bdf8 : 0x0284c7,
      size: 0.04,
      transparent: true,
      opacity: theme === 'dark' ? 0.6 : 0.35
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 8. Mouse Parallax & Smooth Lerp
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
      targetRotY = mouseX * 0.45;
      targetRotX = -mouseY * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 9. Resize Handling
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 10. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera / scene parallax
      scene.rotation.y += (targetRotY - scene.rotation.y) * 0.05;
      scene.rotation.x += (targetRotX - scene.rotation.x) * 0.05;

      // Core rotation & pulsation
      coreGroup.rotation.y = elapsed * 0.3;
      coreGroup.rotation.z = Math.sin(elapsed * 0.2) * 0.15;
      outerWireframe.rotation.x = elapsed * 0.25;
      outerWireframe.rotation.y = -elapsed * 0.35;

      const pulse = 1 + Math.sin(elapsed * 2.0) * 0.06;
      innerCore.scale.set(pulse, pulse, pulse);

      ring1.rotation.z = elapsed * 0.4;
      ring2.rotation.y = -elapsed * 0.35;

      // Document fragments slow floating
      docFragments.forEach((mesh, idx) => {
        mesh.position.y += Math.sin(elapsed * 1.2 + idx) * 0.0015;
        mesh.rotation.y += 0.002 * (idx % 2 === 0 ? 1 : -1);
      });

      // Orbiting nodes position updates
      const posArray = connectionLines.geometry.attributes.position.array as Float32Array;

      nodeMeshes.forEach((item, idx) => {
        const curAngle = item.data.angle + elapsed * item.data.speed * 8;
        const x = Math.cos(curAngle) * item.data.radius;
        const z = Math.sin(curAngle) * item.data.radius;
        const y = item.data.yOffset + Math.sin(elapsed * 1.5 + idx) * 0.2;

        item.mesh.position.set(x, y, z);
        item.halo.rotation.y = elapsed * 2;
        item.halo.rotation.z = elapsed * 1.5;

        // Line from core origin to node
        const pIdx = idx * 6;
        posArray[pIdx] = 0;
        posArray[pIdx + 1] = 0;
        posArray[pIdx + 2] = 0;

        posArray[pIdx + 3] = x;
        posArray[pIdx + 4] = y;
        posArray[pIdx + 5] = z;
      });

      connectionLines.geometry.attributes.position.needsUpdate = true;

      // Particle drifting
      particles.rotation.y = elapsed * 0.05;
      particles.rotation.x = Math.sin(elapsed * 0.03) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      scene.clear();
    };
  }, [theme]);

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setActiveNode(null); }}
      className="relative w-full h-[420px] md:h-[500px] lg:h-[560px] flex items-center justify-center overflow-hidden"
    >
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Subtle radial ambient background glow behind core */}
      <div 
        className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full pointer-events-none filter blur-3xl opacity-30 animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.4) 0%, rgba(139, 92, 246, 0.25) 50%, transparent 80%)'
        }}
      />

      {/* Futuristic status badge on top-left of the 3D container */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/60 dark:bg-slate-900/80 border border-cyan-500/20 backdrop-blur-md text-xs font-mono text-cyan-300 shadow-lg">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span className="tracking-wider">DOCUMENT INTELLIGENCE CORE v4.2</span>
      </div>

      {/* Interactive floating node indicators at bottom */}
      <div className="absolute bottom-4 inset-x-4 z-10 flex flex-wrap items-center justify-center gap-2 pointer-events-auto">
        {nodes.map(n => {
          const isActive = activeNode === n.name;
          return (
            <button
              key={n.name}
              onClick={() => setActiveNode(isActive ? null : n.name)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all duration-300 flex items-center gap-1.5 border backdrop-blur-md ${
                isActive 
                  ? 'bg-slate-900/90 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105' 
                  : 'bg-slate-900/50 text-slate-300 border-slate-700/60 hover:border-slate-500 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: n.color }} />
              <span className="font-semibold">{n.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active node detail pill if clicked */}
      {activeNode && (
        <div className="absolute top-16 right-4 max-w-xs z-10 p-3.5 rounded-xl bg-slate-900/90 dark:bg-slate-950/95 border border-cyan-500/30 backdrop-blur-xl shadow-2xl text-left animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-400">
              {nodes.find(n => n.name === activeNode)?.name} NODE
            </span>
            <button 
              onClick={() => setActiveNode(null)}
              className="text-slate-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
          <p className="text-xs font-medium text-slate-200 mb-1">
            {nodes.find(n => n.name === activeNode)?.category}
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {nodes.find(n => n.name === activeNode)?.description}
          </p>
        </div>
      )}

      {/* Bottom subtle instruction */}
      <div className="absolute bottom-1 right-3 text-[10px] font-mono text-slate-500 tracking-wider pointer-events-none hidden sm:block">
        ORBITAL PARALLAX ACTIVE
      </div>
    </div>
  );
};
