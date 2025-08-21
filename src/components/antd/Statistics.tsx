import React, { ReactNode } from "react";
import { Statistic, StatisticProps } from "antd";
import { Colors } from "../../pages/colors";
import { fixedNumber } from "../../Functions/math";

interface IProps {
  children?: ReactNode;
  color?: string;
  type?: "total" | "default";
}

export default function Statistics({
  precision,
  value,
  type,
  color,
  valueStyle,
  ...rest
}: StatisticProps & IProps) {
  return (
    <Statistic
      value={fixedNumber(value ?? 0, precision ? precision : 4)}
      valueStyle={{
        fontSize: "14px",
        color: color ? color : type === "total" ? Colors.red : "",
        ...valueStyle,
      }}
      {...rest}
    />
  );
}
