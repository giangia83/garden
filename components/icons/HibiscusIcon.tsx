import React from 'react';

export const HibiscusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="hibiscusPetal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    <g transform="translate(50,50)">
        <path d="M0 -40 C 30 -40, 30 -10, 0 0 C -30 -10, -30 -40, 0 -40" fill="url(#hibiscusPetal)" transform="rotate(0)"/>
        <path d="M0 -40 C 30 -40, 30 -10, 0 0 C -30 -10, -30 -40, 0 -40" fill="url(#hibiscusPetal)" transform="rotate(72)"/>
        <path d="M0 -40 C 30 -40, 30 -10, 0 0 C -30 -10, -30 -40, 0 -40" fill="url(#hibiscusPetal)" transform="rotate(144)"/>
        <path d="M0 -40 C 30 -40, 30 -10, 0 0 C -30 -10, -30 -40, 0 -40" fill="url(#hibiscusPetal)" transform="rotate(216)"/>
        <path d="M0 -40 C 30 -40, 30 -10, 0 0 C -30 -10, -30 -40, 0 -40" fill="url(#hibiscusPetal)" transform="rotate(288)"/>
    </g>
    <line x1="50" y1="50" x2="50" y2="20" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="50" cy="20" r="5" fill="#fef08a" />
  </svg>
);