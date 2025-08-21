import * as React from "react";
import Icon from "@ant-design/icons";

function ShoppingCartOutlined(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={25.107}
      height={24.512}
      {...props}
    >
      <g transform="translate(.9 .9)" fill="none" data-name="Group 35">
        <circle
          data-name="Ellipse 6"
          cx={1}
          cy={1}
          r={1}
          transform="translate(7.619 20.712)"
          stroke={props.color ? props.color : "#727272"}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
        />
        <circle
          data-name="Ellipse 7"
          cx={1}
          cy={1}
          r={1}
          transform="translate(18.619 20.712)"
          stroke={props.color ? props.color : "#727272"}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
        />
        <path
          data-name="Path 35"
          d="M0 0h4.238l2.839 14.186A2.119 2.119 0 009.2 15.891h10.3a2.119 2.119 0 002.119-1.706l1.7-8.889H5.3"
          stroke={props.color ? props.color : "#727272"}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
        />
        <path
          data-name="Path 278"
          d="M5.906 5.861v-.892l.723 4.438 1.2 5.87h13.429l1.829-9.818L5.46 5.191"
        />
      </g>
    </svg>
  );
}

const Herte = (props) => (
  <Icon
    component={ShoppingCartOutlined}
    {...props}
    style={{ fontSize: "20px" }}
  />
);

export default Herte;
