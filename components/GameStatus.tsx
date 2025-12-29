'use client';

interface GameStatusProps {
  status: string;
  currentTurn: 'player' | 'ai';
  phase: 'setup' | 'playing' | 'finished';
}

export default function GameStatus({ status, currentTurn, phase }: GameStatusProps) {
  const isPlayerTurn = currentTurn === 'player' && phase === 'playing';

  return (
    <div
      className="rounded-lg p-4 text-center min-h-32"
      style={{
        backgroundColor: 'rgba(26, 83, 57, 0.6)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div
        className="text-lg font-bold mb-2"
        style={{
          color: isPlayerTurn ? '#f0d46f' : '#fafaf9',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
        }}
      >
        {phase === 'setup' && '🎴 Förbered dina kort'}
        {phase === 'playing' && (currentTurn === 'player' ? '🎮 Din tur!' : '🤖 Datorns tur...')}
        {phase === 'finished' && '🏁 Spelet är slut'}
      </div>
      <div style={{ color: '#e7e5e4', fontSize: '0.875rem' }}>
        {status}
      </div>
    </div>
  );
}
