import React from 'react';
import { FlowerIcon } from './icons/FlowerIcon';

interface HeaderProps {
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-50/80 backdrop-blur-lg z-10 border-b border-slate-200">
      <div className="flex items-center justify-between h-20 px-4 md:px-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <FlowerIcon className="h-8 w-8" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Garden
          </h1>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-600">Hola, {userName}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;