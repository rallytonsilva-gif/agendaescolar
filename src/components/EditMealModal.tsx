import React, { useState, useEffect } from 'react';
import { X, Utensils, Clock, AlertTriangle, Apple, Coffee, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SchoolMeal, DayOfWeek, MealType } from '../types';
import { DAYS_OF_WEEK, getMealTypeDetails } from '../utils/storage';

interface EditMealModalProps {
  isOpen: boolean;
  meal: SchoolMeal | null;
  onClose: () => void;
  onSave: (updatedMeal: SchoolMeal) => void;
}

export const EditMealModal: React.FC<EditMealModalProps> = ({
  isOpen,
  meal,
  onClose,
  onSave,
}) => {
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>('segunda');
  const [mealType, setMealType] = useState<MealType>('almoco');
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [sides, setSides] = useState('');
  const [beverage, setBeverage] = useState('');
  const [dessert, setDessert] = useState('');
  const [calories, setCalories] = useState('');
  const [nutritionalNotes, setNutritionalNotes] = useState('');
  const [allergensText, setAllergensText] = useState('');

  useEffect(() => {
    if (meal) {
      setDayOfWeek(meal.dayOfWeek);
      setMealType(meal.mealType);
      setTitle(meal.title || '');
      setTime(meal.time || '');
      setSides(meal.sides || '');
      setBeverage(meal.beverage || '');
      setDessert(meal.dessert || '');
      setCalories(meal.calories || '');
      setNutritionalNotes(meal.nutritionalNotes || '');
      setAllergensText(meal.allergens ? meal.allergens.join(', ') : '');
    } else {
      setTitle('');
      setTime('12:00 - 13:00');
      setSides('');
      setBeverage('');
      setDessert('');
      setCalories('');
      setNutritionalNotes('');
      setAllergensText('');
    }
  }, [meal, isOpen]);

  if (!isOpen || !meal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const allergensList = allergensText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updated: SchoolMeal = {
      ...meal,
      dayOfWeek,
      mealType,
      title: title.trim(),
      time: time.trim() || getMealTypeDetails(mealType).defaultTime,
      sides: sides.trim() || undefined,
      beverage: beverage.trim() || undefined,
      dessert: dessert.trim() || undefined,
      calories: calories.trim() || undefined,
      nutritionalNotes: nutritionalNotes.trim() || undefined,
      allergens: allergensList.length > 0 ? allergensList : undefined,
      updatedAt: Date.now(),
    };

    onSave(updated);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          id="edit-meal-modal"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-display">
                  Editar Refeição Escolar
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Atualize o cardápio oficial da merenda / almoço
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Day and Type Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Dia da Semana
                </label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tipo de Refeição
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as MealType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  <option value="merenda_manha">Merenda da Manhã</option>
                  <option value="almoco">Almoço Escolar</option>
                  <option value="merenda_tarde">Merenda da Tarde</option>
                </select>
              </div>
            </div>

            {/* Title / Main Dish */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Prato Principal / Item do Lanche *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Arroz, feijão e frango grelhado..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Time & Calories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Horário de Servimento
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="Ex: 12:00 - 13:00"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Estimativa Calórica
                </label>
                <input
                  type="text"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="Ex: 520 kcal"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Sides / Accompaniments */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Acompanhamentos / Salada
              </label>
              <input
                type="text"
                value={sides}
                onChange={(e) => setSides(e.target.value)}
                placeholder="Ex: Salada de alface, tomate e cenoura ralada"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Beverage & Dessert */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                  <Coffee className="w-3.5 h-3.5 text-slate-400" />
                  Bebida / Suco
                </label>
                <input
                  type="text"
                  value={beverage}
                  onChange={(e) => setBeverage(e.target.value)}
                  placeholder="Ex: Suco natural de maracujá"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                  <Apple className="w-3.5 h-3.5 text-slate-400" />
                  Sobremesa / Fruta
                </label>
                <input
                  type="text"
                  value={dessert}
                  onChange={(e) => setDessert(e.target.value)}
                  placeholder="Ex: Melancia fatiada"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Allergens & Dietary restrictions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Alérgenos & Opções Especiais (separados por vírgula)
              </label>
              <input
                type="text"
                value={allergensText}
                onChange={(e) => setAllergensText(e.target.value)}
                placeholder="Ex: Contém Lactose, Sem Glúten, Opção Veg: Tofu"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Nutritional Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Observação Nutricional
              </label>
              <textarea
                value={nutritionalNotes}
                onChange={(e) => setNutritionalNotes(e.target.value)}
                rows={2}
                placeholder="Ex: Rico em vitamina C e ferro..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition active:scale-95"
              >
                <Check className="w-4 h-4" />
                Salvar Cardápio
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
