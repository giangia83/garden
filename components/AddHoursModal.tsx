import React, { useState, useEffect } from 'react';
import { ThemeColor } from '../types';
import { THEMES } from '../constants';

interface AddHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHours: (hours: number) => void;
  onSetHours: (hours: number) => void;
  mode: 'add' | 'edit';
  currentHours: number;
  themeColor: ThemeColor;
}

const AddHoursModal: React.FC<AddHoursModalProps> = ({ isOpen, onClose, onAddHours, onSetHours, mode, currentHours, themeColor }) => {
  const [hours, setHours] = useState('');
  const theme = THEMES[themeColor] || THEMES.blue;

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit') {
        setHours(String(currentHours));
      } else {
        setHours('');
      }
    }
  }, [isOpen, mode, currentHours]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hoursValue = parseFloat(hours);
    if (!isNaN(hoursValue) && hoursValue >= 0) {
      if (mode === 'add') {
        onAddHours(hoursValue);
      } else {
        onSetHours(hoursValue);
      }
    }
  };

  const isEditMode = mode === 'edit';
  const title = isEditMode ? 'Editar Total de Horas' : 'Agregar Horas';
  const buttonText = isEditMode ? 'Guardar Cambios' : 'Agregar';
  const placeholder = isEditMode ? 'Ej: 45.0' : 'Ej: 2.5';

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-hours-title"
    >
      <div 
        className="bg-slate-50 rounded-2xl shadow-xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="add-hours-title" className="text-2xl font-bold text-slate-900 mb-6 text-center">
          {title}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="hours-input" className="sr-only">Horas</label>
            <input
              id="hours-input"
              type="number"
              step="0.1"
              min="0"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder={placeholder}
              className={`w-full px-4 py-3 text-center text-2xl bg-white border border-slate-300 rounded-lg focus:ring-2 ${theme.ring} focus:border-blue-500 outline-none transition`}
              autoFocus
              onFocus={(e) => e.target.select()}
            />
          </div>
          <div className="flex flex-col space-y-3">
            <button 
              type="submit"
              className={`w-full px-6 py-3 rounded-lg bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} text-white font-bold text-lg shadow-lg transform hover:scale-105 transition-transform`}
            >
              {buttonText}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="w-full px-6 py-2 rounded-lg text-slate-600 font-semibold hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHoursModal;