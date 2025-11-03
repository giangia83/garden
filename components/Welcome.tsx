import React, { useState, useMemo, useEffect, useRef } from 'react';
import { THEMES, THEME_LIST } from '../constants';
import { ThemeColor, SetupData, Shape, ThemeMode, UserRole } from '../types';
import { ListBulletIcon } from './icons/ListBulletIcon';
import { HeartIcon } from './icons/HeartIcon';
import { HomeIcon } from './icons/HomeIcon';
import { GardenIcon } from './icons/GardenIcon';
import { UserIcon } from './icons/UserIcon';
import ShapeProgress from './FlowerProgress';
import { FlowerIcon } from './icons/FlowerIcon';
import { CircleIcon } from './icons/CircleIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { SolidCircleIcon } from './icons/SolidCircleIcon';
import { CheckIcon } from './icons/CheckIcon';
import { GhostIcon } from './icons/GhostIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { flexibleInputToHours } from '../utils';

interface WelcomeProps {
  onFinish: (data: SetupData) => void;
  themeColor: ThemeColor;
  themeMode: ThemeMode;
  progressShape: Shape;
  setThemeColor: (color: ThemeColor) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setProgressShape: (shape: Shape) => void;
  performanceMode: boolean;
}

type Theme = typeof THEMES[ThemeColor];

const StreakCounterAnimation: React.FC<{ isActive: boolean, theme: Theme }> = ({ isActive, theme }) => {
  const [count, setCount] = useState(1);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      setCount(1); // Reset on active
      intervalRef.current = window.setInterval(() => {
        setCount(prevCount => {
          if (prevCount >= 100) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 100;
          }
          return prevCount + 1;
        });
      }, 25);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setCount(1); // Reset when not active
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  return (
    <div className={`text-7xl font-bold ${theme.text} tracking-tighter w-28 text-left animate-fadeIn`}>
      {count}
    </div>
  );
};

const GhostModeVisualExample: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [userWidth, setUserWidth] = useState(0);
  const [ghostLeft, setGhostLeft] = useState(0);

  const userTarget = 65; // User is ahead
  const ghostTarget = 55; // Ghost is behind
  const idealTarget = 60; // Ideal pace

  useEffect(() => {
    let timer: number;
    if (isActive) {
      // Animate in after a short delay to sync with slide transition
      timer = window.setTimeout(() => {
        setUserWidth(userTarget);
        setGhostLeft(ghostTarget);
      }, 300); 
    } else {
      // Reset when not active
      setUserWidth(0);
      setGhostLeft(0);
    }
    return () => clearTimeout(timer);
  }, [isActive]);

  return (
    <div className="w-full max-w-[280px] mx-auto px-2 h-28 flex flex-col justify-center">
      <div className="w-full text-center mb-4">
        <p className="font-semibold text-white">Tu Progreso vs. Mes Pasado</p>
      </div>
      {/* Progress Bar Container */}
      <div className="relative w-full h-8 flex items-center">
        {/* Bar background */}
        <div className="w-full bg-slate-700 rounded-full h-2">
          {/* User's progress bar */}
          <div
            className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-1000 ease-out"
            style={{ width: `${userWidth}%` }}
          />
        </div>
        {/* Ideal pace marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-slate-400 rounded-full"
          style={{ left: `${idealTarget}%` }}
          title="Ritmo ideal"
        />
        {/* User's current progress marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-full ring-2 ring-slate-400/50 transition-all duration-1000 ease-out"
          style={{ left: `${userWidth}%` }}
          title="Tu progreso"
        />
        {/* Ghost marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
          style={{ left: `calc(${ghostLeft}% - 10px)` }}
          title="Progreso mes pasado"
        >
          <GhostIcon className="w-5 h-5 text-slate-500" />
        </div>
      </div>
      {/* Labels */}
      <div className="flex justify-between text-xs text-slate-500 mt-2 px-1">
        <span>0 hrs</span>
        <span>Meta</span>
      </div>
    </div>
  );
};


type Slide = {
  type: 'title' | 'feature' | 'setup' | 'customize';
  title: string;
  icon?: (theme: Theme, isActive?: boolean) => React.ReactNode;
  description?: React.ReactNode | ((name: string, role: UserRole) => React.ReactNode);
  step?: number;
};

