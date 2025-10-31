import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ServiceTracker from './components/ServiceTracker';
import AddHoursModal from './components/AddHoursModal';
import SettingsModal from './components/SettingsModal';
import HistoryModal from './components/HistoryModal';
import { ThemeColor, HistoryLog, Shape } from './types';

const APP_STORAGE_KEY = 'garden-service-tracker';

const getInitialState = () => {
  try {
    const saved = localStorage.getItem(APP_STORAGE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (parsed.currentDate) {
      const d = new Date(parsed.currentDate);
      parsed.currentDate = !isNaN(d.getTime()) ? d : new Date();
    } else {
      parsed.currentDate = new Date();
    }
    if (!parsed.history) {
      parsed.history = {};
    }
    return parsed;
  } catch (e) {
    console.error("Failed to load state from localStorage", e);
    return null;
  }
};

const App: React.FC = () => {
  const initialState = getInitialState();

  const validShapes: Shape[] = ['flower', 'circle', 'heart'];
  const initialShape = initialState?.progressShape;
  const validatedShape = initialShape && validShapes.includes(initialShape) ? initialShape : 'flower';

  const [currentHours, setCurrentHours] = useState(initialState?.currentHours ?? 12.5);
  const [userName, setUserName] = useState(initialState?.userName ?? 'Precursor');
  const [goal, setGoal] = useState(initialState?.goal ?? 50);
  const [currentDate, setCurrentDate] = useState(initialState?.currentDate ?? new Date());
  const [progressShape, setProgressShape] = useState<Shape>(validatedShape);
  const [themeColor, setThemeColor] = useState<ThemeColor>(initialState?.themeColor ?? 'blue');
  const [history, setHistory] = useState<HistoryLog>(initialState?.history ?? {});


  const [isAddHoursModalOpen, setAddHoursModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(error => {
            console.log('ServiceWorker registration failed: ', error);
          });
      });
    }
  }, []);

  useEffect(() => {
    const stateToSave = {
      currentHours,
      userName,
      goal,
      currentDate: currentDate.toISOString(),
      progressShape,
      themeColor,
      history,
    };
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [currentHours, userName, goal, currentDate, progressShape, themeColor, history]);

  const formatDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleAddHours = (hoursToAdd: number) => {
    if (hoursToAdd <= 0) return;
    const dateKey = formatDateKey(currentDate);
    setHistory(prevHistory => {
      const newHistory = { ...prevHistory };
      newHistory[dateKey] = (newHistory[dateKey] || 0) + hoursToAdd;
      return newHistory;
    });
    setCurrentHours(prevHours => prevHours + hoursToAdd);
    setAddHoursModalOpen(false);
  };

  const handleSetHours = (totalHours: number) => {
    const difference = totalHours - currentHours;
    const dateKey = formatDateKey(currentDate);

    if (difference !== 0) {
      setHistory(prevHistory => {
        const newHistory = { ...prevHistory };
        newHistory[dateKey] = (newHistory[dateKey] || 0) + difference;
        return newHistory;
      });
    }

    setCurrentHours(totalHours);
    setAddHoursModalOpen(false);
  }

  const openAddModal = () => {
    setModalMode('add');
    setAddHoursModalOpen(true);
  };

  const openEditModal = () => {
    setModalMode('edit');
    setAddHoursModalOpen(true);
  };

  const handleSaveSettings = (newName: string, newGoal: number, newDate: Date, newShape: Shape, newColor: ThemeColor) => {
    setUserName(newName);
    setGoal(newGoal);
    setCurrentDate(newDate);
    setProgressShape(newShape);
    setThemeColor(newColor);
    setIsSettingsOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header userName={userName} />
      
      <main className="pt-24 pb-28 flex justify-center">
        <ServiceTracker 
          currentHours={currentHours} 
          goal={goal}
          currentDate={currentDate}
          onEditClick={openEditModal} 
          onAddHours={handleAddHours}
          progressShape={progressShape}
          themeColor={themeColor}
        />
      </main>

      <BottomNav 
        onAddClick={openAddModal} 
        onHistoryClick={() => setHistoryModalOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)} 
        themeColor={themeColor} 
      />

      <AddHoursModal 
        isOpen={isAddHoursModalOpen}
        onClose={() => setAddHoursModalOpen(false)}
        onAddHours={handleAddHours}
        onSetHours={handleSetHours}
        mode={modalMode}
        currentHours={currentHours}
        themeColor={themeColor}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
        currentName={userName}
        currentGoal={goal}
        currentDate={currentDate}
        currentShape={progressShape}
        currentColor={themeColor}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        history={history}
        currentDate={currentDate}
      />
    </div>
  );
};

export default App;