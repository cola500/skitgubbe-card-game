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

interface TableCardsProps {
  cardsDown: CardType[];
  cardsUp: CardType[];
  selectedCards?: CardType[]; // För att highlighta selectade kort i setup
  isPlayerTable?: boolean;
  onPlayCard?: (card: CardType) => void;
  disabled?: boolean;
  currentSource?: 'hand' | 'tableUp' | 'tableDown';
}

export default function TableCards({
  cardsDown,
  cardsUp,
  selectedCards,
  isPlayerTable = true,
  onPlayCard,
  disabled = true,
  currentSource
}: TableCardsProps) {
  // Track previous cards för animation detection
  const [prevCardsDown, setPrevCardsDown] = useState(cardsDown);
  const [prevCardsUp, setPrevCardsUp] = useState(cardsUp);

  useEffect(() => {
    setPrevCardsDown(cardsDown);
  }, [cardsDown]);

  useEffect(() => {
    setPrevCardsUp(cardsUp);
  }, [cardsUp]);

  // Detektera nya kort (från deck vid setup)
  const isNewDownCard = (card: CardType) => {
    return !prevCardsDown.some(c => c.id === card.id);
  };

  const isNewUpCard = (card: CardType) => {
    return !prevCardsUp.some(c => c.id === card.id);
  };

  // Bestäm om kort ska vara klickbara
  const tableUpClickable = currentSource === 'tableUp' && !disabled;
  const tableDownClickable = currentSource === 'tableDown' && !disabled;

  if (cardsDown.length === 0 && cardsUp.length === 0) {
    return null;
  }

  return (
    <div className="relative flex flex-col items-center mb-4">
      {/* Face down cards */}
      {cardsDown.length > 0 && (
        <div className="flex gap-1 justify-center">
          <AnimatePresence mode="popLayout">
            {cardsDown.map((card, index) => (
              <motion.div
                key={card.id || `down-${index}`}
                initial={isNewDownCard(card) ? {
                  x: ANIMATION_ORIGINS.deck.x,
                  y: ANIMATION_ORIGINS.deck.y,
                  scale: 0.5,
                  opacity: 0
                } : false}
                animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                exit={EXIT_ANIMATIONS.toPile}
                transition={{ duration: ANIMATION_DURATION.normal, ease: EASING.custom }}
              >
                <Card
                  card={card}
                  faceDown
                  small
                  onClick={tableDownClickable ? () => onPlayCard?.(card) : undefined}
                  disabled={!tableDownClickable}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Face up cards */}
      {cardsUp.length > 0 && (
        <div className="flex gap-1 justify-center -mt-12">
          <AnimatePresence mode="popLayout">
            {cardsUp.map((card, index) => (
              <motion.div
                key={card.id || `up-${index}`}
                initial={isNewUpCard(card) ? {
                  x: ANIMATION_ORIGINS.deck.x,
                  y: ANIMATION_ORIGINS.deck.y,
                  scale: 0.5,
                  opacity: 0
                } : false}
                animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                exit={EXIT_ANIMATIONS.toPile}
                transition={{ duration: ANIMATION_DURATION.normal, ease: EASING.custom }}
              >
                <Card
                  card={card}
                  small
                  selected={selectedCards?.some(c => c.id === card.id)}
                  onClick={tableUpClickable ? () => onPlayCard?.(card) : undefined}
                  disabled={!tableUpClickable}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
