import React from 'react';

export const DaisyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <radialGradient id="daisyCenter" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#FFA500" />
      </radialGradient>
    </defs>
    <g transform="translate(50,50)">
        <path d="M0 -35 C 20 -35, 20 -10, 0 0 C -20 -10, -20 -35, 0 -35" fill="white" stroke="#eee" strokeWidth="1" transform="rotate(0)"/>
        <path d="M0 -35 C 20 -35, 20 -10, 0 0 C -20 -10, -20 -35, 0 -35" fill="white" stroke="#eee" strokeWidth="1" transform="rotate(30)"/>
        <path d="M0 -35 C 20 -35, 20 -10, 0 0 C -20 -10, -20 -35, 0 -35" fill="white" stroke="#eee" strokeWidth="1" transform="rotate(60)"/>
        <path d="M0 -35 C 20 -35, 20 -10, 0 0 C -20 -10, -20 -35, 0 -35" fill="white" stroke="#eee" strokeWidth="1" transform="rotate(90)"/>
        <path d="M0 -35 C 20 -35, 20 -10, 0 0 C -20 -10, -20 -35, 0 -35" fill="white" stroke="#eee" strokeWidth="1" transform="rotate(120)"/>
        <path d="M0 -35 C 20 -35, 20 -10, 0 0 C -20 -10, -20 -35, 0 -35" fill="white" stroke="#eee" strokeWidth="1" transform="rotate(150)"/>
        <path d="M0 -35 C 20 -35, 20 -10, 0 0 C -20 -10, -20 -35, 0 -35" fill="white" stroke="#eee" strokeWidth="1" transform="rotate(180)"/>
        <path d="M0 -35 C 20 -35, 20 -10, 0 0 C -20 -10, -20 -35, 0 -35" fill="white" stroke="#eee" strokeWidth="1" transform="rotate(210)"/>
        <path d="M0 -35 C 20 -35, 20 -10, 0 0 C -20 -10, -20 -35, 0 -35" fill="white" stroke="#eee" strokeWidth="1" transform="rotate(240)"/>
        <path d="M0 -35 C 20 -35, 20 -10, 0 0 C -20 -10, -20 -35, 0 -35" fill="white" stroke="#eee" strokeWidth="1" transform="rotate(270)"/>
        <path d="M0 -35 C 20 -35, 20 -10, 0 0 C -20 -10, -20 -35, 0 -35" fill="white" stroke="#eee" strokeWidth="1" transform="rotate(300)"/>
        <path d="M0 -35 C 20 -35, 20 -10, 0 0 C -20 -10, -20 -35, 0 -35" fill="white" stroke="#eee" strokeWidth="1" transform="rotate(330)"/>
    </g>
    <circle cx="50" cy="50" r="15" fill="url(#daisyCenter)" />
  </svg>
);