import React, { useState, useMemo, useEffect } from 'react';
import { THEMES, THEME_LIST } from '../constants';
import { ThemeColor, SetupData, Shape, ThemeMode } from '../types';
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

type Slide = {
  type: 'title' | 'feature' | 'setup' | 'customize';
  title: string;
  icon?: (theme: Theme) => React.ReactNode;
  description?: React.ReactNode | ((name: string) => React.ReactNode);
};

const getServiceYearMonthsForSetup = () => {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11
  let serviceYearStartYear = now.getFullYear();

  if (currentMonth < 8) { // Service year starts in September. If current month is before Sep, the year started last year.
    serviceYearStartYear -= 1;
  }

  const months = [];
  const serviceYearStartDate = new Date(serviceYearStartYear, 8, 1); // September 1st

  for (let i = 0; i < 12; i++) {
    const monthDate = new Date(serviceYearStartDate.getFullYear(), serviceYearStartDate.getMonth() + i, 1);
    months.push(monthDate);
    if (monthDate.getFullYear() > now.getFullYear() || (monthDate.getFullYear() === now.getFullYear() && monthDate.getMonth() >= now.getMonth())) {
      break;
    }
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
    icon: (theme: Theme) => <GardenIcon className={`w-16 h-16 ${theme.text}`} />,
    title: "Mantén tu racha",
    description: "Cada día que registres horas, tu racha aumentará. Los sábados y domingos no rompen tu racha. Y si olvidas un día, ¡no te preocupes! Tienes 3 restauradores automáticos cada mes.",
  },
  {
    type: 'feature',
    icon: (theme: Theme) => <GardenIcon className={`w-16 h-16 ${theme.text}`} />,
    title: "Cultiva tu jardín",
    description: "A medida que cumples tus metas, verás crecer un hermoso jardín virtual. ¡Cada flor es un recordatorio de tu esfuerzo!",
  },
  {
    type: 'feature',
    icon: (theme: Theme) => <ListBulletIcon className={`w-16 h-16 ${theme.text}`} />,
    title: "Organiza tu ministerio",
    description: "Anota tus revisitas y estudios. Además, puedes pegar los arreglos de grupo y la app los organizará por ti usando IA.",
  },
  {
    type: 'customize',
    title: "Hazla tuya",
    description: "Elige una apariencia que te guste. Los cambios se aplicarán en toda la aplicación.",
  },
  {
    type: 'setup',
    title: "Antes de comenzar...",
    description: "Completa tu perfil para empezar con todo listo.",
  },
  {
    type: 'feature',
    icon: (theme: Theme) => <HeartIcon className={`w-16 h-16 ${theme.text}`} />,
    title: "¡Todo listo!",
    description: (name: string) => (
      <>
        ¡Qué bueno tenerte aquí, {name}! Espero que Garden te sea de gran ayuda en tu precursorado. Que te sirva para organizar tu servicio, mantenerte enfocado en tus metas y, sobre todo, sentirte animado a dar siempre lo mejor a Jehová.
        <br />— <span className="font-logotype text-lg">Gianfranco Iadarola</span>
      </>
    ),
  }
];

