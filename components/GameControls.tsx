'use client';

interface GameControlsProps {
  onPlayCards: () => void;
  onTakePile: () => void;
  disabled: boolean;
  canPlay: boolean; // true if cards are selected
}

export default function GameControls({
  onPlayCards,
  onTakePile,
  disabled,
  canPlay
}: GameControlsProps) {
  return (
    <div className="flex justify-center gap-3 mt-4">
      {/* Play cards button */}
      <button
        onClick={onPlayCards}
        disabled={disabled || !canPlay}
        className="px-6 py-3 rounded-lg font-bold transition-all active:scale-95"
        style={{
          backgroundColor: !disabled && canPlay ? '#d4af37' : '#6b7280',
          color: !disabled && canPlay ? '#0f3b29' : '#9ca3af',
          boxShadow: !disabled && canPlay ? '0 4px 15px rgba(212, 175, 55, 0.4)' : 'none',
          cursor: !disabled && canPlay ? 'pointer' : 'not-allowed',
          opacity: !disabled && canPlay ? 1 : 0.5,
          border: !disabled && canPlay ? '1px solid rgba(212, 175, 55, 0.5)' : 'none'
        }}
      >
        Spela kort
      </button>

      {/* Take pile button */}
      <button
        onClick={onTakePile}
        disabled={disabled}
        className="px-6 py-3 rounded-lg font-bold transition-all active:scale-95"
        style={{
          backgroundColor: !disabled ? 'rgba(239, 68, 68, 0.8)' : '#6b7280',
          color: !disabled ? '#fafaf9' : '#9ca3af',
          boxShadow: !disabled ? '0 4px 15px rgba(239, 68, 68, 0.3)' : 'none',
          cursor: !disabled ? 'pointer' : 'not-allowed',
          opacity: !disabled ? 1 : 0.5,
          border: !disabled ? '1px solid rgba(239, 68, 68, 0.5)' : 'none'
        }}
      >
        Ta högen
      </button>
    </div>
  );
}
