import React from "react";
import { Row, Col, Select, Form, Button } from "antd";
import { useTranslation } from "react-i18next";
import { CategoryField } from "../../SelfComponents/CategoryField";
import { ApplyButton, ResetButton } from "../../../components";

const { Option } = Select;
export default function ProductTableFilter(props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    props.setFilters({
      state: values.status,
      category: values?.category?.label ?? "",
    });
    props.setPage(1);
    props.setVisible(false);
  };

  const onReset = () => {
    props.setFilters({ state: "active", category: "" });
    props.setPage(1);
    props.setVisible(false);
    form.resetFields();
  };
  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      form={form}
      hideRequiredMark
      initialValues={{
        status: "active",
        type: "",
      }}
      style={styles.form}
    >
      <Row gutter={[0, 11]}>
        <Col span={24}>
          <Form.Item
            name="status"
            label={<span>{t("Sales.Product_and_services.Status")}</span>}
            className="margin"
          >
            <Select className="table__header1-select" autoFocus>
              <Option value="active">
                {t("Sales.Product_and_services.Active")}
              </Option>
              <Option value="deactivate">
                {t("Sales.Product_and_services.Inactive")}
              </Option>
              {/* <Option value='all'>
                {" "}
                {t("Sales.Product_and_services.All")}
              </Option> */}
            </Select>
          </Form.Item>
        </Col>

        <Col span={24}>
          <CategoryField
            form={form}
            place="filter"
            url="/product/category/"
            style={styles.formItem}
            label={<span>{t("Sales.Product_and_services.Form.Category")}</span>}
          />
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
  form: {
    width: "250px",
  },
  formItem: { marginBottom: 5 },
};
