import React from "react";
import AddInvoice from "./Invoice/Invoice";
import { useTranslation } from "react-i18next";
import { PURCHASE_ORDER_INVOICE_LIST } from "../../../constants/routes";
export const AddPurchaseOrder = () => {
  const { t } = useTranslation();
  return (
    <AddInvoice
      title={t("Purchase_order")}
      baseUrl={PURCHASE_ORDER_INVOICE_LIST}
      type="purchase"
    />
  );
};
