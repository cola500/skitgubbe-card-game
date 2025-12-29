import { checkWinCondition, isOutOfCards, getNextCardSource } from '../lib/game/winCondition';
import { createCard } from '../lib/game/cards';
import type { PlayerState } from '../lib/types';

describe('winCondition', () => {
  describe('checkWinCondition', () => {
    const emptyPlayer: PlayerState = {
      hand: [],
      tableCardsDown: [],
      tableCardsUp: []
    };

    const playerWithCards: PlayerState = {
      hand: [createCard('hearts', '3')],
      tableCardsDown: [],
      tableCardsUp: []
    };

    test('player with cards cannot win', () => {
      const lastCard = createCard('hearts', '7');
      expect(checkWinCondition(playerWithCards, lastCard)).toBe(false);
    });

    test('player wins when out of cards and last card is normal (3)', () => {
      const lastCard = createCard('hearts', '3');
      expect(checkWinCondition(emptyPlayer, lastCard)).toBe(true);
    });

    test('player wins when out of cards and last card is normal (7)', () => {
      const lastCard = createCard('hearts', '7');
      expect(checkWinCondition(emptyPlayer, lastCard)).toBe(true);
    });

    test('player wins when out of cards and last card is J', () => {
      const lastCard = createCard('hearts', 'J');
      expect(checkWinCondition(emptyPlayer, lastCard)).toBe(true);
    });

    test('player wins when out of cards and last card is Q', () => {
      const lastCard = createCard('hearts', 'Q');
      expect(checkWinCondition(emptyPlayer, lastCard)).toBe(true);
    });

    test('player wins when out of cards and last card is K', () => {
      const lastCard = createCard('hearts', 'K');
      expect(checkWinCondition(emptyPlayer, lastCard)).toBe(true);
    });

    test('CRITICAL: player CANNOT win when last card is 2 (special)', () => {
      const lastCard = createCard('hearts', '2');
      expect(checkWinCondition(emptyPlayer, lastCard)).toBe(false);
    });

    test('CRITICAL: player CANNOT win when last card is 5 (special)', () => {
      const lastCard = createCard('hearts', '5');
      expect(checkWinCondition(emptyPlayer, lastCard)).toBe(false);
    });

    test('CRITICAL: player CANNOT win when last card is 10 (special)', () => {
      const lastCard = createCard('hearts', '10');
      expect(checkWinCondition(emptyPlayer, lastCard)).toBe(false);
    });

    test('CRITICAL: player CANNOT win when last card is Ace (special)', () => {
      const lastCard = createCard('hearts', 'A');
      expect(checkWinCondition(emptyPlayer, lastCard)).toBe(false);
    });

    test('player cannot win if no card was played', () => {
      expect(checkWinCondition(emptyPlayer, null)).toBe(false);
    });

    test('player with table cards down cannot win', () => {
      const player: PlayerState = {
        hand: [],
        tableCardsDown: [createCard('hearts', '3')],
        tableCardsUp: []
      };
      const lastCard = createCard('hearts', '7');
      expect(checkWinCondition(player, lastCard)).toBe(false);
    });

    test('player with table cards up cannot win', () => {
      const player: PlayerState = {
        hand: [],
        tableCardsDown: [],
        tableCardsUp: [createCard('hearts', '3')]
      };
      const lastCard = createCard('hearts', '7');
      expect(checkWinCondition(player, lastCard)).toBe(false);
    });
  });

  describe('isOutOfCards', () => {
    test('returns true when all cards are gone', () => {
      const player: PlayerState = {
        hand: [],
        tableCardsDown: [],
        tableCardsUp: []
      };
      expect(isOutOfCards(player)).toBe(true);
    });

    test('returns false when hand has cards', () => {
      const player: PlayerState = {
        hand: [createCard('hearts', '3')],
        tableCardsDown: [],
        tableCardsUp: []
      };
      expect(isOutOfCards(player)).toBe(false);
    });

    test('returns false when tableCardsDown has cards', () => {
      const player: PlayerState = {
        hand: [],
        tableCardsDown: [createCard('hearts', '3')],
        tableCardsUp: []
      };
      expect(isOutOfCards(player)).toBe(false);
    });

    test('returns false when tableCardsUp has cards', () => {
      const player: PlayerState = {
        hand: [],
        tableCardsDown: [],
        tableCardsUp: [createCard('hearts', '3')]
      };
      expect(isOutOfCards(player)).toBe(false);
    });
  });

  describe('getNextCardSource', () => {
    test('returns hand when hand has cards', () => {
      const player: PlayerState = {
        hand: [createCard('hearts', '3')],
        tableCardsDown: [createCard('hearts', '4')],
        tableCardsUp: [createCard('hearts', '5')]
      };
      expect(getNextCardSource(player)).toBe('hand');
    });

    test('returns tableUp when hand is empty but tableUp has cards', () => {
      const player: PlayerState = {
        hand: [],
        tableCardsDown: [createCard('hearts', '4')],
        tableCardsUp: [createCard('hearts', '5')]
      };
      expect(getNextCardSource(player)).toBe('tableUp');
    });

    test('returns tableDown when hand and tableUp are empty', () => {
      const player: PlayerState = {
        hand: [],
        tableCardsDown: [createCard('hearts', '4')],
        tableCardsUp: []
      };
      expect(getNextCardSource(player)).toBe('tableDown');
    });

    test('returns none when all sources are empty', () => {
      const player: PlayerState = {
        hand: [],
        tableCardsDown: [],
        tableCardsUp: []
      };
      expect(getNextCardSource(player)).toBe('none');
    });
  });
});
