import React from 'react';
import { ThemeColor } from '../types';
import { THEMES } from '../constants';
import { hoursToHHMM } from '../utils';

interface PaceTrackerProps {
  currentHours: number;
  goal: number;
  currentDate: Date;
  themeColor: ThemeColor;
  isPrivacyMode: boolean;
}

const PaceTracker: React.FC<PaceTrackerProps> = ({ currentHours, goal, currentDate, themeColor, isPrivacyMode }) => {
  const theme = THEMES[themeColor] || THEMES.blue;

  if (goal <= 0) {
    return null; // Don't show if there's no goal
  }

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const currentDay = currentDate.getDate();
  
  const idealHours = (goal / daysInMonth) * currentDay;
  const difference = currentHours - idealHours;
  
  const isAhead = difference > 0.1;
  const isBehind = difference < -0.1;

  let message = "¡Vas justo a tiempo! Sigue así.";
  let textColor = 'text-slate-500 dark:text-slate-400';

  if (isAhead) {
    message = `¡Genial! Vas ${hoursToHHMM(difference)} por delante de tu ritmo.`;
    textColor = 'text-green-600 dark:text-green-400';
  } else if (isBehind) {
    message = `Estás a ${hoursToHHMM(Math.abs(difference))} de alcanzar tu ritmo.`;
    textColor = 'text-amber-600 dark:text-amber-400';
  }
  
  const monthProgressPercent = Math.min((currentDay / daysInMonth) * 100, 100);
  const userProgressPercent = Math.min((currentHours / goal) * 100, 100);

  return (
    <div className="w-full">
      <div className="relative w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-2">
        {/* User's actual progress bar */}
        {!isPrivacyMode && (
            <div 
                className={`h-1.5 rounded-full bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo} transition-all duration-500`} 
                style={{ width: `${userProgressPercent}%` }}
            ></div>
        )}
        {/* "Today" marker indicating ideal progress */}
        {!isPrivacyMode && (
            <div 
                className="absolute top-[-4px] bottom-[-4px] w-0.5 bg-slate-500 dark:bg-slate-400 rounded-full" 
                style={{ left: `${monthProgressPercent}%` }}
                title={`Ritmo ideal para hoy (${hoursToHHMM(idealHours)} hrs)`}
            ></div>
        )}
      </div>
        {!isPrivacyMode ? (
            <p className={`text-center text-xs font-medium ${textColor}`}>
                {message}
            </p>
        ) : (
            <p className="text-center text-xs font-medium text-slate-500 dark:text-slate-400">
                Ritmo oculto
            </p>
        )}
    </div>
  );
};

export default PaceTracker;