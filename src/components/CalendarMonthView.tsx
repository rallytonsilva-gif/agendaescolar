import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  Users,
  Palmtree,
  Presentation,
  Tag,
  CalendarDays,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, SchoolEvent, EventCategory } from '../types';
import {
  getEventCategoryDetails,
  getSubjectColor,
  formatDateDisplay,
  getBrasiliaNowParts,
  getBrasiliaWallDate,
} from '../utils/storage';

interface CalendarMonthViewProps {
  tasks: Task[];
  events: SchoolEvent[];
  onToggleTask: (id: string) => void;
}

export const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  tasks,
  events,
  onToggleTask,
}) => {
  const [currentDate, setCurrentDate] = useState(() => getBrasiliaWallDate());
  const [selectedDay, setSelectedDay] = useState<Date>(() => getBrasiliaWallDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(currentDate);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = getBrasiliaWallDate();
    setCurrentDate(today);
    setSelectedDay(today);
  };

  // Build calendar matrix
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday

  const daysArray = useMemo(() => {
    const days: Array<{
      date: Date;
      dayNumber: number;
      isCurrentMonth: boolean;
      dateKey: string; // DD/MM/YYYY
    }> = [];

    // Previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthDays - i);
      const dayStr = String(d.getDate()).padStart(2, '0');
      const monthStr = String(d.getMonth() + 1).padStart(2, '0');
      days.push({
        date: d,
        dayNumber: d.getDate(),
        isCurrentMonth: false,
        dateKey: `${dayStr}/${monthStr}/${d.getFullYear()}`,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      const dayStr = String(i).padStart(2, '0');
      const monthStr = String(month + 1).padStart(2, '0');
      days.push({
        date: d,
        dayNumber: i,
        isCurrentMonth: true,
        dateKey: `${dayStr}/${monthStr}/${year}`,
      });
    }

    // Next month padding to reach 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      const dayStr = String(i).padStart(2, '0');
      const monthStr = String(month + 2).padStart(2, '0');
      days.push({
        date: d,
        dayNumber: i,
        isCurrentMonth: false,
        dateKey: `${dayStr}/${monthStr}/${d.getFullYear()}`,
      });
    }

    return days;
  }, [year, month, daysInMonth, firstDayOfWeek]);

  // Index items by date
  const eventsByDate = useMemo(() => {
    const map = new Map<string, SchoolEvent[]>();
    events.forEach((ev) => {
      const key = formatDateDisplay(ev.date);
      const list = map.get(key) || [];
      list.push(ev);
      map.set(key, list);
    });
    return map;
  }, [events]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((t) => {
      const key = formatDateDisplay(t.date);
      const list = map.get(key) || [];
      list.push(t);
      map.set(key, list);
    });
    return map;
  }, [tasks]);

  const selectedKey = useMemo(() => {
    const dayStr = String(selectedDay.getDate()).padStart(2, '0');
    const monthStr = String(selectedDay.getMonth() + 1).padStart(2, '0');
    return `${dayStr}/${monthStr}/${selectedDay.getFullYear()}`;
  }, [selectedDay]);

  const selectedEvents = eventsByDate.get(selectedKey) || [];
  const selectedTasks = tasksByDate.get(selectedKey) || [];

  const weekHeaders = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 mb-6 transition-colors" id="calendar-view-container">
      {/* Calendar Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Visão Geral do Mês
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-50 capitalize flex items-center gap-2 font-display">
            <CalendarDays className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            {monthName}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToToday}
            className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer shadow-2xs active:scale-95"
          >
            Hoje
          </button>
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
              aria-label="Mês anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
              aria-label="Próximo mês"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday column headers */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2.5">
        {weekHeaders.map((day, idx) => (
          <div
            key={day}
            className={`text-xs font-bold py-1 uppercase tracking-wider ${
              idx === 0 || idx === 6 ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-6">
        {daysArray.map((dayObj, index) => {
          const dayEvents = eventsByDate.get(dayObj.dateKey) || [];
          const dayTasks = tasksByDate.get(dayObj.dateKey) || [];
          const totalItems = dayEvents.length + dayTasks.length;

          const isSelected =
            selectedDay.getDate() === dayObj.date.getDate() &&
            selectedDay.getMonth() === dayObj.date.getMonth() &&
            selectedDay.getFullYear() === dayObj.date.getFullYear();

          const brNow = getBrasiliaNowParts();
          const isToday =
            brNow.day === dayObj.date.getDate() &&
            brNow.month - 1 === dayObj.date.getMonth() &&
            brNow.year === dayObj.date.getFullYear();

          return (
            <button
              key={`${dayObj.dateKey}-${index}`}
              type="button"
              onClick={() => setSelectedDay(dayObj.date)}
              className={`min-h-[58px] sm:min-h-[70px] p-1.5 rounded-xl sm:rounded-2xl border text-left flex flex-col justify-between transition-all relative cursor-pointer active:scale-95 ${
                isSelected
                  ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 ring-2 ring-emerald-500/40 shadow-sm'
                  : isToday
                  ? 'border-teal-300 dark:border-teal-700 bg-teal-50/30 dark:bg-teal-950/20'
                  : dayObj.isCurrentMonth
                  ? 'border-slate-100 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 bg-white dark:bg-slate-900/60'
                  : 'border-transparent text-slate-300 dark:text-slate-700 bg-slate-50/30 dark:bg-slate-900/20 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-xs font-bold rounded-lg w-6 h-6 flex items-center justify-center ${
                    isToday
                      ? 'bg-emerald-600 text-white font-extrabold shadow-xs shadow-emerald-500/30'
                      : isSelected
                      ? 'text-emerald-700 dark:text-emerald-300 font-extrabold bg-emerald-100/70 dark:bg-emerald-900/50'
                      : dayObj.isCurrentMonth
                      ? 'text-slate-800 dark:text-slate-200'
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {dayObj.dayNumber}
                </span>

                {totalItems > 0 && (
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {totalItems}
                  </span>
                )}
              </div>

              {/* Event / Task indicators */}
              <div className="flex flex-wrap gap-1 mt-1">
                {dayEvents.slice(0, 3).map((ev) => (
                  <span
                    key={ev.id}
                    title={ev.title}
                    className={`w-2 h-2 rounded-full ${
                      ev.category === 'prova'
                        ? 'bg-rose-500 shadow-xs'
                        : ev.category === 'trabalho'
                        ? 'bg-amber-500 shadow-xs'
                        : ev.category === 'reuniao'
                        ? 'bg-teal-500 shadow-xs'
                        : ev.category === 'feriado'
                        ? 'bg-green-500 shadow-xs'
                        : 'bg-emerald-500 shadow-xs'
                    }`}
                  />
                ))}
                {dayTasks.slice(0, 2).map((t) => (
                  <span
                    key={t.id}
                    title={`Tarefa: ${t.title}`}
                    className={`w-2 h-2 rounded-full ${
                      t.done ? 'bg-green-400' : 'bg-teal-400'
                    }`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Agenda View */}
      <div className="pt-5 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 font-display">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            Programação para {selectedKey}
          </h3>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {selectedEvents.length} {selectedEvents.length === 1 ? 'evento oficial' : 'eventos oficiais'} •{' '}
            {selectedTasks.length} {selectedTasks.length === 1 ? 'tarefa' : 'tarefas'}
          </span>
        </div>

        {selectedEvents.length === 0 && selectedTasks.length === 0 ? (
          <div className="py-8 text-center bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <CalendarDays className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Nenhum evento ou tarefa marcada para esta data.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {/* Events for this day */}
            {selectedEvents.map((ev) => {
              const details = getEventCategoryDetails(ev.category);
              return (
                <div
                  key={ev.id}
                  className={`p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 border-l-4 ${details.border} shadow-2xs flex items-start justify-between gap-3`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${details.badgeBg}`}>
                        {details.label}
                      </span>
                      {ev.time && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                          {ev.time}
                        </span>
                      )}
                      {ev.location && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                          {ev.location}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{ev.title}</p>
                    {ev.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{ev.description}</p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Tasks for this day */}
            {selectedTasks.map((t) => {
              const subjStyle = getSubjectColor(t.subject);
              return (
                <div
                  key={t.id}
                  onClick={() => onToggleTask(t.id)}
                  className={`p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 border-l-4 ${
                    t.done ? 'border-l-green-500 opacity-70' : 'border-l-emerald-500'
                  } shadow-2xs flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                        t.done ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs' : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {t.done && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                    </span>
                    <div className="min-w-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${subjStyle.badgeBg} mr-2`}>
                        {t.subject}
                      </span>
                      <span
                        className={`text-xs sm:text-sm font-medium ${
                          t.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100 font-semibold'
                        }`}
                      >
                        {t.title}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
