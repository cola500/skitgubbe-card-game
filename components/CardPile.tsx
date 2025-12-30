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

// Helper function to map animation sources to origin keys
function getOriginKey(card: CardType): keyof typeof ANIMATION_ORIGINS {
  const source = card.animationSource || 'hand';
  return (source === 'tableUp' || source === 'tableDown') ? 'tableCards' : source;
}

export default function CardPile({ cards, label, faceDown = false, onClick }: CardPileProps) {
  const pileCount = cards.length;
  // Visa max 10 senaste korten för prestanda
  const visibleCards = cards.slice(-10);
  const [prevCards, setPrevCards] = useState<CardType[]>(visibleCards);

  useEffect(() => {
    setPrevCards(visibleCards);
  }, [cards.length]);

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

        {/* Show all cards with overlap */}
        {pileCount > 0 && (
          <div
            className={onClick ? 'flex cursor-pointer hover:opacity-90 transition-opacity' : 'flex'}
            onClick={onClick}
          >
            <AnimatePresence mode="popLayout">
              {visibleCards.map((card, index) => {
                const isNewCard = !prevCards.some(c => c.id === card.id);
                const originKey = getOriginKey(card);

                // Använd bara initial animation för kort från deck/tableCards, inte från hand
                const shouldAnimate = isNewCard && originKey !== 'hand';

                return (
                  <motion.div
                    key={card.id}
                    className={index > 0 ? '-ml-[54px] sm:-ml-[62px]' : ''}
                    style={{ zIndex: index }}
                    initial={shouldAnimate ? {
                      x: ANIMATION_ORIGINS[originKey].x,
                      y: ANIMATION_ORIGINS[originKey].y,
                      scale: 0.9,
                      opacity: 1
                    } : false}
                    animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 1 }}
                    transition={{ duration: ANIMATION_DURATION.normal, ease: EASING.custom }}
                  >
                    <Card card={card} faceDown={faceDown} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
