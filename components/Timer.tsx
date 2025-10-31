import React, { useState, useEffect } from 'react';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { CheckIcon } from './icons/CheckIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { ThemeColor } from '../types';
import { THEMES } from '../constants';

interface TimerProps {
  onFinish: (hours: number) => void;
  themeColor: ThemeColor;
}

const TIMER_STORAGE = {
  START_TIME: 'timer_startTime',
  BASE_TIME: 'timer_baseTime',
  IS_ACTIVE: 'timer_isActive',
};

const Timer: React.FC<TimerProps> = ({ onFinish, themeColor }) => {
  const [time, setTime] = useState(0); // in seconds
  const [isActive, setIsActive] = useState(false);
  const theme = THEMES[themeColor] || THEMES.blue;

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  
  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedIsActive = localStorage.getItem(TIMER_STORAGE.IS_ACTIVE) === 'true';
      const savedBaseTime = parseFloat(localStorage.getItem(TIMER_STORAGE.BASE_TIME) || '0');
      const savedStartTime = parseFloat(localStorage.getItem(TIMER_STORAGE.START_TIME) || '0');

      if (savedIsActive && savedStartTime > 0) {
        const elapsedSinceLastStart = (Date.now() - savedStartTime) / 1000;
        setTime(savedBaseTime + elapsedSinceLastStart);
        setIsActive(true);
      } else {
        setTime(savedBaseTime);
        setIsActive(false);
      }
    } catch (e) {
      console.error("Failed to load timer state", e);
    }
  }, []);

  // Timer interval effect
  useEffect(() => {
    // The return type of `setInterval` in the browser is `number`.
    let interval: number | undefined;
    if (isActive) {
      interval = window.setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
    localStorage.setItem(TIMER_STORAGE.IS_ACTIVE, 'true');
    localStorage.setItem(TIMER_STORAGE.START_TIME, String(Date.now()));
    // Base time is already set from pause or initial load
  };

  const handlePause = () => {
    setIsActive(false);
    localStorage.setItem(TIMER_STORAGE.IS_ACTIVE, 'false');
    localStorage.setItem(TIMER_STORAGE.BASE_TIME, String(time));
    localStorage.removeItem(TIMER_STORAGE.START_TIME);
  };
  
  const handleReset = () => {
    setIsActive(false);
    setTime(0);
    localStorage.removeItem(TIMER_STORAGE.IS_ACTIVE);
    localStorage.removeItem(TIMER_STORAGE.BASE_TIME);
    localStorage.removeItem(TIMER_STORAGE.START_TIME);
  };

  const handleFinish = () => {
    handlePause(); // Ensure latest time is saved to base
    const hoursToAdd = time / 3600;
    if (hoursToAdd > 0) {
      onFinish(hoursToAdd);
    }
    handleReset();
  };

  return (
    <div className="w-full text-center">
      <h3 className="text-center text-sm font-semibold text-slate-500 mb-4">Temporizador de Servicio</h3>
      <p className="text-5xl font-mono font-bold text-slate-800 tracking-tighter mb-4">
        {formatTime(time)}
      </p>
      <div className="flex justify-center items-center space-x-4">
        <button onClick={handleReset} className="p-3 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300 transition-colors" aria-label="Reiniciar temporizador">
          <RefreshIcon className="w-6 h-6" />
        </button>
        
        <button 
          onClick={isActive ? handlePause : handleStart}
          className={`p-4 rounded-full bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} text-white shadow-lg w-20 h-20 flex items-center justify-center`}
          aria-label={isActive ? 'Pausar temporizador' : 'Iniciar temporizador'}
        >
          {isActive ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
        </button>

        <button onClick={handleFinish} className="p-3 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300 transition-colors" aria-label="Finalizar y guardar tiempo">
          <CheckIcon className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};

export default Timer;
