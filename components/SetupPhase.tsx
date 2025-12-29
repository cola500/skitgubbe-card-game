'use client';

import { useState } from 'react';
import type { Card as CardType, PlayerState } from '@/lib/types';
import Card from './Card';

interface SetupPhaseProps {
  player: PlayerState;
  lastAction: string;
  onExchangeCard: (handCard: CardType, tableCard: CardType) => void;
  onStartGame: () => void;
}

export default function SetupPhase({
  player,
  lastAction,
  onExchangeCard,
  onStartGame
}: SetupPhaseProps) {
  const [selectedHandCard, setSelectedHandCard] = useState<CardType | null>(null);
  const [selectedTableCard, setSelectedTableCard] = useState<CardType | null>(null);

  const handleHandCardClick = (card: CardType) => {
    if (selectedHandCard?.id === card.id) {
      // Deselect if clicking same card
      setSelectedHandCard(null);
      return;
    }

    // Om table card redan är valt → exchange direkt
    if (selectedTableCard) {
      onExchangeCard(card, selectedTableCard);
      setSelectedHandCard(null);
      setSelectedTableCard(null);
      return;
    }

    // Annars bara select
    setSelectedHandCard(card);
  };

  const handleTableCardClick = (card: CardType) => {
    if (selectedTableCard?.id === card.id) {
      // Deselect if clicking same card
      setSelectedTableCard(null);
      return;
    }

    // Om hand card redan är valt → exchange direkt
    if (selectedHandCard) {
      onExchangeCard(selectedHandCard, card);
      setSelectedHandCard(null);
      setSelectedTableCard(null);
      return;
    }

    // Annars bara select
    setSelectedTableCard(card);
  };

  return (
    <div
      className="min-h-screen p-4 flex flex-col items-center justify-center"
      style={{
        backgroundColor: '#0f3b29',
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px),
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px)
        `
      }}
    >
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-3xl" style={{ color: '#d4af37' }}>♠</span>
            <h1
              className="text-4xl font-bold"
              style={{
                color: '#fafaf9',
                textShadow: '0 2px 10px rgba(212, 175, 55, 0.3)'
              }}
            >
              Förbered dina kort
            </h1>
            <span className="text-3xl" style={{ color: '#d4af37' }}>♥</span>
          </div>

          {/* Instructions */}
          <div
            className="mx-auto max-w-xl p-4 rounded-lg mb-2"
            style={{
              backgroundColor: 'rgba(26, 83, 57, 0.6)',
              border: '1px solid rgba(212, 175, 55, 0.3)'
            }}
          >
            <p className="text-lg" style={{ color: '#e7e5e4' }}>
              Klicka på ett <strong style={{ color: '#f0d46f' }}>handkort</strong> och sedan ett{' '}
              <strong style={{ color: '#f0d46f' }}>bordskort</strong> för att byta plats
            </p>
          </div>

          {/* Status message */}
          <p className="text-sm" style={{ color: '#d4af37' }}>
            {lastAction}
          </p>
        </div>

        {/* Player hand */}
        <div className="mb-8">
          <h2
            className="text-xl font-bold text-center mb-4"
            style={{ color: '#f0d46f' }}
          >
            Din hand
          </h2>
          <div className="flex gap-3 justify-center flex-wrap">
            {player.hand.map((card) => (
              <Card
                key={card.id}
                card={card}
                selected={selectedHandCard?.id === card.id}
                onClick={() => handleHandCardClick(card)}
              />
            ))}
          </div>
        </div>

        {/* Table cards */}
        <div className="mb-8">
          <h2
            className="text-xl font-bold text-center mb-4"
            style={{ color: '#d4af37' }}
          >
            Dina synliga bordskort
          </h2>
          <div className="flex gap-3 justify-center flex-wrap">
            {player.tableCardsUp.map((card) => (
              <Card
                key={card.id}
                card={card}
                selected={selectedTableCard?.id === card.id}
                onClick={() => handleTableCardClick(card)}
              />
            ))}
          </div>
        </div>

        {/* Hidden table cards (just show, not interactive) */}
        <div className="mb-8">
          <h2
            className="text-sm text-center mb-2"
            style={{ color: 'rgba(250, 250, 249, 0.5)' }}
          >
            Dina dolda bordskort (kan ej bytas)
          </h2>
          <div className="flex gap-2 justify-center">
            {player.tableCardsDown.map((card) => (
              <Card key={card.id} card={card} faceDown small />
            ))}
          </div>
        </div>

        {/* Start game button */}
        <div className="flex justify-center">
          <button
            onClick={onStartGame}
            className="px-12 py-4 rounded-lg font-bold text-xl transition-all active:scale-95"
            style={{
              backgroundColor: '#d4af37',
              color: '#0f3b29',
              boxShadow: '0 6px 20px rgba(212, 175, 55, 0.5)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0d46f';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#d4af37';
            }}
          >
            🎮 Starta spel
          </button>
        </div>
      </div>
    </div>
  );
}
