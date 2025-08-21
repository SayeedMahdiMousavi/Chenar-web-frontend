import * as React from "react";

export const UsersIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" {...props}>
    <g
      fill="none"
      stroke={props?.color ? props?.color : "#727272"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <path
        data-name="Path 83"
        d="M.75 9.08a2.272 2.272 0 0 0 2.22 2.33h2.508a1.988 1.988 0 0 0 1.94-2.03 1.75 1.75 0 0 0-1.32-1.93l-4.03-1.4a1.75 1.75 0 0 1-1.32-1.93 1.988 1.988 0 0 1 1.94-2.03h2.51a2.272 2.272 0 0 1 2.22 2.33"
      />
      <path data-name="Path 84" d="M4.078.75v12" />
    </g>
  </svg>
);
