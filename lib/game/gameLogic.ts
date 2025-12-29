import type { Card } from '../types';

/**
 * Check if a card can be played on top of the current pile
 *
 * @param card - Card to play
 * @param topCard - Current top card of discard pile (null if pile is empty)
 * @param reverseMode - True if last card played was a 5 (≤5 rule active)
 * @returns true if card can be played
 */
export function canPlayCard(card: Card, topCard: Card | null, reverseMode: boolean): boolean {
  // No card on pile → can play anything
  if (!topCard) return true;

  // Special cards 2, 5, and 10 can always be played
  if (['2', '5', '10'].includes(card.rank)) return true;

  // Reverse mode (5 was played) → must be ≤ 5
  if (reverseMode) {
    return card.value <= 5;
  }

  // Normal mode → must be ≥ top card
  return card.value >= topCard.value;
}

/**
 * Check if multiple cards can be played together
 * (They must all have the same rank)
 */
export function canPlayMultiple(cards: Card[]): boolean {
  if (cards.length === 0) return false;
  if (cards.length === 1) return true;

  const firstRank = cards[0].rank;
  return cards.every(c => c.rank === firstRank);
}

/**
 * Check if the pile should be burned
 * Pile burns when there are 4 cards of the same rank on top
 */
export function checkBurnPile(discardPile: Card[]): boolean {
  if (discardPile.length < 4) return false;

  const topFour = discardPile.slice(-4);
  const rank = topFour[0].rank;
  return topFour.every(c => c.rank === rank);
}

/**
 * Get the top card from a pile
 */
export function getTopCard(pile: Card[]): Card | null {
  return pile.length > 0 ? pile[pile.length - 1] : null;
}

/**
 * Check if a player can play any card from their hand
 */
export function hasValidMove(hand: Card[], topCard: Card | null, reverseMode: boolean): boolean {
  return hand.some(card => canPlayCard(card, topCard, reverseMode));
}
