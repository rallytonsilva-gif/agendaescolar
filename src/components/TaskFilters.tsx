import React from 'react';
import { Search, Filter, CheckCircle2, Circle, ListFilter, X, BookOpen } from 'lucide-react';
import { FilterStatus } from '../types';

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: FilterStatus;
  onStatusFilterChange: (status: FilterStatus) => void;
  selectedSubject: string;
  onSubjectChange: (subj: string) => void;
  availableSubjects: string[];
  counts: {
    total: number;
    pending: number;
    completed: number;
  };
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  selectedSubject,
  onSubjectChange,
  availableSubjects,
  counts,
}) => {
  return (
    <div className="space-y-3.5 mb-5" id="task-filters-section">
      {/* Search & Subject Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por tarefa, lição ou matéria..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs transition"
            id="search-tasks-input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {availableSubjects.length > 0 && (
          <div className="sm:w-52">
            <select
              value={selectedSubject}
              onChange={(e) => onSubjectChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs cursor-pointer transition"
              id="subject-filter-select"
            >
              <option value="todas">Todas as matérias</option>
              {availableSubjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Status Filter Segmented Control */}
      <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800/80 pb-3 overflow-x-auto">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 dark:bg-slate-900/90 rounded-xl border border-slate-200/80 dark:border-slate-800 min-w-max">
          <button
            type="button"
            onClick={() => onStatusFilterChange('todas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              statusFilter === 'todas'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            id="filter-tab-todas"
          >
            <span>Todas</span>
            <span className="font-mono tabular-nums text-[11px] opacity-75">
              {counts.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onStatusFilterChange('pendentes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              statusFilter === 'pendentes'
                ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            id="filter-tab-pendentes"
          >
            <Circle className="w-3 h-3 stroke-[2.5] text-amber-500" />
            <span>Pendentes</span>
            <span className="font-mono tabular-nums text-[11px] opacity-75">
              {counts.pending}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onStatusFilterChange('concluidas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              statusFilter === 'concluidas'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            id="filter-tab-concluidas"
          >
            <CheckCircle2 className="w-3 h-3 stroke-[2.5] text-emerald-500" />
            <span>Concluídas</span>
            <span className="font-mono tabular-nums text-[11px] opacity-75">
              {counts.completed}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
