// Type definitions for Skitgubbe card game

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  id: string;              // Unique ID: "hearts-A", "clubs-10"
  suit: Suit;
  rank: Rank;
  value: number;           // 2=2, 3=3, ..., J=11, Q=12, K=13, A=14
  isSpecial: boolean;      // true for 2, 5, 10, Ace
  animationSource?: 'deck' | 'hand' | 'tableUp' | 'tableDown';  // Where card came from for animation
}

export interface PlayerState {
  hand: Card[];               // Max 3 cards in hand
  tableCardsDown: Card[];     // 3 face-down cards (unknown until played)
  tableCardsUp: Card[];       // 3 face-up cards
}

export interface GameState {
  deck: Card[];                    // Remaining draw pile
  discardPile: Card[];             // Cards played (top = last played)
  player: PlayerState;             // Human player
  ai: PlayerState;                 // AI opponent
  currentTurn: 'player' | 'ai';
  phase: 'setup' | 'playing' | 'finished';
  selectedCards: Card[];           // Cards player has selected to play
  lastAction: string;              // "Du spelade 7♥", "AI tog högen"
  winner: 'player' | 'ai' | null;
  reverseMode: boolean;            // true when 5 was played (≤5 rule)
  sortDirection: 'asc' | 'desc';   // Card sort direction for player hand
}

export interface GameStatistics {
  gamesPlayed: number;
  wins: number;
  losses: number;
  currentStreak: number;           // Win streak
  longestStreak: number;
}

export interface AIDecision {
  action: 'play' | 'take';
  cards?: Card[];                  // Cards to play (if action = 'play')
}
