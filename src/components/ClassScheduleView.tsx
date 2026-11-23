import React, { useState, useMemo, useEffect } from 'react';
import {
  Clock,
  BookOpen,
  Calendar,
  User,
  MapPin,
  Sparkles,
  Plus,
  Edit3,
  RotateCcw,
  Copy,
  Check,
  Coffee,
  Utensils,
  AlertCircle,
  FileCheck2,
  ListFilter,
  Grid3X3,
  CalendarDays,
  Bookmark,
  Share2,
  Gamepad2,
  Lock,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClassPeriod, DayOfWeek, GradeSeries, UserRole } from '../types';
import {
  DAYS_OF_WEEK,
  CLASS_PERIOD_SLOTS,
  GRADE_SERIES_OPTIONS,
  getGradeSeriesLabel,
  getCurrentDayOfWeek,
  getBrasiliaNowParts,
  getSubjectColor,
  COMMON_SUBJECTS,
  DEFAULT_SCHEDULE,
  sanitizeSchedule,
} from '../utils/storage';
import { EditScheduleModal } from './EditScheduleModal';

interface ClassScheduleViewProps {
  schedule: ClassPeriod[];
  userRole: UserRole;
  selectedSeries?: GradeSeries;
  onSeriesChange?: (series: GradeSeries) => void;
  onUpdatePeriod: (period: ClassPeriod) => void;
  onDeletePeriod: (periodId: string) => void;
  onResetSchedule: (series?: GradeSeries) => void;
  onQuickCreateTaskForSubject?: (subject: string) => void;
  onNavigateToGames?: () => void;
  onOpenAuthModal?: () => void;
  onSuccessToast: (msg: string) => void;
}

