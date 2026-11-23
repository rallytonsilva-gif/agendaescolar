import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Trash2,
  Edit3,
  Users,
  GraduationCap,
  Sparkles,
  Palmtree,
  Presentation,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { motion } from 'motion/react';
import { SchoolEvent, EventCategory, UserRole } from '../types';
import { getEventCategoryDetails, getDaysUntil } from '../utils/storage';

interface EventCardProps {
  event: SchoolEvent;
  userRole: UserRole;
  onDelete?: (id: string) => void;
  onEdit?: (event: SchoolEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  userRole,
  onDelete,
  onEdit,
}) => {
  const categoryDetails = getEventCategoryDetails(event.category);
  const countdown = getDaysUntil(event.date);

  const getCategoryIcon = (category: EventCategory) => {
    switch (category) {
      case 'prova':
        return <GraduationCap className="w-3.5 h-3.5" />;
      case 'trabalho':
        return <Presentation className="w-3.5 h-3.5" />;
      case 'reuniao':
        return <Users className="w-3.5 h-3.5" />;
      case 'feriado':
        return <Palmtree className="w-3.5 h-3.5" />;
      case 'evento':
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const isCoordinator = userRole === 'coordenador';

  // Format day and month abbreviation for elegant date block
  const dateInfo = React.useMemo(() => {
    try {
      if (event.date.includes('/')) {
        const parts = event.date.split('/');
        if (parts.length === 3) {
          const d = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
          const monthShort = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
          return { day: parts[0], month: monthShort };
        }
      } else if (event.date.includes('-')) {
        const parts = event.date.split('-');
        if (parts.length === 3) {
          const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
          const monthShort = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
          return { day: parts[2], month: monthShort };
        }
      }
    } catch {
      // Fallback
    }
    return null;
  }, [event.date]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white dark:bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all duration-200 shadow-xs"
      id={`event-card-${event.id}`}
    >
      <div className="flex items-start gap-4">
        {/* Elegant Calendar Date Block */}
        <div className="w-12 h-13 sm:w-14 sm:h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 flex flex-col items-center justify-center shrink-0 select-none shadow-2xs">
          <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
            {dateInfo?.month || 'DATA'}
          </span>
          <span className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 font-display leading-tight tabular-nums">
            {dateInfo?.day || '•'}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header Metadata Bar */}
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1.5 ${categoryDetails.badgeBg}`}
            >
              {getCategoryIcon(event.category)}
              {categoryDetails.label}
            </span>

            {event.subject && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                {event.subject}
              </span>
            )}

            {/* Countdown Badge */}
            {countdown.label && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  countdown.isToday
                    ? 'bg-rose-500 text-white animate-pulse'
                    : countdown.isPast
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    : countdown.days <= 3
                    ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                }`}
              >
                {countdown.label}
              </span>
            )}

            {!isCoordinator && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> Oficial
              </span>
            )}
          </div>

          {/* Event Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50 break-words mb-1 font-display">
            {event.title}
          </h3>

          {/* Description */}
          {event.description && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-2.5 leading-relaxed break-words">
              {event.description}
            </p>
          )}

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{event.date}</span>
            </div>

            {event.time && (
              <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>{event.time}</span>
              </div>
            )}

            {event.location && (
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span className="truncate max-w-[200px] sm:max-w-xs">{event.location}</span>
              </div>
            )}

            {event.createdBy && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
                <span>{event.createdBy}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons (Only for Coordinator) */}
        {isCoordinator ? (
          <div className="flex items-center gap-1 shrink-0">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(event)}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 flex items-center justify-center transition-all cursor-pointer active:scale-90"
                title="Editar evento"
                aria-label="Editar evento"
                id={`edit-event-${event.id}`}
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(event.id)}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 flex items-center justify-center transition-all cursor-pointer active:scale-90"
                title="Excluir evento"
                aria-label="Excluir evento"
                id={`delete-event-${event.id}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div
            className="w-7 h-7 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center shrink-0 cursor-default"
            title="Evento oficial publicado pela coordenação (somente leitura para alunos)"
          >
            <Lock className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    </motion.div>
  );
};
