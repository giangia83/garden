import React from 'react';

export const BluebellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M 50 90 C 40 70, 60 70, 50 40" stroke="#16a34a" strokeWidth="4" fill="none" strokeLinecap="round" />
    <g transform="translate(50, 40)" fill="#60a5fa">
      <path d="M 0 0 C 10 -10, 10 -20, 0 -20 C -10 -20, -10 -10, 0 0" transform="scale(0.8) translate(15,0) rotate(20)"/>
      <path d="M 0 0 C 10 -10, 10 -20, 0 -20 C -10 -20, -10 -10, 0 0" transform="scale(0.8) translate(-15,0) rotate(-20)"/>
      <path d="M 0 0 C 10 -10, 10 -20, 0 -20 C -10 -20, -10 -10, 0 0" transform="scale(0.9) translate(10, -15) rotate(15)"/>
      <path d="M 0 0 C 10 -10, 10 -20, 0 -20 C -10 -20, -10 -10, 0 0" transform="scale(0.9) translate(-10, -15) rotate(-15)"/>
      <path d="M 0 0 C 10 -10, 10 -20, 0 -20 C -10 -20, -10 -10, 0 0" transform="scale(1) translate(0, -25)"/>
    </g>
  </svg>
);
