import React from 'react';

export const PoppyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="poppyPetal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f87171" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
    </defs>
    <g transform="translate(50,50)">
      <path d="M0 -30 C 25 -50, 35 0, 0 10 C -35 0, -25 -50, 0 -30" fill="url(#poppyPetal)" transform="rotate(45)" />
      <path d="M0 -30 C 25 -50, 35 0, 0 10 C -35 0, -25 -50, 0 -30" fill="url(#poppyPetal)" transform="rotate(-45)" />
      <path d="M0 -10 C 25 10, 15 40, 0 30 C -15 40, -25 10, 0 -10" fill="url(#poppyPetal)" transform="rotate(135)" />
      <path d="M0 -10 C 25 10, 15 40, 0 30 C -15 40, -25 10, 0 -10" fill="url(#poppyPetal)" transform="rotate(-135)" />
    </g>
    <circle cx="50" cy="50" r="12" fill="#1e293b" />
  </svg>
);
