import { Task, SchoolEvent, EventCategory, UserRole, ThemeMode, SchoolMeal, DayOfWeek, MealType, ClassPeriod, GradeSeries } from '../types';

export const STORAGE_KEY = '@school_agenda_tasks';
export const EVENTS_STORAGE_KEY = '@school_agenda_events';
export const MEALS_STORAGE_KEY = '@school_agenda_meals';
export const SCHEDULE_STORAGE_KEY = '@school_agenda_schedule';
export const ROLE_STORAGE_KEY = '@school_agenda_user_role';
export const PIN_STORAGE_KEY = '@school_agenda_coord_pin';
export const THEME_STORAGE_KEY = '@school_agenda_theme';
export const SCHEDULE_MIGRATION_KEY = '@school_agenda_schedule_8periods_migrated';
export const DATA_VERSION_KEY = '@school_agenda_data_version';
export const COMPLETED_TASK_IDS_KEY = '@school_agenda_completed_task_ids';
export const SELECTED_SERIES_STORAGE_KEY = '@school_agenda_selected_series';
export const CURRENT_DATA_VERSION = '2026-11-23-v2';

export const DEFAULT_TASKS: Task[] = [
  {
    id: '1',
    title: 'Trabalho sobre a Revolução Francesa',
    subject: 'História',
    date: '25/08/2026',
    done: false,
    priority: 'alta',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: '2',
    title: 'Exercícios de Trigonometria da pág. 112',
    subject: 'Matemática',
    date: '22/08/2026',
    done: false,
    priority: 'media',
    createdAt: Date.now() - 86400000,
  },
  {
    id: '3',
    title: 'Redação: O impacto da tecnologia na educação',
    subject: 'Português',
    date: '21/08/2026',
    done: true,
    priority: 'alta',
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: '4',
    title: 'Relatório do laboratório de Genética',
    subject: 'Biologia',
    date: '28/08/2026',
    done: false,
    priority: 'baixa',
    createdAt: Date.now() - 3600000,
  },
];

export const DEFAULT_EVENTS: SchoolEvent[] = [];

export const DEFAULT_MEALS: SchoolMeal[] = [
  // Segunda-feira
  {
    id: 'm-seg-1',
    dayOfWeek: 'segunda',
    mealType: 'merenda_manha',
    title: 'Iogurte com Aveia e Biscoito de Polvilho Artesanal',
    time: '09:30 - 09:50',
    beverage: 'Água de coco natural ou leite integral',
    dessert: 'Banana prata orgânica',
    allergens: ['Contém Lactose', 'Sem Glúten'],
    calories: '220 kcal',
    nutritionalNotes: 'Rico em cálcio e fibras para energia nos primeiros horários de aula.',
  },
  {
    id: 'm-seg-2',
    dayOfWeek: 'segunda',
    mealType: 'almoco',
    title: 'Picadinho de Carne Bovina com Cenoura e Batata ao Molho',
    time: '12:00 - 13:00',
    sides: 'Arroz branco soltinho, feijão carioca cremoso e salada de alface, tomate e milho',
    beverage: 'Suco natural de maracujá da fruta',
    dessert: 'Laranja fatiada',
    allergens: ['Sem Glúten', 'Sem Lactose', 'Opção Veg: Proteína de Soja Refogada'],
    calories: '540 kcal',
    nutritionalNotes: 'Equilíbrio ideal de carboidratos complexos, ferro e vitamina C para absorção.',
  },
  {
    id: 'm-seg-3',
    dayOfWeek: 'segunda',
    mealType: 'merenda_tarde',
    title: 'Pão Francês Integral com Queijo Branco Fresco',
    time: '15:40 - 16:00',
    beverage: 'Chá mate gelado com gotas de limão',
    dessert: 'Melancia fresca em cubos',
    allergens: ['Contém Glúten', 'Contém Lactose'],
    calories: '210 kcal',
    nutritionalNotes: 'Lanche leve com alta hidratação para as atividades da tarde.',
  },

  // Terça-feira
  {
    id: 'm-ter-1',
    dayOfWeek: 'terca',
    mealType: 'merenda_manha',
    title: 'Pão de Queijo Assado na Hora com Pasta de Ricota',
    time: '09:30 - 09:50',
    beverage: 'Suco de uva integral 100% fruta',
    dessert: 'Maçã gala higienizada',
    allergens: ['Contém Lactose', 'Sem Glúten'],
    calories: '240 kcal',
    nutritionalNotes: 'Antioxidantes do suco de uva e proteínas de alto valor biológico.',
  },
  {
    id: 'm-ter-2',
    dayOfWeek: 'terca',
    mealType: 'almoco',
    title: 'Iscas de Frango Grelhado com Orégano e Purê de Abóbora Cabotiá',
    time: '12:00 - 13:00',
    sides: 'Arroz com cúrcuma, feijão preto e salada de repolho roxo com cenoura ralada',
    beverage: 'Suco natural de acerola com laranja',
    dessert: 'Abacaxi em rodelas com hortelã',
    allergens: ['Sem Glúten', 'Sem Lactose', 'Opção Veg: Omelete de Forno com Legumes'],
    calories: '490 kcal',
    nutritionalNotes: 'Rico em betacaroteno, vitamina A e proteínas magras.',
  },
  {
    id: 'm-ter-3',
    dayOfWeek: 'terca',
    mealType: 'merenda_tarde',
    title: 'Bolo Caseiro de Cenoura com Cobertura Leve de Cacau 50%',
    time: '15:40 - 16:00',
    beverage: 'Leite morno com toque de canela',
    dessert: 'Pera Williams',
    allergens: ['Contém Glúten', 'Contém Lactose', 'Contém Ovo'],
    calories: '230 kcal',
    nutritionalNotes: 'Feito com cenoura fresca da agricultura familiar e pouco açúcar.',
  },

  // Quarta-feira
  {
    id: 'm-qua-1',
    dayOfWeek: 'quarta',
    mealType: 'merenda_manha',
    title: 'Vitamina Cremosa de Morango, Banana e Chia',
    time: '09:30 - 09:50',
    beverage: 'Torradinhas integrais com azeite e orégano',
    dessert: 'Mamão papaia em cubos',
    allergens: ['Contém Lactose', 'Contém Glúten'],
    calories: '215 kcal',
    nutritionalNotes: 'Fibras solúveis da chia e auxílio digestivo do mamão.',
  },
  {
    id: 'm-qua-2',
    dayOfWeek: 'quarta',
    mealType: 'almoco',
    title: 'Macarrão Parafuso Integral à Bolonhesa Especial com Carne Magra',
    time: '12:00 - 13:00',
    sides: 'Brócolis e couve-flor ao vapor com azeite e queijo parmesão ralado',
    beverage: 'Suco de caju natural',
    dessert: 'Gelatina natural de uva',
    allergens: ['Contém Glúten', 'Contém Lactose', 'Opção Veg: Molho Bolonhesa de Lentilhas'],
    calories: '520 kcal',
    nutritionalNotes: 'Carboidratos de baixo índice glicêmico para concentração à tarde.',
  },
  {
    id: 'm-qua-3',
    dayOfWeek: 'quarta',
    mealType: 'merenda_tarde',
    title: 'Sanduíche Natural de Frango Desfiado com Requeijão e Milho',
    time: '15:40 - 16:00',
    beverage: 'Suco de manga fresco',
    dessert: 'Uvas doces sem sementes',
    allergens: ['Contém Glúten', 'Contém Lactose'],
    calories: '250 kcal',
    nutritionalNotes: 'Proteínas práticas e energia para o contraturno escolar.',
  },

  // Quinta-feira
  {
    id: 'm-qui-1',
    dayOfWeek: 'quinta',
    mealType: 'merenda_manha',
    title: 'Mingau Tradicional de Aveia com Canela e Mel Silvestre',
    time: '09:30 - 09:50',
    beverage: 'Suco natural de goiaba',
    dessert: 'Melão em fatias doces',
    allergens: ['Contém Lactose', 'Contém Glúten'],
    calories: '205 kcal',
    nutritionalNotes: 'Alimento reconfortante e rico em betaglucanas benéficas à imunidade.',
  },
  {
    id: 'm-qui-2',
    dayOfWeek: 'quinta',
    mealType: 'almoco',
    title: 'Filé de Tilápia Assado com Ervas Finas e Baião de Dois',
    time: '12:00 - 13:00',
    sides: 'Baião com queijo coalho e feijão fradinho + vinagrete fresco e folhas verdes',
    beverage: 'Limonada suíça com hortelã',
    dessert: 'Doce de banana caseiro sem açúcar adicionado',
    allergens: ['Contém Peixe', 'Contém Lactose', 'Sem Glúten', 'Opção Veg: Torta de Palmito'],
    calories: '480 kcal',
    nutritionalNotes: 'Fonte rica em Ômega 3 e minerais essenciais para o aprendizado.',
  },
  {
    id: 'm-qui-3',
    dayOfWeek: 'quinta',
    mealType: 'merenda_tarde',
    title: 'Esfiha Assada de Ricota com Espinafre',
    time: '15:40 - 16:00',
    beverage: 'Água saborizada com morango e hortelã',
    dessert: 'Tangerina Ponkan fresca',
    allergens: ['Contém Glúten', 'Contém Lactose'],
    calories: '195 kcal',
    nutritionalNotes: 'Excelente fonte de vitamina C e ferro do espinafre.',
  },

  // Sexta-feira
  {
    id: 'm-sex-1',
    dayOfWeek: 'sexta',
    mealType: 'merenda_manha',
    title: 'Salada de Frutas Tropicais com Granola Crocante e Mel',
    time: '09:30 - 09:50',
    beverage: 'Iogurte natural batido',
    dessert: 'Mix de frutas frescas (maçã, banana, mamão, melão)',
    allergens: ['Contém Lactose', 'Contém Glúten (granola)'],
    calories: '210 kcal',
    nutritionalNotes: 'Variedade de micronutrientes e enzimas digestivas.',
  },
  {
    id: 'm-sex-2',
    dayOfWeek: 'sexta',
    mealType: 'almoco',
    title: 'Feijoada Escolar Light com Arroz Branco e Couve Refogada',
    time: '12:00 - 13:00',
    sides: 'Feijão preto com carnes magras, couve fininha no alho e farofinha de milho crocante',
    beverage: 'Suco natural de abacaxi com hortelã',
    dessert: 'Rodelas de laranja lima doce',
    allergens: ['Sem Glúten', 'Sem Lactose', 'Opção Veg: Feijoada Vegana com Cogumelos e Tofu'],
    calories: '560 kcal',
    nutritionalNotes: 'Tradição brasileira preparada com padrão nutricional equilibrado e baixo sódio.',
  },
  {
    id: 'm-sex-3',
    dayOfWeek: 'sexta',
    mealType: 'merenda_tarde',
    title: 'Torta Salgada Assada de Frango com Legumes Coloridos',
    time: '15:40 - 16:00',
    beverage: 'Suco de maracujá com maçã',
    dessert: 'Banana maçã',
    allergens: ['Contém Glúten', 'Contém Lactose', 'Contém Ovo'],
    calories: '225 kcal',
    nutritionalNotes: 'Fechando a semana escolar com energia e sabor.',
  },
];

