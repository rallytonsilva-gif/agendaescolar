import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Zap,
  Flame,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS, QuizQuestion, GameDifficulty } from '../../data/gamesData';

interface QuizGameProps {
  difficulty: GameDifficulty;
  onSuccessToast: (msg: string) => void;
}

const DIFFICULTY_MAP: Record<GameDifficulty, QuizQuestion['difficulty']> = {
  facil: 'fácil',
  media: 'médio',
  dificil: 'difícil',
};

const DIFFICULTY_SETTINGS: Record<
  GameDifficulty,
  {
    label: string;
    maxFiftyFifty: number;
    basePoints: number;
    streakBonus: number;
    badgeClass: string;
  }
> = {
  facil: {
    label: 'Fácil',
    maxFiftyFifty: 2,
    basePoints: 100,
    streakBonus: 10,
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
  },
  media: {
    label: 'Média',
    maxFiftyFifty: 1,
    basePoints: 150,
    streakBonus: 15,
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
  },
  dificil: {
    label: 'Difícil',
    maxFiftyFifty: 0,
    basePoints: 250,
    streakBonus: 25,
    badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
  },
};

export const QuizGame: React.FC<QuizGameProps> = ({ difficulty, onSuccessToast }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [roundSize, setRoundSize] = useState<number>(10);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [fiftyFiftyRemaining, setFiftyFiftyRemaining] = useState<number>(
    DIFFICULTY_SETTINGS[difficulty].maxFiftyFifty
  );
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);

  const diffConfig = DIFFICULTY_SETTINGS[difficulty];
  const targetQuestionDifficulty = DIFFICULTY_MAP[difficulty];

  // Unique categories with counts
  const categories = useMemo(() => {
    const set = new Set<string>();
    QUIZ_QUESTIONS.forEach((q) => set.add(q.subject));
    return ['todos', ...Array.from(set)];
  }, []);

  const totalAvailableInCat = useMemo(() => {
    return QUIZ_QUESTIONS.filter((q) => {
      const matchesCat =
        selectedCategory === 'todos' ||
        q.subject.toLowerCase() === selectedCategory.toLowerCase();
      return matchesCat && q.difficulty === targetQuestionDifficulty;
    }).length;
  }, [selectedCategory, targetQuestionDifficulty]);

  const shuffleQuestions = useCallback(
    (category: string, count: number = roundSize) => {
      const pool = QUIZ_QUESTIONS.filter((q) => {
        const matchesCat =
          category === 'todos' || q.subject.toLowerCase() === category.toLowerCase();
        return matchesCat && q.difficulty === targetQuestionDifficulty;
      });
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      const limit = count === -1 ? shuffled.length : Math.min(count, shuffled.length);
      setQuestions(shuffled.slice(0, limit));
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setScore(0);
      setStreak(0);
      setMaxStreak(0);
      setIsGameOver(false);
      setFiftyFiftyRemaining(DIFFICULTY_SETTINGS[difficulty].maxFiftyFifty);
      setHiddenOptions([]);
    },
    [roundSize, targetQuestionDifficulty, difficulty]
  );

  useEffect(() => {
    shuffleQuestions(selectedCategory, roundSize);
  }, [selectedCategory, roundSize, difficulty, shuffleQuestions]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      const bonus = streak * diffConfig.streakBonus;
      const points = diffConfig.basePoints + bonus;
      setScore((prev) => prev + points);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setHiddenOptions([]);
    } else {
      setIsGameOver(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handleUseFiftyFifty = () => {
    if (fiftyFiftyRemaining <= 0 || isAnswered || !currentQ || hiddenOptions.length > 0) return;
    setFiftyFiftyRemaining((prev) => prev - 1);
    const incorrectIndices = currentQ.options
      .map((_, i) => i)
      .filter((i) => i !== currentQ.correctIndex);

    // Pick 2 random incorrect to hide
    const toHide = incorrectIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
    setHiddenOptions(toHide);
    onSuccessToast('Ajuda 50:50 aplicada! 2 alternativas incorretas removidas.');
  };

  if (!currentQ && !isGameOver) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
        <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
          Nenhuma pergunta cadastrada para essa combinação de matéria e dificuldade.
        </p>
        <button
          type="button"
          onClick={() => setSelectedCategory('todos')}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
        >
          Ver Todas as Matérias
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4" id="quiz-game-container">
      {/* Category and Round Size selectors */}
      <div className="bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
        {/* Discipline Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Matéria:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer capitalize ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'todos' ? 'Todas as Matérias' : cat}
            </button>
          ))}
        </div>

        {/* Round Size Options */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px]">
              Extensão da Partida:
            </span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {[
                { label: '5 Perguntas', val: 5 },
                { label: '10 Perguntas', val: 10 },
                { label: '15 Perguntas', val: 15 },
                { label: 'Todas', val: -1 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setRoundSize(opt.val)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                    roundSize === opt.val
                      ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-slate-500 dark:text-slate-400 font-medium text-[11px] flex items-center gap-2">
            <span>
              Banco ({diffConfig.label}):{' '}
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">
                {totalAvailableInCat}
              </strong>{' '}
              perguntas
            </span>
          </div>
        </div>
      </div>

      {isGameOver ? (
        /* Game Over Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center mx-auto shadow-inner border border-amber-200/60 dark:border-amber-900/60">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Quiz Finalizado • Nível {diffConfig.label}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
              Excelente Desempenho!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Você completou a rodada de perguntas do Show do Saber Escolar no modo{' '}
              <strong>{diffConfig.label}</strong>.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            <div className="bg-teal-50 dark:bg-teal-950/40 p-3 rounded-2xl border border-teal-100 dark:border-teal-900/50">
              <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase block">
                Pontuação
              </span>
              <span className="text-xl sm:text-2xl font-black text-teal-900 dark:text-teal-100">
                {score} pts
              </span>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-2xl border border-amber-100 dark:border-amber-900/50">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase block">
                Maior Combo
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-900 dark:text-amber-100 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-amber-500 inline" />
                {maxStreak}x
              </span>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">
                Questões
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-900 dark:text-emerald-100">
                {questions.length} / {questions.length}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => shuffleQuestions(selectedCategory)}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              Jogar Novamente
            </button>
          </div>
        </motion.div>
      ) : (
        /* Active Question Card */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          {/* Header Progress & Stats */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs">
                Questão {currentIndex + 1} de {questions.length}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">
                {currentQ.subject}
              </span>
              <span className={`px-2 py-0.5 rounded-lg text-[11px] font-black uppercase ${diffConfig.badgeClass}`}>
                {diffConfig.label}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              {streak > 1 && (
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-xl font-black animate-bounce">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Combo {streak}x!</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 font-black text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>{score} pts</span>
              </div>

              {fiftyFiftyRemaining > 0 && !isAnswered && hiddenOptions.length === 0 && (
                <button
                  type="button"
                  onClick={handleUseFiftyFifty}
                  className="px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 hover:bg-teal-100 font-bold flex items-center gap-1 transition cursor-pointer"
                  title="Eliminar 2 respostas erradas"
                >
                  <Zap className="w-3.5 h-3.5 text-teal-500" />
                  <span>Ajuda 50:50 ({fiftyFiftyRemaining})</span>
                </button>
              )}
            </div>
          </div>

          {/* Question Text */}
          <div className="py-2">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((option, idx) => {
              const isHidden = hiddenOptions.includes(idx);
              if (isHidden) {
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 opacity-30 select-none text-xs text-slate-400 flex items-center justify-center font-bold"
                  >
                    Alternativa eliminada
                  </div>
                );
              }

              let btnStyle =
                'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-400';

              if (isAnswered) {
                if (idx === currentQ.correctIndex) {
                  btnStyle =
                    'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20 font-bold';
                } else if (idx === selectedOption) {
                  btnStyle =
                    'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/20 font-bold';
                } else {
                  btnStyle = 'opacity-40 bg-slate-100 dark:bg-slate-800 border-transparent text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between gap-3 text-sm cursor-pointer ${btnStyle} ${
                    !isAnswered ? 'active:scale-98' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                        isAnswered && idx === currentQ.correctIndex
                          ? 'bg-white text-emerald-700'
                          : isAnswered && idx === selectedOption
                          ? 'bg-white text-rose-700'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-xs'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-semibold">{option}</span>
                  </div>

                  {isAnswered && idx === currentQ.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                    <XCircle className="w-5 h-5 text-white shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next Button (when answered) */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 bg-emerald-50/70 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 flex-1">
                  <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-900 dark:text-emerald-200 block">
                      Explicação Pedagógica:
                    </span>
                    <span>{currentQ.explanation}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition cursor-pointer self-stretch sm:self-auto shrink-0 active:scale-95"
                >
                  <span>
                    {currentIndex + 1 < questions.length ? 'Próxima Questão' : 'Ver Resultado'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

