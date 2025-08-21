import React from "react";
import {
  // Checkbox,
  Row,
  Col,
  // Select,
  // message,
  // Menu,
  // Table,
  // Dropdown,
  Button,
  // Input,
  // Modal,
  // InputNumber,
  // Form,
  // Popconfirm,
} from "antd";
import AccountHistoryTable from "./AccountHistory/AccountHistoryTable";
// import { useDatabase } from "@nozbe/watermelondb/hooks";
// import withObservables from "@nozbe/with-observables";
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
import { useMediaQuery } from "../MediaQurey";

import { useTranslation } from "react-i18next";
import {
  // SettingOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
// import AddCategorie from "./AddCategoris";
import { Link } from "react-router-dom";

import { connect } from "react-redux";

// const { Option } = Select;
function BankAccountHistory({ groups, rtl }) {
  const isMobile = useMediaQuery("(max-width:425px)");
  const { t, i18n } = useTranslation();

  return (
    <div className="page-body-offline">
      <Row justify="space-around">
        <Col xl={23} md={23} xs={23} className="banner">
          <Row className="categore-header" align="middle" justify="start">
            <Col
              md={{ span: 12 }}
              sm={{ span: 11 }}
              xs={isMobile ? { span: 15 } : { span: 14 }}
              className="Sales__content-3-body"
            >
              <Row>
                <Col span={24}>
                  <span className="header">
                    {t("Accounting.Bank_register.Bank_account_history")}

                    <br />
                  </span>
                </Col>
                <Col span={24}>
                  <Link to="/chart-of-accounts" className="category__product">
                    {i18n.language === "en" ? (
                      <LeftOutlined />
                    ) : (
                      <RightOutlined />
                    )}
                    {t("Accounting.Bank_register.Back_Chart_Accounts")}
                  </Link>
                </Col>
              </Row>
            </Col>
            <Col
              xl={{ span: 3, offset: 9 }}
              lg={{ span: 3, offset: 9 }}
              md={{ span: 5, offset: 7 }}
              sm={{ span: 5, offset: 8 }}
              xs={isMobile ? { span: 8, offset: 1 } : { span: 6, offset: 4 }}
            >
              <Link to="/reconcile" className="num">
                {/* {t("Sales.Product_and_services.1")} */}
                <Button shape="round" type="primary" className="num">
                  {t("Accounting.Reconcile.1")}
                </Button>
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
      <AccountHistoryTable />
    </div>
  );
}
// const styles = {
//   cancel: { color: "gray", cursor: "pointer" },
//   firstRow: { paddingInlineStart: "1rem" },
// };

const mapStateToProps = (state) => ({
  rtl: state.direction.rtl,
  ltr: state.direction.ltr,
});
// const enhanceUnits = withObservables(["groups"], ({ database }) => ({
//   groups: database.collections.get("groups").query().observe(),
// }));
// export default connect(mapStateToProps)(
//   withDatabase(enhanceUnits(BankAccountHistory))
// );
export default connect(mapStateToProps)(BankAccountHistory);
