import React, { useState, useEffect } from 'react';
import ShapeProgress from './FlowerProgress';
import WeeklyForecast from './WeeklyForecast';
import Timer from './Timer'; // Importar el nuevo componente
import { ThemeColor, Shape } from '../types';
import { THEMES } from '../constants';

interface ServiceTrackerProps {
  currentHours: number;
  goal: number;
  currentDate: Date;
  onEditClick: () => void;
  onAddHours: (hours: number) => void; // Nueva prop
  progressShape: Shape;
  themeColor: ThemeColor;
}

interface DailyPlan {
  day: string;
  date: number;
  hours: number;
}

// Pesos para la distribución de horas
const WEEKDAY_WEIGHT = 1.0;
const SATURDAY_WEIGHT = 1.5;
const SUNDAY_WEIGHT = 1.2;

const ServiceTracker: React.FC<ServiceTrackerProps> = ({ currentHours, goal, currentDate, onEditClick, onAddHours, progressShape, themeColor }) => {
  const [weeklyPlan, setWeeklyPlan] = useState<DailyPlan[]>([]);
  const theme = THEMES[themeColor] || THEMES.blue;
  
  const percentage = goal > 0 ? Math.min((currentHours / goal) * 100, 100) : 0;
  const remainingHours = Math.max(0, goal - currentHours);
  const isGoalReached = percentage >= 100;
  
  const today = currentDate;
  const dayOfMonth = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const dailyAverage = dayOfMonth > 0 ? (currentHours / dayOfMonth) : 0;

  useEffect(() => {
    const calculatePlan = (): DailyPlan[] => {
      if (remainingHours <= 0) {
        return Array(7).fill(null).map((_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          return {
            day: date.toLocaleDateString('es-ES', { weekday: 'short' }),
            date: date.getDate(),
            hours: 0,
          };
        });
      }

      let totalWeightedPoints = 0;
      const remainingDaysData = [];
      const daysLeftInMonth = daysInMonth - dayOfMonth + 1;

      for (let i = 0; i < daysLeftInMonth; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(dayOfMonth + i);
        const dayOfWeek = futureDate.getDay(); // 0 = Domingo, 6 = Sábado
        
        let weight = WEEKDAY_WEIGHT;
        if (dayOfWeek === 6) weight = SATURDAY_WEIGHT;
        if (dayOfWeek === 0) weight = SUNDAY_WEIGHT;
        
        remainingDaysData.push({ date: futureDate, weight });
        totalWeightedPoints += weight;
      }

      if (totalWeightedPoints === 0) return [];

      const hoursPerPoint = remainingHours / totalWeightedPoints;

      const forecast = remainingDaysData.slice(0, 7).map(dayData => {
        return {
          day: dayData.date.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', ''),
          date: dayData.date.getDate(),
          hours: dayData.weight * hoursPerPoint,
        };
      });
      
      return forecast;
    };
    
    setWeeklyPlan(calculatePlan());
  }, [currentHours, goal, currentDate]);

  const dailyNeeded = weeklyPlan.length > 0 ? weeklyPlan[0].hours : 0;

  return (
    <div className="bg-slate-50 p-4 md:p-6 md:rounded-3xl md:shadow-lg border-b md:border border-slate-200/50 w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-baseline mb-6 px-2">
        <h2 className="text-2xl font-bold text-slate-900">Informe de Servicio</h2>
        <p className="text-sm font-semibold text-slate-500">Meta: {goal} hrs</p>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center mb-6">
          <ShapeProgress progress={percentage / 100} shape={progressShape} themeColor={themeColor} isGoalReached={isGoalReached} />
          <button 
            onClick={onEditClick}
            className="absolute inset-0 flex flex-col items-center justify-center text-center cursor-pointer group rounded-full"
            aria-label="Editar horas totales"
          >
            <div className="transition-transform group-hover:scale-105">
              <p className="text-5xl md:text-6xl font-extrabold text-slate-800 tracking-tight">
                {currentHours.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </p>
              <p className="text-sm font-medium text-slate-500">Horas</p>
            </div>
          </button>
        </div>

        <div className="w-full grid grid-cols-2 gap-4 text-center mb-6">
            <div>
                <p className="text-4xl font-bold text-slate-700">{remainingHours.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</p>
                <p className="text-sm text-slate-500">Restantes</p>
            </div>
             <div>
                <p className={`text-4xl font-bold ${theme.text}`}>{percentage.toFixed(0)}%</p>
                <p className="text-sm text-slate-500">Completado</p>
            </div>
        </div>
        
        <div className="w-full grid grid-cols-2 gap-4 py-4 border-y border-slate-200/80 text-center mb-6">
            <div>
                <p className="text-2xl font-semibold text-slate-800">{dailyAverage.toFixed(1)} h</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Promedio</p>
            </div>
             <div>
                <p className="text-2xl font-semibold text-slate-800">{dailyNeeded.toFixed(1)} h</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Para Hoy</p>
            </div>
        </div>
        
        {weeklyPlan.length > 0 && <WeeklyForecast plan={weeklyPlan} themeColor={themeColor} />}

        <div className="w-full border-t border-slate-200/80 mt-6 pt-6">
           <Timer onFinish={onAddHours} themeColor={themeColor} />
        </div>

      </div>
    </div>
  );
};

export default ServiceTracker;