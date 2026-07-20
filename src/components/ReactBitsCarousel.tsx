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
const GAP = 16;
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
          ? 'items-center justify-center text-center bg-background border-2 border-primary'
          : 'items-start justify-between bg-[#0a0a0c] border-2 border-primary rounded-[12px] shadow-[4px_4px_0px_0px_rgba(0,180,216,0.3)] dark:shadow-[4px_4px_0px_0px_rgba(0,245,212,0.15)]'
      } overflow-hidden cursor-grab active:cursor-grabbing`}
      style={{
        width: itemWidth,
        height: round ? itemWidth : '100%',
        rotateY: rotateY,
        ...(round && { borderRadius: '50%' }),
      }}
      transition={transition}
    >
      {!round && (
        <div className="w-full h-44 shrink-0 overflow-hidden relative border-b-2 border-primary">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover object-top select-none pointer-events-none"
          />
          {/* Subtle Cyberpunk Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-black/40 to-transparent" />

          {/* Top Info Bar on Card Image */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold bg-[#0a0a0c] text-foreground border border-primary px-2 py-0.5 leading-none">
              {String(item.id + 1).padStart(2, '0')}
            </span>
            <span className="font-mono text-[9px] font-black bg-primary text-primary-foreground border border-primary px-2 py-0.5 leading-none uppercase">
              {item.category}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <span className="font-mono text-[9px] tracking-widest uppercase bg-[#0a0a0c] text-foreground border border-primary/45 px-2 py-0.5 leading-none">
              {item.date}
            </span>
          </div>
        </div>
      )}

      {/* Card Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between w-full">
        <div>
          {/* Icon & tag header */}
          {!round && (
            <div className="flex justify-between items-center mb-3">
              <span className="font-mono text-[9px] border border-primary/20 bg-background/50 px-2 py-0.5 text-foreground/60">
                {item.tag}
              </span>
              <CategoryIcon className="w-4 h-4 text-primary shrink-0" />
            </div>
          )}

          {round && (
            <div className="flex justify-center mb-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-primary">
                <CategoryIcon className="h-5 w-5 text-primary shrink-0" />
              </span>
            </div>
          )}

          {/* Title & Issuer */}
          <div>
            <h3 className="font-black text-sm md:text-base leading-tight tracking-tight text-foreground line-clamp-2 uppercase">
              {item.title}
            </h3>
            <p className="font-mono text-[10px] text-foreground/55 mt-1">
              {item.issuer}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-foreground/80 line-clamp-3 leading-relaxed mt-4 border-t border-primary/10 pt-3">
          {item.description}
        </p>
      </div>
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
      className={`relative overflow-hidden p-4 mx-auto ${
        round
          ? 'rounded-full border border-primary'
          : 'rounded-[24px] border border-primary/20 bg-background/30'
      }`}
      style={{
        width: `${baseWidth}px`,
        ...(round && { height: `${baseWidth}px` }),
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
      
      {/* Navigation Indicators */}
      {items.length > 1 && (
        <div
          className={`flex w-full justify-center ${
            round ? 'absolute z-20 bottom-12 left-1/2 -translate-x-1/2' : 'mt-4'
          }`}
        >
          <div className="flex gap-2.5 px-4 py-1.5 bg-[#0a0a0c]/60 border border-primary/10 rounded-full select-none">
            {items.map((_, index) => (
              <motion.button
                type="button"
                key={index}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={activeIndex === index}
                className={`h-2 w-2 rounded-full cursor-pointer border-0 p-0 appearance-none transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  activeIndex === index
                    ? 'bg-primary'
                    : 'bg-primary/20 hover:bg-primary/45'
                }`}
                animate={{
                  scale: activeIndex === index ? 1.25 : 1,
                }}
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