export const DAYS_OF_WEEK: Array<{ id: DayOfWeek; name: string; shortName: string }> = [
  { id: 'segunda', name: 'Segunda-feira', shortName: 'Seg' },
  { id: 'terca', name: 'Terça-feira', shortName: 'Ter' },
  { id: 'quarta', name: 'Quarta-feira', shortName: 'Qua' },
  { id: 'quinta', name: 'Quinta-feira', shortName: 'Qui' },
  { id: 'sexta', name: 'Sexta-feira', shortName: 'Sex' },
];

export interface PeriodSlotDefinition {
  periodNumber: number;
  startTime: string;
  endTime: string;
  label: string;
}

export const CLASS_PERIOD_SLOTS: PeriodSlotDefinition[] = [
  { periodNumber: 1, startTime: '07:30', endTime: '08:20', label: '1º Horário' },
  { periodNumber: 2, startTime: '08:20', endTime: '09:10', label: '2º Horário' },
  { periodNumber: 3, startTime: '09:30', endTime: '10:20', label: '3º Horário' },
  { periodNumber: 4, startTime: '10:20', endTime: '11:10', label: '4º Horário' },
  { periodNumber: 5, startTime: '11:10', endTime: '12:00', label: '5º Horário' },
  { periodNumber: 6, startTime: '13:00', endTime: '13:50', label: '6º Horário' },
  { periodNumber: 7, startTime: '13:50', endTime: '14:40', label: '7º Horário' },
  { periodNumber: 8, startTime: '14:50', endTime: '15:40', label: '8º Horário' },
];

export const GRADE_SERIES_OPTIONS: Array<{ id: GradeSeries; label: string; shortLabel: string; roomLabel: string }> = [
  { id: '1_serie', label: '1ª Série', shortLabel: '1ª Série', roomLabel: 'Sala 102' },
  { id: '2_serie', label: '2ª Série', shortLabel: '2ª Série', roomLabel: 'Sala 201' },
  { id: '3_serie', label: '3ª Série', shortLabel: '3ª Série', roomLabel: 'Sala 301' },
];

export function getGradeSeriesLabel(series?: GradeSeries): string {
  return GRADE_SERIES_OPTIONS.find((s) => s.id === series)?.label || '1ª Série';
}

export function getStoredGradeSeries(): GradeSeries {
  try {
    const raw = localStorage.getItem(SELECTED_SERIES_STORAGE_KEY);
    if (raw === '1_serie' || raw === '2_serie' || raw === '3_serie') {
      return raw;
    }
    return '1_serie';
  } catch {
    return '1_serie';
  }
}

export function saveStoredGradeSeries(series: GradeSeries): void {
  try {
    localStorage.setItem(SELECTED_SERIES_STORAGE_KEY, series);
  } catch (error) {
    console.error('Erro ao salvar série selecionada:', error);
  }
}