const getServiceYearMonthsForSetup = () => {
  const now = new Date();
  const currentMonth = now.getMonth();
  let serviceYearStartYear = now.getFullYear();

  if (currentMonth < 8) { 
    serviceYearStartYear -= 1;
  }

  const months = [];
  const serviceYearStartDate = new Date(serviceYearStartYear, 8, 1);

  for (let i = 0; i < 12; i++) {
    const monthDate = new Date(serviceYearStartDate.getFullYear(), serviceYearStartDate.getMonth() + i, 1);
    if (monthDate.getFullYear() > now.getFullYear() || (monthDate.getFullYear() === now.getFullYear() && monthDate.getMonth() >= now.getMonth())) {
      break;
    }
    months.push(monthDate);
  }
  return months.reverse(); 
};


const slideData: Slide[] = [
  {
    type: 'title',
    title: "Garden",
  },
  {
    type: 'feature',
    icon: (theme: Theme) => <HomeIcon className={`w-16 h-16 ${theme.text}`} />,
    title: "Registra tu progreso",
    description: "Lleva un control fácil de tus horas, mira tu avance hacia la meta y usa el temporizador para no perder ni un minuto.",
  },
  {
    type: 'feature',
    icon: (theme: Theme, isActive?: boolean) => (
        <div className="flex items-center justify-center space-x-4">
            <StreakCounterAnimation isActive={isActive ?? false} theme={theme} />
            <GardenIcon className={`w-16 h-16 ${theme.text}`} />
        </div>
    ),
    title: "Mantén tu racha",
    description: "Cada día que registres horas, tu racha aumentará. Los fines de semana y tu día de descanso semanal protegen tu racha para que no la pierdas.",
  },
  {
    type: 'feature',
    icon: (theme: Theme, isActive?: boolean) => <GhostModeVisualExample isActive={isActive ?? false} />,
    title: "Compite contra ti mismo",
    description: "Activa el modo fantasma para comparar tu ritmo actual con el del mes pasado. ¡Una excelente forma de mantener la motivación!",
  },
  {
    type: 'feature',
    icon: (theme: Theme) => <ListBulletIcon className={`w-16 h-16 ${theme.text}`} />,
    title: "Organiza tu ministerio",
    description: "Anota tus revisitas y estudios. Además, puedes pegar los arreglos de grupo y la app los organizará por ti usando IA.",
  },
  {
    type: 'customize',
    step: 1,
    title: "Personaliza tu app",
  },
  {
    type: 'setup',
    step: 2,
    title: "Cuéntame de tu servicio",
  },
   {
    type: 'setup',
    step: 3,
    title: "Horas de este mes",
  },
  {
    type: 'setup',
    step: 4,
    title: "Horas del año de servicio",
  },
  {
    type: 'setup',
    step: 5,
    title: "Cuéntame de ti",
  },
  {
    type: 'feature',
    icon: (theme: Theme) => <HeartIcon className={`w-16 h-16 ${theme.text}`} />,
    title: "¡Todo listo!",
    description: (name: string, role: UserRole) => {
      const pioneerMessage = (
        <>
          ¡Qué bueno tenerte aquí, {name}! Espero que Garden te sea de gran ayuda en tu precursorado. Que te sirva para organizar tu servicio, mantenerte enfocado en tus metas y, sobre todo, sentirte animado a dar siempre lo mejor a Jehová. ¡Mucho ánimo!
        </>
      );
      const publisherMessage = (
        <>
          ¡Qué bueno tenerte aquí, {name}! Espero que Garden te ayude a mantener un buen ritmo en tu servicio. Si alguna vez consideras el precursorado regular, ¡Jehová sin duda bendecirá tus esfuerzos por alcanzar esa meta! ¡Mucho ánimo!
        </>
      );
      return (
        <>
          {role === 'publisher' ? publisherMessage : pioneerMessage}
          <br />— <span>Desarrollador</span>
        </>
      );
    },
  }
];

const RoleButton: React.FC<{label: string, value: UserRole, current: UserRole, onClick: (role: UserRole) => void, theme: Theme}> = ({label, value, current, onClick, theme}) => (
    <button
        type="button"
        onClick={() => onClick(value)}
        className={`w-full p-3 rounded-lg text-sm font-semibold transition-colors border-2 ${current === value ? `${theme.bg} text-white border-transparent` : 'bg-white dark:bg-slate-700/50 border-slate-300 dark:border-slate-600'}`}
    >
        {label}
    </button>
)


