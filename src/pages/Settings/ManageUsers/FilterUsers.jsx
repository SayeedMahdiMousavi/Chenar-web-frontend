import React from "react";
import { Row, Col, Select, Form, Button } from "antd";
import { useTranslation } from "react-i18next";
import { ApplyButton, ResetButton } from "../../../components";

const { Option } = Select;
export default function Filters(props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    const status =
      values.status === "active"
        ? true
        : values.status === "inActive"
        ? false
        : "Unknown";
    props.setFilters({ state: status });
    props.setVisible(false);
    props.setPage(1);
  };
  const onReset = () => {
    form.resetFields();
    props.setVisible(false);
    props.setFilters({ state: true });
    props.setPage(1);
  };
  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      form={form}
      initialValues={{
        ["status"]: "active",
      }}
    >
      <Row>
        <Col span={24}>
          <Form.Item
            name="status"
            label={<span>{t("Sales.Product_and_services.Status")}</span>}
          >
            <Select className="table__header1-select" autoFocus>
              <Option value="active">
                {t("Sales.Product_and_services.Active")}
              </Option>
              <Option value="inActive">
                {t("Sales.Product_and_services.Inactive")}
              </Option>
              <Option value="all">
                {" "}
                {t("Sales.Product_and_services.All")}
              </Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item style={styles.formItem}>
            <Row className="num" justify="space-between">
              <Col>
                <ResetButton onClick={onReset} />
              </Col>
              <Col>
                <ApplyButton />
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
const styles = {
  formItem: { marginBottom: "0px" },
};
