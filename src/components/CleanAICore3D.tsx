import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

interface CleanAICore3DProps {
  className?: string;
}

export const CleanAICore3D: React.FC<CleanAICore3DProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  // Helper to generate minimal, subtle paper textures
  const createPaperTexture = useCallback((variant: 'text' | 'chart' | 'data') => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 680;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.clearRect(0, 0, 512, 680);

    // Elegant paper background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(0, 0, 512, 680);

    // Subtle border
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, 504, 672);

    // Header bar
    ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
    ctx.fillRect(40, 48, 160, 16);
    ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.fillRect(40, 76, 260, 8);

    // Subtle clean lines
    ctx.fillStyle = 'rgba(203, 213, 225, 0.55)';
    for (let y = 110; y < 580; y += 22) {
      if (variant === 'chart' && y > 240 && y < 440) continue;
      const w = (y % 44 === 0) ? 320 : 430;
      ctx.fillRect(40, y, w, 7);
    }

    if (variant === 'chart') {
      // Clean bar chart accent
      ctx.fillStyle = 'rgba(6, 182, 212, 0.5)';
      ctx.fillRect(40, 360, 45, 70);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.fillRect(100, 320, 45, 110);
      ctx.fillStyle = 'rgba(139, 92, 246, 0.7)';
      ctx.fillRect(160, 270, 45, 160);
      ctx.fillStyle = 'rgba(14, 165, 233, 0.5)';
      ctx.fillRect(220, 340, 45, 90);
    }

    // Small AI Verified badge at bottom
    ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.fillRect(40, 600, 120, 28);
    ctx.fillStyle = 'rgba(14, 165, 233, 0.85)';
    ctx.fillRect(52, 610, 80, 8);

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
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // 3. Gentle Soft Lighting (Cyan / Blue / Violet)
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.9 : 1.2);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, isDark ? 3.0 : 2.0, 20);
    cyanLight.position.set(-3.5, 2.5, 4);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0x8b5cf6, isDark ? 3.0 : 2.0, 20);
    violetLight.position.set(3.5, -2.5, 4);
    scene.add(violetLight);

    const softBlue = new THREE.PointLight(0x38bdf8, isDark ? 2.5 : 1.5, 15);
    softBlue.position.set(0, 3, 3);
    scene.add(softBlue);

    // 4. Main Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 5. Central Floating 3D AI Core (Glossy Icosahedron / Geosphere + Inner Glow)
    const coreGroup = new THREE.Group();
    mainGroup.add(coreGroup);

    // Outer crystalline lattice
    const outerCoreGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const outerCoreMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x0ea5e9 : 0x0284c7,
      emissive: isDark ? 0x0369a1 : 0x38bdf8,
      emissiveIntensity: isDark ? 0.4 : 0.25,
      metalness: 0.7,
      roughness: 0.15,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.75 : 0.6
    });
    const outerCoreMesh = new THREE.Mesh(outerCoreGeo, outerCoreMat);
    coreGroup.add(outerCoreMesh);

    // Inner glowing energy nucleus
    const innerNucleusGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const innerNucleusMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x38bdf8 : 0x06b6d4,
      emissive: isDark ? 0x0284c7 : 0x0ea5e9,
      emissiveIntensity: isDark ? 0.6 : 0.4,
      roughness: 0.2,
      metalness: 0.4,
      transparent: true,
      opacity: isDark ? 0.85 : 0.7
    });
    const innerNucleus = new THREE.Mesh(innerNucleusGeo, innerNucleusMat);
    coreGroup.add(innerNucleus);

    // 6. Thin, Elegant Orbital Lines
    const orbit1Geo = new THREE.TorusGeometry(2.3, 0.012, 16, 120);
    const orbit1Mat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x38bdf8 : 0x0284c7,
      transparent: true,
      opacity: isDark ? 0.4 : 0.3
    });
    const orbit1 = new THREE.Mesh(orbit1Geo, orbit1Mat);
    orbit1.rotation.x = Math.PI / 2.8;
    orbit1.rotation.y = 0.2;
    coreGroup.add(orbit1);

    const orbit2Geo = new THREE.TorusGeometry(2.8, 0.01, 16, 120);
    const orbit2Mat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x8b5cf6 : 0x7c3aed,
      transparent: true,
      opacity: isDark ? 0.35 : 0.25
    });
    const orbit2 = new THREE.Mesh(orbit2Geo, orbit2Mat);
    orbit2.rotation.x = -Math.PI / 3.2;
    orbit2.rotation.y = -0.3;
    coreGroup.add(orbit2);

    // 7. Subtle Floating Paper / Document Layers (3 layers)
    const paperGroup = new THREE.Group();
    mainGroup.add(paperGroup);

    const tex1 = createPaperTexture('text');
    const tex2 = createPaperTexture('chart');
    const tex3 = createPaperTexture('data');

    const paperLayers = [
      { texture: tex1, w: 1.5, h: 2.0, x: -1.9, y: 0.6, z: 0.6, rotX: 0.2, rotY: 0.4, rotZ: -0.1 },
      { texture: tex2, w: 1.4, h: 1.85, x: 2.0, y: -0.5, z: 0.4, rotX: -0.2, rotY: -0.35, rotZ: 0.15 },
      { texture: tex3, w: 1.35, h: 1.8, x: -1.2, y: -1.3, z: -0.3, rotX: 0.15, rotY: 0.25, rotZ: -0.2 }
    ];

    const paperMeshes: THREE.Mesh[] = [];

    paperLayers.forEach((layer) => {
      const geo = new THREE.PlaneGeometry(layer.w, layer.h);
      const mat = new THREE.MeshStandardMaterial({
        map: layer.texture,
        transparent: true,
        opacity: isDark ? 0.88 : 0.95,
        roughness: 0.3,
        metalness: 0.1,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(layer.x, layer.y, layer.z);
      mesh.rotation.set(layer.rotX, layer.rotY, layer.rotZ);

      // Delicate border outline
      const edges = new THREE.EdgesGeometry(geo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: isDark ? 0x38bdf8 : 0x94a3b8,
        transparent: true,
        opacity: isDark ? 0.45 : 0.4
      });
      const border = new THREE.LineSegments(edges, edgeMat);
      mesh.add(border);

      paperGroup.add(mesh);
      paperMeshes.push(mesh);
    });

    // 8. Soft Glowing Floating Data Points & Particles (clean, low density)
    const particleCount = 120;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pCol = new Float32Array(particleCount * 3);

    const cCyan = new THREE.Color(0x06b6d4);
    const cViolet = new THREE.Color(0x8b5cf6);
    const cSky = new THREE.Color(0x38bdf8);

    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 10;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 6;

      const r = Math.random();
      const col = r < 0.4 ? cCyan : r < 0.7 ? cSky : cViolet;
      pCol[i * 3] = col.r;
      pCol[i * 3 + 1] = col.g;
      pCol[i * 3 + 2] = col.b;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.6 : 0.45
    });
    const particleSystem = new THREE.Points(pGeo, pMat);
    mainGroup.add(particleSystem);

    // 9. A Few Small Floating Geometric Data Points
    const nodeCoords = [
      new THREE.Vector3(-1.8, 1.8, 1.0),
      new THREE.Vector3(2.2, 1.4, 0.8),
      new THREE.Vector3(1.6, -1.8, 0.5),
      new THREE.Vector3(-2.2, -0.9, 0.7)
    ];

    const dataNodeMeshes: THREE.Mesh[] = [];
    nodeCoords.forEach((pos, i) => {
      const geo = new THREE.OctahedronGeometry(0.12, 0);
      const mat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x06b6d4 : 0x8b5cf6,
        emissive: i % 2 === 0 ? 0x0284c7 : 0x7c3aed,
        emissiveIntensity: isDark ? 0.6 : 0.3,
        roughness: 0.2
      });
      const node = new THREE.Mesh(geo, mat);
      node.position.copy(pos);
      mainGroup.add(node);
      dataNodeMeshes.push(node);
    });

    // 10. Mouse Parallax
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.35;
      targetY = y * 0.25;
    };

    const onMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    // 11. Resize Observer
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

    // 12. Animation Loop (Gentle, slow, organic)
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse interpolation
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;

      mainGroup.rotation.y = currentX * 0.6 + Math.sin(elapsed * 0.18) * 0.05;
      mainGroup.rotation.x = -currentY * 0.5 + Math.cos(elapsed * 0.15) * 0.04;

      // Central core gentle rotation & slow breathing pulse
      outerCoreMesh.rotation.y = elapsed * 0.25;
      outerCoreMesh.rotation.z = elapsed * 0.15;
      innerNucleus.rotation.y = -elapsed * 0.15;

      const pulse = 1.0 + Math.sin(elapsed * 1.2) * 0.035;
      innerNucleus.scale.set(pulse, pulse, pulse);

      // Orbital rings
      orbit1.rotation.z = elapsed * 0.12;
      orbit2.rotation.z = -elapsed * 0.1;

      // Floating paper layers undulate gently
      paperMeshes.forEach((mesh, idx) => {
        mesh.position.y += Math.sin(elapsed * 1.1 + idx * 1.4) * 0.002;
        mesh.rotation.z += Math.sin(elapsed * 0.8 + idx) * 0.0008;
      });

      // Data nodes gentle drift
      dataNodeMeshes.forEach((node, idx) => {
        node.rotation.y = elapsed * 0.6;
        node.position.y += Math.sin(elapsed * 1.5 + idx) * 0.0015;
      });

      // Particles slow drift
      particleSystem.rotation.y = elapsed * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // 13. Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      resizeObserver.disconnect();

      renderer.dispose();
      tex1.dispose();
      tex2.dispose();
      tex3.dispose();
      outerCoreGeo.dispose();
      outerCoreMat.dispose();
      innerNucleusGeo.dispose();
      innerNucleusMat.dispose();
      orbit1Geo.dispose();
      orbit1Mat.dispose();
      orbit2Geo.dispose();
      orbit2Mat.dispose();
      pGeo.dispose();
      pMat.dispose();
    };
  }, [theme, createPaperTexture]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] select-none overflow-hidden ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
      />
    </div>
  );
};
