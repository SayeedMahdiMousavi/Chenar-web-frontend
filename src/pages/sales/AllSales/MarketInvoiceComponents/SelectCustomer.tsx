import React, { useState } from "react";
import { Col, Row, Button, Checkbox, message } from "antd";
import { useMediaQuery } from "../../../MediaQurey";
import { Form, InputNumber } from "antd";
import { useTranslation } from "react-i18next";
import { UserOutlined } from "@ant-design/icons";
import {
  CancelButton,
  DraggableModal,
  SaveButton,
} from "../../../../components";
import { InfiniteScrollSelectFormItem } from "../../../../components/antd";
import { EmployeeAndCustomerAndSupplierChart } from "../../../Transactions/Components/EmployeeAndCustomerAndSupplierChart";

interface IProps {
  responseId: boolean;
  setInvoiceHeader: (value: any) => void;
  invoiceHeader: any;
  totalPrice: number;
  form: any;
}
const SelectCustomer: React.FC<IProps> = ({
  responseId,
  setInvoiceHeader,
  invoiceHeader,
  totalPrice,
  form: invoiceForm,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const isTablet = useMediaQuery("(max-width: 768px)");
  const isMobile = useMediaQuery("(max-width: 425px)");
  const [debit, setDebit] = useState(false);

  const showModal = () => {
    setIsShowModal({
      visible: true,
    });
    setDebit(invoiceHeader?.customer ? invoiceHeader?.debit : false);
    form.setFieldsValue(
      Boolean(invoiceHeader?.customer) ? invoiceHeader : { amount: totalPrice }
    );
  };

  const handelCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };

  const handleOk = () => {
    form.validateFields().then(async ({ customer, amount, debit }) => {
      if (parseFloat(amount) > totalPrice) {
        message.error(t("Invoice_pos_pay_cash_error_message"));
      } else {
        setInvoiceHeader({ customer, amount, debit });
        invoiceForm.setFieldsValue({ payCash: amount });
        setIsShowModal({
          visible: false,
        });
      }
    });
  };

  const onFocusNumberInput = (e: any) => {
    e.target.select();
  };

  const handleAfterClose = () => {
    form.resetFields();
  };

  const handleChangeDebit = (e: any) => {
    setDebit(e.target.checked);
    form.setFieldsValue({ amount: 0 });
  };

  return (
    <div>
      <Button
        type="primary"
        shape="round"
        style={{
          boxShadow: "0px 0px 5px -2px rgba(255,255,255,1)",
        }}
        icon={<UserOutlined />}
        onClick={showModal}
        disabled={responseId}
      />
      <DraggableModal
        title={t("Customer_and_payment")}
        open={isShowModal.visible}
        onCancel={handelCancel}
        width={isMobile ? "100%" : isTablet ? "340px" : "340px"}
        maskClosable={false}
        afterClose={handleAfterClose}
        footer={
          <Row justify="end" align="middle">
            <Col>
              <CancelButton onClick={handelCancel} />
              <SaveButton onClick={handleOk} />
            </Col>
          </Row>
        }
      >
        <Form
          form={form}
          hideRequiredMark={true}
          scrollToFirstError={true}
          layout="vertical"
          initialValues={{ debit: false }}
        >
          <EmployeeAndCustomerAndSupplierChart
            name="customer"
            form={form}
            placeholder=""
            label={t("Sales.All_sales.Invoice.Customer_name")}
            rules={[
              {
                required: true,
                message: t("Sales.All_sales.Invoice.Customer_name_required"),
              },
            ]}
          />
          {/* <InfiniteScrollSelectFormItem
            name="customer"
            label={t("Sales.All_sales.Invoice.Customer_name")}
            baseUrl="/customer_account/customer/"
            fields="id,full_name"
            rules={[
              {
                required: true,
                message: t("Sales.All_sales.Invoice.Customer_name_required"),
              },
            ]}
          /> */}

          <Form.Item name="amount" label={t("Sales.Customers.Form.Amount")}>
            <InputNumber
              min={0}
              type="number"
              className="num"
              onFocus={onFocusNumberInput}
              inputMode="numeric"
              disabled={debit}
            />
          </Form.Item>
          <Form.Item name="debit" valuePropName="checked">
            <Checkbox onChange={handleChangeDebit}>
              {t("Opening_accounts.Debit")}
            </Checkbox>
          </Form.Item>
        </Form>
      </DraggableModal>
    </div>
  );
};

export default SelectCustomer;
