import React from 'react';

export function SunIcon(props) {
  return (
    <svg
      width='1em'
      height='1em'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z'
        stroke='#b1b1b1'
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M19.14 19.14l-.13-.13m0-14.02l.13-.13-.13.13zM4.86 19.14l.13-.13-.13.13zM12 2.08V2v.08zM12 22v-.08.08zM2.08 12H2h.08zM22 12h-.08.08zM4.99 4.99l-.13-.13.13.13z'
        stroke='#b1b1b1'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
