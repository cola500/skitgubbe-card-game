'use client';

import { useEffect } from 'react';
import { useImmerReducer } from 'use-immer';
import { gameReducer, createInitialGameState } from '@/lib/game/gameState';
import type { Card } from '@/lib/types';
import GameBoard from '@/components/GameBoard';
import SetupPhase from '@/components/SetupPhase';
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-playfair'
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-inter'
});

export default function GamePage() {
  const [gameState, dispatch] = useImmerReducer(gameReducer, createInitialGameState());

  // Deal cards on mount
  useEffect(() => {
    dispatch({ type: 'DEAL_CARDS' });
  }, [dispatch]);

  // AI turn handling
  useEffect(() => {
    let cancelled = false;

    if (gameState.currentTurn === 'ai' && gameState.phase === 'playing') {
      // Add delay to make AI feel more natural
      const timer = setTimeout(() => {
        if (!cancelled) {
          dispatch({ type: 'AI_TURN' });
        }
      }, 800);

      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }

    return undefined;
  }, [gameState.currentTurn, gameState.phase, gameState.lastAction, dispatch]);

  // Check win condition after each turn
  useEffect(() => {
    if (gameState.phase === 'playing') {
      dispatch({ type: 'CHECK_WIN' });
    }
  }, [gameState.player, gameState.ai, gameState.discardPile, gameState.phase, dispatch]);

  const handleSelectCard = (card: Card) => {
    dispatch({ type: 'SELECT_CARD', card });
  };

  const handleDeselectCard = (card: Card) => {
    dispatch({ type: 'DESELECT_CARD', card });
  };

  const handlePlaySingleCard = (card: Card) => {
    dispatch({ type: 'PLAY_SINGLE_CARD', card });
  };

  const handlePlaySelectedCards = () => {
    dispatch({ type: 'PLAY_CARDS' });
  };

  const handleTakePile = () => {
    dispatch({ type: 'TAKE_PILE' });
  };

  const handleDrawCard = () => {
    dispatch({ type: 'DRAW_CARDS', player: 'player' });
  };

  const handleNewGame = () => {
    dispatch({ type: 'NEW_GAME' });
    // Re-deal cards
    setTimeout(() => {
      dispatch({ type: 'DEAL_CARDS' });
    }, 100);
  };

  const handleExchangeCard = (handCard: Card, tableCard: Card) => {
    dispatch({ type: 'EXCHANGE_CARD', handCard, tableCard });
  };

  const handleStartGame = () => {
    dispatch({ type: 'START_GAME' });
  };

  const handleSortHand = () => {
    // Toggle direction
    const newDirection = gameState.sortDirection === 'asc' ? 'desc' : 'asc';
    dispatch({ type: 'SORT_HAND', direction: newDirection });
  };

  // Setup phase
  if (gameState.phase === 'setup') {
    return (
      <div className={`${playfair.variable} ${inter.variable}`}>
        <SetupPhase
          player={gameState.player}
          lastAction={gameState.lastAction}
          onExchangeCard={handleExchangeCard}
          onStartGame={handleStartGame}
        />
      </div>
    );
  }

  // Game finished overlay
  if (gameState.phase === 'finished') {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-4 ${playfair.variable} ${inter.variable}`}
        style={{
          backgroundColor: '#0f3b29',
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px)
          `
        }}
      >
        <div
          className="relative max-w-md w-full rounded-2xl p-8 text-center"
          style={{
            backgroundColor: 'rgba(26, 83, 57, 0.7)',
            border: '3px solid #b8932c',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
          }}
        >
          {/* Inner border */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              border: '1px solid rgba(212, 175, 55, 0.3)',
              margin: '3px'
            }}
          />

          <div className="relative z-10">
            {/* Decorative suits */}
            <div className="flex justify-center gap-4 mb-4 text-3xl" style={{ color: '#d4af37' }}>
              <span>♠</span>
              <span>♥</span>
              <span>♦</span>
              <span>♣</span>
            </div>

            <h1
              className="font-playfair text-5xl font-bold mb-4"
              style={{
                color: '#fafaf9',
                textShadow: '0 2px 10px rgba(212, 175, 55, 0.3)'
              }}
            >
              {gameState.winner === 'player' ? '🎉 Du vann!' : '😢 Datorn vann!'}
            </h1>

            <p
              className="font-inter text-lg mb-6"
              style={{ color: '#e7e5e4' }}
            >
              {gameState.winner === 'player'
                ? 'Grattis! Du besegrade datorn!'
                : 'Bättre lycka nästa gång!'}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleNewGame}
                className="px-8 py-3 rounded-lg font-inter font-semibold transition-all active:scale-95"
                style={{
                  backgroundColor: '#d4af37',
                  color: '#0f3b29',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0d46f';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#d4af37';
                }}
              >
                Spela igen
              </button>
              <a
                href="/"
                className="px-8 py-3 rounded-lg font-inter font-semibold transition-all active:scale-95"
                style={{
                  backgroundColor: 'rgba(212, 175, 55, 0.2)',
                  color: '#fafaf9',
                  border: '1px solid rgba(212, 175, 55, 0.5)'
                }}
              >
                Tillbaka till meny
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${playfair.variable} ${inter.variable}`}>
      <GameBoard
        gameState={gameState}
        onSelectCard={handleSelectCard}
        onDeselectCard={handleDeselectCard}
        onPlaySingleCard={handlePlaySingleCard}
        onPlayCards={handlePlaySelectedCards}
        onTakePile={handleTakePile}
        onDrawCard={handleDrawCard}
        onSortHand={handleSortHand}
      />
    </div>
  );
}
