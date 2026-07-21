import { useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   BackgroundEffects
   Layers (back → front):
     1. Animated hexagonal grid pulse
     2. Neural-net particles + connecting lines
     3. Matrix byte-code rain columns with glowing heads
     4. Floating geometric shapes (triangles, diamonds, squares)
     5. Mouse proximity glow + click ripples
────────────────────────────────────────────────────────────────────────────── */

// ─── helpers ──────────────────────────────────────────────────────────────────
const rand = (a: number, b: number) => Math.random() * (b - a) + a;
const randI = (a: number, b: number) => Math.floor(rand(a, b + 1));
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const TAU = Math.PI * 2;

// ─── symbol pool ──────────────────────────────────────────────────────────────
const CHARS = [
  '0',
  '1',
  '0',
  '1',
  '1',
  '0',
  '0x',
  'FF',
  'A3',
  'BE',
  '7C',
  'D4',
  '{}',
  '[]',
  '()',
  '<>',
  '&&',
  '||',
  '=>',
  'AI',
  'ML',
  'DB',
  'NLP',
  'API',
  '∑',
  'λ',
  '∂',
  '∞',
  'π',
  '404',
  '200',
  '01',
  '10',
];

// ─── types ────────────────────────────────────────────────────────────────────
interface Column {
  x: number;
  y: number;
  speed: number;
  fs: number;
  trail: string[];
  hue: number;
  glow: number;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  opacity: number;
  hue: number;
}
interface GeoShape {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  spin: number;
  sides: number;
  opacity: number;
  hue: number;
}
interface Ripple {
  x: number;
  y: number;
  r: number;
  a: number;
}

// ─── component ────────────────────────────────────────────────────────────────
const BackgroundEffects = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d', { alpha: true });
    if (!ctx) return;

    let W = (cv.width = window.innerWidth);
    let H = (cv.height = window.innerHeight);
    let raf: number;
    let frame = 0;
    let mx = -9999,
      my = -9999;

    // ── theme ──────────────────────────────────────────────────────────────────
    const dark = () => document.documentElement.classList.contains('dark');

    const parseAccentHsl = (value: string) => {
      const match = value.trim().match(/^(-?\d+\.?\d*)\s+(\d+%?)\s+(\d+%?)$/);
      if (!match) {
        return { h: 160, s: '84%', l: '39%' };
      }
      return { h: Number(match[1]), s: match[2], l: match[3] };
    };

    const getAccentHsl = () => {
      const accentVar = getComputedStyle(
        document.documentElement,
      ).getPropertyValue('--portfolio-accent');
      return parseAccentHsl(accentVar || '160 84% 39%');
    };

    const themePalette = (
      baseHue: number,
      accent: { h: number; s: string; l: string },
      isDark: boolean,
    ) => ({
      colHead: (h: number) =>
        `hsla(${baseHue + h},${accent.s},${isDark ? '68%' : '38%'},1)`,
      colBody: (h: number, a: number) =>
        `hsla(${baseHue + h},${accent.s},${isDark ? '58%' : '44%'},${a})`,
      particle: (h: number, a: number) =>
        `hsla(${baseHue + h + 8},${accent.s},${isDark ? '65%' : '45%'},${a})`,
      line: (a: number) =>
        `hsla(${baseHue + 6},${accent.s},${isDark ? '58%' : '50%'},${a})`,
      geo: (h: number, a: number) =>
        `hsla(${baseHue + h + 18},${accent.s},${isDark ? '68%' : '48%'},${a})`,
      grid: `hsla(${baseHue + 5},${accent.s},${isDark ? '45%' : '40%'},${isDark ? 0.015 : 0.02})`,
      ripple: (a: number) =>
        `hsla(${baseHue + 4},${accent.s},${isDark ? '62%' : '55%'},${a})`,
      mouse: `hsla(${baseHue + 12},${accent.s},${isDark ? '55%' : '50%'},0.1)`,
    });

    // ── Layer 1 ─ hex-grid state ──────────────────────────────────────────────
    const HEX_SIZE = 52;
    // precompute grid centres
    const hexCells: { cx: number; cy: number; phase: number }[] = [];
    const hxStep = HEX_SIZE * 1.75;
    const hyStep = HEX_SIZE * Math.sqrt(3);
    for (let col = -1; col < W / hxStep + 2; col++) {
      for (let row = -1; row < H / hyStep + 2; row++) {
        hexCells.push({
          cx: col * hxStep + (row % 2 === 0 ? 0 : hxStep / 2),
          cy: row * hyStep,
          phase: rand(0, TAU),
        });
      }
    }

    // ── Layer 2 ─ neural particles ────────────────────────────────────────────
    const N_PARTICLES = Math.min(55, Math.floor(W / 22));
    const particles: Particle[] = Array.from({ length: N_PARTICLES }, () => ({
      x: rand(0, W),
      y: rand(0, H),
      vx: rand(-0.4, 0.4),
      vy: rand(-0.4, 0.4),
      r: rand(0.8, 1.8), // small pinpoint dots
      opacity: rand(0.08, 0.18),
      hue: rand(-25, 25),
    }));
    const LINK_DIST = 120;

    // ── Layer 3 ─ byte columns ────────────────────────────────────────────────
    const COL_GAP = 30;
    const colCount = Math.ceil(W / COL_GAP);
    const columns: Column[] = Array.from({ length: colCount }, (_, i) => ({
      x: i * COL_GAP + rand(0, COL_GAP * 0.5),
      y: rand(-H * 1.2, 0),
      speed: rand(0.55, 1.9),
      fs: randI(10, 15),
      trail: Array.from({ length: randI(5, 16) }, () => pick(CHARS)),
      hue: rand(-18, 18),
      glow: rand(0, TAU),
    }));

    // ── Layer 4 ─ geometric shapes ────────────────────────────────────────────
    const N_SHAPES = 18;
    const shapes: GeoShape[] = Array.from({ length: N_SHAPES }, () => ({
      x: rand(0, W),
      y: rand(0, H),
      vx: rand(-0.4, 0.4),
      vy: rand(-0.35, 0.35),
      size: rand(8, 22),
      angle: rand(0, TAU),
      spin: rand(-0.006, 0.006),
      sides: pick([3, 4, 6]), // triangle, square, hexagon
      opacity: rand(0.03, 0.08),
      hue: rand(-30, 30),
    }));

    // ── Layer 5 ─ click ripples ───────────────────────────────────────────────
    const ripples: Ripple[] = [];
    const onClick = (e: MouseEvent) => {
      ripples.push({ x: e.clientX, y: e.clientY, r: 0, a: 0.65 });
      if (ripples.length > 16) ripples.shift();
    };

    // ── resize & mouse ────────────────────────────────────────────────────────
    const onResize = () => {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
    };
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onLeave = () => {
      mx = -9999;
      my = -9999;
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('click', onClick);

    // ── draw helper: regular polygon ──────────────────────────────────────────
    const polygon = (
      x: number,
      y: number,
      sides: number,
      size: number,
      angle: number,
    ) => {
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const a = angle + (TAU * i) / sides;
        if (i === 0) {
          ctx.moveTo(x + Math.cos(a) * size, y + Math.sin(a) * size);
        } else {
          ctx.lineTo(x + Math.cos(a) * size, y + Math.sin(a) * size);
        }
      }
      ctx.closePath();
    };

    // ─── main loop ────────────────────────────────────────────────────────────
    const loop = () => {
      frame++;
      const d = dark();
      const accentHsl = getAccentHsl();
      const pal = themePalette(accentHsl.h, accentHsl, d);

      ctx.clearRect(0, 0, W, H);

      /* ══ 1. HEX GRID PULSE ═══════════════════════════════════════════════ */
      hexCells.forEach((cell) => {
        cell.phase += 0.006;
        const pulse = 0.5 + 0.5 * Math.sin(cell.phase);
        const dm = Math.hypot(cell.cx - mx, cell.cy - my);
        const prox = Math.max(0, 1 - dm / 220) * 0.5;

        const a = pulse * 0.02 + prox * 0.03;
        ctx.strokeStyle = pal.grid;
        ctx.lineWidth = 0.7;

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (TAU * i) / 6;
          const px = cell.cx + Math.cos(angle) * HEX_SIZE;
          const py = cell.cy + Math.sin(angle) * HEX_SIZE;
          if (i === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.closePath();
        ctx.stroke();
      });

      /* ══ 2. NEURAL PARTICLES & LINES ═════════════════════════════════════ */
      // Move particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
      });

      // Draw connecting lines first
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const lineA = (1 - dist / LINK_DIST) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = pal.line(lineA);
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw particle dots
      particles.forEach((p) => {
        const dm = Math.hypot(p.x - mx, p.y - my);
        const prox = Math.max(0, 1 - dm / 100);
        const a = p.opacity + prox * 0.08;

        // outer glow ring
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 1.8);
        g.addColorStop(0, pal.particle(p.hue, a * 0.5));
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 1.8, 0, TAU);
        ctx.fill();

        // core dot
        ctx.fillStyle = pal.particle(p.hue, a);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, TAU);
        ctx.fill();
      });

      /* ══ 3. MATRIX BYTE COLUMNS ══════════════════════════════════════════ */
      columns.forEach((col) => {
        col.glow += 0.038;
        const gp = 0.72 + 0.28 * Math.sin(col.glow);
        const dm = Math.hypot(col.x - mx, col.y - my);
        const prox = Math.max(0, 1 - dm / 110);

        col.trail.forEach((ch, idx) => {
          const cy = col.y - idx * (col.fs + 3);
          if (cy < -30 || cy > H + 30) return;

          const fade = 1 - idx / col.trail.length;
          const isHead = idx === 0;

          ctx.font = `${isHead ? 'bold ' : ''}${col.fs}px 'Courier New',monospace`;

          if (isHead) {
            ctx.shadowColor = pal.colHead(col.hue);
            ctx.shadowBlur = 12 + prox * 16;
            ctx.fillStyle = pal
              .colHead(col.hue)
              .replace('1)', `${(0.15 + prox * 0.1) * gp})`);
            ctx.fillText(ch, col.x, cy);
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
          } else {
            const a = Math.max(0, fade * 0.08 + prox * 0.05) * gp;
            ctx.fillStyle = pal.colBody(col.hue, a);
            ctx.fillText(ch, col.x, cy);
          }
        });

        // advance & mutate
        col.y += col.speed;
        if (frame % 7 === 0 && Math.random() < 0.45) {
          col.trail[randI(1, col.trail.length - 1)] = pick(CHARS);
        }
        // reset when whole column is off-screen
        if (col.y - col.trail.length * (col.fs + 3) > H) {
          col.y = rand(-H * 0.5, -50);
          col.speed = rand(0.55, 1.9);
          col.trail = Array.from({ length: randI(5, 18) }, () => pick(CHARS));
          col.x = rand(0, W);
        }
      });

      /* ══ 4. GEOMETRIC FLOATING SHAPES ════════════════════════════════════ */
      shapes.forEach((s) => {
        s.angle += s.spin;
        s.x += s.vx;
        s.y += s.vy;

        if (s.x < -40) s.x = W + 40;
        if (s.x > W + 40) s.x = -40;
        if (s.y < -40) s.y = H + 40;
        if (s.y > H + 40) s.y = -40;

        const dm = Math.hypot(s.x - mx, s.y - my);
        const prox = Math.max(0, 1 - dm / 130);
        const pulse = 0.6 + 0.4 * Math.sin(frame * s.spin * 12 + s.angle);
        const a = (s.opacity + prox * 0.06) * pulse;

        polygon(s.x, s.y, s.sides, s.size, s.angle);
        ctx.strokeStyle = pal.geo(s.hue, a);
        ctx.lineWidth = 1.1 + prox * 0.6;
        ctx.stroke();

        // faint fill
        polygon(s.x, s.y, s.sides, s.size, s.angle);
        ctx.fillStyle = pal.geo(s.hue, a * 0.12);
        ctx.fill();
      });

      /* ══ 5a. MOUSE PROXIMITY GLOW ════════════════════════════════════════ */
      if (mx > -1000) {
        const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 100);
        mg.addColorStop(0, pal.mouse);
        mg.addColorStop(1, 'transparent');
        ctx.fillStyle = mg;
        ctx.beginPath();
        ctx.arc(mx, my, 100, 0, TAU);
        ctx.fill();
      }

      /* ══ 5b. CLICK RIPPLES ═══════════════════════════════════════════════ */
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.r += 2.8;
        rip.a -= 0.02;
        if (rip.a <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        // three concentric rings
        [1, 0.62, 0.35].forEach((scale, si) => {
          ctx.beginPath();
          ctx.arc(rip.x, rip.y, rip.r * scale, 0, TAU);
          ctx.strokeStyle = pal.ripple(rip.a * (1 - si * 0.3));
          ctx.lineWidth = 1.6 - si * 0.4;
          ctx.stroke();
        });
      }

      raf = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 z-0 pointer-events-none select-none w-full h-full"
      aria-hidden="true"
    />
  );
};

export default BackgroundEffects;
