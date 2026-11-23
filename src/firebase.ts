import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import {
  Task,
  SchoolEvent,
  SchoolMeal,
  ClassPeriod,
  GradeSeries,
  EventCategory,
  DayOfWeek,
  MealType,
} from './types';
import {
  DEFAULT_TASKS,
  DEFAULT_EVENTS,
  DEFAULT_MEALS,
  DEFAULT_SCHEDULE,
  sanitizeSchedule,
} from './utils/storage';

export const BOOTSTRAPPED_ADMIN_EMAIL = 'rallyton.silva@aluno.edu.pi.gov.br';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

// Validate connection on module boot
void testConnection();

// ==================== AUTH HELPERS ====================

export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export async function signInCoordinatorWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutCoordinator(): Promise<void> {
  await signOut(auth);
}

export async function checkIsAdminUser(user: User | null): Promise<boolean> {
  if (!user || !user.emailVerified) return false;
  if (user.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()) {
    return true;
  }
  try {
    const adminSnap = await getDoc(doc(db, 'admins', user.uid));
    return adminSnap.exists();
  } catch {
    return false;
  }
}

// ==================== SANITIZATION HELPERS ====================

function sanitizeId(rawId: string, prefix: string): string {
  const cleaned = rawId.replace(/[^a-zA-Z0-9_\-]/g, '-').slice(0, 128);
  return cleaned || `${prefix}_${Date.now()}`;
}

function clampStr(value: string | undefined, maxLen: number): string {
  return (value ?? '').trim().slice(0, maxLen);
}

function toMillis(ts: unknown): number | undefined {
  if (typeof ts === 'number') return ts;
  if (ts instanceof Timestamp) return ts.toMillis();
  if (ts && typeof ts === 'object' && 'toMillis' in ts && typeof (ts as Timestamp).toMillis === 'function') {
    return (ts as Timestamp).toMillis();
  }
  return undefined;
}

function buildEventCreateDoc(event: SchoolEvent, authorUid: string) {
  const docData: Record<string, unknown> = {
    id: sanitizeId(event.id, 'ev'),
    title: clampStr(event.title, 160) || 'Evento Escolar',
    category: event.category,
    date: clampStr(event.date, 20),
    createdBy: clampStr(event.createdBy, 100) || 'Coordenação Pedagógica',
    authorUid,
    createdAt: serverTimestamp(),
  };
  const time = clampStr(event.time, 20);
  const location = clampStr(event.location, 120);
  const subject = clampStr(event.subject, 80);
  const description = clampStr(event.description, 1000);
  if (time) docData.time = time;
  if (location) docData.location = location;
  if (subject) docData.subject = subject;
  if (description) docData.description = description;
  return docData;
}

function buildEventUpdateDoc(event: SchoolEvent) {
  return {
    title: clampStr(event.title, 160) || 'Evento Escolar',
    category: event.category,
    date: clampStr(event.date, 20),
    time: clampStr(event.time, 20),
    location: clampStr(event.location, 120),
    subject: clampStr(event.subject, 80),
    description: clampStr(event.description, 1000),
    updatedAt: serverTimestamp(),
  };
}

function buildTaskCreateDoc(task: Task, authorUid: string) {
  return {
    id: sanitizeId(task.id, 'task'),
    title: clampStr(task.title, 200) || 'Tarefa',
    subject: clampStr(task.subject, 80) || 'Geral',
    date: clampStr(task.date, 20),
    priority: task.priority || 'media',
    authorUid,
    createdAt: serverTimestamp(),
  };
}

function normalizeGradeSeries(value: unknown): GradeSeries {
  if (value === '2_serie' || value === '3_serie') return value;
  return '1_serie';
}

function buildPeriodDoc(period: ClassPeriod, authorUid: string) {
  const docData: Record<string, unknown> = {
    id: sanitizeId(period.id, 'sch'),
    gradeSeries: normalizeGradeSeries(period.gradeSeries),
    dayOfWeek: period.dayOfWeek,
    periodNumber: Math.min(8, Math.max(1, Number(period.periodNumber) || 1)),
    startTime: clampStr(period.startTime, 10) || '07:30',
    endTime: clampStr(period.endTime, 10) || '08:20',
    subject: clampStr(period.subject, 80) || 'Aula',
    authorUid,
    updatedAt: serverTimestamp(),
  };
  const teacher = clampStr(period.teacher, 100);
  const room = clampStr(period.room, 60);
  const notes = clampStr(period.notes, 300);
  if (teacher) docData.teacher = teacher;
  if (room) docData.room = room;
  if (notes) docData.notes = notes;
  return docData;
}

