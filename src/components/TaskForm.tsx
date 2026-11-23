import React, { useState } from 'react';
import { PlusCircle, AlertCircle, Sparkles, BookOpen, Calendar, Tag, Flame, CalendarDays, Zap, Check } from 'lucide-react';
import { COMMON_SUBJECTS, formatISODateToDisplay, getBrasiliaWallDate } from '../utils/storage';

interface TaskFormProps {
  onAddTask: (title: string, subject: string, date: string, priority: 'alta' | 'media' | 'baixa') => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [isoDate, setIsoDate] = useState('');
  const [priority, setPriority] = useState<'alta' | 'media' | 'baixa'>('media');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || !isoDate.trim()) {
      setErrorMessage('Por favor, preencha o título, a matéria e a data de entrega!');
      return;
    }

    const formattedDate = formatISODateToDisplay(isoDate.trim());
    if (!formattedDate) {
      setErrorMessage('Data inválida selecionada!');
      return;
    }

    setErrorMessage(null);
    onAddTask(title.trim(), subject.trim(), formattedDate, priority);

    // Clear fields
    setTitle('');
    setSubject('');
    setIsoDate('');
    setPriority('media');
  };

  const setPresetDate = (daysAhead: number) => {
    const d = getBrasiliaWallDate();
    d.setDate(d.getDate() + daysAhead);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setIsoDate(`${y}-${m}-${day}`);
    setErrorMessage(null);
  };

  const getFormattedDatePreview = (iso: string) => {
    if (!iso) return null;
    const parts = iso.split('-');
    if (parts.length !== 3) return null;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const displayDate = getFormattedDatePreview(isoDate);

  return (
    <div
      className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200/80 dark:border-slate-800/90 mb-6 relative overflow-hidden"
      id="add-task-form-container"
    >
      {/* Top subtle highlight gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500" />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 font-display">
            <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </span>
            Novo Lembrete de Estudo
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cadastre lições de casa, trabalhos e prazos de entrega
          </p>
        </div>
      </div>

      {errorMessage && (
        <div
          className="mb-4 p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 text-xs sm:text-sm rounded-xl flex items-center gap-2.5 animate-shake"
          role="alert"
          id="form-error-alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" id="task-form">
        {/* Title Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="task-title-input">
            Descrição da Tarefa ou Atividade *
          </label>
          <input
            id="task-title-input"
            type="text"
            className="w-full px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition"
            placeholder="Ex: Trabalho de História sobre a Revolução Industrial"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
          />
        </div>

        {/* Subject and Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="task-subject-input">
              Matéria / Disciplina *
            </label>
            <input
              id="task-subject-input"
              type="text"
              className="w-full px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition"
              placeholder="Ex: Matemática, Biologia, Redação..."
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
            />

            {/* Quick subject pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {COMMON_SUBJECTS.slice(0, 6).map((subj) => (
                <button
                  type="button"
                  key={subj}
                  onClick={() => {
                    setSubject(subj);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold border transition-all cursor-pointer ${
                    subject.toLowerCase() === subj.toLowerCase()
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-slate-700'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5" htmlFor="task-date-input">
                <CalendarDays className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Data de Entrega / Prazo *
              </label>
              {displayDate && (
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-200/80 dark:border-emerald-800/80">
                  {displayDate}
                </span>
              )}
            </div>

            <input
              id="task-date-input"
              type="date"
              className="w-full px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition cursor-pointer font-medium"
              value={isoDate}
              onChange={(e) => {
                setIsoDate(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
            />

            {/* Quick date shortcuts */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <button
                type="button"
                onClick={() => setPresetDate(0)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-slate-700 font-semibold transition cursor-pointer"
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => setPresetDate(1)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-slate-700 font-semibold transition cursor-pointer"
              >
                Amanhã
              </button>
              <button
                type="button"
                onClick={() => setPresetDate(7)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-slate-700 font-semibold transition cursor-pointer"
              >
                +7 dias
              </button>
              <button
                type="button"
                onClick={() => setPresetDate(14)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-slate-700 font-semibold transition cursor-pointer"
              >
                +14 dias
              </button>
            </div>
          </div>
        </div>

        {/* Priority & Submit Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Prioridade:</span>
            <div className="flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80">
              {(['baixa', 'media', 'alta'] as const).map((p) => {
                const isSelected = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`text-xs px-3 py-1 rounded-lg capitalize font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? p === 'alta'
                          ? 'bg-rose-500 text-white shadow-xs'
                          : p === 'media'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected
                          ? 'bg-white'
                          : p === 'alta'
                          ? 'bg-rose-500'
                          : p === 'media'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            id="add-task-submit-btn"
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            Salvar Lembrete
          </button>
        </div>
      </form>
    </div>
  );
};
