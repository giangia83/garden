import React, { useMemo } from 'react';
import { HistoryLog, ThemeColor, DayEntry, ActivityItem } from '../types';
import { THEMES } from '../constants';
import { hoursToHHMM } from '../utils';

interface CalendarGridProps {
  selectedMonth: Date;
  historyLog: HistoryLog;
  onDayClick: (date: Date) => void;
  themeColor: ThemeColor;
  isPrivacyMode: boolean;
  activities: ActivityItem[];
}

type CalendarDay = {
    date: Date;
    isCurrentMonth: boolean;
    dayEntry?: DayEntry;
    hasActivity: boolean;
}

const WEEK_DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const CalendarGrid: React.FC<CalendarGridProps> = ({ 
  selectedMonth, 
  historyLog, 
  onDayClick, 
  themeColor,
  isPrivacyMode,
  activities
}) => {
  const theme = THEMES[themeColor] || THEMES.blue;
  const privacyBlur = isPrivacyMode ? 'blur-sm select-none pointer-events-none' : '';

  const activityDates = useMemo(() => {
      const dates = new Set<string>();
      activities.forEach(act => {
          const d = new Date(act.date);
          dates.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
      });
      return dates;
  }, [activities]);

  const calendarDays: CalendarDay[] = useMemo(() => {
    const days: CalendarDay[] = [];
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; 
    
    for (let i = 0; i < startDayOfWeek; i++) {
      const date = new Date(firstDayOfMonth);
      date.setDate(date.getDate() - (startDayOfWeek - i));
      const hasActivity = activityDates.has(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
      days.push({ date, isCurrentMonth: false, hasActivity });
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const hasActivity = activityDates.has(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
      days.push({ date, isCurrentMonth: true, dayEntry: historyLog[dateKey], hasActivity });
    }

    const lastDayOfWeek = (lastDayOfMonth.getDay() + 6) % 7;
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
      const date = new Date(lastDayOfMonth);
      date.setDate(date.getDate() + i);
      const hasActivity = activityDates.has(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
      days.push({ date, isCurrentMonth: false, hasActivity });
    }

    return days;
  }, [selectedMonth, historyLog, activityDates]);
  
  const monthTotalHours = useMemo(() => {
    return calendarDays.reduce((total, day) => total + (day.isCurrentMonth ? (day.dayEntry?.hours || 0) : 0), 0);
  }, [calendarDays]);

  const activeDaysCount = useMemo(() => {
    return calendarDays.filter(day => day.isCurrentMonth && day.dayEntry && day.dayEntry.hours > 0).length;
  }, [calendarDays]);

  return (
    <div>
        <div id="calendar-grid" className="grid grid-cols-7 gap-1">
            {WEEK_DAYS.map((day, i) => (
                <div key={`${day}-${i}`} className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 pb-2">{day}</div>
            ))}
            {calendarDays.map(({ date, isCurrentMonth, dayEntry, hasActivity }, index) => {
                const isToday = new Date().toDateString() === date.toDateString();
                const hours = dayEntry?.hours || 0;
                const status = dayEntry?.status;
                
                let bgColor = 'bg-slate-100/50 dark:bg-slate-700/30';
                if (isCurrentMonth) {
                    if (status === 'sick') {
                        bgColor = 'bg-red-200 dark:bg-red-800/50';
                    } else if (hours > 3) {
                        bgColor = 'bg-green-300 dark:bg-green-700/60';
                    } else if (hours > 0) {
                        bgColor = 'bg-green-200 dark:bg-green-800/50';
                    }
                }

                return (
                    <button
                        key={index}
                        onClick={() => isCurrentMonth && onDayClick(date)}
                        className={`
                            relative h-16 flex flex-col items-center justify-center rounded-lg transition-colors
                            ${isCurrentMonth ? 'cursor-pointer' : 'pointer-events-none'}
                            ${isToday ? 'border-2 ' + theme.text : 'border-2 border-transparent'}
                            ${bgColor}
                            ${isCurrentMonth ? 'hover:bg-slate-200 dark:hover:bg-slate-700' : 'opacity-40'}
                        `}
                        disabled={!isCurrentMonth}
                    >
                        {isCurrentMonth && hasActivity && (
                            <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${theme.bg}`}></div>
                        )}
                        <span className={`text-sm font-semibold ${isCurrentMonth ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
                            {date.getDate()}
                        </span>
                        {hours > 0 && isCurrentMonth && (
                            <span className={`text-xs font-bold mt-1 transition-all ${status === 'sick' ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'} ${privacyBlur}`}>
                                {isPrivacyMode ? '0:00' : hoursToHHMM(hours)}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-around text-center">
            <div>
                <p className={`text-2xl font-bold transition-all ${theme.text} ${privacyBlur}`}>
                    {isPrivacyMode ? '0:00' : hoursToHHMM(monthTotalHours)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total del Mes</p>
            </div>
            <div>
                <p className={`text-2xl font-bold transition-all text-slate-700 dark:text-slate-200 ${privacyBlur}`}>
                    {isPrivacyMode ? '0' : activeDaysCount}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{activeDaysCount === 1 ? 'Día de Actividad' : 'Días de Actividad'}</p>
            </div>
        </div>
    </div>
  );
};

export default CalendarGrid;
