import { Card, CardProps } from "antd";
import { ReactNode } from "react";
import React from "react";

interface IProps extends CardProps {
  children: ReactNode;
}

export default function CustomCard({ children, style, ...rest }: IProps) {
  return (
    <Card
      bordered={false}
      style={{
        ...styles.customCard,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Card>
  );
}

interface IStyles {
  customCard: React.CSSProperties;
}

const styles: IStyles = {
  customCard: {
    boxShadow: "0px 0px 16px rgba(0,0,0,0.05)",
    borderRadius: "16px",
  },
};
