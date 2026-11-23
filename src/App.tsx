/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { AnimatePresence } from 'motion/react';
import { Task, SchoolEvent, EventCategory, FilterStatus, MainViewTab, UserRole, ThemeMode, SchoolMeal, ClassPeriod } from './types';
import {
  getStoredTasks,
  saveStoredTasks,
  DEFAULT_TASKS,
  getStoredEvents,
  saveStoredEvents,
  DEFAULT_EVENTS,
  getStoredMeals,
  saveStoredMeals,
  DEFAULT_MEALS,
  getStoredSchedule,
  saveStoredSchedule,
  sanitizeSchedule,
  DEFAULT_SCHEDULE,
  getStoredRole,
  saveStoredRole,
  getStoredTheme,
  saveStoredTheme,
  runStorageMigrations,
} from './utils/storage';
import { Header } from './components/Header';
import { StatsBanner } from './components/StatsBanner';
import { TaskForm } from './components/TaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskCard } from './components/TaskCard';
import { EmptyState } from './components/EmptyState';
import { EventsView } from './components/EventsView';
import { CalendarMonthView } from './components/CalendarMonthView';
import { ClassScheduleView } from './components/ClassScheduleView';
import { MealsScheduleView } from './components/MealsScheduleView';
import { GamesHubView } from './components/GamesHubView';
import { CoordinatorPanel } from './components/CoordinatorPanel';
import { RoleAuthModal } from './components/RoleAuthModal';
import { GraduationCap, ShieldCheck, Lock } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [meals, setMeals] = useState<SchoolMeal[]>([]);
  const [schedule, setSchedule] = useState<ClassPeriod[]>([]);
  const [userRole, setUserRole] = useState<UserRole>('aluno');
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<MainViewTab>('tarefas');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('todas');
  const [selectedSubject, setSelectedSubject] = useState('todas');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync theme with DOM and localStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveStoredTheme(theme);
  }, [theme]);

  // Carregar dados salvos no localStorage e executar migrações
  useEffect(() => {
    runStorageMigrations();
    const loadedTasks = getStoredTasks();
    const loadedEvents = getStoredEvents();
    const loadedMeals = getStoredMeals();
    const loadedSchedule = getStoredSchedule();
    const loadedRole = getStoredRole();
    const loadedTheme = getStoredTheme();
    setTasks(loadedTasks);
    setEvents(loadedEvents);
    setMeals(loadedMeals);
    setSchedule(loadedSchedule);
    setUserRole(loadedRole);
    setTheme(loadedTheme);
    setIsLoaded(true);

    const handleStorageSync = () => {
      setTasks(getStoredTasks());
      setEvents(getStoredEvents());
      setMeals(getStoredMeals());
      setSchedule(getStoredSchedule());
      setUserRole(getStoredRole());
      setTheme(getStoredTheme());
    };
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      showToast(nextTheme === 'dark' ? '🥷 Modo Ninja ativado!' : 'Modo Claro ativado!');
      return nextTheme;
    });
  };

  // Salvar tarefas no localStorage
  const updateAndSaveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    saveStoredTasks(newTasks);
  };

  // Salvar eventos no localStorage
  const updateAndSaveEvents = (newEvents: SchoolEvent[]) => {
    setEvents(newEvents);
    saveStoredEvents(newEvents);
  };

  // Alterar papel do usuário (Aluno / Coordenador)
  const handleRoleChange = (newRole: UserRole) => {
    setUserRole(newRole);
    saveStoredRole(newRole);
    if (newRole === 'coordenador') {
      setActiveTab('coordenacao');
    } else if (activeTab === 'coordenacao') {
      setActiveTab('eventos');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Task actions (Apenas Coordenadores podem adicionar ou excluir tarefas oficiais)
  const handleAddTask = (
    title: string,
    subject: string,
    date: string,
    priority: 'alta' | 'media' | 'baixa'
  ) => {
    if (userRole !== 'coordenador') {
      showToast('Apenas no modo Coordenador é permitido adicionar tarefas.');
      return;
    }

    const newTask: Task = {
      id: String(Date.now()),
      title,
      subject,
      date,
      done: false,
      priority,
      createdAt: Date.now(),
    };

    const updatedTasks = [newTask, ...tasks];
    updateAndSaveTasks(updatedTasks);
    showToast(`Tarefa "${title}" adicionada com sucesso!`);
  };

  const handleToggleTask = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    const willBeDone = target ? !target.done : false;

    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    );

    updateAndSaveTasks(updatedTasks);

    if (willBeDone) {
      const remainingPending = updatedTasks.filter((t) => !t.done).length;
      if (remainingPending === 0 && updatedTasks.length > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleDeleteTask = (id: string) => {
    if (userRole !== 'coordenador') {
      showToast('Apenas no modo Coordenador é permitido excluir tarefas.');
      return;
    }

    const target = tasks.find((t) => t.id === id);
    const updatedTasks = tasks.filter((task) => task.id !== id);
    updateAndSaveTasks(updatedTasks);
    if (target) {
      showToast(`Tarefa removida pela Coordenação.`);
    }
  };

  // Event actions (Exclusivo para Coordenadores)
  const handleAddEvent = (
    title: string,
    category: EventCategory,
    date: string,
    time?: string,
    location?: string,
    subject?: string,
    description?: string
  ) => {
    if (userRole !== 'coordenador') {
      showToast('Apenas no modo Coordenador é permitido criar eventos.');
      return;
    }

    const newEvent: SchoolEvent = {
      id: `ev_${Date.now()}`,
      title,
      category,
      date,
      time,
      location,
      subject,
      description,
      createdBy: 'Coordenação Pedagógica',
      createdAt: Date.now(),
    };

    const updatedEvents = [newEvent, ...events];
    updateAndSaveEvents(updatedEvents);
    showToast(`Evento "${title}" publicado pela Coordenação!`);
  };

  const handleUpdateEvent = (updated: SchoolEvent) => {
    if (userRole !== 'coordenador') {
      showToast('Apenas no modo Coordenador é permitido alterar eventos.');
      return;
    }

    const updatedEvents = events.map((e) => (e.id === updated.id ? updated : e));
    updateAndSaveEvents(updatedEvents);
    showToast(`Evento "${updated.title}" atualizado pela Coordenação!`);
  };

  const handleDeleteEvent = (id: string) => {
    if (userRole !== 'coordenador') {
      showToast('Apenas no modo Coordenador é permitido excluir eventos.');
      return;
    }

    const target = events.find((e) => e.id === id);
    const updatedEvents = events.filter((e) => e.id !== id);
    updateAndSaveEvents(updatedEvents);
    if (target) {
      showToast(`Evento excluído pela Coordenação.`);
    }
  };

  const handleResetToDefaults = () => {
    if (userRole !== 'coordenador') {
      showToast('Apenas no modo Coordenador é permitido restaurar os dados da escola.');
      return;
    }

    updateAndSaveTasks(DEFAULT_TASKS);
    updateAndSaveEvents(DEFAULT_EVENTS);
    setMeals(DEFAULT_MEALS);
    saveStoredMeals(DEFAULT_MEALS);
    setSchedule(DEFAULT_SCHEDULE);
    saveStoredSchedule(DEFAULT_SCHEDULE);
    showToast('Tarefas, eventos, cardápio e horários restaurados pela Coordenação!');
  };

  const handleUpdateMeal = (updatedMeal: SchoolMeal) => {
    if (userRole !== 'coordenador') {
      showToast('Apenas no modo Coordenador é permitido alterar a merenda escolar.');
      return;
    }

    const updatedMeals = meals.map((m) => (m.id === updatedMeal.id ? updatedMeal : m));
    setMeals(updatedMeals);
    saveStoredMeals(updatedMeals);
  };

  const handleResetMeals = () => {
    if (userRole !== 'coordenador') {
      showToast('Apenas no modo Coordenador é permitido restaurar o cardápio da merenda.');
      return;
    }

    setMeals(DEFAULT_MEALS);
    saveStoredMeals(DEFAULT_MEALS);
  };

  // Schedule / Horários handlers
  const handleUpdatePeriod = (updatedPeriod: ClassPeriod) => {
    if (userRole !== 'coordenador') {
      showToast('Apenas no modo Coordenador é permitido alterar a grade de horários.');
      return;
    }

    setSchedule((prev) => {
      const cleaned = prev.filter(
        (p) =>
          p.id !== updatedPeriod.id &&
          !(p.dayOfWeek === updatedPeriod.dayOfWeek && p.periodNumber === updatedPeriod.periodNumber)
      );
      const updated = sanitizeSchedule([...cleaned, updatedPeriod]);
      saveStoredSchedule(updated);
      return updated;
    });
  };

  const handleDeletePeriod = (periodId: string) => {
    if (userRole !== 'coordenador') {
      showToast('Apenas no modo Coordenador é permitido remover aulas.');
      return;
    }

    setSchedule((prev) => {
      const updated = prev.filter((p) => p.id !== periodId);
      saveStoredSchedule(updated);
      return updated;
    });
  };

  const handleResetSchedule = () => {
    if (userRole !== 'coordenador') {
      showToast('Apenas no modo Coordenador é permitido restaurar a grade de horários.');
      return;
    }

    setSchedule(DEFAULT_SCHEDULE);
    saveStoredSchedule(DEFAULT_SCHEDULE);
  };

  const handleQuickCreateTaskForSubject = (subject: string) => {
    if (userRole !== 'coordenador') {
      showToast('Apenas o Coordenador pode cadastrar novas tarefas para as matérias.');
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedSubject(subject);
    setActiveTab('tarefas');
    showToast(`Filtrado por "${subject}". Adicione sua lição no formulário acima!`);
  };

  // Distinct subjects for task filters
  const availableSubjects = useMemo(() => {
    const subjects = new Set<string>();
    tasks.forEach((t) => {
      if (t.subject?.trim()) {
        subjects.add(t.subject.trim());
      }
    });
    return Array.from(subjects).sort();
  }, [tasks]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (statusFilter === 'pendentes' && task.done) return false;
      if (statusFilter === 'concluidas' && !task.done) return false;

      if (
        selectedSubject !== 'todas' &&
        task.subject.toLowerCase() !== selectedSubject.toLowerCase()
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchSubject = task.subject.toLowerCase().includes(query);
        const matchDate = task.date.toLowerCase().includes(query);
        if (!matchTitle && !matchSubject && !matchDate) return false;
      }

      return true;
    });
  }, [tasks, statusFilter, selectedSubject, searchQuery]);

  const counts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.done).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  const isFiltered =
    searchQuery.trim().length > 0 ||
    statusFilter !== 'todas' ||
    selectedSubject !== 'todas';

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F4F7F6] dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased transition-colors duration-200 relative overflow-x-hidden bg-grid-subtle">
      {/* Ambient background glow accents */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[380px] bg-gradient-to-b from-emerald-500/12 via-teal-500/6 to-transparent dark:from-emerald-600/18 dark:via-teal-600/10 dark:to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[600px] right-0 w-[500px] h-[500px] bg-teal-500/8 dark:bg-teal-500/12 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with View Tabs and Role Indicator */}
        <Header
          totalTasks={counts.total}
          totalEvents={events.length}
          activeTab={activeTab}
          userRole={userRole}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onTabChange={setActiveTab}
          onResetToDefaults={handleResetToDefaults}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        {/* View Tab 1: Tasks / Tarefas (Personal task tracking for student/coord) */}
        {activeTab === 'tarefas' && (
          <div id="tab-content-tarefas" className="space-y-6">
            {/* Stats Progress Banner */}
            {counts.total > 0 && (
              <StatsBanner
                total={counts.total}
                completed={counts.completed}
                pending={counts.pending}
              />
            )}

            {/* Add Task Form or Student Read-Only Notice */}
            {userRole === 'coordenador' ? (
              <TaskForm onAddTask={handleAddTask} />
            ) : (
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/50">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-display">
                        Painel do Aluno
                      </h3>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        · Visualização e acompanhamento
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Tarefas e lições escolares oficiais cadastradas e organizadas pela Coordenação Pedagógica.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50/70 dark:hover:bg-slate-750 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer shadow-xs active:scale-95"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  Entrar como Coordenador (PIN)
                </button>
              </div>
            )}

            {/* Filters & Search */}
            {counts.total > 0 && (
              <TaskFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                selectedSubject={selectedSubject}
                onSubjectChange={setSelectedSubject}
                availableSubjects={availableSubjects}
                counts={counts}
              />
            )}

            {/* Task List */}
            <div className="space-y-2.5" id="task-list-container">
              <AnimatePresence mode="popLayout">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      userRole={userRole}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                    />
                  ))
                ) : (
                  <EmptyState
                    isFiltered={isFiltered}
                    onClearFilters={() => {
                      setSearchQuery('');
                      setStatusFilter('todas');
                      setSelectedSubject('todas');
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* View Tab 2: Events / Eventos (Read-only for Students, Full Edit for Coordinators) */}
        {activeTab === 'eventos' && (
          <div id="tab-content-eventos">
            <EventsView
              events={events}
              userRole={userRole}
              onAddEvent={handleAddEvent}
              onUpdateEvent={handleUpdateEvent}
              onDeleteEvent={handleDeleteEvent}
              onResetDefaultEvents={handleResetToDefaults}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
            />
          </div>
        )}

        {/* View Tab 3: Calendar View / Visão Calendário */}
        {activeTab === 'calendario' && (
          <div id="tab-content-calendario">
            <CalendarMonthView
              tasks={tasks}
              events={events}
              onToggleTask={handleToggleTask}
            />
          </div>
        )}

        {/* View Tab 4: School Class Schedule / Horários das Matérias da Semana */}
        {activeTab === 'horarios' && (
          <div id="tab-content-horarios">
            <ClassScheduleView
              schedule={schedule}
              userRole={userRole}
              onUpdatePeriod={handleUpdatePeriod}
              onDeletePeriod={handleDeletePeriod}
              onResetSchedule={handleResetSchedule}
              onQuickCreateTaskForSubject={handleQuickCreateTaskForSubject}
              onNavigateToGames={() => setActiveTab('jogos')}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
              onSuccessToast={showToast}
            />
          </div>
        )}

        {/* View Tab 5: School Meals & Lunch Schedule / Agenda da Merenda e Almoço */}
        {activeTab === 'merenda' && (
          <div id="tab-content-merenda">
            <MealsScheduleView
              meals={meals}
              userRole={userRole}
              onUpdateMeal={handleUpdateMeal}
              onResetMeals={handleResetMeals}
              onSuccessToast={showToast}
            />
          </div>
        )}

        {/* View Tab 6: School Break & Educational Games / Espaço de Jogos e Recreio */}
        {activeTab === 'jogos' && (
          <div id="tab-content-jogos">
            <GamesHubView onSuccessToast={showToast} />
          </div>
        )}

        {/* View Tab 7: Coordinator Management Panel (Exclusive Coordinator Area) */}
        {activeTab === 'coordenacao' && userRole === 'coordenador' && (
          <div id="tab-content-coordenacao">
            <CoordinatorPanel
              events={events}
              onAddEvent={handleAddEvent}
              onUpdateEvent={handleUpdateEvent}
              onDeleteEvent={handleDeleteEvent}
              onResetDefaultEvents={handleResetToDefaults}
              onSwitchToStudent={() => handleRoleChange('aluno')}
            />
          </div>
        )}

        {/* Modal de Autenticação / Troca de Perfil de Acesso */}
        <RoleAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          currentRole={userRole}
          onRoleChange={handleRoleChange}
          onSuccessToast={showToast}
        />

        {/* Minimal Clean Footer */}
        <footer className="mt-12 pt-6 pb-4 border-t border-slate-200/60 dark:border-slate-800/60 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
          <p>Agenda Escolar do CETI Miguel Arcoverde • Organização de Estudos, Provas & Calendário Letivo</p>
        </footer>

        {/* Toast Feedback */}
        {toastMessage && (
          <div
            className="fixed bottom-6 right-6 bg-slate-900/95 dark:bg-slate-800 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700/50 backdrop-blur-md text-xs sm:text-sm font-semibold flex items-center gap-2.5 z-50 animate-bounce-short"
            id="toast-notification"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
