// Animation configurations for Skitgubbe card game

export const ANIMATION_DURATION = {
  fast: 0.4,
  normal: 0.7,
  slow: 1.0
};

export const EASING = {
  smooth: "easeInOut" as const,
  custom: [0.4, 0.0, 0.2, 1.0] as const,
  elastic: [0.68, -0.55, 0.265, 1.55] as const,
  bounce: [0.68, -0.35, 0.265, 1.35] as const
};

// Animation origins (relativt till card position)
export const ANIMATION_ORIGINS = {
  deck: { x: -250, y: -200 },      // Från kortlek (vänster-upp)
  pile: { x: 150, y: -200 },       // Från högen (höger-upp)
  hand: { x: 0, y: 150 },          // Från hand (nedifrån-upp)
  tableCards: { x: 0, y: 100 }     // Från bordskort (nedåt)
} as const;

// Exit animations (till olika destinationer)
export const EXIT_ANIMATIONS = {
  toPile: { x: 150, y: -200, scale: 0.95, opacity: 1 },
  toDeck: { x: -250, y: -200, scale: 0.95, opacity: 1 },
  toHand: { x: 0, y: 150, scale: 0.95, opacity: 1 },
  toTableCards: { x: 0, y: 100, scale: 0.95, opacity: 1 },
  generic: { scale: 0.95, opacity: 1 }
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
