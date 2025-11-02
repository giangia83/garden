import React, { useState, useRef, useEffect } from 'react';
import { ThemeColor } from '../types';
import { THEMES } from '../constants';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { DaisyIcon } from './icons/DaisyIcon';
import { RoseIcon } from './icons/RoseIcon';
import { SunflowerIcon } from './icons/SunflowerIcon';
import { HibiscusIcon } from './icons/HibiscusIcon';
import { LavenderIcon } from './icons/LavenderIcon';
import { PoppyIcon } from './icons/PoppyIcon';
import { LotusIcon } from './icons/LotusIcon';
import { CherryBlossomIcon } from './icons/CherryBlossomIcon';
import { BluebellIcon } from './icons/BluebellIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { XIcon } from './icons/XIcon';

interface GardenViewProps {
  currentHours: number;
  goal: number;
  themeColor: ThemeColor;
  performanceMode: boolean;
  isPrivacyMode: boolean;
}

const flowers = [
  { hours: 0.1, Icon: DaisyIcon, name: 'Margarita de Pionero', message: 'Cada gran jardín comienza con una sola semilla. ¡Bien hecho por empezar!' },
  { hours: 0.2, Icon: RoseIcon, name: 'Rosa de la Constancia', message: 'Tu constancia es hermosa y fortalece tu fe. ¡Sigue floreciendo!' },
  { hours: 0.3, Icon: SunflowerIcon, name: 'Girasol del Esfuerzo', message: 'Así como el girasol busca el sol, tu esfuerzo busca a Jehová. ¡Él lo ve y se alegra!' },
  { hours: 0.4, Icon: LotusIcon, name: 'Loto de la Dedicación', message: 'Incluso en tiempos difíciles, tu dedicación florece con pureza y belleza.' },
  { hours: 0.5, Icon: PoppyIcon, name: 'Amapola del Amor', message: 'El amor que demuestras en tu servicio es el color más brillante de tu jardín.' },
  { hours: 0.6, Icon: HibiscusIcon, name: 'Hibisco de la Alegría', message: 'Que la alegría que sientes al servir se refleje en cada hora que dedicas.' },
  { hours: 0.7, Icon: BluebellIcon, name: 'Campanilla de la Fe', message: 'Tu fe, aunque delicada, tiene una fuerza que puede mover montañas. ¡Sigue creyendo!' },
  { hours: 0.8, Icon: LavenderIcon, name: 'Lavanda de la Paz', message: 'Tu servicio pacífico y constante trae un aroma agradable a Jehová.' },
  { hours: 1.0, Icon: CherryBlossomIcon, name: 'Cerezo de la Meta', message: '¡Has alcanzado la meta! Una hermosa floración que es testimonio de tu duro trabajo.' },
];

const GardenView: React.FC<GardenViewProps> = ({ currentHours, goal, themeColor, performanceMode, isPrivacyMode }) => {
  const theme = THEMES[themeColor] || THEMES.blue;
  const progress = goal > 0 ? Math.min(currentHours / goal, 1) : 0;
  
  const [activeFlowerIndex, setActiveFlowerIndex] = useState<number | null>(null);
  const [selectedMessage, setSelectedMessage] = useState('');
  
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const pathData = "M 25 130 Q 50 230, 25 330 Q 0 430, 25 530 Q 50 630, 25 730 Q 0 830, 25 930 Q 50 1030, 25 1130";

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
    const timer = setTimeout(() => setIsReady(true), 50);
    return () => clearTimeout(timer);
  }, [pathData]);
  
  const handleFlowerClick = (index: number) => {
    const isUnlocked = progress >= flowers[index].hours;
    if (isUnlocked) {
      setSelectedMessage(flowers[index].message);
      setActiveFlowerIndex(index);
    }
  };
  
  const handleCloseMessage = () => {
    setActiveFlowerIndex(null);
  };

  const dashOffset = pathLength * (1 - progress);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tu Jardín de Servicio</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Cada flor representa un logro en tu camino. ¡Sigue adelante!
        </p>
      </div>

      <div className="relative h-[720px]">
        {/* Serpentine Stem SVG on the left */}
        <div id="garden-path-container" className="absolute top-0 bottom-0 left-0 w-1/3 z-0">
            <svg width="100%" height="100%" viewBox="0 100 100 1050" preserveAspectRatio="xMinYMin meet" aria-hidden="true" className={`transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
                <defs>
                  <linearGradient id="stemGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" />
                    <stop offset="100%" stopColor={theme.gradientToColor} />
                  </linearGradient>
                </defs>
                <path
                    d={pathData}
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="stroke-slate-200 dark:stroke-slate-700"
                />
                <path
                    ref={pathRef}
                    d={pathData}
                    fill="none"
                    stroke="url(#stemGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={pathLength}
                    strokeDashoffset={dashOffset}
                    style={{ 
                      transition: performanceMode || !isReady ? 'none' : 'stroke-dashoffset 1s ease-out',
                    }}
                />
            </svg>
        </div>
        
        {/* Flowers on the right */}
        <div className="absolute top-0 bottom-0 right-0 w-2/3 z-10 flex flex-col justify-start py-8 space-y-4">
          {flowers.map((flower, index) => {
            const isUnlocked = progress >= flower.hours;
            const hoursRequired = Math.ceil(goal * flower.hours);
            
            const unlockedClasses = `bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 border-b-4 border-slate-300 dark:border-slate-900 cursor-pointer transform hover:-translate-y-1 active:translate-y-px active:border-b-2 transition-all duration-150`;
            const lockedClasses = `bg-slate-200 dark:bg-slate-700 border-t border-slate-200/50 dark:border-slate-600/50 border-b-4 border-slate-300/50 dark:border-slate-800/50 opacity-70`;

            return (
              <div key={index} className="flex items-center gap-4">
                <button 
                  id={`flower-${index}`}
                  onClick={() => handleFlowerClick(index)}
                  disabled={!isUnlocked}
                  className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center relative z-10 ${isUnlocked ? unlockedClasses : lockedClasses}`}
                  aria-label={`Flor: ${flower.name}`}
                >
                  {isUnlocked ? <flower.Icon className="w-16 h-16 animate-fadeIn" /> : <LockClosedIcon className="w-10 h-10 text-slate-400 dark:text-slate-500" />}
                </button>
                <div className="flex-grow text-left">
                  <h3 className={`font-bold transition-colors ${isUnlocked ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>
                    {flower.name}
                  </h3>
                  <p className={`text-sm transition-colors ${isUnlocked ? `${theme.text}` : 'text-slate-400 dark:text-slate-500'}`}>
                    {isUnlocked ? 'Desbloqueada' : (isPrivacyMode ? 'Desbloqueable' : `A las ${hoursRequired}h`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Message Modal */}
      {activeFlowerIndex !== null && (
        <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn"
            onClick={handleCloseMessage}
        >
            <div 
                className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeInUp"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={handleCloseMessage} className="absolute top-3 right-3 p-1.5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                  <XIcon className="w-5 h-5" />
                </button>
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} mb-4`}>
                    <SparklesIcon className="w-8 h-8 text-white" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 italic">
                    {selectedMessage}
                </p>
            </div>
        </div>
      )}
    </div>
  );
};

export default GardenView;