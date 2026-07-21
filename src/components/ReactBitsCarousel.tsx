import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import React, { JSX } from 'react';
import { Award, ShieldCheck } from 'lucide-react';

export interface CarouselItemData {
  title: string;
  issuer: string;
  date: string;
  description: string;
  image: string;
  category: 'Achievement' | 'Certification';
  tag: string;
  id: number;
  skills?: string[];
}

export interface CarouselProps {
  items: CarouselItemData[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
}

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 20;
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 300, damping: 30 };

interface CarouselItemProps {
  item: CarouselItemData;
  index: number;
  itemWidth: number;
  round: boolean;
  trackItemOffset: number;
  x: any;
  transition: any;
}

function CarouselItem({
  item,
  index,
  itemWidth,
  round,
  trackItemOffset,
  x,
  transition,
}: CarouselItemProps) {
  const range = [
    -(index + 1) * trackItemOffset,
    -index * trackItemOffset,
    -(index - 1) * trackItemOffset,
  ];
  const outputRange = [90, 0, -90];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });

  // Icon mapping based on category
  const CategoryIcon = item.category === 'Certification' ? ShieldCheck : Award;

  return (
    <motion.div
      key={`${item?.id ?? index}-${index}`}
      className={`relative shrink-0 flex flex-col ${
        round
          ? 'items-center justify-center text-center bg-background border border-primary/20 rounded-full'
          : 'bg-[#050508]/85 backdrop-blur-md border-[1.5px] md:border-[2px] border-primary/30 dark:border-primary/20 hover:border-primary/80 rounded-[16px] shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(0,245,212,0.18)] hover:-translate-y-[6px] transition-all duration-300 ease-out cursor-grab active:cursor-grabbing'
      } overflow-hidden select-none`}
      style={{
        width: itemWidth,
        height: round ? itemWidth : '100%',
        rotateY: rotateY,
        ...(round && { borderRadius: '50%' }),
      }}
      transition={transition}
    >
      {!round ? (
        <div className="grid grid-rows-[auto_auto_auto_auto_1fr_auto_auto] gap-[clamp(12px,2vw,20px)] p-[clamp(20px,4.5vw,40px)] h-full w-full">
          {/* Row 1: Top Row (Badge, Category, Status) */}
          <div className="flex items-center justify-between w-full">
            {/* Tag Badge */}
            <span className="inline-flex items-center justify-center font-mono text-[clamp(10px,1.3vw,12px)] font-bold border border-primary/30 bg-primary/10 text-primary px-3 py-1 rounded-full h-[clamp(24px,3vw,30px)] uppercase tracking-wider select-none">
              {item.tag}
            </span>
            {/* Category */}
            <span className="font-mono text-[clamp(10px,1.3vw,12px)] font-black text-foreground/75 tracking-widest uppercase">
              {item.category}
            </span>
            {/* Date Badge (Status) */}
            <span className="inline-flex items-center justify-center font-mono text-[clamp(10px,1.3vw,12px)] font-bold border border-foreground/20 bg-foreground/5 text-foreground/70 px-3 py-1 rounded-full h-[clamp(24px,3vw,30px)] uppercase tracking-wider select-none">
              {item.date}
            </span>
          </div>

          {/* Row 2: Large Title */}
          <div>
            <h3 
              className="font-black leading-tight tracking-tight text-foreground uppercase select-text" 
              style={{ fontSize: 'clamp(24px, 3.2vw, 42px)' }}
            >
              {item.title}
            </h3>
          </div>

          {/* Row 3: Divider */}
          <div className="w-full border-t border-primary/25" />

          {/* Row 4: Metadata (Issuer) */}
          <div>
            <p 
              className="font-mono text-foreground/55 tracking-wider uppercase select-text" 
              style={{ fontSize: 'clamp(12px, 1.5vw, 14px)' }}
            >
              {item.issuer}
            </p>
          </div>

          {/* Row 5: Description */}
          <div className="overflow-hidden flex items-start">
            <p 
              className="font-normal text-foreground/80 leading-[1.8] max-w-[90%] select-text" 
              style={{ fontSize: 'clamp(14px, 1.6vw, 17px)' }}
            >
              {item.description}
            </p>
          </div>

          {/* Row 6: Skills */}
          {item.skills && item.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center select-none pt-2 border-t border-foreground/5">
              <span className="font-mono text-[clamp(10px,1.4vw,11px)] text-foreground/40 uppercase tracking-widest mr-1">
                Skills:
              </span>
              {item.skills.map((skill) => (
                <span 
                  key={skill} 
                  className="font-mono text-[clamp(9px,1.2vw,10.5px)] font-bold border border-primary/10 bg-primary/5 text-primary/80 px-2 py-0.5 rounded-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Row 7: Footer */}
          <div className="flex justify-between items-center w-full border-t border-foreground/5 pt-3 mt-auto select-none">
            <span className="font-mono text-[clamp(10px,1.4vw,12px)] text-foreground/30">
              // 0{item.id + 1}
            </span>
            <CategoryIcon className="w-4 h-4 text-primary opacity-40 shrink-0" />
          </div>
        </div>
      ) : (
        /* Support round layout for fallback/consistency if round=true is passed */
        <div className="p-5 flex-1 flex flex-col justify-between items-center text-center w-full">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-primary">
            <CategoryIcon className="h-5 w-5 text-primary shrink-0" />
          </div>
          <div>
            <h3 className="font-black text-sm leading-tight text-foreground line-clamp-2 uppercase">
              {item.title}
            </h3>
            <p className="font-mono text-[10px] text-foreground/55 mt-1">
              {item.issuer}
            </p>
          </div>
          <p className="text-xs text-foreground/80 line-clamp-3 leading-relaxed mt-2 border-t border-primary/10 pt-2">
            {item.description}
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default function Carousel({
  items,
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false,
}: CarouselProps): JSX.Element {
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;
  const itemsForRender = useMemo(() => {
    if (!loop) return items;
    if (items.length === 0) return [];
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);

  const [position, setPosition] = useState<number>(loop ? 1 : 0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return undefined;
    if (pauseOnHover && isHovered) return undefined;

    const timer = setInterval(() => {
      setPosition((prev) => Math.min(prev + 1, itemsForRender.length - 1));
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length]);

  useEffect(() => {
    const startingPosition = loop ? 1 : 0;
    setPosition(startingPosition);
    x.set(-startingPosition * trackItemOffset);
  }, [items, loop, trackItemOffset, x]);

  useEffect(() => {
    if (!loop && position > itemsForRender.length - 1) {
      setPosition(Math.max(0, itemsForRender.length - 1));
    }
  }, [itemsForRender.length, loop, position]);

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationStart = () => {
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false);
      return;
    }
    const lastCloneIndex = itemsForRender.length - 1;

    if (position === lastCloneIndex) {
      setIsJumping(true);
      const target = 1;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    if (position === 0) {
      setIsJumping(true);
      const target = items.length;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    setIsAnimating(false);
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ): void => {
    const { offset, velocity } = info;
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0;

    if (direction === 0) return;

    setPosition((prev) => {
      const next = prev + direction;
      const max = itemsForRender.length - 1;
      return Math.max(0, Math.min(next, max));
    });
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
          right: 0,
        },
      };

  const activeIndex =
    items.length === 0
      ? 0
      : loop
        ? (position - 1 + items.length) % items.length
        : Math.min(position, items.length - 1);

  return (
    <div
      ref={containerRef}
      className="relative overflow-visible mx-auto w-full flex flex-col items-center gap-3 select-none"
      style={{
        maxWidth: `${baseWidth + 32}px`,
      }}
    >
      <div 
        className="overflow-hidden py-3 px-4 w-full flex justify-center"
        style={{
          width: '100%',
        }}
      >
        <motion.div
          className="flex h-full"
          drag={isAnimating ? false : 'x'}
          {...dragProps}
          style={{
            width: itemWidth,
            gap: `${GAP}px`,
            perspective: 1000,
            perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
            x,
          }}
          onDragEnd={handleDragEnd}
          animate={{ x: -(position * trackItemOffset) }}
          transition={effectiveTransition}
          onAnimationStart={handleAnimationStart}
          onAnimationComplete={handleAnimationComplete}
        >
          {itemsForRender.map((item, index) => (
            <CarouselItem
              key={`${item?.id ?? index}-${index}`}
              item={item}
              index={index}
              itemWidth={itemWidth}
              round={round}
              trackItemOffset={trackItemOffset}
              x={x}
              transition={effectiveTransition}
            />
          ))}
        </motion.div>
      </div>

      {/* Navigation Indicators outside card */}
      {items.length > 1 && (
        <div className="flex w-full justify-center select-none mt-2">
          <div className="flex gap-[12px] px-4 py-2 bg-[#050508]/80 border border-primary/20 rounded-full items-center">
            {items.map((_, index) => (
              <motion.button
                type="button"
                key={index}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={activeIndex === index}
                className={`rounded-full cursor-pointer border-0 p-0 appearance-none transition-all duration-300 w-[10px] h-[10px] md:w-[14px] md:h-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  activeIndex === index
                    ? 'bg-primary shadow-[0_0_8px_rgba(0,245,212,0.6)]'
                    : 'bg-primary/20 hover:bg-primary/50'
                }`}
                whileHover={{ scale: 1.25 }}
                onClick={() => setPosition(loop ? index + 1 : index)}
                transition={{ duration: 0.15 }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
