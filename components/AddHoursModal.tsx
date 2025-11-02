import React, { useState, useEffect, useMemo } from 'react';
import { ThemeColor, ActivityItem, ActivityType, HistoryLog, WeatherCondition, DayStatus, DayEntry } from '../types';
import { THEMES } from '../constants';
import { UserIcon } from './icons/UserIcon';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { hoursToHHMM, flexibleInputToHours, getServiceYear } from '../utils';
import { SunIcon } from './icons/SunIcon';
import { CloudIcon } from './icons/CloudIcon';
import { RainIcon } from './icons/RainIcon';
import { MedicalIcon } from './icons/MedicalIcon';
import { ArrowUturnLeftIcon } from './icons/ArrowUturnLeftIcon';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface AddHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHours: (hours: number, weather?: WeatherCondition) => void;
  onSetHours: (hours: number) => void;
  onSaveActivity: (activity: { type: ActivityType; name: string; location?: string; comments?: string; }) => void;
  activityToEdit: ActivityItem | null;
  currentHours: number;
  isEditMode: boolean;
  themeColor: ThemeColor;
  performanceMode: boolean;
  dateForEntry: Date | null;
  onSetHoursForDate: (hours: number, date: Date, weather?: WeatherCondition) => void;
  onMarkDayStatus: (date: Date, status: DayStatus | null) => void;
  archives: Record<string, HistoryLog>;
  activities: ActivityItem[];
}

type ModalTab = 'hours' | 'visit' | 'study';

const weatherOptions: { id: WeatherCondition, Icon: React.FC<React.SVGProps<SVGSVGElement>>, label: string, selectedClass: string }[] = [
    { id: 'sunny', Icon: SunIcon, label: 'Soleado', selectedClass: 'text-yellow-600 border-yellow-400 bg-yellow-50 dark:bg-yellow-500/10 dark:border-yellow-500/30' },
    { id: 'cloudy', Icon: CloudIcon, label: 'Nublado', selectedClass: 'text-slate-600 border-slate-400 bg-slate-100 dark:bg-slate-600/20 dark:border-slate-500/30' },
    { id: 'bad', Icon: RainIcon, label: 'Lluvioso/Ventoso', selectedClass: 'text-blue-600 border-blue-400 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-500/30' },
];

