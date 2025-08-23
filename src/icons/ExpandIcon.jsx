import * as React from 'react';

function ExpandIcon(props) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='1em'
      height='1em'
      viewBox='0 0 16 17'
      {...props}
    >
      <path
        data-name='Path 192'
        d='M13.135 5L9.751 1.41 11.083 0l4.371 4.627a2 2 0 010 2.747L11.083 12l-1.332-1.41L13.135 7H0V5zM0 17h8v-2H0zm0-5h8v-2H0z'
        fill={props.color ? props.color : '#C5C5C5'}
        fillRule='evenodd'
      />
    </svg>
  );
}

export default ExpandIcon;
