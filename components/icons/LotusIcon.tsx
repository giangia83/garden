import React from 'react';

export const LotusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="lotusPetal" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#f9a8d4" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    <g transform="translate(50,50) scale(1.2)">
      <path d="M0,0 C -30,-30 30,-30 0,0" fill="#fce7f3" transform="translate(0, 20)"/>
      <path d="M0,-25 C -20,-20 -10,0 0,0 C 10,0 20,-20 0,-25" fill="url(#lotusPetal)" transform="rotate(0)"/>
      <path d="M0,-25 C -20,-20 -10,0 0,0 C 10,0 20,-20 0,-25" fill="url(#lotusPetal)" transform="rotate(60)"/>
      <path d="M0,-25 C -20,-20 -10,0 0,0 C 10,0 20,-20 0,-25" fill="url(#lotusPetal)" transform="rotate(120)"/>
      <path d="M0,-25 C -20,-20 -10,0 0,0 C 10,0 20,-20 0,-25" fill="url(#lotusPetal)" transform="rotate(180)"/>
      <path d="M0,-25 C -20,-20 -10,0 0,0 C 10,0 20,-20 0,-25" fill="url(#lotusPetal)" transform="rotate(240)"/>
      <path d="M0,-25 C -20,-20 -10,0 0,0 C 10,0 20,-20 0,-25" fill="url(#lotusPetal)" transform="rotate(300)"/>
    </g>
  </svg>
);
