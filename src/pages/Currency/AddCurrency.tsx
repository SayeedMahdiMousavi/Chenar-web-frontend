import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../ApiBaseUrl";
import { Drawer, Form, Col, Row, Input, Checkbox, Space, Modal } from "antd";
import { useMediaQuery } from "../MediaQurey";
import { trimString } from "../../Functions/TrimString";
import { currencyRateBaseUrl } from "./Currency rate/CurrencyRate";
import { CancelButton, PageNewButton, SaveButton } from "../../components";
import { CURRENCY_M } from "../../constants/permissions";
import { addMessage, manageErrors } from "../../Functions";

interface IProps {}
const AddCurrency: React.FC<IProps> = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const isTablet = useMediaQuery("(max-width:768px)");
  const isMobile = useMediaQuery("(max-width:425px)");

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
    form.resetFields();
  };

  const addCurrency = async (value: {
    name: string | undefined;
    symbol: string | undefined;
    is_active: boolean;
  }) => await axiosInstance.post(`/currency/`, value);

  const {
    mutate: mutateAddCurrency,
    isLoading,
    reset,
  } = useMutation(addCurrency, {
    onSuccess: (values: any, { is_active }) => {
      setVisible(false);
      addMessage(values?.data?.name);
      queryClient.invalidateQueries(`/currency/`);
      if (is_active) {
        queryClient.invalidateQueries(currencyRateBaseUrl);
      }
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
      mutateAddCurrency(allData, {
        onSuccess: () => {},
      });
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
      <PageNewButton onClick={showDrawer} model={CURRENCY_M} />
      <Modal
        maskClosable={false}
        title={t("Sales.Product_and_services.Currency.Currency_information")}
        width={isMobile ? "80%" : isTablet ? 400 : 400}
        onCancel={onClose}
        open={visible}
        destroyOnClose
        // afterClose={handleAfterClose}
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
        <Form
          layout="vertical"
          hideRequiredMark
          form={form}
          initialValues={{ isActive: false }}
        >
          <Row>
            <Col span={24}>
              <Form.Item
                name="name"
                label={
                  <p>
                    {t("Form.Name")} <span className="star">*</span>
                  </p>
                }
                rules={[
                  { required: true, message: `${t("Form.Name_required")}` },
                ]}
              >
                <Input autoFocus autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="symbol"
                label={
                  <p>
                    {t("Form.Symbol")} <span className="star">*</span>
                  </p>
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

export default AddCurrency;
