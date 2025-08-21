import React from "react";
import AddInvoice from "./Invoice/Invoice";
import { useTranslation } from "react-i18next";
import { SALES_ORDER_INVOICE_LIST } from "../../../constants/routes";
export const AddSalesOrder = () => {
  const { t } = useTranslation();
  return (
    <AddInvoice
      title={t("Sales_order")}
      baseUrl={SALES_ORDER_INVOICE_LIST}
      type="sales"
    />
  );
};
