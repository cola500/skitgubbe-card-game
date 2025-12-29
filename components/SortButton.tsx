'use client';

interface SortButtonProps {
  onClick: () => void;
  disabled: boolean;
  currentDirection: 'asc' | 'desc';
}

export default function SortButton({ onClick, disabled, currentDirection }: SortButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95"
      style={{
        backgroundColor: !disabled ? 'rgba(212, 175, 55, 0.3)' : '#6b7280',
        color: !disabled ? '#f0d46f' : '#9ca3af',
        border: !disabled ? '1px solid rgba(212, 175, 55, 0.5)' : 'none',
        cursor: !disabled ? 'pointer' : 'not-allowed',
        opacity: !disabled ? 1 : 0.5,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.5)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.3)';
        }
      }}
    >
      {currentDirection === 'asc' ? '↑ Sortera (2→A)' : '↓ Sortera (A→2)'}
    </button>
  );
}
