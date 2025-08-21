import React from "react";
import AddInvoice from "./Invoice/Invoice";
import { useTranslation } from "react-i18next";
import { SALES_REJECT_INVOICE_LIST } from "../../../constants/routes";
export const RejectSalesInvoice = () => {
  const { t } = useTranslation();
  return (
    <AddInvoice
      title={t("Sales.All_sales.Invoice.Reject_sales_invoice")}
      baseUrl={SALES_REJECT_INVOICE_LIST}
      type="sales_rej"
    />
  );
};
