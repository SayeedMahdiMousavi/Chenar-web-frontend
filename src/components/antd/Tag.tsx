import React, { ReactNode, useMemo } from "react";
import { Tag } from "antd";
import { generate } from "@ant-design/colors";
import { Colors } from "../../pages/colors";

interface IProps {
  children: ReactNode;
  color: string;
  icon?: ReactNode;
}

export default function AntdTag(props: IProps) {
  const colors = useMemo(() => generate(props.color), [props.color]);
  return (
    <Tag
      icon={props.icon}
      style={{
        backgroundColor:
          props.color === Colors.primaryColor ? "#e2fff7" : colors?.[0],
        color: props.color,
        border: "none",
        padding: "4px 7px",
        borderRadius: "4px",
      }}
    >
      {props?.children}
    </Tag>
  );
}