const FIRST_SERIES_BASE_SCHEDULE: ClassPeriod[] = [
  // Segunda-feira
  {
    id: 'sch-seg-1',
    periodNumber: 1,
    startTime: '07:30',
    endTime: '08:20',
    dayOfWeek: 'segunda',
    subject: 'Matemática',
    teacher: 'Prof. Ricardo Mendes',
    room: 'Sala 102',
    notes: 'Trigonometria e Geometria Plana',
  },
  {
    id: 'sch-seg-2',
    periodNumber: 2,
    startTime: '08:20',
    endTime: '09:10',
    dayOfWeek: 'segunda',
    subject: 'Matemática',
    teacher: 'Prof. Ricardo Mendes',
    room: 'Sala 102',
    notes: 'Resolução de exercícios práticos',
  },
  {
    id: 'sch-seg-3',
    periodNumber: 3,
    startTime: '09:30',
    endTime: '10:20',
    dayOfWeek: 'segunda',
    subject: 'Português',
    teacher: 'Profa. Juliana Castro',
    room: 'Sala 102',
    notes: 'Sintaxe e Análise Textual',
  },
  {
    id: 'sch-seg-4',
    periodNumber: 4,
    startTime: '10:20',
    endTime: '11:10',
    dayOfWeek: 'segunda',
    subject: 'História',
    teacher: 'Prof. Carlos Eduardo',
    room: 'Sala 102',
    notes: 'Idade Contemporânea & Revoluções',
  },
  {
    id: 'sch-seg-5',
    periodNumber: 5,
    startTime: '11:10',
    endTime: '12:00',
    dayOfWeek: 'segunda',
    subject: 'Geografia',
    teacher: 'Profa. Mariana Lima',
    room: 'Sala 102',
    notes: 'Geopolítica e Dinâmica Populacional',
  },
  {
    id: 'sch-seg-6',
    periodNumber: 6,
    startTime: '13:00',
    endTime: '13:50',
    dayOfWeek: 'segunda',
    subject: 'Ciências',
    teacher: 'Prof. Thiago Moura',
    room: 'Lab. de Informática',
    notes: 'Robótica e Lógica de Programação',
  },
  {
    id: 'sch-seg-7',
    periodNumber: 7,
    startTime: '13:50',
    endTime: '14:40',
    dayOfWeek: 'segunda',
    subject: 'Redação',
    teacher: 'Profa. Juliana Castro',
    room: 'Sala 102',
    notes: 'Oficina de Textos Argumentativos',
  },
  {
    id: 'sch-seg-8',
    periodNumber: 8,
    startTime: '14:50',
    endTime: '15:40',
    dayOfWeek: 'segunda',
    subject: 'Estudos Orientados',
    teacher: 'Coordenação Pedagógica',
    room: 'Biblioteca',
    notes: 'Monitoria e Resolução de Dúvidas',
  },

  // Terça-feira
  {
    id: 'sch-ter-1',
    periodNumber: 1,
    startTime: '07:30',
    endTime: '08:20',
    dayOfWeek: 'terca',
    subject: 'Biologia',
    teacher: 'Profa. Vanessa Torres',
    room: 'Lab. de Ciências',
    notes: 'Genética e Biologia Celular',
  },
  {
    id: 'sch-ter-2',
    periodNumber: 2,
    startTime: '08:20',
    endTime: '09:10',
    dayOfWeek: 'terca',
    subject: 'Química',
    teacher: 'Prof. Felipe Albuquerque',
    room: 'Lab. de Ciências',
    notes: 'Estequiometria e Soluções Químicas',
  },
  {
    id: 'sch-ter-3',
    periodNumber: 3,
    startTime: '09:30',
    endTime: '10:20',
    dayOfWeek: 'terca',
    subject: 'Física',
    teacher: 'Prof. André Santos',
    room: 'Sala 102',
    notes: 'Mecânica e Dinâmica Newtoniana',
  },
  {
    id: 'sch-ter-4',
    periodNumber: 4,
    startTime: '10:20',
    endTime: '11:10',
    dayOfWeek: 'terca',
    subject: 'Inglês',
    teacher: 'Profa. Beatrice King',
    room: 'Sala de Idiomas',
    notes: 'Reading Comprehension & Conversation',
  },
  {
    id: 'sch-ter-5',
    periodNumber: 5,
    startTime: '11:10',
    endTime: '12:00',
    dayOfWeek: 'terca',
    subject: 'Português',
    teacher: 'Profa. Juliana Castro',
    room: 'Sala 102',
    notes: 'Produção Textual e Interpretação',
  },
  {
    id: 'sch-ter-6',
    periodNumber: 6,
    startTime: '13:00',
    endTime: '13:50',
    dayOfWeek: 'terca',
    subject: 'Química',
    teacher: 'Prof. Felipe Albuquerque',
    room: 'Lab. de Ciências',
    notes: 'Prática Experimental de Química',
  },
  {
    id: 'sch-ter-7',
    periodNumber: 7,
    startTime: '13:50',
    endTime: '14:40',
    dayOfWeek: 'terca',
    subject: 'Espanhol',
    teacher: 'Profa. Beatrice King',
    room: 'Sala de Idiomas',
    notes: 'Vocabulário e Cultura Hispânica',
  },
  {
    id: 'sch-ter-8',
    periodNumber: 8,
    startTime: '14:50',
    endTime: '15:40',
    dayOfWeek: 'terca',
    subject: 'Projeto de Vida',
    teacher: 'Prof. Olavo Medeiros',
    room: 'Sala 102',
    notes: 'Planejamento de Estudos e Metas',
  },

  // Quarta-feira
  {
    id: 'sch-qua-1',
    periodNumber: 1,
    startTime: '07:30',
    endTime: '08:20',
    dayOfWeek: 'quarta',
    subject: 'Literatura',
    teacher: 'Profa. Juliana Castro',
    room: 'Sala 102',
    notes: 'Modernismo Brasileiro e Vanguardas',
  },
  {
    id: 'sch-qua-2',
    periodNumber: 2,
    startTime: '08:20',
    endTime: '09:10',
    dayOfWeek: 'quarta',
    subject: 'Matemática',
    teacher: 'Prof. Ricardo Mendes',
    room: 'Sala 102',
    notes: 'Funções e Álgebra',
  },
  {
    id: 'sch-qua-3',
    periodNumber: 3,
    startTime: '09:30',
    endTime: '10:20',
    dayOfWeek: 'quarta',
    subject: 'Educação Física',
    teacher: 'Prof. Marcos Rogério',
    room: 'Quadra Coberta',
    notes: 'Esportes Coletivos e Condicionamento',
  },
  {
    id: 'sch-qua-4',
    periodNumber: 4,
    startTime: '10:20',
    endTime: '11:10',
    dayOfWeek: 'quarta',
    subject: 'Filosofia',
    teacher: 'Prof. Olavo Medeiros',
    room: 'Sala 102',
    notes: 'Ética, Política e Teoria do Conhecimento',
  },
  {
    id: 'sch-qua-5',
    periodNumber: 5,
    startTime: '11:10',
    endTime: '12:00',
    dayOfWeek: 'quarta',
    subject: 'Sociologia',
    teacher: 'Profa. Amanda Rocha',
    room: 'Sala 102',
    notes: 'Cultura, Sociedade e Cidadania',
  },
  {
    id: 'sch-qua-6',
    periodNumber: 6,
    startTime: '13:00',
    endTime: '13:50',
    dayOfWeek: 'quarta',
    subject: 'Matemática',
    teacher: 'Prof. Ricardo Mendes',
    room: 'Sala 102',
    notes: 'Raciocínio Lógico & Problemas',
  },
  {
    id: 'sch-qua-7',
    periodNumber: 7,
    startTime: '13:50',
    endTime: '14:40',
    dayOfWeek: 'quarta',
    subject: 'Redação',
    teacher: 'Profa. Juliana Castro',
    room: 'Sala 102',
    notes: 'Laboratório de Redação ENEM',
  },
  {
    id: 'sch-qua-8',
    periodNumber: 8,
    startTime: '14:50',
    endTime: '15:40',
    dayOfWeek: 'quarta',
    subject: 'Artes',
    teacher: 'Profa. Cecília Meireles',
    room: 'Ateliê de Artes',
    notes: 'Expressão Artística e Teatro',
  },

  // Quinta-feira
  {
    id: 'sch-qui-1',
    periodNumber: 1,
    startTime: '07:30',
    endTime: '08:20',
    dayOfWeek: 'quinta',
    subject: 'Física',
    teacher: 'Prof. André Santos',
    room: 'Sala 102',
    notes: 'Termodinâmica e Ondulatória',
  },
  {
    id: 'sch-qui-2',
    periodNumber: 2,
    startTime: '08:20',
    endTime: '09:10',
    dayOfWeek: 'quinta',
    subject: 'Química',
    teacher: 'Prof. Felipe Albuquerque',
    room: 'Sala 102',
    notes: 'Química Orgânica e Reações',
  },
  {
    id: 'sch-qui-3',
    periodNumber: 3,
    startTime: '09:30',
    endTime: '10:20',
    dayOfWeek: 'quinta',
    subject: 'História',
    teacher: 'Prof. Carlos Eduardo',
    room: 'Sala 102',
    notes: 'História do Brasil & Era Vargas',
  },
  {
    id: 'sch-qui-4',
    periodNumber: 4,
    startTime: '10:20',
    endTime: '11:10',
    dayOfWeek: 'quinta',
    subject: 'Artes',
    teacher: 'Profa. Cecília Meireles',
    room: 'Ateliê de Artes',
    notes: 'História da Arte e Criação Visual',
  },
  {
    id: 'sch-qui-5',
    periodNumber: 5,
    startTime: '11:10',
    endTime: '12:00',
    dayOfWeek: 'quinta',
    subject: 'Biologia',
    teacher: 'Profa. Vanessa Torres',
    room: 'Sala 102',
    notes: 'Ecologia e Meio Ambiente',
  },
  {
    id: 'sch-qui-6',
    periodNumber: 6,
    startTime: '13:00',
    endTime: '13:50',
    dayOfWeek: 'quinta',
    subject: 'Física',
    teacher: 'Prof. André Santos',
    room: 'Lab. de Ciências',
    notes: 'Experimentos Práticos de Óptica e Ondas',
  },
  {
    id: 'sch-qui-7',
    periodNumber: 7,
    startTime: '13:50',
    endTime: '14:40',
    dayOfWeek: 'quinta',
    subject: 'Geografia',
    teacher: 'Profa. Mariana Lima',
    room: 'Sala 102',
    notes: 'Geopolítica Contemporânea & Atualidades',
  },
  {
    id: 'sch-qui-8',
    periodNumber: 8,
    startTime: '14:50',
    endTime: '15:40',
    dayOfWeek: 'quinta',
    subject: 'Literatura',
    teacher: 'Profa. Juliana Castro',
    room: 'Biblioteca',
    notes: 'Clube do Livro & Análise Crítica',
  },

  // Sexta-feira
  {
    id: 'sch-sex-1',
    periodNumber: 1,
    startTime: '07:30',
    endTime: '08:20',
    dayOfWeek: 'sexta',
    subject: 'Português',
    teacher: 'Profa. Juliana Castro',
    room: 'Sala 102',
    notes: 'Redação Estilo ENEM / Vestibulares',
  },
  {
    id: 'sch-sex-2',
    periodNumber: 2,
    startTime: '08:20',
    endTime: '09:10',
    dayOfWeek: 'sexta',
    subject: 'Matemática',
    teacher: 'Prof. Ricardo Mendes',
    room: 'Sala 102',
    notes: 'Matemática Financeira e Estatística',
  },
  {
    id: 'sch-sex-3',
    periodNumber: 3,
    startTime: '09:30',
    endTime: '10:20',
    dayOfWeek: 'sexta',
    subject: 'Geografia',
    teacher: 'Profa. Mariana Lima',
    room: 'Sala 102',
    notes: 'Cartografia e Meio Físico',
  },
  {
    id: 'sch-sex-4',
    periodNumber: 4,
    startTime: '10:20',
    endTime: '11:10',
    dayOfWeek: 'sexta',
    subject: 'Ciências',
    teacher: 'Prof. Thiago Moura',
    room: 'Lab. de Informática',
    notes: 'Tecnologia Aplicada e Lógica',
  },
  {
    id: 'sch-sex-5',
    periodNumber: 5,
    startTime: '11:10',
    endTime: '12:00',
    dayOfWeek: 'sexta',
    subject: 'Filosofia',
    teacher: 'Prof. Olavo Medeiros',
    room: 'Auditório Principal',
    notes: 'Debate Semanal & Projeto de Vida',
  },
  {
    id: 'sch-sex-6',
    periodNumber: 6,
    startTime: '13:00',
    endTime: '13:50',
    dayOfWeek: 'sexta',
    subject: 'Educação Financeira',
    teacher: 'Prof. Ricardo Mendes',
    room: 'Sala 102',
    notes: 'Planejamento Financeiro e Economia Básica',
  },
  {
    id: 'sch-sex-7',
    periodNumber: 7,
    startTime: '13:50',
    endTime: '14:40',
    dayOfWeek: 'sexta',
    subject: 'Iniciação Científica',
    teacher: 'Profa. Vanessa Torres',
    room: 'Lab. de Ciências',
    notes: 'Metodologia de Pesquisa & Projetos',
  },
  {
    id: 'sch-sex-8',
    periodNumber: 8,
    startTime: '14:50',
    endTime: '15:40',
    dayOfWeek: 'sexta',
    subject: 'Atividades Culturais',
    teacher: 'Coordenação Pedagógica',
    room: 'Pátio Central',
    notes: 'Assembleia Semanal e Apresentações',
  },
];

