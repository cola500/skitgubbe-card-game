'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Card from './Card';
import type { Card as CardType } from '@/lib/types';
import {
  ANIMATION_DURATION,
  EASING,
  ANIMATION_ORIGINS,
  EXIT_ANIMATIONS
} from '@/lib/animations';

interface PlayerHandProps {
  cards: CardType[];
  selectedCards: CardType[];
  onSelect: (card: CardType) => void;
  onDeselect: (card: CardType) => void;
  onPlaySingle?: (card: CardType) => void; // För direkt-spel av unika kort
  disabled?: boolean;
  faceDown?: boolean;
  label?: string;
}

export default function PlayerHand({
  cards,
  selectedCards,
  onSelect,
  onDeselect,
  onPlaySingle,
  disabled = false,
  faceDown = false,
  label
}: PlayerHandProps) {
  // Track previous cards to detect new cards (drawn from deck)
  const [prevCards, setPrevCards] = useState(cards);

  useEffect(() => {
    setPrevCards(cards);
  }, [cards]);

  const isNewCard = (card: CardType) => {
    return !prevCards.some(c => c.id === card.id);
  };

  const handleCardClick = (card: CardType) => {
    if (disabled || faceDown) return;

    // Räkna hur många kort av samma valör som finns
    const cardsOfSameRank = cards.filter(c => c.rank === card.rank);

    // Om bara ETT kort av denna valör → spela direkt
    if (cardsOfSameRank.length === 1) {
      if (onPlaySingle) {
        onPlaySingle(card); // Spela direkt
      } else {
        onSelect(card); // Fallback
      }
      return;
    }

    // Om FLERA kort av samma valör → select/deselect workflow
    const isSelected = selectedCards.some(c => c.id === card.id);

    if (isSelected) {
      // Deselect if already selected
      onDeselect(card);
    } else {
      // Can only select cards of the same rank as already selected cards
      if (selectedCards.length > 0 && selectedCards[0].rank !== card.rank) {
        return; // Ignore click if different rank
      }
      onSelect(card);
    }
  };

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center">
        {label && <div className="text-white/60 text-sm mb-2">{label}</div>}
        <div className="text-white/40 text-sm italic">Inga kort</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {label && <div className="text-white/80 text-sm font-semibold mb-2">{label}</div>}
      <div className="flex gap-2 justify-center flex-wrap">
        <AnimatePresence mode="popLayout">
          {cards.map(card => (
            <motion.div
              key={card.id}
              initial={isNewCard(card) && !faceDown ? {
                x: ANIMATION_ORIGINS.deck.x,
                y: ANIMATION_ORIGINS.deck.y,
                scale: 0.5,
                opacity: 0
              } : false}
              animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              exit={EXIT_ANIMATIONS.toPile}
              transition={{ duration: ANIMATION_DURATION.normal, ease: EASING.smooth }}
            >
              <Card
                card={card}
                faceDown={faceDown}
                selected={!faceDown && selectedCards.some(c => c.id === card.id)}
                onClick={() => handleCardClick(card)}
                disabled={disabled}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
