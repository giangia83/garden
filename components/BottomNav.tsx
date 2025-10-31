import React from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { ThemeColor } from '../types';
import { THEMES } from '../constants';

interface BottomNavProps {
  onAddClick: () => void;
  onHistoryClick: () => void;
  onSettingsClick: () => void;
  themeColor: ThemeColor;
}

const BottomNav: React.FC<BottomNavProps> = ({ onAddClick, onHistoryClick, onSettingsClick, themeColor }) => {
  const theme = THEMES[themeColor] || THEMES.blue;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 z-10">
      <div className="flex items-center justify-around h-20 max-w-lg mx-auto">
        <button 
          onClick={onHistoryClick}
          className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
          aria-label="Abrir historial del mes"
        >
          <CalendarIcon className="h-7 w-7" />
          <span className="sr-only">Historial</span>
        </button>
        <button 
          onClick={onAddClick}
          className={`p-4 rounded-full bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} text-white shadow-lg transform hover:scale-105 transition-transform`}
        >
          <PlusIcon className="h-8 w-8" />
          <span className="sr-only">Agregar Horas</span>
        </button>
        <button 
          onClick={onSettingsClick}
          className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
          aria-label="Abrir configuración"
        >
          <SettingsIcon className="h-7 w-7" />
          <span className="sr-only">Configuración</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;