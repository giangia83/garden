import React, { useMemo, useState } from 'react';
import { HistoryLog } from '../types';
import { XIcon } from './icons/XIcon';
import MonthlyHistoryItem from './MonthlyHistoryItem';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryLog;
  currentDate: Date;
}

export interface MonthlyHistory {
  month: string;
  year: number;
  totalHours: number;
  entries: { day: number; hours: number }[];
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history }) => {
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);

  const monthlyHistory = useMemo(() => {
    const grouped: { [key: string]: MonthlyHistory } = {};
    const sortedDates = Object.keys(history).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    for (const dateKey of sortedDates) {
      const date = new Date(dateKey + 'T12:00:00Z');
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth();
      const day = date.getUTCDate();
      const hours = history[dateKey];
      
      const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('es-ES', { month: 'long', timeZone: 'UTC' });

      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
          year,
          totalHours: 0,
          entries: [],
        };
      }
      grouped[monthKey].totalHours += hours;
      grouped[monthKey].entries.push({ day, hours });
    }
    // Sort entries by day within each month
    Object.values(grouped).forEach(group => {
      group.entries.sort((a, b) => a.day - b.day);
    });
    return Object.values(grouped);
  }, [history]);

  if (!isOpen) {
    return null;
  }
  
  const handleToggle = (monthKey: string) => {
    setExpandedMonth(prev => (prev === monthKey ? null : monthKey));
  };

  return (
    <div
      className="fixed inset-0 bg-slate-800/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-title"
    >
      <div
        className="bg-slate-50 rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 flex items-center justify-between p-6 border-b border-slate-200">
          <h2 id="history-title" className="text-2xl font-bold text-slate-900">
            Historial de Servicio
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
            <XIcon className="w-6 h-6 text-slate-600" />
            <span className="sr-only">Cerrar</span>
          </button>
        </header>

        <main className="flex-grow p-6 overflow-y-auto">
          {monthlyHistory.length === 0 ? (
            <p className="text-center text-slate-500">No hay registros de servicio todavía.</p>
          ) : (
            <div className="space-y-2">
              {monthlyHistory.map((monthData) => {
                const monthKey = `${monthData.month}-${monthData.year}`;
                return (
                  <div key={monthKey} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <MonthlyHistoryItem
                      monthData={monthData}
                      isExpanded={expandedMonth === monthKey}
                      onToggle={() => handleToggle(monthKey)}
                    />
                    {expandedMonth === monthKey && (
                      <div className="p-4 border-t border-slate-200">
                        <ul className="space-y-2">
                          {monthData.entries.map((entry, index) => (
                            <li key={index} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-slate-100">
                              <span className="text-slate-600">Día {entry.day}</span>
                              <span className="font-semibold text-slate-800">{entry.hours.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} horas</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HistoryModal;