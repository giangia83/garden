import React from 'react';

export const LavenderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M 50 90 C 40 70, 60 70, 50 50" stroke="#166534" strokeWidth="4" fill="none" strokeLinecap="round" />
    <g fill="#8b5cf6">
      <circle cx="50" cy="50" r="5" />
      <circle cx="55" cy="45" r="5" />
      <circle cx="45" cy="45" r="5" />
      <circle cx="53" cy="40" r="4" />
      <circle cx="47" cy="40" r="4" />
      <circle cx="50" cy="35" r="4" />
      <circle cx="55" cy="30" r="3" />
      <circle cx="45" cy="30" r="3" />
      <circle cx="50" cy="25" r="3" />
    </g>
  </svg>
);