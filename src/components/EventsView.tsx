import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Search,
  Sparkles,
  GraduationCap,
  Users,
  Palmtree,
  Presentation,
  ShieldCheck,
  Lock,
  ArrowRight,
  Info,
  Cloud,
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { SchoolEvent, EventCategory, UserRole } from '../types';
import { EventCard } from './EventCard';
import { EventForm } from './EventForm';
import { parseDateToTimestamp } from '../utils/storage';

interface EventsViewProps {
  events: SchoolEvent[];
  userRole: UserRole;
  isCloudAdmin?: boolean;
  onAddEvent: (
    title: string,
    category: EventCategory,
    date: string,
    time?: string,
    location?: string,
    subject?: string,
    description?: string
  ) => void;
  onUpdateEvent?: (updated: SchoolEvent) => void;
  onDeleteEvent: (id: string) => void;
  onResetDefaultEvents: () => void;
  onOpenAuthModal: () => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  userRole,
  isCloudAdmin = false,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onResetDefaultEvents,
  onOpenAuthModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [editingEvent, setEditingEvent] = useState<SchoolEvent | null>(null);

  const isCoordinator = userRole === 'coordenador';

  const categories: { id: string; label: string; icon: React.ReactNode }[] = [
    { id: 'todas', label: 'Todos os Eventos', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'prova', label: 'Provas & Exames', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'trabalho', label: 'Apresentações', icon: <Presentation className="w-3.5 h-3.5" /> },
    { id: 'evento', label: 'Feiras & Eventos', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'reuniao', label: 'Reuniões', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'feriado', label: 'Feriados', icon: <Palmtree className="w-3.5 h-3.5" /> },
  ];

  // Sort events chronologically
  const sortedAndFilteredEvents = useMemo(() => {
    return events
      .filter((ev) => {
        // Category filter
        if (selectedCategory !== 'todas' && ev.category !== selectedCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = ev.title.toLowerCase().includes(q);
          const matchDesc = ev.description?.toLowerCase().includes(q) ?? false;
          const matchSubj = ev.subject?.toLowerCase().includes(q) ?? false;
          const matchLoc = ev.location?.toLowerCase().includes(q) ?? false;
          const matchDate = ev.date.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchSubj && !matchLoc && !matchDate) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = parseDateToTimestamp(a.date);
        const timeB = parseDateToTimestamp(b.date);
        return timeA - timeB;
      });
  }, [events, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6" id="events-view-root">
      {/* Student Banner when in Student Mode */}
      {!isCoordinator ? (
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
                Os eventos oficiais (provas, feiras e reuniões) são publicados e gerenciados pela <strong>Coordenação Pedagógica</strong>.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenAuthModal}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50/60 dark:hover:bg-slate-700 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer shadow-2xs"
            id="student-view-coord-access-btn"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            Área do Coordenador
          </button>
        </div>
      ) : (
        /* Event Form for Coordinator */
        <div className="space-y-4">
          {!isCloudAdmin && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <Cloud className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 dark:text-amber-200">
                  <strong>Sincronização na nuvem pendente:</strong> Conecte a conta Google da Coordenação para que os eventos publicados aqui apareçam para todos os visitantes do site.
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shrink-0 self-start sm:self-auto cursor-pointer"
              >
                Conectar Google
              </button>
            </div>
          )}
          <EventForm
            onAddEvent={onAddEvent}
            editingEvent={editingEvent}
            onUpdateEvent={onUpdateEvent}
            onCancelEdit={() => setEditingEvent(null)}
          />
        </div>
      )}

      {/* Events Filter & Search */}
      <div className="space-y-3" id="events-filter-bar">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar evento por título, local, matéria ou data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
              id="search-events-input"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
          {categories.map((cat) => {
            const count =
              cat.id === 'todas'
                ? events.length
                : events.filter((e) => e.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[11px] ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3" id="events-list-container">
        <AnimatePresence mode="popLayout">
          {sortedAndFilteredEvents.length > 0 ? (
            sortedAndFilteredEvents.map((ev) => (
              <EventCard
                key={ev.id}
                event={ev}
                userRole={userRole}
                onDelete={onDeleteEvent}
                onEdit={(target) => {
                  setEditingEvent(target);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ))
          ) : (
            <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                Nenhum evento encontrado
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                {searchQuery || selectedCategory !== 'todas'
                  ? 'Nenhum evento corresponde aos filtros selecionados.'
                  : 'Nenhum evento escolar cadastrado no momento.'}
              </p>
              {(searchQuery || selectedCategory !== 'todas') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('todas');
                  }}
                  className="text-xs font-semibold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition cursor-pointer"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
