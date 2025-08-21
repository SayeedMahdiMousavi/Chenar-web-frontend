import React from "react";
import Chart from "./chart";
import ChartOne from "./chart-1";
import ChartTow from "./chart-2";
import DashboardSectionTwo from "./Dashboard_section-2";
import { Layout, Row, Col } from "antd";

const Dashboard = (props) => {
  return (
    <Layout>
      <Row
        className="chart"
        align="middle"
        gutter={[30]}
        style={{ margin: "0rem" }}
      >
        <Col xl={8} md={12} xs={24}>
          <Chart />
        </Col>
        <Col xl={8} md={12} xs={24}>
          <ChartOne />
        </Col>
        <Col xl={8} md={12} xs={24}>
          <ChartTow />
        </Col>
      </Row>
      <div>
        <DashboardSectionTwo />
      </div>
    </Layout>
  );
};

export default Dashboard;
