import React, { useState, useEffect, useRef, useMemo } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ServiceTracker from './components/ServiceTracker';
import HistoryView from './components/HistoryView';
import ActivityView from './components/ActivityView';
import GreetingCard from './components/GreetingCard';
import AddHoursModal from './components/AddHoursModal';
import SettingsModal from './components/SettingsModal';
import HelpModal from './components/HelpModal';
import OfflineToast from './components/OfflineToast';
import Welcome from './components/Welcome';
import StreakRestoreToast from './components/StreakRestoreToast';
import StreakModal from './components/StreakModal';
import InteractiveTutorial from './components/InteractiveTutorial';
import TutorialConfirmationModal from './components/TutorialConfirmationModal';
import GoalReachedModal from './components/GoalReachedModal';
import Sidebar from './components/Sidebar';
import EndOfYearModal from './components/EndOfYearModal';
import ConfirmationModal from './components/ConfirmationModal';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { ThemeColor, HistoryLog, Shape, ActivityItem, ActivityType, ThemeMode, GroupArrangement, SetupData, TutorialsSeen, TutorialStep, AppState, WeatherCondition, DayStatus, DayEntry } from './types';
import { isSameDay, daysBetween, isWeekend, getServiceYear, getServiceYearMonths } from './utils';

const APP_STORAGE_key = 'garden-service-tracker';
const WELCOME_SHOWN_KEY = 'garden-welcome-shown';
const TUTORIALS_SEEN_KEY = 'garden-tutorials-seen';
const TUTORIAL_AGREEMENT_KEY = 'garden-tutorial-agreement';
const SETTINGS_KEY = 'garden-settings';
const PRIVACY_MODE_KEY = 'garden-privacy-mode';
const REMINDER_LAST_SENT_KEY = 'garden-reminder-last-sent';

type AppView = 'tracker' | 'activity' | 'history';

const TUTORIALS: Record<AppView, TutorialStep[]> = {
  tracker: [
    { target: '#progress-display-container', title: 'Tu Progreso Mensual', content: 'Este es el corazón de tu informe. Muestra tu avance hacia la meta. ¡Tócalo para editar tu total de horas!', position: 'bottom' },
    { target: '#ghost-mode-toggle', title: 'Modo Fantasma', content: 'Compite contra ti mismo. El fantasma marca las horas que llevabas en la misma fecha del mes anterior. Ten en cuenta que esta función estará disponible después de que completes tu primer mes de registro en la app.', position: 'bottom' },
    { target: '#timer-section', title: 'Temporizador Integrado', content: 'Usa el temporizador para registrar tu servicio en tiempo real. ¡No perderás ni un minuto!', position: 'top' },
    { target: '#streak-indicator', title: 'Tu Racha Diaria', content: '¡Mantén la motivación! Toca aquí para ver los detalles de tu racha y configurar tu día de descanso.', position: 'bottom' },
    { target: '#add-hours-button', title: 'Añadir Horas y Actividad', content: 'Usa este botón para añadir rápidamente las horas de tus sesiones de predicación o para registrar una revisita o estudio.', position: 'top' },
  ],
  activity: [
    { target: '#activity-tabs', title: 'Organiza tu Ministerio', content: 'Cambia entre estas pestañas para ver tus grupos, revisitas y estudios bíblicos.', position: 'bottom' },
    { target: '#import-groups-button', title: 'Importación Inteligente', content: 'Copia el texto de los arreglos de grupo de la semana y pégalo aquí. La IA lo organizará por ti.', position: 'bottom' },
  ],
  history: [
    { target: '#history-year-selector', title: 'Historial Anual', content: 'Usa este selector para ver tu progreso en años de servicio anteriores.', position: 'bottom' },
    { target: '#month-navigator', title: 'Navega por Mes', content: 'Usa las flechas para moverte entre los meses del año de servicio.', position: 'bottom' },
    { target: '#calendar-grid', title: 'Calendario Editable', content: 'Cada día muestra tus horas registradas. ¡Toca cualquier día para añadir o editar tus horas!', position: 'top' },
  ],
};

const getViewFromHash = (hash: string): AppView => {
    switch (hash) {
        case '#/activity':
            return 'activity';
        case '#/history':
            return 'history';
        case '#/':
        case '':
        default:
            return 'tracker';
    }
};


