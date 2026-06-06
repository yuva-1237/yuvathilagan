import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [tabindex]';

const CustomCursor = () => {
  const [isHover, setIsHover] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number>(0);

  // Raw position for the dot (instant)
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Spring-lagged position for the ring
  const ringX = useSpring(dotX, { stiffness: 260, damping: 30, mass: 0.5 });
  const ringY = useSpring(dotY, { stiffness: 260, damping: 30, mass: 0.5 });

  const onMove = useCallback((e: MouseEvent) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    });
    setIsVisible(true);
  }, [dotX, dotY]);

  useEffect(() => {
    const onOver = (e: MouseEvent) => {
      setIsHover(!!(e.target as Element)?.closest(INTERACTIVE));
    };
    const onDown = () => setIsClick(true);
    const onUp   = () => setIsClick(false);
    const onLeave = () => setIsVisible(false);
    const onEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(rafRef.current);
    };
  }, [onMove]);

  const dotSize    = isClick ? 3  : isHover ? 0  : 5;
  const ringSize   = isClick ? 28 : isHover ? 48 : 34;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none border-2 border-foreground"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%', zIndex: 9998 }}
        animate={{
          width:   ringSize,
          height:  ringSize,
          opacity: isVisible ? (isHover ? 1 : 0.7) : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none bg-foreground"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%', zIndex: 9999 }}
        animate={{
          width:   dotSize,
          height:  dotSize,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
      />
    </>
  );
};

export default CustomCursor;
