import React, { useState, useEffect, useMemo } from 'react';
import { X, Clock, BookOpen, User, MapPin, FileText, Check, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClassPeriod, DayOfWeek } from '../types';
import {
  DAYS_OF_WEEK,
  COMMON_SUBJECTS,
  CLASS_PERIOD_SLOTS,
  getSubjectColor,
} from '../utils/storage';

interface EditScheduleModalProps {
  isOpen: boolean;
  period: ClassPeriod | null;
  initialDay?: DayOfWeek;
  schedule?: ClassPeriod[];
  onClose: () => void;
  onSave: (period: ClassPeriod) => void;
  onDelete?: (periodId: string) => void;
}

export const EditScheduleModal: React.FC<EditScheduleModalProps> = ({
  isOpen,
  period,
  initialDay = 'segunda',
  schedule = [],
  onClose,
  onSave,
  onDelete,
}) => {
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(initialDay);
  const [periodNumber, setPeriodNumber] = useState<number>(1);
  const [startTime, setStartTime] = useState<string>('07:30');
  const [endTime, setEndTime] = useState<string>('08:20');
  const [subject, setSubject] = useState<string>('Matemática');
  const [teacher, setTeacher] = useState<string>('');
  const [room, setRoom] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [customTimeMode, setCustomTimeMode] = useState<boolean>(false);

  useEffect(() => {
    if (period) {
      setDayOfWeek(period.dayOfWeek);
      setPeriodNumber(period.periodNumber || 1);
      setStartTime(period.startTime || '07:30');
      setEndTime(period.endTime || '08:20');
      setSubject(period.subject || 'Matemática');
      setTeacher(period.teacher || '');
      setRoom(period.room || '');
      setNotes(period.notes || '');

      // Check if matches standard slot
      const matchedSlot = CLASS_PERIOD_SLOTS.find(
        (s) => s.periodNumber === period.periodNumber && s.startTime === period.startTime
      );
      setCustomTimeMode(!matchedSlot);
    } else {
      // Quando criando nova aula, busca o primeiro período livre daquele dia
      const existingForDay = schedule.filter((p) => p.dayOfWeek === initialDay);
      const usedPeriods = new Set(existingForDay.map((p) => p.periodNumber));
      let freeSlot = 1;
      while (freeSlot <= CLASS_PERIOD_SLOTS.length && usedPeriods.has(freeSlot)) {
        freeSlot++;
      }
      const targetSlotNum = freeSlot <= CLASS_PERIOD_SLOTS.length ? freeSlot : 1;
      const defaultSlot = CLASS_PERIOD_SLOTS.find((s) => s.periodNumber === targetSlotNum) || CLASS_PERIOD_SLOTS[0];

      setDayOfWeek(initialDay);
      setPeriodNumber(defaultSlot.periodNumber);
      setStartTime(defaultSlot.startTime);
      setEndTime(defaultSlot.endTime);
      setSubject('Matemática');
      setTeacher('');
      setRoom('Sala 102');
      setNotes('');
      setCustomTimeMode(false);
    }
  }, [period, initialDay, isOpen, schedule]);

  // Se trocar o dia ao adicionar nova aula, sugere período livre
  const handleDayChange = (newDay: DayOfWeek) => {
    setDayOfWeek(newDay);
    if (!period) {
      const existingForDay = schedule.filter((p) => p.dayOfWeek === newDay);
      const usedPeriods = new Set(existingForDay.map((p) => p.periodNumber));
      let freeSlot = 1;
      while (freeSlot <= CLASS_PERIOD_SLOTS.length && usedPeriods.has(freeSlot)) {
        freeSlot++;
      }
      const targetSlotNum = freeSlot <= CLASS_PERIOD_SLOTS.length ? freeSlot : 1;
      const defaultSlot = CLASS_PERIOD_SLOTS.find((s) => s.periodNumber === targetSlotNum) || CLASS_PERIOD_SLOTS[0];
      setPeriodNumber(defaultSlot.periodNumber);
      setStartTime(defaultSlot.startTime);
      setEndTime(defaultSlot.endTime);
    }
  };

  const handleSlotSelect = (slotNum: number) => {
    const slot = CLASS_PERIOD_SLOTS.find((s) => s.periodNumber === slotNum);
    if (slot) {
      setPeriodNumber(slot.periodNumber);
      setStartTime(slot.startTime);
      setEndTime(slot.endTime);
      setCustomTimeMode(false);
    }
  };

  // Detecta se já existe outra aula ocupando o período selecionado
  const conflictClass = useMemo(() => {
    if (!schedule || schedule.length === 0) return null;
    return schedule.find(
      (p) =>
        p.dayOfWeek === dayOfWeek &&
        p.periodNumber === periodNumber &&
        p.id !== (period?.id || '')
    );
  }, [schedule, dayOfWeek, periodNumber, period]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    let finalPeriodNumber = periodNumber;
    if (customTimeMode) {
      const slotByStartTime = CLASS_PERIOD_SLOTS.find((s) => s.startTime === startTime);
      if (slotByStartTime) {
        finalPeriodNumber = slotByStartTime.periodNumber;
      }
    }

    const updatedPeriod: ClassPeriod = {
      id: period ? period.id : `sch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      dayOfWeek,
      periodNumber: finalPeriodNumber,
      startTime,
      endTime,
      subject: subject.trim(),
      teacher: teacher.trim() || undefined,
      room: room.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    onSave(updatedPeriod);
    onClose();
  };

  const subjectColor = getSubjectColor(subject);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-display">
                  {period ? 'Editar Horário de Aula' : 'Adicionar Aula ao Horário'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Defina a disciplina, professor, sala e período da semana
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {/* Day of the Week Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Dia da Semana
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {DAYS_OF_WEEK.map((d) => {
                  const isSelected = dayOfWeek === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => handleDayChange(d.id)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {d.shortName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Standard Period Slots or Custom */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Horário / Período da Aula
                </label>
                <button
                  type="button"
                  onClick={() => setCustomTimeMode(!customTimeMode)}
                  className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {customTimeMode ? 'Usar Horários Padrão' : 'Horário Personalizado'}
                </button>
              </div>

              {conflictClass && (
                <div className="mb-3 p-3 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Horário já preenchido</span>
                    <span>
                      Já existe a aula de <strong>{conflictClass.subject}</strong> no {periodNumber}º Horário. Salvar irá substituir este horário sem duplicar.
                    </span>
                  </div>
                </div>
              )}

              {!customTimeMode ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CLASS_PERIOD_SLOTS.map((slot) => {
                    const isSelected = periodNumber === slot.periodNumber;
                    return (
                      <button
                        key={slot.periodNumber}
                        type="button"
                        onClick={() => handleSlotSelect(slot.periodNumber)}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <span className="block text-xs font-extrabold">{slot.label}</span>
                        <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Início
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Término
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Subject Field & Quick Suggestions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Disciplina / Matéria
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Matemática, Física, Português..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />

              {/* Quick Subject Suggestions */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {COMMON_SUBJECTS.slice(0, 8).map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSubject(sub)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition cursor-pointer border ${
                      subject.toLowerCase() === sub.toLowerCase()
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-200 dark:border-emerald-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Teacher and Room Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Professor(a)
                </label>
                <input
                  type="text"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  placeholder="Ex: Prof. Ricardo Mendes"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Sala / Laboratório
                </label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Ex: Sala 102, Lab. 2..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Notes / Topic */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Conteúdo / Observação (Opcional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Trazer livro didático vol. 2, calculadora..."
                className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              {period && onDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Tem certeza de que deseja remover esta aula do horário?')) {
                      onDelete(period.id);
                      onClose();
                    }
                  }}
                  className="px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  Salvar Aula
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
