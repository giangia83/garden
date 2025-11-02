import React from 'react';

export const RoseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="rosePetal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e11d48" />
        <stop offset="100%" stopColor="#be123c" />
      </linearGradient>
    </defs>
    <path d="M50 10 C 20 10, 20 40, 50 40 S 80 10, 50 10" fill="url(#rosePetal)"/>
    <path d="M50 20 C 30 20, 30 50, 50 50 S 70 20, 50 20" fill="url(#rosePetal)" transform="rotate(60 50 50)"/>
    <path d="M50 30 C 40 30, 40 60, 50 60 S 60 30, 50 30" fill="url(#rosePetal)" transform="rotate(120 50 50)"/>
    <path d="M50 25 C 35 25, 35 55, 50 55 S 65 25, 50 25" fill="url(#rosePetal)" transform="rotate(180 50 50)"/>
    <path d="M50 15 C 25 15, 25 45, 50 45 S 75 15, 50 15" fill="url(#rosePetal)" transform="rotate(240 50 50)"/>
    <path d="M50 35 C 45 35, 45 65, 50 65 S 55 35, 50 35" fill="url(#rosePetal)" transform="rotate(300 50 50)"/>
    <circle cx="50" cy="50" r="10" fill="#facc15"/>
  </svg>
);