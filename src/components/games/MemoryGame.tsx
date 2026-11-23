import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  GraduationCap,
  Atom,
  Compass,
  Globe,
  Palette,
  Calculator,
  Music,
  RotateCcw,
  Trophy,
  Timer,
  Sparkles,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MEMORY_ITEMS, GameDifficulty } from '../../data/gamesData';

interface CardItem {
  id: number;
  iconName: string;
  label: string;
  color: string;
  bgLight: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  difficulty: GameDifficulty;
  onSuccessToast: (msg: string) => void;
}

const MEMORY_DIFFICULTY_CONFIG: Record<
  GameDifficulty,
  {
    label: string;
    pairCount: number;
    flipBackMs: number;
    gridColsClass: string;
    badgeClass: string;
  }
> = {
  facil: {
    label: 'Fácil',
    pairCount: 4,
    flipBackMs: 1100,
    gridColsClass: 'grid-cols-2 sm:grid-cols-4',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
  },
  media: {
    label: 'Média',
    pairCount: 6,
    flipBackMs: 850,
    gridColsClass: 'grid-cols-3 sm:grid-cols-4',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
  },
  dificil: {
    label: 'Difícil',
    pairCount: 8,
    flipBackMs: 500,
    gridColsClass: 'grid-cols-4',
    badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
  },
};

const renderCardIcon = (iconName: string, className: string) => {
  switch (iconName) {
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Atom':
      return <Atom className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'Calculator':
      return <Calculator className={className} />;
    case 'Music':
      return <Music className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};

export const MemoryGame: React.FC<MemoryGameProps> = ({ difficulty, onSuccessToast }) => {
  const config = MEMORY_DIFFICULTY_CONFIG[difficulty];
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isActiveTimer, setIsActiveTimer] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [bestMoves, setBestMoves] = useState<number>(0);
  const pendingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`escola_memory_best_${difficulty}`);
    setBestMoves(saved ? parseInt(saved, 10) : 0);
  }, [difficulty]);

  const initializeGame = useCallback(() => {
    if (pendingTimeoutRef.current) {
      clearTimeout(pendingTimeoutRef.current);
      pendingTimeoutRef.current = null;
    }

    const selectedItems = MEMORY_ITEMS.slice(0, config.pairCount);
    const duplicated = [...selectedItems, ...selectedItems];

    const shuffled: CardItem[] = duplicated
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        id: index,
        iconName: item.iconName,
        label: item.label,
        color: item.color,
        bgLight: item.bgLight,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setSeconds(0);
    setIsActiveTimer(false);
    setIsWon(false);
  }, [config.pairCount]);

  useEffect(() => {
    initializeGame();
    return () => {
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current);
      }
    };
  }, [initializeGame]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActiveTimer && !isWon) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActiveTimer, isWon]);

  const handleCardClick = (id: number) => {
    if (!isActiveTimer) setIsActiveTimer(true);

    if (flippedCards.length === 2) return;
    const card = cards[id];
    if (!card || card.isFlipped || card.isMatched) return;

    const updatedCards = cards.map((c) => (c.id === id ? { ...c, isFlipped: true } : c));
    setCards(updatedCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const nextMoves = moves + 1;
      setMoves(nextMoves);
      const [firstId, secondId] = newFlipped;
      const firstCard = updatedCards[firstId];
      const secondCard = updatedCards[secondId];

      if (firstCard.iconName === secondCard.iconName) {
        pendingTimeoutRef.current = setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true, isFlipped: true }
                : c
            )
          );
          setFlippedCards([]);

          const remainingUnmatched = updatedCards.filter(
            (c) => !c.isMatched && c.id !== firstId && c.id !== secondId
          );

          if (remainingUnmatched.length === 0) {
            setIsWon(true);
            setIsActiveTimer(false);
            if (bestMoves === 0 || nextMoves < bestMoves) {
              setBestMoves(nextMoves);
              localStorage.setItem(`escola_memory_best_${difficulty}`, String(nextMoves));
            }
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
            });
            onSuccessToast(`Parabéns! Todos os ${config.pairCount} pares encontrados no nível ${config.label}!`);
          }
        }, 420);
      } else {
        pendingTimeoutRef.current = setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
        }, config.flipBackMs);
      }
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-5" id="memory-game-container">
      {/* Top Metrics & Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className={`px-2.5 py-1 rounded-xl text-[11px] font-black uppercase ${config.badgeClass}`}>
            {config.label} • {config.pairCount} pares
          </span>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 text-xs font-bold">
            <Timer className="w-3.5 h-3.5 text-teal-600" />
            <span>Tempo: {formatTime(seconds)}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Jogadas: {moves}</span>
          </div>

          {bestMoves > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
              <Trophy className="w-3.5 h-3.5 text-emerald-600" />
              <span>Melhor ({config.label}): {bestMoves} jogadas</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={initializeGame}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reiniciar Jogo</span>
        </button>
      </div>

      {/* Victory Banner */}
      <AnimatePresence>
        {isWon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl p-6 shadow-lg shadow-emerald-500/20 text-center space-y-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto">
              <Trophy className="w-7 h-7 text-amber-300" />
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold font-display">
              Excelente Memória! ({config.label})
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto">
              Você encontrou todos os {config.pairCount} pares em <strong>{moves} jogadas</strong> e{' '}
              <strong>{formatTime(seconds)}</strong>!
            </p>
            <button
              type="button"
              onClick={initializeGame}
              className="mt-2 px-5 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs shadow-md transition hover:bg-emerald-50 cursor-pointer"
            >
              Jogar Outra Rodada
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards Grid */}
      <div className={`grid ${config.gridColsClass} gap-3 sm:gap-4`}>
        {cards.map((card) => {
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <motion.div
              key={card.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-2xl sm:rounded-3xl cursor-pointer flex flex-col items-center justify-center p-2 text-center transition-all duration-300 select-none shadow-xs ${
                card.isMatched
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 ring-2 ring-emerald-500/20'
                  : isRevealed
                  ? `${card.bgLight} border-2 border-teal-500 ring-2 ring-teal-500/20`
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 hover:shadow-md'
              }`}
            >
              {isRevealed ? (
                <motion.div
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center space-y-1.5"
                >
                  <div className={`p-2 sm:p-3 rounded-2xl ${card.color}`}>
                    {renderCardIcon(card.iconName, 'w-6 h-6 sm:w-8 sm:h-8')}
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[80px]">
                    {card.label}
                  </span>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

