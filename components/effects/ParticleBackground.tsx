'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    const maxParticles = 40;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -(Math.random() * 0.5 + 0.2),
      opacity: Math.random() * 0.5 + 0.1,
      life: 0,
      maxLife: Math.random() * 300 + 200,
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new particles
      if (particles.length < maxParticles && Math.random() > 0.9) {
        particles.push(createParticle());
      }

      // Update and draw
      particles = particles.filter((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.life++;

        if (p.life >= p.maxLife) return false;

        const fadeRatio = 1 - p.life / p.maxLife;
        const alpha = p.opacity * fadeRatio;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`;
        ctx.fill();

        return true;
      });

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
