import React, { useEffect, useRef } from 'react';
import { OrbState } from '../types/index.ts';

interface ParticleOrbProps {
  state: OrbState;
  onClick?: () => void;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  phase: number;
  hue: number;
}

export const ParticleOrb: React.FC<ParticleOrbProps> = ({ state, onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = 240);
    let height = (canvas.height = 240);

    // Generate 3D sphere points (Dribbble Iridescent Crystal Sphere)
    const pointCount = 360;
    const radius = 78;
    const points: Point3D[] = [];

    for (let i = 0; i < pointCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / pointCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      // Pastel hues: soft blue (200), lavender (260), pink (310), turquoise (180)
      const hues = [190, 210, 250, 275, 310];
      const hue = hues[Math.floor(Math.random() * hues.length)];

      points.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        size: Math.random() * 1.8 + 1.0,
        phase: Math.random() * Math.PI * 2,
        hue,
      });
    }

    let angleX = 0;
    let angleY = 0;
    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Determine state speeds & pulse
      let speedY = 0.006;
      let speedX = 0.003;
      let pulseMultiplier = 1;

      if (state === 'listening') {
        speedY = 0.014;
        speedX = 0.007;
        pulseMultiplier = 1 + Math.sin(tick * 0.12) * 0.08;
      } else if (state === 'thinking') {
        speedY = 0.024;
        speedX = 0.012;
        pulseMultiplier = 1 + Math.sin(tick * 0.25) * 0.12;
      } else if (state === 'speaking') {
        speedY = 0.012;
        speedX = 0.006;
        pulseMultiplier = 1 + Math.abs(Math.sin(tick * 0.18)) * 0.1;
      }

      angleY += speedY;
      angleX += speedX;

      // 1. Draw outer soft glowing aura
      const auraGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.2,
        centerX,
        centerY,
        radius * 1.45 * pulseMultiplier
      );
      auraGrad.addColorStop(0, 'rgba(168, 85, 247, 0.16)');
      auraGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.12)');
      auraGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.45 * pulseMultiplier, 0, Math.PI * 2);
      ctx.fill();

      // 2. Project points
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      const projected = points.map((p) => {
        const dynamicRadius = pulseMultiplier;
        const bx = p.baseX * dynamicRadius;
        const by = p.baseY * dynamicRadius;
        const bz = p.baseZ * dynamicRadius;

        const x1 = bx * cosY - bz * sinY;
        const z1 = bz * cosY + bx * sinY;

        const y2 = by * cosX - z1 * sinX;
        const z2 = z1 * cosX + by * sinX;

        const fov = 300;
        const scale = fov / (fov + z2);
        const screenX = centerX + x1 * scale;
        const screenY = centerY + y2 * scale;
        const alpha = Math.max(0.2, Math.min(1, (z2 + radius) / (2 * radius) * 0.8 + 0.2));

        return {
          screenX,
          screenY,
          size: p.size * scale,
          z: z2,
          alpha,
          hue: p.hue,
        };
      });

      projected.sort((a, b) => a.z - b.z);

      // 3. Render crystalline fiber filaments & sparks
      for (let i = 0; i < projected.length; i++) {
        const pt = projected[i];

        // Fiber lines radiating to center core
        if (pt.z > -10 && i % 2 === 0) {
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(pt.screenX, pt.screenY);
          ctx.strokeStyle = `hsla(${pt.hue}, 85%, 68%, ${pt.alpha * 0.35})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }

        // Shimmering particle dot
        ctx.beginPath();
        ctx.arc(pt.screenX, pt.screenY, Math.max(0.7, pt.size), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${pt.hue}, 90%, 75%, ${pt.alpha})`;
        ctx.fill();
      }

      // 4. Draw central bright pearl white core
      const coreGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius * 0.38
      );
      coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      coreGrad.addColorStop(0.4, 'rgba(224, 242, 254, 0.8)');
      coreGrad.addColorStop(0.8, 'rgba(192, 132, 252, 0.3)');
      coreGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.38, 0, Math.PI * 2);
      ctx.fill();

      // 5. Outer translucent glass bubble rim & glare (Dribbble Crystal Ball effect)
      const glassGrad = ctx.createRadialGradient(
        centerX - radius * 0.35,
        centerY - radius * 0.35,
        radius * 0.05,
        centerX,
        centerY,
        radius * 1.08
      );
      glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
      glassGrad.addColorStop(0.25, 'rgba(255, 255, 255, 0.1)');
      glassGrad.addColorStop(0.8, 'rgba(168, 85, 247, 0.08)');
      glassGrad.addColorStop(0.98, 'rgba(56, 189, 248, 0.35)');
      glassGrad.addColorStop(1, 'rgba(255, 255, 255, 0.6)');

      ctx.fillStyle = glassGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.08, 0, Math.PI * 2);
      ctx.fill();

      // Outer delicate hairline rim
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.08, 0, Math.PI * 2);
      ctx.stroke();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [state]);

  return (
    <div
      onClick={onClick}
      className="relative flex items-center justify-center cursor-pointer select-none"
    >
      <canvas
        ref={canvasRef}
        className="w-[240px] h-[240px] transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
};
