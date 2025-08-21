import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Modal, Typography, Space, message, Select } from "antd";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../ApiBaseUrl";
import { CancelButton, SaveButton } from "../../../../components";

const { Title } = Typography;

interface IProps {
  baseUrl: string;
  selectedRowKeys: number[];
  setSelectedRows?: (value: any) => void;
  setSelectedRowKeys?: (value: any) => void;
}
export default function ChangeVip(props: IProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const { mutate: mutateChangeVip } = useMutation(
    async (value: { products: number[]; is_have_vip_price: boolean }) =>
      await axiosInstance
        .put(`${props.baseUrl}bulk/update/vip_price/`, value)
        .then(() => {
          message.success(
            t("Sales.Product_and_services.Form.Vip_save_message")
          );
          setVisible(false);
          setLoading(false);
          form.resetFields();
          if (props.setSelectedRows) {
            props.setSelectedRows((prev: any) => {
              const newData = prev?.map((item: any) => {
                return { ...item, is_have_vip_price: value?.is_have_vip_price };
              });
              return newData;
            });
          }
        })
        .catch((error) => {
          setLoading(false);
          message.error(`${error?.response?.data?.data?.message}`);
        }),
    {
      onSuccess: () => queryClient.invalidateQueries(`${props.baseUrl}`),
    }
  );

  let oneRequest = false;
  const onFinish = async (values: any) => {
    setLoading(true);
    if (oneRequest) {
      return;
    }
    oneRequest = true;

    try {
      mutateChangeVip({
        is_have_vip_price: values?.isVip === "true" ? true : false,
        products: props?.selectedRowKeys,
      });
      oneRequest = false;
    } catch (info) {
      oneRequest = false;
    }
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
  };

  const handelAfterClose = () => {
    form.resetFields();
    setLoading(false);
  };

  return (
    <div>
      <div onClick={showModal}>
        {t("Sales.Product_and_services.Form.Vip_price")}
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
            isVip: "true",
          }}
        >
          <Title level={5}>
            {t("Sales.Product_and_services.Form.Vip_price")}
          </Title>
          <Form.Item name="isVip" style={styles.formItem}>
            <Select className="num">
              <Select.Option value={"true"}>
                {t("Sales.Product_and_services.Form.Has_vip_price")}
              </Select.Option>
              <Select.Option value={"false"}>
                {t("Sales.Product_and_services.Form.Has_not_vip_price")}
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item className="textAlign__end" style={styles.footer}>
            <Space>
              <CancelButton onClick={handleCancel} />
              <SaveButton htmlType="submit" loading={loading} />
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

const styles = {
  footer: { marginBottom: "3px", paddingTop: "12px" },
  formItem: { marginTop: "22px" },
};