const AnimatedDigit: React.FC<{ digit: number; range: number; height: number; durationClass: string }> = ({ digit, range, height, durationClass }) => {
    return (
        <div style={{ height: `${height}px` }} className="overflow-hidden">
            <div
                className={`transition-transform ${durationClass} ease-in-out`}
                style={{ transform: `translateY(-${digit * height}px)` }}
            >
                {[...Array(range)].map((_, i) => (
                    <div key={i} style={{ height: `${height}px` }} className="flex items-center justify-center">
                        {i}
                    </div>
                ))}
            </div>
        </div>
    );
};


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
  const theme = THEMES[themeColor] || THEMES.blue;

  const [setupData, setSetupData] = useState<SetupData>({
    name: 'Precursor',
    previousHours: {},
  });
  
  const [animatedStreak, setAnimatedStreak] = useState(1);
  const streakSlideIndex = 2; // "Mantén tu racha"

  useEffect(() => {
    let animationFrameId: number;
    
    if (performanceMode) {
      if (currentSlide === streakSlideIndex) {
        setAnimatedStreak(50);
      }
      return;
    }

    if (currentSlide === streakSlideIndex) {
      const startTime = Date.now();
      const duration = 1500; // 1.5 segundos de animación
      const targetStreak = 50;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const currentCount = Math.floor(easedProgress * (targetStreak - 1)) + 1;
        setAnimatedStreak(currentCount);

        if (progress < 1) {
          animationFrameId = window.requestAnimationFrame(animate);
        }
      };
      
      animationFrameId = window.requestAnimationFrame(animate);
    } else {
        setAnimatedStreak(1); // Reset when not on the slide
    }

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [currentSlide, streakSlideIndex, performanceMode]);


  const monthsForSetup = useMemo(() => getServiceYearMonthsForSetup(), []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSetupData(prev => ({ ...prev, name: e.target.value }));
  };

  const handleHoursChange = (dateKey: string, hours: string) => {
    const numericHours = parseFloat(hours.replace(',', '.'));
    setSetupData(prev => ({
        ...prev,
        previousHours: {
            ...prev.previousHours,
            [dateKey]: isNaN(numericHours) ? 0 : numericHours,
        }
    }));
  };

  const handleNext = () => {
    if (currentSlide < slideData.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onFinish(setupData);
    }
  };
  
  const isLastSlide = currentSlide === slideData.length - 1;
  const isDarkBgSlide = currentSlide === 0 || slideData[currentSlide].type === 'setup' || isLastSlide;

  const buttonText = isLastSlide
    ? 'Comenzar'
    : (slideData[currentSlide].type === 'setup' ? 'Guardar y Empezar' : 'Siguiente');

  const getButtonClass = () => {
    if (currentSlide === 0) {
      return 'text-white hover:opacity-80';
    }
    if (slideData[currentSlide].type === 'setup' || isLastSlide) {
      return `bg-white text-slate-800 shadow-lg ${!performanceMode && 'transform hover:scale-105'}`;
    }
    return `${theme.bg} text-white shadow-md ${!performanceMode && 'transform hover:scale-105'}`;
  }

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
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 text-center transition-colors duration-500 ${
        isDarkBgSlide ? `bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} dark:from-slate-900 dark:to-slate-800` : 'bg-gray-100 dark:bg-slate-900'
    }`}>
      
      <div className="w-full flex-shrink-0 h-10"></div>
      
      <div className="w-full flex-grow flex flex-col justify-center">
        <div className="relative w-full h-[32rem] overflow-hidden">
          <div 
            className={`absolute top-0 left-0 w-full h-full flex ${!performanceMode ? 'transition-transform duration-500 ease-in-out' : ''}`}
            style={{ transform: `translateX(-${currentSlide * 100}%)`}}
          >
            {slideData.map((slide, index) => {
              const isFinalFeatureSlide = index === slideData.length - 1;

              return (
                <div key={index} className="w-full h-full flex-shrink-0 flex flex-col items-center justify-center p-4 relative">
                  {slide.type === 'title' ? (
                    <h1 className={`text-7xl font-logotype text-white dark:text-white ${!performanceMode ? 'animate-fadeIn' : ''}`}>
                      {slide.title}
                    </h1>
                  ) : slide.type === 'customize' ? (
                    <>
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{slide.title}</h2>
                      <p className="text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed mb-4">{slide.description}</p>
                      
                      <div className="w-full max-w-sm text-left space-y-3">
                          <div className="relative w-32 h-32 mx-auto mb-2">
                             <ShapeProgress progress={0.75} shape={progressShape} themeColor={themeColor} isPrivacyMode={false} />
                          </div>
                          
                          {/* Shape */}
                          <div>
                            <label className="block text-center text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Forma</label>
                            <div className="flex justify-center space-x-2">
                              {shapeOptions.map(({ name: shapeName, Icon }) => (
                                <button
                                  key={shapeName}
                                  onClick={() => setProgressShape(shapeName)}
                                  className={`flex-1 p-2 border-2 rounded-lg flex items-center justify-center transition-all ${
                                    progressShape === shapeName ? `${THEMES[themeColor].text} border-current bg-blue-50/50 dark:bg-slate-700/50` : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                                  }`}
                                  aria-pressed={progressShape === shapeName}
                                >
                                  <Icon className={`w-7 h-7 ${progressShape === shapeName ? 'text-current' : 'text-slate-500 dark:text-slate-400'}`} />
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Theme Mode */}
                           <div>
                            <label className="block text-center text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tema</label>
                            <div className="flex gap-2 p-1 bg-white dark:bg-slate-800 rounded-lg">
                                {themeOptions.map(option => (
                                    <button
                                        key={option.name}
                                        onClick={() => setThemeMode(option.name)}
                                        className={`flex-1 flex items-center justify-center space-x-2 py-1.5 rounded-md transition-colors text-sm font-semibold ${
                                        themeMode === option.name ? `${theme.bg} text-white shadow` : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                        }`}
                                        aria-pressed={themeMode === option.name}
                                    >
                                        <option.Icon className="w-4 h-4" />
                                        <span>{option.label}</span>
                                    </button>
                                ))}
                            </div>
                          </div>
                          
                          {/* Color */}
                           <div>
                            <label className="block text-center text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Color</label>
                            <div className="grid grid-cols-8 gap-2">
                              {THEME_LIST.map((themeOption) => (
                                <button
                                  key={themeOption.name}
                                  onClick={() => setThemeColor(themeOption.name)}
                                  className={`w-full h-9 rounded-full flex items-center justify-center bg-gradient-to-br ${themeOption.gradientFrom} ${themeOption.gradientTo} transition-transform transform hover:scale-110`}
                                  aria-label={`Seleccionar color ${themeOption.name}`}
                                  aria-pressed={themeColor === themeOption.name}
                                >
                                  {themeColor === themeOption.name && (
                                    <CheckIcon className="w-5 h-5 text-white" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                      </div>
                    </>
                  ) : slide.type === 'setup' ? (
                    <>
                      <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">{slide.title}</h2>
                      <p className="text-slate-200 max-w-sm leading-relaxed mb-4">{slide.description}</p>
                      <div className="w-full max-w-sm text-left space-y-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-inner h-full max-h-80 flex flex-col">
                          <div className="flex-shrink-0">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tu nombre</label>
                              <div className="relative mt-1">
                                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                  <input type="text" value={setupData.name} onChange={handleNameChange} className={`w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 ${theme.ring} outline-none transition`} />
                              </div>
                          </div>
                          {monthsForSetup.length > 0 && (
                               <div className="flex-grow flex flex-col min-h-0">
                                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-shrink-0">Horas de este año de servicio (opcional)</label>
                                  <div className="mt-2 space-y-2 overflow-y-auto pr-2 flex-grow">
                                  {monthsForSetup.map(date => {
                                      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-15`;
                                      const monthName = date.toLocaleDateString('es-ES', { month: 'long' });
                                      const isCurrentMonth = date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
                                      return (
                                          <div key={dateKey} className="flex items-center justify-between p-2 bg-slate-100/50 dark:bg-slate-700/50 rounded-lg">
                                              <span className={`text-slate-600 dark:text-slate-300 capitalize text-sm font-medium ${isCurrentMonth ? theme.text : ''}`}>
                                                {monthName} {isCurrentMonth && '(Actual)'}
                                              </span>
                                              <input 
                                                type="number" 
                                                placeholder="0" 
                                                onChange={(e) => handleHoursChange(dateKey, e.target.value)} 
                                                className={`w-24 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-right focus:ring-2 ${theme.ring} outline-none transition`}
                                                inputMode="decimal"
                                                step="0.1"
                                              />
                                          </div>
                                      )
                                  })}
                                  </div>
                              </div>
                          )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-6 h-20 flex items-center justify-center">
                          {index === streakSlideIndex ? (
                              <div className="flex items-center justify-center space-x-4">
                                 <div className={`flex items-center justify-center space-x-0.5 text-7xl font-bold ${theme.text}`} style={{fontVariantNumeric: 'tabular-nums'}}>
                                      {animatedStreak > 9 && (
                                          <AnimatedDigit digit={Math.floor(animatedStreak / 10)} range={6} height={72} durationClass="duration-300" />
                                      )}
                                      <AnimatedDigit digit={animatedStreak % 10} range={10} height={72} durationClass={animatedStreak % 10 === 0 ? 'duration-300' : 'duration-100'} />
                                  </div>
                                  <GardenIcon className={`w-16 h-16 ${theme.text}`} />
                              </div>
                          ) : (
                              slide.icon && slide.icon(theme)
                          )}
                      </div>
                      <h2 className={`text-3xl font-bold ${isFinalFeatureSlide ? 'text-white' : 'text-slate-900 dark:text-white'} mb-3 tracking-tight`}>{slide.title}</h2>
                      <p className={`${isFinalFeatureSlide ? 'text-slate-200' : 'text-slate-600 dark:text-slate-400'} max-w-sm leading-relaxed`}>
                        {(() => {
                          // FIX: The type of slide.description is a union that includes a function, which is not a valid ReactNode.
                          // This IIFE correctly calls the function if it exists, ensuring a valid ReactNode is always returned for rendering, resolving a TypeScript type inference issue.
                          if (typeof slide.description === 'function') {
                            return slide.description(setupData.name);
                          }
                          return slide.description;
                        })()}
                      </p>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      <div className="w-full flex-shrink-0 pb-4">
        <div className="flex justify-center space-x-2 mb-8">
          {slideData.map((_, index) => (
            <div
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index ? `${isDarkBgSlide ? 'bg-white' : theme.bg} w-6` : 'bg-slate-300 dark:bg-slate-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className={`w-full max-w-sm mx-auto py-3 rounded-lg font-bold text-lg transition-all ${getButtonClass()}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Welcome;
