import React from "react";
import { useTranslation } from "react-i18next";
import { DatePickerFormItem } from "../../../../SelfComponents/JalaliAntdComponents/DatePickerFormItem";
import { Row, Col, Form, Input, Select } from "antd";

const { Option } = Select;
export default function ProductTransferHeader({
  type,
  disabled,
}: {
  type?: string;
  disabled: boolean;
}) {
  const { t } = useTranslation();
  return (
    <Row gutter={10} style={styles.body}>
      {type === "adjustment" && (
        <Col span={12}>
          <Form.Item name="type">
            <Select
              className="num"
              placeholder={t("Sales.Product_and_services.Type")}
              disabled={disabled}
            >
              <Option value="waste">{t("Reports.Waste")}</Option>
              <Option value="reward">{t("Reports.Reward")}</Option>
            </Select>
          </Form.Item>
        </Col>
      )}
      <Col span={type === "adjustment" ? 12 : 24}>
        <DatePickerFormItem
          placeholder={t("Sales.Customers.Form.Date")}
          name="date"
          label=""
          showTime={true}
          format="YYYY-MM-DD hh:mm "
          rules={[{ type: "object" }]}
          disabled={disabled}
        />
      </Col>

      <Col span={24}>
        <Form.Item name="description">
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 3 }}
            placeholder={t("Form.Description")}
            showCount
            allowClear
            disabled={disabled}
          />
        </Form.Item>
      </Col>
    </Row>
  );
}

const styles = {
  body: { paddingBottom: "24px" },
};
