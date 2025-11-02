import React from 'react';

export const CherryBlossomIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="cherryPetal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fda4af" />
        <stop offset="100%" stopColor="#f9a8d4" />
      </linearGradient>
    </defs>
    <g transform="translate(50,50)">
      <path d="M 0,-35 a 20 20 0 0 1 10 30 L 0 -10 L -10 0 A 20 20 0 0 1 0 -35" fill="url(#cherryPetal)" transform="rotate(0)"/>
      <path d="M 0,-35 a 20 20 0 0 1 10 30 L 0 -10 L -10 0 A 20 20 0 0 1 0 -35" fill="url(#cherryPetal)" transform="rotate(72)"/>
      <path d="M 0,-35 a 20 20 0 0 1 10 30 L 0 -10 L -10 0 A 20 20 0 0 1 0 -35" fill="url(#cherryPetal)" transform="rotate(144)"/>
      <path d="M 0,-35 a 20 20 0 0 1 10 30 L 0 -10 L -10 0 A 20 20 0 0 1 0 -35" fill="url(#cherryPetal)" transform="rotate(216)"/>
      <path d="M 0,-35 a 20 20 0 0 1 10 30 L 0 -10 L -10 0 A 20 20 0 0 1 0 -35" fill="url(#cherryPetal)" transform="rotate(288)"/>
    </g>
    <circle cx="50" cy="50" r="5" fill="#fff" />
  </svg>
);
