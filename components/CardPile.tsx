'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Card from './Card';
import type { Card as CardType } from '@/lib/types';
import { ANIMATION_DURATION, EASING, ANIMATION_ORIGINS } from '@/lib/animations';

interface CardPileProps {
  cards: CardType[];
  label: string;
  faceDown?: boolean;
  onClick?: () => void;
}

export default function CardPile({ cards, label, faceDown = false, onClick }: CardPileProps) {
  const topCard = cards.length > 0 ? cards[cards.length - 1] : undefined;
  const pileCount = cards.length;

  // Track previous top card för animation detection
  const [prevTopCard, setPrevTopCard] = useState<CardType | undefined>(topCard);

  useEffect(() => {
    if (topCard?.id !== prevTopCard?.id) {
      setPrevTopCard(topCard);
    }
  }, [topCard, prevTopCard]);

  // Detektera om det är ett nytt kort (från hand)
  const isNewTopCard = topCard && (!prevTopCard || topCard.id !== prevTopCard.id);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-white/80 text-sm font-semibold">{label}</div>

      <div className="relative">
        {/* Empty pile placeholder */}
        {pileCount === 0 && (
          <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-lg border-2 border-dashed border-white/30 flex items-center justify-center">
            <div className="text-white/30 text-xs text-center">Tom</div>
          </div>
        )}

        {/* Show top card with stack effect */}
        {pileCount > 0 && (
          <>
            {/* Stack effect (background cards) */}
            {pileCount > 1 && (
              <>
                <div className="absolute top-0.5 left-0.5 w-16 h-24 sm:w-20 sm:h-28 bg-white/20 rounded-lg -z-10" />
                {pileCount > 2 && (
                  <div className="absolute top-1 left-1 w-16 h-24 sm:w-20 sm:h-28 bg-white/10 rounded-lg -z-20" />
                )}
              </>
            )}

            {/* Top card with animation - clickable if onClick provided */}
            <AnimatePresence mode="wait">
              <motion.div
                key={topCard?.id || 'empty'}
                initial={isNewTopCard ? {
                  x: ANIMATION_ORIGINS.hand.x,
                  y: -ANIMATION_ORIGINS.hand.y, // Inverterad (från nedanför)
                  scale: 0.5,
                  opacity: 0
                } : false}
                animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: ANIMATION_DURATION.normal, ease: EASING.smooth }}
                onClick={onClick}
                className={onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}
              >
                <Card card={topCard} faceDown={faceDown} />
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
