import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { playClick, playHover } from '@/hooks/useSoundEffects';
import {
  Github,
  Linkedin,
  Mail,
  ChevronDown,
  InstagramIcon,
  Figma,
  Pin,
  MessageCircle,
  Eye,
  Download,
} from 'lucide-react';
import Magnetic from './Magnetic';
import { PROFILE, SOCIAL_LINKS } from '@/data/constants';
import { gsap } from '@/lib/gsap';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import ResumeModal from './ResumeModal';

const roles = [
  'AI Engineer',
  'Data Analyst',
  'Full Stack Developer',
  'Prompt Engineer',
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  instagram: InstagramIcon,
  pinterest: Pin,
  figma: Figma,
  whatsapp: MessageCircle,
  email: Mail,
};

const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // ── GSAP Hero Entrance Timeline ──
  useGSAPContext(
    () => {
      const tl = gsap.timeline({ delay: 0.1 });

      // Split name letters into spans for stagger
      const nameLines = heroRef.current?.querySelectorAll('.gsap-name-line');
      if (nameLines && nameLines.length > 0) {
        tl.from(nameLines, {
          opacity: 0,
          y: 80,
          skewY: 4,
          stagger: 0.12,
          duration: 1,
          ease: 'power4.out',
        });
      }

      // Typewriter container
      tl.from(
        '.gsap-role',
        { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' },
        '-=0.4',
      );

      // Tech tags stagger — use opacity+y only (no scale on flex span children)
      tl.from(
        '.gsap-tag',
        {
          opacity: 0,
          y: 18,
          stagger: 0.07,
          duration: 0.55,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
        },
        '-=0.3',
      );

      // Social icons pop in
      tl.from(
        '.gsap-social',
        {
          opacity: 0,
          scale: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: 'back.out(2)',
        },
        '-=0.2',
      );

      // Resume button slides up
      tl.from(
        '.gsap-resume',
        { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out' },
        '-=0.3',
      );

      // Corner decorations
      tl.from(
        '.gsap-corner',
        {
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.5',
      );

      // Scroll chevron
      tl.from('.gsap-chevron', { opacity: 0, y: -10, duration: 0.6 }, '-=0.3');
    },
    heroRef,
    [],
  );

  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const currentRole = roles[roleIndex];
    const typeSpeed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentRole.slice(0, displayText.length + 1));
        if (displayText.length === currentRole.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(currentRole.slice(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  // Matrix-style rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = '01{}[]<>/*#=+-;:.abcdefghijklmnopqrstuvwxyz';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);

    const dropObjects = Array.from({ length: columns }, () => ({
      y: Math.random() * -100,
      depth: Math.random(),
      speed: 0,
      char: '',
    }));

    dropObjects.forEach((drop) => {
      drop.speed = 1.5 + drop.depth * 3.5;
    });

    let lastFrameTime = 0;
    const frameInterval = 30;
    let animationId: number;

    const draw = (timestamp: number) => {
      animationId = requestAnimationFrame(draw);

      if (timestamp - lastFrameTime < frameInterval) return;
      lastFrameTime = timestamp;

      const isDark = document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDark
        ? 'rgba(13, 13, 13, 0.06)'
        : 'rgba(255, 255, 255, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      dropObjects.forEach((drop, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const currentFontSize = fontSize * (0.5 + drop.depth * 0.7);
        const opacity = 0.05 + drop.depth * 0.25;

        ctx.font = `${currentFontSize}px monospace`;
        ctx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${opacity * 1.5})`
          : `rgba(0, 0, 0, ${opacity * 1.5})`;
        ctx.fillText(char, i * fontSize, drop.y * fontSize);

        if (drop.y > 1) {
          const trailChar = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillStyle = isDark
            ? `rgba(255, 255, 255, ${opacity})`
            : `rgba(0, 0, 0, ${opacity})`;
          ctx.fillText(trailChar, i * fontSize, (drop.y - 1) * fontSize);
        }

        drop.y += drop.speed;

        if (drop.y * fontSize > canvas.height && Math.random() > 0.97) {
          drop.y = -5;
          drop.depth = Math.random();
          drop.speed = 1 + drop.depth * 2;
        }
      });
    };

    animationId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Keep itemVariants for any remaining Framer Motion elements
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      ref={heroRef}
      className="min-h-screen flex flex-col justify-center items-center relative px-4 sm:px-6 overflow-hidden pb-12"
    >
      <motion.canvas
        ref={canvasRef}
        style={{ y: y1 }}
        className="absolute inset-0 z-0 pointer-events-none opacity-60"
        aria-hidden="true"
      />

      {/* portfolio metadata removed */}

      {/* Top-right line numbers */}
      {/* line numbers removed */}

      {/* Main content */}
      <div className="text-center relative z-10 pt-20 md:pt-16 w-full max-w-2xl">
        {/* Name — GSAP animates each line */}
        <h1 className="heading-brutal text-center leading-[0.88] tracking-[-0.03em] overflow-hidden">
          <div
            className="gsap-name-line glitch-text"
            data-text="YUVA"
            style={{ fontSize: 'clamp(56px, 10vw, 140px)' }}
          >
            YUVA
          </div>
          <div
            className="gsap-name-line glitch-text mt-3 text-foreground/90"
            data-text="THILAGAN"
            style={{ fontSize: 'clamp(42px, 7vw, 96px)' }}
          >
            THILAGAN
          </div>
        </h1>

        {/* Typewriter role */}
        <div className="gsap-role mt-6 h-8 flex items-center justify-center">
          <span className="font-mono text-xs md:text-sm tracking-[0.2em] text-foreground/50">
            {'< '}
          </span>
          <span className="font-mono text-xs md:text-sm tracking-[0.15em] text-foreground/70 font-medium">
            {displayText}
          </span>
          <span
            className={`font-mono text-xs md:text-sm text-foreground/70 ${
              cursorVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            |
          </span>
          <span className="font-mono text-xs md:text-sm tracking-[0.2em] text-foreground/50">
            {' />'}
          </span>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 justify-center mt-6 md:mt-8 px-4 w-full max-w-xs sm:max-w-md mx-auto">
          {[
            'Python',
            'Machine Learning',
            'SQL',
            'Data Analytics',
            'React',
            'Power BI',
          ].map((tech) => (
            <span
              key={tech}
              className="gsap-tag inline-block px-2 py-1 sm:px-3 sm:py-1 font-mono text-[10px] sm:text-xs border-2 border-foreground/40 text-foreground/80 font-medium tracking-wider hover:bg-foreground hover:text-background transition-colors duration-300 cursor-default rounded-none"
              onMouseEnter={playHover}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Social links */}
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mt-8 px-4">
          {SOCIAL_LINKS.map((link) => {
            const Icon = ICON_MAP[link.id];
            if (!Icon) return null;
            return (
              <div key={link.id} className="gsap-social">
                <Magnetic strength={0.3}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    onClick={playClick}
                    className="group relative inline-flex items-center justify-center p-2 sm:p-3 border-2 border-foreground bg-background text-foreground transition-all duration-300 shadow-brutal hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-foreground hover:text-background rounded-none"
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                </Magnetic>
              </div>
            );
          })}
        </div>

        {/* Resume buttons — View (opens modal) + Download */}
        <div className="gsap-resume mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 px-4 w-full">
          {/* Primary: View Resume */}
          <Magnetic strength={0.1}>
            <button
              onClick={() => {
                playClick();
                setIsResumeOpen(true);
              }}
              aria-label="View resume PDF preview"
              className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 border-2 border-foreground bg-foreground text-background text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-brutal hover:bg-background hover:text-foreground hover:shadow-brutal-lg rounded-none"
            >
              <Eye className="w-4 h-4" />
              <span>View Resume</span>
            </button>
          </Magnetic>

          {/* Secondary: Direct Download */}
          <Magnetic strength={0.1}>
            <a
              href="/resume.pdf"
              download="Yuvathilagan_Resume.pdf"
              onClick={playClick}
              aria-label="Download resume as PDF"
              className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 sm:px-6 sm:py-4 border-2 border-foreground bg-background text-foreground text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-brutal hover:bg-foreground hover:text-background rounded-none"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </a>
          </Magnetic>
        </div>
      </div>

      {/* Resume PDF Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        resumeUrl="/resume.pdf"
        downloadName="Yuvathilagan_Resume.pdf"
      />

      {/* Bottom-right stats */}
      <div className="gsap-corner absolute bottom-10 right-6 md:right-10 z-10 hidden md:block">
        <div className="font-mono text-xs text-foreground text-right leading-relaxed font-medium">
          {/* portfolio stats removed */}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="gsap-chevron absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <ChevronDown className="w-5 h-5 text-foreground/60 animate-bounce" />
      </div>
    </section>
  );
};

export default HeroSection;
