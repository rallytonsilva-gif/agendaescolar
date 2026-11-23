import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Lightbulb,
  Heart,
  HeartCrack,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WORD_GUESS_LIST, WordGuessItem, GameDifficulty } from '../../data/gamesData';

interface WordGuessGameProps {
  difficulty: GameDifficulty;
  onSuccessToast: (msg: string) => void;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const WORD_DIFFICULTY_MAP: Record<GameDifficulty, WordGuessItem['difficulty']> = {
  facil: 'fácil',
  media: 'médio',
  dificil: 'difícil',
};

const WORD_DIFFICULTY_CONFIG: Record<
  GameDifficulty,
  {
    label: string;
    maxMistakes: number;
    pointsPerWord: number;
    revealFirstLetter: boolean;
    badgeClass: string;
  }
> = {
  facil: {
    label: 'Fácil',
    maxMistakes: 8,
    pointsPerWord: 100,
    revealFirstLetter: true,
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
  },
  media: {
    label: 'Média',
    maxMistakes: 6,
    pointsPerWord: 150,
    revealFirstLetter: false,
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
  },
  dificil: {
    label: 'Difícil',
    maxMistakes: 4,
    pointsPerWord: 250,
    revealFirstLetter: false,
    badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
  },
};

export const WordGuessGame: React.FC<WordGuessGameProps> = ({ difficulty, onSuccessToast }) => {
  const config = WORD_DIFFICULTY_CONFIG[difficulty];
  const targetDiff = WORD_DIFFICULTY_MAP[difficulty];

  const [currentWordItem, setCurrentWordItem] = useState<WordGuessItem | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const startNewWord = useCallback(() => {
    const pool = WORD_GUESS_LIST.filter((item) => item.difficulty === targetDiff);
    const candidates = pool.length > 0 ? pool : WORD_GUESS_LIST;
    const filteredDiff =
      currentWordItem && candidates.length > 1
        ? candidates.filter((item) => item.word !== currentWordItem.word)
        : candidates;
    const random = filteredDiff[Math.floor(Math.random() * filteredDiff.length)];

    setCurrentWordItem(random);
    const initialGuesses = new Set<string>();
    if (config.revealFirstLetter && random.word.length > 0) {
      initialGuesses.add(random.word[0]);
    }
    setGuessedLetters(initialGuesses);
    setShowHint(difficulty === 'facil');
  }, [targetDiff, config.revealFirstLetter, difficulty, currentWordItem]);

  useEffect(() => {
    const pool = WORD_GUESS_LIST.filter((item) => item.difficulty === targetDiff);
    const candidates = pool.length > 0 ? pool : WORD_GUESS_LIST;
    const random = candidates[Math.floor(Math.random() * candidates.length)];
    setCurrentWordItem(random);
    const initialGuesses = new Set<string>();
    if (config.revealFirstLetter && random.word.length > 0) {
      initialGuesses.add(random.word[0]);
    }
    setGuessedLetters(initialGuesses);
    setShowHint(difficulty === 'facil');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const mistakes = useMemo(() => {
    if (!currentWordItem) return 0;
    const wordSet = new Set(currentWordItem.word.split(''));
    let count = 0;
    guessedLetters.forEach((letter) => {
      if (!wordSet.has(letter)) count++;
    });
    return count;
  }, [currentWordItem, guessedLetters]);

  const isWon = useMemo(() => {
    if (!currentWordItem) return false;
    return currentWordItem.word.split('').every((letter) => guessedLetters.has(letter));
  }, [currentWordItem, guessedLetters]);

  const isLost = mistakes >= config.maxMistakes;

  const handleGuess = (letter: string) => {
    if (isWon || isLost || guessedLetters.has(letter)) return;
    const next = new Set(guessedLetters);
    next.add(letter);
    setGuessedLetters(next);

    if (currentWordItem && currentWordItem.word.includes(letter)) {
      const completed = currentWordItem.word.split('').every((l) => next.has(l));
      if (completed) {
        setScore((prev) => prev + config.pointsPerWord);
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
        onSuccessToast(
          `Parabéns! Palavra descoberta (+${config.pointsPerWord} pts): ${currentWordItem.word}`
        );
      }
    }
  };

  if (!currentWordItem) return null;

  return (
    <div className="space-y-5" id="word-guess-container">
      {/* Top Bar: Subject Badge, Lives & Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className={`px-2.5 py-1 rounded-xl text-[11px] font-black uppercase ${config.badgeClass}`}>
            {config.label}
          </span>

          <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
            Disciplina: {currentWordItem.subject}
          </span>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{score} pts</span>
          </div>
        </div>

        {/* Remaining Lives */}
        <div className="flex items-center gap-1" title={`${config.maxMistakes - mistakes} vidas restantes`}>
          {Array.from({ length: config.maxMistakes }).map((_, i) => {
            const isLostLife = i < mistakes;
            return (
              <div key={i} className="transition-transform duration-200">
                {isLostLife ? (
                  <HeartCrack className="w-4 h-4 text-slate-300 dark:text-slate-700" />
                ) : (
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Guessing Arena */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6">
        {/* Hint button & Box */}
        <div>
          {!showHint ? (
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 hover:bg-amber-100 font-bold text-xs inline-flex items-center gap-1.5 transition cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>Ver Dica Pedagógica</span>
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/60 max-w-md mx-auto text-xs text-amber-900 dark:text-amber-200 font-medium"
            >
              <strong>💡 Dica:</strong> {currentWordItem.hint}
            </motion.div>
          )}
        </div>

        {/* Word Display (Secret Letters) */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 py-4">
          {currentWordItem.word.split('').map((letter, idx) => {
            const isRevealed = guessedLetters.has(letter) || isLost;
            return (
              <div
                key={idx}
                className={`w-8 h-11 sm:w-10 sm:h-13 rounded-2xl border-2 flex items-center justify-center text-lg sm:text-2xl font-black transition-all ${
                  isRevealed
                    ? isLost && !guessedLetters.has(letter)
                      ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-600'
                      : 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 shadow-xs'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-transparent'
                }`}
              >
                {isRevealed ? letter : '_'}
              </div>
            );
          })}
        </div>

        {/* Outcome alerts */}
        <AnimatePresence>
          {isWon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold space-y-2 max-w-sm mx-auto"
            >
              <div className="flex items-center justify-center gap-1.5 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Palavra Desvendada (+{config.pointsPerWord} pts)!</span>
              </div>
              <button
                type="button"
                onClick={startNewWord}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition cursor-pointer"
              >
                Próxima Palavra
              </button>
            </motion.div>
          )}

          {isLost && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-bold space-y-2 max-w-sm mx-auto"
            >
              <div className="flex items-center justify-center gap-1.5 text-sm">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>Que pena! A palavra era: {currentWordItem.word}</span>
              </div>
              <button
                type="button"
                onClick={startNewWord}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition cursor-pointer"
              >
                Tentar Outra Palavra
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* On-Screen Virtual Keyboard */}
        <div className="max-w-xl mx-auto space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {ALPHABET.map((letter) => {
              const isUsed = guessedLetters.has(letter);
              const isCorrectInWord = isUsed && currentWordItem.word.includes(letter);
              const isWrongInWord = isUsed && !currentWordItem.word.includes(letter);

              let btnStyle =
                'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/50';

              if (isCorrectInWord) {
                btnStyle = 'bg-emerald-600 text-white border-emerald-700 opacity-90';
              } else if (isWrongInWord) {
                btnStyle = 'bg-slate-200 dark:bg-slate-800/40 text-slate-400 border-transparent opacity-40';
              }

              return (
                <button
                  key={letter}
                  type="button"
                  disabled={isUsed || isWon || isLost}
                  onClick={() => handleGuess(letter)}
                  className={`w-8 h-9 sm:w-10 sm:h-11 rounded-xl border text-xs sm:text-sm font-extrabold transition cursor-pointer active:scale-95 ${btnStyle}`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

