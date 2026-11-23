import React, { useState, useMemo } from 'react';
import {
  Utensils,
  Sun,
  Coffee,
  Apple,
  Clock,
  Flame,
  ShieldCheck,
  Heart,
  Leaf,
  AlertCircle,
  Edit3,
  RotateCcw,
  Sparkles,
  Calendar,
  CheckCircle2,
  Info,
  ChevronRight,
  Salad,
  Milk,
  Wheat,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SchoolMeal, DayOfWeek, MealType, UserRole } from '../types';
import {
  DAYS_OF_WEEK,
  getCurrentDayOfWeek,
  getMealTypeDetails,
  DEFAULT_MEALS,
} from '../utils/storage';
import { EditMealModal } from './EditMealModal';

interface MealsScheduleViewProps {
  meals: SchoolMeal[];
  userRole: UserRole;
  onUpdateMeal: (updatedMeal: SchoolMeal) => void;
  onResetMeals: () => void;
  onSuccessToast: (msg: string) => void;
}

export const MealsScheduleView: React.FC<MealsScheduleViewProps> = ({
  meals,
  userRole,
  onUpdateMeal,
  onResetMeals,
  onSuccessToast,
}) => {
  const currentWeekday = useMemo(() => getCurrentDayOfWeek(), []);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(currentWeekday);
  const [selectedMealType, setSelectedMealType] = useState<'todos' | MealType>('todos');
  const [viewMode, setViewMode] = useState<'dia' | 'semana'>('dia');
  const [editingMeal, setEditingMeal] = useState<SchoolMeal | null>(null);
  const [isNutriGuideOpen, setIsNutriGuideOpen] = useState(false);

  const isCoordinator = userRole === 'coordenador';

  // Filtered meals based on day and type
  const displayedMeals = useMemo(() => {
    let list = meals;
    if (viewMode === 'dia') {
      list = list.filter((m) => m.dayOfWeek === selectedDay);
    }
    if (selectedMealType !== 'todos') {
      list = list.filter((m) => m.mealType === selectedMealType);
    }
    // Sort logically: morning snack -> lunch -> afternoon snack
    const order: Record<MealType, number> = {
      merenda_manha: 1,
      almoco: 2,
      merenda_tarde: 3,
    };
    return [...list].sort((a, b) => {
      if (viewMode === 'semana') {
        const dayOrder: Record<DayOfWeek, number> = {
          segunda: 1,
          terca: 2,
          quarta: 3,
          quinta: 4,
          sexta: 5,
        };
        const dayDiff = dayOrder[a.dayOfWeek] - dayOrder[b.dayOfWeek];
        if (dayDiff !== 0) return dayDiff;
      }
      return order[a.mealType] - order[b.mealType];
    });
  }, [meals, selectedDay, selectedMealType, viewMode]);

  const selectedDayInfo = useMemo(() => {
    return DAYS_OF_WEEK.find((d) => d.id === selectedDay) || DAYS_OF_WEEK[0];
  }, [selectedDay]);

  const getMealIcon = (type: MealType) => {
    switch (type) {
      case 'merenda_manha':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'almoco':
        return <Utensils className="w-4 h-4 text-emerald-500" />;
      case 'merenda_tarde':
        return <Coffee className="w-4 h-4 text-teal-500" />;
    }
  };

  const handleSaveMeal = (updatedMeal: SchoolMeal) => {
    onUpdateMeal(updatedMeal);
    onSuccessToast('Cardápio escolar atualizado com sucesso!');
  };

  const handleResetConfirm = () => {
    if (window.confirm('Tem certeza de que deseja restaurar o cardápio semanal padrão do PNAE?')) {
      onResetMeals();
      onSuccessToast('Cardápio padrão restaurado!');
    }
  };

  return (
    <div className="space-y-6" id="meals-schedule-view">
      {/* Hero Header Card */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-orange-500/15 relative overflow-hidden">
        {/* Glow & Decorative Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-amber-300/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
              <Apple className="w-3.5 h-3.5 text-amber-100" />
              <span>Programa de Alimentação Escolar (PNAE)</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs bg-black/20 backdrop-blur-md px-3 py-1 rounded-full font-medium text-amber-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Cardápio Nutricional Supervisionado</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white mb-2">
            Agenda da Merenda & Almoço
          </h2>
          <p className="text-sm text-amber-50/90 max-w-xl leading-relaxed mb-5">
            Refeições balanceadas com alimentos frescos da agricultura familiar, planejadas para fornecer energia, foco e bem-estar durante todo o dia letivo.
          </p>

          {/* Quick Metrics / Status Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-4 border-t border-white/20 text-xs">
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl">
              <span className="text-amber-100/80 block text-[10px] font-semibold uppercase">Merenda Matutina</span>
              <span className="font-bold text-white text-sm">09:00 às 09:20</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl">
              <span className="text-amber-100/80 block text-[10px] font-semibold uppercase">Almoço Escolar</span>
              <span className="font-bold text-white text-sm">12:20 às 13:20</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl col-span-2 sm:col-span-1">
              <span className="text-amber-100/80 block text-[10px] font-semibold uppercase">Merenda Vespertina</span>
              <span className="font-bold text-white text-sm">16:20 às 16:40</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Day Selection & View Mode */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        {/* Top switch row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('dia')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'dia'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Visão Diária
            </button>
            <button
              type="button"
              onClick={() => setViewMode('semana')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'semana'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Semana Completa
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsNutriGuideOpen(!isNutriGuideOpen)}
              className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5" />
              {isNutriGuideOpen ? 'Ocultar Guia Nutricional' : 'Guia & Alérgenos'}
            </button>

            {isCoordinator && (
              <button
                type="button"
                onClick={handleResetConfirm}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition flex items-center gap-1 ml-2"
                title="Restaurar cardápio padrão"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restaurar Padrão
              </button>
            )}
          </div>
        </div>

        {/* Day Selector Tabs (if viewMode === 'dia') */}
        {viewMode === 'dia' && (
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedDay === day.id;
              const isToday = currentWeekday === day.id;

              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => setSelectedDay(day.id)}
                  className={`py-2.5 px-2 rounded-xl text-center transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-500 dark:border-amber-400 text-amber-900 dark:text-amber-100 font-bold shadow-xs'
                      : 'border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50'
                  }`}
                >
                  <span className="block text-xs sm:text-sm font-extrabold truncate">
                    {day.name.split('-')[0]}
                  </span>
                  {isToday && (
                    <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[9px] font-extrabold uppercase">
                      Hoje
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Meal Type Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 shrink-0">
            Filtrar:
          </span>
          <button
            type="button"
            onClick={() => setSelectedMealType('todos')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
              selectedMealType === 'todos'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Todas as Refeições
          </button>
          <button
            type="button"
            onClick={() => setSelectedMealType('merenda_manha')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
              selectedMealType === 'merenda_manha'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            Merenda da Manhã
          </button>
          <button
            type="button"
            onClick={() => setSelectedMealType('almoco')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
              selectedMealType === 'almoco'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            Almoço Escolar
          </button>
          <button
            type="button"
            onClick={() => setSelectedMealType('merenda_tarde')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
              selectedMealType === 'merenda_tarde'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            Merenda da Tarde
          </button>
        </div>
      </div>

      {/* Nutritional Guide Collapsible Drawer */}
      <AnimatePresence>
        {isNutriGuideOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-50/70 dark:bg-amber-950/30 rounded-3xl p-5 border border-amber-200 dark:border-amber-900/60 overflow-hidden"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div className="space-y-3 flex-1 text-xs text-slate-700 dark:text-slate-300">
                <div>
                  <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-1">
                    Diretrizes de Nutrição & Alergias Escolares
                  </h4>
                  <p className="leading-relaxed">
                    Todos os cardápios são calculados para cobrir as necessidades diárias de micronutrientes dos estudantes. Caso possua alguma restrição alimentar (doença celíaca, intolerância à lactose, diabetes ou opção vegetariana), comunique à coordenação para adaptação do cardápio especial.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-2xl border border-amber-200/60 dark:border-amber-800/40">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                      <Leaf className="w-3.5 h-3.5" />
                      <span>Alimentos Frescos</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Mais de 30% dos ingredientes vêm da agricultura familiar local.
                    </p>
                  </div>

                  <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-2xl border border-amber-200/60 dark:border-amber-800/40">
                    <div className="flex items-center gap-1.5 font-bold text-teal-700 dark:text-teal-400 mb-1">
                      <Milk className="w-3.5 h-3.5" />
                      <span>Alérgenos Identificados</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Rótulos informativos com aviso de glúten, lactose e ovos em cada prato.
                    </p>
                  </div>

                  <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-2xl border border-amber-200/60 dark:border-amber-800/40">
                    <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 mb-1">
                      <Wheat className="w-3.5 h-3.5" />
                      <span>Opção Vegetariana</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Substitutos ricos em proteínas (leguminosas, ovos e tofu) disponíveis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meals List */}
      <div className="space-y-4">
        {viewMode === 'dia' && (
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Cardápio de {selectedDayInfo.name}
            </h3>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {displayedMeals.length} refeições programadas
            </span>
          </div>
        )}

        {displayedMeals.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-dashed border-slate-200 dark:border-slate-800">
            <Utensils className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nenhuma refeição encontrada
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Nenhum item cadastrado para o filtro selecionado. Tente alterar o tipo de refeição ou o dia da semana.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedMeals.map((meal) => {
              const details = getMealTypeDetails(meal.mealType);
              const dayObj = DAYS_OF_WEEK.find((d) => d.id === meal.dayOfWeek);

              return (
                <motion.div
                  key={meal.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm border-l-4 ${details.border} hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {viewMode === 'semana' && (
                        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                          {dayObj?.name}
                        </span>
                      )}

                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border flex items-center gap-1.5 ${details.badgeBg}`}
                      >
                        {getMealIcon(meal.mealType)}
                        {details.label}
                      </span>

                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {meal.time}
                      </span>

                      {meal.calories && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-900/60 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-500" />
                          {meal.calories}
                        </span>
                      )}
                    </div>

                    {isCoordinator ? (
                      <button
                        type="button"
                        onClick={() => setEditingMeal(meal)}
                        className="w-8 h-8 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/60 flex items-center justify-center transition cursor-pointer active:scale-90"
                        title="Editar refeição (Coordenação)"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    ) : (
                      <div
                        className="w-7 h-7 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 text-slate-400 flex items-center justify-center shrink-0 cursor-default"
                        title="Cardápio oficial da nutrição escolar (somente leitura)"
                      >
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Main Dish Title */}
                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 font-display mb-3">
                    {meal.title}
                  </h4>

                  {/* Components Grid (Sides, Beverage, Dessert) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3.5 text-xs">
                    {meal.sides && (
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
                          <Salad className="w-3 h-3 text-emerald-500" />
                          Acompanhamentos
                        </span>
                        <p className="font-semibold text-slate-700 dark:text-slate-300">
                          {meal.sides}
                        </p>
                      </div>
                    )}

                    {meal.beverage && (
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
                          <Coffee className="w-3 h-3 text-teal-500" />
                          Bebida / Suco
                        </span>
                        <p className="font-semibold text-slate-700 dark:text-slate-300">
                          {meal.beverage}
                        </p>
                      </div>
                    )}

                    {meal.dessert && (
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
                          <Apple className="w-3 h-3 text-rose-500" />
                          Fruta / Sobremesa
                        </span>
                        <p className="font-semibold text-slate-700 dark:text-slate-300">
                          {meal.dessert}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer tags (Allergens & Notes) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    {meal.allergens && meal.allergens.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">
                          Restrições:
                        </span>
                        {meal.allergens.map((alg, i) => (
                          <span
                            key={i}
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                              alg.includes('Veg')
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                                : alg.includes('Sem Glúten') || alg.includes('Sem Lactose')
                                ? 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800'
                                : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                            }`}
                          >
                            {alg}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Cardápio regular</span>
                    )}

                    {meal.nutritionalNotes && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                        💡 {meal.nutritionalNotes}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Meal Modal */}
      <EditMealModal
        isOpen={Boolean(editingMeal)}
        meal={editingMeal}
        onClose={() => setEditingMeal(null)}
        onSave={handleSaveMeal}
      />
    </div>
  );
};
