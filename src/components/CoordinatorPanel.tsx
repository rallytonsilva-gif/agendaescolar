import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  PlusCircle,
  Edit3,
  Trash2,
  Calendar,
  Lock,
  Sparkles,
  GraduationCap,
  Users,
  Palmtree,
  Presentation,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  FileSpreadsheet,
  Download,
  RotateCcw,
  ArrowRight,
  Info,
  Cloud,
} from 'lucide-react';
import { SchoolEvent, EventCategory } from '../types';
import { EventForm } from './EventForm';
import { EventCard } from './EventCard';
import { getEventCategoryDetails, getBrasiliaNowParts } from '../utils/storage';

interface CoordinatorPanelProps {
  events: SchoolEvent[];
  isCloudAdmin?: boolean;
  onOpenAuthModal?: () => void;
  onAddEvent: (
    title: string,
    category: EventCategory,
    date: string,
    time?: string,
    location?: string,
    subject?: string,
    description?: string
  ) => void;
  onUpdateEvent: (updated: SchoolEvent) => void;
  onDeleteEvent: (id: string) => void;
  onDeleteAllEvents?: () => void;
  onResetDefaultEvents: () => void;
  onSwitchToStudent: () => void;
}

export const CoordinatorPanel: React.FC<CoordinatorPanelProps> = ({
  events,
  isCloudAdmin = false,
  onOpenAuthModal,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onDeleteAllEvents,
  onResetDefaultEvents,
  onSwitchToStudent,
}) => {
  const [editingEvent, setEditingEvent] = useState<SchoolEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todas');
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  // Stats
  const stats = useMemo(() => {
    const total = events.length;
    const provas = events.filter((e) => e.category === 'prova').length;
    const trabalhos = events.filter((e) => e.category === 'trabalho').length;
    const reunioes = events.filter((e) => e.category === 'reuniao').length;
    const feiras = events.filter((e) => e.category === 'evento').length;
    const feriados = events.filter((e) => e.category === 'feriado').length;
    return { total, provas, trabalhos, reunioes, feiras, feriados };
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (categoryFilter !== 'todas' && ev.category !== categoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = ev.title.toLowerCase().includes(q);
        const matchSubject = (ev.subject || '').toLowerCase().includes(q);
        const matchDate = ev.date.toLowerCase().includes(q);
        const matchLoc = (ev.location || '').toLowerCase().includes(q);
        if (!matchTitle && !matchSubject && !matchDate && !matchLoc) return false;
      }
      return true;
    });
  }, [events, categoryFilter, searchQuery]);

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(events, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `calendario_escolar_${getBrasiliaNowParts().isoDate}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6" id="coordinator-management-panel">
      {/* Coordinator Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Painel da Coordenação Pedagógica
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
                Área exclusiva para gerenciamento do calendário escolar oficial. Todas as alterações feitas aqui são sincronizadas instantaneamente para visualização dos alunos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={onSwitchToStudent}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
              id="coord-view-as-student-btn"
            >
              <GraduationCap className="w-4 h-4 text-emerald-300" />
              Ver como Aluno
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-3 mt-6 pt-5 border-t border-white/10 text-center">
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <p className="text-xl font-bold text-white">{stats.total}</p>
            <p className="text-[11px] text-emerald-200">Total de Eventos</p>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <p className="text-xl font-bold text-rose-300">{stats.provas}</p>
            <p className="text-[11px] text-emerald-200">Provas & Exames</p>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <p className="text-xl font-bold text-amber-300">{stats.trabalhos}</p>
            <p className="text-[11px] text-emerald-200">Apresentações</p>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <p className="text-xl font-bold text-teal-300">{stats.reunioes}</p>
            <p className="text-[11px] text-emerald-200">Reuniões de Pais</p>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <p className="text-xl font-bold text-lime-300">{stats.feiras}</p>
            <p className="text-[11px] text-emerald-200">Feiras & Eventos</p>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <p className="text-xl font-bold text-emerald-300">{stats.feriados}</p>
            <p className="text-[11px] text-emerald-200">Feriados/Recessos</p>
          </div>
        </div>
      </div>

      {!isCloudAdmin && onOpenAuthModal && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-100">
                Conecte sua conta Google para publicar na nuvem
              </h3>
              <p className="text-xs text-amber-800/90 dark:text-amber-200/90 mt-0.5">
                Para que novos eventos, tarefas, horários e cardápios fiquem visíveis para todos os alunos em qualquer dispositivo, conecte a conta Google autorizada da Coordenação.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shrink-0 self-start sm:self-auto cursor-pointer shadow-xs"
          >
            Conectar Conta Google
          </button>
        </div>
      )}

      {/* Event Add/Edit Form (Coordinators Only) */}
      <EventForm
        onAddEvent={onAddEvent}
        editingEvent={editingEvent}
        onUpdateEvent={onUpdateEvent}
        onCancelEdit={() => setEditingEvent(null)}
      />

      {/* Filter and Management Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Eventos Oficiais Cadastrados ({filteredEvents.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJSON}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              title="Exportar calendário em formato JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              Exportar
            </button>
            <button
              type="button"
              onClick={onResetDefaultEvents}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              title="Restaurar dados padrão da escola"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              Restaurar Padrão
            </button>
            {onDeleteAllEvents && events.length > 0 && (
              confirmDeleteAll ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmDeleteAll(false);
                      onDeleteAllEvents();
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Confirmar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteAll(false)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDeleteAll(true)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition flex items-center gap-1.5 cursor-pointer"
                  title="Remover todos os eventos e provas"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Excluir Todos
                </button>
              )
            )}
          </div>
        </div>

        {/* Search & Filter Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por prova, evento, data ou local..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setCategoryFilter('todas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                categoryFilter === 'todas'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Todos ({events.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('prova')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                categoryFilter === 'prova'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60'
              }`}
            >
              Provas ({stats.provas})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('trabalho')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                categoryFilter === 'trabalho'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60'
              }`}
            >
              Trabalhos ({stats.trabalhos})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('reuniao')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                categoryFilter === 'reuniao'
                  ? 'bg-teal-600 text-white'
                  : 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60'
              }`}
            >
              Reuniões ({stats.reunioes})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('feriado')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                categoryFilter === 'feriado'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
              }`}
            >
              Feriados ({stats.feriados})
            </button>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3" id="coordinator-events-list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              userRole="coordenador"
              onDelete={onDeleteEvent}
              onEdit={(target) => {
                setEditingEvent(target);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ))
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Info className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nenhum evento encontrado</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Use o formulário acima para cadastrar novos eventos escolares.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
