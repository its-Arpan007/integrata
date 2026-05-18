"use client";

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useImperativeHandle
} from 'react';
import gsap from 'gsap';

export interface CardSwapHandle {
  swipeLeft: () => void;
  swipeRight: () => void;
  next: () => void;
  prev: () => void;
}

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  onCardClick?: (idx: number) => void;
  onSwipeComplete?: (direction: 'left' | 'right') => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  children: ReactNode;
  className?: string;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-1/2 left-1/2 rounded-3xl border border-glass-border bg-bg-secondary/70 backdrop-blur-xl shadow-2xl [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] overflow-hidden ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-50"></div>
    {rest.children}
  </div>
));
Card.displayName = 'Card';

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true,
    opacity: 1,
    rotation: 0
  });

const CardSwap = forwardRef<CardSwapHandle, CardSwapProps>(({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  onCardClick,
  onSwipeComplete,
  skewAmount = 6,
  easing = 'elastic',
  className,
  children
}, ref) => {
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 1,
          durMove: 1,
          durReturn: 1,
          promoteOverlap: 0.9,
          returnDelay: 0.05
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.5,
          durMove: 0.5,
          durReturn: 0.5,
          promoteOverlap: 0.45,
          returnDelay: 0.2
        };

  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const refs = useMemo<CardRef[]>(() => childArr.map(() => React.createRef<HTMLDivElement>()), [childArr.length]);

  const order = useRef<number[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const isAnimating = useRef(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    order.current = Array.from({ length: childArr.length }, (_, i) => i);
  }, [childArr.length]);

  useEffect(() => {
    if (refs.length === 0) return;
    const total = refs.length;
    
    const validRefs = refs.filter(r => r.current);
    if (validRefs.length !== total) return;

    if (tlRef.current) tlRef.current.kill();
    isAnimating.current = false;

    refs.forEach((r, i) => placeNow(r.current!, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));
  }, [cardDistance, verticalDistance, skewAmount, refs]);

  const swipeCard = (direction: 'left' | 'right') => {
    if (isAnimating.current || order.current.length === 0) return;
    isAnimating.current = true;

    const [front, ...rest] = order.current;
    const elFront = refs[front]?.current;
    if (!elFront) {
      isAnimating.current = false;
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        onSwipeComplete?.(direction);
      }
    });
    tlRef.current = tl;

    const xOffset = direction === 'left' ? -800 : 800;
    const rotation = direction === 'left' ? -15 : 15;

    tl.to(elFront, {
      x: `+=${xOffset}`,
      y: '+=100',
      rotation: rotation,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in'
    });

    rest.forEach((idx, i) => {
      const el = refs[idx]?.current;
      if (!el) return;
      const slot = makeSlot(i, cardDistance, verticalDistance, refs.length - 1);
      tl.to(
        el,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          zIndex: slot.zIndex,
          duration: 0.4,
          ease: 'power2.out'
        },
        "-=0.2"
      );
    });
  };

  const next = () => {
    if (isAnimating.current || order.current.length < 2) return;
    isAnimating.current = true;

    const [front, ...rest] = order.current;
    const elFront = refs[front]?.current;
    if (!elFront) {
      isAnimating.current = false;
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        order.current = [...rest, front];
        isAnimating.current = false;
      }
    });
    tlRef.current = tl;

    tl.to(elFront, {
      y: '+=300',
      duration: config.durDrop,
      ease: config.ease
    });

    tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
    rest.forEach((idx, i) => {
      const el = refs[idx]?.current;
      if (!el) return;
      const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
      tl.set(el, { zIndex: slot.zIndex }, 'promote');
      tl.to(
        el,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          duration: config.durMove,
          ease: config.ease
        },
        `promote+=${i * 0.15}`
      );
    });

    const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
    tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
    tl.call(() => gsap.set(elFront, { zIndex: backSlot.zIndex }), undefined, 'return');
    tl.to(
      elFront,
      {
        x: backSlot.x,
        y: backSlot.y,
        z: backSlot.z,
        duration: config.durReturn,
        ease: config.ease
      },
      'return'
    );
  };

  const prev = () => {
    if (isAnimating.current || order.current.length < 2) return;
    isAnimating.current = true;

    const back = order.current[order.current.length - 1];
    const rest = order.current.slice(0, order.current.length - 1);
    const elBack = refs[back]?.current;
    if (!elBack) {
      isAnimating.current = false;
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        order.current = [back, ...rest];
        isAnimating.current = false;
      }
    });
    tlRef.current = tl;

    const frontSlot = makeSlot(0, cardDistance, verticalDistance, refs.length);
    
    tl.to(elBack, {
      y: '+=300',
      duration: config.durDrop,
      ease: config.ease
    });

    tl.addLabel('demote', `-=${config.durDrop * config.promoteOverlap}`);
    tl.call(() => gsap.set(elBack, { zIndex: frontSlot.zIndex }), undefined, 'demote');
    
    rest.forEach((idx, i) => {
      const el = refs[idx]?.current;
      if (!el) return;
      const slot = makeSlot(i + 1, cardDistance, verticalDistance, refs.length);
      tl.set(el, { zIndex: slot.zIndex }, 'demote');
      tl.to(
        el,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          duration: config.durMove,
          ease: config.ease
        },
        `demote+=${i * 0.15}`
      );
    });

    tl.addLabel('return', `demote+=${config.durMove * config.returnDelay}`);
    tl.to(
      elBack,
      {
        x: frontSlot.x,
        y: frontSlot.y,
        z: frontSlot.z,
        duration: config.durReturn,
        ease: config.ease
      },
      'return'
    );
  };

  useImperativeHandle(ref, () => ({
    swipeLeft: () => swipeCard('left'),
    swipeRight: () => swipeCard('right'),
    next,
    prev
  }));

  useEffect(() => {
    const node = container.current;
    if (!node) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isAnimating.current) return;
      
      if (e.deltaY > 0) {
        next();
      } else if (e.deltaY < 0) {
        prev();
      }
    };

    node.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      node.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: e => {
            child.props.onClick?.(e as React.MouseEvent<HTMLDivElement>);
            onCardClick?.(i);
          }
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child
  );

  return (
    <div
      ref={container}
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 perspective-[1200px] overflow-visible max-[768px]:scale-90 ${className || ''}`}
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
});
CardSwap.displayName = 'CardSwap';

export default CardSwap;
