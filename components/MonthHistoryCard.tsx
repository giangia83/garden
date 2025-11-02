
import React, { useMemo } from 'react';
import { HistoryLog, ThemeColor } from '../types';
import { THEMES } from '../constants';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { hoursToHHMM } from '../utils';

interface MonthHistoryCardProps {
  id: string;
  monthName: string;
  monthHours: number;
  monthDate: Date;
  history: HistoryLog;
  themeColor: ThemeColor;
  isExpanded: boolean;
  onToggle: () => void;
  isPrivacyMode: boolean;
}

const MonthHistoryCard: React.FC<MonthHistoryCardProps> = ({
  id,
  monthName,
  monthHours,
  monthDate,
  history,
  themeColor,
  isExpanded,
  onToggle,
  isPrivacyMode,
}) => {
  const theme = THEMES[themeColor] || THEMES.blue;
  const year = monthDate.getFullYear();
  const privacyBlur = isPrivacyMode ? 'blur-sm select-none pointer-events-none' : '';
  const month = monthDate.getMonth(); // 0-11

  const dailyEntries = useMemo(() => {
    return Object.entries(history)
      .map(([dateStr, hours]) => ({ date: new Date(dateStr + 'T12:00:00Z'), hours }))
      .filter(entry => 
        !isNaN(entry.date.getTime()) &&
        entry.date.getUTCFullYear() === year && 
        entry.date.getUTCMonth() === month
      )
      .sort((a, b) => a.date.getUTCDate() - b.date.getUTCDate());
  }, [history, year, month]);

  const hasEntries = dailyEntries.length > 0;

  return (
    <div id={id} className={`rounded-2xl transition-all duration-300 overflow-hidden ${
      monthHours > 0 
        ? 'bg-white dark:bg-slate-800 shadow-md border border-slate-200/80 dark:border-slate-700' 
        : 'bg-slate-100/80 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700'
    }`}>
      <button 
        className="w-full p-4 flex flex-col items-center justify-center text-center cursor-pointer disabled:cursor-not-allowed"
        onClick={onToggle}
        disabled={!hasEntries}
        aria-expanded={isExpanded}
      >
        <div className="w-full flex items-center justify-between">
            <span className="w-6 h-6"></span> {/* Spacer */}
            <div>
                <p className="font-bold text-slate-800 dark:text-slate-100 capitalize">{monthName}</p>
                <p className={`text-4xl font-bold mt-1 transition-all ${monthHours > 0 ? theme.text : 'text-slate-400 dark:text-slate-500'} ${privacyBlur}`}>
                    {isPrivacyMode ? '0:00' : hoursToHHMM(monthHours)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">horas</p>
            </div>
            {hasEntries ? (
                <ChevronDownIcon className={`w-6 h-6 text-slate-400 dark:text-slate-500 transition-transform duration-300 ${isExpanded ? 'transform rotate-180' : ''}`} />
            ) : (
                <span className="w-6 h-6"></span> /* Spacer */
            )}
        </div>
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="p-4 border-t border-slate-200/80 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3 text-center">
                {dailyEntries.length} {dailyEntries.length === 1 ? 'informe' : 'informes'} este mes
            </p>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
                {dailyEntries.map((entry, index) => (
                    <li key={index} className="flex justify-between items-center bg-slate-100 dark:bg-slate-700/50 p-2 rounded-lg">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Día {entry.date.getUTCDate()}
                        </span>
                        <span className={`text-sm font-bold ${theme.text} transition-all ${privacyBlur}`}>
                            {isPrivacyMode ? '0:00' : hoursToHHMM(entry.hours)}
                        </span>
                    </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthHistoryCard;