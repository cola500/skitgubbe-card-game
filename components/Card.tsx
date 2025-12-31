'use client';

import { motion } from 'framer-motion';
import type { Card as CardType } from '@/lib/types';
import { getSuitEmoji, getSuitColor } from '@/lib/game/cards';
import { cardVariants, ANIMATION_DURATION, EASING } from '@/lib/animations';

interface CardProps {
  card?: CardType;
  faceDown?: boolean;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  small?: boolean;
}

export default function Card({ card, faceDown = false, selected = false, onClick, disabled = false, small = false }: CardProps) {
  const sizeClasses = small
    ? 'w-10 h-14 text-xs'
    : 'w-14 h-20 sm:w-16 sm:h-24';

  const cardClasses = `
    relative ${sizeClasses} rounded-lg border-2 shadow-md
    transition-all duration-200
    ${selected ? 'border-blue-500 -translate-y-2 ring-2 ring-blue-400' : 'border-gray-300'}
    ${onClick && !disabled ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-95' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  if (faceDown || !card) {
    return (
      <motion.div
        initial={cardVariants.initial}
        animate={cardVariants.animate}
        exit={cardVariants.exit}
        transition={{ duration: ANIMATION_DURATION.normal, ease: EASING.custom }}
        className={cardClasses}
        onClick={!disabled ? onClick : undefined}
      >
        <div className="w-full h-full bg-gradient-to-br from-red-700 via-red-800 to-red-900 rounded-lg p-1.5 relative overflow-hidden">
          {/* Dekorativ ram */}
          <div className="absolute inset-2 border-2 border-yellow-400/40 rounded-md" />
          <div className="absolute inset-3 border border-yellow-400/20 rounded-sm" />

          {/* Hörn-ornament */}
          <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-yellow-400/50 rounded-tl" />
          <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-yellow-400/50 rounded-tr" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-yellow-400/50 rounded-bl" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-yellow-400/50 rounded-br" />

          {/* Centralt mönster */}
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Bakgrundsmönster - romber */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="grid grid-cols-3 gap-1">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-yellow-400 rotate-45" />
                ))}
              </div>
            </div>

            {/* Huvudsymbol - elegant kort-ikon */}
            <div className="relative">
              <div className="text-yellow-400/70 text-3xl sm:text-4xl font-bold">
                <svg className="w-6 h-8 sm:w-8 sm:h-10" viewBox="0 0 24 32" fill="currentColor">
                  <rect x="2" y="2" width="20" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 10 L16 14 L12 18 L8 14 Z" fill="currentColor" opacity="0.6"/>
                  <circle cx="12" cy="24" r="2" fill="currentColor" opacity="0.6"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const suitEmoji = getSuitEmoji(card.suit);
  const color = getSuitColor(card.suit);
  const colorClass = color === 'red' ? 'text-red-600' : 'text-black';

  const isSpecial = card.isSpecial;

  return (
    <motion.div
      initial={cardVariants.initial}
      animate={cardVariants.animate}
      exit={cardVariants.exit}
      transition={{ duration: ANIMATION_DURATION.normal, ease: EASING.custom }}
      className={cardClasses}
      onClick={!disabled ? onClick : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && !disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className={`w-full h-full bg-white rounded-lg p-0.5 sm:p-1 flex flex-col justify-between overflow-hidden ${isSpecial ? 'ring-2 ring-yellow-400/50' : ''}`}>
        {/* Top left corner */}
        <div className={`text-sm sm:text-lg font-bold ${colorClass} leading-tight`}>
          <div>{card.rank}</div>
          <div className="text-base sm:text-xl">{suitEmoji}</div>
        </div>

        {/* Center */}
        <div className={`text-2xl sm:text-4xl text-center ${colorClass}`}>
          {suitEmoji}
        </div>

        {/* Bottom right corner (rotated) */}
        <div className={`text-sm sm:text-lg font-bold ${colorClass} text-right leading-tight`}>
          <div className="text-base sm:text-xl">{suitEmoji}</div>
          <div>{card.rank}</div>
        </div>
      </div>
    </motion.div>
  );
}
