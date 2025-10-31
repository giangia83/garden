import React from 'react';

interface BottomNavProps {
  onAddClick: () => void;
  onHistoryClick: () => void;
  onSettingsClick: () => void;
  themeColor: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ onAddClick, onHistoryClick, onSettingsClick, themeColor }) => {
  return (
    <nav className={`fixed bottom-0 left-0 right-0 bg-${themeColor}-500 p-4 flex justify-around`}>
      <button onClick={onAddClick} className="text-white">Add Hours</button>
      <button onClick={onHistoryClick} className="text-white">History</button>
      <button onClick={onSettingsClick} className="text-white">Settings</button>
    </nav>
  );
};

export default BottomNav;