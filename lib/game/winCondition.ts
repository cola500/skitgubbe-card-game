import type { Card, PlayerState } from '../types';

/**
 * Check if a player has won the game
 *
 * Win conditions:
 * 1. Player must have no cards left (hand, tableCardsDown, tableCardsUp all empty)
 * 2. CRITICAL: Player CANNOT win on a special card (2, 5, 10, Ace)
 *    The last card played must be a regular card (3, 4, 6, 7, 8, 9, J, Q, K)
 *
 * @param player - The player state to check
 * @param lastPlayedCard - The last card that was played (or null if none)
 * @returns true if the player has won
 */
export function checkWinCondition(player: PlayerState, lastPlayedCard: Card | null): boolean {
  // Must have no cards left
  const hasNoCards =
    player.hand.length === 0 &&
    player.tableCardsDown.length === 0 &&
    player.tableCardsUp.length === 0;

  if (!hasNoCards) return false;

  // CRITICAL: Cannot win on special card (2, 5, 10, Ace)
  // If no card was played yet, cannot win
  if (!lastPlayedCard) return false;

  if (lastPlayedCard.isSpecial) {
    return false;
  }

  // All conditions met → player wins!
  return true;
}

/**
 * Check if a player is out of cards (but may not have won due to special card rule)
 */
export function isOutOfCards(player: PlayerState): boolean {
  return (
    player.hand.length === 0 &&
    player.tableCardsDown.length === 0 &&
    player.tableCardsUp.length === 0
  );
}

/**
 * Get the next source of cards for a player
 * Priority: hand → tableCardsUp → tableCardsDown
 */
export function getNextCardSource(player: PlayerState): 'hand' | 'tableUp' | 'tableDown' | 'none' {
  if (player.hand.length > 0) return 'hand';
  if (player.tableCardsUp.length > 0) return 'tableUp';
  if (player.tableCardsDown.length > 0) return 'tableDown';
  return 'none';
}
