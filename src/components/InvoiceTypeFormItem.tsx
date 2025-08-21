import { Form, Select } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { MANI_INVOICES_VALUE } from "../constants";

const { Option } = Select;
export function InvoiceTypeFormItem({
  style,
}: {
  style?: React.CSSProperties;
}) {
  const { t } = useTranslation();
  return (
    <Form.Item name="invoiceType" style={style}>
      <Select
        className="num"
        allowClear
        labelInValue
        placeholder={t("Invoice_type")}
      >
        <Option value="sales">
          {t("Sales.All_sales.Invoice.Sales_invoice")}
        </Option>
        <Option value="sales_rej">
          {t("Sales.All_sales.Invoice.Reject_sales_invoice")}
        </Option>
        <Option value="sales_ord">{t("Sales_order")}</Option>

        <Option value="purchase">
          {t("Sales.All_sales.Invoice.Purchase_invoice")}
        </Option>

        <Option value="purchase_rej">
          {t("Sales.All_sales.Invoice.Reject_purchase_invoice")}
        </Option>
        <Option value="purchase_ord">{t("Purchase_order")}</Option>
        <Option value={MANI_INVOICES_VALUE}>{t("All_posting_invoice")}</Option>
      </Select>
    </Form.Item>
  );
}
