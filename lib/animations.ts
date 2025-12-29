// Animation configurations for Skitgubbe card game

export const ANIMATION_DURATION = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.8
};

export const EASING = {
  smooth: "easeOut" as const,
  elastic: [0.68, -0.55, 0.265, 1.55] as const,
  bounce: [0.68, -0.35, 0.265, 1.35] as const
};

// Animation origins (relativt till card position)
export const ANIMATION_ORIGINS = {
  deck: { x: -250, y: -200 },      // Från kortlek (vänster-upp)
  pile: { x: 150, y: -200 },       // Från högen (höger-upp)
  hand: { x: 0, y: -150 },         // Från hand (rakt uppåt)
  tableCards: { x: 0, y: 100 }     // Från bordskort (nedåt)
} as const;

// Exit animations (till olika destinationer)
export const EXIT_ANIMATIONS = {
  toPile: { x: 150, y: -200, scale: 0.8, opacity: 0 },
  toDeck: { x: -250, y: -200, scale: 0.8, opacity: 0 },
  toHand: { x: 0, y: -150, scale: 0.8, opacity: 0 },
  toTableCards: { x: 0, y: 100, scale: 0.8, opacity: 0 },
  generic: { scale: 0.8, opacity: 0 }
} as const;

export const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8 }
};

export const burnVariants = {
  normal: { scale: 1, rotate: 0, opacity: 1 },
  burning: {
    scale: [1, 1.2, 0],
    rotate: [0, 10, -10, 0],
    opacity: [1, 1, 0],
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: EASING.smooth
    }
  }
};

export const deckPulseVariants = {
  idle: { scale: 1 },
  active: {
    scale: [1, 1.05, 1],
    transition: { duration: ANIMATION_DURATION.fast }
  }
};
