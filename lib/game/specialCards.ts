import type { Card, GameState } from '../types';

/**
 * Apply special card effects after a card is played
 *
 * Special cards:
 * - 2: Reset card → reverseMode = false (next player can play anything)
 * - 5: Reverse card → reverseMode = true (next must play ≤5)
 * - 10: Burn pile → discardPile cleared, same player continues
 * - Ace: Highest card, no special effect (but cannot win on it)
 *
 * @param card - The card that was just played
 * @returns Partial game state updates to apply
 */
export function applySpecialCardEffect(card: Card): Partial<Pick<GameState, 'reverseMode' | 'discardPile'>> {
  switch (card.rank) {
    case '2':
      // Reset card → next player can play anything
      return { reverseMode: false };

    case '5':
      // Reverse card → next must be ≤5
      return { reverseMode: true };

    case '10':
      // Burn pile → pile cleared
      // Note: The caller should also keep currentTurn the same (player goes again)
      return {
        discardPile: [],
        reverseMode: false
      };

    case 'A':
      // Ace is highest card, no special effect (but can't win on it)
      return { reverseMode: false };

    default:
      // Non-special card → turn off reverse mode
      return { reverseMode: false };
  }
}

/**
 * Check if a card triggers the pile burn effect
 */
export function isBurnCard(card: Card): boolean {
  return card.rank === '10';
}

/**
 * Check if a card triggers reverse mode
 */
export function isReverseCard(card: Card): boolean {
  return card.rank === '5';
}

/**
 * Check if a card resets the pile constraints
 */
export function isResetCard(card: Card): boolean {
  return card.rank === '2';
}