const SECOND_SERIES_SUBJECT_ROTATION: Record<string, { subject: string; teacher: string; notes: string }> = {
  'segunda-1': { subject: 'Português', teacher: 'Profa. Juliana Castro', notes: 'Morfossintaxe e Semântica' },
  'segunda-2': { subject: 'Literatura', teacher: 'Profa. Juliana Castro', notes: 'Romantismo e Realismo Brasileiro' },
  'segunda-3': { subject: 'Matemática', teacher: 'Prof. Ricardo Mendes', notes: 'Matrizes, Determinantes e Sistemas' },
  'segunda-4': { subject: 'Matemática', teacher: 'Prof. Ricardo Mendes', notes: 'Resolução de Problemas em Álgebra' },
  'segunda-5': { subject: 'Física', teacher: 'Prof. André Santos', notes: 'Termologia e Calorimetria' },
  'segunda-6': { subject: 'Química', teacher: 'Prof. Felipe Albuquerque', notes: 'Termoquímica e Cinética' },
  'segunda-7': { subject: 'Inglês', teacher: 'Profa. Beatrice King', notes: 'Gramática Contextualizada e Leitura' },
  'segunda-8': { subject: 'Estudos Orientados', teacher: 'Coordenação Pedagógica', notes: 'Planejamento Semanal da 2ª Série' },

  'terca-1': { subject: 'História', teacher: 'Prof. Carlos Eduardo', notes: 'Brasil Império e Primeiro Reinado' },
  'terca-2': { subject: 'Geografia', teacher: 'Profa. Mariana Lima', notes: 'Industrialização e Urbanização' },
  'terca-3': { subject: 'Biologia', teacher: 'Profa. Vanessa Torres', notes: 'Fisiologia Humana e Sistemas' },
  'terca-4': { subject: 'Biologia', teacher: 'Profa. Vanessa Torres', notes: 'Prática de Microscopia' },
  'terca-5': { subject: 'Redação', teacher: 'Profa. Juliana Castro', notes: 'Argumentação e Repertório Sociocultural' },
  'terca-6': { subject: 'Ciências', teacher: 'Prof. Thiago Moura', notes: 'Robótica Aplicada e Sensores' },
  'terca-7': { subject: 'Filosofia', teacher: 'Prof. Olavo Medeiros', notes: 'Filosofia Moderna e Racionalismo' },
  'terca-8': { subject: 'Projeto de Vida', teacher: 'Prof. Olavo Medeiros', notes: 'Carreiras e Trilhas Formativas' },

  'quarta-1': { subject: 'Matemática', teacher: 'Prof. Ricardo Mendes', notes: 'Trigonometria no Ciclo' },
  'quarta-2': { subject: 'Física', teacher: 'Prof. André Santos', notes: 'Óptica Geométrica e Espelhos' },
  'quarta-3': { subject: 'Química', teacher: 'Prof. Felipe Albuquerque', notes: 'Equilíbrio Químico e pH' },
  'quarta-4': { subject: 'Educação Física', teacher: 'Prof. Marcos Rogério', notes: 'Voleibol e Treinamento Funcional' },
  'quarta-5': { subject: 'Sociologia', teacher: 'Profa. Amanda Rocha', notes: 'Trabalho, Estruturas Sociais e Cultura' },
  'quarta-6': { subject: 'Português', teacher: 'Profa. Juliana Castro', notes: 'Coesão e Coerência Textual' },
  'quarta-7': { subject: 'Espanhol', teacher: 'Profa. Beatrice King', notes: 'Interpretação de Textos Hispânicos' },
  'quarta-8': { subject: 'Artes', teacher: 'Profa. Cecília Meireles', notes: 'Arte Moderna e Linguagens Visuais' },

  'quinta-1': { subject: 'Química', teacher: 'Prof. Felipe Albuquerque', notes: 'Eletroquímica e Pilhas' },
  'quinta-2': { subject: 'Biologia', teacher: 'Profa. Vanessa Torres', notes: 'Botânica e Fisiologia Vegetal' },
  'quinta-3': { subject: 'Matemática', teacher: 'Prof. Ricardo Mendes', notes: 'Análise Combinatória e Probabilidade' },
  'quinta-4': { subject: 'História', teacher: 'Prof. Carlos Eduardo', notes: 'Revoluções Industriais e Imperialismo' },
  'quinta-5': { subject: 'Geografia', teacher: 'Profa. Mariana Lima', notes: 'Geografia Agrária e Recursos Naturais' },
  'quinta-6': { subject: 'Física', teacher: 'Prof. André Santos', notes: 'Laboratório de Ondulatória' },
  'quinta-7': { subject: 'Redação', teacher: 'Profa. Juliana Castro', notes: 'Oficina de Proposta de Intervenção' },
  'quinta-8': { subject: 'Literatura', teacher: 'Profa. Juliana Castro', notes: 'Análise de Obras Literárias' },

  'sexta-1': { subject: 'Física', teacher: 'Prof. André Santos', notes: 'Eletrostática Inicial' },
  'sexta-2': { subject: 'Português', teacher: 'Profa. Juliana Castro', notes: 'Revisão Gramatical e Simulados' },
  'sexta-3': { subject: 'História', teacher: 'Prof. Carlos Eduardo', notes: 'República Velha no Brasil' },
  'sexta-4': { subject: 'Geografia', teacher: 'Profa. Mariana Lima', notes: 'Regionalização Brasileira' },
  'sexta-5': { subject: 'Matemática', teacher: 'Prof. Ricardo Mendes', notes: 'Geometria Espacial' },
  'sexta-6': { subject: 'Educação Financeira', teacher: 'Prof. Ricardo Mendes', notes: 'Juros Compostos e Investimentos' },
  'sexta-7': { subject: 'Iniciação Científica', teacher: 'Profa. Vanessa Torres', notes: 'Elaboração de Artigos e Projetos' },
  'sexta-8': { subject: 'Atividades Culturais', teacher: 'Coordenação Pedagógica', notes: 'Roda de Debates da 2ª Série' },
};

