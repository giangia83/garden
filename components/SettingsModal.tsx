import React, { useState, useEffect } from 'react';
import { ThemeColor, Shape } from '../types';
import { THEME_LIST, THEMES } from '../constants';
import { UserIcon } from './icons/UserIcon';
import { FlowerIcon } from './icons/FlowerIcon';
import { CircleIcon } from './icons/CircleIcon';
import { HeartIcon } from './icons/HeartIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, goal: number, date: Date, shape: Shape, color: ThemeColor) => void;
  currentName: string;
  currentGoal: number;
  currentDate: Date;
  currentShape: Shape;
  currentColor: ThemeColor;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentName,
  currentGoal,
  currentDate,
  currentShape,
  currentColor,
}) => {
  const [name, setName] = useState(currentName);
  const [goal, setGoal] = useState(String(currentGoal));
  const [date, setDate] = useState(currentDate.toISOString().split('T')[0]);
  const [shape, setShape] = useState<Shape>(currentShape);
  const [color, setColor] = useState(currentColor);
  const theme = THEMES[color] || THEMES.blue;

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setGoal(String(currentGoal));
      setDate(currentDate.toISOString().split('T')[0]);
      setShape(currentShape);
      setColor(currentColor);
    }
  }, [isOpen, currentName, currentGoal, currentDate, currentShape, currentColor]);

  if (!isOpen) {
    return null;
  }
  
  const handleSave = () => {
    const goalValue = parseInt(goal, 10);
    const dateParts = date.split('-').map(Number);
    const dateValue = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

    if (!isNaN(goalValue) && goalValue > 0 && !isNaN(dateValue.getTime())) {
      onSave(name, goalValue, dateValue, shape, color);
    }
  };
  
  const shapeOptions: { name: Shape; Icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { name: 'flower', Icon: FlowerIcon },
    { name: 'circle', Icon: CircleIcon },
    { name: 'heart', Icon: HeartIcon },
  ];

  return (
    <div
      className="fixed inset-0 bg-slate-800/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        className="bg-slate-50 rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 flex items-center justify-between p-6 border-b border-slate-200">
          <h2 id="settings-title" className="text-2xl font-bold text-slate-900">
            Configuración
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
            <XIcon className="w-6 h-6 text-slate-600" />
            <span className="sr-only">Cerrar</span>
          </button>
        </header>

        <main className="flex-grow p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name-input" className="block text-sm font-medium text-slate-700 mb-1">Tu Nombre</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserIcon className="h-5 w-5 text-slate-400" />
                </span>
                <input
                  id="name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Precursor"
                  className={`w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 ${theme.ring} focus:border-blue-500 outline-none transition`}
                />
              </div>
            </div>
            
            {/* Goal and Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="goal-input" className="block text-sm font-medium text-slate-700 mb-1">Meta Mensual (hrs)</label>
                <input
                  id="goal-input"
                  type="number"
                  min="1"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Ej: 50"
                  className={`w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 ${theme.ring} focus:border-blue-500 outline-none transition`}
                />
              </div>
              <div>
                <label htmlFor="date-input" className="block text-sm font-medium text-slate-700 mb-1">Mes Actual</label>
                <input
                  id="date-input"
                  type="date"
                  value={date}
                  onChange={(e) => {
                    if (e.target.value) {
                      setDate(e.target.value)
                    }
                  }}
                  className={`w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 ${theme.ring} focus:border-blue-500 outline-none transition`}
                />
              </div>
            </div>

            {/* Shape */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Forma del Progreso</label>
              <div className="flex justify-around space-x-2">
                {shapeOptions.map(({ name: shapeName, Icon }) => (
                  <button
                    key={shapeName}
                    onClick={() => setShape(shapeName)}
                    className={`flex-1 p-3 border-2 rounded-lg flex items-center justify-center transition-all ${
                      shape === shapeName ? `${THEMES[color].text} border-current bg-blue-50 shadow-inner` : 'border-slate-300 bg-white hover:bg-slate-100'
                    }`}
                    aria-pressed={shape === shapeName}
                  >
                    <Icon className={`w-8 h-8 ${shape === shapeName ? 'text-current' : 'text-slate-500'}`} />
                    <span className="sr-only">{shapeName}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Color del Tema</label>
              <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
                {THEME_LIST.map((themeOption) => (
                  <button
                    key={themeOption.name}
                    onClick={() => setColor(themeOption.name)}
                    className={`w-full h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${themeOption.gradientFrom} ${themeOption.gradientTo} transition-transform transform hover:scale-110`}
                    aria-label={`Seleccionar color ${themeOption.name}`}
                    aria-pressed={color === themeOption.name}
                  >
                    {color === themeOption.name && (
                      <CheckIcon className="w-6 h-6 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>

        <footer className="flex-shrink-0 p-6 border-t border-slate-200">
          <button
            onClick={handleSave}
            className={`w-full px-6 py-3 rounded-lg bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} text-white font-bold text-lg shadow-lg transform hover:scale-105 transition-transform`}
          >
            Guardar Cambios
          </button>
        </footer>
      </div>
    </div>
  );
};

export default SettingsModal;