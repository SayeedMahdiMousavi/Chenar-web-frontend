import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Modal, Button, Typography, Space, Select } from "antd";
import { BARCODE_LABEL_TYPE } from "../../LocalStorageVariables";
import { CancelButton, SaveButton } from "../../../components";

const { Title } = Typography;

export default function BarcodeLabelSettings() {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [type, setType] = useState(
    () => localStorage.getItem(BARCODE_LABEL_TYPE) || "10"
  );
  const [visible, setVisible] = useState(false);

  const onFinish = async (values: any) => {
    localStorage.setItem(BARCODE_LABEL_TYPE, values.type);
    setType(values?.type);
    setVisible(false);
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);

    form.resetFields();
  };

  const handelAfterClose = () => {
    form.resetFields();
  };

  return (
    <div>
      <div onClick={showModal}>
        {t("Sales.Product_and_services.Barcode_label_settings")}
      </div>
      <Modal
        maskClosable={false}
        open={visible}
        onOk={onFinish}
        onCancel={handleCancel}
        footer={null}
        width={310}
        //@ts-ignore
        handelAfterClose={handelAfterClose}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          hideRequiredMark={true}
          form={form}
          initialValues={{
            type: type,
          }}
        >
          <Title level={5}>
            {t("Sales.Product_and_services.Barcode_label_settings")}
          </Title>
          <Form.Item
            name="type"
            label={t("Sales.Product_and_services.Paper_type")}
            style={styles.formItem}
          >
            <Select className="num">
              <Select.Option value={"8"}>
                {t("Sales.Product_and_services.Eight_item_perPage")}
              </Select.Option>
              <Select.Option value={"10"}>
                {t("Sales.Product_and_services.Ten_item_perPage")}
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item className="textAlign__end" style={styles.footer}>
            <Space>
              <CancelButton onClick={handleCancel} />
              <SaveButton type="primary" htmlType="submit" />
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

const styles = {
  footer: {
    paddingTop: "10px",
    marginBottom: "5px",
  },
  formItem: { marginTop: "22px" },
};