const getInitialState = (): AppState | null => {
  try {
    const saved = localStorage.getItem(APP_STORAGE_key);
    if (!saved) return null;
    const parsed = JSON.parse(saved);

    const today = new Date();
    const currentServiceYear = getServiceYear(today);

    // Date migration
    if (parsed.currentDate) {
      const d = new Date(parsed.currentDate);
      parsed.currentDate = !isNaN(d.getTime()) ? d : today;
    } else {
      parsed.currentDate = today;
    }
    
    // History migration to multi-year archive structure and DayEntry object structure
    if (parsed.history && !parsed.archives) { // very old structure
        parsed.archives = {
            [getServiceYear(parsed.currentDate as Date)]: parsed.history
        };
        delete parsed.history;
    } else if (!parsed.archives) {
        parsed.archives = {
            [currentServiceYear]: {}
        };
    }

    // New DayEntry migration: number -> { hours: number }
    for (const year in parsed.archives) {
        const yearHistory = parsed.archives[year];
        for (const dateKey in yearHistory) {
            const entry = yearHistory[dateKey];
            if (typeof entry === 'number') {
                yearHistory[dateKey] = { hours: entry };
            }
        }
    }


    if (!parsed.currentServiceYear) {
        parsed.currentServiceYear = getServiceYear(parsed.currentDate as Date);
    }
    
    // Streak last log date migration
    if (parsed.lastLogDate) {
        const d = new Date(parsed.lastLogDate);
        parsed.lastLogDate = !isNaN(d.getTime()) ? d : null;
    }

    if (!parsed.activities) parsed.activities = [];
    if (!parsed.groupArrangements) parsed.groupArrangements = [];
    if (!parsed.currentLdcHours) parsed.currentLdcHours = 0;

    return parsed;
  } catch (e) {
    console.error("Failed to load state from localStorage", e);
    return null;
  }
};

const getSettings = () => {
    try {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (!saved) return { performanceMode: false, remindersEnabled: false, reminderTime: '10:00' };
        const parsed = JSON.parse(saved);
        return {
            performanceMode: parsed.performanceMode ?? false,
            remindersEnabled: parsed.remindersEnabled ?? false,
            reminderTime: parsed.reminderTime ?? '10:00',
        };
    } catch (e) {
        console.error("Failed to load settings", e);
        return { performanceMode: false, remindersEnabled: false, reminderTime: '10:00' };
    }
}

const getInitialPrivacyMode = (): boolean => {
    try {
        const saved = localStorage.getItem(PRIVACY_MODE_KEY);
        return saved === 'true';
    } catch (e) {
        console.error("Failed to load privacy mode setting", e);
        return false;
    }
}


