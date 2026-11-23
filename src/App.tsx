/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { User } from 'firebase/auth';
import confetti from 'canvas-confetti';
import { AnimatePresence } from 'motion/react';
import {
  Task,
  SchoolEvent,
  EventCategory,
  FilterStatus,
  MainViewTab,
  UserRole,
  ThemeMode,
  SchoolMeal,
  ClassPeriod,
} from './types';
import {
  DEFAULT_TASKS,
  DEFAULT_EVENTS,
  DEFAULT_MEALS,
  DEFAULT_SCHEDULE,
  getStoredRole,
  saveStoredRole,
  getStoredTheme,
  saveStoredTheme,
  getCompletedTaskIds,
  saveCompletedTaskIds,
  runStorageMigrations,
} from './utils/storage';
import {
  subscribeToAuth,
  checkIsAdminUser,
  subscribeEvents,
  subscribeTasks,
  subscribeSchedule,
  subscribeMeals,
  createEventInFirestore,
  updateEventInFirestore,
  deleteEventInFirestore,
  createTaskInFirestore,
  deleteTaskInFirestore,
  saveClassPeriodInFirestore,
  deleteClassPeriodInFirestore,
  saveMealInFirestore,
  seedEmptyCollectionsIfNeeded,
  resetScheduleInFirestore,
  resetMealsInFirestore,
  resetAllDefaultsInFirestore,
} from './firebase';
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
import { GraduationCap, ShieldCheck } from 'lucide-react';

