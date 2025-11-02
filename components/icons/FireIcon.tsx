import React from 'react';

// Replaced fire icon with a flower (lotus) icon as requested by the user.
export const FireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    {...props}
  >
    <path d="M11,15.5C8.28,15.5 6,14.54 6,12.75C6,11.25 7.8,10.19 10.15,9.92C10.59,9.82 11,9.45 11,9V8.5C11,7.67 11.67,7 12.5,7C13.33,7 14,7.67 14,8.5V9C14,9.45 14.41,9.82 14.85,9.92C17.2,10.19 19,11.25 19,12.75C19,14.54 16.72,15.5 14,15.5C13.56,15.5 13.09,15.47 12.63,15.42C12.44,15.39 12.22,15.38 12,15.38C11.78,15.38 11.56,15.39 11.37,15.42C11.91,15.47 11.44,15.5 11,15.5Z" />
  </svg>
);
