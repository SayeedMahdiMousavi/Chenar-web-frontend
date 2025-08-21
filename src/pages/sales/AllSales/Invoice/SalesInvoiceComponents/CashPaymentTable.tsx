import { Table, Typography } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { Statistics } from "../../../../../components/antd";

export default function CashPaymentTable({
  dataSource,
  type,
}: {
  dataSource: any[];
  type: string;
}) {
  const { t } = useTranslation();

  const columns = [
    {
      title: t("Table.Row").toUpperCase(),
      dataIndex: "serial",
      align: "center",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: t("Sales.Customers.Form.Amount"),
      dataIndex: "currencySymbol",
      render: (value: any, record: any) => (
        <>
          <Statistics
            value={record?.amount}
            suffix={value}
            className="invoiceStatistic"
          />{" "}
          {record?.currency?.value !== record?.currency_calc?.value && (
            <>
              {" "}
              {t("Equivalent")}{" "}
              <Statistics
                value={record?.amount_calc}
                suffix={record?.calCurrencySymbol}
                className="invoiceStatistic"
              />
            </>
          )}
        </>
      ),
    },

    {
      title: t("Bank_or_cash"),
      dataIndex: "bank",
    },
  ];

  return (
    <>
      <Typography.Title level={5}>
        {type === "sales" || type === "purchase_rej"
          ? t("Cash_receivements")
          : t("Cash_payments")}
      </Typography.Title>

      <Table
        pagination={false}
        size="small"
        // showHeader={false}
        dataSource={dataSource}
        rowKey={(record) => record?.key}
        bordered
        //@ts-ignore
        columns={columns}
      />
    </>
  );
}
