import * as React from 'react';
const SvgComponent = (props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={props.width || 46.685}
    height={props.height || 28.855}
    viewBox='0 0 46.685 28.855'
    {...props}
  >
    <path
      fill='#ff5f00'
      d='M29.654 25.77H17.031V3.084h12.624Z'
      data-name='Path 72'
    />
    <path
      fill='#eb001b'
      d='M17.831 14.428a14.4 14.4 0 0 1 5.51-11.343 14.428 14.428 0 1 0 0 22.686 14.4 14.4 0 0 1-5.51-11.343'
      data-name='Path 73'
    />
    <path
      fill='#f79e1b'
      d='M46.685 14.428a14.427 14.427 0 0 1-23.343 11.343 14.4 14.4 0 0 0 5.511-11.343 14.4 14.4 0 0 0-5.511-11.343 14.427 14.427 0 0 1 23.342 11.343'
      data-name='Path 74'
    />
  </svg>
);
export default SvgComponent;
