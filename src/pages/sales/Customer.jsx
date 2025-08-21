import React from "react";
import Navbar from "../Employees/Navbar";
import NewCustomer from "./Customers/NewCustomer";
import CustomerTable from "./Customers/Table";
import { Title } from "../SelfComponents/Title";
import { useTranslation } from "react-i18next";
// import { Colors } from "../colors";
import { Row, Col, Menu } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useMediaQuery } from "../MediaQurey";
import { checkPermissionsModel } from "../../Functions";
import {
  CUSTOMER_CATEGORY_M,
  CUSTOMER_M,
  CUSTOMER_PAY_REC_M,
} from "../../constants/permissions";
import { PageMoreButton } from "../../components";

// import ImportCustomer from "./Customers/ImportCustomer";

const baseUrl = "/customer_account/customer/";
function Customer(props) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width:425px)");
  const isMiniMobile = useMediaQuery("(max-width:375px)");
  const isMiniTablet = useMediaQuery("(max-width:485px)");
  const menu = (
    <Menu>
      {checkPermissionsModel(CUSTOMER_CATEGORY_M) && (
        <Menu.Item key="1">
          <Link to="/customer-categories">
            {t("Sales.Product_and_services.Categories.1")}
          </Link>
        </Menu.Item>
      )}
      {/* <Menu.Item key="2">
        <Link to="/customer-discount">
          {" "}
          {t("Sales.Customers.Discount.Mange_discount")}
        </Link>
      </Menu.Item> */}
      {checkPermissionsModel(CUSTOMER_PAY_REC_M) && (
        <Menu.Item key="2">
          <Link to="/customer-payAndReceive-cash">
            {t("Employees.Pay_and_receive_cash")}
          </Link>
        </Menu.Item>
      )}
    </Menu>
  );

  // const imp = (
  //   <Menu>
  //     <Menu.Item key="1">
  //       <ImportCustomer />
  //     </Menu.Item>
  //   </Menu>
  // );

  return (
    <>
      <Navbar />

      <Row className="Sales__content-3" align="middle" justify="start">
        <Col
          xl={{ span: 7 }}
          md={{ span: 8 }}
          sm={{ span: 10 }}
          xs={{ span: 13 }}
        >
          <Title value={t("Sales.Customers.1")} model={CUSTOMER_M} />
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
              <PageMoreButton
                permissions={[CUSTOMER_PAY_REC_M, CUSTOMER_CATEGORY_M]}
                overlay={menu}
              />
            </Col>
            <Col xl={13} md={12} sm={13} xs={24}>
              <NewCustomer place="customer" form="" baseUrl={baseUrl} />
            </Col>
          </Row>
        </Col>
      </Row>
      {checkPermissionsModel(CUSTOMER_M) && <CustomerTable baseUrl={baseUrl} />}
    </>
  );
}
// const styles = {
//   newDrop: {
//     width: "100%",
//     height: "100%",
//     borderRadius: "0rem 40px 40px 0rem",
//   },
//   newDrop1: { width: "100%", height: "100%", borderRadius: "50% 0% 0% 50%" },
//   divider: {
//     height: "100%",
//     margin: "0px",
//     background: Colors.buttonDividerColor,
//   },
// };
const mapStateToProps = (state) => {
  return {
    rtl: state.direction.rtl,
    ltr: state.direction.ltr,
  };
};
export default connect(mapStateToProps)(Customer);
