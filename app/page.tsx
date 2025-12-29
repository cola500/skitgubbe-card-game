'use client';

import Link from 'next/link';
import { useState } from 'react';
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

export default function HomePage() {
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-700 via-green-800 to-green-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">🃏 Skitgubbe</h1>
          <p className="text-xl text-white/80">
            Ett klassiskt kortspel med en twist!
          </p>
        </div>

        {/* Menu buttons */}
        <div className="flex flex-col gap-4 max-w-md mx-auto">
          <Link
            href="/game"
            className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 font-bold text-xl transition-all shadow-lg text-center"
          >
            🎮 Spela nu!
          </Link>

          <button
            onClick={() => setShowRules(!showRules)}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 font-bold text-xl transition-all shadow-lg"
          >
            📖 Regler
          </button>
        </div>

        {/* Rules modal */}
        {showRules && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${playfair.variable} ${inter.variable}`}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
            onClick={() => setShowRules(false)}
          >
            <div
              className="relative max-w-2xl w-full max-h-[85vh] overflow-hidden rounded-2xl"
              style={{
                backgroundColor: '#0f3b29',
                backgroundImage: `
                  repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px),
                  repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px)
                `,
                border: '3px solid #b8932c',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(212, 175, 55, 0.1)',
                animation: 'modalEnter 0.3s ease-out'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Inner border */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  margin: '3px'
                }}
              />

              {/* Scrollable content */}
              <div className="overflow-y-auto max-h-[85vh] p-8 custom-scrollbar">
                {/* Header */}
                <div className="text-center mb-8 relative">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <span className="text-3xl text-[#d4af37]">♠</span>
                    <h2
                      className="font-playfair text-4xl font-bold tracking-tight"
                      style={{ color: '#fafaf9', textShadow: '0 2px 10px rgba(212, 175, 55, 0.3)' }}
                    >
                      Skitgubbe - Regler
                    </h2>
                    <span className="text-3xl text-[#d4af37]">♥</span>
                  </div>
                  <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50 rounded-full" />
                </div>

                {/* Section: Mål */}
                <section
                  className="mb-6 p-5 rounded-lg border-l-4"
                  style={{
                    backgroundColor: 'rgba(26, 83, 57, 0.5)',
                    borderLeftColor: '#d4af37'
                  }}
                >
                  <h3
                    className="font-playfair text-2xl font-semibold mb-3 flex items-center gap-2"
                    style={{ color: '#d4af37' }}
                  >
                    <span className="text-2xl">🎯</span>
                    Mål
                  </h3>
                  <p className="font-inter text-lg leading-relaxed" style={{ color: '#e7e5e4' }}>
                    Bli av med alla dina kort genom att spela dem på högen.
                  </p>
                </section>

                {/* Section: Grundregler */}
                <section
                  className="mb-6 p-5 rounded-lg border-l-4"
                  style={{
                    backgroundColor: 'rgba(26, 83, 57, 0.5)',
                    borderLeftColor: '#d4af37'
                  }}
                >
                  <h3
                    className="font-playfair text-2xl font-semibold mb-3 flex items-center gap-2"
                    style={{ color: '#d4af37' }}
                  >
                    <span className="text-2xl">📋</span>
                    Grundregler
                  </h3>
                  <ul className="font-inter text-lg space-y-3" style={{ color: '#e7e5e4' }}>
                    <li className="flex items-start gap-3">
                      <span className="text-[#d4af37] mt-1">♦</span>
                      <span>Spela kort som är <strong className="text-[#f0d46f]">lika eller högre</strong> än översta kortet på högen</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#d4af37] mt-1">♦</span>
                      <span>Du har alltid <strong className="text-[#f0d46f]">3 kort i handen</strong> (fyller på från kortleken)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#d4af37] mt-1">♦</span>
                      <span>Du har <strong className="text-[#f0d46f]">3 synliga</strong> och <strong className="text-[#f0d46f]">3 dolda bordskort</strong> (spelas efter handen är slut)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#d4af37] mt-1">♦</span>
                      <span>Kan du inte spela → <strong className="text-[#f0d46f]">ta upp hela högen</strong></span>
                    </li>
                  </ul>
                </section>

                {/* Card suit divider */}
                <div className="flex items-center justify-center gap-4 my-6 opacity-30">
                  <span className="text-[#d4af37]">♠</span>
                  <span className="text-[#d4af37]">♥</span>
                  <span className="text-[#d4af37]">♦</span>
                  <span className="text-[#d4af37]">♣</span>
                </div>

                {/* Section: Specialkort */}
                <section
                  className="mb-6 p-5 rounded-lg border-l-4"
                  style={{
                    backgroundColor: 'rgba(26, 83, 57, 0.5)',
                    borderLeftColor: '#d4af37'
                  }}
                >
                  <h3
                    className="font-playfair text-2xl font-semibold mb-4 flex items-center gap-2"
                    style={{ color: '#d4af37' }}
                  >
                    <span className="text-2xl">✨</span>
                    Specialkort
                  </h3>
                  <ul className="font-inter text-lg space-y-4" style={{ color: '#e7e5e4' }}>
                    <li
                      className="p-3 rounded-lg border-l-2"
                      style={{
                        backgroundColor: 'rgba(212, 175, 55, 0.08)',
                        borderLeftColor: '#d4af37'
                      }}
                    >
                      <strong className="text-[#f0d46f]">2:</strong> Reset-kort - Kan spelas på allt. Nästa kort kan vara vad som helst.
                    </li>
                    <li
                      className="p-3 rounded-lg border-l-2"
                      style={{
                        backgroundColor: 'rgba(212, 175, 55, 0.08)',
                        borderLeftColor: '#d4af37'
                      }}
                    >
                      <strong className="text-[#f0d46f]">5:</strong> Reverse-kort - Kan spelas på allt. Nästa kort måste vara ≤5.
                    </li>
                    <li
                      className="p-3 rounded-lg border-l-2"
                      style={{
                        backgroundColor: 'rgba(212, 175, 55, 0.08)',
                        borderLeftColor: '#d4af37'
                      }}
                    >
                      <strong className="text-[#f0d46f]">10:</strong> Brännkort - Kan spelas på allt och bränner högen. Du får spela igen.
                    </li>
                    <li
                      className="p-3 rounded-lg border-l-2"
                      style={{
                        backgroundColor: 'rgba(212, 175, 55, 0.08)',
                        borderLeftColor: '#d4af37'
                      }}
                    >
                      <strong className="text-[#f0d46f]">Ess:</strong> Högsta kortet.
                    </li>
                    <li
                      className="p-3 rounded-lg border-l-2"
                      style={{
                        backgroundColor: 'rgba(212, 175, 55, 0.08)',
                        borderLeftColor: '#d4af37'
                      }}
                    >
                      <strong className="text-[#f0d46f]">4 samma valör:</strong> Om 4 kort med samma valör hamnar överst → högen bränns automatiskt!
                    </li>
                  </ul>
                </section>

                {/* Section: Viktigt (Warning) */}
                <section
                  className="mb-8 p-6 rounded-lg border-2"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    borderColor: '#ef4444'
                  }}
                >
                  <h3
                    className="font-playfair text-2xl font-bold mb-3 flex items-center gap-2"
                    style={{ color: '#fca5a5' }}
                  >
                    <span className="text-2xl">⚠️</span>
                    Viktigt!
                  </h3>
                  <p
                    className="font-inter text-lg font-semibold mb-3"
                    style={{ color: '#fca5a5' }}
                  >
                    Du kan INTE vinna på ett specialkort (2, 5, 10, Ess)!
                  </p>
                  <p className="font-inter text-base leading-relaxed" style={{ color: '#fecaca' }}>
                    Sista kortet du spelar måste vara ett vanligt kort (3, 4, 6, 7, 8, 9, J, Q, K).
                    Om du bara har specialkort kvar måste du ta upp högen.
                  </p>
                </section>

                {/* Close button */}
                <button
                  onClick={() => setShowRules(false)}
                  className="w-full py-4 rounded-lg font-inter font-semibold text-lg transition-all duration-200 active:scale-95"
                  style={{
                    backgroundColor: '#d4af37',
                    color: '#0f3b29',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0d46f';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#d4af37';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.4)';
                  }}
                >
                  Stäng och börja spela! 🃏
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-white/60 text-sm">
          <p>Experiment 011 - Skitgubbe Card Game</p>
          <p>Bygg med Next.js, TypeScript & Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}
