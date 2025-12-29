import { canPlayCard, canPlayMultiple, checkBurnPile, getTopCard, hasValidMove } from '../lib/game/gameLogic';
import { createCard } from '../lib/game/cards';

describe('gameLogic', () => {
  describe('canPlayCard', () => {
    test('can play any card on empty pile', () => {
      const card = createCard('hearts', '3');
      expect(canPlayCard(card, null, false)).toBe(true);
    });

    test('can play equal card', () => {
      const card = createCard('hearts', '7');
      const topCard = createCard('clubs', '7');
      expect(canPlayCard(card, topCard, false)).toBe(true);
    });

    test('can play higher card', () => {
      const card = createCard('hearts', '9');
      const topCard = createCard('clubs', '6');
      expect(canPlayCard(card, topCard, false)).toBe(true);
    });

    test('cannot play lower card in normal mode', () => {
      const card = createCard('hearts', '5');
      const topCard = createCard('clubs', '8');
      expect(canPlayCard(card, topCard, false)).toBe(false);
    });

    test('can play 2 on anything (reset card)', () => {
      const card = createCard('hearts', '2');
      const topCard = createCard('clubs', 'K');
      expect(canPlayCard(card, topCard, false)).toBe(true);
    });

    test('can play 10 on anything (burn card)', () => {
      const card = createCard('hearts', '10');
      const topCard = createCard('clubs', 'A');
      expect(canPlayCard(card, topCard, false)).toBe(true);
    });

    test('reverse mode: can play card ≤5 on 5', () => {
      const card = createCard('hearts', '3');
      const topCard = createCard('clubs', '5');
      expect(canPlayCard(card, topCard, true)).toBe(true);
    });

    test('reverse mode: can play 5 on 5', () => {
      const card = createCard('hearts', '5');
      const topCard = createCard('clubs', '5');
      expect(canPlayCard(card, topCard, true)).toBe(true);
    });

    test('reverse mode: cannot play card >5', () => {
      const card = createCard('hearts', '8');
      const topCard = createCard('clubs', '5');
      expect(canPlayCard(card, topCard, true)).toBe(false);
    });

    test('reverse mode: can still play 2 (reset)', () => {
      const card = createCard('hearts', '2');
      const topCard = createCard('clubs', '5');
      expect(canPlayCard(card, topCard, true)).toBe(true);
    });

    test('reverse mode: can still play 10 (burn)', () => {
      const card = createCard('hearts', '10');
      const topCard = createCard('clubs', '5');
      expect(canPlayCard(card, topCard, true)).toBe(true);
    });
  });

  describe('canPlayMultiple', () => {
    test('empty array returns false', () => {
      expect(canPlayMultiple([])).toBe(false);
    });

    test('single card returns true', () => {
      const cards = [createCard('hearts', '7')];
      expect(canPlayMultiple(cards)).toBe(true);
    });

    test('multiple cards with same rank returns true', () => {
      const cards = [
        createCard('hearts', '7'),
        createCard('diamonds', '7'),
        createCard('clubs', '7')
      ];
      expect(canPlayMultiple(cards)).toBe(true);
    });

    test('multiple cards with different ranks returns false', () => {
      const cards = [
        createCard('hearts', '7'),
        createCard('diamonds', '8')
      ];
      expect(canPlayMultiple(cards)).toBe(false);
    });
  });

  describe('checkBurnPile', () => {
    test('pile with <4 cards does not burn', () => {
      const pile = [
        createCard('hearts', '7'),
        createCard('diamonds', '7'),
        createCard('clubs', '7')
      ];
      expect(checkBurnPile(pile)).toBe(false);
    });

    test('pile with 4 same rank cards burns', () => {
      const pile = [
        createCard('hearts', '7'),
        createCard('diamonds', '7'),
        createCard('clubs', '7'),
        createCard('spades', '7')
      ];
      expect(checkBurnPile(pile)).toBe(true);
    });

    test('pile with 4 cards but different ranks does not burn', () => {
      const pile = [
        createCard('hearts', '7'),
        createCard('diamonds', '7'),
        createCard('clubs', '7'),
        createCard('spades', '8')
      ];
      expect(checkBurnPile(pile)).toBe(false);
    });

    test('pile with >4 cards burns if top 4 are same rank', () => {
      const pile = [
        createCard('hearts', '3'),
        createCard('diamonds', '5'),
        createCard('hearts', '7'),
        createCard('diamonds', '7'),
        createCard('clubs', '7'),
        createCard('spades', '7')
      ];
      expect(checkBurnPile(pile)).toBe(true);
    });

    test('pile with >4 cards does not burn if top 4 are different ranks', () => {
      const pile = [
        createCard('hearts', '7'),
        createCard('diamonds', '7'),
        createCard('clubs', '7'),
        createCard('spades', '8'),
        createCard('hearts', '9')
      ];
      expect(checkBurnPile(pile)).toBe(false);
    });
  });

  describe('getTopCard', () => {
    test('empty pile returns null', () => {
      expect(getTopCard([])).toBeNull();
    });

    test('returns last card from pile', () => {
      const pile = [
        createCard('hearts', '3'),
        createCard('diamonds', '5'),
        createCard('clubs', '9')
      ];
      const topCard = getTopCard(pile);
      expect(topCard?.rank).toBe('9');
      expect(topCard?.suit).toBe('clubs');
    });
  });

  describe('hasValidMove', () => {
    test('returns true if player has valid card', () => {
      const hand = [
        createCard('hearts', '3'),
        createCard('diamonds', '7'),
        createCard('clubs', '9')
      ];
      const topCard = createCard('spades', '6');
      expect(hasValidMove(hand, topCard, false)).toBe(true);
    });

    test('returns false if player has no valid card', () => {
      const hand = [
        createCard('hearts', '3'),
        createCard('diamonds', '4')
      ];
      const topCard = createCard('spades', '9');
      expect(hasValidMove(hand, topCard, false)).toBe(false);
    });

    test('returns true if player has special card (2)', () => {
      const hand = [
        createCard('hearts', '2')
      ];
      const topCard = createCard('spades', 'K');
      expect(hasValidMove(hand, topCard, false)).toBe(true);
    });

    test('returns true on empty pile', () => {
      const hand = [
        createCard('hearts', '3')
      ];
      expect(hasValidMove(hand, null, false)).toBe(true);
    });
  });
});
