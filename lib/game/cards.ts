import type { Card, Rank, Suit } from '../types';

// Card values (2-14)
export const CARD_VALUES: Record<Rank, number> = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 11,
  'Q': 12,
  'K': 13,
  'A': 14
};

// Special ranks (2, 5, 10, Ace)
export const SPECIAL_RANKS: Rank[] = ['2', '5', '10', 'A'];

/**
 * Create a single card
 */
export function createCard(suit: Suit, rank: Rank): Card {
  return {
    id: `${suit}-${rank}`,
    suit,
    rank,
    value: CARD_VALUES[rank],
    isSpecial: SPECIAL_RANKS.includes(rank)
  };
}

/**
 * Create a full 52-card deck
 */
export function createDeck(): Card[] {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push(createCard(suit, rank));
    }
  }
  return deck;
}

/**
 * Get suit emoji for display
 */
export function getSuitEmoji(suit: Suit): string {
  const suitEmojis: Record<Suit, string> = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠'
  };
  return suitEmojis[suit];
}

/**
 * Get suit color (for styling)
 */
export function getSuitColor(suit: Suit): 'red' | 'black' {
  return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
}
