import React from 'react';

export const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M5.25 2.25A3.75 3.75 0 0 0 1.5 6v12A3.75 3.75 0 0 0 5.25 21.75h13.5A3.75 3.75 0 0 0 22.5 18V6a3.75 3.75 0 0 0-3.75-3.75H5.25Zm0 3.75h13.5a.75.75 0 0 1 .75.75v3h-15V6.75a.75.75 0 0 1 .75-.75Zm-1.5 6h16.5v6a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75v-6Z"
      clipRule="evenodd"
    />
  </svg>
);