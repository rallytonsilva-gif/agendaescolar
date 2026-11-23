import React from 'react';
import { Award, CheckCircle2, Clock, Sparkles, TrendingUp, Target } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsBannerProps {
  total: number;
  completed: number;
  pending: number;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  total,
  completed,
  pending,
}) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isAllCompleted = completed === total && total > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 text-white shadow-lg transition-all duration-300 mb-6 ${
        isAllCompleted
          ? 'bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 shadow-green-500/20'
          : 'bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 shadow-emerald-500/20'
      }`}
      id="stats-banner"
    >
      {/* Decorative ambient background circles */}
      <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
            {isAllCompleted ? 'Meta Acadêmica Atingida' : 'Progresso de Atividades'}
          </span>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
            {isAllCompleted
              ? 'Tudo concluído! Excelente rendimento.'
              : `${pending} ${pending === 1 ? 'tarefa pendente' : 'tarefas pendentes'}`}
          </h2>

          <p className="text-xs sm:text-sm text-white/80 mt-1 flex items-center gap-2">
            <span className="font-mono tabular-nums">{completed} de {total} atividades concluídas</span>
            <span className="inline-block w-1 h-1 rounded-full bg-white/40" />
            <span>{total - completed === 0 ? 'Agenda em dia' : `${total - completed} restantes`}</span>
          </p>
        </div>

        {/* Visual Progress & Quick Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 bg-black/15 backdrop-blur-md p-3.5 rounded-xl border border-white/15">
          <div className="flex items-center gap-3">
            {/* Circular / Ring Progress Indicator */}
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={isAllCompleted ? 'text-amber-300' : 'text-lime-300'}
                  strokeDasharray={`${percentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-bold">{percentage}%</span>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs border-l border-white/20 pl-3">
              <div>
                <span className="text-[10px] text-white/70 block uppercase font-medium">Concluídas</span>
                <span className="text-sm font-bold text-lime-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {completed}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-white/70 block uppercase font-medium">Pendentes</span>
                <span className="text-sm font-bold text-amber-200 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {pending}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Progress Bar Bar at bottom */}
      <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden mt-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            isAllCompleted ? 'bg-amber-300' : 'bg-lime-300'
          }`}
        />
      </div>
    </motion.div>
  );
};
