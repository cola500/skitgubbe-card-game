import type { GameState, Card, PlayerState } from '../types';
import { createShuffledDeck, dealInitialCards, drawCards } from './deck';
import { canPlayCard, canPlayMultiple, checkBurnPile, getTopCard } from './gameLogic';
import { applySpecialCardEffect } from './specialCards';
import { checkWinCondition, getNextCardSource } from './winCondition';
import { makeAIDecision } from './aiPlayer';
import { getSuitEmoji } from './cards';

// Game actions
export type GameAction =
  | { type: 'DEAL_CARDS' }
  | { type: 'SELECT_CARD'; card: Card }
  | { type: 'DESELECT_CARD'; card: Card }
  | { type: 'PLAY_CARDS' }
  | { type: 'PLAY_SINGLE_CARD'; card: Card }
  | { type: 'TAKE_PILE' }
  | { type: 'AI_TURN' }
  | { type: 'DRAW_CARDS'; player: 'player' | 'ai' }
  | { type: 'CHECK_WIN' }
  | { type: 'NEW_GAME' }
  | { type: 'EXCHANGE_CARD'; handCard: Card; tableCard: Card }
  | { type: 'START_GAME' }
  | { type: 'SORT_HAND'; direction: 'asc' | 'desc' };

/**
 * Initial game state
 */
export function createInitialGameState(): GameState {
  return {
    deck: [],
    discardPile: [],
    player: {
      hand: [],
      tableCardsDown: [],
      tableCardsUp: []
    },
    ai: {
      hand: [],
      tableCardsDown: [],
      tableCardsUp: []
    },
    currentTurn: 'player',
    phase: 'setup',
    selectedCards: [],
    lastAction: 'Nytt spel startat',
    winner: null,
    reverseMode: false,
    sortDirection: 'asc'
  };
}

