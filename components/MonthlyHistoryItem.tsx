import React from 'react';
import { MonthlyHistory } from './HistoryModal';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface MonthlyHistoryItemProps {
  monthData: MonthlyHistory;
  isExpanded: boolean;
  onToggle: () => void;
}

const MonthlyHistoryItem: React.FC<MonthlyHistoryItemProps> = ({ monthData, isExpanded, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-slate-100 bg-white"
      aria-expanded={isExpanded}
    >
      <div>
        <p className="font-bold text-slate-800">{monthData.month} {monthData.year}</p>
        <p className="text-sm text-slate-500">{monthData.totalHours.toFixed(1)} horas en {monthData.entries.length} días</p>
      </div>
      <ChevronDownIcon 
        className={`w-6 h-6 text-slate-500 transition-transform duration-300 ${isExpanded ? 'transform rotate-180' : ''}`} 
      />
    </button>
  );
};

export default MonthlyHistoryItem;