const App: React.FC = () => {
  const initialState = getInitialState();
  const initialSettings = getSettings();
  const isOnline = useOnlineStatus();
  
  const initialServiceYear = getServiceYear(initialState?.currentDate ? new Date(initialState.currentDate) : new Date());

  const validShapes: Shape[] = ['flower', 'circle', 'heart'];
  const initialShape = initialState?.progressShape;
  const validatedShape = initialShape && validShapes.includes(initialShape) ? initialShape : 'circle';

  const validThemeModes: ThemeMode[] = ['light', 'dark', 'black'];
  const initialThemeMode = initialState?.themeMode;
  const validatedThemeMode = initialThemeMode && validThemeModes.includes(initialThemeMode) ? initialThemeMode : 'dark';

  const [currentHours, setCurrentHours] = useState(initialState?.currentHours ?? 0);
  const [currentLdcHours, setCurrentLdcHours] = useState(initialState?.currentLdcHours ?? 0);
  const [userName, setUserName] = useState(initialState?.userName ?? 'Precursor');
  const [goal, setGoal] = useState(initialState?.goal ?? 50);
  const [currentDate, setCurrentDate] = useState(initialState?.currentDate ? new Date(initialState.currentDate) : new Date());
  const [progressShape, setProgressShape] = useState<Shape>(validatedShape);
  const [themeColor, setThemeColor] = useState<ThemeColor>(initialState?.themeColor ?? 'blue');
  const [themeMode, setThemeMode] = useState<ThemeMode>(validatedThemeMode);
  const [archives, setArchives] = useState<Record<string, HistoryLog>>(initialState?.archives ?? { [initialServiceYear]: {} });
  const [currentServiceYear, setCurrentServiceYear] = useState(initialState?.currentServiceYear ?? initialServiceYear);
  const [activities, setActivities] = useState<ActivityItem[]>(initialState?.activities ?? []);
  const [groupArrangements, setGroupArrangements] = useState<GroupArrangement[]>(initialState?.groupArrangements ?? []);
  
  // Streak State
  const [streak, setStreak] = useState(initialState?.streak ?? 0);
  const [lastLogDate, setLastLogDate] = useState<Date | null>(initialState?.lastLogDate ? new Date(initialState.lastLogDate) : null);
  const [streakRestores, setStreakRestores] = useState(initialState?.streakRestores ?? 3);
  const [lastRestoreMonth, setLastRestoreMonth] = useState(initialState?.lastRestoreMonth ?? new Date().getMonth());
  const [protectedDay, setProtectedDay] = useState<number | null>(initialState?.protectedDay ?? null);
  const [showStreakRestoreToast, setShowStreakRestoreToast] = useState(false);
  
  const [activeView, setActiveView] = useState<AppView>(getViewFromHash(window.location.hash));
  const [isAddHoursModalOpen, setAddHoursModalOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isEditTotalHoursMode, setIsEditTotalHoursMode] = useState(false);
  const [isEditLdcHoursMode, setIsEditLdcHoursMode] = useState(false);
  const [dateToEdit, setDateToEdit] = useState<Date | null>(null);
  const [isGoalReachedModalOpen, setGoalReachedModalOpen] = useState(false);
  const [isEndOfYearModalOpen, setEndOfYearModalOpen] = useState(false);
  const [isImportConfirmModalOpen, setImportConfirmModalOpen] = useState(false);
  const [importedState, setImportedState] = useState<AppState | null>(null);

  const [activityToEdit, setActivityToEdit] = useState<ActivityItem | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [performanceMode, setPerformanceMode] = useState(initialSettings.performanceMode);
  const [remindersEnabled, setRemindersEnabled] = useState(initialSettings.remindersEnabled);
  const [reminderTime, setReminderTime] = useState(initialSettings.reminderTime);

  const [isPrivacyMode, setIsPrivacyMode] = useState(getInitialPrivacyMode());
  const [isGhostMode, setIsGhostMode] = useState(false);

  const [showWelcome, setShowWelcome] = useState(!localStorage.getItem(WELCOME_SHOWN_KEY));

  const [tutorialsSeen, setTutorialsSeen] = useState<TutorialsSeen>(() => {
    const saved = localStorage.getItem(TUTORIALS_SEEN_KEY);
    return saved ? JSON.parse(saved) : {};
  });
  const [hasAgreedToTutorials, setHasAgreedToTutorials] = useState(() => {
    const saved = localStorage.getItem(TUTORIAL_AGREEMENT_KEY);
    return saved === 'true';
  });
  const [activeTutorial, setActiveTutorial] = useState<TutorialStep[] | null>(null);
  const [tutorialToConfirm, setTutorialToConfirm] = useState<AppView | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for new service year on app load
  useEffect(() => {
    const today = new Date();
    const serviceYearOfToday = getServiceYear(today);
    if (serviceYearOfToday !== currentServiceYear) {
      setEndOfYearModalOpen(true);
    }
  }, []);

  useEffect(() => {
    const settings = { performanceMode, remindersEnabled, reminderTime };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [performanceMode, remindersEnabled, reminderTime]);
  
  useEffect(() => {
    const handleHashChange = () => {
        const newView = getViewFromHash(window.location.hash);
        setActiveView(newView);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
        window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const today = new Date();
        if (!isSameDay(today, currentDate)) {
          setCurrentDate(today);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentDate]);
  
  useEffect(() => {
    if (showWelcome || activeTutorial || tutorialToConfirm) return;
    const tutorialAgreement = localStorage.getItem(TUTORIAL_AGREEMENT_KEY);
    if (tutorialAgreement === 'false') return;
    const shouldShowTutorial = !tutorialsSeen[activeView];
    
    if (shouldShowTutorial) {
      if (hasAgreedToTutorials) {
        const timer = setTimeout(() => setActiveTutorial(TUTORIALS[activeView]), 500);
        return () => clearTimeout(timer);
      } else {
        setTutorialToConfirm(activeView);
      }
    }
  }, [activeView, tutorialsSeen, showWelcome, activeTutorial, tutorialToConfirm, hasAgreedToTutorials]);

  // Daily Reminder Logic
  useEffect(() => {
    if (!remindersEnabled || notificationPermission !== 'granted' || !reminderTime) {
      return;
    }

    const intervalId = setInterval(() => {
      const now = new Date();
      const lastSentDateStr = localStorage.getItem(REMINDER_LAST_SENT_KEY);
      const todayStr = now.toISOString().split('T')[0];

      if (lastSentDateStr === todayStr) {
        return; // Already sent today
      }

      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      if (currentTime === reminderTime) {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification('Garden: ¡Hora de servir!', {
                body: 'Un recordatorio amigable para registrar tu actividad de hoy. 🌱',
                icon: '/assets/icon-192x192.svg',
                tag: 'garden-daily-reminder',
            });
        });
        localStorage.setItem(REMINDER_LAST_SENT_KEY, todayStr);
      }
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [remindersEnabled, reminderTime, notificationPermission]);

  const handleTutorialFinish = (view: AppView) => {
    const newTutorialsSeen = { ...tutorialsSeen, [view]: true };
    setTutorialsSeen(newTutorialsSeen);
    localStorage.setItem(TUTORIALS_SEEN_KEY, JSON.stringify(newTutorialsSeen));
    setActiveTutorial(null);
  };
  
  const handleStartTutorial = (view: AppView) => {
    setHasAgreedToTutorials(true);
    localStorage.setItem(TUTORIAL_AGREEMENT_KEY, 'true');
    setTutorialsSeen(prev => ({...prev}));
    setActiveTutorial(TUTORIALS[view]);
    setTutorialToConfirm(null);
  };
  
  const handleSkipAllTutorials = () => {
    const allSeen: TutorialsSeen = { tracker: true, activity: true, history: true };
    setTutorialsSeen(allSeen);
    localStorage.setItem(TUTORIALS_SEEN_KEY, JSON.stringify(allSeen));
    localStorage.setItem(TUTORIAL_AGREEMENT_KEY, 'false');
    setTutorialToConfirm(null);
  };

  const handleReplayTutorial = () => {
    setHelpModalOpen(false);
    setTimeout(() => setActiveTutorial(TUTORIALS[activeView]), 300);
  };

  useEffect(() => {
    document.body.style.overflow = activeView === 'tracker' ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [activeView]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const handleSetRemindersEnabled = (enabled: boolean) => {
    if (enabled && notificationPermission !== 'granted') {
      requestNotificationPermission();
    }
    setRemindersEnabled(enabled);
  };

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('SW registration successful: ', registration.scope);
            if (registration.installing) {
               registration.installing.onstatechange = () => {
                 if (registration.installing?.state === 'installed') setIsOfflineReady(true);
               };
            }
          })
          .catch(error => console.log('SW registration failed: ', error));
      });
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', themeMode !== 'light');
    root.classList.toggle('theme-black', themeMode === 'black');
  }, [themeMode]);

  useEffect(() => {
    const stateToSave: AppState = {
      currentHours,
      currentLdcHours,
      userName,
      goal,
      currentDate: currentDate.toISOString(),
      progressShape,
      themeColor,
      themeMode,
      archives,
      currentServiceYear,
      activities,
      groupArrangements,
      streak,
      lastLogDate: lastLogDate ? lastLogDate.toISOString() : null,
      streakRestores,
      lastRestoreMonth,
      protectedDay,
    };
    localStorage.setItem(APP_STORAGE_key, JSON.stringify(stateToSave));
  }, [currentHours, currentLdcHours, userName, goal, currentDate, progressShape, themeColor, themeMode, archives, currentServiceYear, activities, groupArrangements, streak, lastLogDate, streakRestores, lastRestoreMonth, protectedDay]);
  
  useEffect(() => {
    localStorage.setItem(PRIVACY_MODE_KEY, String(isPrivacyMode));
  }, [isPrivacyMode]);

  const formatDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const updateStreak = () => {
    const today = new Date();
    
    if (today.getMonth() !== lastRestoreMonth) {
        setStreakRestores(3);
        setLastRestoreMonth(today.getMonth());
    }

    if (!lastLogDate) {
        setStreak(1);
        setLastLogDate(today);
        return;
    }

    if (isSameDay(today, lastLogDate)) return;

    const daysDiff = daysBetween(today, lastLogDate);

    if (daysDiff === 1) {
        setStreak(s => s + 1);
    } else {
        let missedDaysAreProtected = true;
        for (let i = 1; i < daysDiff; i++) {
            const checkDate = new Date(lastLogDate);
            checkDate.setDate(checkDate.getDate() + i);
            if (!(isWeekend(checkDate) || (protectedDay !== null && checkDate.getDay() === protectedDay))) {
                missedDaysAreProtected = false;
                break;
            }
        }

        if (missedDaysAreProtected) {
            setStreak(s => s + 1);
        } else if (streakRestores > 0) {
            setStreakRestores(r => r - 1);
            setStreak(s => s + 1);
            setShowStreakRestoreToast(true);
        } else {
            setStreak(1);
        }
    }
    setLastLogDate(today);
  };

  const handleAddHours = (hoursToAdd: number, weather?: WeatherCondition) => {
    if (hoursToAdd <= 0) return;
    const dateKey = formatDateKey(new Date());
    setArchives(prev => {
        const newArchives = { ...prev };
        const yearHistory = { ...(newArchives[currentServiceYear] || {}) };
        const oldEntry = yearHistory[dateKey] || { hours: 0 };
        yearHistory[dateKey] = {
            ...oldEntry,
            hours: oldEntry.hours + hoursToAdd,
            weather: weather || oldEntry.weather, // Keep old weather if new one isn't provided
        };
        newArchives[currentServiceYear] = yearHistory;
        return newArchives;
    });
    
    const wasGoalReached = currentHours >= goal;
    const newHours = currentHours + hoursToAdd;
    if (!wasGoalReached && newHours >= goal) setGoalReachedModalOpen(true);

    setCurrentHours(newHours);
    updateStreak();
    setAddHoursModalOpen(false);
  };

  const handleAddLdcHours = (ldcHoursToAdd: number) => {
    if (ldcHoursToAdd <= 0) return;
    const dateKey = formatDateKey(new Date());
    setArchives(prev => {
        const newArchives = { ...prev };
        const yearHistory = { ...(newArchives[currentServiceYear] || {}) };
        const oldEntry: DayEntry = yearHistory[dateKey] || { hours: 0 };
        yearHistory[dateKey] = {
            ...oldEntry,
            ldcHours: (oldEntry.ldcHours || 0) + ldcHoursToAdd,
        };
        newArchives[currentServiceYear] = yearHistory;
        return newArchives;
    });
    setCurrentLdcHours(prev => prev + ldcHoursToAdd);
    setAddHoursModalOpen(false);
  };

  const handleSetHours = (totalHours: number) => {
    const difference = totalHours - currentHours;
    const dateKey = formatDateKey(currentDate);

    if (difference !== 0) {
        setArchives(prev => {
            const newArchives = { ...prev };
            const yearHistory = { ...(newArchives[currentServiceYear] || {}) };
            const oldEntry = yearHistory[dateKey] || { hours: 0 };
            yearHistory[dateKey] = { ...oldEntry, hours: oldEntry.hours + difference };
            newArchives[currentServiceYear] = yearHistory;
            return newArchives;
        });
    }
    
    if (!(currentHours >= goal) && totalHours >= goal) setGoalReachedModalOpen(true);
    
    setCurrentHours(totalHours);
    if (totalHours > 0) updateStreak();
    handleCloseModal();
  }
  
  const handleSetLdcHours = (totalLdcHours: number) => {
    const difference = totalLdcHours - currentLdcHours;
    const dateKey = formatDateKey(currentDate);

    if (difference !== 0) {
        setArchives(prev => {
            const newArchives = { ...prev };
            const yearHistory = { ...(newArchives[currentServiceYear] || {}) };
            const oldEntry: DayEntry = yearHistory[dateKey] || { hours: 0 };
            yearHistory[dateKey] = { 
                ...oldEntry, 
                ldcHours: (oldEntry.ldcHours || 0) + difference 
            };
            newArchives[currentServiceYear] = yearHistory;
            return newArchives;
        });
    }
    setCurrentLdcHours(totalLdcHours);
    handleCloseModal();
  };
  
  const handleDeleteLdcHours = () => {
    setArchives(prev => {
        const newArchives = { ...prev };
        const yearHistory = { ...(newArchives[currentServiceYear] || {}) };
        const today = currentDate;
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        for (const key in yearHistory) {
            const entryDate = new Date(key);
            if (entryDate.getFullYear() === currentYear && entryDate.getMonth() === currentMonth) {
                if (yearHistory[key].ldcHours) {
                    delete yearHistory[key].ldcHours;
                }
            }
        }
        newArchives[currentServiceYear] = yearHistory;
        return newArchives;
    });
    setCurrentLdcHours(0);
    handleCloseModal();
  };

  const handleSetHoursForDate = (newTotalHours: number, date: Date, weather?: WeatherCondition, isCampaign?: boolean) => {
    const dateKey = formatDateKey(date);
    const serviceYear = getServiceYear(date);

    setArchives(prev => {
      const newArchives = { ...prev };
      if (!newArchives[serviceYear]) newArchives[serviceYear] = {};
      const yearHistory = { ...(newArchives[serviceYear]) };
      const oldEntry = yearHistory[dateKey] || { hours: 0 };
      
      const newEntry: DayEntry = {
          ...oldEntry,
          hours: newTotalHours,
          weather: weather || oldEntry.weather, // Keep old weather if not specified
      };
      
      if (isCampaign) {
        newEntry.isCampaign = true;
      } else {
        delete newEntry.isCampaign;
      }
      
      if(newEntry.status === 'sick') newEntry.hours = 0;

      if (newEntry.hours > 0 || newEntry.weather || newEntry.status || newEntry.isCampaign || (newEntry.ldcHours && newEntry.ldcHours > 0)) {
        yearHistory[dateKey] = newEntry;
      } else {
        delete yearHistory[dateKey];
      }
      newArchives[serviceYear] = yearHistory;

      // Recalculate current month total
      const today = currentDate;
      if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth()) {
        const currentMonthHistory = newArchives[getServiceYear(today)];
        let total = 0;
        for (const key in currentMonthHistory) {
          const entryDate = new Date(key);
          if (entryDate.getFullYear() === today.getFullYear() && entryDate.getMonth() === today.getMonth()) {
            total += currentMonthHistory[key].hours || 0;
          }
        }
        setCurrentHours(total);
      }

      return newArchives;
    });

    if (newTotalHours > 0) {
        const today = new Date();
        if (date.getTime() <= today.getTime()) {
          if (!lastLogDate || date > lastLogDate) {
              setLastLogDate(date);
              if (streak === 0) setStreak(1);
          }
        }
    }
    handleCloseModal();
  };

  const handleSetLdcHoursForDate = (ldcHours: number, date: Date) => {
    const dateKey = formatDateKey(date);
    const serviceYear = getServiceYear(date);

    setArchives(prev => {
      const newArchives = { ...prev };
      if (!newArchives[serviceYear]) newArchives[serviceYear] = {};
      const yearHistory = { ...newArchives[serviceYear] };
      const oldEntry = yearHistory[dateKey] || { hours: 0 };
      
      const newEntry: DayEntry = { ...oldEntry, ldcHours: ldcHours };
      
      if (newEntry.hours > 0 || newEntry.weather || newEntry.status || newEntry.isCampaign || (newEntry.ldcHours && newEntry.ldcHours > 0)) {
        yearHistory[dateKey] = newEntry;
      } else {
        delete yearHistory[dateKey];
      }
      newArchives[serviceYear] = yearHistory;
      
      // Recalculate current month LDC total
      const today = currentDate;
      if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth()) {
        const currentMonthHistory = newArchives[getServiceYear(today)];
        let total = 0;
        for (const key in currentMonthHistory) {
          const entryDate = new Date(key);
          if (entryDate.getFullYear() === today.getFullYear() && entryDate.getMonth() === today.getMonth()) {
            total += currentMonthHistory[key].ldcHours || 0;
          }
        }
        setCurrentLdcHours(total);
      }

      return newArchives;
    });
    handleCloseModal();
  };
  
  const handleMarkDayStatus = (date: Date, status: DayStatus | null) => {
    const dateKey = formatDateKey(date);
    const serviceYear = getServiceYear(date);

    setArchives(prev => {
        const newArchives = { ...prev };
        if (!newArchives[serviceYear]) newArchives[serviceYear] = {};
        const yearHistory = { ...(newArchives[serviceYear]) };
        const oldEntry = yearHistory[dateKey] || { hours: 0 };
        
        const newEntry: DayEntry = { ...oldEntry };

        if (status) { // Setting a status
            newEntry.status = status;
            newEntry.hours = 0;
            newEntry.ldcHours = 0;
        } else { // Clearing a status
            delete newEntry.status;
        }

        if (newEntry.hours > 0 || newEntry.weather || newEntry.status || newEntry.isCampaign || (newEntry.ldcHours && newEntry.ldcHours > 0)) {
            yearHistory[dateKey] = newEntry;
        } else {
            delete yearHistory[dateKey];
        }
        
        newArchives[serviceYear] = yearHistory;

        // Update current month totals if status change affected hours
        const today = currentDate;
        if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth()) {
            const currentMonthHistory = newArchives[getServiceYear(today)];
            let totalService = 0;
            let totalLdc = 0;
            for (const key in currentMonthHistory) {
              const entryDate = new Date(key);
              if (entryDate.getFullYear() === today.getFullYear() && entryDate.getMonth() === today.getMonth()) {
                totalService += currentMonthHistory[key].hours || 0;
                totalLdc += currentMonthHistory[key].ldcHours || 0;
              }
            }
            setCurrentHours(totalService);
            setCurrentLdcHours(totalLdc);
        }
        
        return newArchives;
    });
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setAddHoursModalOpen(false);
    setActivityToEdit(null);
    setDateToEdit(null);
    setIsEditTotalHoursMode(false);
    setIsEditLdcHoursMode(false);
  };

  const handleSaveActivity = (data: Omit<ActivityItem, 'id' | 'date'> & { recurring?: boolean }) => {
    const activityDate = dateToEdit || new Date();
    if (activityToEdit) {
      const updatedActivity = { ...activityToEdit, ...data };
      setActivities(prev => prev.map(a => a.id === updatedActivity.id ? updatedActivity : a));
    } else {
      const newActivity: ActivityItem = { 
        ...data, 
        id: Date.now().toString(), 
        date: activityDate.toISOString() 
      };
      setActivities(prev => [newActivity, ...prev]);
    }
    handleCloseModal();
  };

  const handleDeleteActivity = (activityId: string) => {
    setActivities(prev => prev.filter(a => a.id !== activityId));
  };

  const handleStartEditActivity = (activity: ActivityItem) => {
    setActivityToEdit(activity);
    setAddHoursModalOpen(true);
  };
  
  const handleDayClickForHistory = (date: Date) => {
    setDateToEdit(date);
    setIsEditTotalHoursMode(false);
    setAddHoursModalOpen(true);
  };

  const openAddModal = () => {
    setActivityToEdit(null);
    setIsEditTotalHoursMode(false);
    setDateToEdit(null);
    setAddHoursModalOpen(true);
  };

  const openEditModal = () => {
    setActivityToEdit(null);
    setIsEditTotalHoursMode(true);
    setDateToEdit(null);
    setAddHoursModalOpen(true);
  };
  
  const openEditLdcModal = () => {
    setActivityToEdit(null);
    setIsEditLdcHoursMode(true);
    setDateToEdit(null);
    setAddHoursModalOpen(true);
  };

  const handleSaveSettings = (newName: string, newGoal: number, newDate: Date, newShape: Shape, newColor: ThemeColor, newMode: ThemeMode) => {
    setUserName(newName);
    setGoal(newGoal);
    setCurrentDate(newDate);
    setProgressShape(newShape);
    setThemeColor(newColor);
    setThemeMode(newMode);
    setIsSettingsOpen(false);
  };
  
  const handleWelcomeFinish = (data: SetupData) => {
    if (data.name.trim()) setUserName(data.name.trim());
    
    const now = new Date();
    const serviceYear = getServiceYear(now);
    
    if (Object.keys(data.previousHours).length > 0) {
        const yearArchives: Record<string, HistoryLog> = {};
        let hoursForCurrentMonth = 0;
        
        Object.entries(data.previousHours).forEach(([dateKey, hours]) => {
            if (hours > 0) {
                const entryDate = new Date(dateKey);
                const entryServiceYear = getServiceYear(entryDate);
                if (!yearArchives[entryServiceYear]) {
                    yearArchives[entryServiceYear] = {};
                }
                const monthKey = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}-SUMMARY`;
                yearArchives[entryServiceYear][monthKey] = { hours, isSummary: true };

                if (entryDate.getFullYear() === now.getFullYear() && entryDate.getMonth() === now.getMonth()) {
                    hoursForCurrentMonth += hours;
                }
            }
        });
        
        // This logic is tricky. If they input hours for the current month, it might be better to just set currentHours
        // without creating a summary entry, as they will start adding daily entries.
        // For now, let's assume the welcome hours for the current month are a starting point.
        // We will sum them up, but a summary key for the current month might be confusing.
        const currentMonthSummaryKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-SUMMARY`;
        if (yearArchives[serviceYear] && yearArchives[serviceYear][currentMonthSummaryKey]) {
           hoursForCurrentMonth = yearArchives[serviceYear][currentMonthSummaryKey].hours;
           delete yearArchives[serviceYear][currentMonthSummaryKey]; // Don't create summary for active month
        }


        setCurrentHours(hoursForCurrentMonth);
        if(hoursForCurrentMonth > 0) updateStreak();
        setArchives(yearArchives);
        setCurrentServiceYear(serviceYear);
    }

    localStorage.setItem(WELCOME_SHOWN_KEY, 'true');
    setShowWelcome(false);
    window.location.hash = '#/';
  };

  const handleSaveArrangements = (arrangements: GroupArrangement[]) => {
    setGroupArrangements(arrangements);
  };
  
  const handleShowWelcome = () => {
    localStorage.removeItem(WELCOME_SHOWN_KEY);
    setShowWelcome(true);
    setSidebarOpen(false);
  };
  
  const handleArchiveAndStartNewYear = () => {
    const today = new Date();
    const newServiceYear = getServiceYear(today);
    
    setCurrentServiceYear(newServiceYear);
    setCurrentHours(0);
    setCurrentLdcHours(0);
    setArchives(prev => ({ ...prev, [newServiceYear]: {} }));
    
    setEndOfYearModalOpen(false);
  };

  const handleExportData = () => {
    const stateString = localStorage.getItem(APP_STORAGE_key);
    if (stateString) {
      const blob = new Blob([stateString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `garden-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const parsedState = JSON.parse(text) as AppState;
          // Basic validation
          if (parsedState.userName && typeof parsedState.currentHours === 'number' && parsedState.archives) {
            setImportedState(parsedState);
            setImportConfirmModalOpen(true);
          } else {
            alert('El archivo de respaldo no es válido.');
          }
        } catch (error) {
          alert('Error al leer el archivo de respaldo.');
        }
      };
      reader.readAsText(file);
    }
    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  };
  
  const handleConfirmImport = () => {
    if (importedState) {
        const newCurrentDate = new Date(importedState.currentDate);
        setUserName(importedState.userName);
        setGoal(importedState.goal);
        setCurrentDate(newCurrentDate);
        setProgressShape(importedState.progressShape);
        setThemeColor(importedState.themeColor);
        setThemeMode(importedState.themeMode);
        setArchives(importedState.archives);
        setCurrentServiceYear(importedState.currentServiceYear);
        setCurrentHours(importedState.currentHours);
        setCurrentLdcHours(importedState.currentLdcHours || 0);
        setActivities(importedState.activities);
        setGroupArrangements(importedState.groupArrangements);
        setStreak(importedState.streak);
        setLastLogDate(importedState.lastLogDate ? new Date(importedState.lastLogDate) : null);
        setStreakRestores(importedState.streakRestores);
        setLastRestoreMonth(importedState.lastRestoreMonth);
        setProtectedDay(importedState.protectedDay);
    }
    setImportConfirmModalOpen(false);
    setImportedState(null);
  };

  const viewTitleMap: Record<AppView, string> = {
    tracker: 'Garden',
    activity: 'Actividad',
    history: 'Historial',
  };
  const viewTitle = viewTitleMap[activeView];

  const previousMonthHistory = useMemo(() => {
    const prevMonthDate = new Date(currentDate);
    prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
    
    const prevMonthServiceYear = getServiceYear(prevMonthDate);
    const prevYearHistory = archives[prevMonthServiceYear] || {};

    const prevMonth = prevMonthDate.getMonth();
    const prevYear = prevMonthDate.getFullYear();

    const filteredHistory: HistoryLog = {};
    for (const dateKey in prevYearHistory) {
        const entryDate = new Date(dateKey + "T12:00:00Z"); // Use noon to avoid TZ issues
        if (entryDate.getUTCMonth() === prevMonth && entryDate.getUTCFullYear() === prevYear) {
            filteredHistory[dateKey] = prevYearHistory[dateKey];
        }
         // Also include summary keys
        if (dateKey.endsWith('-SUMMARY')) {
            const [year, month] = dateKey.split('-').map(Number);
            if (year === prevYear && (month - 1) === prevMonth) {
                filteredHistory[dateKey] = prevYearHistory[dateKey];
            }
        }
    }
    return filteredHistory;
  }, [currentDate, archives]);


  const renderContent = () => {
    switch (activeView) {
      case 'tracker':
        return (
          <>
            <ServiceTracker 
              currentHours={currentHours}
              currentLdcHours={currentLdcHours}
              goal={goal}
              currentDate={currentDate}
              onEditClick={openEditModal} 
              onEditLdcClick={openEditLdcModal}
              onAddHours={handleAddHours}
              progressShape={progressShape}
              themeColor={themeColor}
              onSettingsClick={() => setIsSettingsOpen(true)}
              onHelpClick={() => setHelpModalOpen(true)}
              notificationPermission={notificationPermission}
              onRequestNotificationPermission={requestNotificationPermission}
              performanceMode={performanceMode}
              isPrivacyMode={isPrivacyMode}
              onTogglePrivacyMode={() => setIsPrivacyMode(p => !p)}
              isGhostMode={isGhostMode}
              onToggleGhostMode={() => setIsGhostMode(p => !p)}
              previousMonthHistory={previousMonthHistory}
            />
            <GreetingCard userName={userName} themeColor={themeColor} performanceMode={performanceMode} />
          </>
        );
      case 'activity':
        return <ActivityView 
                  activities={activities}
                  groupArrangements={groupArrangements}
                  onSaveArrangements={handleSaveArrangements}
                  themeColor={themeColor} 
                  onEdit={handleStartEditActivity}
                  onDelete={handleDeleteActivity}
                  isOnline={isOnline}
                  performanceMode={performanceMode}
                  currentDate={currentDate}
                />;
      case 'history':
        return <HistoryView 
          archives={archives}
          currentServiceYear={currentServiceYear}
          themeColor={themeColor}
          isPrivacyMode={isPrivacyMode}
          onDayClick={handleDayClickForHistory}
          activities={activities}
        />;
      default:
        return null;
    }
  }

  if (showWelcome) {
    return <Welcome 
        onFinish={handleWelcomeFinish} 
        themeColor={themeColor} 
        performanceMode={performanceMode}
        themeMode={themeMode}
        progressShape={progressShape}
        setThemeColor={setThemeColor}
        setThemeMode={setThemeMode}
        setProgressShape={setProgressShape}
      />;
  }

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200">
      <Header 
        title={viewTitle} 
        themeColor={themeColor} 
        streak={streak}
        onStreakClick={() => setIsStreakModalOpen(true)}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        performanceMode={performanceMode}
        onSetPerformanceMode={setPerformanceMode}
        onShowWelcome={handleShowWelcome}
        onExport={handleExportData}
        onImport={handleImportClick}
        themeColor={themeColor}
        remindersEnabled={remindersEnabled}
        onSetRemindersEnabled={handleSetRemindersEnabled}
        reminderTime={reminderTime}
        onSetReminderTime={setReminderTime}
      />
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
      
      <main className="pt-24 pb-28">
        <div className="px-4 animate-fadeIn">
          {renderContent()}
        </div>
      </main>

      <BottomNav 
        activeView={activeView}
        onAddClick={openAddModal} 
        themeColor={themeColor}
        performanceMode={performanceMode}
      />

      <AddHoursModal 
        isOpen={isAddHoursModalOpen}
        onClose={handleCloseModal}
        onAddHours={handleAddHours}
        onAddLdcHours={handleAddLdcHours}
        onSetHours={handleSetHours}
        onSetLdcHours={handleSetLdcHours}
        onDeleteLdcHours={handleDeleteLdcHours}
        onSaveActivity={handleSaveActivity}
        activityToEdit={activityToEdit}
        currentHours={currentHours}
        currentLdcHours={currentLdcHours}
        isEditMode={isEditTotalHoursMode}
        isEditLdcMode={isEditLdcHoursMode}
        themeColor={themeColor}
        performanceMode={performanceMode}
        dateForEntry={dateToEdit}
        onSetHoursForDate={handleSetHoursForDate}
        onSetLdcHoursForDate={handleSetLdcHoursForDate}
        onMarkDayStatus={handleMarkDayStatus}
        archives={archives}
        activities={activities}
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
        currentThemeMode={themeMode}
        performanceMode={performanceMode}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        onReplayTutorial={handleReplayTutorial}
        themeColor={themeColor}
        performanceMode={performanceMode}
      />

      <StreakModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        streak={streak}
        streakRestores={streakRestores}
        themeColor={themeColor}
        protectedDay={protectedDay}
        onSetProtectedDay={setProtectedDay}
        performanceMode={performanceMode}
      />

      <GoalReachedModal
        isOpen={isGoalReachedModalOpen}
        onClose={() => setGoalReachedModalOpen(false)}
        userName={userName}
        goal={goal}
        themeColor={themeColor}
        performanceMode={performanceMode}
      />

      <EndOfYearModal
        isOpen={isEndOfYearModalOpen}
        onArchive={handleArchiveAndStartNewYear}
        onLater={() => setEndOfYearModalOpen(false)}
        themeColor={themeColor}
        performanceMode={performanceMode}
        previousYear={currentServiceYear}
      />
      
      <ConfirmationModal
        isOpen={isImportConfirmModalOpen}
        onClose={() => { setImportConfirmModalOpen(false); setImportedState(null); }}
        onConfirm={handleConfirmImport}
        title="Confirmar Importación"
        message="Esto reemplazará todos tus datos actuales con los del archivo. ¿Estás seguro de que quieres continuar?"
        confirmText="Sí, importar datos"
        themeColor={themeColor}
      />

      <TutorialConfirmationModal
        isOpen={!!tutorialToConfirm}
        onStart={() => handleStartTutorial(tutorialToConfirm!)}
        onSkip={handleSkipAllTutorials}
        themeColor={themeColor}
        viewName={tutorialToConfirm ? viewTitleMap[tutorialToConfirm] : ''}
        performanceMode={performanceMode}
      />

      <InteractiveTutorial
        steps={activeTutorial}
        onFinish={() => handleTutorialFinish(activeView)}
        themeColor={themeColor}
        performanceMode={performanceMode}
      />

      <OfflineToast isVisible={isOfflineReady} onDismiss={() => setIsOfflineReady(false)} />
      <StreakRestoreToast isVisible={showStreakRestoreToast} onDismiss={() => setShowStreakRestoreToast(false)} />
    </div>
  );
};

export default App;