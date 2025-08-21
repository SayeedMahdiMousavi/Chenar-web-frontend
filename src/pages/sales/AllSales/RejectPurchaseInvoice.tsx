import React from "react";
import AddInvoice from "./Invoice/Invoice";
import { useTranslation } from "react-i18next";
import { PURCHASE_REJECT_INVOICE_LIST } from "../../../constants/routes";
export const RejectPurchaseInvoice = () => {
  const { t } = useTranslation();
  return (
    <AddInvoice
      title={t("Sales.All_sales.Invoice.Reject_purchase_invoice")}
      baseUrl={PURCHASE_REJECT_INVOICE_LIST}
      type="purchase_rej"
    />
  );
};
