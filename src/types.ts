export interface Task {
  id: string;
  title: string;
  subject: string;
  date: string;
  done: boolean;
  priority?: 'alta' | 'media' | 'baixa';
  createdAt?: number;
}

export type EventCategory = 'prova' | 'trabalho' | 'reuniao' | 'evento' | 'feriado';

export interface SchoolEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string; // DD/MM/YYYY
  time?: string; // HH:mm
  location?: string;
  subject?: string;
  description?: string;
  createdBy?: string;
  createdAt?: number;
}

export type FilterStatus = 'todas' | 'pendentes' | 'concluidas';
export type MainViewTab = 'tarefas' | 'eventos' | 'calendario' | 'horarios' | 'merenda' | 'jogos' | 'coordenacao';
export type UserRole = 'aluno' | 'coordenador';
export type ThemeMode = 'light' | 'dark';

export type DayOfWeek = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta';
export type MealType = 'merenda_manha' | 'almoco' | 'merenda_tarde';
export type GradeSeries = '1_serie' | '2_serie' | '3_serie';

export interface ClassPeriod {
  id: string;
  gradeSeries?: GradeSeries;
  periodNumber: number; // 1, 2, 3, 4, 5, 6, 7, 8
  startTime: string; // "07:00"
  endTime: string; // "08:00"
  dayOfWeek: DayOfWeek;
  subject: string;
  teacher?: string;
  room?: string;
  notes?: string;
}

export interface SchoolMeal {
  id: string;
  dayOfWeek: DayOfWeek;
  mealType: MealType;
  title: string;
  time: string;
  sides?: string;
  beverage?: string;
  dessert?: string;
  allergens?: string[];
  calories?: string;
  nutritionalNotes?: string;
  updatedAt?: number;
}

export interface SubjectColor {
  bg: string;
  text: string;
  border: string;
  accent: string;
}
