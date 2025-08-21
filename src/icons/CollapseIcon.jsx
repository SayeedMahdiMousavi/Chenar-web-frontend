import * as React from "react";

function CollapseIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 17"
      {...props}
    >
      <path
        data-name="Path 665"
        d="M2.865 5l3.384-3.59L4.917 0 .546 4.627a2 2 0 000 2.747L4.917 12l1.332-1.41L2.865 7H16V5zM16 17H8v-2h8zm0-5H8v-2h8z"
        fill={props.color ? props.color : "#727272"}
        fillRule="evenodd"
      />
    </svg>
  );
}

export default CollapseIcon;
