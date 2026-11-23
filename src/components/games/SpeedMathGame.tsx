import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  Calculator,
  Flame,
  Timer,
  Sparkles,
  Play,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameDifficulty } from '../../data/gamesData';

interface SpeedMathGameProps {
  difficulty: GameDifficulty;
  onSuccessToast: (msg: string) => void;
}

interface MathProblem {
  num1: number;
  num2: number;
  op: '+' | '-' | '×' | '÷';
  correctAnswer: number;
  options: number[];
}

const MATH_DIFFICULTY_CONFIG: Record<
  GameDifficulty,
  {
    label: string;
    durationSec: number;
    basePoints: number;
    streakBonus: number;
    description: string;
    badgeClass: string;
  }
> = {
  facil: {
    label: 'Fácil',
    durationSec: 40,
    basePoints: 50,
    streakBonus: 10,
    description: '40 segundos com adições e subtrações simples para aquecer a mente.',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
  },
  media: {
    label: 'Média',
    durationSec: 30,
    basePoints: 75,
    streakBonus: 15,
    description: '30 segundos com soma, subtração e multiplicação (tabuada).',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
  },
  dificil: {
    label: 'Difícil',
    durationSec: 25,
    basePoints: 120,
    streakBonus: 25,
    description: '25 segundos em ritmo turbo com números maiores, multiplicação e divisão exata!',
    badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
  },
};

