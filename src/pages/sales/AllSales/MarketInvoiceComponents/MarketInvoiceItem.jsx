import React from "react";
import { Row, Col } from "antd";
const MarketInvoiceItem = (props) => {
  return (
    <Row justify="space-between">
      <Col
        span={17}
        className={`${
          props.className
            ? props?.className
            : "market_invoice_description_title"
        } text_align_end`}
      >
        {props.name}
      </Col>
      {props.break && <br />}
      <Col
        className={
          props?.className ? props?.className : "market_invoice_description"
        }
      >
        {" "}
        {props.value}
      </Col>
    </Row>
  );
};

export default MarketInvoiceItem;
