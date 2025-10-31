import React from 'react';
import { ThemeColor } from '../types';
import { THEMES } from '../constants';

interface DailyPlan {
  day: string;
  date: number;
  hours: number;
}

interface WeeklyForecastProps {
  plan: DailyPlan[];
  themeColor: ThemeColor;
}

const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ plan, themeColor }) => {
  const theme = THEMES[themeColor] || THEMES.blue;
  
  return (
    <div className="w-full">
        <h3 className="text-center text-sm font-semibold text-slate-500 mb-4">Tu Plan Semanal</h3>
        <div className="flex justify-between items-center space-x-2 text-center overflow-x-auto pb-2">
            {plan.map((day, index) => (
                <div 
                    key={index}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl w-16 h-24 flex-shrink-0 transition-all duration-300
                      ${index === 0 
                        ? `${theme.bg} text-white shadow-lg` 
                        : 'bg-slate-100 text-slate-700'
                      }`
                    }
                >
                    <p className={`text-sm font-bold capitalize ${index === 0 ? theme.accentText : 'text-slate-500'}`}>
                        {day.day}
                    </p>
                    <p className="text-2xl font-bold my-1">
                        {day.date}
                    </p>
                    <p className={`text-xs font-semibold ${index === 0 ? theme.accentTextLight : 'text-slate-500'}`}>
                        {day.hours.toFixed(1)}h
                    </p>
                </div>
            ))}
        </div>
    </div>
  );
};

export default WeeklyForecast;