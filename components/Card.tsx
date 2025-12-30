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
        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center">
          <div className="text-white/30 text-2xl font-bold">?</div>
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
