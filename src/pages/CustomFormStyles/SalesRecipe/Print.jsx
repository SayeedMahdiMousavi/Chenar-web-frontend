import * as React from 'react';

function SvgComponent(props) {
  return (
    <svg
      width={176.995}
      height={176.995}
      viewBox='0 0 1843.7 1843.7'
      shapeRendering='geometricPrecision'
      textRendering='geometricPrecision'
      imageRendering='optimizeQuality'
      fillRule='evenodd'
      clipRule='evenodd'
      {...props}
    >
      <defs>
        <clipPath id='prefix__id0'>
          <path d='M-1.5 1.46h1843.74V1845.2H-1.5V1.46z' />
        </clipPath>
        <style>
          {
            '.prefix__str0{stroke:#1890ff;stroke-width:27.78;stroke-miterlimit:2.61313;stroke-dasharray:55.559055 138.897638}.prefix__fil0{fill:none}'
          }
        </style>
      </defs>
      <g id='prefix__Layer_x0020_1'>
        <g clipPath='url(#prefix__id0)'>
          <path
            className='prefix__fil0 prefix__str0'
            d='M-378.1 267.17h2596.94v1312.34H-378.1z'
          />
          <path
            className='prefix__fil0 prefix__str0'
            transform='rotate(90 975.84 600.7)'
            d='M0 0h2596.94v1312.34H0z'
          />
        </g>
        <path className='prefix__fil0' d='M-1.5 1.46h1843.74V1845.2H-1.5z' />
      </g>
    </svg>
  );
}

export default SvgComponent;
