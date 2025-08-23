import * as React from 'react';

export const DollarIcon = (props) => (
  <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1.5em' {...props}>
    <g
      fill='none'
      stroke={props?.color ? props?.color : '#727272'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.8}
    >
      <path data-name='Line 17' d='M6.719.9v20' />
      <path
        data-name='Path 32'
        d='M11.569 4.359H4.295a3.395 3.395 0 0 0 0 6.789h4.85a3.395 3.395 0 1 1 0 6.789H.9'
      />
    </g>
  </svg>
);