function buildMealDoc(meal: SchoolMeal, authorUid: string) {
  const docData: Record<string, unknown> = {
    id: sanitizeId(meal.id, 'meal'),
    dayOfWeek: meal.dayOfWeek,
    mealType: meal.mealType,
    time: clampStr(meal.time, 30) || '12:00 - 13:00',
    title: clampStr(meal.title, 160) || 'Refeição Escolar',
    authorUid,
    updatedAt: serverTimestamp(),
  };
  const sides = clampStr(meal.sides, 200);
  const beverage = clampStr(meal.beverage, 120);
  const dessert = clampStr(meal.dessert, 120);
  const calories = clampStr(meal.calories, 40);
  const nutritionalNotes = clampStr(meal.nutritionalNotes, 300);
  if (sides) docData.sides = sides;
  if (beverage) docData.beverage = beverage;
  if (dessert) docData.dessert = dessert;
  if (calories) docData.calories = calories;
  if (nutritionalNotes) docData.nutritionalNotes = nutritionalNotes;
  if (Array.isArray(meal.allergens)) {
    docData.allergens = meal.allergens
      .map((a) => clampStr(a, 80))
      .filter(Boolean)
      .slice(0, 10);
  }
  return docData;
}

// ==================== SNAPSHOT SUBSCRIPTIONS ====================

