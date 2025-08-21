import React from "react";
import {
  BellOutlined,
  SearchOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { Row, Col } from "antd";
export default function InvoiceHeader(props) {
  return (
    <div>
      <Row align="middle">
        <Col span={1}>
          <HistoryOutlined className="font invoice_header" />
        </Col>
        <Col xl={7}>
          <h3 className="invoice_header-title ">InvoiceRecent no.1001 </h3>
        </Col>
        <Col xl={1} offset={12}>
          <SearchOutlined className="font" />
        </Col>
        <Col xl={1}>
          <BellOutlined className="font" />
        </Col>
        <Col xl={1}>
          <img src="/img5.png" alt="user" className="invoice_header-img" />
        </Col>
      </Row>
    </div>
  );
}
