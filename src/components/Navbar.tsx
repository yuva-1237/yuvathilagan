import { useState, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { playClick, playHover } from '@/hooks/useSoundEffects';
import { useLenis } from 'lenis/react';
import SoundToggle from './SoundToggle';
import ColorPaletteCustomizer from './ColorPaletteCustomizer';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useGSAPContext } from '@/hooks/useGSAPContext';

const links = [
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Experience', href: '#experience' },
  // { label: 'Achievements', href: '#achievements' },
  { label: 'Work', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  // { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const navRef = useRef<HTMLElement>(null);

  // GSAP: hide navbar on scroll down, reveal on scroll up
  useGSAPContext(
    () => {
      let lastScrollY = window.scrollY;
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      const hideThreshold = isMobile ? 50 : 100;

      ScrollTrigger.create({
        start: 'top -60px',
        end: 'max',
        onUpdate: () => {
          const currentY = window.scrollY;
          const isScrollingDown =
            currentY > lastScrollY && currentY > hideThreshold;
          lastScrollY = currentY;

          if (!navRef.current) return;

          if (isScrollingDown) {
            gsap.to(navRef.current, {
              yPercent: -110,
              duration: isMobile ? 0.25 : 0.4,
              ease: 'power2.inOut',
              overwrite: true,
            });
          } else {
            gsap.to(navRef.current, {
              yPercent: 0,
              duration: isMobile ? 0.3 : 0.5,
              ease: 'power3.out',
              overwrite: true,
            });
          }
        },
      });

      // Initial entrance animation
      gsap.from(navRef.current, {
        y: -60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      });
    },
    navRef,
    [],
  );

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      // Close mobile menu first
      setOpen(false);
      lenis?.scrollTo(href, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 py-4 sm:py-6 bg-background/80 backdrop-blur-sm"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between lg:justify-center relative">
        {/* ── Desktop Nav links (centered) ── */}
        <div className="hidden lg:flex items-center justify-center gap-0">
          {links.map((link, i) => (
            <span key={link.href} className="flex items-center">
              <a
                href={link.href}
                className="nav-link px-4 py-1 active:opacity-50 transition-opacity"
                onClick={(e) => {
                  playClick();
                  handleScroll(e, link.href);
                }}
                onMouseEnter={playHover}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={
                  link.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
              >
                {link.label}
              </a>
              {i < links.length - 1 && (
                <span className="text-foreground/60 font-bold mx-1.5 text-xs select-none">
                  |
                </span>
              )}
            </span>
          ))}
        </div>

        {/* ── Desktop: Palette + Sound (absolute right) ── */}
        <div className="hidden lg:flex items-center gap-2 absolute right-6">
          <ColorPaletteCustomizer />
          <SoundToggle />
        </div>

        {/* ── Mobile header row ── */}
        <div className="lg:hidden flex justify-between w-full items-center">
          {/* Hamburger / Close */}
          <button
            onClick={() => {
              playClick();
              setOpen(!open);
            }}
            onMouseEnter={playHover}
            className="nav-link active:scale-95 transition-transform touch-manipulation py-2"
            aria-expanded={open}
            aria-controls="mobile-nav-menu"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Mobile: Palette + Sound */}
          <div className="flex items-center gap-2">
            <div className="scale-90 origin-right">
              <ColorPaletteCustomizer />
            </div>
            <div className="scale-90 origin-right">
              <SoundToggle />
            </div>
          </div>
        </div>

        {/* ── Mobile expanded menu ── */}
        {open && (
          <div
            id="mobile-nav-menu"
            role="navigation"
            className="lg:hidden flex flex-col items-center justify-center w-full gap-5 mt-10 animate-in fade-in slide-in-from-top-4 duration-300"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link text-sm tracking-[0.3em] active:scale-95 transition-transform touch-manipulation py-2"
                onClick={(e) => {
                  playClick();
                  setOpen(false);
                  handleScroll(e, link.href);
                }}
                onMouseEnter={playHover}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={
                  link.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