const AddHoursModal: React.FC<AddHoursModalProps> = ({
  isOpen,
  onClose,
  onAddHours,
  onSetHours,
  onSaveActivity,
  activityToEdit,
  currentHours,
  isEditMode,
  themeColor,
  performanceMode,
  dateForEntry,
  onSetHoursForDate,
  onMarkDayStatus,
  archives,
  activities,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('hours');
  
  const [hoursInput, setHoursInput] = useState('');
  const [isHoursValid, setIsHoursValid] = useState(true);
  const [selectedWeather, setSelectedWeather] = useState<WeatherCondition | undefined>(undefined);
  
  // Activity state
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [comments, setComments] = useState('');

  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const theme = THEMES[themeColor] || THEMES.blue;

  const isEditingActivity = !!activityToEdit;
  const isEditingForDate = !!dateForEntry;

  const dayEntryForDate: DayEntry | undefined = useMemo(() => {
    if (!dateForEntry) return undefined;
    const serviceYear = getServiceYear(dateForEntry);
    const yearHistory = archives[serviceYear] || {};
    const dateKey = `${dateForEntry.getFullYear()}-${String(dateForEntry.getMonth() + 1).padStart(2, '0')}-${String(dateForEntry.getDate()).padStart(2, '0')}`;
    return yearHistory[dateKey];
  }, [dateForEntry, archives]);

  const activitiesForDay = useMemo(() => {
    if (!dateForEntry) return [];
    return activities.filter(act => {
      const actDate = new Date(act.date);
      return actDate.getFullYear() === dateForEntry.getFullYear() &&
             actDate.getMonth() === dateForEntry.getMonth() &&
             actDate.getDate() === dateForEntry.getDate();
    });
  }, [dateForEntry, activities]);

  useEffect(() => {
    if (isOpen) {
      setHasBeenOpened(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (activityToEdit) {
        setActiveTab(activityToEdit.type);
        setName(activityToEdit.name);
        setLocation(activityToEdit.location || '');
        setComments(activityToEdit.comments || '');
        setHoursInput('');
        setSelectedWeather(undefined);
      } else if (dateForEntry) {
        setHoursInput(dayEntryForDate && dayEntryForDate.hours > 0 ? hoursToHHMM(dayEntryForDate.hours) : '');
        setSelectedWeather(dayEntryForDate?.weather);
        setActiveTab('hours');
        setName('');
        setLocation('');
        setComments('');
      } else {
        if (isEditMode) {
          setHoursInput(hoursToHHMM(currentHours));
        } else {
          setHoursInput('');
        }
        setIsHoursValid(true);
        setName('');
        setLocation('');
        setComments('');
        setActiveTab('hours');
        setSelectedWeather(undefined);
      }
    }
  }, [isOpen, activityToEdit, currentHours, isEditMode, dateForEntry, dayEntryForDate]);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHoursInput(value);
    if (value.trim() === '') {
      setIsHoursValid(true);
      return;
    }
    const decimalHours = flexibleInputToHours(value);
    setIsHoursValid(!isNaN(decimalHours) && decimalHours >= 0);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'hours' && !isEditingActivity) {
      const hoursValue = flexibleInputToHours(hoursInput);
      const finalHours = (isNaN(hoursValue) || hoursValue < 0) ? 0 : hoursValue;

      if (isEditingForDate) {
        onSetHoursForDate(finalHours, dateForEntry!, selectedWeather);
      } else if (isEditMode) {
        onSetHours(finalHours);
      } else {
        onAddHours(finalHours, selectedWeather);
      }
    } else {
      if (name.trim() === '') return;
      onSaveActivity({
        type: activeTab as ActivityType,
        name,
        location,
        comments,
      });
    }
  };
  
  const getModalTitle = () => {
    if (isEditingActivity) return `Editar ${activityToEdit.type === 'study' ? 'Estudio' : 'Revisita'}`;
    if (dateForEntry) return `Actividad del ${dateForEntry.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}`;
    if (isEditMode) return 'Editar Total de Horas';
    return 'Añadir Actividad';
  };

  const getButtonText = () => {
    if (isEditingActivity) return 'Guardar Cambios';
    if (activeTab === 'hours') {
        return 'Guardar Horas';
    }
    return 'Guardar Actividad';
  };
  
  const handleSickClick = () => {
      if(dateForEntry) {
          const isCurrentlySick = dayEntryForDate?.status === 'sick';
          onMarkDayStatus(dateForEntry, isCurrentlySick ? null : 'sick');
      }
  };
  
  const isDaySick = dayEntryForDate?.status === 'sick';

  return (
    <div
      className={`fixed inset-0 z-50 ${hasBeenOpened ? 'transition-colors duration-300' : ''} ${isOpen ? 'bg-black/40' : 'bg-transparent pointer-events-none'}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-hours-title"
    >
      <div
        className={`fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-slate-900 rounded-t-2xl shadow-2xl ${hasBeenOpened ? `transition-transform ${performanceMode ? 'duration-0' : 'duration-300'} ease-in-out` : ''} ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mt-3 mb-4" />
        <div className="p-6 pt-0 max-h-[85vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            {!isEditingForDate && !isEditingActivity && (
                 <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1 mb-6">
                    {['hours', 'visit', 'study'].map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab as ModalTab)}
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
                        activeTab === tab
                            ? `bg-white dark:bg-slate-700 ${theme.text} shadow`
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-700/50'
                        }`}
                    >
                        {tab === 'hours' ? 'Horas' : tab === 'visit' ? 'Revisita' : 'Estudio'}
                    </button>
                    ))}
                </div>
            )}
            
            {activeTab === 'hours' && (
              <>
                <h2 id="add-hours-title" className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 text-center">
                  {getModalTitle()}
                </h2>

                {isEditingForDate && activitiesForDay.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 text-center">Actividad del Día</h3>
                    <div className="space-y-2">
                      {activitiesForDay.map(act => (
                        <div key={act.id} className="bg-slate-200 dark:bg-slate-800 p-2 rounded-lg flex items-center">
                          {act.type === 'visit' ? <ArrowUturnLeftIcon className={`w-5 h-5 mr-2 ${theme.text}`} /> : <AcademicCapIcon className={`w-5 h-5 mr-2 ${theme.text}`} />}
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{act.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label htmlFor="hours-input" className="sr-only">Horas</label>
                  <input
                    id="hours-input"
                    type="text"
                    value={hoursInput}
                    onChange={handleHoursChange}
                    placeholder={isEditMode ? "Ej: 45:30" : "Ej: 1:30 o 2,45"}
                    className={`w-full px-4 py-3 text-center text-2xl font-bold bg-white dark:bg-slate-800 border rounded-lg focus:ring-2 ${theme.ring} outline-none transition dark:text-white ${isHoursValid ? 'border-slate-300 dark:border-slate-600' : 'border-red-500 ring-2 ring-red-300'}`}
                    onFocus={(e) => e.target.select()}
                    autoFocus={isOpen}
                    disabled={isDaySick}
                  />
                </div>
                {!isHoursValid && <p className="text-red-600 text-sm text-center -mt-2 mb-2">Formato inválido. Usa H:MM, H.MM o solo horas.</p>}
                
                {(!isEditMode || isEditingForDate) && (
                    <div className="mb-4">
                        <label className="block text-center text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">¿Qué tal estuvo el clima?</label>
                        <div className="flex justify-center space-x-3">
                            {weatherOptions.map(({ id, Icon, label, selectedClass }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setSelectedWeather(w => w === id ? undefined : id)}
                                    className={`p-3 border-2 rounded-lg transition-all ${selectedWeather === id ? selectedClass : 'border-slate-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                                    aria-pressed={selectedWeather === id}
                                    title={label}
                                >
                                    <Icon className={`w-6 h-6 ${selectedWeather !== id ? 'text-slate-500 dark:text-slate-400' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
              </>
            )}

            {(activeTab === 'visit' || activeTab === 'study') && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center">
                  {isEditingActivity ? 'Editar' : 'Anotar'} {activeTab === 'visit' ? 'Revisita' : 'Estudio'}
                </h2>
                <div>
                  <label htmlFor="name-input" className="sr-only">Nombre</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3"><UserIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" /></span>
                    <input id="name-input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre de la persona" className={`w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 ${theme.ring} outline-none transition dark:text-white`} required />
                  </div>
                </div>
                <div>
                  <label htmlFor="location-input" className="sr-only">Ubicación</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3"><LocationMarkerIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" /></span>
                    <input id="location-input" type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Ubicación (dirección, etc.)" className={`w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 ${theme.ring} outline-none transition dark:text-white`} />
                  </div>
                </div>
                <div>
                  <label htmlFor="comments-input" className="sr-only">Comentarios</label>
                  <div className="relative">
                     <span className="absolute top-3 left-0 flex items-center pl-3"><DocumentTextIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" /></span>
                    <textarea id="comments-input" value={comments} onChange={e => setComments(e.target.value)} placeholder="Comentarios (tema, próxima visita, etc.)" rows={3} className={`w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 ${theme.ring} outline-none transition resize-none dark:text-white`}></textarea>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col space-y-3 mt-6">
              <button type="submit" className={`w-full px-6 py-3 rounded-lg ${theme.bg} text-white font-bold text-lg shadow-lg transition-transform disabled:opacity-70 disabled:cursor-not-allowed ${!performanceMode && 'transform hover:scale-105'}`}
                disabled={!isHoursValid && activeTab === 'hours'}
              >
                {getButtonText()}
              </button>
              {isEditingForDate && (
                  <button type="button" onClick={handleSickClick} className={`w-full flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors ${isDaySick ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50' : 'text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>
                      {isDaySick ? <XCircleIcon className="w-5 h-5" /> : <MedicalIcon className="w-5 h-5" />}
                      {isDaySick ? 'Desmarcar como enfermo' : 'Marcar como enfermo'}
                  </button>
              )}
              <button type="button" onClick={onClose} className="w-full px-6 py-2 rounded-lg text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddHoursModal;
