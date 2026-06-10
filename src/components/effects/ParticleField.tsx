import React, { useEffect, useRef } from 'react';

/**
 * Interactive 3D particle network rendered on canvas.
 * Particles live in 3D space, slowly rotate, and react to the mouse –
 * the whole field tilts toward the cursor and nearby particles connect.
 * Zero dependencies, respects prefers-reduced-motion, pauses off-screen.
 */

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

const PARTICLE_COUNT = 110;
const DEPTH = 600;
const CONNECT_DIST = 130;

export default function ParticleField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;
    let rotY = 0;

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect?.width ?? window.innerWidth;
      height = rect?.height ?? window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: (Math.random() - 0.5) * width * 1.2,
      y: (Math.random() - 0.5) * height * 1.2,
      z: (Math.random() - 0.5) * DEPTH,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      vz: (Math.random() - 0.5) * 0.12,
    }));

    function onMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    // Pause when not visible
    const observer = new IntersectionObserver(
      entries => { running = entries[0]?.isIntersecting ?? true; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    type Projected = { sx: number; sy: number; scale: number; p: Particle };
    const projected: Projected[] = new Array(PARTICLE_COUNT);

    function frame() {
      raf = requestAnimationFrame(frame);
      if (!running) return;

      // Ease mouse
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      rotY += 0.0011;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const fov = 500;

      // Mouse-driven tilt
      const tiltX = mouse.y * 0.25;
      const tiltY = rotY + mouse.x * 0.35;

      const cosY = Math.cos(tiltY), sinY = Math.sin(tiltY);
      const cosX = Math.cos(tiltX), sinX = Math.sin(tiltX);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx; p.y += p.vy; p.z += p.vz;

        // Soft wrap
        const bx = width * 0.7, by = height * 0.7, bz = DEPTH * 0.6;
        if (p.x > bx) p.x = -bx; else if (p.x < -bx) p.x = bx;
        if (p.y > by) p.y = -by; else if (p.y < -by) p.y = by;
        if (p.z > bz) p.z = -bz; else if (p.z < -bz) p.z = bz;

        // Rotate around Y then X
        let x = p.x * cosY - p.z * sinY;
        let z = p.x * sinY + p.z * cosY;
        let y = p.y * cosX - z * sinX;
        z = p.y * sinX + z * cosX;

        const scale = fov / (fov + z + DEPTH / 2);
        projected[i] = { sx: cx + x * scale, sy: cy + y * scale, scale, p };
      }

      // Connections
      ctx.lineWidth = 1;
      for (let i = 0; i < projected.length; i++) {
        const a = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const b = projected[j];
          const dx = a.sx - b.sx;
          const dy = a.sy - b.sy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.14 * Math.min(a.scale, b.scale);
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.stroke();
          }
        }
      }

      // Particles
      for (let i = 0; i < projected.length; i++) {
        const { sx, sy, scale } = projected[i];
        const r = Math.max(0.6, 1.8 * scale);
        const alpha = 0.25 + scale * 0.45;
        // Mix of blue / violet / amber
        const hue = i % 3 === 0 ? '59, 130, 246' : i % 3 === 1 ? '139, 92, 246' : '245, 158, 11';
        ctx.fillStyle = `rgba(${hue}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
