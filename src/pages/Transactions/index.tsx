import React from "react";
import Navbar from "../Expenses/Navbar";
import { Title } from "../SelfComponents/Title";
import { Row, Col, Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { useMediaQuery } from "../MediaQurey";
import AddTransaction from "./AddTransaction";
import TransactionsTable from "./TransactionsTable";
import { useTranslation } from "react-i18next";
import { PageBackIcon, PageMoreButton } from "../../components";
import {
  EXPENSE_TYPE_M,
  INCOME_TYPE_M,
  WITHDRAW_TYPE_M,
} from "../../constants/permissions";
import { checkPermissionsModel } from "../../Functions";
// import ImportProduct from "./ImportProductAndService";

interface IProps {
  title: string;
  baseUrl: string;
  backText: string;
  backUrl: string;
  place: string;
  modalTitle: string;
  model: string;
}
const Transactions: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const isMiniTablet = useMediaQuery("(max-width:485px)");
  const isMobile = useMediaQuery("(max-width:455px)");
  const isMiniMobile = useMediaQuery("(max-width:390px)");
  const menu = (
    <Menu>
      {props.place === "recordExpense" ? (
        <Menu.Item key="4">
          <Link to="/expense-definition">
            {t("Expenses.Expenses_definition")}
          </Link>
        </Menu.Item>
      ) : props.place === "recordIncome" ? (
        <Menu.Item key="4">
          <Link to="/income-definition">
            {t("Expenses.Income.Income_type")}
          </Link>
        </Menu.Item>
      ) : (
        <Menu.Item key="4">
          <Link to="/withdraw-information">
            {t("Expenses.With_draw.With_definition")}
          </Link>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <Layout>
      {(props.place === "recordExpense" ||
        props.place === "recordIncome" ||
        props.place === "recordWithdraw") && <Navbar />}

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
              <Title value={props.title} model={props.model} />
            </Col>
            {props.place === "recordExpense" ||
            props.place === "recordIncome" ||
            props.place === "recordWithdraw" ? null : (
              <Col
                xl={{ span: 12, offset: 0 }}
                lg={{ span: 17, offset: 0 }}
                md={{ span: 18, offset: 0 }}
                xs={{ span: 17, offset: 0 }}
              >
                <PageBackIcon
                  previousPageName={props.backText}
                  url={props.backUrl}
                />
              </Col>
            )}
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
            <Col xl={10} md={10} sm={9} xs={23}>
              {(props.place === "recordExpense" ||
                props.place === "recordIncome" ||
                props.place === "recordWithdraw") && (
                <PageMoreButton
                  permissions={
                    props.place === "recordExpense"
                      ? [EXPENSE_TYPE_M]
                      : props.place === "recordIncome"
                      ? [INCOME_TYPE_M]
                      : [WITHDRAW_TYPE_M]
                  }
                  overlay={menu}
                />
              )}
            </Col>
            <Col xl={13} md={12} sm={13} xs={24}>
              <AddTransaction
                baseUrl={props.baseUrl}
                modalTitle={props.modalTitle}
                place={props.place}
                model={props?.model}
              />
              {/* <Row>
                      <Col xl={17} md={17} sm={17} xs={17}>
                        {" "}
                        <NewCustomer />
                      </Col>
                      <Col>
                        {" "}
                        <Divider
                          type='vertical'
                          style={{ height: "100%", margin: "0px" }}
                        />
                      </Col>

                      <Col sm={6} xs={6}>
                        <Dropdown overlay={imp} trigger={["click"]}>
                          <button
                            // type='primary'
                            // shape='round'
                            // size='small'
                            className='button__new'
                            style={props.rtl ? styles.newDrop1 : styles.newDrop}
                          >
                            <DownOutlined />
                          </button>
                        </Dropdown>
                      </Col>
                    </Row> */}
            </Col>
          </Row>
        </Col>
        {/* <Col
                xl={{ span: 3, offset: 11 }}
                lg={{ span: 3, offset: 11 }}
                md={{ span: 4, offset: 10 }}
                sm={{ span: 5, offset: 8 }}
                xs={{ span: 6, offset: 4 }}
              >
                <AddTransaction
                  baseUrl={props.baseUrl}
                  modalTitle={props.modalTitle}
                  place={props.place}
                />
              </Col> */}
      </Row>

      {checkPermissionsModel([props?.model]) && (
        <TransactionsTable
          baseUrl={props.baseUrl}
          modalTitle={props.modalTitle}
          place={props.place}
          title={props.title}
          model={props?.model}
        />
      )}
    </Layout>
  );
};

export default Transactions;