export const SpeedMathGame: React.FC<SpeedMathGameProps> = ({ difficulty, onSuccessToast }) => {
  const config = MATH_DIFFICULTY_CONFIG[difficulty];
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(config.durationSec);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [isAnsweredStatus, setIsAnsweredStatus] = useState<'correct' | 'wrong' | null>(null);
  const [highScore, setHighScore] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem(`escola_speed_math_high_${difficulty}`);
    setHighScore(saved ? parseInt(saved, 10) : 0);
    // Reset active game cleanly when switching difficulty
    setIsPlaying(false);
    setTimeLeft(MATH_DIFFICULTY_CONFIG[difficulty].durationSec);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setIsAnsweredStatus(null);
    setCurrentProblem(null);
  }, [difficulty]);

  const generateProblem = useCallback((): MathProblem => {
    const ops: ('+' | '-' | '×' | '÷')[] =
      difficulty === 'facil'
        ? ['+', '-']
        : difficulty === 'media'
        ? ['+', '-', '×']
        : ['+', '-', '×', '÷'];

    const op = ops[Math.floor(Math.random() * ops.length)];
    let num1 = 0;
    let num2 = 0;
    let correctAnswer = 0;

    if (op === '+') {
      const maxVal = difficulty === 'facil' ? 20 : difficulty === 'media' ? 35 : 85;
      const minVal = difficulty === 'dificil' ? 15 : 2;
      num1 = Math.floor(Math.random() * maxVal) + minVal;
      num2 = Math.floor(Math.random() * maxVal) + minVal;
      correctAnswer = num1 + num2;
    } else if (op === '-') {
      const maxVal = difficulty === 'facil' ? 20 : difficulty === 'media' ? 40 : 95;
      num1 = Math.floor(Math.random() * maxVal) + 10;
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
      correctAnswer = num1 - num2;
    } else if (op === '×') {
      if (difficulty === 'media') {
        num1 = Math.floor(Math.random() * 8) + 2;
        num2 = Math.floor(Math.random() * 8) + 2;
      } else {
        num1 = Math.floor(Math.random() * 12) + 4;
        num2 = Math.floor(Math.random() * 11) + 3;
      }
      correctAnswer = num1 * num2;
    } else {
      // Exact division for Difícil
      num2 = Math.floor(Math.random() * 11) + 2;
      correctAnswer = Math.floor(Math.random() * 14) + 2;
      num1 = num2 * correctAnswer;
    }

    // Generate 3 wrong options
    const maxDelta = difficulty === 'dificil' ? 5 : 8;
    const optionsSet = new Set<number>([correctAnswer]);
    while (optionsSet.size < 4) {
      const delta = (Math.floor(Math.random() * maxDelta) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const wrong = correctAnswer + delta;
      if (wrong >= 0) optionsSet.add(wrong);
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    return { num1, num2, op, correctAnswer, options };
  }, [difficulty]);

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(config.durationSec);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setIsAnsweredStatus(null);
    setCurrentProblem(generateProblem());
  };

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem(`escola_speed_math_high_${difficulty}`, String(score));
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
        onSuccessToast(`Novo recorde (${config.label}) no Cálculo Relâmpago: ${score} pontos!`);
      } else {
        onSuccessToast(`Tempo esgotado! Você fez ${score} pontos no nível ${config.label}.`);
      }
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, timeLeft, score, highScore, difficulty, config.label, onSuccessToast]);

  const handleSelectOption = (chosen: number) => {
    if (!isPlaying || !currentProblem) return;

    if (chosen === currentProblem.correctAnswer) {
      setIsAnsweredStatus('correct');
      const bonus = streak * config.streakBonus;
      const points = config.basePoints + bonus;
      setScore((prev) => prev + points);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      setTimeout(() => {
        setIsAnsweredStatus(null);
        setCurrentProblem(generateProblem());
      }, 150);
    } else {
      setIsAnsweredStatus('wrong');
      setStreak(0);
      setTimeout(() => {
        setIsAnsweredStatus(null);
        setCurrentProblem(generateProblem());
      }, 300);
    }
  };

  return (
    <div className="space-y-5" id="speed-math-container">
      {/* Metrics Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className={`px-2.5 py-1 rounded-xl text-[11px] font-black uppercase ${config.badgeClass}`}>
            {config.label}
          </span>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${
              timeLeft <= 5 && isPlaying
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Tempo: {timeLeft}s</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{score} pts</span>
          </div>

          {streak > 1 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-xs font-black animate-bounce">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Combo {streak}x</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {highScore > 0 && (
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Recorde ({config.label}): <strong>{highScore} pts</strong>
            </span>
          )}
        </div>
      </div>

      {!isPlaying ? (
        /* Welcome / Game Over Banner */
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-5"
        >
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center mx-auto border border-amber-200/60 dark:border-amber-900/60">
            <Calculator className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
              Cálculo Relâmpago ({config.durationSec} Segundos • {config.label})
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              {config.description} Acertos em sequência geram bônus multiplicadores!
            </p>
          </div>

          {score > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 max-w-xs mx-auto text-center space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase">Última Pontuação</span>
              <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {score} pontos
              </span>
              <span className="text-[11px] text-slate-400">
                Maior sequência: {maxStreak} acertos
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={startGame}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md shadow-emerald-500/20 transition flex items-center gap-2 mx-auto cursor-pointer active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>
              {score > 0 ? 'Jogar Novamente' : `Iniciar Desafio (${config.durationSec}s)`}
            </span>
          </button>
        </motion.div>
      ) : (
        /* Live Problem Card */
        currentProblem && (
          <motion.div
            key={`${currentProblem.num1}-${currentProblem.op}-${currentProblem.num2}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border shadow-sm text-center space-y-6 transition-all ${
              isAnsweredStatus === 'correct'
                ? 'border-emerald-500 bg-emerald-50/20'
                : isAnsweredStatus === 'wrong'
                ? 'border-rose-500 bg-rose-50/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Qual é o resultado?
            </span>

            {/* Formula display */}
            <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 font-display tracking-tight py-2">
              {currentProblem.num1} {currentProblem.op} {currentProblem.num2} = ?
            </div>

            {/* 4 Choices Grid */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {currentProblem.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className="py-4 px-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xl font-black text-slate-800 dark:text-slate-100 transition shadow-xs cursor-pointer active:scale-95"
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )
      )}
    </div>
  );
};

