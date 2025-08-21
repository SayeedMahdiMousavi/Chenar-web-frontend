import React, { memo, useState } from "react";
import { Modal, Button, Form, Typography, Input, message, Space } from "antd";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../ApiBaseUrl";
import { AddItem } from "../../SelfComponents/AddItem";
import Draggable from "react-draggable";
import { ActionMessage } from "../../SelfComponents/TranslateComponents/ActionMessage";
import { trimString } from "../../../Functions/TrimString";
import { CancelButton, SaveButton } from "../../../components";
import { addMessage, manageErrors } from "../../../Functions";
const { Title } = Typography;

function AddUnit(props) {
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const addUnit = async (value) =>
    await axiosInstance.post(`/product/unit/`, value);

  const {
    mutate: mutateAddUnit,
    isLoading,
    reset,
  } = useMutation(addUnit, {
    onSuccess: (values) => {
      setVisible(false);
      const row = props.form.getFieldsValue();
      const units = row?.units ?? [];

      props.form.setFieldsValue({
        units: [
          ...units,
          {
            label: values?.data?.name,
            value: values?.data?.id,
            key: values?.data?.id,
          },
        ],
      });
      if (props?.type !== "addUnits") {
        props.setUnits((prev) => {
          const units = [
            ...prev,
            {
              label: values?.data?.name,
              value: values?.data?.id,
              key: values?.data?.id,
            },
          ];
          return units;
        });
      }
      addMessage(values?.data?.name);
      queryClient.invalidateQueries(`/product/unit/`);
      queryClient.invalidateQueries(`/product/unit/infinite/`);
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const onFinish = async (value) => {
    const allData = {
      name: trimString(value?.name),
      symbol: value?.symbol,
    };
    mutateAddUnit(allData);
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleAfterClose = () => {
    reset();
    form.resetFields();
  };

  return (
    <div>
      <AddItem showModal={showModal} />
      <Modal
        maskClosable={false}
        open={visible}
        onOk={onFinish}
        onCancel={handleCancel}
        footer={null}
        width={360}
        afterClose={handleAfterClose}
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          hideRequiredMark={true}
          form={form}
        >
          <Title
            level={5}
            className="drag_modal"
            onMouseOver={() => {
              setDisabled(false);
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
          >
            {t("Sales.Product_and_services.Units.Unit_information")}
          </Title>
          <Form.Item
            name="name"
            label={
              <span>
                {t("Form.Name")} <span className="star">*</span>
              </span>
            }
            rules={[{ required: true, message: t("Form.Name_required") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="symbol"
            label={
              <span>
                {t("Form.Symbol")} <span className="star">*</span>
              </span>
            }
            rules={[
              {
                required: true,
                message: `${t(
                  "Sales.Product_and_services.Units.Required_symbol"
                )}`,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item className="formItem textAlign__end" style={styles.footer}>
            <Space>
              <CancelButton onClick={handleCancel} />
              <SaveButton htmlType="submit" loading={isLoading} />
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

const styles = {
  footer: { paddingTop: "15px" },
};

// eslint-disable-next-line no-func-assign
AddUnit = memo(AddUnit);

export default AddUnit;
