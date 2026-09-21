import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

interface SecurityVerificationEmblem3DProps {
  className?: string;
}

export const SecurityVerificationEmblem3D: React.FC<SecurityVerificationEmblem3DProps> = ({
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  // Procedural high-resolution document textures for floating sheets
  const createDocumentTexture = useCallback((variant: 'statement' | 'passport' | 'dossier', isDark: boolean) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.clearRect(0, 0, 512, 700);

    // Glassy document backing
    ctx.fillStyle = isDark ? 'rgba(11, 22, 42, 0.88)' : 'rgba(255, 255, 255, 0.94)';
    ctx.fillRect(0, 0, 512, 700);

    // Precision boundary border
    ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(148, 163, 184, 0.5)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(8, 8, 496, 684);

    // Corner registration crosshairs
    ctx.strokeStyle = isDark ? '#06b6d4' : '#0284c7';
    ctx.lineWidth = 1.5;
    const cr = 14;
    // Top-left
    ctx.beginPath(); ctx.moveTo(16, 16 + cr); ctx.lineTo(16, 16); ctx.lineTo(16 + cr, 16); ctx.stroke();
    // Top-right
    ctx.beginPath(); ctx.moveTo(496 - cr, 16); ctx.lineTo(496, 16); ctx.lineTo(496, 16 + cr); ctx.stroke();
    // Bottom-left
    ctx.beginPath(); ctx.moveTo(16, 684 - cr); ctx.lineTo(16, 684); ctx.lineTo(16 + cr, 684); ctx.stroke();
    // Bottom-right
    ctx.beginPath(); ctx.moveTo(496 - cr, 684); ctx.lineTo(496, 684); ctx.lineTo(496, 684 - cr); ctx.stroke();

    if (variant === 'statement') {
      // Financial Statement Specimen
      ctx.fillStyle = isDark ? 'rgba(6, 182, 212, 0.8)' : 'rgba(2, 132, 199, 0.85)';
      ctx.fillRect(36, 42, 160, 16);

      ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(100, 116, 139, 0.4)';
      ctx.fillRect(36, 68, 220, 7);

      // Micro security QR / chip block
      ctx.strokeStyle = isDark ? 'rgba(6, 182, 212, 0.6)' : 'rgba(2, 132, 199, 0.5)';
      ctx.strokeRect(412, 38, 54, 54);
      ctx.fillStyle = isDark ? 'rgba(6, 182, 212, 0.18)' : 'rgba(2, 132, 199, 0.12)';
      ctx.fillRect(418, 44, 42, 42);

      // Table Header
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.22)' : 'rgba(224, 231, 255, 0.6)';
      ctx.fillRect(36, 114, 440, 20);

      // Table Rows
      ctx.fillStyle = isDark ? 'rgba(203, 213, 225, 0.55)' : 'rgba(100, 116, 139, 0.55)';
      for (let y = 150; y <= 490; y += 28) {
        ctx.fillRect(36, y, 90, 6);
        ctx.fillRect(145, y, 160, 6);
        ctx.fillRect(340, y, 65, 6);
        ctx.fillRect(425, y, 50, 6);
      }

      // Balance Summary Box
      ctx.strokeStyle = isDark ? 'rgba(6, 182, 212, 0.55)' : 'rgba(2, 132, 199, 0.45)';
      ctx.strokeRect(36, 530, 440, 52);
      ctx.fillStyle = isDark ? 'rgba(6, 182, 212, 0.12)' : 'rgba(2, 132, 199, 0.08)';
      ctx.fillRect(36, 530, 440, 52);

      ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
      ctx.fillRect(52, 550, 120, 12);
      ctx.fillStyle = isDark ? '#22c55e' : '#16a34a';
      ctx.fillRect(370, 550, 90, 12);

      // Hash footer
      ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.45)' : 'rgba(148, 163, 184, 0.6)';
      ctx.font = '11px monospace';
      ctx.fillText('SHA-256: 9f8a2b1847e3a9c72f10d481b6e4...', 36, 630);
      ctx.fillText('FORENSIC STATUS: 0 ANOMALIES DETECTED', 36, 650);
    } else if (variant === 'passport') {
      // Identity & Biometric Specimen
      ctx.fillStyle = isDark ? 'rgba(139, 92, 246, 0.8)' : 'rgba(124, 58, 237, 0.85)';
      ctx.fillRect(36, 42, 180, 16);

      // Photo block
      ctx.strokeStyle = isDark ? 'rgba(139, 92, 246, 0.6)' : 'rgba(124, 58, 237, 0.5)';
      ctx.strokeRect(36, 90, 135, 170);
      ctx.fillStyle = isDark ? 'rgba(139, 92, 246, 0.18)' : 'rgba(124, 58, 237, 0.12)';
      ctx.fillRect(36, 90, 135, 170);

      // Silhouette avatar
      ctx.fillStyle = isDark ? 'rgba(139, 92, 246, 0.45)' : 'rgba(124, 58, 237, 0.35)';
      ctx.beginPath(); ctx.arc(103, 155, 30, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(103, 245, 48, Math.PI, Math.PI * 2); ctx.fill();

      // Biometric scan grid
      ctx.strokeStyle = isDark ? 'rgba(6, 182, 212, 0.4)' : 'rgba(2, 132, 199, 0.35)';
      ctx.lineWidth = 1;
      for (let x = 50; x < 160; x += 18) {
        ctx.beginPath(); ctx.moveTo(x, 90); ctx.lineTo(x, 260); ctx.stroke();
      }

      // Identity fields
      ctx.fillStyle = isDark ? 'rgba(203, 213, 225, 0.65)' : 'rgba(71, 85, 105, 0.65)';
      for (let y = 100; y <= 230; y += 24) {
        ctx.fillRect(190, y, (y % 48 === 0) ? 170 : 240, 7);
      }

      // Machine-Readable Zone (MRZ)
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.15)';
      ctx.fillRect(36, 560, 440, 90);
      ctx.fillStyle = isDark ? '#38bdf8' : '#0369a1';
      ctx.font = '13px monospace';
      ctx.fillText('P<USA<<VERIFYX<<SPECIMEN<<<<<<<<<<<<<<<<<<<', 46, 600);
      ctx.fillText('8940129482USA9201019M2809184<<<<<<<<<<<<<<04', 46, 628);
    } else {
      // Forensic Audit Dossier
      ctx.strokeStyle = isDark ? 'rgba(6, 182, 212, 0.45)' : 'rgba(2, 132, 199, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(18, 18, 476, 664);

      ctx.fillStyle = isDark ? 'rgba(6, 182, 212, 0.8)' : 'rgba(2, 132, 199, 0.85)';
      ctx.fillRect(40, 46, 220, 16);

      ctx.fillStyle = isDark ? 'rgba(203, 213, 225, 0.55)' : 'rgba(100, 116, 139, 0.55)';
      for (let y = 100; y <= 500; y += 22) {
        ctx.fillRect(40, y, (y % 44 === 0) ? 330 : 420, 5);
      }

      // Holographic seal watermark
      ctx.strokeStyle = isDark ? 'rgba(139, 92, 246, 0.6)' : 'rgba(124, 58, 237, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(380, 580, 45, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(380, 580, 36, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(124, 58, 237, 0.1)';
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    return tex;
  }, []);

  // Helper to create small floating cryptographic tags
  const createTagTexture = (text: string, isDark: boolean) => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 70;
    const ctx = c.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(c);

    ctx.clearRect(0, 0, 256, 70);
    ctx.fillStyle = isDark ? 'rgba(7, 16, 32, 0.92)' : 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(0, 0, 256, 70);

    ctx.strokeStyle = isDark ? '#06b6d4' : '#0284c7';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, 252, 66);

    ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 35);

    const tex = new THREE.CanvasTexture(c);
    tex.generateMipmaps = true;
    return tex;
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const isDark = theme === 'dark';

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8.5);

    // 2. High-performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.25 : 1.05;

    // 3. Multi-Point Cyber Lighting (Cyan, Sky, Violet, Soft Indigo)
    const ambientLight = new THREE.AmbientLight(
      isDark ? 0x0c1e3d : 0xf8fafc,
      isDark ? 1.5 : 1.2
    );
    scene.add(ambientLight);

    const cyanLight = new THREE.DirectionalLight(0x06b6d4, isDark ? 3.0 : 1.8);
    cyanLight.position.set(4, 5, 5);
    scene.add(cyanLight);

    const violetLight = new THREE.DirectionalLight(0x8b5cf6, isDark ? 2.5 : 1.4);
    violetLight.position.set(-4, -3, 3);
    scene.add(violetLight);

    const pointLight = new THREE.PointLight(0x38bdf8, isDark ? 2.2 : 1.2, 18);
    pointLight.position.set(0, 1, 4);
    scene.add(pointLight);

    // 4. Main Hierarchical Groups for Depth
    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    const fgGroup = new THREE.Group();     // Primary foreground sheet
    const midGroup = new THREE.Group();    // Midground sheets & tags
    const bgGroup = new THREE.Group();     // Deep background sheets & nodes

    sceneGroup.add(bgGroup);
    sceneGroup.add(midGroup);
    sceneGroup.add(fgGroup);

    // -------------------------------------------------------------
    // 5. THREE FLOATING DOCUMENT SHEETS (NO SHIELD, NO CHECKMARK)
    // -------------------------------------------------------------
    interface HeroDoc {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      baseRot: THREE.Euler;
      speed: number;
      ampY: number;
      ampX: number;
      phase: number;
      parallaxMul: number;
    }

    const heroDocs: HeroDoc[] = [];
    const planeGeo = new THREE.PlaneGeometry(1, 1, 12, 12);

    // Sheet 1: Primary Foreground Sheet (Banking Statement)
    const tex1 = createDocumentTexture('statement', isDark);
    const mat1 = new THREE.MeshStandardMaterial({
      map: tex1,
      transparent: true,
      opacity: isDark ? 0.9 : 0.85,
      side: THREE.DoubleSide,
      roughness: 0.25,
      metalness: 0.15,
      emissive: isDark ? 0x06b6d4 : 0x0284c7,
      emissiveIntensity: isDark ? 0.08 : 0.02
    });
    const doc1 = new THREE.Mesh(planeGeo, mat1);
    doc1.scale.set(3.4, 4.65, 1);
    const doc1Pos = new THREE.Vector3(0.5, -0.15, 0.8);
    const doc1Rot = new THREE.Euler(-0.16, -0.28, 0.06);
    doc1.position.copy(doc1Pos);
    doc1.rotation.copy(doc1Rot);

    // Subtle cyan edge outline
    const edgeGeo1 = new THREE.EdgesGeometry(planeGeo);
    const edgeMat1 = new THREE.LineBasicMaterial({
      color: isDark ? 0x38bdf8 : 0x0284c7,
      transparent: true,
      opacity: isDark ? 0.6 : 0.4
    });
    doc1.add(new THREE.LineSegments(edgeGeo1, edgeMat1));
    fgGroup.add(doc1);

    heroDocs.push({
      mesh: doc1,
      basePos: doc1Pos.clone(),
      baseRot: doc1Rot.clone(),
      speed: 1.0,
      ampY: 0.14,
      ampX: 0.06,
      phase: 0,
      parallaxMul: 1.3
    });

    // Sheet 2: Midground Left Sheet (Forensic Dossier / Certificate)
    const tex2 = createDocumentTexture('dossier', isDark);
    const mat2 = new THREE.MeshStandardMaterial({
      map: tex2,
      transparent: true,
      opacity: isDark ? 0.72 : 0.68,
      side: THREE.DoubleSide,
      roughness: 0.3,
      metalness: 0.1,
      emissive: isDark ? 0x8b5cf6 : 0x7c3aed,
      emissiveIntensity: isDark ? 0.06 : 0.02
    });
    const doc2 = new THREE.Mesh(planeGeo, mat2);
    doc2.scale.set(3.0, 4.1, 1);
    const doc2Pos = new THREE.Vector3(-1.8, 0.75, -0.9);
    const doc2Rot = new THREE.Euler(0.14, 0.26, -0.08);
    doc2.position.copy(doc2Pos);
    doc2.rotation.copy(doc2Rot);
    midGroup.add(doc2);

    heroDocs.push({
      mesh: doc2,
      basePos: doc2Pos.clone(),
      baseRot: doc2Rot.clone(),
      speed: 0.85,
      ampY: 0.16,
      ampX: 0.08,
      phase: 2.1,
      parallaxMul: 0.9
    });

    // Sheet 3: Deep Background Lower Right Sheet (Identity / Passport)
    const tex3 = createDocumentTexture('passport', isDark);
    const mat3 = new THREE.MeshStandardMaterial({
      map: tex3,
      transparent: true,
      opacity: isDark ? 0.52 : 0.48,
      side: THREE.DoubleSide,
      roughness: 0.35,
      metalness: 0.1
    });
    const doc3 = new THREE.Mesh(planeGeo, mat3);
    doc3.scale.set(2.8, 3.8, 1);
    const doc3Pos = new THREE.Vector3(1.9, -1.2, -2.2);
    const doc3Rot = new THREE.Euler(-0.08, -0.18, 0.14);
    doc3.position.copy(doc3Pos);
    doc3.rotation.copy(doc3Rot);
    bgGroup.add(doc3);

    heroDocs.push({
      mesh: doc3,
      basePos: doc3Pos.clone(),
      baseRot: doc3Rot.clone(),
      speed: 0.7,
      ampY: 0.18,
      ampX: 0.09,
      phase: 4.2,
      parallaxMul: 0.5
    });

    // -------------------------------------------------------------
    // 6. FLOATING CRYPTOGRAPHIC TAGS (Small Verification Data Elements)
    // -------------------------------------------------------------
    const tagGeo = new THREE.PlaneGeometry(0.85, 0.24);

    const tag1Tex = createTagTexture('SHA-256', isDark);
    const tag1Mat = new THREE.MeshBasicMaterial({
      map: tag1Tex,
      transparent: true,
      opacity: isDark ? 0.85 : 0.75,
      side: THREE.DoubleSide
    });
    const tag1 = new THREE.Mesh(tagGeo, tag1Mat);
    tag1.position.set(-1.1, -1.6, 1.2);
    tag1.rotation.set(-0.1, -0.15, 0.04);
    fgGroup.add(tag1);

    const tag2Tex = createTagTexture('ELA: 0.01%', isDark);
    const tag2Mat = new THREE.MeshBasicMaterial({
      map: tag2Tex,
      transparent: true,
      opacity: isDark ? 0.8 : 0.7,
      side: THREE.DoubleSide
    });
    const tag2 = new THREE.Mesh(tagGeo, tag2Mat);
    tag2.position.set(2.1, 1.6, 0.2);
    tag2.rotation.set(0.1, -0.2, -0.05);
    midGroup.add(tag2);

    // -------------------------------------------------------------
    // 7. SUBTLE SCANNING LASER BEAM
    // -------------------------------------------------------------
    const scanBeamGeo = new THREE.PlaneGeometry(4.2, 0.05);
    const scanBeamMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x22d3ee : 0x0284c7,
      transparent: true,
      opacity: isDark ? 0.45 : 0.25,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      side: THREE.DoubleSide
    });
    const scanBeam = new THREE.Mesh(scanBeamGeo, scanBeamMat);
    scanBeam.position.set(0.5, 0, 0.88);
    scanBeam.rotation.x = -0.16;
    scanBeam.rotation.y = -0.28;
    fgGroup.add(scanBeam);

    // -------------------------------------------------------------
    // 8. ABSTRACT VERIFICATION NODES & CONNECTION LINES
    // -------------------------------------------------------------
    const nodeCount = 14;
    const nodeGeo = new THREE.OctahedronGeometry(0.14, 0);
    const nodeMeshes: THREE.Mesh[] = [];
    const nodePositions: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const isCyan = i % 2 === 0;
      const nMat = new THREE.MeshBasicMaterial({
        color: isCyan ? (isDark ? 0x06b6d4 : 0x0284c7) : (isDark ? 0x8b5cf6 : 0x7c3aed),
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.75 : 0.5
      });
      const mesh = new THREE.Mesh(nodeGeo, nMat);

      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 2.4 + (i % 3) * 0.6;
      const x = Math.cos(angle) * radius * 1.2;
      const y = Math.sin(angle) * radius * 0.9;
      const z = -2.0 + (i % 4) * 0.9;

      const pos = new THREE.Vector3(x, y, z);
      nodePositions.push(pos.clone());
      mesh.position.copy(pos);
      midGroup.add(mesh);
      nodeMeshes.push(mesh);
    }

    // Dynamic Connection Lines
    const maxLines = 24;
    const lineGeo = new THREE.BufferGeometry();
    const linePos = new Float32Array(maxLines * 2 * 3);
    const lineCol = new Float32Array(maxLines * 2 * 3);

    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineCol, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.35 : 0.2,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending
    });
    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    midGroup.add(linesMesh);

    // -------------------------------------------------------------
    // 9. PARTICLES MOVING SLOWLY IN DEPTH
    // -------------------------------------------------------------
    const particleCount = isDark ? 160 : 90;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);
    const pSpeeds = new Float32Array(particleCount);

    const cCyan = new THREE.Color(isDark ? 0x06b6d4 : 0x0284c7);
    const cViolet = new THREE.Color(isDark ? 0x8b5cf6 : 0x7c3aed);
    const cSky = new THREE.Color(isDark ? 0x38bdf8 : 0x0284c7);

    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 14;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 11;
      pPositions[i * 3 + 2] = -6 + Math.random() * 9;

      const r = Math.random();
      const col = r < 0.45 ? cCyan : r < 0.75 ? cSky : cViolet;
      pColors[i * 3] = col.r;
      pColors[i * 3 + 1] = col.g;
      pColors[i * 3 + 2] = col.b;

      pSpeeds[i] = 0.008 + Math.random() * 0.018;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: isDark ? 0.16 : 0.12,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.6 : 0.4,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending
    });
    const particleMesh = new THREE.Points(pGeo, pMat);
    bgGroup.add(particleMesh);

    // -------------------------------------------------------------
    // 10. MOUSE PARALLAX WITH SMOOTH DAMPING
    // -------------------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetMouseX = Math.max(-1.5, Math.min(1.5, x));
      targetMouseY = Math.max(-1.5, Math.min(1.5, y));
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      // Gentle global fallback if mouse is outside container
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = -(e.clientY / window.innerHeight - 0.5) * 2;
      targetMouseX = x * 0.8;
      targetMouseY = y * 0.8;
    };

    container.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // -------------------------------------------------------------
    // 11. ANIMATION LOOP (60 FPS, Continuous, Subtle)
    // -------------------------------------------------------------
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.045;
      mouseY += (targetMouseY - mouseY) * 0.045;

      // Parallax application per depth group
      fgGroup.position.x = mouseX * 0.42;
      fgGroup.position.y = mouseY * 0.32;

      midGroup.position.x = mouseX * 0.24;
      midGroup.position.y = mouseY * 0.18;

      bgGroup.position.x = mouseX * 0.12;
      bgGroup.position.y = mouseY * 0.08;

      // Subtle scene tilt
      sceneGroup.rotation.y = mouseX * 0.12;
      sceneGroup.rotation.x = -mouseY * 0.09;

      // Floating documents animation (sinusoidal floating + organic tilt)
      heroDocs.forEach(item => {
        const t = elapsed * item.speed + item.phase;
        item.mesh.position.y = item.basePos.y + Math.sin(t) * item.ampY;
        item.mesh.position.x = item.basePos.x + Math.cos(t * 0.75) * item.ampX;

        item.mesh.rotation.x = item.baseRot.x + Math.sin(t * 0.6) * 0.035;
        item.mesh.rotation.y = item.baseRot.y + Math.cos(t * 0.5) * 0.035;
      });

      // Animate scanning laser beam sweeping up and down across doc1
      const scanCycle = Math.sin(elapsed * 0.9);
      scanBeam.position.y = doc1.position.y + scanCycle * 1.8;
      scanBeamMat.opacity = isDark 
        ? 0.35 + Math.abs(scanCycle) * 0.25 
        : 0.2 + Math.abs(scanCycle) * 0.15;

      // Animate floating tags
      tag1.position.y = -1.6 + Math.sin(elapsed * 1.1) * 0.08;
      tag2.position.y = 1.6 + Math.cos(elapsed * 0.95) * 0.08;

      // Animate verification nodes
      for (let i = 0; i < nodeCount; i++) {
        const mesh = nodeMeshes[i];
        const base = nodePositions[i];
        mesh.position.y = base.y + Math.sin(elapsed * 1.2 + i * 0.5) * 0.12;
        mesh.rotation.x += delta * 0.4;
        mesh.rotation.y += delta * 0.6;
      }

      // Update thin dynamic connection lines
      let lineIdx = 0;
      const maxDist = 2.4;
      const pAttr = lineGeo.attributes.position.array as Float32Array;
      const cAttr = lineGeo.attributes.color.array as Float32Array;

      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          if (lineIdx >= maxLines) break;

          const p1 = nodeMeshes[i].position;
          const p2 = nodeMeshes[j].position;
          const dist = p1.distanceTo(p2);

          if (dist < maxDist) {
            const idx = lineIdx * 6;
            pAttr[idx] = p1.x;
            pAttr[idx + 1] = p1.y;
            pAttr[idx + 2] = p1.z;
            pAttr[idx + 3] = p2.x;
            pAttr[idx + 4] = p2.y;
            pAttr[idx + 5] = p2.z;

            const alpha = 1.0 - dist / maxDist;
            const c = (i % 2 === 0) ? cCyan : cViolet;

            cAttr[idx] = c.r * alpha;
            cAttr[idx + 1] = c.g * alpha;
            cAttr[idx + 2] = c.b * alpha;
            cAttr[idx + 3] = c.r * alpha;
            cAttr[idx + 4] = c.g * alpha;
            cAttr[idx + 5] = c.b * alpha;

            lineIdx++;
          }
        }
      }

      for (let k = lineIdx * 6; k < maxLines * 6; k++) {
        pAttr[k] = 0;
        cAttr[k] = 0;
      }
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;

      // Animate background particles (drift in Z depth)
      const pArray = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pArray[i * 3 + 2] += pSpeeds[i];
        if (pArray[i * 3 + 2] > 3) {
          pArray[i * 3 + 2] = -6;
        }
      }
      pGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // -------------------------------------------------------------
    // CLEANUP
    // -------------------------------------------------------------
    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      resizeObserver.disconnect();

      planeGeo.dispose();
      tagGeo.dispose();
      nodeGeo.dispose();
      lineGeo.dispose();
      pGeo.dispose();
      scanBeamGeo.dispose();

      heroDocs.forEach(d => {
        const mat = d.mesh.material as THREE.MeshStandardMaterial;
        if (mat.map) mat.map.dispose();
        mat.dispose();
      });
      tag1Mat.dispose();
      tag2Mat.dispose();
      scanBeamMat.dispose();
      lineMat.dispose();
      pMat.dispose();

      renderer.dispose();
    };
  }, [theme, createDocumentTexture]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/3] sm:aspect-[16/11] md:aspect-[16/10] overflow-hidden select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};
