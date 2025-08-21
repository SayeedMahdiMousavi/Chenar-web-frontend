import React, { useState } from "react";
import Navbar from "./Navbar.jsx";
import { Layout, Row, Col, Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import ReconcileBody from "./Reconcile/ReconcileBody.js";
import { useTranslation } from "react-i18next";
const { Content } = Layout;
export default function Reconcile() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState("");
  const onClickSummary = () => {
    setCurrent("summary");
  };
  const onClickHistory = () => {
    setCurrent("history");
  };
  return (
    <Layout>
      <Navbar />
      <Content>
        <Row justify="space-around">
          <Col span={23} className="banner">
            <Row className="reconcile_breadcrumb" align="middle">
              <Col span={24}>
                <Breadcrumb separator=">">
                  <Breadcrumb.Item>
                    <Link to="/chart-of-accounts">
                      {t("Accounting.Chart_of_accounts.1")}
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <Link to="/register">
                      {t("Accounting.Bank_register.1")}
                    </Link>
                  </Breadcrumb.Item>
                  {current === "summary" ? (
                    <Breadcrumb.Item>
                      <Link to="/reconcile">
                        {" "}
                        {t("Accounting.Reconcile.Summary")}
                      </Link>
                    </Breadcrumb.Item>
                  ) : current === "history" ? (
                    <Breadcrumb.Item>
                      <Link to="/reconcile">
                        {t("Accounting.Reconcile.History_by_account")}
                      </Link>
                    </Breadcrumb.Item>
                  ) : (
                    <Breadcrumb.Item>
                      <Link to="/reconcile">{t("Accounting.Reconcile.1")}</Link>
                    </Breadcrumb.Item>
                  )}
                </Breadcrumb>
              </Col>
            </Row>
            <Row align="top" className="reconcile_breadcrumb">
              <Col md={8} sm={7} xs={24}>
                {" "}
                <span className="header">{t("Accounting.Reconcile.1")}</span>
              </Col>
              <Col md={16} sm={17} xs={24} style={{ textAlign: "end" }}>
                {" "}
                <Breadcrumb separator="|">
                  <Breadcrumb.Item onClick={onClickSummary}>
                    <a href="#" className="breadcrumb_reconcile">
                      {t("Accounting.Reconcile.Summary")}
                    </a>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item onClick={onClickHistory}>
                    <a href="#" className="breadcrumb_reconcile">
                      {t("Accounting.Reconcile.History_by_account")}
                    </a>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    {" "}
                    <a href="" className="breadcrumb_reconcile">
                      {t("Accounting.Reconcile.Show_me_around")}
                    </a>{" "}
                  </Breadcrumb.Item>
                </Breadcrumb>
              </Col>
            </Row>
            <ReconcileBody />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
