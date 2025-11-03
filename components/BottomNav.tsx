
import React from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { HomeIcon } from './icons/HomeIcon';
import { ListBulletIcon } from './icons/ListBulletIcon';
import { GardenIcon } from './icons/GardenIcon';
import { ThemeColor } from '../types';
import { THEMES } from '../constants';

type ActiveView = 'tracker' | 'activity' | 'history';

interface BottomNavProps {
  activeView: ActiveView;
  onAddClick: () => void;
  themeColor: ThemeColor;
  performanceMode?: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ 
  activeView, 
  onAddClick,
  themeColor,
  performanceMode = false,
}) => {
  const theme = THEMES[themeColor] || THEMES.blue;

  const navItems = [
    { view: 'tracker', hash: '#/', Icon: HomeIcon, label: 'Informe' },
    { view: 'add', hash: '', Icon: PlusIcon, label: 'Agregar' },
    { view: 'activity', hash: '#/activity', Icon: ListBulletIcon, label: 'Actividad' },
    { view: 'history', hash: '#/history', Icon: CalendarIcon, label: 'Historial' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-50/70 dark:bg-slate-900/70 backdrop-blur-lg border-t border-slate-200/60 dark:border-slate-700/60 z-10">
      <div className="flex items-center justify-around h-20 max-w-lg mx-auto">
        {navItems.map(item => {
          const isActive = activeView === item.view;
          const isAddButton = item.view === 'add';
          const showGlow = isActive && !isAddButton && !performanceMode;

          const handleClick = () => {
            if (isAddButton) {
              onAddClick();
            } else {
              window.location.hash = item.hash;
            }
          };

          return (
            <div key={item.label} className="relative flex justify-center items-center w-20 h-full">
               {showGlow && (
                <div className={`absolute inset-0 rounded-full blur-xl bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} opacity-20 -z-10`}></div>
              )}
              <button
                id={isAddButton ? 'add-hours-button' : undefined}
                onClick={handleClick}
                className={`flex flex-col items-center justify-center space-y-1 w-full h-full transition-colors z-10 ${
                  isActive ? theme.text : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
                }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.Icon className="h-7 w-7" />
                <span className="text-xs font-semibold">{item.label}</span>
              </button>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