const THIRD_SERIES_SUBJECT_ROTATION: Record<string, { subject: string; teacher: string; notes: string }> = {
  'segunda-1': { subject: 'Matemática', teacher: 'Prof. Ricardo Mendes', notes: 'Revisão ENEM: Funções e Estatística' },
  'segunda-2': { subject: 'Redação', teacher: 'Profa. Juliana Castro', notes: 'Redação Nota 1000 — Estrutura ENEM' },
  'segunda-3': { subject: 'Física', teacher: 'Prof. André Santos', notes: 'Eletrodinâmica e Circuitos Elétricos' },
  'segunda-4': { subject: 'Química', teacher: 'Prof. Felipe Albuquerque', notes: 'Química Orgânica e Polímeros' },
  'segunda-5': { subject: 'Biologia', teacher: 'Profa. Vanessa Torres', notes: 'Genética Molecular e Biotecnologia' },
  'segunda-6': { subject: 'História', teacher: 'Prof. Carlos Eduardo', notes: 'História Contemporânea e Guerra Fria' },
  'segunda-7': { subject: 'Geografia', teacher: 'Profa. Mariana Lima', notes: 'Geopolítica Global e Blocos Econômicos' },
  'segunda-8': { subject: 'Estudos Orientados', teacher: 'Coordenação Pedagógica', notes: 'Simulado Focado ENEM & Vestibulares' },

  'terca-1': { subject: 'Português', teacher: 'Profa. Juliana Castro', notes: 'Interpretação Avançada de Textos' },
  'terca-2': { subject: 'Literatura', teacher: 'Profa. Juliana Castro', notes: 'Modernismo e Literatura Contemporânea' },
  'terca-3': { subject: 'Matemática', teacher: 'Prof. Ricardo Mendes', notes: 'Geometria Analítica e Probabilidades' },
  'terca-4': { subject: 'Matemática', teacher: 'Prof. Ricardo Mendes', notes: 'Resolução de Questões ENEM' },
  'terca-5': { subject: 'Filosofia', teacher: 'Prof. Olavo Medeiros', notes: 'Filosofia Contemporânea e Ética' },
  'terca-6': { subject: 'Sociologia', teacher: 'Profa. Amanda Rocha', notes: 'Movimentos Sociais e Cidadania' },
  'terca-7': { subject: 'Inglês', teacher: 'Profa. Beatrice King', notes: 'Estratégias de Leitura para Vestibulares' },
  'terca-8': { subject: 'Projeto de Vida', teacher: 'Prof. Olavo Medeiros', notes: 'Orientação Profissional e SISU/PROUNI' },

  'quarta-1': { subject: 'Química', teacher: 'Prof. Felipe Albuquerque', notes: 'Reações Orgânicas e Isomeria' },
  'quarta-2': { subject: 'Biologia', teacher: 'Profa. Vanessa Torres', notes: 'Evolução e Ecologia Aplicada' },
  'quarta-3': { subject: 'Física', teacher: 'Prof. André Santos', notes: 'Eletromagnetismo e Física Moderna' },
  'quarta-4': { subject: 'Português', teacher: 'Profa. Juliana Castro', notes: 'Variação Linguística e Funções da Linguagem' },
  'quarta-5': { subject: 'Educação Física', teacher: 'Prof. Marcos Rogério', notes: 'Saúde, Qualidade de Vida e Esportes' },
  'quarta-6': { subject: 'História', teacher: 'Prof. Carlos Eduardo', notes: 'Brasil Contemporâneo e Redemocratização' },
  'quarta-7': { subject: 'Espanhol', teacher: 'Profa. Beatrice King', notes: 'Interpretação Avançada ENEM' },
  'quarta-8': { subject: 'Artes', teacher: 'Profa. Cecília Meireles', notes: 'Vanguardas Europeias e Arte Contemporânea' },

  'quinta-1': { subject: 'Redação', teacher: 'Profa. Juliana Castro', notes: 'Correção Comentada e Repertório' },
  'quinta-2': { subject: 'Matemática', teacher: 'Prof. Ricardo Mendes', notes: 'Grandezas Proporcionais e Escalas' },
  'quinta-3': { subject: 'Geografia', teacher: 'Profa. Mariana Lima', notes: 'Questões Ambientais e Clima' },
  'quinta-4': { subject: 'Física', teacher: 'Prof. André Santos', notes: 'Revisão Geral: Mecânica e Energia' },
  'quinta-5': { subject: 'Química', teacher: 'Prof. Felipe Albuquerque', notes: 'Estequiometria e Soluções ENEM' },
  'quinta-6': { subject: 'Biologia', teacher: 'Profa. Vanessa Torres', notes: 'Imunologia e Saúde Pública' },
  'quinta-7': { subject: 'Ciências', teacher: 'Prof. Thiago Moura', notes: 'Tecnologia, IA e Inovação Científica' },
  'quinta-8': { subject: 'Literatura', teacher: 'Profa. Juliana Castro', notes: 'Seminário de Obras Clássicas' },

  'sexta-1': { subject: 'História', teacher: 'Prof. Carlos Eduardo', notes: 'Revisão Temática para Vestibulares' },
  'sexta-2': { subject: 'Geografia', teacher: 'Profa. Mariana Lima', notes: 'Atualidades e Geografia do Piauí' },
  'sexta-3': { subject: 'Português', teacher: 'Profa. Juliana Castro', notes: 'Análise de Provas Anteriores' },
  'sexta-4': { subject: 'Matemática', teacher: 'Prof. Ricardo Mendes', notes: 'Maratona de Exercícios' },
  'sexta-5': { subject: 'Biologia', teacher: 'Profa. Vanessa Torres', notes: 'Citologia e Metabolismo Energético' },
  'sexta-6': { subject: 'Educação Financeira', teacher: 'Prof. Ricardo Mendes', notes: 'Orçamento Universitário e Planejamento' },
  'sexta-7': { subject: 'Iniciação Científica', teacher: 'Profa. Vanessa Torres', notes: 'Apresentação de TCC Escolar' },
  'sexta-8': { subject: 'Atividades Culturais', teacher: 'Coordenação Pedagógica', notes: 'Aulão Integrado da 3ª Série' },
};