export const ClassScheduleView: React.FC<ClassScheduleViewProps> = ({
  schedule,
  userRole,
  selectedSeries,
  onSeriesChange,
  onUpdatePeriod,
  onDeletePeriod,
  onResetSchedule,
  onQuickCreateTaskForSubject,
  onNavigateToGames,
  onOpenAuthModal,
  onSuccessToast,
}) => {
  const currentWeekday = useMemo(() => getCurrentDayOfWeek(), []);
  const [internalSeries, setInternalSeries] = useState<GradeSeries>('1_serie');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(currentWeekday);
  const [viewMode, setViewMode] = useState<'dia' | 'grade'>('dia');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('todos');
  const [editingPeriod, setEditingPeriod] = useState<ClassPeriod | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState<boolean>(false);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  const activeSeries = selectedSeries ?? internalSeries;
  const activeSeriesLabel = useMemo(() => getGradeSeriesLabel(activeSeries), [activeSeries]);
  const activeSeriesOption = useMemo(
    () => GRADE_SERIES_OPTIONS.find((s) => s.id === activeSeries) || GRADE_SERIES_OPTIONS[0],
    [activeSeries]
  );

  const handleSelectSeries = (series: GradeSeries) => {
    setInternalSeries(series);
    onSeriesChange?.(series);
    setSelectedSubjectFilter('todos');
    setIsConfirmingReset(false);
  };

  // Track live Horário de Brasília
  useEffect(() => {
    const updateTime = () => {
      setCurrentTimeStr(getBrasiliaNowParts().timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 5000);
    return () => clearInterval(interval);
  }, []);

  const isCoordinator = userRole === 'coordenador';

  // Check if a period is currently happening right now
  const isPeriodActiveNow = (period: ClassPeriod) => {
    if (period.dayOfWeek !== currentWeekday) return false;
    if (!currentTimeStr) return false;
    return currentTimeStr >= period.startTime && currentTimeStr <= period.endTime;
  };

  // Garante que o cronograma sempre esteja sanitizado (sem duplicatas por série e dia)
  const allSafeSchedule = useMemo(() => {
    return sanitizeSchedule(schedule);
  }, [schedule]);

  const safeSchedule = useMemo(() => {
    return allSafeSchedule.filter((p) => (p.gradeSeries || '1_serie') === activeSeries);
  }, [allSafeSchedule, activeSeries]);

  // Check which class is active right now or next upcoming
  const currentLiveClass = useMemo(() => {
    const todayPeriods = safeSchedule.filter((p) => p.dayOfWeek === currentWeekday);
    return todayPeriods.find((p) => isPeriodActiveNow(p)) || null;
  }, [safeSchedule, currentWeekday, currentTimeStr]);

  // Filtered schedule for day view
  const dayPeriods = useMemo(() => {
    let list = safeSchedule.filter((p) => p.dayOfWeek === selectedDay);
    if (selectedSubjectFilter !== 'todos') {
      list = list.filter(
        (p) => p.subject.toLowerCase() === selectedSubjectFilter.toLowerCase()
      );
    }
    return list.sort((a, b) => {
      if (a.periodNumber !== b.periodNumber) return a.periodNumber - b.periodNumber;
      return a.startTime.localeCompare(b.startTime);
    });
  }, [safeSchedule, selectedDay, selectedSubjectFilter]);

  // Distinct subjects in current schedule
  const uniqueSubjects = useMemo(() => {
    const set = new Set<string>();
    safeSchedule.forEach((p) => set.add(p.subject));
    return Array.from(set).sort();
  }, [safeSchedule]);

  const selectedDayInfo = useMemo(() => {
    return DAYS_OF_WEEK.find((d) => d.id === selectedDay) || DAYS_OF_WEEK[0];
  }, [selectedDay]);

  const handleCopyDaySchedule = () => {
    const dayClasses = safeSchedule
      .filter((p) => p.dayOfWeek === selectedDay)
      .sort((a, b) => a.periodNumber - b.periodNumber);

    if (dayClasses.length === 0) {
      onSuccessToast(`Nenhuma aula cadastrada para ${activeSeriesLabel} neste dia.`);
      return;
    }

    const lines = [
      `📚 *Horário de Aulas - ${activeSeriesLabel} - ${selectedDayInfo.name}*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      ...dayClasses.map((p) => {
        const teacherPart = p.teacher ? ` (${p.teacher})` : '';
        const roomPart = p.room ? ` • ${p.room}` : '';
        return `⏰ ${p.startTime} - ${p.endTime} | ${p.periodNumber}º Horário\n   📖 ${p.subject}${teacherPart}${roomPart}`;
      }),
      `━━━━━━━━━━━━━━━━━━━━`,
      `🏫 Gerado pela Agenda Escolar do CETI Miguel Arcoverde`,
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedSuccess(true);
    onSuccessToast(`Horário da ${activeSeriesLabel} copiado para a área de transferência!`);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  const handleResetConfirm = () => {
    onResetSchedule(activeSeries);
    setIsConfirmingReset(false);
    onSuccessToast(`Horário padrão da ${activeSeriesLabel} restaurado!`);
  };

  return (
    <div className="space-y-6" id="class-schedule-view">
      {/* Student Banner when in Student Mode */}
      {!isCoordinator && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-emerald-100 dark:border-emerald-900/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Visualização de Aluno
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Somente Leitura
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                A grade oficial de horários e salas é definida pela <strong>Coordenação Pedagógica</strong>.
              </p>
            </div>
          </div>

          {onOpenAuthModal && (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50/60 dark:hover:bg-slate-700 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Área do Coordenador
            </button>
          )}
        </div>
      )}

      {/* Hero Header Card */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 text-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-emerald-500/15 relative overflow-hidden">
        {/* Glow & Decorative Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-emerald-300/15 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
              <Clock className="w-3.5 h-3.5 text-emerald-100" />
              <span>{activeSeriesLabel} · Grade Semanal</span>
            </div>

            {currentLiveClass ? (
              <div className="flex items-center gap-2 text-xs bg-lime-500/90 text-slate-950 backdrop-blur-md px-3.5 py-1 rounded-full font-bold shadow-xs animate-pulse">
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                <span>
                  Agora ({currentTimeStr} Brasília · {currentLiveClass.startTime}): {currentLiveClass.subject}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs bg-black/20 backdrop-blur-md px-3 py-1 rounded-full font-medium text-emerald-100">
                <Calendar className="w-3.5 h-3.5 text-lime-300" />
                <span>Turno Matutino: 07:00 às 12:20 · {currentTimeStr} Brasília</span>
              </div>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white mb-2">
            Horários das Matérias — {activeSeriesLabel}
          </h2>
          <p className="text-sm text-emerald-50/90 max-w-xl leading-relaxed mb-5">
            Selecione sua série abaixo para acompanhar o cronograma de aulas diário, professores responsáveis e salas de aula.
          </p>

          {/* Quick Metrics Bar & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/20">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl font-bold">
                <BookOpen className="w-4 h-4 text-lime-200" />
                <span>{safeSchedule.length} aulas na semana</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl font-bold">
                <Bookmark className="w-4 h-4 text-emerald-200" />
                <span>{uniqueSubjects.length} disciplinas</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyDaySchedule}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 transition backdrop-blur-md cursor-pointer active:scale-95"
                title="Copiar horário de hoje para compartilhar"
              >
                {copiedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-lime-300" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar do Dia</span>
                  </>
                )}
              </button>

              {isCoordinator ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingPeriod(null);
                    setIsAddModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Adicionar Aula</span>
                </button>
              ) : (
                <div className="px-3 py-1.5 rounded-xl bg-white/15 text-white font-semibold text-xs flex items-center gap-1.5 backdrop-blur-md">
                  <Lock className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Somente Leitura</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Series Selector, Day Selection & View Modes */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        {/* Grade Series Selector (1ª Série / 2ª Série / 3ª Série) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/60 shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Escolha a Série
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                Exibindo grade da <strong>{activeSeriesLabel}</strong> ({activeSeriesOption.roomLabel})
              </span>
            </div>
          </div>

          <div
            className="grid grid-cols-3 gap-1.5 sm:gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70"
            role="tablist"
            aria-label="Selecionar Série"
          >
            {GRADE_SERIES_OPTIONS.map((opt) => {
              const isSelected = activeSeries === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleSelectSeries(opt.id)}
                  className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Top switch row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('dia')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'dia'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              Visão Diária
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grade')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'grade'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              Grade Semanal Completa
            </button>
          </div>

          {isCoordinator && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const cleaned = sanitizeSchedule(safeSchedule);
                  let changed = 0;
                  cleaned.forEach((p) => {
                    const prev = safeSchedule.find((orig) => orig.id === p.id);
                    if (
                      !prev ||
                      prev.periodNumber !== p.periodNumber ||
                      prev.dayOfWeek !== p.dayOfWeek ||
                      prev.startTime !== p.startTime ||
                      prev.endTime !== p.endTime
                    ) {
                      changed++;
                      onUpdatePeriod(p);
                    }
                  });
                  onSuccessToast(
                    changed > 0
                      ? `Horários da ${activeSeriesLabel} reorganizados do 1º ao 8º!`
                      : `Os horários da ${activeSeriesLabel} já estão organizados do 1º ao 8º!`
                  );
                }}
                className="text-xs font-semibold text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition flex items-center gap-1 cursor-pointer"
                title="Garantir ordem de 1º a 8º horário para todos os dias"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                Organizar (1º ao 8º)
              </button>

              {isConfirmingReset ? (
                <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl px-2.5 py-1">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-200">
                    Restaurar {activeSeriesLabel}?
                  </span>
                  <button
                    type="button"
                    onClick={handleResetConfirm}
                    className="px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer"
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingReset(false)}
                    className="px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold cursor-pointer"
                  >
                    Não
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmingReset(true)}
                  className="text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-1 cursor-pointer"
                  title={`Restaurar grade padrão da ${activeSeriesLabel} (Exclusivo Coordenação)`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restaurar Padrão
                </button>
              )}
            </div>
          )}
        </div>

        {/* Day Selector Tabs (if viewMode === 'dia') */}
        {viewMode === 'dia' && (
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedDay === day.id;
              const isToday = currentWeekday === day.id;
              const dayCount = safeSchedule.filter((p) => p.dayOfWeek === day.id).length;

              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => setSelectedDay(day.id)}
                  className={`py-2.5 px-2 rounded-xl text-center transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-600 dark:border-emerald-400 text-emerald-900 dark:text-emerald-100 font-bold shadow-xs'
                      : 'border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50'
                  }`}
                >
                  <span className="block text-xs sm:text-sm font-extrabold truncate">
                    {day.name.split('-')[0]}
                  </span>
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    {dayCount} aulas
                  </span>
                  {isToday && (
                    <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[9px] font-extrabold uppercase">
                      Hoje
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Subject Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 shrink-0">
            Filtrar:
          </span>
          <button
            type="button"
            onClick={() => setSelectedSubjectFilter('todos')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
              selectedSubjectFilter === 'todos'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Todas ({safeSchedule.length})
          </button>
          {uniqueSubjects.map((sub) => {
            const isSel = selectedSubjectFilter.toLowerCase() === sub.toLowerCase();
            return (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubjectFilter(sub)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                  isSel
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW MODE 1: DAILY TIMETABLE (Visão Diária) */}
      {viewMode === 'dia' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              Horário de {selectedDayInfo.name}
            </h3>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {dayPeriods.length} aulas programadas
            </span>
          </div>

          {dayPeriods.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-dashed border-slate-200 dark:border-slate-800">
              <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nenhuma aula cadastrada
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                Nenhum período cadastrado para {selectedDayInfo.name} com o filtro selecionado.
              </p>
              {isCoordinator ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingPeriod(null);
                    setIsAddModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  + Adicionar Aula para {selectedDayInfo.name}
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Horários gerenciados pela Coordenação
                </span>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {dayPeriods.map((period, index) => {
                const colors = getSubjectColor(period.subject);
                const isActive = isPeriodActiveNow(period);

                // Check if we should insert the break card between period 2 and period 3
                const showBreakAfter =
                  period.periodNumber === 2 ||
                  (dayPeriods[index + 1] &&
                    period.periodNumber < 3 &&
                    dayPeriods[index + 1].periodNumber >= 3);

                // Check if we should insert the lunch card between period 5 and period 6
                const showLunchAfter =
                  period.periodNumber === 5 ||
                  (dayPeriods[index + 1] &&
                    period.periodNumber < 6 &&
                    dayPeriods[index + 1].periodNumber >= 6);

                // Check if we should insert afternoon snack card after period 8
                const showAfternoonBreakAfter = period.periodNumber === 8;

                return (
                  <React.Fragment key={period.id}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border transition-all duration-200 ${
                        isActive
                          ? 'border-2 border-emerald-600 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/20'
                          : 'border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Time & Subject Column */}
                        <div className="flex items-start sm:items-center gap-3.5">
                          {/* Period Badge */}
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex flex-col items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700">
                            <span className="text-[11px] font-extrabold uppercase text-slate-400 leading-none">
                              Horário
                            </span>
                            <span className="text-base font-black text-slate-900 dark:text-slate-100 leading-tight">
                              {period.periodNumber}º
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {period.startTime} às {period.endTime}
                              </span>

                              <span
                                className={`text-xs font-extrabold px-2.5 py-0.5 rounded-lg border ${colors.badgeBg}`}
                              >
                                {period.subject}
                              </span>

                              {isActive && (
                                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white px-2 py-0.5 rounded-md animate-pulse">
                                  🔴 Ao Vivo Agora
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 pt-0.5">
                              {period.teacher && (
                                <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                                  <User className="w-3.5 h-3.5 text-emerald-500" />
                                  {period.teacher}
                                </span>
                              )}
                              {period.room && (
                                <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
                                  <MapPin className="w-3 h-3 text-rose-500" />
                                  {period.room}
                                </span>
                              )}
                              {period.notes && (
                                <span className="text-slate-500 dark:text-slate-400 italic text-[11px]">
                                  • {period.notes}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          {isCoordinator && onQuickCreateTaskForSubject && (
                            <button
                              type="button"
                              onClick={() => onQuickCreateTaskForSubject(period.subject)}
                              className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition flex items-center gap-1 cursor-pointer"
                              title={`Criar tarefa rápida para ${period.subject}`}
                            >
                              <FileCheck2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">+ Tarefa</span>
                            </button>
                          )}

                          {isCoordinator ? (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPeriod(period);
                                setIsAddModalOpen(true);
                              }}
                              className="w-8 h-8 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 flex items-center justify-center transition cursor-pointer active:scale-90"
                              title="Editar horário de aula (Coordenação)"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          ) : (
                            <div
                              className="w-7 h-7 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 text-slate-400 flex items-center justify-center shrink-0 cursor-default"
                              title="Grade oficial da coordenação (somente leitura)"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Break / Interval Card between 2º and 3º period */}
                    {showBreakAfter && (
                      <div className="bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl p-3 sm:p-3.5 border border-dashed border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                            <Coffee className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-extrabold text-amber-900 dark:text-amber-100">
                              Intervalo / Merenda Escolar da Manhã
                            </span>
                            <span className="text-[11px] text-amber-700 dark:text-amber-300 block sm:inline sm:ml-2">
                              09:00 às 09:20 (20 minutos de recreio)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {onNavigateToGames && (
                            <button
                              type="button"
                              onClick={onNavigateToGames}
                              className="px-2.5 py-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs transition cursor-pointer active:scale-95"
                            >
                              <Gamepad2 className="w-3.5 h-3.5" />
                              <span>Jogar no Recreio</span>
                            </button>
                          )}
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-md">
                            Recreio
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Lunch Break Card between 5º and 6º period */}
                    {showLunchAfter && (
                      <div className="bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl p-3 sm:p-3.5 border border-dashed border-emerald-200 dark:border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                            <Utensils className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-extrabold text-emerald-900 dark:text-emerald-100">
                              Almoço Escolar & Intervalo Principal
                            </span>
                            <span className="text-[11px] text-emerald-700 dark:text-emerald-300 block sm:inline sm:ml-2">
                              12:20 às 13:20 (1 hora de intervalo para almoço e descanso)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-md">
                            Almoço
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Afternoon Snack Card after 8º period */}
                    {showAfternoonBreakAfter && (
                      <div className="bg-teal-50/70 dark:bg-teal-950/30 rounded-2xl p-3 sm:p-3.5 border border-dashed border-teal-200 dark:border-teal-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                            <Coffee className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-extrabold text-teal-900 dark:text-teal-100">
                              Merenda da Tarde & Encerramento do Dia
                            </span>
                            <span className="text-[11px] text-teal-700 dark:text-teal-300 block sm:inline sm:ml-2">
                              16:20 às 16:40 (8 aulas de 1h concluídas)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-200/60 dark:bg-teal-900/60 text-teal-900 dark:text-teal-200 px-2 py-0.5 rounded-md">
                            Término das Aulas
                          </span>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: WEEKLY TIMETABLE MATRIX (Grade Semanal Completa) */}
      {viewMode === 'grade' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-x-auto space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
              <Grid3X3 className="w-5 h-5 text-emerald-600" />
              Matriz Semanal — {activeSeriesLabel}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {isCoordinator ? 'Clique em qualquer aula para editar' : 'Grade completa da semana'}
            </span>
          </div>

          <div className="min-w-[700px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="p-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 w-28">
                    Horário
                  </th>
                  {DAYS_OF_WEEK.map((d) => (
                    <th
                      key={d.id}
                      className={`p-3 text-xs font-extrabold text-slate-800 dark:text-slate-200 ${
                        currentWeekday === d.id
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{d.name}</span>
                        {currentWeekday === d.id && (
                          <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[9px] font-bold uppercase">
                            Hoje
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {CLASS_PERIOD_SLOTS.map((slot) => {
                  return (
                    <React.Fragment key={slot.periodNumber}>
                      <tr>
                        {/* Time Period Column */}
                        <td className="p-3 align-top">
                          <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 block">
                            {slot.label}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </td>

                        {/* 5 Days columns */}
                        {DAYS_OF_WEEK.map((day) => {
                          const period = safeSchedule.find(
                            (p) =>
                              p.dayOfWeek === day.id && p.periodNumber === slot.periodNumber
                          );

                          if (!period) {
                            return (
                              <td
                                key={day.id}
                                onClick={
                                  isCoordinator
                                    ? () => {
                                        setSelectedDay(day.id);
                                        setEditingPeriod({
                                          id: '',
                                          gradeSeries: activeSeries,
                                          dayOfWeek: day.id,
                                          periodNumber: slot.periodNumber,
                                          startTime: slot.startTime,
                                          endTime: slot.endTime,
                                          subject: '',
                                          room: activeSeriesOption.roomLabel,
                                        });
                                        setIsAddModalOpen(true);
                                      }
                                    : undefined
                                }
                                className={`p-2 align-top transition ${
                                  isCoordinator
                                    ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                    : 'cursor-default'
                                } ${
                                  currentWeekday === day.id
                                    ? 'bg-emerald-50/20 dark:bg-emerald-950/20'
                                    : ''
                                }`}
                              >
                                {isCoordinator ? (
                                  <div className="h-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-[11px] text-slate-400 hover:border-emerald-400 hover:text-emerald-600">
                                    + Aula
                                  </div>
                                ) : (
                                  <div className="h-16 rounded-2xl border border-slate-100 dark:border-slate-800/40 bg-slate-50/20 dark:bg-slate-900/20 flex items-center justify-center text-[11px] text-slate-300 dark:text-slate-600">
                                    —
                                  </div>
                                )}
                              </td>
                            );
                          }

                          const colors = getSubjectColor(period.subject);
                          const isActive = isPeriodActiveNow(period);

                          return (
                            <td
                              key={day.id}
                              onClick={
                                isCoordinator
                                  ? () => {
                                      setEditingPeriod(period);
                                      setIsAddModalOpen(true);
                                    }
                                  : undefined
                              }
                              className={`p-2 align-top transition ${
                                isCoordinator ? 'cursor-pointer' : 'cursor-default'
                              } ${
                                currentWeekday === day.id
                                  ? 'bg-emerald-50/20 dark:bg-emerald-950/20'
                                  : ''
                              }`}
                            >
                              <div
                                className={`p-2.5 rounded-2xl border transition-all duration-150 hover:shadow-md ${
                                  isActive
                                    ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                                    : 'border-slate-200/80 dark:border-slate-800'
                                } ${colors.bg}`}
                              >
                                <span
                                  className={`text-xs font-bold block truncate ${colors.text}`}
                                >
                                  {period.subject}
                                </span>
                                {period.teacher && (
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                                    {period.teacher}
                                  </span>
                                )}
                                {period.room && (
                                  <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">
                                    📍 {period.room}
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>

                      {/* Recess/Break Row after 2º period */}
                      {slot.periodNumber === 2 && (
                        <tr className="bg-amber-50/50 dark:bg-amber-950/20">
                          <td
                            colSpan={6}
                            className="py-2 px-4 text-center text-xs font-bold text-amber-800 dark:text-amber-300 border-y border-amber-200/60 dark:border-amber-900/40"
                          >
                            ☕ 09:00 às 09:20 — Intervalo & Merenda da Manhã (20 min)
                          </td>
                        </tr>
                      )}

                      {/* Lunch Break Row after 5º period */}
                      {slot.periodNumber === 5 && (
                        <tr className="bg-emerald-50/50 dark:bg-emerald-950/20">
                          <td
                            colSpan={6}
                            className="py-2.5 px-4 text-center text-xs font-bold text-emerald-800 dark:text-emerald-300 border-y border-emerald-200/60 dark:border-emerald-900/40"
                          >
                            🍱 12:20 às 13:20 — Almoço Escolar & Intervalo Principal (1h)
                          </td>
                        </tr>
                      )}

                      {/* Afternoon Snack Row after 8º period */}
                      {slot.periodNumber === 8 && (
                        <tr className="bg-teal-50/50 dark:bg-teal-950/20">
                          <td
                            colSpan={6}
                            className="py-2 px-4 text-center text-xs font-bold text-teal-800 dark:text-teal-300 border-t border-teal-200/60 dark:border-teal-900/40"
                          >
                            🥤 16:20 às 16:40 — Merenda da Tarde & Saída
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / Add Schedule Modal */}
      <EditScheduleModal
        isOpen={isAddModalOpen}
        period={editingPeriod}
        initialDay={selectedDay}
        initialSeries={activeSeries}
        schedule={allSafeSchedule}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingPeriod(null);
        }}
        onSave={(saved) => {
          onUpdatePeriod(saved);
          onSuccessToast('Horário atualizado com sucesso!');
        }}
        onDelete={(id) => {
          onDeletePeriod(id);
          onSuccessToast('Aula removida do horário!');
        }}
      />
    </div>
  );
};
