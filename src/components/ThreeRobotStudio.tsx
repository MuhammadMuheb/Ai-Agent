import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbState } from '../types/index.ts';

interface ThreeRobotStudioProps {
  state: OrbState;
  onRobotClick?: () => void;
  className?: string;
}

export const ThreeRobotStudio: React.FC<ThreeRobotStudioProps> = ({
  state,
  onRobotClick,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Detect software WebGL per Three.js directives
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 2. Scene, Camera, Renderer Setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.045);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 6.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.appendChild(renderer.domElement);

    // 3. Materials Library (PBR Metalness / Roughness Separation)
    // Dark Brushed Titanium Chassis
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0x1e2638,
      roughness: 0.28,
      metalness: 0.9,
    });

    // Polished Silver-Chrome Accents
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.12,
      metalness: 0.96,
    });

    // Dark Carbon Matte Understructure
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.65,
      metalness: 0.4,
    });

    // Glowing Holographic Eye / Visor Emissive Material
    const eyeEmissiveMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 2.8,
      roughness: 0.1,
      metalness: 0.2,
    });

    // Pupil Node Core
    const pupilMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    // Core Arc Reactor Glow
    const reactorMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 3.2,
      roughness: 0.15,
      metalness: 0.1,
    });

    // Translucent Core Crystal Cover
    const crystalGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.08,
      transmission: 0.92,
      ior: 1.5,
      transparent: true,
      opacity: 0.85,
    });

    // 4. Procedural Robot Construction (THREE.Group: 10 Composite Parts)
    const robotRoot = new THREE.Group();
    scene.add(robotRoot);
    robotRoot.position.y = -0.3;

    // --- Part A: Head & Cranium Assembly ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.35, 0);
    robotRoot.add(headGroup);

    // Main Skull Helmet
    const skullGeo = new THREE.CylinderGeometry(0.55, 0.48, 0.85, 32);
    const skullMesh = new THREE.Mesh(skullGeo, titaniumMat);
    headGroup.add(skullMesh);

    // Curved Top Dome
    const domeGeo = new THREE.SphereGeometry(0.55, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMesh = new THREE.Mesh(domeGeo, chromeMat);
    domeMesh.position.y = 0.42;
    headGroup.add(domeMesh);

    // Visor Shield Cutout (Dark glass recess)
    const visorPlateGeo = new THREE.BoxGeometry(0.82, 0.24, 0.25);
    const visorPlateMesh = new THREE.Mesh(visorPlateGeo, carbonMat);
    visorPlateMesh.position.set(0, 0.08, 0.46);
    headGroup.add(visorPlateMesh);

    // Dual Glowing Holographic Eyes
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(0, 0.08, 0.58);
    headGroup.add(eyeGroup);

    // Left Eye
    const leftEyeGeo = new THREE.CapsuleGeometry(0.065, 0.14, 8, 16);
    leftEyeGeo.rotateZ(Math.PI / 2);
    const leftEyeMesh = new THREE.Mesh(leftEyeGeo, eyeEmissiveMat);
    leftEyeMesh.position.set(-0.22, 0, 0);
    eyeGroup.add(leftEyeMesh);

    const leftPupilGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const leftPupil = new THREE.Mesh(leftPupilGeo, pupilMat);
    leftPupil.position.set(-0.22, 0, 0.035);
    eyeGroup.add(leftPupil);

    // Right Eye
    const rightEyeGeo = new THREE.CapsuleGeometry(0.065, 0.14, 8, 16);
    rightEyeGeo.rotateZ(Math.PI / 2);
    const rightEyeMesh = new THREE.Mesh(rightEyeGeo, eyeEmissiveMat);
    rightEyeMesh.position.set(0.22, 0, 0);
    eyeGroup.add(rightEyeMesh);

    const rightPupilGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const rightPupil = new THREE.Mesh(rightPupilGeo, pupilMat);
    rightPupil.position.set(0.22, 0, 0.035);
    eyeGroup.add(rightPupil);

    // Jaw / Chin Armor Plate
    const chinGeo = new THREE.CylinderGeometry(0.38, 0.26, 0.35, 16);
    const chinMesh = new THREE.Mesh(chinGeo, chromeMat);
    chinMesh.position.set(0, -0.42, 0.2);
    headGroup.add(chinMesh);

    // Lateral Ear Communication Nodes
    const earGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.18, 16);
    earGeo.rotateZ(Math.PI / 2);

    const leftEar = new THREE.Mesh(earGeo, chromeMat);
    leftEar.position.set(-0.56, 0.05, 0);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, chromeMat);
    rightEar.position.set(0.56, 0.05, 0);
    headGroup.add(rightEar);

    // Floating Holographic Halo Ring around Head
    const haloGeo = new THREE.TorusGeometry(0.85, 0.015, 16, 64);
    haloGeo.rotateX(Math.PI / 2.3);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
    });
    const haloRing = new THREE.Mesh(haloGeo, haloMat);
    haloRing.position.set(0, 0.65, 0);
    headGroup.add(haloRing);

    // --- Part B: Articulated Neck Joint ---
    const neckGroup = new THREE.Group();
    neckGroup.position.set(0, 0.78, 0);
    robotRoot.add(neckGroup);

    const neckPistonGeo = new THREE.CylinderGeometry(0.22, 0.24, 0.35, 16);
    const neckPiston = new THREE.Mesh(neckPistonGeo, carbonMat);
    neckGroup.add(neckPiston);

    const neckRingGeo = new THREE.TorusGeometry(0.28, 0.04, 16, 32);
    neckRingGeo.rotateX(Math.PI / 2);
    const neckRing = new THREE.Mesh(neckRingGeo, chromeMat);
    neckGroup.add(neckRing);

    // --- Part C: Torso & Chest Armor Chassis ---
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0, 0);
    robotRoot.add(torsoGroup);

    // Main Upper Chest Plate
    const chestPlateGeo = new THREE.CylinderGeometry(0.95, 0.75, 1.25, 6);
    chestPlateGeo.rotateY(Math.PI / 6);
    const chestPlate = new THREE.Mesh(chestPlateGeo, titaniumMat);
    torsoGroup.add(chestPlate);

    // Pectoral Inset Plates
    const leftPecGeo = new THREE.BoxGeometry(0.48, 0.52, 0.18);
    const leftPec = new THREE.Mesh(leftPecGeo, chromeMat);
    leftPec.position.set(-0.32, 0.22, 0.44);
    leftPec.rotation.y = 0.12;
    torsoGroup.add(leftPec);

    const rightPecGeo = new THREE.BoxGeometry(0.48, 0.52, 0.18);
    const rightPec = new THREE.Mesh(rightPecGeo, chromeMat);
    rightPec.position.set(0.32, 0.22, 0.44);
    rightPec.rotation.y = -0.12;
    torsoGroup.add(rightPec);

    // Central Neural Arc Reactor Core (Heart)
    const reactorCoreGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.12, 32);
    reactorCoreGeo.rotateX(Math.PI / 2);
    const reactorCore = new THREE.Mesh(reactorCoreGeo, reactorMat);
    reactorCore.position.set(0, 0.22, 0.54);
    torsoGroup.add(reactorCore);

    const reactorGlassCover = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2),
      crystalGlassMat
    );
    reactorGlassCover.rotateX(Math.PI / 2);
    reactorGlassCover.position.set(0, 0.22, 0.55);
    torsoGroup.add(reactorGlassCover);

    const reactorLight = new THREE.PointLight(0x38bdf8, 3.0, 5);
    reactorCore.add(reactorLight);

    // --- Part D: Hydraulic Shoulders & Pauldrons ---
    const leftShoulderGeo = new THREE.SphereGeometry(0.35, 24, 16);
    const leftShoulder = new THREE.Mesh(leftShoulderGeo, chromeMat);
    leftShoulder.position.set(-1.15, 0.38, 0);
    torsoGroup.add(leftShoulder);

    const leftArmStubGeo = new THREE.CylinderGeometry(0.18, 0.16, 0.55, 16);
    const leftArmStub = new THREE.Mesh(leftArmStubGeo, titaniumMat);
    leftArmStub.position.set(-1.18, -0.05, 0);
    torsoGroup.add(leftArmStub);

    const rightShoulderGeo = new THREE.SphereGeometry(0.35, 24, 16);
    const rightShoulder = new THREE.Mesh(rightShoulderGeo, chromeMat);
    rightShoulder.position.set(1.15, 0.38, 0);
    torsoGroup.add(rightShoulder);

    const rightArmStubGeo = new THREE.CylinderGeometry(0.18, 0.16, 0.55, 16);
    const rightArmStub = new THREE.Mesh(rightArmStubGeo, titaniumMat);
    rightArmStub.position.set(1.18, -0.05, 0);
    torsoGroup.add(rightArmStub);

    // --- Part E: Radial Ground Shadow & Ambient Particles ---
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(0,0,0,0.65)');
      grad.addColorStop(0.5, 'rgba(2,6,23,0.35)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.5;
    scene.add(shadowMesh);

    // Floating Atmospheric Data Particles around Robot
    const dustCount = 180;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 8;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 6 + 0.5;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.04,
      transparent: true,
      opacity: 0.45,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // 5. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xe0e7ff, 2.8);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    const fillLight = new THREE.HemisphereLight(0x93c5fd, 0x0a0f1d, 1.2);
    scene.add(fillLight);

    // 6. Interactive Cursor Tracking & Animation Loop
    let mouseX = 0;
    let mouseY = 0;
    let targetHeadRotY = 0;
    let targetHeadRotX = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = normX;
      mouseY = normY;

      // Restrict head rotation within ergonomic boundaries
      targetHeadRotY = normX * 0.45;
      targetHeadRotX = -normY * 0.3;
    };

    window.addEventListener('mousemove', onPointerMove);

    // Window Resize Handler
    const onResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', onResize);

    let lastTime = performance.now();
    const startTime = lastTime;
    let blinkTimer = 0;

    const animate = () => {
      const currentTime = performance.now();
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      const elapsed = (currentTime - startTime) / 1000;

      // Exponential damping on head rotation to track mouse
      const dampingFactor = 1 - Math.exp(-6 * delta);
      headGroup.rotation.y += (targetHeadRotY - headGroup.rotation.y) * dampingFactor;
      headGroup.rotation.x += (targetHeadRotX - headGroup.rotation.x) * dampingFactor;

      // Subtle torso breathing & harmonic movement
      torsoGroup.rotation.y = headGroup.rotation.y * 0.25;
      torsoGroup.position.y = Math.sin(elapsed * 1.8) * 0.035;
      headGroup.position.y = 1.35 + Math.sin(elapsed * 1.8) * 0.035;

      // Halo ring rotation
      haloRing.rotation.z += 0.8 * delta;

      // Dust particle floating
      dustParticles.rotation.y = elapsed * 0.04;

      // Eye Blinking Mechanism
      blinkTimer += delta;
      if (blinkTimer > 4.5 && blinkTimer < 4.65) {
        leftEyeMesh.scale.y = 0.1;
        rightEyeMesh.scale.y = 0.1;
      } else {
        leftEyeMesh.scale.y = 1.0;
        rightEyeMesh.scale.y = 1.0;
        if (blinkTimer > 5.5) blinkTimer = 0;
      }

      // State Reactivity (idle, listening, thinking, speaking)
      if (state === 'thinking') {
        const pulse = 1.0 + Math.sin(elapsed * 10) * 0.2;
        reactorLight.intensity = 4.5 + Math.sin(elapsed * 12) * 2.0;
        eyeEmissiveMat.emissiveIntensity = 3.6 + Math.sin(elapsed * 12) * 1.2;
        reactorCore.scale.setScalar(pulse);
      } else if (state === 'speaking') {
        const pulse = 1.0 + Math.abs(Math.sin(elapsed * 8)) * 0.18;
        reactorLight.intensity = 3.8 + Math.abs(Math.sin(elapsed * 8)) * 1.5;
        eyeEmissiveMat.emissiveIntensity = 3.2 + Math.abs(Math.sin(elapsed * 8)) * 1.0;
        reactorCore.scale.setScalar(pulse);
      } else if (state === 'listening') {
        reactorLight.intensity = 4.0 + Math.sin(elapsed * 6) * 1.0;
        eyeEmissiveMat.emissiveIntensity = 3.5;
      } else {
        // Idle breathing
        reactorLight.intensity = 2.4 + Math.sin(elapsed * 2) * 0.5;
        eyeEmissiveMat.emissiveIntensity = 2.8 + Math.sin(elapsed * 2) * 0.4;
        reactorCore.scale.setScalar(1.0 + Math.sin(elapsed * 2) * 0.04);
      }

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // 7. Proper Cleanup on Unmount (Zero Memory Leaks for 24/7 Running)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('resize', onResize);

      skullGeo.dispose();
      domeGeo.dispose();
      visorPlateGeo.dispose();
      leftEyeGeo.dispose();
      leftPupilGeo.dispose();
      rightEyeGeo.dispose();
      rightPupilGeo.dispose();
      chinGeo.dispose();
      earGeo.dispose();
      haloGeo.dispose();
      neckPistonGeo.dispose();
      neckRingGeo.dispose();
      chestPlateGeo.dispose();
      leftPecGeo.dispose();
      rightPecGeo.dispose();
      reactorCoreGeo.dispose();
      leftShoulderGeo.dispose();
      leftArmStubGeo.dispose();
      rightShoulderGeo.dispose();
      rightArmStubGeo.dispose();
      shadowGeo.dispose();
      shadowTex.dispose();
      dustGeo.dispose();

      titaniumMat.dispose();
      chromeMat.dispose();
      carbonMat.dispose();
      eyeEmissiveMat.dispose();
      pupilMat.dispose();
      reactorMat.dispose();
      crystalGlassMat.dispose();
      haloMat.dispose();
      shadowMat.dispose();
      dustMat.dispose();

      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [state]);

  return (
    <div
      ref={containerRef}
      onClick={onRobotClick}
      className={`w-full h-full relative cursor-grab active:cursor-grabbing select-none overflow-hidden ${className}`}
      title="3D Metallic AI Robot - Moves with your cursor"
    />
  );
};