export const DEFAULT_SCHEDULE: ClassPeriod[] = [
  ...FIRST_SERIES_BASE_SCHEDULE.map((p) => ({ ...p, gradeSeries: '1_serie' as GradeSeries })),
  ...FIRST_SERIES_BASE_SCHEDULE.map((p) => {
    const key = `${p.dayOfWeek}-${p.periodNumber}`;
    const custom = SECOND_SERIES_SUBJECT_ROTATION[key];
    return {
      ...p,
      id: p.id.replace('sch-', 'sch-2s-'),
      gradeSeries: '2_serie' as GradeSeries,
      room: p.room === 'Sala 102' ? 'Sala 201' : p.room,
      subject: custom?.subject || p.subject,
      teacher: custom?.teacher || p.teacher,
      notes: custom?.notes || p.notes,
    };
  }),
  ...FIRST_SERIES_BASE_SCHEDULE.map((p) => {
    const key = `${p.dayOfWeek}-${p.periodNumber}`;
    const custom = THIRD_SERIES_SUBJECT_ROTATION[key];
    return {
      ...p,
      id: p.id.replace('sch-', 'sch-3s-'),
      gradeSeries: '3_serie' as GradeSeries,
      room: p.room === 'Sala 102' ? 'Sala 301' : p.room,
      subject: custom?.subject || p.subject,
      teacher: custom?.teacher || p.teacher,
      notes: custom?.notes || p.notes,
    };
  }),
];

export const COMMON_SUBJECTS = [
  'Matemática',
  'Português',
  'História',
  'Geografia',
  'Ciências',
  'Biologia',
  'Física',
  'Química',
  'Inglês',
  'Filosofia',
  'Sociologia',
  'Artes',
  'Educação Física',
  'Literatura',
];

export function getStoredRole(): UserRole {
  try {
    const role = localStorage.getItem(ROLE_STORAGE_KEY);
    if (role === 'coordenador' || role === 'aluno') {
      return role;
    }
    return 'aluno';
  } catch {
    return 'aluno';
  }
}

export function saveStoredRole(role: UserRole): void {
  try {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
  } catch (error) {
    console.error('Erro ao salvar papel do usuário:', error);
  }
}

export const DEFAULT_COORDINATOR_PIN = 'diretor2026';

export function runStorageMigrations(): void {
  try {
    const savedPin = localStorage.getItem(PIN_STORAGE_KEY);
    if (savedPin === '1234') {
      localStorage.setItem(PIN_STORAGE_KEY, DEFAULT_COORDINATOR_PIN);
    }
    const savedVersion = localStorage.getItem(DATA_VERSION_KEY);
    if (savedVersion !== CURRENT_DATA_VERSION) {
      localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
    }
  } catch (error) {
    console.error('Erro ao executar migração de armazenamento:', error);
  }
}

export function getStoredPin(): string {
  try {
    const saved = localStorage.getItem(PIN_STORAGE_KEY);
    if (!saved || saved === '1234') {
      return DEFAULT_COORDINATOR_PIN;
    }
    return saved;
  } catch {
    return DEFAULT_COORDINATOR_PIN;
  }
}

export function saveStoredPin(newPin: string): void {
  try {
    localStorage.setItem(PIN_STORAGE_KEY, newPin);
  } catch (error) {
    console.error('Erro ao salvar PIN:', error);
  }
}

export function getStoredTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
}

export function saveStoredTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error('Erro ao salvar tema:', error);
  }
}

export function getStoredTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TASKS));
      return DEFAULT_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (error) {
    console.error('Erro ao ler tarefas do localStorage:', error);
    return [];
  }
}

export function saveStoredTasks(tasks: Task[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error('Erro ao salvar tarefas no localStorage:', error);
    return false;
  }
}

export function getStoredEvents(): SchoolEvent[] {
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(DEFAULT_EVENTS));
      return DEFAULT_EVENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Auto-migração: mesclar os feriados oficiais de 2026 sem sobrescrever eventos personalizados
      const existingIds = new Set(parsed.map((e: SchoolEvent) => e.id));
      const missingHolidays = DEFAULT_EVENTS.filter(
        (e) => e.category === 'feriado' && !existingIds.has(e.id)
      );
      if (missingHolidays.length > 0) {
        const merged = [...parsed, ...missingHolidays];
        // Ordenar cronologicamente por data
        merged.sort((a, b) => {
          const isoA = formatDateToISO(a.date);
          const isoB = formatDateToISO(b.date);
          return isoA.localeCompare(isoB);
        });
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    }
    return [];
  } catch (error) {
    console.error('Erro ao ler eventos do localStorage:', error);
    return [];
  }
}

export function saveStoredEvents(events: SchoolEvent[]): boolean {
  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    return true;
  } catch (error) {
    console.error('Erro ao salvar eventos no localStorage:', error);
    return false;
  }
}

