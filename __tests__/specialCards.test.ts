import { applySpecialCardEffect, isBurnCard, isReverseCard, isResetCard } from '../lib/game/specialCards';
import { createCard } from '../lib/game/cards';

describe('specialCards', () => {
  describe('applySpecialCardEffect', () => {
    test('card 2 resets reverse mode', () => {
      const card = createCard('hearts', '2');
      const effect = applySpecialCardEffect(card);
      expect(effect.reverseMode).toBe(false);
      expect(effect.discardPile).toBeUndefined();
    });

    test('card 5 activates reverse mode', () => {
      const card = createCard('hearts', '5');
      const effect = applySpecialCardEffect(card);
      expect(effect.reverseMode).toBe(true);
      expect(effect.discardPile).toBeUndefined();
    });

    test('card 10 burns pile and resets reverse mode', () => {
      const card = createCard('hearts', '10');
      const effect = applySpecialCardEffect(card);
      expect(effect.reverseMode).toBe(false);
      expect(effect.discardPile).toEqual([]);
    });

    test('Ace resets reverse mode but no other effect', () => {
      const card = createCard('hearts', 'A');
      const effect = applySpecialCardEffect(card);
      expect(effect.reverseMode).toBe(false);
      expect(effect.discardPile).toBeUndefined();
    });

    test('normal card resets reverse mode', () => {
      const card = createCard('hearts', '7');
      const effect = applySpecialCardEffect(card);
      expect(effect.reverseMode).toBe(false);
    });
  });

  describe('isBurnCard', () => {
    test('returns true for 10', () => {
      const card = createCard('hearts', '10');
      expect(isBurnCard(card)).toBe(true);
    });

    test('returns false for other cards', () => {
      const cards = [
        createCard('hearts', '2'),
        createCard('hearts', '5'),
        createCard('hearts', 'A'),
        createCard('hearts', '7')
      ];
      cards.forEach(card => {
        expect(isBurnCard(card)).toBe(false);
      });
    });
  });

  describe('isReverseCard', () => {
    test('returns true for 5', () => {
      const card = createCard('hearts', '5');
      expect(isReverseCard(card)).toBe(true);
    });

    test('returns false for other cards', () => {
      const cards = [
        createCard('hearts', '2'),
        createCard('hearts', '10'),
        createCard('hearts', 'A'),
        createCard('hearts', '7')
      ];
      cards.forEach(card => {
        expect(isReverseCard(card)).toBe(false);
      });
    });
  });

  describe('isResetCard', () => {
    test('returns true for 2', () => {
      const card = createCard('hearts', '2');
      expect(isResetCard(card)).toBe(true);
    });

    test('returns false for other cards', () => {
      const cards = [
        createCard('hearts', '5'),
        createCard('hearts', '10'),
        createCard('hearts', 'A'),
        createCard('hearts', '7')
      ];
      cards.forEach(card => {
        expect(isResetCard(card)).toBe(false);
      });
    });
  });
});
