import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Calendar,
  Sparkles,
  AlertCircle,
  GraduationCap,
  Users,
  Palmtree,
  Presentation,
  ShieldCheck,
  Check,
  X,
  CalendarDays,
  Clock,
  MapPin,
  BookOpen,
} from 'lucide-react';
import { EventCategory, SchoolEvent } from '../types';
import {
  formatDateDisplay,
  formatDateToISO,
  formatISODateToDisplay,
  getBrasiliaWallDate,
} from '../utils/storage';

interface EventFormProps {
  onAddEvent: (
    title: string,
    category: EventCategory,
    date: string,
    time?: string,
    location?: string,
    subject?: string,
    description?: string
  ) => void;
  editingEvent?: SchoolEvent | null;
  onUpdateEvent?: (updated: SchoolEvent) => void;
  onCancelEdit?: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  onAddEvent,
  editingEvent,
  onUpdateEvent,
  onCancelEdit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('prova');
  // Store ISO date (YYYY-MM-DD) for <input type="date">
  const [isoDate, setIsoDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync editing event into form fields
  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setCategory(editingEvent.category);
      setIsoDate(formatDateToISO(editingEvent.date));
      setTime(editingEvent.time || '');
      setLocation(editingEvent.location || '');
      setSubject(editingEvent.subject || '');
      setDescription(editingEvent.description || '');
      setIsOpen(true);
    }
  }, [editingEvent]);

  const setPresetDays = (daysOffset: number) => {
    const target = getBrasiliaWallDate();
    target.setDate(target.getDate() + daysOffset);
    const y = target.getFullYear();
    const m = String(target.getMonth() + 1).padStart(2, '0');
    const d = String(target.getDate()).padStart(2, '0');
    setIsoDate(`${y}-${m}-${d}`);
    if (errorMessage) setErrorMessage(null);
  };

  const getFormattedDatePreview = (iso: string) => {
    if (!iso) return null;
    const parts = iso.split('-');
    if (parts.length !== 3) return null;
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    if (isNaN(d.getTime())) return null;

    const formatted = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);

    const displayDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    return { displayDate, longFormat: formatted };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !isoDate.trim()) {
      setErrorMessage('Por favor, selecione a data no calendário e informe o título do evento!');
      return;
    }

    const formattedDisplayDate = formatISODateToDisplay(isoDate.trim());
    if (!formattedDisplayDate) {
      setErrorMessage('Data inválida selecionada!');
      return;
    }

    setErrorMessage(null);

    if (editingEvent && onUpdateEvent) {
      onUpdateEvent({
        ...editingEvent,
        title: title.trim(),
        category,
        date: formattedDisplayDate,
        time: time.trim() || undefined,
        location: location.trim() || undefined,
        subject: subject.trim() || undefined,
        description: description.trim() || undefined,
      });
      if (onCancelEdit) onCancelEdit();
    } else {
      onAddEvent(
        title.trim(),
        category,
        formattedDisplayDate,
        time.trim() || undefined,
        location.trim() || undefined,
        subject.trim() || undefined,
        description.trim() || undefined
      );
    }

    // Reset fields
    setTitle('');
    setIsoDate('');
    setTime('');
    setLocation('');
    setSubject('');
    setDescription('');
    if (!editingEvent) {
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (editingEvent && onCancelEdit) {
      onCancelEdit();
    }
  };

  const categories: { id: EventCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'prova', label: 'Prova / Exame', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'trabalho', label: 'Apresentação', icon: <Presentation className="w-3.5 h-3.5" /> },
    { id: 'evento', label: 'Feira / Evento', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'reuniao', label: 'Reunião', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'feriado', label: 'Feriado / Recesso', icon: <Palmtree className="w-3.5 h-3.5" /> },
  ];

  const datePreview = getFormattedDatePreview(isoDate);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 mb-6 transition-colors" id="event-form-container">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              {editingEvent ? 'Editar Evento Oficial' : isOpen ? 'Novo Evento Escolar' : 'Gerenciar Eventos'}
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Coordenação
              </span>
            </h2>
          </div>
        </div>
        <button
          type="button"
          onClick={() => (isOpen ? handleClose() : setIsOpen(true))}
          className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            isOpen
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20'
          }`}
          id="toggle-event-form-btn"
        >
          {isOpen ? (
            <>
              <X className="w-3.5 h-3.5" /> Fechar
            </>
          ) : (
            <>
              <PlusCircle className="w-3.5 h-3.5" /> + Cadastrar Evento
            </>
          )}
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800" id="school-event-form">
          {errorMessage && (
            <div
              className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm rounded-xl flex items-center gap-2"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Tipo de Evento *
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                    category === cat.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5" htmlFor="event-title-input">
              Título do Evento *
            </label>
            <input
              id="event-title-input"
              type="text"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition"
              placeholder="Ex: Prova Bimestral de História, Feira de Ciências, Reunião de Pais"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
            />
          </div>

          {/* Date Picker via Calendar & Quick Presets */}
          <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5" htmlFor="event-date-picker-input">
                <CalendarDays className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Data do Evento (Selecione no Calendário) *
              </label>
              {datePreview && (
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                  {datePreview.displayDate}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Native Calendar Picker with styled container */}
              <div className="sm:col-span-6 relative">
                <input
                  id="event-date-picker-input"
                  type="date"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs font-medium cursor-pointer"
                  value={isoDate}
                  onChange={(e) => {
                    setIsoDate(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="sm:col-span-6 flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPresetDays(0)}
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
                >
                  Hoje
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDays(1)}
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
                >
                  Amanhã
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDays(7)}
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
                >
                  +7 dias
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDays(14)}
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
                >
                  +14 dias
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDays(30)}
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
                >
                  +30 dias
                </button>
              </div>
            </div>

            {/* Date Long Format Feedback */}
            {datePreview && (
              <p className="text-xs text-emerald-900 dark:text-emerald-200 capitalize flex items-center gap-1.5 pt-0.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{datePreview.longFormat}</span>
              </p>
            )}
          </div>

          {/* Time & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5" htmlFor="event-time-input">
                <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                Horário (Opcional)
              </label>
              <input
                id="event-time-input"
                type="time"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition cursor-pointer"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5" htmlFor="event-location-input">
                <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                Local (Opcional)
              </label>
              <input
                id="event-location-input"
                type="text"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition"
                placeholder="Ex: Auditório, Sala 12, Ginásio"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Subject & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5" htmlFor="event-subject-input">
                <BookOpen className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                Matéria Relacionada (Opcional)
              </label>
              <input
                id="event-subject-input"
                type="text"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition"
                placeholder="Ex: História, Matemática, Ciências"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5" htmlFor="event-desc-input">
                Observações / Orientações (Opcional)
              </label>
              <input
                id="event-desc-input"
                type="text"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition"
                placeholder="Ex: Trazer régua e calculadora; uniforme obrigatório"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            {editingEvent && (
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Cancelar Edição
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-500/20 transition flex items-center gap-2 cursor-pointer"
              id="save-event-submit-btn"
            >
              {editingEvent ? (
                <>
                  <Check className="w-4 h-4" /> Salvar Alterações
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" /> Salvar Evento
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
