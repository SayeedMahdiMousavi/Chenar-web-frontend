import React from "react";
import { useTranslation } from "react-i18next";
import { Row, Col, Layout } from "antd";
import AddCurrency from "./AddCurrency";
import { useMediaQuery } from "../MediaQurey";
import CurrencyTable from "./CurrencyTable";
import { Title } from "../SelfComponents/Title";
import { CURRENCY_M } from "../../constants/permissions";
import { checkPermissions } from "../../Functions";
import { PageBackIcon } from "../../components";
import { CURRENCY_RATE } from "../../constants/routes";

interface Props {
  rtl: string;
}
const FirstPeriod: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width:425px)");
  const isMiniMobile = useMediaQuery("(max-width:375px)");
  const isMiniTablet = useMediaQuery("(max-width:485px)");

  // const menu = (
  //   <Menu>
  //     <Menu.Item key="1">
  //       <Link to="/currency-rate">
  //         {t("Sales.Product_and_services.Currency.Currency_rate")}
  //       </Link>
  //     </Menu.Item>
  //     <Menu.Item key="2">
  //       <Link to="/currency-exchange">{t("Reports.Currency_exchange")}</Link>
  //     </Menu.Item>
  //   </Menu>
  // );
  return (
    <Layout>
      <Row className="categore-header" align="middle" justify="start">
        <Col
          xl={{ span: 7 }}
          md={{ span: 8 }}
          sm={{ span: 10 }}
          xs={{ span: 13 }}
          className="Sales__content-3-body"
        >
          <Row>
            <Col span={24}>
              <Title
                value={t("Sales.Product_and_services.Currency.1")}
                model={CURRENCY_M}
              />
            </Col>
            <Col
              xl={{ span: 12, offset: 0 }}
              lg={{ span: 17, offset: 0 }}
              md={{ span: 18, offset: 0 }}
              xs={{ span: 17, offset: 0 }}
            >
              <PageBackIcon
                previousPageName={t(
                  "Sales.Product_and_services.Currency.Currency_rate"
                )}
                url={CURRENCY_RATE}
              />
            </Col>
          </Row>
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
            <Col xl={10} md={10} sm={9} xs={23}></Col>
            <Col xl={13} md={12} sm={13} xs={24}>
              <AddCurrency />
            </Col>
          </Row>
        </Col>
      </Row>

      {checkPermissions(`view_${CURRENCY_M}`) && <CurrencyTable />}
    </Layout>
  );
};

export default FirstPeriod;