export default function App() {
  const [rawTasks, setRawTasks] = useState<Omit<Task, 'done'>[]>([]);
  const [rawEvents, setRawEvents] = useState<SchoolEvent[]>([]);
  const [rawMeals, setRawMeals] = useState<SchoolMeal[]>([]);
  const [rawSchedule, setRawSchedule] = useState<ClassPeriod[]>([]);

  const [tasksEmpty, setTasksEmpty] = useState(true);
  const [eventsEmpty, setEventsEmpty] = useState(true);
  const [mealsEmpty, setMealsEmpty] = useState(true);
  const [scheduleEmpty, setScheduleEmpty] = useState(true);

  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [eventsLoaded, setEventsLoaded] = useState(false);
  const [mealsLoaded, setMealsLoaded] = useState(false);
  const [scheduleLoaded, setScheduleLoaded] = useState(false);

  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => getCompletedTaskIds());
  const [userRole, setUserRole] = useState<UserRole>(getStoredRole);
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isCloudAdmin, setIsCloudAdmin] = useState(false);

  const [activeTab, setActiveTab] = useState<MainViewTab>('tarefas');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('todas');
  const [selectedSubject, setSelectedSubject] = useState('todas');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [fatalError, setFatalError] = useState<Error | null>(null);
  const seededForUidRef = useRef<string | null>(null);

  if (fatalError) {
    throw fatalError;
  }

  // Sync theme with DOM and localStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveStoredTheme(theme);
  }, [theme]);

  // Run local storage migrations and sync local preferences across tabs
  useEffect(() => {
    runStorageMigrations();
    setUserRole(getStoredRole());
    setTheme(getStoredTheme());
    setCompletedTaskIds(getCompletedTaskIds());

    const handleStorageSync = () => {
      setUserRole(getStoredRole());
      setTheme(getStoredTheme());
      setCompletedTaskIds(getCompletedTaskIds());
    };
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

  // Subscribe to Firebase Auth & verify Coordinator admin status
  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (user) => {
      setAuthUser(user);
      const admin = await checkIsAdminUser(user);
      setIsCloudAdmin(admin);

      if (admin && user && seededForUidRef.current !== user.uid) {
        seededForUidRef.current = user.uid;
        try {
          await seedEmptyCollectionsIfNeeded(user.uid);
        } catch (err) {
          setFatalError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to real-time Firestore collections so all visitors see Coordinator updates immediately
  useEffect(() => {
    const handleStreamError = (err: unknown) => {
      setFatalError(err instanceof Error ? err : new Error(String(err)));
    };

    const unsubEvents = subscribeEvents((list, isEmpty) => {
      setRawEvents(list);
      setEventsEmpty(isEmpty);
      setEventsLoaded(true);
    }, handleStreamError);

    const unsubTasks = subscribeTasks((list, isEmpty) => {
      setRawTasks(list);
      setTasksEmpty(isEmpty);
      setTasksLoaded(true);
    }, handleStreamError);

    const unsubSchedule = subscribeSchedule((list, isEmpty) => {
      setRawSchedule(list);
      setScheduleEmpty(isEmpty);
      setScheduleLoaded(true);
    }, handleStreamError);

    const unsubMeals = subscribeMeals((list, isEmpty) => {
      setRawMeals(list);
      setMealsEmpty(isEmpty);
      setMealsLoaded(true);
    }, handleStreamError);

    return () => {
      unsubEvents();
      unsubTasks();
      unsubSchedule();
      unsubMeals();
    };
  }, []);

  const isLoaded = tasksLoaded && eventsLoaded && mealsLoaded && scheduleLoaded;
  const dbInitialized = !eventsEmpty || !tasksEmpty || !scheduleEmpty || !mealsEmpty;

  const events = useMemo(() => {
    if (!dbInitialized && eventsEmpty) return DEFAULT_EVENTS;
    return rawEvents;
  }, [dbInitialized, eventsEmpty, rawEvents]);

  const schedule = useMemo(() => {
    if (scheduleEmpty) return DEFAULT_SCHEDULE;
    return rawSchedule;
  }, [scheduleEmpty, rawSchedule]);

  const meals = useMemo(() => {
    if (mealsEmpty) return DEFAULT_MEALS;
    return rawMeals;
  }, [mealsEmpty, rawMeals]);

  const tasks: Task[] = useMemo(() => {
    const base = !dbInitialized && tasksEmpty ? DEFAULT_TASKS : rawTasks;
    const completedSet = new Set(completedTaskIds);
    return base.map((t) => ({
      ...t,
      done: completedSet.has(t.id),
    }));
  }, [dbInitialized, tasksEmpty, rawTasks, completedTaskIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3400);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      showToast(nextTheme === 'dark' ? 'Modo Ninja ativado!' : 'Modo Claro ativado!');
      return nextTheme;
    });
  };

  const handleRoleChange = (newRole: UserRole) => {
    setUserRole(newRole);
    saveStoredRole(newRole);
    if (newRole === 'coordenador') {
      setActiveTab('coordenacao');
    } else if (activeTab === 'coordenacao') {
      setActiveTab('eventos');
    }
  };

  const requireCloudAdmin = (): User | null => {
    if (userRole !== 'coordenador') {
      showToast('Apenas no modo Coordenador é permitido alterar os dados da escola.');
      setIsAuthModalOpen(true);
      return null;
    }
    if (!authUser || !isCloudAdmin) {
      showToast('Conecte a conta Google da Coordenação para salvar e publicar para todos.');
      setIsAuthModalOpen(true);
      return null;
    }
    return authUser;
  };

  // Task actions
  const handleAddTask = async (
    title: string,
    subject: string,
    date: string,
    priority: 'alta' | 'media' | 'baixa'
  ) => {
    const adminUser = requireCloudAdmin();
    if (!adminUser) return;

    const newTask: Task = {
      id: `task_${Date.now()}`,
      title,
      subject,
      date,
      done: false,
      priority,
      createdAt: Date.now(),
    };

    try {
      await createTaskInFirestore(newTask, adminUser.uid);
      showToast(`Tarefa "${title}" publicada para todos os alunos!`);
    } catch (err) {
      setFatalError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  const handleToggleTask = (id: string) => {
    const isCurrentlyDone = completedTaskIds.includes(id);
    const nextIds = isCurrentlyDone
      ? completedTaskIds.filter((item) => item !== id)
      : [...completedTaskIds, id];

    setCompletedTaskIds(nextIds);
    saveCompletedTaskIds(nextIds);

    if (!isCurrentlyDone) {
      const nextSet = new Set(nextIds);
      const remainingPending = tasks.filter((t) => !nextSet.has(t.id)).length;
      if (remainingPending === 0 && tasks.length > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleDeleteTask = async (id: string) => {
    const adminUser = requireCloudAdmin();
    if (!adminUser) return;

    try {
      await deleteTaskInFirestore(id);
      showToast('Tarefa removida pela Coordenação.');
    } catch (err) {
      setFatalError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  // Event actions (Exclusivo para Coordenadores -> sincroniza em tempo real para todos)
  const handleAddEvent = async (
    title: string,
    category: EventCategory,
    date: string,
    time?: string,
    location?: string,
    subject?: string,
    description?: string
  ) => {
    const adminUser = requireCloudAdmin();
    if (!adminUser) return;

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

    try {
      await createEventInFirestore(newEvent, adminUser.uid);
      showToast(`Evento "${title}" publicado para todos os alunos!`);
    } catch (err) {
      setFatalError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  const handleUpdateEvent = async (updated: SchoolEvent) => {
    const adminUser = requireCloudAdmin();
    if (!adminUser) return;

    try {
      await updateEventInFirestore(updated, adminUser.uid);
      showToast(`Evento "${updated.title}" atualizado para todos!`);
    } catch (err) {
      setFatalError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  const handleDeleteEvent = async (id: string) => {
    const adminUser = requireCloudAdmin();
    if (!adminUser) return;

    try {
      await deleteEventInFirestore(id);
      showToast('Evento excluído pela Coordenação.');
    } catch (err) {
      setFatalError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  const handleResetToDefaults = async () => {
    const adminUser = requireCloudAdmin();
    if (!adminUser) return;

    try {
      await resetAllDefaultsInFirestore(adminUser.uid);
      showToast('Tarefas, eventos, cardápio e horários restaurados para todos!');
    } catch (err) {
      setFatalError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  const handleUpdateMeal = async (updatedMeal: SchoolMeal) => {
    const adminUser = requireCloudAdmin();
    if (!adminUser) return;

    try {
      await saveMealInFirestore(updatedMeal, adminUser.uid);
    } catch (err) {
      setFatalError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  const handleResetMeals = async () => {
    const adminUser = requireCloudAdmin();
    if (!adminUser) return;

    try {
      await resetMealsInFirestore(adminUser.uid);
    } catch (err) {
      setFatalError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  // Schedule / Horários handlers
  const handleUpdatePeriod = async (updatedPeriod: ClassPeriod) => {
    const adminUser = requireCloudAdmin();
    if (!adminUser) return;

    const conflictingIds = schedule
      .filter(
        (p) =>
          p.id !== updatedPeriod.id &&
          p.dayOfWeek === updatedPeriod.dayOfWeek &&
          p.periodNumber === updatedPeriod.periodNumber
      )
      .map((p) => p.id);

    try {
      await saveClassPeriodInFirestore(updatedPeriod, conflictingIds, adminUser.uid);
    } catch (err) {
      setFatalError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  const handleDeletePeriod = async (periodId: string) => {
    const adminUser = requireCloudAdmin();
    if (!adminUser) return;

    try {
      await deleteClassPeriodInFirestore(periodId);
    } catch (err) {
      setFatalError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  const handleResetSchedule = async () => {
    const adminUser = requireCloudAdmin();
    if (!adminUser) return;

    try {
      await resetScheduleInFirestore(adminUser.uid);
    } catch (err) {
      setFatalError(err instanceof Error ? err : new Error(String(err)));
    }
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

        {/* View Tab 1: Tasks / Tarefas */}
        {activeTab === 'tarefas' && (
          <div id="tab-content-tarefas" className="space-y-6">
            {counts.total > 0 && (
              <StatsBanner
                total={counts.total}
                completed={counts.completed}
                pending={counts.pending}
              />
            )}

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

        {/* View Tab 2: Events / Eventos */}
        {activeTab === 'eventos' && (
          <div id="tab-content-eventos">
            <EventsView
              events={events}
              userRole={userRole}
              isCloudAdmin={isCloudAdmin}
              onAddEvent={handleAddEvent}
              onUpdateEvent={handleUpdateEvent}
              onDeleteEvent={handleDeleteEvent}
              onResetDefaultEvents={handleResetToDefaults}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
            />
          </div>
        )}

        {/* View Tab 3: Calendar View */}
        {activeTab === 'calendario' && (
          <div id="tab-content-calendario">
            <CalendarMonthView
              tasks={tasks}
              events={events}
              onToggleTask={handleToggleTask}
            />
          </div>
        )}

        {/* View Tab 4: Class Schedule */}
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

        {/* View Tab 5: School Meals */}
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

        {/* View Tab 6: Games */}
        {activeTab === 'jogos' && (
          <div id="tab-content-jogos">
            <GamesHubView onSuccessToast={showToast} />
          </div>
        )}

        {/* View Tab 7: Coordinator Management Panel */}
        {activeTab === 'coordenacao' && userRole === 'coordenador' && (
          <div id="tab-content-coordenacao">
            <CoordinatorPanel
              events={events}
              isCloudAdmin={isCloudAdmin}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
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
          authUser={authUser}
          isCloudAdmin={isCloudAdmin}
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
