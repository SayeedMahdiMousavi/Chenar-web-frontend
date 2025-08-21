import { Col, Row, Space, Typography, Form, Input, Button, Card } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fixedNumber, math, print } from "../../Functions/math";
import useGetBaseCurrency from "../../Hooks/useGetBaseCurrency";
import { debounce } from "throttle-debounce";
import { useDarkMode } from "../../Hooks/useDarkMode";
import { InfiniteScrollSelectFormItem } from "../../components/antd";
import { checkPermissions } from "../../Functions";
// import Axios from "axios";
// import { EXCHANGE_CURRENCY_ACCESS_KEY } from "../../constants";
// import { useQuery } from "react-query";
import { SwapIcon } from "../../icons";
import { Colors } from "../colors";

export default function DashboardCurrencyExchange({
  permission,
}: {
  permission: string;
}) {
  const { t } = useTranslation();
  const [mode] = useDarkMode();
  const [form] = Form.useForm();
  const [changeCurrencyText, setChangeCurrencyText] = useState("");
  const [currency, setCurrency] = useState({ currencyRate: 1, name: "" });
  const [calCurrency, setCalCurrency] = useState({ currencyRate: 1, name: "" });


  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyId = baseCurrency?.data?.id;
  const baseCurrencyName = baseCurrency?.data?.symbol;

  useEffect(() => {
    const row = form.getFieldsValue();
    if (
      baseCurrencyName &&
      (row?.currency?.label === undefined ||
        row?.calCurrency?.label === undefined)
    ) {
      // setChangeCurrencyText(`1 ${baseCurrencyName} = 1 ${baseCurrencyName}`);
      setChangeCurrencyText(`1 ${t(`Reports.${baseCurrencyName}`)} = 1 ${t(`Reports.${baseCurrencyName}`)}`);
      form.setFieldsValue({
        currency: {
          value: baseCurrencyId,
          label: t(`Reports.${baseCurrencyName}`),
        },
        calCurrency: {
          value: baseCurrencyId,
          label: t(`Reports.${baseCurrencyName}`),
        },
      });
    }
  }, [baseCurrencyId, baseCurrencyName, form]);

  const handleChangeCurrency = (value: any) => {
    const row = form.getFieldsValue();
   
    const amount = row?.amount;

    const calAmount = fixedNumber(
      //@ts-ignore
      print(
        //@ts-ignore
        math.evaluate(
          `(${amount}*${value?.currencyRate})/ ${calCurrency?.currencyRate}`
        )
      ),
      4
    );
    setCurrency({
      currencyRate: parseFloat(value?.currencyRate.toFixed(4)),
      // name: value?.name,
      name:value?.symbol
    });
    // setChangeCurrencyText(
    //   `${amount} ${value?.name} = ${calAmount} ${row?.calCurrency?.label}`
    // );
    setChangeCurrencyText(
      `${amount} ${t(`Reports.${value?.symbol}`)} = ${calAmount} ${t(`Reports.${value?.symbol}`)}`
    )
    form.setFieldsValue({
      calAmount: calAmount,
    });
  };
  const handleChangeCalCurrency = (value: any) => {
    const row = form.getFieldsValue();
    const amount = row?.amount;

    const calAmount = fixedNumber(
      //@ts-ignore
      print(
        //@ts-ignore
        math.evaluate(
          `(${amount}*${currency?.currencyRate})/ ${value?.currencyRate}`
        )
      ),
      4
    );
    setCalCurrency({
      currencyRate: parseFloat(value?.currencyRate.toFixed(4)),
      // name: value?.name,
      name:value?.symbol
    });
    setChangeCurrencyText(
      `${amount} ${row?.currency?.label} = ${calAmount} ${t(`Reports.${value?.symbol}`)}`
    );

    form.setFieldsValue({
      calAmount: calAmount,
    });
  };

  const onChangeAmount = (e: any) => {
    debounceChangeAmount(e?.target.value);
  };

  const debounceChangeAmount = debounce(500, async (value: string) => {
    const calAmount =
      value === "" || value === null
        ? ""
        : fixedNumber(
            //@ts-ignore
            print(
              //@ts-ignore
              math.evaluate(
                `(${value}*${currency?.currencyRate})/ ${calCurrency?.currencyRate}`
              )
            ),
            4
          );
    form.setFieldsValue({
      calAmount: calAmount,
    });
    setChangeCurrencyText(
      `${value ?? 0} ${currency?.name} = ${calAmount} ${calCurrency?.name}`
    );
  });

  const onChangeCalAmount = (e: any) => {
    debounceChangeCalAmount(e?.target.value);
  };

  const debounceChangeCalAmount = debounce(500, async (value: string) => {
    const amount =
      value === "" || value === null
        ? ""
        : fixedNumber(
            //@ts-ignore
            print(
              //@ts-ignore
              math.evaluate(
                `(${value}*${calCurrency?.currencyRate})/ ${currency?.currencyRate}`
              )
            ),
            4
          );
    form.setFieldsValue({
      amount: amount,
    });
    setChangeCurrencyText(
      `${amount} ${currency?.name} = ${value ?? 0} ${calCurrency?.name}`
    );
  });

  const bordered = mode === "dark" ? true : false;
  const inputClassName = `Input__${mode}--borderLess`;
  return (
    <Card
      className="box"
      size="small"
      hoverable={mode === "dark" ? false : true}
      bodyStyle={{
        padding: "0px",
      }}
      style={{
        ...(baseCurrency?.isLoading ? { padding: '0px' } : {}),
        borderRadius: '10px',
        border: bordered ? '1px solid #303030' : '1px solid #e8e8e8',
        backgroundColor: mode === 'dark' ? Colors.cardBg : Colors.white,
        color: mode === 'dark' ? Colors.white : 'black',
      }}
      loading={baseCurrency?.isLoading}
    >
      {checkPermissions(permission) && (
        <Space direction="vertical" size="middle">
          <Typography.Text strong style={{ color: mode === "dark" ? Colors.white : "black" }}>
            {t("Reports.Exchange_currency")}
          </Typography.Text>
          <Row justify="center">
            <Col>
              <Typography.Text style={{ color: mode === "dark" ? Colors.white : "black" }}> {changeCurrencyText}</Typography.Text>
            </Col>
          </Row>

          <Form
            initialValues={{
              amount: 1,
              calAmount: 1,
            }}
            form={form}
          >
            <Row>
              <Col span={10}>
                <InfiniteScrollSelectFormItem
                  name="currency"
                  placeholder={t(
                    "Sales.Product_and_services.Inventory.Currency"
                  )}
                  style={styles.formItem}
                  fields="name,id,symbol"
                  baseUrl="/currency/active_currency_rate/"
                  onChange={handleChangeCurrency}
                  place="dashboard"
                  rules={[
                    {
                      required: true,
                      message: t(
                        "Sales.Product_and_services.Currency.Currency_required"
                      ),
                    },
                  ]}
                  className={inputClassName}
                  bordered={bordered}
                />
                <InfiniteScrollSelectFormItem
                  name="calCurrency"
                  placeholder={t(
                    "Sales.Product_and_services.Inventory.Currency"
                  )}
                  style={styles.formItem1}
                  fields="name,id,symbol"
                  baseUrl="/currency/active_currency_rate/"
                  onChange={handleChangeCalCurrency}
                  place="dashboard"
                  rules={[
                    {
                      required: true,
                      message: t(
                        "Sales.Product_and_services.Currency.Currency_required"
                      ),
                    },
                  ]}
                  className={inputClassName}
                  bordered={bordered}
                />
              </Col>
              <Col span={4}>
                <Row justify="center" align="middle" style={{ height: "100%" }}>
                  <Col>
                    <Button type="text" shape="circle" icon={<SwapIcon />} />
                  </Col>
                </Row>
              </Col>
              <Col span={10}>
                <Form.Item style={styles.formItem} name="amount">
                  <Input
                    className={inputClassName}
                    bordered={bordered}
                    onChange={onChangeAmount}
                  />
                </Form.Item>
                <Form.Item style={styles.formItem1} name="calAmount">
                  <Input
                    className={inputClassName}
                    bordered={bordered}
                    onChange={onChangeCalAmount}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Space>
      )}
    </Card>
  );
}

const styles = {
  formItem: {
    marginBottom: "10px",
  },
  formItem1: {
    marginBottom: "0px",
  },
};
