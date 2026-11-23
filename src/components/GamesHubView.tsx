import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gamepad2,
  BrainCircuit,
  Calculator,
  Flame,
  Coffee,
  Grid3X3,
  SpellCheck,
  Smile,
  Zap,
  Gauge,
} from 'lucide-react';
import { GameDifficulty } from '../data/gamesData';
import { QuizGame } from './games/QuizGame';
import { MemoryGame } from './games/MemoryGame';
import { SpeedMathGame } from './games/SpeedMathGame';
import { WordGuessGame } from './games/WordGuessGame';

type ActiveGameMode = 'quiz' | 'memoria' | 'calculo' | 'palavras';

interface GamesHubViewProps {
  onSuccessToast: (msg: string) => void;
}

const DIFFICULTY_OPTIONS: {
  id: GameDifficulty;
  label: string;
  shortDesc: Record<ActiveGameMode, string>;
  icon: React.ComponentType<{ className?: string }>;
  activeClass: string;
  badgeClass: string;
}[] = [
  {
    id: 'facil',
    label: 'Fácil',
    shortDesc: {
      quiz: 'Perguntas básicas • 2 ajudas 50:50',
      memoria: '4 pares (8 cartas) • Ritmo calmo',
      calculo: '40s • Soma e subtração simples',
      palavras: 'Palavras curtas • 8 vidas + 1ª letra',
    },
    icon: Smile,
    activeClass:
      'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20',
    badgeClass:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
  },
  {
    id: 'media',
    label: 'Média',
    shortDesc: {
      quiz: 'Nível intermediário • 1 ajuda 50:50',
      memoria: '6 pares (12 cartas) • Equilibrado',
      calculo: '30s • Soma, subtração e tabuada',
      palavras: 'Palavras médias • 6 vidas',
    },
    icon: Zap,
    activeClass:
      'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20',
    badgeClass:
      'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
  },
  {
    id: 'dificil',
    label: 'Difícil',
    shortDesc: {
      quiz: 'Desafios avançados • Sem ajuda • 2,5x pts',
      memoria: '8 pares (16 cartas) • Memória rápida',
      calculo: '25s • Inclui divisão • 2,4x pts',
      palavras: 'Termos complexos • 4 vidas • 2,5x pts',
    },
    icon: Flame,
    activeClass:
      'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/20',
    badgeClass:
      'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
  },
];

export const GamesHubView: React.FC<GamesHubViewProps> = ({ onSuccessToast }) => {
  const [activeGame, setActiveGame] = useState<ActiveGameMode>('quiz');
  const [difficulty, setDifficulty] = useState<GameDifficulty>('media');

  const gamesList = [
    {
      id: 'quiz' as ActiveGameMode,
      title: 'Show do Saber',
      subtitle: 'Trivia & Perguntas Escolares',
      desc: 'Desafie seus conhecimentos em Matemática, Ciências, História, Geografia e Português.',
      icon: BrainCircuit,
      color: 'from-emerald-600 to-green-600',
      badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
      tag: 'Conhecimento',
    },
    {
      id: 'memoria' as ActiveGameMode,
      title: 'Memória Escolar',
      subtitle: 'Jogo dos Pares',
      desc: 'Encontre os pares de materiais escolares, laboratório e ciências no menor tempo possível.',
      icon: Grid3X3,
      color: 'from-teal-600 to-emerald-600',
      badgeBg: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300',
      tag: 'Concentração',
    },
    {
      id: 'calculo' as ActiveGameMode,
      title: 'Cálculo Relâmpago',
      subtitle: 'Sprint Matemático',
      desc: 'Acerte o máximo de contas mentais antes do cronômetro zerar com combos de pontuação.',
      icon: Calculator,
      color: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
      tag: 'Agilidade',
    },
    {
      id: 'palavras' as ActiveGameMode,
      title: 'Palavra Secreta',
      subtitle: 'Forca Educativa & Vocabulário',
      desc: 'Descubra termos científicos, conceitos literários e geográficos com dicas pedagógicas.',
      icon: SpellCheck,
      color: 'from-green-600 to-lime-600',
      badgeBg: 'bg-lime-100 text-lime-800 dark:bg-lime-950/60 dark:text-lime-300',
      tag: 'Vocabulário',
    },
  ];

  const activeDiffInfo =
    DIFFICULTY_OPTIONS.find((d) => d.id === difficulty) || DIFFICULTY_OPTIONS[1];

  return (
    <div className="space-y-6" id="games-hub-view">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-700 via-teal-600 to-green-600 text-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-emerald-500/15 relative overflow-hidden">
        {/* Glow & Decorative Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-lime-300/15 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
              <Gamepad2 className="w-3.5 h-3.5 text-lime-200" />
              <span>Hora do Recreio & Jogos Educativos</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs bg-black/20 backdrop-blur-md px-3 py-1 rounded-full font-medium text-emerald-100">
              <Coffee className="w-3.5 h-3.5 text-amber-300" />
              <span>Pausa Divertida & Treino Cerebral</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white mb-2">
            Espaço de Jogos & Desafios
          </h2>
          <p className="text-sm text-emerald-50/90 max-w-xl leading-relaxed">
            Relaxe entre os períodos de aula, escolha a dificuldade ideal (Fácil, Média ou Difícil) e teste suas habilidades!
          </p>
        </div>
      </div>

      {/* Game Selection Cards / Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {gamesList.map((g) => {
          const Icon = g.icon;
          const isSelected = activeGame === g.id;

          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setActiveGame(g.id)}
              className={`p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden border ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 border-2 border-emerald-600 dark:border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${g.color} text-white shadow-xs`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${g.badgeBg}`}>
                    {g.tag}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 font-display">
                    {g.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {g.subtitle}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="mt-3 pt-2 border-t border-emerald-100 dark:border-emerald-950 flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                  Jogando Agora
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Global Difficulty Selector Bar for Jogos & Recreio */}
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
        id="games-difficulty-selector"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200/60 dark:border-emerald-900/50">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Escolha a Dificuldade
              </span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${activeDiffInfo.badgeClass}`}>
                {activeDiffInfo.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {activeDiffInfo.shortDesc[activeGame]}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:w-auto">
          {DIFFICULTY_OPTIONS.map((opt) => {
            const DiffIcon = opt.icon;
            const isActive = difficulty === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setDifficulty(opt.id)}
                className={`px-3.5 py-2.5 rounded-2xl border text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                  isActive
                    ? opt.activeClass
                    : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <DiffIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Game Workspace */}
      <div className="pt-1">
        <AnimatePresence mode="wait">
          {activeGame === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <QuizGame difficulty={difficulty} onSuccessToast={onSuccessToast} />
            </motion.div>
          )}

          {activeGame === 'memoria' && (
            <motion.div
              key="memoria"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <MemoryGame difficulty={difficulty} onSuccessToast={onSuccessToast} />
            </motion.div>
          )}

          {activeGame === 'calculo' && (
            <motion.div
              key="calculo"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <SpeedMathGame difficulty={difficulty} onSuccessToast={onSuccessToast} />
            </motion.div>
          )}

          {activeGame === 'palavras' && (
            <motion.div
              key="palavras"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <WordGuessGame difficulty={difficulty} onSuccessToast={onSuccessToast} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

