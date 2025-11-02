import React from 'react';

export const SunflowerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <radialGradient id="sunflowerCenter" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#654321" />
        <stop offset="100%" stopColor="#8B4513" />
      </radialGradient>
      <linearGradient id="sunflowerPetal" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    <g transform="translate(50,50)">
        <path d="M0 -45 L 15 -15 L -15 -15 Z" fill="url(#sunflowerPetal)" transform="rotate(0)"/>
        <path d="M0 -45 L 15 -15 L -15 -15 Z" fill="url(#sunflowerPetal)" transform="rotate(22.5)"/>
        <path d="M0 -45 L 15 -15 L -15 -15 Z" fill="url(#sunflowerPetal)" transform="rotate(45)"/>
        <path d="M0 -45 L 15 -15 L -15 -15 Z" fill="url(#sunflowerPetal)" transform="rotate(67.5)"/>
        <path d="M0 -45 L 15 -15 L -15 -15 Z" fill="url(#sunflowerPetal)" transform="rotate(90)"/>
        <path d="M0 -45 L 15 -15 L -15 -15 Z" fill="url(#sunflowerPetal)" transform="rotate(112.5)"/>
        <path d="M0 -45 L 15 -15 L -15 -15 Z" fill="url(#sunflowerPetal)" transform="rotate(135)"/>
        <path d="M0 -45 L 15 -15 L -15 -15 Z" fill="url(#sunflowerPetal)" transform="rotate(157.5)"/>
        <path d="M0 -45 L 15 -15 L -15 -15 Z" fill="url(#sunflowerPetal)" transform="rotate(180)"/>
        <path d="M0 -45 L 15 -15 L -15 -15 Z" fill="url(#sunflowerPetal)" transform="rotate(202.5)"/>
        <path d="M0 -45 L 15 -15 L -15 -15 Z" fill="url(#sunflowerPetal)" transform="rotate(225)"/>
        <path d="M0 -45 L 15 -15 L -15 -15 Z" fill="url(#sunflowerPetal)" transform="rotate(247.5)"/>
        <path d="M0 -45 L 15 -15 L -15 -15 Z" fill="url(#sunflowerPetal)" transform="rotate(270)"/>
        <path d="M0 -45 L 15 -15 L -15 -15 Z" fill="url(#sunflowerPetal)" transform="rotate(292.5)"/>
        <path d="M0 -45 L 15 -15 L -15 -15 Z" fill="url(#sunflowerPetal)" transform="rotate(315)"/>
        <path d="M0 -45 L 15 -15 L -15 -15 Z" fill="url(#sunflowerPetal)" transform="rotate(337.5)"/>
    </g>
    <circle cx="50" cy="50" r="20" fill="url(#sunflowerCenter)" />
  </svg>
);