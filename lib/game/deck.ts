import type { Card } from '../types';
import { createDeck } from './cards';

/**
 * Shuffle a deck of cards using Fisher-Yates algorithm
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Deal initial cards for a new game
 * Each player gets:
 * - 3 cards in hand
 * - 3 face-down table cards
 * - 3 face-up table cards
 * Total: 18 cards dealt, 34 cards remaining in deck
 */
export function dealInitialCards(deck: Card[]) {
  const shuffled = shuffleDeck(deck);

  return {
    playerHand: shuffled.slice(0, 3),
    playerTableDown: shuffled.slice(3, 6),
    playerTableUp: shuffled.slice(6, 9),
    aiHand: shuffled.slice(9, 12),
    aiTableDown: shuffled.slice(12, 15),
    aiTableUp: shuffled.slice(15, 18),
    remainingDeck: shuffled.slice(18)
  };
}

/**
 * Draw cards from deck to fill hand to 3 cards
 * Returns { drawnCards, remainingDeck }
 */
export function drawCards(deck: Card[], currentHandSize: number): { drawnCards: Card[]; remainingDeck: Card[] } {
  const neededCards = Math.max(0, 3 - currentHandSize);
  const availableCards = Math.min(neededCards, deck.length);

  return {
    drawnCards: deck.slice(0, availableCards),
    remainingDeck: deck.slice(availableCards)
  };
}

/**
 * Create and shuffle a new deck
 */
export function createShuffledDeck(): Card[] {
  return shuffleDeck(createDeck());
}
