import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

interface AnimatedSecurityBackgroundProps {
  className?: string;
  subtleOverlay?: boolean;
}

export const AnimatedSecurityBackground: React.FC<AnimatedSecurityBackgroundProps> = ({
  className = '',
  subtleOverlay = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isDark = theme === 'dark';

    // 1. Scene & Deep Navy Atmosphere with Relaxed Depth Fog
    const scene = new THREE.Scene();
    // Relaxed linear fog so 3D elements in [-30, 25] are vibrant and clearly visible
    if (isDark) {
      scene.fog = new THREE.Fog(0x060e24, 42, 130);
    } else {
      scene.fog = new THREE.Fog(0xedf2f9, 40, 120);
    }

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 30);

    // 2. High-performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 3. Cinematic Cybernetic Lighting (Rich Deep Navy, Vivid Cyan, Sky Blue, and Violet)
    const ambientLight = new THREE.AmbientLight(
      isDark ? 0x12264e : 0xf1f5f9,
      isDark ? 2.6 : 1.3
    );
    scene.add(ambientLight);

    // Key vibrant cyan directional light
    const keyCyanLight = new THREE.DirectionalLight(0x00f0ff, isDark ? 3.4 : 1.6);
    keyCyanLight.position.set(22, 18, 20);
    scene.add(keyCyanLight);

    // Sky blue directional fill light
    const fillBlueLight = new THREE.DirectionalLight(0x38bdf8, isDark ? 2.6 : 1.2);
    fillBlueLight.position.set(-18, -12, 16);
    scene.add(fillBlueLight);

    // Deep violet accent rim light
    const rimVioletLight = new THREE.DirectionalLight(0x8b5cf6, isDark ? 2.4 : 1.0);
    rimVioletLight.position.set(-8, 22, -10);
    scene.add(rimVioletLight);

    // Point light that hovers near the right document cluster
    const clusterGlowLight = new THREE.PointLight(0x06b6d4, isDark ? 3.0 : 1.2, 55);
    clusterGlowLight.position.set(16, 2, 14);
    scene.add(clusterGlowLight);

    // 4. Parallax Depth Layer Groups (No central shield/checkmark)
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    const bgLayerGroup = new THREE.Group();       // Deep background particles & subtle sheets
    const midLayerGroup = new THREE.Group();      // Midground document fragments & nodes
    const fgLayerGroup = new THREE.Group();       // Crisp foreground document sheets
    const nodesLayerGroup = new THREE.Group();    // Verification nodes & glowing connections

    worldGroup.add(bgLayerGroup);
    worldGroup.add(midLayerGroup);
    worldGroup.add(fgLayerGroup);
    worldGroup.add(nodesLayerGroup);

    // -------------------------------------------------------------
    // 5. HELPER: Procedural High-Definition Document Textures (Clearly Visible)
    // -------------------------------------------------------------
    const createDocumentTexture = (
      type: 'bank' | 'identity' | 'invoice' | 'certificate',
      dark: boolean
    ): THREE.CanvasTexture => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 700;
      const ctx = c.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(c);

      ctx.clearRect(0, 0, 512, 700);

      // Paper base with high-tech glowing background
      ctx.fillStyle = dark ? 'rgba(9, 23, 49, 0.94)' : 'rgba(255, 255, 255, 0.96)';
      ctx.fillRect(0, 0, 512, 700);

      // Subtle grid watermark on paper
      ctx.strokeStyle = dark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(14, 165, 233, 0.06)';
      ctx.lineWidth = 1;
      for (let x = 20; x < 512; x += 32) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 700); ctx.stroke();
      }
      for (let y = 20; y < 700; y += 32) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
      }

      // Outer crisp border with neon cyan/sky accent
      ctx.strokeStyle = dark ? 'rgba(0, 240, 255, 0.75)' : 'rgba(2, 132, 199, 0.7)';
      ctx.lineWidth = 3;
      ctx.strokeRect(8, 8, 496, 684);

      // Internal perimeter framing line
      ctx.strokeStyle = dark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(148, 163, 184, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(18, 18, 476, 664);

      // Corner security registration marks
      ctx.strokeStyle = dark ? '#00f0ff' : '#0284c7';
      ctx.lineWidth = 2.5;
      const cornerSize = 18;
      // Top-left
      ctx.beginPath(); ctx.moveTo(12, 12 + cornerSize); ctx.lineTo(12, 12); ctx.lineTo(12 + cornerSize, 12); ctx.stroke();
      // Top-right
      ctx.beginPath(); ctx.moveTo(500 - cornerSize, 12); ctx.lineTo(500, 12); ctx.lineTo(500, 12 + cornerSize); ctx.stroke();
      // Bottom-left
      ctx.beginPath(); ctx.moveTo(12, 688 - cornerSize); ctx.lineTo(12, 688); ctx.lineTo(12 + cornerSize, 688); ctx.stroke();
      // Bottom-right
      ctx.beginPath(); ctx.moveTo(500 - cornerSize, 688); ctx.lineTo(500, 688); ctx.lineTo(500, 688 - cornerSize); ctx.stroke();

      if (type === 'bank') {
        // Bank Statement Specimen
        ctx.fillStyle = dark ? '#00f0ff' : '#0284c7';
        ctx.fillRect(36, 42, 190, 16);
        
        ctx.fillStyle = dark ? 'rgba(148, 163, 184, 0.7)' : 'rgba(100, 116, 139, 0.7)';
        ctx.fillRect(36, 68, 130, 8);

        // Security Chip / Verified QR Badge
        ctx.strokeStyle = dark ? '#00f0ff' : '#0ea5e9';
        ctx.lineWidth = 2;
        ctx.strokeRect(406, 36, 62, 62);
        ctx.fillStyle = dark ? 'rgba(0, 240, 255, 0.25)' : 'rgba(2, 132, 199, 0.2)';
        ctx.fillRect(414, 44, 46, 46);
        ctx.fillStyle = dark ? '#38bdf8' : '#0284c7';
        ctx.fillRect(422, 52, 30, 30);

        // Table Header Banner
        ctx.fillStyle = dark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(224, 231, 255, 0.8)';
        ctx.fillRect(36, 120, 440, 24);

        // Clear Table Transaction Rows
        ctx.fillStyle = dark ? 'rgba(226, 232, 240, 0.8)' : 'rgba(71, 85, 105, 0.8)';
        for (let y = 160; y <= 500; y += 28) {
          ctx.fillRect(36, y, 95, 7);
          ctx.fillRect(150, y, 165, 7);
          ctx.fillRect(345, y, 65, 7);
          ctx.fillRect(430, y, 46, 7);
        }

        // Verified Summary & Security Stamp Box
        ctx.strokeStyle = dark ? 'rgba(0, 240, 255, 0.7)' : 'rgba(2, 132, 199, 0.6)';
        ctx.lineWidth = 2;
        ctx.strokeRect(36, 540, 440, 60);
        ctx.fillStyle = dark ? 'rgba(0, 240, 255, 0.16)' : 'rgba(2, 132, 199, 0.1)';
        ctx.fillRect(36, 540, 440, 60);

        ctx.fillStyle = dark ? '#38bdf8' : '#0284c7';
        ctx.fillRect(52, 562, 150, 14);
        ctx.fillStyle = dark ? '#10b981' : '#059669';
        ctx.fillRect(370, 562, 90, 14);

        // Forensic Hash Footnote
        ctx.fillStyle = dark ? '#38bdf8' : '#0369a1';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f', 36, 638);
        ctx.fillText('STATUS: CRYPTOGRAPHICALLY VERIFIED [VERIFYX-OK]', 36, 656);

      } else if (type === 'identity') {
        // Biometric / Identity Passport Specimen
        ctx.fillStyle = dark ? '#8b5cf6' : '#7c3aed';
        ctx.fillRect(36, 42, 210, 18);

        // Biometric Photo Container
        ctx.strokeStyle = dark ? '#8b5cf6' : '#7c3aed';
        ctx.lineWidth = 2;
        ctx.strokeRect(36, 88, 145, 180);
        ctx.fillStyle = dark ? 'rgba(139, 92, 246, 0.25)' : 'rgba(124, 58, 237, 0.15)';
        ctx.fillRect(36, 88, 145, 180);

        // Silhouette avatar
        ctx.fillStyle = dark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(124, 58, 237, 0.5)';
        ctx.beginPath();
        ctx.arc(108, 158, 34, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(108, 252, 56, Math.PI, Math.PI * 2);
        ctx.fill();

        // High-contrast biometric laser scanning grid
        ctx.strokeStyle = dark ? '#00f0ff' : '#0284c7';
        ctx.lineWidth = 1.5;
        for (let gx = 52; gx < 172; gx += 20) {
          ctx.beginPath();
          ctx.moveTo(gx, 88);
          ctx.lineTo(gx, 268);
          ctx.stroke();
        }

        // Identity textual fields
        ctx.fillStyle = dark ? 'rgba(226, 232, 240, 0.85)' : 'rgba(71, 85, 105, 0.85)';
        for (let y = 100; y <= 245; y += 26) {
          ctx.fillRect(200, y, (y % 52 === 0) ? 190 : 255, 8);
        }

        // Machine-Readable Zone (MRZ) Optical Code lines
        ctx.fillStyle = dark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.25)';
        ctx.fillRect(36, 575, 440, 85);
        ctx.fillStyle = dark ? '#38bdf8' : '#0369a1';
        ctx.font = 'bold 13px monospace';
        ctx.fillText('P<USA<<VERIFYX<<SPECIMEN<<<<<<<<<<<<<<<<<<<', 48, 612);
        ctx.fillText('8940129482USA9201019M2809184<<<<<<<<<<<<<<04', 48, 642);

      } else if (type === 'invoice') {
        // Commercial Invoice / Ledger Specimen
        ctx.fillStyle = dark ? '#38bdf8' : '#0284c7';
        ctx.fillRect(36, 42, 180, 18);
        ctx.fillStyle = dark ? 'rgba(148, 163, 184, 0.7)' : 'rgba(100, 116, 139, 0.7)';
        ctx.fillRect(36, 70, 230, 8);

        // Statistical Bar Graph Columns
        ctx.fillStyle = dark ? 'rgba(0, 240, 255, 0.7)' : 'rgba(2, 132, 199, 0.6)';
        ctx.fillRect(36, 110, 50, 65);
        ctx.fillStyle = dark ? 'rgba(56, 189, 248, 0.8)' : 'rgba(14, 165, 233, 0.7)';
        ctx.fillRect(102, 95, 50, 80);
        ctx.fillStyle = dark ? 'rgba(139, 92, 246, 0.85)' : 'rgba(139, 92, 246, 0.75)';
        ctx.fillRect(168, 75, 50, 100);

        ctx.fillStyle = dark ? 'rgba(226, 232, 240, 0.8)' : 'rgba(71, 85, 105, 0.8)';
        for (let y = 200; y <= 550; y += 26) {
          ctx.fillRect(36, y, (y % 52 === 0) ? 330 : 440, 7);
        }

        // Holographic verification seal stamp
        ctx.strokeStyle = dark ? '#00f0ff' : '#0284c7';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(385, 475, 55, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = dark ? 'rgba(0, 240, 255, 0.2)' : 'rgba(2, 132, 199, 0.12)';
        ctx.fill();

      } else {
        // Certified Legal / Audit Specimen
        ctx.strokeStyle = dark ? '#8b5cf6' : '#7c3aed';
        ctx.lineWidth = 3;
        ctx.strokeRect(18, 18, 476, 664);

        ctx.fillStyle = dark ? '#a78bfa' : '#7c3aed';
        ctx.fillRect(120, 58, 272, 20);

        ctx.fillStyle = dark ? 'rgba(226, 232, 240, 0.8)' : 'rgba(71, 85, 105, 0.8)';
        for (let y = 120; y <= 510; y += 24) {
          const w = (y % 48 === 0) ? 370 : 430;
          ctx.fillRect(46, y, w, 6);
        }

        // Dual circular security medallion
        ctx.strokeStyle = dark ? '#00f0ff' : '#0284c7';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(256, 590, 50, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = dark ? 'rgba(0, 240, 255, 0.25)' : 'rgba(2, 132, 199, 0.15)';
        ctx.fill();
      }

      const texture = new THREE.CanvasTexture(c);
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      return texture;
    };

    // -------------------------------------------------------------
    // 6. GENERATE FLOATING DOCUMENT SHEETS (Clearly Visible with Glow)
    // -------------------------------------------------------------
    interface FloatingDoc {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      baseRot: THREE.Euler;
      floatSpeed: number;
      floatAmpY: number;
      floatAmpX: number;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      phase: number;
      parallaxFactor: number;
    }

    const floatingDocs: FloatingDoc[] = [];

    // Prominent peripheral & depth positions that frame the UI and peek between cards
    const docConfigs = [
      // 1. Right Foreground (Hero visual anchor - crisp, luminous, and clearly visible)
      {
        type: 'bank' as const,
        pos: new THREE.Vector3(15.0, 1.2, 7.8),
        rot: new THREE.Euler(-0.10, -0.30, 0.05),
        scale: new THREE.Vector3(7.4, 10.2, 1),
        opacity: isDark ? 0.92 : 0.85,
        emissiveColor: isDark ? 0x00f0ff : 0x0284c7,
        emissiveIntensity: isDark ? 0.25 : 0.1,
        layer: fgLayerGroup,
        parallax: 1.4,
        speed: 0.85
      },
      // 2. Right Midground Upper (Biometric passport)
      {
        type: 'identity' as const,
        pos: new THREE.Vector3(22.5, 10.0, 1.5),
        rot: new THREE.Euler(0.12, -0.25, -0.07),
        scale: new THREE.Vector3(6.8, 9.4, 1),
        opacity: isDark ? 0.86 : 0.78,
        emissiveColor: isDark ? 0x8b5cf6 : 0x7c3aed,
        emissiveIntensity: isDark ? 0.22 : 0.08,
        layer: midLayerGroup,
        parallax: 1.05,
        speed: 1.05
      },
      // 3. Right Midground Lower (Commercial invoice)
      {
        type: 'invoice' as const,
        pos: new THREE.Vector3(14.0, -11.2, -1.0),
        rot: new THREE.Euler(-0.07, -0.15, 0.10),
        scale: new THREE.Vector3(6.5, 9.0, 1),
        opacity: isDark ? 0.84 : 0.75,
        emissiveColor: isDark ? 0x38bdf8 : 0x0284c7,
        emissiveIntensity: isDark ? 0.20 : 0.08,
        layer: midLayerGroup,
        parallax: 0.95,
        speed: 0.92
      },
      // 4. Left Peripheral Midground (Legal Certificate)
      {
        type: 'certificate' as const,
        pos: new THREE.Vector3(-18.5, 4.5, 0.5),
        rot: new THREE.Euler(0.08, 0.28, -0.06),
        scale: new THREE.Vector3(6.6, 9.1, 1),
        opacity: isDark ? 0.82 : 0.72,
        emissiveColor: isDark ? 0x8b5cf6 : 0x7c3aed,
        emissiveIntensity: isDark ? 0.20 : 0.06,
        layer: midLayerGroup,
        parallax: 1.0,
        speed: 0.8
      },
      // 5. Left Upper Midground (Bank Statement variant)
      {
        type: 'bank' as const,
        pos: new THREE.Vector3(-14.0, 15.0, -3.5),
        rot: new THREE.Euler(0.18, 0.18, -0.12),
        scale: new THREE.Vector3(6.0, 8.2, 1),
        opacity: isDark ? 0.74 : 0.65,
        emissiveColor: isDark ? 0x00f0ff : 0x0284c7,
        emissiveIntensity: isDark ? 0.18 : 0.05,
        layer: midLayerGroup,
        parallax: 0.8,
        speed: 0.75
      },
      // 6. Deep Right Background
      {
        type: 'bank' as const,
        pos: new THREE.Vector3(27.0, -4.0, -14.0),
        rot: new THREE.Euler(-0.06, -0.38, 0.06),
        scale: new THREE.Vector3(6.8, 9.4, 1),
        opacity: isDark ? 0.65 : 0.55,
        emissiveColor: isDark ? 0x06b6d4 : 0x0284c7,
        emissiveIntensity: isDark ? 0.15 : 0.04,
        layer: bgLayerGroup,
        parallax: 0.5,
        speed: 0.68
      },
      // 7. Deep Left Background
      {
        type: 'invoice' as const,
        pos: new THREE.Vector3(-27.0, -8.0, -18.0),
        rot: new THREE.Euler(0.08, 0.35, -0.06),
        scale: new THREE.Vector3(7.2, 9.8, 1),
        opacity: isDark ? 0.62 : 0.50,
        emissiveColor: isDark ? 0x38bdf8 : 0x0284c7,
        emissiveIntensity: isDark ? 0.14 : 0.04,
        layer: bgLayerGroup,
        parallax: 0.45,
        speed: 0.62
      }
    ];

    const planeGeo = new THREE.PlaneGeometry(1, 1, 16, 16);

    docConfigs.forEach((cfg, idx) => {
      const tex = createDocumentTexture(cfg.type, isDark);
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        transparent: true,
        opacity: cfg.opacity,
        side: THREE.DoubleSide,
        roughness: 0.2,
        metalness: 0.25,
        emissive: cfg.emissiveColor,
        emissiveIntensity: cfg.emissiveIntensity
      });

      const mesh = new THREE.Mesh(planeGeo, mat);
      mesh.position.copy(cfg.pos);
      mesh.rotation.copy(cfg.rot);
      mesh.scale.copy(cfg.scale);

      // Glowing cybernetic perimeter border lines on all document sheets
      const edgeGeo = new THREE.EdgesGeometry(planeGeo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: idx % 2 === 0 ? (isDark ? 0x00f0ff : 0x0284c7) : (isDark ? 0x38bdf8 : 0x8b5cf6),
        transparent: true,
        opacity: isDark ? 0.75 : 0.55,
        linewidth: 2.0
      });
      const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
      mesh.add(edgeLines);

      cfg.layer.add(mesh);

      floatingDocs.push({
        mesh,
        basePos: cfg.pos.clone(),
        baseRot: cfg.rot.clone(),
        floatSpeed: cfg.speed,
        floatAmpY: 0.45 + (idx % 3) * 0.14,
        floatAmpX: 0.22 + (idx % 2) * 0.09,
        rotSpeedX: 0.0008 * ((idx % 2 === 0) ? 1 : -1),
        rotSpeedY: 0.0012 * ((idx % 3 === 0) ? 1 : -1),
        rotSpeedZ: 0.0006 * ((idx % 2 === 0) ? -1 : 1),
        phase: idx * 1.35,
        parallaxFactor: cfg.parallax
      });
    });

    // -------------------------------------------------------------
    // 7. VIVID ABSTRACT VERIFICATION NODES & GLOWING CORES
    // -------------------------------------------------------------
    const nodeCount = 28;
    const nodeMeshes: THREE.Mesh[] = [];
    const nodeBasePositions: THREE.Vector3[] = [];
    const nodeVelocities: THREE.Vector3[] = [];

    const octGeo = new THREE.OctahedronGeometry(0.42, 0);
    const icosaGeo = new THREE.IcosahedronGeometry(0.36, 0);
    const innerSphereGeo = new THREE.SphereGeometry(0.16, 8, 8);

    for (let i = 0; i < nodeCount; i++) {
      // Balance distribution across left, right, and background
      const isRight = i % 2 === 0;
      const x = isRight
        ? 8 + Math.random() * 24
        : -8 - Math.random() * 24;
      const y = (Math.random() - 0.5) * 36;
      const z = -15 + Math.random() * 26;

      const pos = new THREE.Vector3(x, y, z);
      nodeBasePositions.push(pos.clone());

      nodeVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.005
        )
      );

      const isCyan = i % 3 !== 0;
      const nodeColor = isCyan ? (isDark ? 0x00f0ff : 0x0284c7) : (isDark ? 0x8b5cf6 : 0x7c3aed);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: nodeColor,
        emissive: nodeColor,
        emissiveIntensity: isDark ? 0.75 : 0.45,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.85 : 0.65
      });

      const mesh = new THREE.Mesh(i % 2 === 0 ? octGeo : icosaGeo, nodeMat);
      mesh.position.copy(pos);

      // Add a bright luminous inner core to the node
      const coreMat = new THREE.MeshBasicMaterial({
        color: isCyan ? (isDark ? 0x38bdf8 : 0x0284c7) : (isDark ? 0xc084fc : 0x7c3aed),
        transparent: true,
        opacity: isDark ? 0.95 : 0.8
      });
      const coreMesh = new THREE.Mesh(innerSphereGeo, coreMat);
      mesh.add(coreMesh);

      nodesLayerGroup.add(mesh);
      nodeMeshes.push(mesh);
    }

    // -------------------------------------------------------------
    // 8. CLEARLY VISIBLE GLOWING CONNECTION LINES (Additive Blending)
    // -------------------------------------------------------------
    const maxConnections = 70;
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(maxConnections * 2 * 3);
    const lineColors = new Float32Array(maxConnections * 2 * 3);

    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.65 : 0.45,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      linewidth: 2.0
    });

    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    nodesLayerGroup.add(linesMesh);

    // -------------------------------------------------------------
    // 9. LUMINOUS PARTICULATE DEPTH FIELD (Glowing Cyber-Dust)
    // -------------------------------------------------------------
    const createParticleTexture = () => {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 64;
      pCanvas.height = 64;
      const pCtx = pCanvas.getContext('2d');
      if (!pCtx) return null;
      const gradient = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(0, 240, 255, 0.85)');
      gradient.addColorStop(0.7, 'rgba(56, 189, 248, 0.35)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      pCtx.fillStyle = gradient;
      pCtx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(pCanvas);
    };

    const particleCount = isDark ? 280 : 160;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pCol = new Float32Array(particleCount * 3);
    const pSpeed = new Float32Array(particleCount);

    const cCyan = new THREE.Color(isDark ? 0x00f0ff : 0x0284c7);
    const cViolet = new THREE.Color(isDark ? 0xa855f7 : 0x7c3aed);
    const cSky = new THREE.Color(isDark ? 0x38bdf8 : 0x0369a1);
    const cDeepBlue = new THREE.Color(isDark ? 0x2563eb : 0x1d4ed8);

    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 85;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 65;
      pPos[i * 3 + 2] = -42 + Math.random() * 64;

      const r = Math.random();
      const col = r < 0.45 ? cCyan : r < 0.72 ? cSky : r < 0.88 ? cViolet : cDeepBlue;
      pCol[i * 3] = col.r;
      pCol[i * 3 + 1] = col.g;
      pCol[i * 3 + 2] = col.b;

      pSpeed[i] = 0.015 + Math.random() * 0.035;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

    const particleTexture = createParticleTexture();

    const pMat = new THREE.PointsMaterial({
      size: isDark ? 0.85 : 0.65,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.75 : 0.55,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      map: particleTexture || undefined,
      depthWrite: false
    });

    const particlesMesh = new THREE.Points(pGeo, pMat);
    bgLayerGroup.add(particlesMesh);

    // -------------------------------------------------------------
    // 10. GLOWING HORIZONTAL SCANNING LASER BEAM
    // -------------------------------------------------------------
    const scanBeamGeo = new THREE.PlaneGeometry(30, 0.2);
    const scanBeamMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x00f0ff : 0x0284c7,
      transparent: true,
      opacity: isDark ? 0.55 : 0.35,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      side: THREE.DoubleSide
    });
    const scanBeam = new THREE.Mesh(scanBeamGeo, scanBeamMat);
    scanBeam.position.set(16, 0, 8.6);
    scanBeam.rotation.x = Math.PI / 2;
    fgLayerGroup.add(scanBeam);

    // -------------------------------------------------------------
    // 11. MOUSE PARALLAX & SCROLL TRACKING WITH DAMPING
    // -------------------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let scrollY = 0;
    let targetScrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleResize = () => {
      if (!canvas || !renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // -------------------------------------------------------------
    // 12. CONTINUOUS ANIMATION LOOP (Smoothly persists across routes)
    // -------------------------------------------------------------
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth lerp for mouse parallax
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      scrollY += (targetScrollY - scrollY) * 0.06;

      // Parallax application per depth layer
      fgLayerGroup.position.x = mouseX * 2.4;
      fgLayerGroup.position.y = mouseY * 1.8 - (scrollY * 0.006);

      midLayerGroup.position.x = mouseX * 1.5;
      midLayerGroup.position.y = mouseY * 1.1 - (scrollY * 0.004);

      nodesLayerGroup.position.x = mouseX * 1.2;
      nodesLayerGroup.position.y = mouseY * 0.8 - (scrollY * 0.003);

      bgLayerGroup.position.x = mouseX * 0.7;
      bgLayerGroup.position.y = mouseY * 0.5 - (scrollY * 0.002);

      // Animate floating documents
      floatingDocs.forEach((doc) => {
        const t = elapsed * doc.floatSpeed + doc.phase;
        
        // Multi-frequency sinusoidal hovering
        doc.mesh.position.y = doc.basePos.y + Math.sin(t) * doc.floatAmpY + Math.cos(t * 0.6) * 0.12;
        doc.mesh.position.x = doc.basePos.x + Math.cos(t * 0.75) * doc.floatAmpX;
        doc.mesh.position.z = doc.basePos.z + Math.sin(t * 0.5) * 0.25;

        // Subtle 3D angular rolling tilt
        doc.mesh.rotation.x = doc.baseRot.x + Math.sin(t * 0.7) * 0.06;
        doc.mesh.rotation.y = doc.baseRot.y + Math.cos(t * 0.8) * 0.07;
        doc.mesh.rotation.z = doc.baseRot.z + Math.sin(t * 0.5) * 0.04;
      });

      // Animate scanning laser plane
      const scanCycle = (elapsed * 0.85) % 1;
      scanBeam.position.y = 7.0 - scanCycle * 14.0;
      scanBeam.position.x = 15.0 + Math.sin(elapsed * 0.5) * 0.6;
      (scanBeam.material as THREE.MeshBasicMaterial).opacity = 
        (isDark ? 0.5 : 0.3) * (0.5 + 0.5 * Math.sin(scanCycle * Math.PI));

      // Animate verification nodes
      for (let i = 0; i < nodeCount; i++) {
        const mesh = nodeMeshes[i];
        const vel = nodeVelocities[i];
        const base = nodeBasePositions[i];

        mesh.position.add(vel);

        // Soft harmonic tether back to base position
        const dist = mesh.position.distanceTo(base);
        if (dist > 2.8) {
          vel.multiplyScalar(-1);
        }

        mesh.rotation.x += 0.012 * ((i % 2 === 0) ? 1 : -1);
        mesh.rotation.y += 0.015 * ((i % 3 === 0) ? 1 : -1);

        // Gentle pulsing scale on nodes
        const pulse = 1 + Math.sin(elapsed * 2.5 + i) * 0.12;
        mesh.scale.set(pulse, pulse, pulse);
      }

      // Re-calculate dynamic proximity connections between nodes
      let connIdx = 0;
      const positions = lineGeo.attributes.position.array as Float32Array;
      const colors = lineGeo.attributes.color.array as Float32Array;
      const maxDist = 9.5;

      for (let i = 0; i < nodeCount && connIdx < maxConnections; i++) {
        for (let j = i + 1; j < nodeCount && connIdx < maxConnections; j++) {
          const d = nodeMeshes[i].position.distanceTo(nodeMeshes[j].position);
          if (d < maxDist) {
            const p1 = nodeMeshes[i].position;
            const p2 = nodeMeshes[j].position;

            const baseIdx = connIdx * 6;
            positions[baseIdx] = p1.x;
            positions[baseIdx + 1] = p1.y;
            positions[baseIdx + 2] = p1.z;

            positions[baseIdx + 3] = p2.x;
            positions[baseIdx + 4] = p2.y;
            positions[baseIdx + 5] = p2.z;

            // Proximity alpha fade & vivid color blending
            const alpha = Math.max(0.1, 1 - d / maxDist);
            const isCyanConn = (i + j) % 2 === 0;

            colors[baseIdx] = isCyanConn ? 0.0 : 0.55;
            colors[baseIdx + 1] = isCyanConn ? 0.94 : 0.36;
            colors[baseIdx + 2] = 1.0;

            colors[baseIdx + 3] = isCyanConn ? 0.22 : 0.67;
            colors[baseIdx + 4] = isCyanConn ? 0.74 : 0.42;
            colors[baseIdx + 5] = 0.97;

            connIdx++;
          }
        }
      }

      // Zero out remaining connection lines
      for (let k = connIdx * 6; k < maxConnections * 6; k++) {
        positions[k] = 0;
        colors[k] = 0;
      }

      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;

      // Animate drifting particles
      const pPositions = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pPositions[i * 3 + 2] += pSpeed[i];
        pPositions[i * 3 + 1] += Math.sin(elapsed + i) * 0.008;
        if (pPositions[i * 3 + 2] > 22) {
          pPositions[i * 3 + 2] = -42;
        }
      }
      pGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      planeGeo.dispose();
      octGeo.dispose();
      icosaGeo.dispose();
      innerSphereGeo.dispose();
      lineGeo.dispose();
      pGeo.dispose();
      scanBeamGeo.dispose();
      if (particleTexture) particleTexture.dispose();

      floatingDocs.forEach(d => {
        const mat = d.mesh.material as THREE.MeshStandardMaterial;
        if (mat.map) mat.map.dispose();
        mat.dispose();
      });
      nodeMeshes.forEach(m => {
        (m.material as THREE.Material).dispose();
        m.children.forEach(c => {
          if (c instanceof THREE.Mesh) (c.material as THREE.Material).dispose();
        });
      });
      lineMat.dispose();
      pMat.dispose();
      scanBeamMat.dispose();

      renderer.dispose();
    };
  }, [theme]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#edf2f9] dark:bg-[#060e24] ${className}`}>
      {/* Dynamic Deep Navy & Cyan Ambient Glow Background Layer */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-90 dark:opacity-100"
        style={{
          background: theme === 'dark' 
            ? 'radial-gradient(circle at 80% 20%, rgba(14, 45, 105, 0.65) 0%, rgba(8, 22, 56, 0.75) 45%, #050c1e 100%)'
            : 'radial-gradient(circle at 80% 20%, rgba(219, 234, 254, 0.7) 0%, rgba(241, 245, 249, 0.9) 55%, #edf2f9 100%)'
        }}
      />

      {/* 3D WebGL Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block relative z-10"
      />

      {/* Subtle Readability Vignette that keeps cards readable without dulling 3D elements */}
      {subtleOverlay && (
        <div 
          className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-b from-transparent via-slate-900/[0.04] to-slate-900/[0.12] dark:from-transparent dark:via-[#050c1e]/20 dark:to-[#050c1e]/40" 
        />
      )}
    </div>
  );
};
