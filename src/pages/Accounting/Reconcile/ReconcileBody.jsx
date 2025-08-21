import React, { useEffect, useState } from "react";
import {
  Typography,
  Col,
  Row,
  Form,
  Select,
  InputNumber,
  DatePicker,
  Button,
} from "antd";
import { useMediaQuery } from "../../MediaQurey";
import { useTranslation } from "react-i18next";
// import { connect } from "react-redux";

// import { useDatabase } from "@nozbe/watermelondb/hooks";
// import withObservables from "@nozbe/with-observables";
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
const { Title, Text } = Typography;
const { Option } = Select;
const ReconcileBody = (props) => {
  const { t } = useTranslation();
  // const [form] = Form.useForm();
  const isMobile = useMediaQuery("(max-width: 425px)");
  // const isMiniTablet = useMediaQuery("(max-width: 656px)");
  // const database = useDatabase();
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(props.groups);
  }, [props.groups]);
  //ending date
  const config = {
    rules: [{ type: "object" }],
  };
  return (
    <Form className="reconcile_body" layout="vertical">
      <Row className="reconcile_body_header">
        <Col span="24">
          {" "}
          <img src="images/banck.png" className="banckImage" />{" "}
        </Col>
        <Col span={24}>
          {" "}
          <br />
          <Title level={isMobile ? 3 : 2}>
            {t("Accounting.Reconcile.Reconcile_an_account")}{" "}
          </Title>
        </Col>
        <Col span={24}>
          <Text> {t("Accounting.Reconcile.Title_description")}</Text>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <br />{" "}
          {isMobile ? (
            <Text type="secondary" strong={true}>
              {t("Accounting.Reconcile.Account_question")}
            </Text>
          ) : (
            <Title level={4} type="secondary">
              {t("Accounting.Reconcile.Account_question")}
            </Title>
          )}
        </Col>
        <Col xl={9} md={10} sm={12} xs={isMobile ? 24 : 15}>
          <Form.Item name="account" label={t("Accounting.Account")}>
            <Select
              showSearch
              dropdownRender={(menu) => <div>{menu}</div>}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {items?.map((item) => (
                <Option value={item.name} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <br />
          {isMobile ? (
            <Text type="secondary" strong={true}>
              {t("Accounting.Reconcile.Add_following_information")}
            </Text>
          ) : (
            <Title level={4} type="secondary">
              {t("Accounting.Reconcile.Add_following_information")}
            </Title>
          )}
        </Col>
      </Row>
      <Row gutter={15} align="middle">
        <Col sm={8} xs={12} className="reconcile_beginning_balance">
          <span className="beginning_balance">
            {" "}
            {t("Accounting.Reconcile.Form.Beginning_balance")}
          </span>
          <span className="beginning_balance1">0.00</span>
        </Col>
        <Col sm={8} xs={12}>
          {" "}
          <Form.Item
            label={t("Accounting.Reconcile.Form.Ending_balance")}
            name="endingBalance"
          >
            <InputNumber
              type="number"
              className="num"
              inputMode="numeric"
              min={1}
            />
          </Form.Item>
        </Col>
        <Col sm={8} xs={isMobile ? 24 : 12}>
          {" "}
          <Form.Item
            label={t("Accounting.Reconcile.Form.Ending_date")}
            name="endingDate"
            {...config}
          >
            <DatePicker className="num" placeholder="" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <br />
          {isMobile ? (
            <Text type="secondary" strong={true}>
              {t("Accounting.Reconcile.Enter_service_charge")}
            </Text>
          ) : (
            <Title level={4} type="secondary">
              {t("Accounting.Reconcile.Enter_service_charge")}
            </Title>
          )}{" "}
        </Col>
      </Row>
      <Row gutter={15} align="middle">
        <Col sm={8} xs={12}>
          <Form.Item
            label={t("Sales.Customers.Form.Date")}
            name="date"
            {...config}
          >
            <DatePicker className="num" placeholder="" />
          </Form.Item>
        </Col>
        <Col sm={8} xs={12}>
          {" "}
          <Form.Item
            label={t("Accounting.Reconcile.Form.Service_charge")}
            name="serviceCharge"
          >
            <InputNumber
              type="number"
              className="num"
              inputMode="numeric"
              min={0}
            />
          </Form.Item>
        </Col>
        <Col sm={8} xs={12}>
          <Form.Item
            name="expenseAccount"
            label={t("Accounting.Reconcile.Form.Expense_account")}
          >
            <Select
              showSearch
              dropdownRender={(menu) => <div>{menu}</div>}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {items?.map((item) => (
                <Option value={item.name} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col sm={8} xs={12}>
          <Form.Item
            label={t("Sales.Customers.Form.Date")}
            name="date"
            {...config}
          >
            <DatePicker className="num" placeholder="" />
          </Form.Item>
        </Col>
        <Col sm={8} xs={12}>
          {" "}
          <Form.Item
            label={t("Accounting.Reconcile.Form.Interest_earned")}
            name="interestEarned"
          >
            <InputNumber
              type="number"
              className="num"
              inputMode="numeric"
              min={0}
            />
          </Form.Item>
        </Col>
        <Col sm={8} xs={12}>
          <Form.Item
            name="incomeAccount"
            label={t("Accounting.Reconcile.Form.Income_account")}
          >
            <Select
              showSearch
              dropdownRender={(menu) => <div>{menu}</div>}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {items?.map((item) => (
                <Option value={item.name} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24} className="reconcile_body_header">
          <Button type="primary" shape="round">
            Start reconciling
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
// const enhancProduct = withObservables(["groups"], ({ database }) => ({
//   groups: database.collections.get("groups").query().observe(),
// }));

// export default connect(null)(withDatabase(enhancProduct(ReconcileBody)));
export default ReconcileBody;
