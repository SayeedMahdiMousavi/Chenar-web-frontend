import React, { Fragment, useState } from "react";
import { Col, Divider, Row, Form, Select, Input } from "antd";
import { CurrencyProperties } from "../Transactions/Components/CurrencyProperties";
import { DatePickerFormItem } from "../SelfComponents/JalaliAntdComponents/DatePickerFormItem";
import { useTranslation } from "react-i18next";

interface IProps {
  form: any;
  baseCurrencyId: number;
  type: "bank" | "cash" | "customer";
}

const { Option } = Select;
export default function BankCashOpenAccount({
  form,
  baseCurrencyId,
  type,
}: IProps) {
  const [currencyValue, setCurrencyValue] = useState<number>(1);
  const { t } = useTranslation();

  React.useEffect(() => {
    setCurrencyValue(baseCurrencyId);
  }, [baseCurrencyId]);

  const orientation = t("Dir") === "ltr" ? "left" : "right";
  const selectBefore = (
    <Form.Item name="transactionType" noStyle>
      <Select style={{ width: 85 }}>
        <Option value="debit">{t("Opening_accounts.Debit")}</Option>
        <Option value="credit">{t("Opening_accounts.Credit")}</Option>
      </Select>
    </Form.Item>
  );
  return (
    <Fragment>
      {type !== "customer" && (
        <Divider orientation={orientation}>{t("Opening_account")}</Divider>
      )}
      <Row gutter={10}>
        <Col span={12}>
          <Form.Item
            name="amount"

            // rules={[
            //   {
            //     required: credit === "" ? true : false,
            //     message: t("Opening_accounts.Debit_required"),
            //   },
            // ]}
          >
            <Input
              addonBefore={type !== "bank" && selectBefore}
              type="number"
              className="num"
              inputMode="numeric"
              placeholder={
                type === "bank"
                  ? t("Opening_accounts.Debit")
                  : t("Sales.Customers.Form.Amount")
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <DatePickerFormItem
            placeholder={t("Sales.Customers.Form.Date")}
            name="date"
            label=""
            showTime={true}
            format="YYYY-MM-DD HH:mm"
            rules={[{ type: "object" }]}
            style={{}}
          />
        </Col>
        <Col span={24}>
          <CurrencyProperties
            currencyValue={currencyValue}
            setCurrencyValue={setCurrencyValue}
            form={form}
            type="openAccount"
          />
        </Col>
      </Row>
    </Fragment>
  );
}
