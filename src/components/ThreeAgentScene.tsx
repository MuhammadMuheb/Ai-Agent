import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbState } from '../types/index.ts';

interface ThreeAgentSceneProps {
  state: OrbState;
  onOrbClick?: () => void;
  className?: string;
  size?: number;
}

export const ThreeAgentScene: React.FC<ThreeAgentSceneProps> = ({
  state,
  onOrbClick,
  className = '',
  size = 280,
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

    const width = size;
    const height = size;

    // 2. Scene setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

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

    // 3. Composite 3-12 Part Procedural 3D Subject (THREE.Group)
    const agentCoreGroup = new THREE.Group();
    scene.add(agentCoreGroup);

    // Part 1: Outer Iridescent Geodesic Glass Shell
    const shellGeometry = new THREE.IcosahedronGeometry(2.1, 2);
    const shellMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.15,
      transmission: 0.82,
      ior: 1.45,
      transparent: true,
      opacity: 0.75,
      wireframe: false,
    });
    const shellMesh = new THREE.Mesh(shellGeometry, shellMaterial);
    agentCoreGroup.add(shellMesh);

    // Subtle geodesic wireframe accent
    const wireGeo = new THREE.WireframeGeometry(shellGeometry);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
    });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    agentCoreGroup.add(wireMesh);

    // Part 2: Dual Concentric Gyroscopic Rings
    const ring1Geo = new THREE.TorusGeometry(2.65, 0.035, 16, 96);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      roughness: 0.2,
      metalness: 0.85,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.4,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    agentCoreGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(3.1, 0.025, 16, 96);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.25,
      metalness: 0.8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 2.8;
    agentCoreGroup.add(ring2);

    // Part 3: Gyro Beacon Nodes on Rings
    const beaconGeo = new THREE.SphereGeometry(0.075, 12, 12);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x38bdf8,
      emissiveIntensity: 2.0,
      roughness: 0.1,
    });
    const beaconCount = 6;
    for (let i = 0; i < beaconCount; i++) {
      const angle = (i / beaconCount) * Math.PI * 2;
      const bMesh = new THREE.Mesh(beaconGeo, beaconMat);
      bMesh.position.set(Math.cos(angle) * 2.65, Math.sin(angle) * 2.65, 0);
      ring1.add(bMesh);
    }

    // Part 4: Inner Volumetric Particle Swarm (1,200 points)
    const particleCount = 1100;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    // Color palette: Cyan, Sky Blue, Lavender, Violet, Rose
    const palette = [
      new THREE.Color(0x38bdf8), // Cyan
      new THREE.Color(0x60a5fa), // Blue
      new THREE.Color(0x818cf8), // Indigo
      new THREE.Color(0xc084fc), // Lavender
      new THREE.Color(0xf472b6), // Rose
      new THREE.Color(0x2dd4bf), // Teal
    ];

    const pRadius = 1.6;
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      const r = pRadius * (0.35 + 0.65 * Math.cbrt(Math.random()));

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Procedural soft circle particle texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const radGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      radGrad.addColorStop(0, 'rgba(255,255,255,1)');
      radGrad.addColorStop(0.3, 'rgba(255,255,255,0.8)');
      radGrad.addColorStop(0.7, 'rgba(255,255,255,0.2)');
      radGrad.addColorStop(1, 'rgba(255,255,255,0)');
      pCtx.fillStyle = radGrad;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const particleTex = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      map: particleTex,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    agentCoreGroup.add(particleCloud);

    // Part 5: Central Glowing Pearl Nucleus
    const coreGeo = new THREE.SphereGeometry(0.72, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x93c5fd,
      emissiveIntensity: 0.9,
      roughness: 0.15,
      metalness: 0.2,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    agentCoreGroup.add(coreMesh);

    // Part 6: Orbiting Sub-Agent Worker Satellites (4 Satellites)
    const satelliteGroup = new THREE.Group();
    agentCoreGroup.add(satelliteGroup);

    const satGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const satMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 1.2 }),
      new THREE.MeshStandardMaterial({ color: 0x818cf8, emissive: 0x818cf8, emissiveIntensity: 1.2 }),
      new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0xa855f7, emissiveIntensity: 1.2 }),
      new THREE.MeshStandardMaterial({ color: 0x34d399, emissive: 0x34d399, emissiveIntensity: 1.2 }),
    ];

    const satMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const sMesh = new THREE.Mesh(satGeo, satMaterials[i]);
      satMeshes.push(sMesh);
      satelliteGroup.add(sMesh);
    }

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xe0e7ff, 2.2);
    keyLight.position.set(5, 6, 7);
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0x38bdf8, 0x0c121e, 1.2);
    scene.add(fillLight);

    const coreLight = new THREE.PointLight(0xa855f7, 2.5, 8);
    coreMesh.add(coreLight);

    // 5. Interactive Mouse Damping
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = mouseX * 0.45;
      targetRotX = -mouseY * 0.45;
    };

    container.addEventListener('mousemove', onPointerMove);

    // 6. Animation Loop with Lossless 60fps & State Handling
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Damped rotation to pointer
      agentCoreGroup.rotation.y += (targetRotY - agentCoreGroup.rotation.y) * (1 - Math.exp(-5 * delta));
      agentCoreGroup.rotation.x += (targetRotX - agentCoreGroup.rotation.x) * (1 - Math.exp(-5 * delta));

      // Dynamic State Behavior
      let speedMulti = 1.0;
      let pulseMulti = 1.0;

      if (state === 'listening') {
        speedMulti = 2.4;
        pulseMulti = 1.0 + Math.sin(elapsed * 7) * 0.12;
        coreLight.intensity = 3.5 + Math.sin(elapsed * 10) * 1.0;
      } else if (state === 'thinking') {
        speedMulti = 3.2;
        pulseMulti = 1.0 + Math.sin(elapsed * 12) * 0.15;
        coreLight.intensity = 4.0 + Math.sin(elapsed * 14) * 1.5;
      } else if (state === 'speaking') {
        speedMulti = 1.6;
        pulseMulti = 1.0 + Math.abs(Math.sin(elapsed * 8)) * 0.14;
        coreLight.intensity = 3.0 + Math.abs(Math.sin(elapsed * 8)) * 1.2;
      } else {
        // idle
        speedMulti = 0.8;
        pulseMulti = 1.0 + Math.sin(elapsed * 1.8) * 0.04;
        coreLight.intensity = 2.2 + Math.sin(elapsed * 2) * 0.4;
      }

      // Shell & wireframe gentle rotation
      shellMesh.rotation.y += 0.3 * speedMulti * delta;
      wireMesh.rotation.y += 0.3 * speedMulti * delta;
      shellMesh.scale.setScalar(pulseMulti);
      wireMesh.scale.setScalar(pulseMulti);

      // Gyroscopic rings rotation on independent axes
      ring1.rotation.z += 0.6 * speedMulti * delta;
      ring1.rotation.y += 0.4 * speedMulti * delta;

      ring2.rotation.z -= 0.5 * speedMulti * delta;
      ring2.rotation.x += 0.35 * speedMulti * delta;

      // Particles gentle drift & pulse
      particleCloud.rotation.y -= 0.25 * speedMulti * delta;
      particleCloud.scale.setScalar(pulseMulti * (1 + 0.03 * Math.sin(elapsed * 3)));

      // Core pulse
      coreMesh.scale.setScalar(0.95 + 0.1 * Math.sin(elapsed * 3 * speedMulti));

      // Satellites orbiting in circular paths at different inclinations
      satMeshes.forEach((mesh, index) => {
        const satAngle = elapsed * (0.8 + index * 0.2) * speedMulti + (index * Math.PI) / 2;
        const orbitR = 2.45 + (index % 2) * 0.35;
        const inc = ((index - 1.5) * Math.PI) / 4;
        mesh.position.set(
          Math.cos(satAngle) * orbitR,
          Math.sin(satAngle) * Math.cos(inc) * orbitR,
          Math.sin(satAngle) * Math.sin(inc) * orbitR
        );
      });

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // 7. Cleanup
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      container.removeEventListener('mousemove', onPointerMove);

      shellGeometry.dispose();
      shellMaterial.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      beaconGeo.dispose();
      beaconMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      particleTex.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      satGeo.dispose();
      satMaterials.forEach((m) => m.dispose());

      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [state, size]);

  return (
    <div
      ref={containerRef}
      onClick={onOrbClick}
      className={`relative flex items-center justify-center cursor-pointer select-none transition-transform duration-300 hover:scale-105 active:scale-95 ${className}`}
      style={{ width: size, height: size }}
      title="Interactive 3D Three.js Agent Core - Click to Speak"
    />
  );
};
