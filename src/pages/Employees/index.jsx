import React from "react";
import { useTranslation } from "react-i18next";
import { Row, Col, Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { useMediaQuery } from "../MediaQurey";
import EmployeesTable from "./EmployeesTable";
import AddEmployee from "./AddEmployee";
import { Title } from "../SelfComponents/Title";
import Navbar from "./Navbar";
import { checkPermissionsModel } from "../../Functions";
import {
  EMPLOYEE_CATEGORY_M,
  EMPLOYEE_M,
  EMPLOYEE_PAY_REC_M,
  EMPLOYEE_SALARY_M,
} from "../../constants/permissions";
import { PageMoreButton } from "../../components";

const baseUrl = "/staff_account/staff/";
const Employees = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width:425px)");
  const isMiniMobile = useMediaQuery("(max-width:375px)");
  const isMiniTablet = useMediaQuery("(max-width:485px)");

  const menu = (
    <Menu>
      {checkPermissionsModel(EMPLOYEE_CATEGORY_M) && (
        <Menu.Item key="1">
          <Link to="/employee-categories">
            {t("Sales.Product_and_services.Categories.1")}
          </Link>
        </Menu.Item>
      )}
      {checkPermissionsModel(EMPLOYEE_SALARY_M) && (
        <Menu.Item key="2">
          <Link to="/record-salaries">{t("Employees.Record_salaries")}</Link>
        </Menu.Item>
      )}
      {checkPermissionsModel(EMPLOYEE_PAY_REC_M) && (
        <Menu.Item key="3">
          <Link to="/employee-payAndReceive-cash">
            {t("Employees.Pay_and_receive_cash")}
          </Link>
        </Menu.Item>
      )}
    </Menu>
  );
  return (
    <Layout>
      <Navbar />

      <Row className="Sales__content-3" align="middle" justify="start">
        <Col
          xl={{ span: 7 }}
          md={{ span: 8 }}
          sm={{ span: 10 }}
          xs={{ span: 13 }}
        >
          <Title value={t("Employees.1")} model={EMPLOYEE_M} />
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
                permissions={[
                  EMPLOYEE_PAY_REC_M,
                  EMPLOYEE_SALARY_M,
                  EMPLOYEE_CATEGORY_M,
                ]}
                overlay={menu}
              />
            </Col>
            <Col xl={13} md={12} sm={13} xs={24}>
              <AddEmployee baseUrl={baseUrl} />
            </Col>
          </Row>
        </Col>
      </Row>

      {checkPermissionsModel(EMPLOYEE_M) && (
        <EmployeesTable baseUrl={baseUrl} />
      )}
    </Layout>
  );
};

export default Employees;