/**
 * Game reducer - handles all state transitions
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'DEAL_CARDS': {
      const deck = createShuffledDeck();
      const dealt = dealInitialCards(deck);

      return {
        ...state,
        deck: dealt.remainingDeck,
        player: {
          hand: dealt.playerHand,
          tableCardsDown: dealt.playerTableDown,
          tableCardsUp: dealt.playerTableUp
        },
        ai: {
          hand: dealt.aiHand,
          tableCardsDown: dealt.aiTableDown,
          tableCardsUp: dealt.aiTableUp
        },
        discardPile: [],
        currentTurn: 'player',
        phase: 'setup',
        selectedCards: [],
        lastAction: 'Välj kort att byta mellan hand och bord. Klicka "Starta spel" när du är klar.',
        winner: null,
        reverseMode: false
      };
    }

    case 'SELECT_CARD': {
      // Can only select cards from current card source
      const cardSource = getNextCardSource(state.player);
      if (cardSource !== 'hand') {
        return state; // Can only select from hand
      }

      // Check if card is already selected
      if (state.selectedCards.some(c => c.id === action.card.id)) {
        return state;
      }

      // Can't select more than 3 cards
      if (state.selectedCards.length >= 3) {
        return state;
      }

      // If already have selected cards, can only select same rank
      if (state.selectedCards.length > 0 && state.selectedCards[0].rank !== action.card.rank) {
        return state;
      }

      return {
        ...state,
        selectedCards: [...state.selectedCards, action.card]
      };
    }

    case 'DESELECT_CARD': {
      return {
        ...state,
        selectedCards: state.selectedCards.filter(c => c.id !== action.card.id)
      };
    }

    case 'PLAY_CARDS': {
      if (state.currentTurn !== 'player') return state;
      if (state.selectedCards.length === 0) return state;

      const topCard = getTopCard(state.discardPile);
      const cardsToPlay = state.selectedCards;

      // Validate that all selected cards can be played
      if (!canPlayMultiple(cardsToPlay)) {
        return {
          ...state,
          lastAction: 'Kan bara spela kort med samma valör tillsammans!'
        };
      }

      // Check if first card can be played
      const firstCard = cardsToPlay[0];
      if (!canPlayCard(firstCard, topCard, state.reverseMode)) {
        return {
          ...state,
          lastAction: state.reverseMode
            ? 'Måste spela kort som är ≤5!'
            : 'Måste spela kort som är ≥ översta kortet!'
        };
      }

      // Remove cards from player's hand
      let newPlayerHand = state.player.hand.filter(
        c => !cardsToPlay.some(selected => selected.id === c.id)
      );

      // Add cards to discard pile
      let newDiscardPile = [...state.discardPile, ...cardsToPlay];

      // Apply special card effect (only for the last/first card in the group)
      const playedCard = cardsToPlay[0];
      const specialEffect = applySpecialCardEffect(playedCard);

      // Check if pile should burn (4 same rank on top or 10 played)
      const shouldBurn = checkBurnPile(newDiscardPile) || playedCard.rank === '10';

      if (shouldBurn) {
        newDiscardPile = [];
      }

      // Draw cards to refill hand to 3
      const { drawnCards, remainingDeck } = drawCards(state.deck, newPlayerHand.length);
      newPlayerHand = [...newPlayerHand, ...drawnCards];

      // Determine next turn (if burn, same player continues)
      const nextTurn: 'player' | 'ai' = shouldBurn ? 'player' : 'ai';

      // Create action message
      const cardNames = cardsToPlay.map(c => `${c.rank}${c.suit === 'hearts' ? '♥' : c.suit === 'diamonds' ? '♦' : c.suit === 'clubs' ? '♣' : '♠'}`).join(', ');
      let actionMessage = `Du spelade: ${cardNames}`;
      if (shouldBurn) {
        actionMessage += ' - Högen bränns!';
      }

      const newState: GameState = {
        ...state,
        player: {
          ...state.player,
          hand: newPlayerHand
        },
        deck: remainingDeck,
        discardPile: newDiscardPile,
        reverseMode: specialEffect.reverseMode ?? false,
        currentTurn: nextTurn,
        selectedCards: [],
        lastAction: actionMessage
      };

      // Check win condition
      const playerWon = checkWinCondition(newState.player, playedCard);
      if (playerWon) {
        return {
          ...newState,
          phase: 'finished' as const,
          winner: 'player' as const,
          currentTurn: newState.currentTurn as 'player' | 'ai',
          lastAction: '🎉 Du vann!'
        };
      }

      return newState;
    }

    case 'TAKE_PILE': {
      if (state.currentTurn !== 'player') return state;

      // Add all cards from discard pile to player's hand
      const newPlayerHand = [...state.player.hand, ...state.discardPile];

      return {
        ...state,
        player: {
          ...state.player,
          hand: newPlayerHand
        },
        discardPile: [],
        reverseMode: false,
        currentTurn: 'ai',
        selectedCards: [],
        lastAction: 'Du tog upp högen'
      };
    }

    case 'DRAW_CARDS': {
      const { player: targetPlayer } = action;

      if (state.deck.length === 0) {
        return {
          ...state,
          lastAction: 'Kortleken är tom!'
        };
      }

      // Dra sista kortet från deck
      const drawnCard = state.deck[state.deck.length - 1];
      const newDeck = state.deck.slice(0, -1);

      if (targetPlayer === 'player') {
        return {
          ...state,
          deck: newDeck,
          player: {
            ...state.player,
            hand: [...state.player.hand, drawnCard]
          },
          lastAction: `Du drog ett kort (${drawnCard.rank}${getSuitEmoji(drawnCard.suit)})`
        };
      } else {
        return {
          ...state,
          deck: newDeck,
          ai: {
            ...state.ai,
            hand: [...state.ai.hand, drawnCard]
          },
          lastAction: 'Datorn drog ett kort'
        };
      }
    }

    case 'EXCHANGE_CARD': {
      if (state.phase !== 'setup') return state;

      const { handCard, tableCard } = action;

      // Validate handCard exists in player.hand
      const handIndex = state.player.hand.findIndex(c => c.id === handCard.id);
      if (handIndex === -1) {
        return {
          ...state,
          lastAction: 'Kortet finns inte i din hand!'
        };
      }

      // Validate tableCard exists in player.tableCardsUp
      const tableIndex = state.player.tableCardsUp.findIndex(c => c.id === tableCard.id);
      if (tableIndex === -1) {
        return {
          ...state,
          lastAction: 'Kortet finns inte bland dina synliga bordskort!'
        };
      }

      // Swap cards
      const newHand = [...state.player.hand];
      const newTableUp = [...state.player.tableCardsUp];

      newHand[handIndex] = tableCard;
      newTableUp[tableIndex] = handCard;

      return {
        ...state,
        player: {
          ...state.player,
          hand: newHand,
          tableCardsUp: newTableUp
        },
        lastAction: `Bytte ${handCard.rank}${getSuitEmoji(handCard.suit)} ↔ ${tableCard.rank}${getSuitEmoji(tableCard.suit)}`,
        selectedCards: []
      };
    }

    case 'START_GAME': {
      if (state.phase !== 'setup') return state;

      return {
        ...state,
        phase: 'playing',
        currentTurn: 'player',
        lastAction: 'Spelet börjar! Din tur.',
        selectedCards: []
      };
    }

    case 'SORT_HAND': {
      const sortedHand = [...state.player.hand].sort((a, b) => {
        if (action.direction === 'asc') {
          return a.value - b.value;  // Stigande: 2, 3, 4, ..., K, A
        } else {
          return b.value - a.value;  // Fallande: A, K, Q, ..., 3, 2
        }
      });

      return {
        ...state,
        player: {
          ...state.player,
          hand: sortedHand
        },
        sortDirection: action.direction,
        lastAction: action.direction === 'asc'
          ? 'Sorterat stigande (2→A)'
          : 'Sorterat fallande (A→2)'
      };
    }

    case 'PLAY_SINGLE_CARD': {
      if (state.currentTurn !== 'player') return state;

      const cardToPlay = action.card;
      const topCard = getTopCard(state.discardPile);

      // Check if card can be played
      if (!canPlayCard(cardToPlay, topCard, state.reverseMode)) {
        return {
          ...state,
          lastAction: state.reverseMode
            ? 'Måste spela kort som är ≤5!'
            : 'Måste spela kort som är ≥ översta kortet!'
        };
      }

      // Remove card from player's hand
      let newPlayerHand = state.player.hand.filter(c => c.id !== cardToPlay.id);

      // Add card to discard pile
      let newDiscardPile = [...state.discardPile, cardToPlay];

      // Apply special card effect
      const specialEffect = applySpecialCardEffect(cardToPlay);

      // Check if pile should burn
      const shouldBurn = checkBurnPile(newDiscardPile) || cardToPlay.rank === '10';

      if (shouldBurn) {
        newDiscardPile = [];
      }

      // Draw cards to refill hand to 3
      const { drawnCards, remainingDeck } = drawCards(state.deck, newPlayerHand.length);
      newPlayerHand = [...newPlayerHand, ...drawnCards];

      // Determine next turn
      const nextTurn: 'player' | 'ai' = shouldBurn ? 'player' : 'ai';

      // Create action message
      const cardName = `${cardToPlay.rank}${getSuitEmoji(cardToPlay.suit)}`;
      let actionMessage = `Du spelade: ${cardName}`;
      if (shouldBurn) {
        actionMessage += ' - Högen bränns!';
      }

      const newState: GameState = {
        ...state,
        player: {
          ...state.player,
          hand: newPlayerHand
        },
        deck: remainingDeck,
        discardPile: newDiscardPile,
        reverseMode: specialEffect.reverseMode ?? false,
        currentTurn: nextTurn,
        selectedCards: [],
        lastAction: actionMessage
      };

      // Check win condition
      const playerWon = checkWinCondition(newState.player, cardToPlay);
      if (playerWon) {
        return {
          ...newState,
          phase: 'finished' as const,
          winner: 'player' as const,
          currentTurn: newState.currentTurn as 'player' | 'ai',
          lastAction: '🎉 Du vann!'
        };
      }

      return newState;
    }

    case 'AI_TURN': {
      if (state.currentTurn !== 'ai') return state;

      const topCard = getTopCard(state.discardPile);
      const aiDecision = makeAIDecision(state.ai, topCard, state.reverseMode);

      if (aiDecision.action === 'take') {
        // AI takes the pile
        return {
          ...state,
          ai: {
            ...state.ai,
            hand: [...state.ai.hand, ...state.discardPile]
          },
          discardPile: [],
          reverseMode: false,
          currentTurn: 'player',
          lastAction: 'AI tog högen'
        };
      }

      // AI plays cards
      const cardsToPlay = aiDecision.cards!;
      const cardSource = getNextCardSource(state.ai);

      // Remove cards from AI's appropriate source
      let newAI = { ...state.ai };
      switch (cardSource) {
        case 'hand':
          newAI.hand = newAI.hand.filter(c => !cardsToPlay.some(played => played.id === c.id));
          break;
        case 'tableUp':
          newAI.tableCardsUp = newAI.tableCardsUp.filter(c => !cardsToPlay.some(played => played.id === c.id));
          break;
        case 'tableDown':
          newAI.tableCardsDown = newAI.tableCardsDown.filter(c => !cardsToPlay.some(played => played.id === c.id));
          break;
      }

      // Add cards to discard pile
      let newDiscardPile = [...state.discardPile, ...cardsToPlay];

      // Apply special card effect
      const playedCard = cardsToPlay[0];
      const specialEffect = applySpecialCardEffect(playedCard);

      // Check if pile should burn
      const shouldBurn = checkBurnPile(newDiscardPile) || playedCard.rank === '10';

      if (shouldBurn) {
        newDiscardPile = [];
      }

      // Draw cards if playing from hand
      let newDeck = state.deck;
      if (cardSource === 'hand') {
        const { drawnCards, remainingDeck } = drawCards(state.deck, newAI.hand.length);
        newAI.hand = [...newAI.hand, ...drawnCards];
        newDeck = remainingDeck;
      }

      // Determine next turn (if burn, AI continues)
      const nextTurn: 'player' | 'ai' = shouldBurn ? 'ai' : 'player';

      // Create action message
      const cardNames = cardsToPlay.map(c => `${c.rank}${c.suit === 'hearts' ? '♥' : c.suit === 'diamonds' ? '♦' : c.suit === 'clubs' ? '♣' : '♠'}`).join(', ');
      let actionMessage = `AI spelade: ${cardNames}`;
      if (shouldBurn) {
        actionMessage += ' - Högen bränns!';
      }

      const newState: GameState = {
        ...state,
        ai: newAI,
        deck: newDeck,
        discardPile: newDiscardPile,
        reverseMode: specialEffect.reverseMode ?? false,
        currentTurn: nextTurn,
        lastAction: actionMessage
      };

      // Check win condition
      const aiWon = checkWinCondition(newState.ai, playedCard);
      if (aiWon) {
        return {
          ...newState,
          phase: 'finished' as const,
          winner: 'ai' as const,
          currentTurn: newState.currentTurn as 'player' | 'ai',
          lastAction: '😢 Datorn vann!'
        };
      }

      return newState;
    }

    case 'CHECK_WIN': {
      if (state.phase === 'finished') return state;

      const topCard = getTopCard(state.discardPile);

      // Check player win
      const playerWon = checkWinCondition(state.player, topCard);
      if (playerWon) {
        return {
          ...state,
          phase: 'finished',
          winner: 'player',
          lastAction: '🎉 Du vann!'
        };
      }

      // Check AI win
      const aiWon = checkWinCondition(state.ai, topCard);
      if (aiWon) {
        return {
          ...state,
          phase: 'finished',
          winner: 'ai',
          lastAction: '😢 Datorn vann!'
        };
      }

      return state;
    }

    case 'NEW_GAME': {
      return createInitialGameState();
    }

    default:
      return state;
  }
}
