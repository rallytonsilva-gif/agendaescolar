import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  CheckSquare,
  CalendarDays,
  Clock,
  Utensils,
  Gamepad2,
  RotateCcw,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Sun,
  Moon,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { MainViewTab, UserRole, ThemeMode } from '../types';
import { formatBrasiliaFullDate, getBrasiliaNowParts } from '../utils/storage';

interface HeaderProps {
  totalTasks: number;
  totalEvents: number;
  activeTab: MainViewTab;
  userRole: UserRole;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onTabChange: (tab: MainViewTab) => void;
  onResetToDefaults: () => void;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalTasks,
  totalEvents,
  activeTab,
  userRole,
  theme,
  onToggleTheme,
  onTabChange,
  onResetToDefaults,
  onOpenAuthModal,
}) => {
  const [brasiliaNow, setBrasiliaNow] = useState(() => ({
    dateText: formatBrasiliaFullDate(),
    timeText: getBrasiliaNowParts().fullTimeStr,
  }));

  useEffect(() => {
    const tick = () => {
      setBrasiliaNow({
        dateText: formatBrasiliaFullDate(),
        timeText: getBrasiliaNowParts().fullTimeStr,
      });
    };
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const isCoordinator = userRole === 'coordenador';
  const isDark = theme === 'dark';
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="mb-7" id="app-header">
      {/* Top Branding Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/60 dark:border-slate-800/80 shadow-lg">
        <div>
          <div className="flex items-center gap-3.5">
            {!logoError ? (
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-sm border transition-all duration-300 ${
                  isCoordinator
                    ? 'border-teal-400 ring-2 ring-teal-500/30'
                    : 'border-emerald-200/90 dark:border-emerald-900/60'
                }`}
              >
                <img
                  src="/assets/aistudio/image_c009de54.png"
                  alt="Brasão do CETI Miguel Arcoverde"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                  className="w-full h-full object-contain select-none"
                />
              </div>
            ) : (
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 transition-all duration-300 ${
                  isCoordinator
                    ? 'bg-gradient-to-br from-teal-600 to-emerald-700 shadow-teal-500/25 ring-2 ring-teal-400/20'
                    : 'bg-gradient-to-br from-emerald-600 to-teal-600 shadow-emerald-500/20 ring-2 ring-emerald-400/15'
                }`}
              >
                {isCoordinator ? (
                  <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                ) : (
                  <BookOpen className="w-6 h-6 stroke-[2.2]" />
                )}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-400 font-display text-balance">
                  Agenda Escolar do CETI Miguel Arcoverde
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-1.5 gap-y-1 font-medium mt-0.5">
                <span className="inline-flex items-center gap-1.5 capitalize">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{capitalize(brasiliaNow.dateText)}</span>
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span
                  className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 tabular-nums"
                  title="Horário Oficial de Brasília (UTC-3)"
                >
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{brasiliaNow.timeText}</span>
                  <span className="text-[11px] font-semibold text-emerald-600/80 dark:text-emerald-400/80">
                    (Brasília)
                  </span>
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-slate-400 dark:text-slate-500 lowercase">8 aulas diárias</span>
              </p>
            </div>
          </div>
        </div>

        {/* User Role Switcher & Actions */}
        <div className="flex items-center flex-wrap gap-2 self-start sm:self-auto">
          {/* Dark Mode Toggle Button (Modo Ninja) */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
            id="theme-toggle-btn"
            title={isDark ? 'Alternar para Modo Claro' : 'Alternar para Modo Ninja'}
            aria-label={isDark ? 'Alternar para Modo Claro' : 'Alternar para Modo Ninja'}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 shrink-0 animate-spin-slow" />
                <span className="font-medium text-amber-300">Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300 shrink-0" />
                <span className="font-medium text-slate-700 dark:text-slate-200">Modo Ninja</span>
              </>
            )}
          </button>

          {/* Role Switcher Pill */}
          <button
            type="button"
            onClick={onOpenAuthModal}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs border active:scale-95 ${
              isCoordinator
                ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800 hover:bg-teal-100/80'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
            id="user-role-badge-btn"
            title="Clique para alternar perfil (Aluno / Coordenador)"
          >
            {isCoordinator ? (
              <>
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Coordenação</span>
                <span className="w-2 h-2 rounded-full bg-teal-500" />
              </>
            ) : (
              <>
                <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Perfil Aluno</span>
              </>
            )}
          </button>

          {/* Reset Demo Data Button - Apenas Coordenador pode restaurar os dados */}
          {isCoordinator && (
            <button
              onClick={onResetToDefaults}
              type="button"
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              title="Restaurar dados padrão da escola (Exclusivo Coordenação)"
              id="reset-examples-btn"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Restaurar</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation View Tabs - Modern Segmented Control */}
      <div className="pt-4 overflow-x-auto pb-1" id="main-navigation-tabs">
        <div className="flex items-center gap-1.5 p-1.5 bg-white/85 dark:bg-slate-900/90 rounded-2xl border border-white/60 dark:border-slate-800/80 backdrop-blur-md shadow-md min-w-max">
          <button
            type="button"
            onClick={() => onTabChange('tarefas')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'tarefas'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-200/70 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40'
            }`}
            id="tab-btn-tarefas"
          >
            <CheckSquare className="w-4 h-4 stroke-[2.2]" />
            <span>Tarefas & Lições</span>
            <span
              className={`px-1.5 py-0.2 rounded-md text-[11px] font-mono tabular-nums ${
                activeTab === 'tarefas'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {totalTasks}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('horarios')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'horarios'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-200/70 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40'
            }`}
            id="tab-btn-horarios"
          >
            <Clock className="w-4 h-4 stroke-[2.2]" />
            <span>Horários (8 Aulas)</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('eventos')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'eventos'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-200/70 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40'
            }`}
            id="tab-btn-eventos"
          >
            <Calendar className="w-4 h-4 stroke-[2.2]" />
            <span>Eventos & Provas</span>
            <span
              className={`px-1.5 py-0.2 rounded-md text-[11px] font-mono tabular-nums ${
                activeTab === 'eventos'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {totalEvents}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('calendario')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'calendario'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-200/70 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40'
            }`}
            id="tab-btn-calendario"
          >
            <CalendarDays className="w-4 h-4 stroke-[2.2]" />
            <span>Calendário Mensal</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('merenda')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'merenda'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40'
            }`}
            id="tab-btn-merenda"
          >
            <Utensils className="w-4 h-4 stroke-[2.2]" />
            <span>Cardápio PNAE</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('jogos')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'jogos'
                ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-400 shadow-sm border border-teal-200/70 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40'
            }`}
            id="tab-btn-jogos"
          >
            <Gamepad2 className="w-4 h-4 stroke-[2.2]" />
            <span>Jogos & Recreio</span>
          </button>

          {isCoordinator && (
            <button
              type="button"
              onClick={() => onTabChange('coordenacao')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                activeTab === 'coordenacao'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                  : 'text-teal-700 dark:text-teal-400 hover:bg-teal-100/50 dark:hover:bg-teal-950/50'
              }`}
              id="tab-btn-coordenacao"
            >
              <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
              <span>Painel Coordenação</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