export function subscribeEvents(
  onData: (events: SchoolEvent[], isEmpty: boolean) => void,
  onError?: (err: unknown) => void
): () => void {
  const path = 'events';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: SchoolEvent[] = snapshot.docs.map((d) => {
        const raw = d.data();
        return {
          id: String(raw.id || d.id),
          title: String(raw.title || ''),
          category: (raw.category as EventCategory) || 'evento',
          date: String(raw.date || ''),
          time: typeof raw.time === 'string' && raw.time ? raw.time : undefined,
          location: typeof raw.location === 'string' && raw.location ? raw.location : undefined,
          subject: typeof raw.subject === 'string' && raw.subject ? raw.subject : undefined,
          description:
            typeof raw.description === 'string' && raw.description ? raw.description : undefined,
          createdBy: typeof raw.createdBy === 'string' ? raw.createdBy : undefined,
          createdAt: toMillis(raw.createdAt),
        };
      });
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      onData(list, snapshot.empty);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribeTasks(
  onData: (tasks: Omit<Task, 'done'>[], isEmpty: boolean) => void,
  onError?: (err: unknown) => void
): () => void {
  const path = 'tasks';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: Omit<Task, 'done'>[] = snapshot.docs.map((d) => {
        const raw = d.data();
        return {
          id: String(raw.id || d.id),
          title: String(raw.title || ''),
          subject: String(raw.subject || ''),
          date: String(raw.date || ''),
          priority: (raw.priority as 'alta' | 'media' | 'baixa') || 'media',
          createdAt: toMillis(raw.createdAt),
        };
      });
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      onData(list, snapshot.empty);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribeSchedule(
  onData: (periods: ClassPeriod[], isEmpty: boolean) => void,
  onError?: (err: unknown) => void
): () => void {
  const path = 'schedule';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const rawList: ClassPeriod[] = snapshot.docs.map((d) => {
        const raw = d.data();
        return {
          id: String(raw.id || d.id),
          gradeSeries: normalizeGradeSeries(raw.gradeSeries),
          dayOfWeek: (raw.dayOfWeek as DayOfWeek) || 'segunda',
          periodNumber: Number(raw.periodNumber) || 1,
          startTime: String(raw.startTime || '07:30'),
          endTime: String(raw.endTime || '08:20'),
          subject: String(raw.subject || ''),
          teacher: typeof raw.teacher === 'string' && raw.teacher ? raw.teacher : undefined,
          room: typeof raw.room === 'string' && raw.room ? raw.room : undefined,
          notes: typeof raw.notes === 'string' && raw.notes ? raw.notes : undefined,
        };
      });
      onData(sanitizeSchedule(rawList), snapshot.empty);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribeMeals(
  onData: (meals: SchoolMeal[], isEmpty: boolean) => void,
  onError?: (err: unknown) => void
): () => void {
  const path = 'meals';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: SchoolMeal[] = snapshot.docs.map((d) => {
        const raw = d.data();
        return {
          id: String(raw.id || d.id),
          dayOfWeek: (raw.dayOfWeek as DayOfWeek) || 'segunda',
          mealType: (raw.mealType as MealType) || 'almoco',
          time: String(raw.time || ''),
          title: String(raw.title || ''),
          sides: typeof raw.sides === 'string' && raw.sides ? raw.sides : undefined,
          beverage: typeof raw.beverage === 'string' && raw.beverage ? raw.beverage : undefined,
          dessert: typeof raw.dessert === 'string' && raw.dessert ? raw.dessert : undefined,
          calories: typeof raw.calories === 'string' && raw.calories ? raw.calories : undefined,
          nutritionalNotes:
            typeof raw.nutritionalNotes === 'string' && raw.nutritionalNotes
              ? raw.nutritionalNotes
              : undefined,
          allergens: Array.isArray(raw.allergens)
            ? raw.allergens.filter((x: unknown): x is string => typeof x === 'string')
            : undefined,
          updatedAt: toMillis(raw.updatedAt),
        };
      });
      onData(list, snapshot.empty);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

// ==================== COORDINATOR MUTATIONS ====================

export async function createEventInFirestore(
  event: SchoolEvent,
  authorUid: string
): Promise<void> {
  const id = sanitizeId(event.id, 'ev');
  const path = `events/${id}`;
  try {
    await setDoc(doc(db, 'events', id), buildEventCreateDoc({ ...event, id }, authorUid));
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateEventInFirestore(
  event: SchoolEvent,
  authorUid: string
): Promise<void> {
  const id = sanitizeId(event.id, 'ev');
  const path = `events/${id}`;
  try {
    const ref = doc(db, 'events', id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, buildEventUpdateDoc(event));
    } else {
      await setDoc(ref, buildEventCreateDoc({ ...event, id }, authorUid));
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteEventInFirestore(eventId: string): Promise<void> {
  const id = sanitizeId(eventId, 'ev');
  const path = `events/${id}`;
  try {
    await deleteDoc(doc(db, 'events', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function createTaskInFirestore(task: Task, authorUid: string): Promise<void> {
  const id = sanitizeId(task.id, 'task');
  const path = `tasks/${id}`;
  try {
    await setDoc(doc(db, 'tasks', id), buildTaskCreateDoc({ ...task, id }, authorUid));
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteTaskInFirestore(taskId: string): Promise<void> {
  const id = sanitizeId(taskId, 'task');
  const path = `tasks/${id}`;
  try {
    await deleteDoc(doc(db, 'tasks', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveClassPeriodInFirestore(
  period: ClassPeriod,
  conflictingIds: string[],
  authorUid: string
): Promise<void> {
  const id = sanitizeId(period.id, 'sch');
  const path = `schedule/${id}`;
  try {
    const batch = writeBatch(db);
    for (const oldId of conflictingIds) {
      if (oldId && oldId !== id) {
        batch.delete(doc(db, 'schedule', sanitizeId(oldId, 'sch')));
      }
    }
    batch.set(doc(db, 'schedule', id), buildPeriodDoc({ ...period, id }, authorUid));
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteClassPeriodInFirestore(periodId: string): Promise<void> {
  const id = sanitizeId(periodId, 'sch');
  const path = `schedule/${id}`;
  try {
    await deleteDoc(doc(db, 'schedule', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveMealInFirestore(meal: SchoolMeal, authorUid: string): Promise<void> {
  const id = sanitizeId(meal.id, 'meal');
  const path = `meals/${id}`;
  try {
    await setDoc(doc(db, 'meals', id), buildMealDoc({ ...meal, id }, authorUid));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ==================== SEED & RESET HELPERS ====================

async function replaceCollection(
  collectionName: string,
  items: Array<{ id: string; data: Record<string, unknown> }>
): Promise<void> {
  const snapshot = await getDocs(collection(db, collectionName));
  const incomingIds = new Set(items.map((item) => item.id));
  const batch = writeBatch(db);

  snapshot.docs.forEach((existingDoc) => {
    if (!incomingIds.has(existingDoc.id)) {
      batch.delete(existingDoc.ref);
    }
  });

  items.forEach((item) => {
    batch.set(doc(db, collectionName, item.id), item.data);
  });

  await batch.commit();
}

export const LEGACY_EVENTS_CUTOFF_MS = 1795455530000;

export async function deleteAllEventsInFirestore(): Promise<void> {
  const path = 'events';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) return;
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function seedEmptyCollectionsIfNeeded(authorUid: string): Promise<void> {
  try {
    const [evSnap, taskSnap, schSnap, mealSnap] = await Promise.all([
      getDocs(collection(db, 'events')),
      getDocs(collection(db, 'tasks')),
      getDocs(collection(db, 'schedule')),
      getDocs(collection(db, 'meals')),
    ]);

    const batch = writeBatch(db);
    let ops = 0;

    // Remove legacy pre-populated events/exams created prior to cleanup
    evSnap.docs.forEach((d) => {
      const createdAtMs = toMillis(d.data().createdAt) ?? 0;
      if (createdAtMs <= LEGACY_EVENTS_CUTOFF_MS) {
        batch.delete(d.ref);
        ops++;
      }
    });

    if (taskSnap.empty) {
      DEFAULT_TASKS.forEach((t) => {
        const id = sanitizeId(t.id, 'task');
        batch.set(doc(db, 'tasks', id), buildTaskCreateDoc({ ...t, id }, authorUid));
        ops++;
      });
    }
    if (schSnap.empty) {
      DEFAULT_SCHEDULE.forEach((p) => {
        const id = sanitizeId(p.id, 'sch');
        batch.set(doc(db, 'schedule', id), buildPeriodDoc({ ...p, id }, authorUid));
        ops++;
      });
    } else {
      const existingSeries = new Set<GradeSeries>(
        schSnap.docs.map((d) => normalizeGradeSeries(d.data().gradeSeries))
      );
      DEFAULT_SCHEDULE.forEach((p) => {
        const series = normalizeGradeSeries(p.gradeSeries);
        if (!existingSeries.has(series)) {
          const id = sanitizeId(p.id, 'sch');
          batch.set(doc(db, 'schedule', id), buildPeriodDoc({ ...p, id }, authorUid));
          ops++;
        }
      });
    }
    if (mealSnap.empty) {
      DEFAULT_MEALS.forEach((m) => {
        const id = sanitizeId(m.id, 'meal');
        batch.set(doc(db, 'meals', id), buildMealDoc({ ...m, id }, authorUid));
        ops++;
      });
    }

    if (ops > 0) {
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'seed');
  }
}

export async function resetScheduleInFirestore(
  authorUid: string,
  targetSeries?: GradeSeries
): Promise<void> {
  try {
    if (targetSeries) {
      const snapshot = await getDocs(collection(db, 'schedule'));
      const targetDefaults = DEFAULT_SCHEDULE.filter(
        (p) => normalizeGradeSeries(p.gradeSeries) === targetSeries
      );
      const incomingIds = new Set(targetDefaults.map((p) => sanitizeId(p.id, 'sch')));
      const batch = writeBatch(db);

      snapshot.docs.forEach((existingDoc) => {
        const docSeries = normalizeGradeSeries(existingDoc.data().gradeSeries);
        if (docSeries === targetSeries && !incomingIds.has(existingDoc.id)) {
          batch.delete(existingDoc.ref);
        }
      });

      targetDefaults.forEach((p) => {
        const id = sanitizeId(p.id, 'sch');
        batch.set(doc(db, 'schedule', id), buildPeriodDoc({ ...p, id }, authorUid));
      });

      await batch.commit();
      return;
    }

    await replaceCollection(
      'schedule',
      DEFAULT_SCHEDULE.map((p) => {
        const id = sanitizeId(p.id, 'sch');
        return { id, data: buildPeriodDoc({ ...p, id }, authorUid) };
      })
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'schedule');
  }
}

export async function resetMealsInFirestore(authorUid: string): Promise<void> {
  try {
    await replaceCollection(
      'meals',
      DEFAULT_MEALS.map((m) => {
        const id = sanitizeId(m.id, 'meal');
        return { id, data: buildMealDoc({ ...m, id }, authorUid) };
      })
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'meals');
  }
}

export async function resetAllDefaultsInFirestore(authorUid: string): Promise<void> {
  try {
    await Promise.all([
      replaceCollection(
        'events',
        DEFAULT_EVENTS.map((ev) => {
          const id = sanitizeId(ev.id, 'ev');
          return { id, data: buildEventCreateDoc({ ...ev, id }, authorUid) };
        })
      ),
      replaceCollection(
        'tasks',
        DEFAULT_TASKS.map((t) => {
          const id = sanitizeId(t.id, 'task');
          return { id, data: buildTaskCreateDoc({ ...t, id }, authorUid) };
        })
      ),
      replaceCollection(
        'schedule',
        DEFAULT_SCHEDULE.map((p) => {
          const id = sanitizeId(p.id, 'sch');
          return { id, data: buildPeriodDoc({ ...p, id }, authorUid) };
        })
      ),
      replaceCollection(
        'meals',
        DEFAULT_MEALS.map((m) => {
          const id = sanitizeId(m.id, 'meal');
          return { id, data: buildMealDoc({ ...m, id }, authorUid) };
        })
      ),
    ]);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'reset_all');
  }
}
