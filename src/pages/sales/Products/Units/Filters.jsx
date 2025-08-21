import React from "react";
import { Row, Col, Select, Form } from "antd";
import { useTranslation } from "react-i18next";
import { ResetButton, ApplyButton } from "../../../../components";

const { Option } = Select;
export default function Filters(props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    props.setFilters({ state: values?.status });
    props.setPage(1);
    props.setVisible(false);
  };

  const onReset = () => {
    form.resetFields();
    props.setVisible(false);
    props.setFilters({ state: "active" });
    props.setPage(1);
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      form={form}
      style={styles.form}
      initialValues={{
        status: "active",
      }}
    >
      <Row>
        <Col span={24}>
          <Form.Item
            name="status"
            label={<span>{t("Sales.Product_and_services.Status")}</span>}
          >
            <Select autoFocus>
              <Option value="active">
                {t("Sales.Product_and_services.Active")}
              </Option>
              <Option value="deactivate">
                {t("Sales.Product_and_services.Inactive")}
              </Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item style={styles.margin}>
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
  margin: { marginBottom: "0px" },
  form: { width: "230px" },
};
