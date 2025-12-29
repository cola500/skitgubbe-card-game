import type { Card, PlayerState, AIDecision } from '../types';
import { canPlayCard } from './gameLogic';
import { getNextCardSource } from './winCondition';

/**
 * Make an AI decision based on current game state
 *
 * Strategy (simple rule-based):
 * 1. Find all valid cards that can be played
 * 2. If no valid cards → take pile
 * 3. Prioritize non-special cards (save 2, 5, 10 for later)
 * 4. Play lowest value card first
 *
 * @param aiState - AI player state
 * @param topCard - Top card of discard pile
 * @param reverseMode - Whether reverse mode is active (≤5 rule)
 * @returns AI decision (play or take)
 */
export function makeAIDecision(
  aiState: PlayerState,
  topCard: Card | null,
  reverseMode: boolean
): AIDecision {
  // Determine which cards AI can play from
  const cardSource = getNextCardSource(aiState);

  let availableCards: Card[] = [];
  switch (cardSource) {
    case 'hand':
      availableCards = aiState.hand;
      break;
    case 'tableUp':
      availableCards = aiState.tableCardsUp;
      break;
    case 'tableDown':
      // When playing from table down, pick random card (can't see it)
      if (aiState.tableCardsDown.length > 0) {
        const randomIndex = Math.floor(Math.random() * aiState.tableCardsDown.length);
        return {
          action: 'play',
          cards: [aiState.tableCardsDown[randomIndex]]
        };
      }
      return { action: 'take' };
    case 'none':
      // No cards left - this shouldn't happen during AI turn
      return { action: 'take' };
  }

  // Find all valid cards
  const validCards = availableCards.filter(card =>
    canPlayCard(card, topCard, reverseMode)
  );

  if (validCards.length === 0) {
    // Must take pile
    return { action: 'take' };
  }

  // Strategy: Prioritize non-special cards, then play lowest value
  const nonSpecialValid = validCards.filter(c => !c.isSpecial);

  if (nonSpecialValid.length > 0) {
    // Play lowest non-special card
    nonSpecialValid.sort((a, b) => a.value - b.value);

    // Check if we have multiple of the same rank
    const lowestRank = nonSpecialValid[0].rank;
    const sameRankCards = nonSpecialValid.filter(c => c.rank === lowestRank);

    return {
      action: 'play',
      cards: sameRankCards.length > 1 ? sameRankCards : [nonSpecialValid[0]]
    };
  }

  // Only special cards left → play lowest value special
  validCards.sort((a, b) => a.value - b.value);

  // Check for multiple same rank
  const lowestRank = validCards[0].rank;
  const sameRankCards = validCards.filter(c => c.rank === lowestRank);

  return {
    action: 'play',
    cards: sameRankCards.length > 1 ? sameRankCards : [validCards[0]]
  };
}
