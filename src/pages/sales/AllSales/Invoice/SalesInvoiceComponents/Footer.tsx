import React, { ReactNode } from "react";

import { Row, Col, Form, InputNumber } from "antd";
import { useTranslation } from "react-i18next";
import InvoiceSummary from "./InvoiceSummary";

interface IProps {
  responseId: boolean;
  globalDiscount: boolean;
  type: string;
  children: ReactNode;
  handleChangeExpense: (value: any, type: any) => void;
  finalAmount: number;
  total: number;
  cashAmount: number;
  discount: number;
  expense: number;
  remainAmount: number;
}

export default function InvoicesFooter({
  responseId,
  type,
  children,
  handleChangeExpense,
  total,
  finalAmount,
  cashAmount,
  expense,
  discount,
  remainAmount,
  globalDiscount,
}: IProps) {
  const { t } = useTranslation();

  const onFocusNumberInput = (e: any) => {
    e.target.select();
  };

  const numberInputReg = /^0/;
  const numberInputReg1 = /^0./;
  const discountFormat = (value: any) => {
    return parseInt(value) > parseInt(`${total}`)
      ? total
      : parseInt(value) < 0
      ? 0
      : numberInputReg1.test(value)
      ? value
      : numberInputReg.test(value)
      ? 0
      : value;
  };

  const expenseFormat = (value: any) =>
    parseInt(value) < 0 ? 0 : numberInputReg.test(value) ? 0 : value;
  return (
    <Row justify="space-between" style={{ marginBottom: "30px" }}>
      <Col style={{ width: "400px" }}>
        <Row gutter={15}>
          <Col span={12}>
            <Form.Item
              name="discount"
              label={t("Sales.Customers.Discount.1")}
              style={styles.totalInput}
            >
              <InputNumber
                min={0}
                formatter={discountFormat}
                parser={discountFormat}
                type="number"
                disabled={globalDiscount}
                onFocus={onFocusNumberInput}
                className="num"
                onChange={(value) => handleChangeExpense(value, "discount")}
                inputMode="numeric"
                readOnly={responseId}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="expense"
              label={t("Expenses.1")}
              style={styles.totalInput}
            >
              <InputNumber
                min={0}
                type="number"
                className="num"
                formatter={expenseFormat}
                onFocus={onFocusNumberInput}
                parser={expenseFormat}
                onChange={(value) => handleChangeExpense(value, "expense")}
                inputMode="numeric"
                readOnly={responseId}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            {children}
            {/* <Form.Item
              name="receiveCash"
              label={
                type === "sales" || type === "purchase_rej"
                  ? t("Receive_cash_from_cash")
                  : t("Pay_cash_from_cash")
              }
              style={styles.totalInput}
              //
            >
              <Input
                className="num"
                readOnly
                allowClear
                suffix={
                  <Space size={8}>
                    {
                      //@ts-ignore
                      children?.[0]
                    }
                    <Button
                      icon={<CloseOutlined />}
                      type="text"
                      onClick={handleDeleteReceiveCash}
                      danger
                      shape="circle"
                      size="small"
                      disabled={responseId}
                    />
                  </Space>
                }
              />
            </Form.Item>
            <Form.Item
              name="receiveCashFromBank"
              label={
                type === "sales" || type === "purchase_rej"
                  ? t("Receive_cash_from_bank")
                  : t("Pay_cash_from_bank")
              }
              style={styles.totalInput}
              //
            >
              <Input
                className="num"
                readOnly
                allowClear
                suffix={
                  <Space size={8}>
                    {
                      //@ts-ignore
                      children?.[1]
                    }
                    <Button
                      icon={<CloseOutlined />}
                      type="text"
                      onClick={handleDeleteReceiveCash}
                      danger
                      shape="circle"
                      size="small"
                      disabled={responseId}
                    />
                  </Space>
                }
              />
            </Form.Item> */}
          </Col>
        </Row>
      </Col>
      <Col style={{ width: "250px" }}>
        <InvoiceSummary
          {...{
            type,
            discount,
            expense,
            total,
            finalAmount,
            cashAmount,
            remainAmount: remainAmount,
          }}
        />
      </Col>
    </Row>
  );
}

interface IStyles {
  totalInput: React.CSSProperties;
}

const styles: IStyles = {
  totalInput: { marginBottom: "10px" },
};