export function getEventCategoryDetails(category: EventCategory): {
  label: string;
  badgeBg: string;
  border: string;
  iconBg: string;
  iconColor: string;
} {
  switch (category) {
    case 'prova':
      return {
        label: 'Prova / Exame',
        badgeBg: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80',
        border: 'border-l-rose-500',
        iconBg: 'bg-rose-50 dark:bg-rose-950/50',
        iconColor: 'text-rose-600 dark:text-rose-400',
      };
    case 'trabalho':
      return {
        label: 'Apresentação / Entrega',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80',
        border: 'border-l-amber-500',
        iconBg: 'bg-amber-50 dark:bg-amber-950/50',
        iconColor: 'text-amber-600 dark:text-amber-400',
      };
    case 'reuniao':
      return {
        label: 'Reunião Escolar',
        badgeBg: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/80',
        border: 'border-l-teal-500',
        iconBg: 'bg-teal-50 dark:bg-teal-950/50',
        iconColor: 'text-teal-600 dark:text-teal-400',
      };
    case 'feriado':
      return {
        label: 'Feriado / Recesso',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80',
        border: 'border-l-emerald-500',
        iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
      };
    case 'evento':
    default:
      return {
        label: 'Feira & Evento',
        badgeBg: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/60 dark:text-green-300 dark:border-green-800/80',
        border: 'border-l-green-500',
        iconBg: 'bg-green-50 dark:bg-green-950/50',
        iconColor: 'text-green-600 dark:text-green-400',
      };
  }
}

export function getSubjectColor(subject: string): {
  bg: string;
  text: string;
  badgeBg: string;
  border: string;
} {
  const norm = subject.toLowerCase().trim();

  if (norm.includes('matemática') || norm.includes('calculo') || norm.includes('álgebra')) {
    return {
      bg: 'bg-green-50 hover:bg-green-100/70 dark:bg-green-950/40 dark:hover:bg-green-900/50',
      text: 'text-green-700 dark:text-green-300',
      badgeBg: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/70 dark:text-green-300 dark:border-green-800/80',
      border: 'border-green-500',
    };
  }
  if (norm.includes('história') || norm.includes('historia')) {
    return {
      bg: 'bg-amber-50 hover:bg-amber-100/70 dark:bg-amber-950/40 dark:hover:bg-amber-900/50',
      text: 'text-amber-700 dark:text-amber-300',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800/80',
      border: 'border-amber-500',
    };
  }
  if (norm.includes('português') || norm.includes('portugues') || norm.includes('redação') || norm.includes('literatura')) {
    return {
      bg: 'bg-emerald-50 hover:bg-emerald-100/70 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50',
      text: 'text-emerald-700 dark:text-emerald-300',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/80',
      border: 'border-emerald-500',
    };
  }
  if (norm.includes('biologia') || norm.includes('ciências') || norm.includes('ciencias')) {
    return {
      bg: 'bg-teal-50 hover:bg-teal-100/70 dark:bg-teal-950/40 dark:hover:bg-teal-900/50',
      text: 'text-teal-700 dark:text-teal-300',
      badgeBg: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/70 dark:text-teal-300 dark:border-teal-800/80',
      border: 'border-teal-500',
    };
  }
  if (norm.includes('física') || norm.includes('fisica') || norm.includes('química') || norm.includes('quimica')) {
    return {
      bg: 'bg-lime-50 hover:bg-lime-100/70 dark:bg-lime-950/40 dark:hover:bg-lime-900/50',
      text: 'text-lime-700 dark:text-lime-300',
      badgeBg: 'bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-950/70 dark:text-lime-300 dark:border-lime-800/80',
      border: 'border-lime-500',
    };
  }
  if (norm.includes('geografia')) {
    return {
      bg: 'bg-orange-50 hover:bg-orange-100/70 dark:bg-orange-950/40 dark:hover:bg-orange-900/50',
      text: 'text-orange-700 dark:text-orange-300',
      badgeBg: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/70 dark:text-orange-300 dark:border-orange-800/80',
      border: 'border-orange-500',
    };
  }
  if (norm.includes('inglês') || norm.includes('ingles') || norm.includes('espanhol') || norm.includes('idioma')) {
    return {
      bg: 'bg-purple-50 hover:bg-purple-100/70 dark:bg-purple-950/40 dark:hover:bg-purple-900/50',
      text: 'text-purple-700 dark:text-purple-300',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800/80',
      border: 'border-purple-500',
    };
  }
  if (norm.includes('artes') || norm.includes('filosofia') || norm.includes('sociologia')) {
    return {
      bg: 'bg-rose-50 hover:bg-rose-100/70 dark:bg-rose-950/40 dark:hover:bg-rose-900/50',
      text: 'text-rose-700 dark:text-rose-300',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800/80',
      border: 'border-rose-500',
    };
  }

  return {
    bg: 'bg-slate-50 hover:bg-slate-100/70 dark:bg-slate-900 dark:hover:bg-slate-800/70',
    text: 'text-slate-700 dark:text-slate-300',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
    border: 'border-emerald-500',
  };
}

export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '';

  if (dateStr.includes('/')) {
    return dateStr;
  }

  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }

  return dateStr;
}

export function formatDateToISO(dateStr: string): string {
  if (!dateStr) return '';

  // If already YYYY-MM-DD
  if (dateStr.includes('-') && dateStr.length === 10 && dateStr.indexOf('-') === 4) {
    return dateStr;
  }

  // If DD/MM/YYYY
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      let year = parts[2];
      if (year.length === 2) year = `20${year}`;
      return `${year}-${month}-${day}`;
    }
  }

  return '';
}

export function formatISODateToDisplay(isoStr: string): string {
  if (!isoStr) return '';
  if (isoStr.includes('-')) {
    const parts = isoStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }
  return isoStr;
}

export const BRASILIA_TIMEZONE = 'America/Sao_Paulo';

export interface BrasiliaDateTimeParts {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number; // 0-23
  minute: number;
  second: number;
  weekdayIndex: number; // 0 = Domingo ... 6 = Sábado
  timeStr: string; // HH:mm
  fullTimeStr: string; // HH:mm:ss
  isoDate: string; // YYYY-MM-DD
  displayDate: string; // DD/MM/YYYY
}

export function getBrasiliaNowParts(now: Date = new Date()): BrasiliaDateTimeParts {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: BRASILIA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);

  const getPart = (type: string) =>
    parseInt(parts.find((p) => p.type === type)?.value || '0', 10);

  const year = getPart('year');
  const month = getPart('month');
  const day = getPart('day');
  const hour = getPart('hour') % 24;
  const minute = getPart('minute');
  const second = getPart('second');

  const weekdayIndex = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const hh = String(hour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  const ss = String(second).padStart(2, '0');
  const mo = String(month).padStart(2, '0');
  const da = String(day).padStart(2, '0');

  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    weekdayIndex,
    timeStr: `${hh}:${mm}`,
    fullTimeStr: `${hh}:${mm}:${ss}`,
    isoDate: `${year}-${mo}-${da}`,
    displayDate: `${da}/${mo}/${year}`,
  };
}

export function getBrasiliaWallDate(now: Date = new Date()): Date {
  const p = getBrasiliaNowParts(now);
  return new Date(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
}

export function formatBrasiliaFullDate(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: BRASILIA_TIMEZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(now);
}

export function parseDateToTimestamp(dateStr: string): number {
  if (!dateStr) return 0;
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2].length === 2 ? `20${parts[2]}` : parts[2], 10);
      return new Date(year, month, day).getTime();
    }
  }
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day).getTime();
    }
    return new Date(dateStr).getTime();
  }
  return 0;
}

export function getDaysUntil(dateStr: string): {
  days: number;
  label: string;
  isPast: boolean;
  isToday: boolean;
} {
  const ts = parseDateToTimestamp(dateStr);
  if (!ts) {
    return { days: 0, label: '', isPast: false, isToday: false };
  }

  const brNow = getBrasiliaNowParts();
  const today = new Date(brNow.year, brNow.month - 1, brNow.day);
  today.setHours(0, 0, 0, 0);

  const target = new Date(ts);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { days: 0, label: 'Hoje!', isPast: false, isToday: true };
  }
  if (diffDays === 1) {
    return { days: 1, label: 'Amanhã', isPast: false, isToday: false };
  }
  if (diffDays > 1) {
    return { days: diffDays, label: `Em ${diffDays} dias`, isPast: false, isToday: false };
  }

  return {
    days: Math.abs(diffDays),
    label: `Há ${Math.abs(diffDays)} dias`,
    isPast: true,
    isToday: false,
  };
}

