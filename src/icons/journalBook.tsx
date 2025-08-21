import * as React from "react"

const SvgComponent = (props:any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={"1.6rem"}
    height={"1.6rem"}
    viewBox="0 0 32 32"
    style={{
      enableBackground: "new 0 0 512 512",
    }}
    xmlSpace="preserve"
    {...props}
  >
    <g fill={props?.color}>
      <path
        d="M25.573 6.457a2.75 2.75 0 0 0-2.75-2.75H9.177a2.75 2.75 0 0 0-2.75 2.75v19.086a2.75 2.75 0 0 0 2.75 2.75h13.646a2.75 2.75 0 0 0 2.75-2.75V6.457zm-1.5 0v19.086c0 .69-.56 1.25-1.25 1.25H9.177c-.69 0-1.25-.56-1.25-1.25V6.457c0-.69.56-1.25 1.25-1.25h13.646c.69 0 1.25.56 1.25 1.25z"
        data-original="#000000"
      />
      <path
        d="M10.635 4.457v23.086a.75.75 0 0 0 1.5 0V4.457a.75.75 0 0 0-1.5 0zM22.706 8.524a.75.75 0 0 0-.75-.75h-7.595a.75.75 0 0 0-.75.75v3.818c0 .414.336.75.75.75h7.595a.75.75 0 0 0 .75-.75zm-7.595.75v2.318h6.095V9.274z"
        data-original="#000000"
      />
    </g>
  </svg>
)

export default SvgComponent