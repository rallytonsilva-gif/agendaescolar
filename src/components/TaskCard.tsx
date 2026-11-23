import React from 'react';
import { Check, Trash2, Calendar, Tag, AlertCircle, Clock, Sparkles, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { Task, UserRole } from '../types';
import { getSubjectColor, getDaysUntil } from '../utils/storage';

interface TaskCardProps {
  task: Task;
  userRole?: UserRole;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  userRole = 'aluno',
  onToggle,
  onDelete,
}) => {
  const isCoordinator = userRole === 'coordenador';
  const subjectStyle = getSubjectColor(task.subject);
  const countdown = getDaysUntil(task.date);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2 }}
      className={`group relative rounded-2xl p-4 sm:p-5 border transition-all duration-200 shadow-xs flex items-start sm:items-center gap-4 ${
        task.done
          ? 'border-slate-200/60 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-900/40 opacity-70'
          : 'border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
      }`}
      id={`task-card-${task.id}`}
    >
      {/* Custom Animated Checkbox */}
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all duration-200 shrink-0 mt-0.5 sm:mt-0 cursor-pointer active:scale-90 ${
          task.done
            ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs shadow-emerald-500/30'
            : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-400 bg-white dark:bg-slate-800'
        }`}
        aria-label={task.done ? 'Marcar como pendente' : 'Marcar como concluída'}
        id={`toggle-task-${task.id}`}
      >
        {task.done && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </motion.div>
        )}
      </button>

      {/* Main Content Area */}
      <div
        className="flex-1 min-w-0 cursor-pointer select-none"
        onClick={() => onToggle(task.id)}
      >
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${subjectStyle.badgeBg}`}
          >
            {task.subject}
          </span>

          {task.priority && !task.done && (
            <span
              className={`text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md ${
                task.priority === 'alta'
                  ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  : task.priority === 'media'
                  ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              }`}
            >
              {task.priority}
            </span>
          )}

          {/* Date proximity badge */}
          {!task.done && countdown && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                countdown.isToday
                  ? 'bg-rose-500 text-white animate-pulse'
                  : countdown.isPast
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  : countdown.days <= 2
                  ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {countdown.label}
            </span>
          )}
        </div>

        <p
          className={`text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 transition-all break-words leading-snug ${
            task.done ? 'line-through text-slate-400 dark:text-slate-500 font-normal' : ''
          }`}
        >
          {task.title}
        </p>

        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Prazo: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{task.date}</strong></span>
          </span>
        </div>
      </div>

      {/* Action Button: Delete only for coordinator, lock icon for student */}
      {isCoordinator ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="w-8 h-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 flex items-center justify-center transition-all shrink-0 cursor-pointer active:scale-90"
          title="Excluir tarefa (Coordenação)"
          aria-label="Excluir tarefa"
          id={`delete-task-${task.id}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ) : (
        <div
          className="w-7 h-7 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 text-slate-400 flex items-center justify-center shrink-0 cursor-default"
          title="Tarefa oficial definida pela coordenação"
        >
          <Lock className="w-3.5 h-3.5" />
        </div>
      )}
    </motion.div>
  );
};
