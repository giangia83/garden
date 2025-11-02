import React from 'react';
import ShapeProgress from './FlowerProgress';
import Timer from './Timer';
import PaceTracker from './PaceTracker';
import { ThemeColor, Shape } from '../types';
import { THEMES } from '../constants';
import { SettingsIcon } from './icons/SettingsIcon';
import { HelpIcon } from './icons/HelpIcon';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';
import { hoursToHHMM } from '../utils';

interface ServiceTrackerProps {
  currentHours: number;
  goal: number;
  currentDate: Date;
  onEditClick: () => void;
  onAddHours: (hours: number) => void;
  progressShape: Shape;
  themeColor: ThemeColor;
  onSettingsClick: () => void;
  onHelpClick: () => void;
  notificationPermission: NotificationPermission;
  onRequestNotificationPermission: () => Promise<void>;
  performanceMode: boolean;
  isPrivacyMode: boolean;
  onTogglePrivacyMode: () => void;
}

const ServiceTracker: React.FC<ServiceTrackerProps> = ({ 
  currentHours, 
  goal,
  currentDate,
  onEditClick, 
  onAddHours, 
  progressShape, 
  themeColor,
  onSettingsClick,
  onHelpClick,
  notificationPermission,
  onRequestNotificationPermission,
  performanceMode,
  isPrivacyMode,
  onTogglePrivacyMode,
}) => {
  const theme = THEMES[themeColor] || THEMES.blue;
  
  const privacyBlur = isPrivacyMode ? 'blur-md select-none pointer-events-none' : '';

  const percentage = goal > 0 ? Math.min((currentHours / goal) * 100, 100) : 0;
  const remainingHours = Math.max(0, goal - currentHours);

  const textSizeClass = progressShape === 'circle' 
    ? 'text-5xl md:text-6xl' 
    : 'text-4xl md:text-5xl';

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-3 items-center mb-2">
        <div className="flex justify-start">
          <button 
            onClick={onTogglePrivacyMode}
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            aria-label={isPrivacyMode ? "Mostrar horas" : "Ocultar horas"}
          >
            {isPrivacyMode ? <EyeSlashIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
          </button>
        </div>
        <p className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400">Meta: {isPrivacyMode ? '**' : goal} hrs</p>
        <div className="flex justify-end items-center space-x-1">
          <button onClick={onHelpClick} className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
            <HelpIcon className="w-6 h-6" />
          </button>
          <button onClick={onSettingsClick} className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
            <SettingsIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        <div id="progress-display-container" className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center mb-4">
          <ShapeProgress progress={percentage / 100} shape={progressShape} themeColor={themeColor} isPrivacyMode={isPrivacyMode} />
          <button 
            onClick={onEditClick}
            className="absolute inset-0 flex flex-col items-center justify-center text-center cursor-pointer group rounded-full"
            aria-label="Editar horas totales"
          >
            <div className="transition-transform group-hover:scale-105">
              <p className={`${textSizeClass} font-bold text-slate-800 dark:text-slate-100 tracking-tight transition-all ${privacyBlur}`}>
                {isPrivacyMode ? '**:**' : hoursToHHMM(currentHours)}
              </p>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Horas</p>
            </div>
          </button>
        </div>

        <div className={`w-full grid grid-cols-2 gap-4 text-center mb-4 transition-all ${privacyBlur}`}>
            <div>
                <p className="text-4xl font-bold text-slate-700 dark:text-slate-200">{isPrivacyMode ? '**:**' : hoursToHHMM(remainingHours)}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Restantes</p>
            </div>
             <div>
                <p className={`text-4xl font-bold ${theme.text}`}>{isPrivacyMode ? '**%' : `${percentage.toFixed(0)}%`}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Completado</p>
            </div>
        </div>

        <div className="w-full px-4 mb-4">
          <PaceTracker 
            currentHours={currentHours}
            goal={goal}
            currentDate={currentDate}
            themeColor={themeColor}
            isPrivacyMode={isPrivacyMode}
          />
        </div>
        
        <div id="timer-section" className="w-full border-t border-slate-200/80 dark:border-slate-700/80 pt-4">
           <Timer 
             onFinish={onAddHours} 
             themeColor={themeColor}
             notificationPermission={notificationPermission}
             onRequestNotificationPermission={onRequestNotificationPermission}
             performanceMode={performanceMode}
           />
        </div>

      </div>
    </div>
  );
};

export default ServiceTracker;