const Welcome: React.FC<WelcomeProps> = ({ 
  onFinish, 
  themeColor, 
  themeMode, 
  progressShape, 
  setThemeColor, 
  setThemeMode, 
  setProgressShape, 
  performanceMode 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [name, setName] = useState('Precursor');
  const [role, setRole] = useState<UserRole>('reg_pioneer');
  const [currentMonthHours, setCurrentMonthHours] = useState('');
  const [previousHours, setPreviousHours] = useState<{ [key: string]: number }>({});

  const monthsForSetup = useMemo(() => getServiceYearMonthsForSetup(), []);
  const userSelectedTheme = THEMES[themeColor] || THEMES.green;

  const slides = useMemo(() => {
    const filteredSlides = slideData.filter(slide => {
        if (role === 'publisher' && slide.title === "Horas del año de servicio") {
            return false;
        }
        return true;
    });

    let stepCounter = 0;
    return filteredSlides.map(slide => {
        if (slide.step) {
            stepCounter++;
            return { ...slide, step: stepCounter };
        }
        return slide;
    });
  }, [role]);

  const customizeSlideIndex = useMemo(() => slides.findIndex(s => s.title === 'Personaliza tu app'), [slides]);

  const getSlideTheme = (slideIndex: number, slideTitle: string): Theme => {
    if (slideIndex < customizeSlideIndex) {
        if (slideTitle === "Mantén tu racha") return THEMES.orange;
        if (slideTitle === "Compite contra ti mismo") return THEMES.bw;
        return THEMES.green;
    }
    return userSelectedTheme;
  };
  
  const currentSlideData = slides[currentSlide];
  const displayTheme = getSlideTheme(currentSlide, currentSlideData.title);

  const isOnOrAfterCustomize = currentSlide >= customizeSlideIndex;

  let backgroundClasses = 'bg-black';
  if (isOnOrAfterCustomize) {
    switch (themeMode) {
      case 'light':
        backgroundClasses = 'bg-gray-100';
        break;
      case 'dark':
        backgroundClasses = 'bg-slate-900';
        break;
      case 'black':
        backgroundClasses = 'bg-black';
        break;
    }
  }

  useEffect(() => {
    if (isOnOrAfterCustomize) {
        document.documentElement.classList.toggle('dark', themeMode !== 'light');
        document.documentElement.classList.toggle('theme-black', themeMode === 'black');
    } else {
        // Force true black theme for initial slides
        document.documentElement.classList.add('dark');
        document.documentElement.classList.add('theme-black');
    }
  }, [currentSlide, themeMode, customizeSlideIndex, isOnOrAfterCustomize]);
  
  const isEffectiveLight = isOnOrAfterCustomize ? themeMode === 'light' : false;

  const mainTextColor = isEffectiveLight ? 'text-slate-900' : 'text-white';
  const subTextColor = isEffectiveLight ? 'text-slate-600' : 'text-slate-400';
  const cardBgColor = isEffectiveLight ? 'bg-white/60' : 'bg-slate-900/60';
  const inputBgColor = isEffectiveLight ? 'bg-white/80' : 'bg-slate-800';
  const inputBorderColor = isEffectiveLight ? 'border-slate-300' : 'border-slate-600';
  
  const TOTAL_SETUP_STEPS = useMemo(() => slides.filter(s => s.step).length, [slides]);

  const handleHoursChange = (dateKey: string, hours: string) => {
    const numericHours = parseFloat(hours.replace(',', '.'));
    setPreviousHours(prev => ({
        ...prev,
        [dateKey]: isNaN(numericHours) ? 0 : numericHours,
    }));
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onFinish({
        name: name || 'Precursor',
        role,
        currentMonthHours: parseFloat(currentMonthHours.replace(',', '.')) || 0,
        previousHours
      });
    }
  };
  
  const isLastSlide = currentSlide === slides.length - 1;
  const buttonText = isLastSlide ? 'Comenzar' : 'Siguiente';
  
  const isNextDisabled = useMemo(() => {
    if (currentSlideData?.title === "Horas de este mes" && role !== 'publisher') {
        if (currentMonthHours.trim() === '') return true;
        const hours = flexibleInputToHours(currentMonthHours);
        return isNaN(hours) || hours < 0;
    }
    return false;
  }, [currentSlideData, currentMonthHours, role]);


  const shapeOptions: { name: Shape; Icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { name: 'flower', Icon: FlowerIcon },
    { name: 'circle', Icon: CircleIcon },
    { name: 'heart', Icon: HeartIcon },
  ];

  const themeOptions: { name: ThemeMode, Icon: React.FC<React.SVGProps<SVGSVGElement>>, label: string }[] = [
    { name: 'light', Icon: SunIcon, label: 'Claro' },
    { name: 'dark', Icon: MoonIcon, label: 'Oscuro' },
    { name: 'black', Icon: SolidCircleIcon, label: 'Negro' },
  ];
  
  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 text-center transition-colors duration-500`}>
      <div className={`absolute inset-0 ${backgroundClasses} transition-all duration-500`}></div>
      
      <div className="relative z-10 w-full flex-shrink-0 h-10 flex items-center justify-center">
        {currentSlideData.step && (
            <span className={`text-sm font-bold ${isEffectiveLight ? 'text-slate-500' : 'text-slate-400'} animate-fadeIn`}>{currentSlideData.step} / {TOTAL_SETUP_STEPS}</span>
        )}
      </div>
      
      <div className="relative z-10 w-full flex-grow flex flex-col justify-center">
        <div className="relative w-full h-[34rem] overflow-hidden">
          <div 
            className={`absolute top-0 left-0 w-full h-full flex ${!performanceMode ? 'transition-transform duration-500 ease-in-out' : ''}`}
            style={{ transform: `translateX(-${currentSlide * 100}%)`}}
          >
            {slides.map((slide, index) => {
              const slideTheme = getSlideTheme(index, slide.title);
              return (
              <div key={index} className="w-full h-full flex-shrink-0 flex flex-col items-center justify-center p-4 relative">
                {slide.type === 'title' && (
                  <h1 className={`text-7xl font-logotype ${mainTextColor} animate-fadeIn`}>
                    {slide.title}
                  </h1>
                )}

                {slide.type === 'feature' && (
                  <>
                    <div className="mb-6 h-28 flex items-center justify-center">
                      {slide.icon && slide.icon(slideTheme, currentSlide === index)}
                    </div>
                    <h2 className={`text-3xl font-bold ${mainTextColor} mb-3 tracking-tight`}>{slide.title}</h2>
                    <p className={`${subTextColor} max-w-sm leading-relaxed`}>
                      {(() => {
                        if (typeof slide.description === 'function') {
                          return slide.description(name, role);
                        }
                        return slide.description;
                      })()}
                    </p>
                  </>
                )}

                {slide.type === 'customize' && (
                  <>
                    <h2 className={`text-3xl font-bold ${mainTextColor} mb-4 tracking-tight`}>{slide.title}</h2>
                    <div className={`w-full max-w-sm text-left space-y-3 ${cardBgColor} p-4 rounded-xl shadow-inner`}>
                        <div className="relative w-28 h-28 mx-auto mb-2">
                            <ShapeProgress progress={0.75} shape={progressShape} themeColor={themeColor} isPrivacyMode={false} />
                        </div>
                        <div>
                          <label className={`block text-center text-sm font-semibold ${subTextColor} mb-2`}>Forma</label>
                          <div className="flex justify-center space-x-2">
                            {shapeOptions.map(({ name: shapeName, Icon }) => (
                              <button key={shapeName} onClick={() => setProgressShape(shapeName)} className={`flex-1 p-2 border-2 rounded-lg flex items-center justify-center transition-all ${progressShape === shapeName ? `${userSelectedTheme.text} border-current ${userSelectedTheme.bg} bg-opacity-10` : `${isEffectiveLight ? 'border-slate-300' : 'border-slate-600'} ${inputBgColor} hover:bg-slate-700`}`}>
                                <Icon className={`w-7 h-7 ${progressShape === shapeName ? 'text-current' : 'text-slate-400'}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className={`block text-center text-sm font-semibold ${subTextColor} mb-2`}>Tema</label>
                          <div className={`flex gap-2 p-1 ${isEffectiveLight ? 'bg-slate-200' : 'bg-slate-800'} rounded-lg`}>
                              {themeOptions.map(option => (
                                  <button key={option.name} onClick={() => setThemeMode(option.name)} className={`flex-1 flex items-center justify-center space-x-2 py-1.5 rounded-md transition-colors text-sm font-semibold ${themeMode === option.name ? `${userSelectedTheme.bg} text-white shadow` : `${subTextColor} hover:bg-slate-700`}`}>
                                      <option.Icon className="w-4 h-4" />
                                      <span>{option.label}</span>
                                  </button>
                              ))}
                          </div>
                        </div>
                        <div>
                          <label className={`block text-center text-sm font-semibold ${subTextColor} mb-2`}>Color</label>
                          <div className="grid grid-cols-8 gap-2">
                            {THEME_LIST.slice(0, 8).map((themeOption) => (
                              <button key={themeOption.name} onClick={() => setThemeColor(themeOption.name)} className={`w-full h-9 rounded-full flex items-center justify-center bg-gradient-to-br ${themeOption.gradientFrom} ${themeOption.gradientTo} transition-transform transform hover:scale-110`}>
                                {themeColor === themeOption.name && <CheckIcon className={`w-5 h-5 ${themeOption.name === 'bw' ? 'text-slate-900' : 'text-white'}`} />}
                              </button>
                            ))}
                          </div>
                        </div>
                    </div>
                  </>
                )}

                {slide.type === 'setup' && (
                  <>
                    <h2 className={`text-3xl font-bold ${mainTextColor} mb-4 tracking-tight`}>{slide.title}</h2>
                    <div className={`w-full max-w-sm text-left space-y-4 ${cardBgColor} p-4 rounded-xl shadow-inner h-full max-h-96 flex flex-col`}>
                      {slide.step === 2 && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <RoleButton label="Publicador" value="publisher" current={role} onClick={setRole} theme={displayTheme} />
                                <RoleButton label="Precursor Auxiliar" value="aux_pioneer" current={role} onClick={setRole} theme={displayTheme} />
                                <RoleButton label="Precursor Regular" value="reg_pioneer" current={role} onClick={setRole} theme={displayTheme} />
                                <RoleButton label="Precursor Especial" value="spec_pioneer" current={role} onClick={setRole} theme={displayTheme} />
                            </div>
                            {role === 'publisher' && (
                                <div className="p-3 bg-blue-900/50 text-blue-200 text-xs rounded-lg flex items-start gap-2">
                                    <InformationCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <span>El Modo Fantasma y el registro de horas LDC se desactivarán, ya que están diseñados para precursores.</span>
                                </div>
                            )}
                        </div>
                      )}
                       {slide.step === 3 && (
                         <div>
                            <label className={`text-sm font-medium ${subTextColor}`}>{`¿Cuántas horas has hecho hasta hoy en el mes actual?${role === 'publisher' ? ' (Opcional)' : ''}`}</label>
                             <input type="text" value={currentMonthHours} onChange={(e) => setCurrentMonthHours(e.target.value)} placeholder="Ej: 15.5 o 15:30" className={`w-full mt-2 p-3 text-center text-xl ${inputBgColor} border ${inputBorderColor} rounded-lg focus:ring-2 ${displayTheme.ring} outline-none transition`} inputMode="decimal" />
                         </div>
                      )}
                      {slide.step === 4 && (
                        <div className="flex-grow flex flex-col min-h-0">
                          <div className="flex-shrink-0">
                            <label className={`text-sm font-medium ${subTextColor}`}>Horas de meses pasados</label>
                            <p className="text-xs text-slate-400 mt-1">Ingresa el total de cada mes para activar el 'Modo Fantasma'.</p>
                          </div>
                          <div className="mt-2 space-y-2 overflow-y-auto pr-2 flex-grow">
                            {monthsForSetup.map(date => {
                                const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
                                const monthName = date.toLocaleDateString('es-ES', { month: 'long' });
                                return (
                                    <div key={dateKey} className={`flex items-center justify-between p-2 ${isEffectiveLight ? 'bg-slate-500/10' : 'bg-slate-800/50'} rounded-lg`}>
                                        <span className={`${subTextColor} capitalize text-sm font-medium`}>{monthName}</span>
                                        <input type="number" placeholder="0" onChange={(e) => handleHoursChange(dateKey, e.target.value)} className={`w-24 px-2 py-1 ${isEffectiveLight ? 'bg-slate-200' : 'bg-slate-700/80'} border ${inputBorderColor} rounded-lg text-right focus:ring-2 ${displayTheme.ring} outline-none transition`} inputMode="decimal" step="0.1" />
                                    </div>
                                )
                            })}
                          </div>
                        </div>
                      )}
                      {slide.step === 5 && (
                        <div>
                            <label className={`text-sm font-medium ${subTextColor}`}>Tu nombre</label>
                            <div className="relative mt-1">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={`w-full pl-10 pr-4 py-2 ${inputBgColor} border ${inputBorderColor} rounded-lg focus:ring-2 ${displayTheme.ring} outline-none transition`} />
                            </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )})}
          </div>
        </div>
      </div>
      
      <div className="relative z-10 w-full flex-shrink-0 pb-4">
        <div className="flex justify-center space-x-2 mb-8">
          {slides.map((_, index) => (
            <div key={index} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentSlide === index ? `${isEffectiveLight ? 'bg-slate-800' : 'bg-white'} w-6` : `${isEffectiveLight ? 'bg-slate-500' : 'bg-slate-600'}`}`} />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={isNextDisabled}
          className={`w-full max-w-sm mx-auto py-3 rounded-lg font-bold text-lg transition-all shadow-lg transform hover:scale-105 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed ${
            isEffectiveLight ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Welcome;