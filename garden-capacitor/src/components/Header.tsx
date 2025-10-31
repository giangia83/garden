import React from 'react';

interface HeaderProps {
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  return (
    <header className="bg-blue-500 text-white p-4">
      <h1 className="text-xl font-bold">Welcome, {userName}!</h1>
    </header>
  );
};

export default Header;