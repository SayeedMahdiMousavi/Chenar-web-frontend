import React from "react";
import Navbar from "../Navbar";
import { Layout, Row, Col, Menu } from "antd";
import { useTranslation } from "react-i18next";
import { Title } from "../../SelfComponents/Title";
import CashBoxTable from "./CashBoxTable";
import AddCashBox from "./AddCashBox";
import { Link } from "react-router-dom";
import { useMediaQuery } from "../../MediaQurey";
import { PageMoreButton } from "../../../components";
import { CASH_M, MONEY_TRANSFER_M } from "../../../constants/permissions";
import { checkPermissionsModel } from "../../../Functions";

export const cashBaseUrl = "/banking/cash/";

export default function CashBox() {
  const { t } = useTranslation();
  const isMiniTablet = useMediaQuery("(max-width:485px)");
  const isMobile = useMediaQuery("(max-width:425px)");
  const isMiniMobile = useMediaQuery("(max-width:375px)");

  const menu = (
    <Menu>
      <Menu.Item key="4">
        <Link to="/money-transfer/cash">{t("Banking.Money_transfer")}</Link>
      </Menu.Item>
    </Menu>
  );
  return (
    <Layout>
      <Navbar />

      <Row className="categore-header" align="middle" justify="start">
        <Col
          xl={{ span: 7 }}
          md={{ span: 8 }}
          sm={{ span: 10 }}
          xs={{ span: 13 }}
          className="Sales__content-3-body"
        >
          <Title value={t("Banking.Cash_box.1")} model={CASH_M} />
        </Col>
        <Col
          xl={{ span: 6, offset: 11 }}
          md={{ span: 8, offset: 8 }}
          sm={{ span: 10, offset: 4 }}
          xs={
            isMiniMobile
              ? { span: 8, offset: 3 }
              : isMiniTablet
              ? { span: 7, offset: 4 }
              : { span: 6, offset: 5 }
          }
        >
          <Row justify={isMobile ? "center" : "space-around"} gutter={[0, 5]}>
            <Col xl={10} md={10} sm={9} xs={23}>
              <PageMoreButton permissions={[MONEY_TRANSFER_M]} overlay={menu} />
            </Col>
            <Col xl={13} md={12} sm={13} xs={24}>
              <AddCashBox type="cash" baseUrl={cashBaseUrl} />
            </Col>
          </Row>
        </Col>
      </Row>
      {checkPermissionsModel(CASH_M) && <CashBoxTable baseUrl={cashBaseUrl} />}
    </Layout>
  );
}