export function getStoredMeals(): SchoolMeal[] {
  try {
    const raw = localStorage.getItem(MEALS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MEALS_STORAGE_KEY, JSON.stringify(DEFAULT_MEALS));
      return DEFAULT_MEALS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_MEALS;
  } catch (error) {
    console.error('Erro ao ler cardápio de merenda do localStorage:', error);
    return DEFAULT_MEALS;
  }
}

export function saveStoredMeals(meals: SchoolMeal[]): boolean {
  try {
    localStorage.setItem(MEALS_STORAGE_KEY, JSON.stringify(meals));
    return true;
  } catch (error) {
    console.error('Erro ao salvar cardápio de merenda no localStorage:', error);
    return false;
  }
}

export function getCurrentDayOfWeek(): DayOfWeek {
  const day = getBrasiliaNowParts().weekdayIndex; // 0 = Domingo, 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado
  switch (day) {
    case 1:
      return 'segunda';
    case 2:
      return 'terca';
    case 3:
      return 'quarta';
    case 4:
      return 'quinta';
    case 5:
      return 'sexta';
    default:
      return 'segunda';
  }
}

export function getMealTypeDetails(type: MealType): {
  label: string;
  shortLabel: string;
  badgeBg: string;
  border: string;
  defaultTime: string;
  gradient: string;
} {
  switch (type) {
    case 'merenda_manha':
      return {
        label: 'Merenda da Manhã',
        shortLabel: 'Manhã',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80',
        border: 'border-l-amber-500',
        defaultTime: '09:30 - 09:50',
        gradient: 'from-amber-500/10 to-orange-500/5 dark:from-amber-500/15 dark:to-orange-500/10',
      };
    case 'almoco':
      return {
        label: 'Almoço Escolar',
        shortLabel: 'Almoço',
        badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80',
        border: 'border-l-emerald-500',
        defaultTime: '12:00 - 13:00',
        gradient: 'from-emerald-500/10 to-teal-500/5 dark:from-emerald-500/15 dark:to-teal-500/10',
      };
    case 'merenda_tarde':
      return {
        label: 'Merenda da Tarde',
        shortLabel: 'Tarde',
        badgeBg: 'bg-teal-100 text-teal-900 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/80',
        border: 'border-l-teal-500',
        defaultTime: '15:40 - 16:00',
        gradient: 'from-teal-500/10 to-emerald-500/5 dark:from-teal-500/15 dark:to-emerald-500/10',
      };
  }
}

export function sanitizeSchedule(rawList: ClassPeriod[]): ClassPeriod[] {
  if (!Array.isArray(rawList)) {
    return DEFAULT_SCHEDULE;
  }
  if (rawList.length === 0) {
    return [];
  }

  const seriesOrder: GradeSeries[] = ['1_serie', '2_serie', '3_serie'];
  const days: DayOfWeek[] = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];
  const sanitized: ClassPeriod[] = [];
  const maxSlots = CLASS_PERIOD_SLOTS.length;

  for (const series of seriesOrder) {
    const seriesPrefix = series === '1_serie' ? 'sch' : series === '2_serie' ? 'sch-2s' : 'sch-3s';

    for (const day of days) {
      const dayClasses = rawList.filter(
        (p) => p && p.dayOfWeek === day && (p.gradeSeries || '1_serie') === series
      );
      if (dayClasses.length === 0) continue;

      const sorted = [...dayClasses].sort((a, b) => {
        if ((a.periodNumber || 0) !== (b.periodNumber || 0)) {
          return (a.periodNumber || 1) - (b.periodNumber || 1);
        }
        return (a.startTime || '').localeCompare(b.startTime || '');
      });

      const usedPeriods = new Set<number>();
      const dayResult: ClassPeriod[] = [];

      for (const item of sorted) {
        let targetPeriod = item.periodNumber || 0;

        if (!targetPeriod || targetPeriod < 1 || targetPeriod > maxSlots) {
          const slotByStartTime = CLASS_PERIOD_SLOTS.find((s) => s.startTime === item.startTime);
          targetPeriod = slotByStartTime ? slotByStartTime.periodNumber : 1;
        }

        if (usedPeriods.has(targetPeriod)) {
          let nextFree = 1;
          while (nextFree <= maxSlots && usedPeriods.has(nextFree)) {
            nextFree++;
          }
          if (nextFree <= maxSlots) {
            targetPeriod = nextFree;
          } else {
            continue;
          }
        }

        usedPeriods.add(targetPeriod);
        const slot = CLASS_PERIOD_SLOTS.find((s) => s.periodNumber === targetPeriod);

        dayResult.push({
          ...item,
          id: item.id || `${seriesPrefix}-${day.slice(0, 3)}-${targetPeriod}`,
          gradeSeries: series,
          dayOfWeek: day,
          periodNumber: targetPeriod,
          startTime: (item.startTime || '').trim() || slot?.startTime || '07:30',
          endTime: (item.endTime || '').trim() || slot?.endTime || '08:20',
          subject: (item.subject || '').trim() || 'Aula',
        });
      }

      dayResult.sort((a, b) => a.periodNumber - b.periodNumber);
      sanitized.push(...dayResult);
    }
  }

  return sanitized;
}

export function getStoredSchedule(): ClassPeriod[] {
  try {
    const raw = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(DEFAULT_SCHEDULE));
      localStorage.setItem(SCHEDULE_MIGRATION_KEY, 'true');
      return DEFAULT_SCHEDULE;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const alreadyMigrated = localStorage.getItem(SCHEDULE_MIGRATION_KEY) === 'true';

      if (!alreadyMigrated) {
        // Migração única para garantir 8 aulas por dia em dados antigos
        const mergedList = [...parsed];
        for (const defItem of DEFAULT_SCHEDULE) {
          const slotExists = mergedList.some(
            (p) => p.dayOfWeek === defItem.dayOfWeek && p.periodNumber === defItem.periodNumber
          );
          if (!slotExists) {
            mergedList.push(defItem);
          }
        }
        const sanitized = sanitizeSchedule(mergedList);
        saveStoredSchedule(sanitized);
        localStorage.setItem(SCHEDULE_MIGRATION_KEY, 'true');
        return sanitized;
      }

      const sanitized = sanitizeSchedule(parsed);
      if (JSON.stringify(sanitized) !== raw) {
        saveStoredSchedule(sanitized);
      }
      return sanitized;
    }
    return DEFAULT_SCHEDULE;
  } catch (err) {
    console.error('Error loading schedule from localStorage:', err);
    return DEFAULT_SCHEDULE;
  }
}

export function saveStoredSchedule(schedule: ClassPeriod[]): void {
  try {
    const sanitized = sanitizeSchedule(schedule);
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.error('Error saving schedule to localStorage:', err);
  }
}

export function getCompletedTaskIds(): string[] {
  try {
    const raw = localStorage.getItem(COMPLETED_TASK_IDS_KEY);
    if (!raw) return ['3'];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((x): x is string => typeof x === 'string');
    }
    return [];
  } catch {
    return [];
  }
}

export function saveCompletedTaskIds(ids: string[]): void {
  try {
    localStorage.setItem(COMPLETED_TASK_IDS_KEY, JSON.stringify(ids));
  } catch (err) {
    console.error('Error saving completed task IDs:', err);
  }
}


