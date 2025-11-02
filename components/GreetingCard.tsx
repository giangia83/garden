import React from 'react';
import { ThemeColor } from '../types';
import { THEMES } from '../constants';

interface GreetingCardProps {
  userName: string;
  themeColor: ThemeColor;
  performanceMode: boolean;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Buenos días';
  } else if (hour < 19) {
    return 'Buenas tardes';
  } else {
    return 'Buenas noches';
  }
};

const GreetingCard: React.FC<GreetingCardProps> = ({ userName, themeColor, performanceMode = false }) => {
  const theme = THEMES[themeColor] || THEMES.blue;
  const greeting = getGreeting();
  const animationClass = performanceMode ? '' : 'animate-fadeInUp';

  return (
    <div className={`mt-8 text-center ${animationClass}`}>
      <h2 className={`text-2xl font-semibold text-slate-700 dark:text-slate-300`}>
        {greeting}, <span className={`font-bold ${theme.text}`}>{userName}</span>.
      </h2>
    </div>
  );
};

export default GreetingCard;