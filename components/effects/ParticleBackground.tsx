'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// ═══════════════════════════════════════════
// 粒子类型
// ═══════════════════════════════════════════

interface Sakura {
  x: number; y: number;
  size: number;
  speed: number;
  swayAmp: number; swaySpd: number;
  phase: number;
  rotation: number; rotSpd: number;
  opacity: number;
  tint: string;
}

interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  life: number; maxLife: number;
  r: number; g: number; b: number;
  alpha: number;
}

// ═══════════════════════════════════════════
// 城市 → 图片映射
// ═══════════════════════════════════════════

function getBgPath(pathname: string): string {
  if (pathname.includes('/tokyo')) return '/images/cities/tokyo-bg.png';
  if (pathname.includes('/osaka')) return '/images/cities/osaka-bg.png';
  if (pathname.includes('/kyoto')) return '/images/cities/kyoto-bg.png';
  if (pathname.includes('/kamakura')) return '/images/cities/kamakura-bg.png';
  return '/images/cities/home-bg-new.png'; // Dashboard / HOME
}

const sakuraColors = [
  '#ffb7c5', '#ffc8d6', '#ffd8e2',
  '#ffe8ee', '#ff9eb5', '#ffc0cb',
];

const sparkColors = [
  '#ff6b9d', '#ffb347', '#ff2d78',
  '#ffc107', '#00c8ff', '#a78bfa',
];

// ═══════════════════════════════════════════
// 主组件
// ═══════════════════════════════════════════

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const bgPath = getBgPath(pathname);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const c = ctx;

    let animId: number;
    let w = 0;
    let h = 0;
    let bgImage: HTMLImageElement | null = null;

    // ── 加载背景图 ──
    const img = new Image();
    img.src = bgPath;
    img.onload = () => { bgImage = img; };

    // ── 初始化樱花 ──
    const sakura: Sakura[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 9 + 4,
      speed: Math.random() * 0.5 + 0.18,
      swayAmp: Math.random() * 2.5 + 0.8,
      swaySpd: Math.random() * 0.018 + 0.005,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotSpd: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.4 + 0.35,
      tint: sakuraColors[Math.floor(Math.random() * sakuraColors.length)],
    }));

    // ── 初始化火花粒子 ──
    const sparks: Spark[] = [];

    function spawnSpark(): Spark {
      const hex = sparkColors[Math.floor(Math.random() * sparkColors.length)];
      return {
        x: Math.random() * w,
        y: h + 10,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(Math.random() * 0.5 + 0.2),
        size: Math.random() * 2.5 + 1,
        life: 0,
        maxLife: Math.random() * 350 + 180,
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
        alpha: Math.random() * 0.5 + 0.3,
      };
    }

    // ── resize ──
    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * devicePixelRatio;
      canvas!.height = h * devicePixelRatio;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      c.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    // ── 渲染循环 ──
    function render(ts: number) {
      c.clearRect(0, 0, w, h);

      // 1) 背景图（呼吸式缩放 + 微平移）
      if (bgImage && bgImage.complete) {
        const breathe = 1 + Math.sin(ts * 0.0003) * 0.015;
        const panX = Math.sin(ts * 0.0002) * 6;

        const imgRatio = bgImage.naturalWidth / bgImage.naturalHeight;
        const canvasRatio = w / h;
        let sw: number, sh: number;
        if (imgRatio > canvasRatio) {
          sh = bgImage.naturalHeight;
          sw = sh * canvasRatio;
        } else {
          sw = bgImage.naturalWidth;
          sh = sw / canvasRatio;
        }
        const sx = (bgImage.naturalWidth - sw) / 2;
        const sy = (bgImage.naturalHeight - sh) / 2;

        c.save();
        c.translate(w / 2 + panX, h / 2);
        c.scale(breathe, breathe);
        c.globalAlpha = 0.92;
        c.drawImage(bgImage, sx, sy, sw, sh, -w / 2, -h / 2, w, h);
        c.restore();
      } else {
        // 加载中退路
        const fb = c.createLinearGradient(0, 0, 0, h);
        fb.addColorStop(0, '#0a0820');
        fb.addColorStop(0.5, '#151040');
        fb.addColorStop(1, '#100c28');
        c.fillStyle = fb;
        c.fillRect(0, 0, w, h);
      }

      // 2) 渐变遮罩（底部加深，文字可读）
      const overlay = c.createLinearGradient(0, 0, 0, h);
      overlay.addColorStop(0, 'rgba(0,0,0,0.02)');
      overlay.addColorStop(0.3, 'rgba(0,0,0,0.08)');
      overlay.addColorStop(0.55, 'rgba(0,0,0,0.18)');
      overlay.addColorStop(0.75, 'rgba(0,0,0,0.4)');
      overlay.addColorStop(1, 'rgba(0,0,0,0.75)');
      c.fillStyle = overlay;
      c.fillRect(0, 0, w, h);

      // 3) 火花粒子
      if (sparks.length < 35 && Math.random() > 0.78) {
        sparks.push(spawnSpark());
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life >= p.maxLife || p.y < -30 || p.x < -30 || p.x > w + 30) {
          sparks.splice(i, 1);
          continue;
        }
        const fade = 1 - p.life / p.maxLife;
        const a = p.alpha * fade;

        const glow = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
        glow.addColorStop(0, `rgba(${p.r},${p.g},${p.b},${(a * 0.6).toFixed(2)})`);
        glow.addColorStop(0.4, `rgba(${p.r},${p.g},${p.b},${(a * 0.15).toFixed(2)})`);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = glow;
        c.beginPath();
        c.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
        c.fill();

        c.fillStyle = `rgba(${p.r},${p.g},${p.b},${(a * 0.85).toFixed(2)})`;
        c.beginPath();
        c.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        c.fill();
      }

      // 4) 樱花飞舞
      for (const s of sakura) {
        s.y += s.speed;
        s.phase += s.swaySpd;
        s.rotation += s.rotSpd;
        s.x += Math.sin(s.phase) * s.swayAmp * 0.45;

        if (s.y > h + 35) { s.y = -35; s.x = Math.random() * w; }
        if (s.x > w + 35) s.x = -35;
        if (s.x < -35) s.x = w + 35;

        c.save();
        c.translate(s.x, s.y);
        c.rotate(s.rotation);
        c.globalAlpha = s.opacity;

        // 花瓣主体
        c.fillStyle = s.tint;
        c.beginPath();
        c.ellipse(0, 0, s.size * 0.5, s.size * 0.25, 0, 0, Math.PI * 2);
        c.fill();

        // 花瓣裂口
        c.fillStyle = 'rgba(0,0,0,0.05)';
        c.beginPath();
        c.arc(s.size * 0.3, 0, s.size * 0.1, 0, Math.PI * 2);
        c.fill();

        // 高光
        c.fillStyle = 'rgba(255,255,255,0.22)';
        c.beginPath();
        c.ellipse(-s.size * 0.1, -s.size * 0.05, s.size * 0.15, s.size * 0.06, 0, 0, Math.PI * 2);
        c.fill();

        c.restore();
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [bgPath]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
