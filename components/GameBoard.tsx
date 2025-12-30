'use client';

import type { GameState, Card } from '@/lib/types';
import CardPile from './CardPile';
import PlayerHand from './PlayerHand';
import TableCards from './TableCards';
import GameControls from './GameControls';
import GameStatus from './GameStatus';
import SortButton from './SortButton';
import { getNextCardSource } from '@/lib/game/winCondition';

interface GameBoardProps {
  gameState: GameState;
  onSelectCard: (card: Card) => void;
  onDeselectCard: (card: Card) => void;
  onPlaySingleCard: (card: Card) => void; // För direkt-spel
  onPlayCards: () => void;
  onTakePile: () => void;
  onDrawCard: () => void;
  onSortHand: () => void;
}

export default function GameBoard({
  gameState,
  onSelectCard,
  onDeselectCard,
  onPlaySingleCard,
  onPlayCards,
  onTakePile,
  onDrawCard,
  onSortHand
}: GameBoardProps) {
  const isPlayerTurn = gameState.currentTurn === 'player' && gameState.phase === 'playing';
  const playerCardSourceRaw = getNextCardSource(gameState.player);
  const playerCardSource = playerCardSourceRaw === 'none' ? undefined : playerCardSourceRaw;

  // Helper for playing table cards directly
  const handlePlayTableCard = (card: Card) => {
    onPlaySingleCard(card);
  };

  return (
    <div
      className="min-h-screen p-4 flex flex-col"
      style={{
        backgroundColor: '#0f3b29',
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px),
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px)
        `
      }}
    >
      {/* AI Area (top) */}
      <div className="mb-6">
        <div
          className="text-lg font-bold mb-2 text-center"
          style={{ color: '#d4af37', textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)' }}
        >
          🤖 Dator
        </div>

        <div className="flex gap-4 items-start justify-center">
          {/* AI table cards */}
          <TableCards
            cardsDown={gameState.ai.tableCardsDown}
            cardsUp={gameState.ai.tableCardsUp}
            isPlayerTable={false}
          />

          {/* AI hand */}
          <PlayerHand
            cards={gameState.ai.hand}
            selectedCards={[]}
            onSelect={() => { }}
            onDeselect={() => { }}
            faceDown
            label="Hand"
            disabled
          />
        </div>
      </div>

      {/* Center: Status + Deck + Discard Pile */}
      <div className="flex items-start justify-center gap-6 min-h-[200px]">
        {/* Status box (left) */}
        <div className="w-64">
          <GameStatus
            status={gameState.lastAction}
            currentTurn={gameState.currentTurn}
            phase={gameState.phase}
          />
        </div>

        {/* Deck + Pile (right) */}
        <div
          className="p-6 rounded-xl"
          style={{
            border: '2px solid rgba(212, 175, 55, 0.3)',
            backgroundColor: 'rgba(26, 83, 57, 0.3)',
            boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="flex gap-8 items-center">
            {/* Deck - invisible when empty to preserve layout */}
            <div className={gameState.deck.length === 0 ? 'invisible' : ''}>
              <CardPile
                cards={gameState.deck}
                label="Kortlek"
                faceDown
                onClick={isPlayerTurn ? onDrawCard : undefined}
              />
            </div>

            <CardPile
              cards={gameState.discardPile}
              label="Högen"
              onClick={isPlayerTurn ? onTakePile : undefined}
            />
          </div>
        </div>
      </div>

      {/* Player Area (bottom) */}
      <div className="mt-auto">
        <div
          className="text-lg font-bold mb-2 text-center"
          style={{ color: '#f0d46f', textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)' }}
        >
          🎮 Du
        </div>

        <div className="flex gap-4 items-start justify-center">
          {/* Player table cards */}
          <TableCards
            cardsDown={gameState.player.tableCardsDown}
            cardsUp={gameState.player.tableCardsUp}
            isPlayerTable
            onPlayCard={handlePlayTableCard}
            disabled={!isPlayerTurn}
            currentSource={playerCardSource}
          />

          <div>
            {/* Player hand */}
            <PlayerHand
              cards={gameState.player.hand}
              selectedCards={gameState.selectedCards}
              onSelect={onSelectCard}
              onDeselect={onDeselectCard}
              onPlaySingle={onPlaySingleCard}
              disabled={!isPlayerTurn}
              label="Hand"
            />

            {/* Sort button */}
            <div className="flex justify-center mt-2">
              <SortButton
                onClick={onSortHand}
                disabled={!isPlayerTurn || gameState.player.hand.length === 0}
                currentDirection={gameState.sortDirection}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <GameControls
          onPlayCards={onPlayCards}
          onTakePile={onTakePile}
          disabled={!isPlayerTurn}
          canPlay={gameState.selectedCards.length > 0}
        />
      </div>
    </div>
  );
}
