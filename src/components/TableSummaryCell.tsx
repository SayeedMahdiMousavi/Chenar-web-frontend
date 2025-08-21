import React, { ReactNode } from "react";
import { Col, Row, Table, Typography } from "antd";
import { Statistics } from "./antd";

export function TableSummaryCell({
  type,
  children,
  index,
  isSelected,
  value,
  colSpan,
  color,
}: {
  type?: "total" | "checkbox" | undefined;
  children?: string | ReactNode;
  index: number;
  isSelected?: boolean;
  value?: number;
  colSpan?: number;
  color?: string;
}) {
  return (
    <Table.Summary.Cell
      index={index}
      className={Boolean(isSelected) ? "tableSummary__cell" : ""}
      colSpan={colSpan}
    >
      {type === "checkbox" ? (
        <Row className="num" justify="center">
          <Col>{children}</Col>
        </Row>
      ) : type === "total" ? (
        <Statistics value={value ?? 0} type="total" color={color} />
      ) : (
        <Typography.Text
          type={color ? undefined : "danger"}
          style={{ color: color ? color : ""  , fontSize:"15px"}}
        >
          {children}
        </Typography.Text>
      )}
    </Table.Summary.Cell>
  );
}
