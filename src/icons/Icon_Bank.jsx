import * as React from 'react';
const SvgComponent = (props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={props.width}
    height={props.height}
    fill='none'
    {...props}
    viewBox='0 0 18 18'
  >
    <path
      fill='#898989'
      d='M14.875 14.142V8.998H16V7.713H2.5v1.286h1.125v5.143h-2.25v1.285h15.75v-1.285h-2.25Zm-7.875 0H4.75V8.998H7v5.143Zm1.125 0V8.998h2.25v5.143h-2.25Zm5.625 0H11.5V8.998h2.25v5.143ZM18.25 16.713h-18v1.286h18v-1.286ZM17.952 5.22 9.514.077a.492.492 0 0 0-.528 0L.548 5.22c-.23.135-.343.437-.281.72.062.29.287.489.545.489h16.875c.26 0 .484-.2.546-.489.062-.283-.05-.585-.281-.72Zm-14.89-.077L9.25 1.369l6.187 3.774H3.062Z'
    />
  </svg>
);
export default SvgComponent;
