import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../ApiBaseUrl";
import { Drawer, Form, Col, Row, Input, Checkbox, Space, Modal } from "antd";
import { useMediaQuery } from "../MediaQurey";
import { trimString } from "../../Functions/TrimString";
import { currencyRateBaseUrl } from "./Currency rate/CurrencyRate";
import { CancelButton, EditMenuItem, SaveButton } from "../../components";
import { CURRENCY_M } from "../../constants/permissions";
import { manageErrors, updateMessage } from "../../Functions";

interface IProps {
  record: any;
  setVisible: (visible: boolean) => void;
  handleClickEdit: () => void;
}
const EditCurrency: React.FC<IProps> = ({
  record,
  setVisible: setMenuVisible,
  handleClickEdit,
  ...rest
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const isTablet = useMediaQuery("(max-width:768px)");
  const isMobile = useMediaQuery("(max-width:425px)");

  const showDrawer = () => {
    setMenuVisible(false);
    handleClickEdit();
    setVisible(true);
    form.setFieldsValue({
      name: record?.name,
      symbol: record?.symbol,
      isActive: record?.is_active,
    });
  };

  const onClose = () => {
    setVisible(false);
    form.resetFields();
  };

  const editCurrency = async (value: {
    name: string | undefined;
    symbol: string | undefined;
    is_active: boolean;
  }) => await axiosInstance.put(`/currency/${record?.symbol}/`, value);

  const {
    mutate: mutateEditCurrency,
    isLoading,
    reset,
  } = useMutation(editCurrency, {
    onSuccess: (values: any) => {
      setVisible(false);
      updateMessage(values?.data?.name);
      queryClient.invalidateQueries(`/currency/`);
      queryClient.invalidateQueries(currencyRateBaseUrl);
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const onFinish = () => {
    form.validateFields().then(async (values) => {
      const allData = {
        name: trimString(values?.name),
        symbol: trimString(values?.symbol),
        is_active: values.isActive,
      };
      mutateEditCurrency(allData);
    });
  };

  const handleAfterClose = (value: boolean) => {
    if (value === false) {
      form.resetFields();
      reset();
    }
  };

  return (
    <div>
      <EditMenuItem {...rest} onClick={showDrawer} permission={CURRENCY_M} />

      <Modal
        maskClosable={false}
        title={t("Sales.Product_and_services.Currency.Currency_information")}
        width={isMobile ? "80%" : isTablet ? 400 : 400}
        onCancel={onClose}
        open={visible}
        destroyOnClose
        // afterVisibleChange={handleAfterClose}
        // placement={t("Dir") === "ltr" ? "right" : "left"}
        footer={
          <Row justify="end" align="middle">
            <Col>
              <Space>
                <CancelButton onClick={onClose} />
                <SaveButton onClick={onFinish} loading={isLoading} />
              </Space>
            </Col>
          </Row>
        }
      >
        <Form layout="vertical" hideRequiredMark form={form}>
          <Row>
            <Col span={24}>
              <Form.Item
                name="name"
                label={
                  <span>
                    {t("Form.Name")} <span className="star">*</span>
                  </span>
                }
                rules={[
                  { required: true, message: `${t("Form.Name_required")}` },
                ]}
              >
                <Input autoFocus={true} />
              </Form.Item>
            </Col>
            <Col span={24}>
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
                    whitespace: true,
                    message: `${t(
                      "Sales.Product_and_services.Units.Required_symbol"
                    )}`,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="isActive" valuePropName="checked">
                <Checkbox>
                  {t("Sales.Product_and_services.Currency.Is_active")}
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default EditCurrency;
