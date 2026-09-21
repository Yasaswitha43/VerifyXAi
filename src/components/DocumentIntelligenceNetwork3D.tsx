import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { Cpu, FileText, Image as ImageIcon, LayoutGrid, Hash, AlertTriangle, Sparkles, Activity } from 'lucide-react';

export type ForensicVector = 'OCR' | 'TEXT' | 'IMAGE' | 'LAYOUT' | 'METADATA' | 'RISK';

interface DocumentIntelligenceNetwork3DProps {
  onSelectVector?: (vector: ForensicVector) => void;
  activeVector?: ForensicVector | null;
  className?: string;
}

export const DocumentIntelligenceNetwork3D: React.FC<DocumentIntelligenceNetwork3DProps> = ({
  onSelectVector,
  activeVector: externalActiveVector,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  const [hoveredVector, setHoveredVector] = useState<ForensicVector | null>(null);
  const activeVector = externalActiveVector || hoveredVector;

  // Labels config around the 3D scene
  const vectorLabels: Array<{
    id: ForensicVector;
    label: string;
    sublabel: string;
    icon: typeof Cpu;
    color: string;
    posClass: string;
    description: string;
    metrics: string;
  }> = [
    {
      id: 'OCR',
      label: 'OCR',
      sublabel: 'Optical Character Engine',
      icon: Cpu,
      color: '#06b6d4',
      posClass: 'top-8 left-4 sm:left-10',
      description: 'Synthetic glyph recognition & contour scanning',
      metrics: 'Recall: 99.8%'
    },
    {
      id: 'TEXT',
      label: 'TEXT',
      sublabel: 'Font Vector & Kerning',
      icon: FileText,
      color: '#38bdf8',
      posClass: 'top-32 right-4 sm:right-10',
      description: 'Subpixel font anti-aliasing & baseline variance',
      metrics: '0.05px Drift'
    },
    {
      id: 'IMAGE',
      label: 'IMAGE',
      sublabel: 'Error Level Analysis (ELA)',
      icon: ImageIcon,
      color: '#818cf8',
      posClass: 'bottom-28 left-4 sm:left-12',
      description: 'DCT compression entropy & pixel resampling',
      metrics: 'DCT 8x8 Grid'
    },
    {
      id: 'LAYOUT',
      label: 'LAYOUT',
      sublabel: 'Structural Grid Geometry',
      icon: LayoutGrid,
      color: '#a855f7',
      posClass: 'bottom-32 right-4 sm:right-12',
      description: 'Mathematical margin & bounding box alignment',
      metrics: 'Delta: 0.12mm'
    },
    {
      id: 'METADATA',
      label: 'METADATA',
      sublabel: 'Cryptographic Provenance',
      icon: Hash,
      color: '#10b981',
      posClass: 'top-1/2 left-2 sm:left-6 -translate-y-1/2',
      description: 'XMP revision tree & SHA-256 integrity hash',
      metrics: 'Signed SHA-256'
    },
    {
      id: 'RISK',
      label: 'RISK',
      sublabel: 'Predictive Anomaly Score',
      icon: AlertTriangle,
      color: '#f43f5e',
      posClass: 'top-1/2 right-2 sm:right-6 -translate-y-1/2',
      description: 'Multi-vector anomaly probability synthesis',
      metrics: 'Risk: 88.4 / 100'
    }
  ];

  // Helper to generate procedural canvas textures for documents and OCR
  const createDocumentTexture = useCallback((type: 'doc' | 'ocr' | 'matrix' | 'hash') => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.clearRect(0, 0, 512, 512);

    if (type === 'doc') {
      // Document frame with text lines & header
      ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.fillRect(20, 20, 472, 472);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, 472, 472);

      // Top title bar
      ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.fillRect(50, 50, 240, 24);
      ctx.fillRect(320, 50, 140, 16);

      // Document body text lines
      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
      for (let y = 110; y < 380; y += 28) {
        const w = (y % 56 === 0) ? 320 : 410;
        ctx.fillRect(50, y, w, 12);
      }

      // Stamp or seal in corner
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(380, 410, 45, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(244, 63, 94, 0.2)';
      ctx.fill();

      // Stamp text
      ctx.fillStyle = 'rgba(244, 63, 94, 0.9)';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('VERIFIED', 380, 414);
    } else if (type === 'ocr') {
      // OCR Scanning matrix with bounding boxes
      ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
      ctx.fillRect(10, 10, 492, 492);

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, 492, 492);

      // OCR Bounding boxes & confidence tags
      const boxes = [
        { x: 40, y: 50, w: 200, h: 40, tag: 'OCR: 99.4%' },
        { x: 260, y: 50, w: 210, h: 40, tag: 'OCR: 98.7%' },
        { x: 40, y: 120, w: 430, h: 50, tag: 'KERNING: +0.08px [ANOMALY]' },
        { x: 40, y: 200, w: 320, h: 45, tag: 'FONT: HELVETICA_MOD' },
        { x: 40, y: 270, w: 430, h: 140, tag: 'DCT COMPRESSION: 8x8' }
      ];

      boxes.forEach(b => {
        ctx.strokeStyle = b.tag.includes('ANOMALY') ? 'rgba(244, 63, 94, 0.9)' : 'rgba(56, 189, 248, 0.7)';
        ctx.strokeRect(b.x, b.y, b.w, b.h);
        ctx.fillStyle = b.tag.includes('ANOMALY') ? 'rgba(244, 63, 94, 0.15)' : 'rgba(6, 182, 212, 0.1)';
        ctx.fillRect(b.x, b.y, b.w, b.h);

        ctx.fillStyle = b.tag.includes('ANOMALY') ? 'rgba(244, 63, 94, 0.95)' : 'rgba(6, 182, 212, 0.9)';
        ctx.font = 'bold 15px monospace';
        ctx.fillText(b.tag, b.x + 10, b.y + 26);
      });
    } else if (type === 'matrix') {
      // Forensic ELA Discrete Cosine Grid
      ctx.fillStyle = 'rgba(139, 92, 246, 0.05)';
      ctx.fillRect(0, 0, 512, 512);

      const step = 32;
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.25)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 512; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
      }

      // Hotspot in center
      const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 180);
      grad.addColorStop(0, 'rgba(244, 63, 94, 0.6)');
      grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.3)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
    } else {
      // Metadata & Hash stream
      ctx.fillStyle = 'rgba(16, 185, 129, 0.05)';
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
      ctx.strokeRect(10, 10, 492, 492);

      ctx.fillStyle = 'rgba(16, 185, 129, 0.85)';
      ctx.font = '16px monospace';
      ctx.fillText('SHA-256: e3b0c44298fc1c149afb...', 30, 60);
      ctx.fillText('TIMESTAMP: 2026-09-21T07:22:19Z', 30, 110);
      ctx.fillText('ISO/IEC 27037 FORENSIC CHAIN: OK', 30, 160);
      ctx.fillText('PROVENANCE: MULTI-LAYER TAMPERING', 30, 210);
      ctx.fillText('CONFIDENCE: 99.82% ANOMALY DETECTED', 30, 260);
      ctx.fillText('DNA PROFILE: [0x4F, 0x8A, 0x12, 0x99]', 30, 310);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const isDark = theme === 'dark';

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 8.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // 3. Lighting with soft cyan, blue, violet & depth
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.8 : 1.1);
    scene.add(ambientLight);

    const lightCyan = new THREE.PointLight(0x06b6d4, isDark ? 4.0 : 2.5, 25);
    lightCyan.position.set(-4, 3, 5);
    scene.add(lightCyan);

    const lightViolet = new THREE.PointLight(0x8b5cf6, isDark ? 4.0 : 2.5, 25);
    lightViolet.position.set(4, -3, 4);
    scene.add(lightViolet);

    const lightSky = new THREE.PointLight(0x38bdf8, isDark ? 3.0 : 2.0, 20);
    lightSky.position.set(0, 0, 6);
    scene.add(lightSky);

    // 4. Main Network Container Group (subject to parallax & rotation)
    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    // 5. Central Document Intelligence Core Structure
    // Multi-ring gyroscope rotating in 3D
    const ringGroup = new THREE.Group();
    networkGroup.add(ringGroup);

    const ringMat1 = new THREE.MeshBasicMaterial({
      color: isDark ? 0x06b6d4 : 0x0891b2,
      transparent: true,
      opacity: isDark ? 0.45 : 0.35,
      wireframe: true
    });
    const ringGeo1 = new THREE.TorusGeometry(2.4, 0.02, 16, 120);
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: isDark ? 0x8b5cf6 : 0x7c3aed,
      transparent: true,
      opacity: isDark ? 0.4 : 0.3,
      wireframe: true
    });
    const ringGeo2 = new THREE.TorusGeometry(3.0, 0.02, 16, 120);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    ringGroup.add(ring2);

    const ringMat3 = new THREE.MeshBasicMaterial({
      color: isDark ? 0x38bdf8 : 0x0284c7,
      transparent: true,
      opacity: isDark ? 0.35 : 0.25
    });
    const ringGeo3 = new THREE.TorusGeometry(3.6, 0.015, 16, 120);
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
    ring3.rotation.z = Math.PI / 5;
    ringGroup.add(ring3);

    // 6. Floating Document Fragments (Translucent Strata)
    const fragmentsGroup = new THREE.Group();
    networkGroup.add(fragmentsGroup);

    const docTex = createDocumentTexture('doc');
    const ocrTex = createDocumentTexture('ocr');
    const matTex = createDocumentTexture('matrix');
    const hashTex = createDocumentTexture('hash');

    const fragmentConfigs = [
      { texture: docTex, w: 1.8, h: 2.3, x: -2.2, y: 1.2, z: 0.8, rotX: 0.15, rotY: 0.35, rotZ: -0.1 },
      { texture: ocrTex, w: 1.6, h: 2.1, x: 2.4, y: 0.8, z: 0.6, rotX: -0.2, rotY: -0.4, rotZ: 0.15 },
      { texture: matTex, w: 1.9, h: 1.9, x: -2.0, y: -1.4, z: -0.4, rotX: 0.3, rotY: 0.2, rotZ: -0.25 },
      { texture: hashTex, w: 1.7, h: 2.2, x: 2.1, y: -1.2, z: 0.2, rotX: -0.25, rotY: -0.3, rotZ: 0.1 }
    ];

    const fragmentMeshes: THREE.Mesh[] = [];

    fragmentConfigs.forEach((cfg) => {
      const geo = new THREE.PlaneGeometry(cfg.w, cfg.h);
      const mat = new THREE.MeshStandardMaterial({
        map: cfg.texture,
        transparent: true,
        opacity: isDark ? 0.85 : 0.75,
        roughness: 0.2,
        metalness: 0.3,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(cfg.x, cfg.y, cfg.z);
      mesh.rotation.set(cfg.rotX, cfg.rotY, cfg.rotZ);

      // Wireframe border
      const edges = new THREE.EdgesGeometry(geo);
      const lineMat = new THREE.LineBasicMaterial({
        color: isDark ? 0x06b6d4 : 0x0284c7,
        transparent: true,
        opacity: isDark ? 0.6 : 0.4
      });
      const wire = new THREE.LineSegments(edges, lineMat);
      mesh.add(wire);

      fragmentsGroup.add(mesh);
      fragmentMeshes.push(mesh);
    });

    // 7. Glowing 3D Forensic Data Nodes
    const nodeCoords = [
      { id: 'OCR', pos: new THREE.Vector3(-3.2, 1.8, 1.2), color: 0x06b6d4 },
      { id: 'TEXT', pos: new THREE.Vector3(3.2, 1.6, 1.0), color: 0x38bdf8 },
      { id: 'IMAGE', pos: new THREE.Vector3(-3.0, -1.8, 0.8), color: 0x818cf8 },
      { id: 'LAYOUT', pos: new THREE.Vector3(3.0, -1.7, 0.5), color: 0xa855f7 },
      { id: 'METADATA', pos: new THREE.Vector3(-3.6, 0.1, 1.4), color: 0x10b981 },
      { id: 'RISK', pos: new THREE.Vector3(3.6, 0.0, 1.3), color: 0xf43f5e }
    ];

    const nodeMeshes: THREE.Mesh[] = [];
    nodeCoords.forEach((nc) => {
      const nodeGeo = new THREE.OctahedronGeometry(0.22, 1);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: nc.color,
        emissive: nc.color,
        emissiveIntensity: isDark ? 0.9 : 0.6,
        roughness: 0.1,
        metalness: 0.9
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(nc.pos);
      networkGroup.add(nodeMesh);
      nodeMeshes.push(nodeMesh);

      // Halo ring around node
      const haloGeo = new THREE.RingGeometry(0.32, 0.36, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: nc.color,
        transparent: true,
        opacity: isDark ? 0.5 : 0.35,
        side: THREE.DoubleSide
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.lookAt(camera.position);
      nodeMesh.add(halo);
    });

    // 8. Connected Neural-Style Lattice Lines
    // Generating interconnected bezier/line network between nodes & document fragments
    const linePoints: THREE.Vector3[] = [];
    const centerPoint = new THREE.Vector3(0, 0, 0);

    nodeCoords.forEach((nc) => {
      linePoints.push(nc.pos, centerPoint);
      fragmentMeshes.forEach(fm => {
        if (nc.pos.distanceTo(fm.position) < 3.8) {
          linePoints.push(nc.pos, fm.position);
        }
      });
    });

    // Connect adjacent nodes
    for (let i = 0; i < nodeCoords.length; i++) {
      const next = (i + 1) % nodeCoords.length;
      linePoints.push(nodeCoords[i].pos, nodeCoords[next].pos);
    }

    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMat = new THREE.LineBasicMaterial({
      color: isDark ? 0x06b6d4 : 0x0284c7,
      transparent: true,
      opacity: isDark ? 0.25 : 0.18
    });
    const neuralLines = new THREE.LineSegments(lineGeo, lineMat);
    networkGroup.add(neuralLines);

    // 9. Floating Forensic Particles (Dust / Data Points)
    const particleCount = 280;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);

    const cyanC = new THREE.Color(0x06b6d4);
    const violetC = new THREE.Color(0x8b5cf6);
    const skyC = new THREE.Color(0x38bdf8);
    const alertC = new THREE.Color(0xf43f5e);

    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 14;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      let c = cyanC;
      const r = Math.random();
      if (r < 0.3) c = violetC;
      else if (r < 0.6) c = skyC;
      else if (r < 0.75) c = alertC;

      pColors[i * 3] = c.r;
      pColors[i * 3 + 1] = c.g;
      pColors[i * 3 + 2] = c.b;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.7 : 0.5
    });
    const particles = new THREE.Points(pGeo, pMat);
    networkGroup.add(particles);

    // 10. Center Intelligence Hexagonal Core
    const coreGeo = new THREE.IcosahedronGeometry(0.85, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: isDark ? 0x0369a1 : 0x0284c7,
      emissiveIntensity: isDark ? 0.7 : 0.4,
      wireframe: true,
      roughness: 0.1
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    networkGroup.add(coreMesh);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x38bdf8 : 0x0ea5e9,
      transparent: true,
      opacity: isDark ? 0.8 : 0.6
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    coreMesh.add(innerSphere);

    // 11. Mouse Movement & Parallax Tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = x * 0.45;
      targetMouseY = y * 0.35;
    };

    const handleMouseLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 12. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // 13. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse interpolation
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      networkGroup.rotation.y = currentMouseX * 0.8 + Math.sin(elapsed * 0.15) * 0.08;
      networkGroup.rotation.x = -currentMouseY * 0.6 + Math.cos(elapsed * 0.12) * 0.05;

      // Gyro rings rotation
      ring1.rotation.z = elapsed * 0.2;
      ring2.rotation.x = elapsed * -0.15;
      ring3.rotation.y = elapsed * 0.18;

      // Core pulsing
      coreMesh.rotation.y = elapsed * 0.3;
      coreMesh.rotation.z = elapsed * 0.2;
      const coreScale = 1.0 + Math.sin(elapsed * 1.5) * 0.06;
      coreMesh.scale.set(coreScale, coreScale, coreScale);

      // Node subtle floating & pulsating
      nodeMeshes.forEach((nm, idx) => {
        nm.rotation.y = elapsed * (0.8 + idx * 0.1);
        nm.rotation.x = elapsed * (0.5 + idx * 0.05);
        nm.position.y += Math.sin(elapsed * 2.0 + idx) * 0.0025;
      });

      // Floating document fragments undulation
      fragmentMeshes.forEach((fm, idx) => {
        fm.position.y += Math.sin(elapsed * 1.2 + idx * 1.5) * 0.003;
        fm.rotation.z += Math.sin(elapsed * 0.8 + idx) * 0.001;
      });

      // Neural lines pulsing opacity
      lineMat.opacity = (isDark ? 0.22 : 0.15) + Math.sin(elapsed * 1.8) * 0.08;

      // Particles slow drift
      particles.rotation.y = elapsed * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // 14. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();

      // Dispose Three.js objects
      renderer.dispose();
      docTex.dispose();
      ocrTex.dispose();
      matTex.dispose();
      hashTex.dispose();
      pGeo.dispose();
      pMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      ringGeo3.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      ringMat3.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
    };
  }, [theme, createDocumentTexture]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[500px] md:min-h-[580px] lg:min-h-[640px] select-none overflow-hidden ${className}`}
    >
      {/* Three.js Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
      />

      {/* Subtle radial center vignette to ensure high text contrast */}
      <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-slate-50/20 to-slate-50/80 dark:via-slate-950/30 dark:to-slate-950/85" />

      {/* Floating Interactive 3D HUD Labels (OCR, TEXT, IMAGE, LAYOUT, METADATA, RISK) */}
      <div className="absolute inset-0 pointer-events-none">
        {vectorLabels.map((v) => {
          const Icon = v.icon;
          const isSelected = activeVector === v.id;
          return (
            <div
              key={v.id}
              style={{ borderColor: v.color }}
              onMouseEnter={() => setHoveredVector(v.id)}
              onMouseLeave={() => setHoveredVector(null)}
              onClick={() => onSelectVector && onSelectVector(v.id)}
              className={`absolute pointer-events-auto transition-all duration-300 cursor-pointer ${v.posClass} group`}
            >
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-xl border transition-all duration-300 ${
                  isSelected
                    ? 'bg-slate-900/90 dark:bg-white text-white dark:text-slate-950 scale-105 shadow-xl shadow-cyan-500/20 border-cyan-400 ring-2 ring-cyan-500/40'
                    : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-800/90 hover:scale-105 hover:border-cyan-500/50 shadow-md'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: `${v.color}20`,
                    color: v.color
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold tracking-wider">{v.label}</span>
                    <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: v.color }} />
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400 hidden sm:block">
                    {v.metrics}
                  </div>
                </div>
              </div>

              {/* Tooltip on hover */}
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 p-2.5 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl text-left opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-30">
                <div className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase">
                  {v.sublabel}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                  {v.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Center Dynamic Pipeline Flow Badge (DOCUMENT → ANALYSIS → ANOMALY → RISK) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-lg">
          <Activity className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-bold tracking-wider text-slate-700 dark:text-slate-300">
            <span className="text-cyan-600 dark:text-cyan-400">DOCUMENT</span>
            <span className="text-slate-400 dark:text-slate-600">→</span>
            <span className="text-sky-600 dark:text-sky-400">ANALYSIS</span>
            <span className="text-slate-400 dark:text-slate-600">→</span>
            <span className="text-violet-600 dark:text-violet-400">ANOMALY</span>
            <span className="text-slate-400 dark:text-slate-600">→</span>
            <span className="text-rose-600 dark:text-rose-400">RISK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
