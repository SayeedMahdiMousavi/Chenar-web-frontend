import React from "react";
import EditInvoice from "./Invoice/EditInvoice";
import { useTranslation } from "react-i18next";
import { PURCHASE_REJECT_INVOICE_LIST } from "../../../constants/routes";
interface IProps {
  setVisible: (value: boolean) => void;
  record: any;
}
export const EditRejectPurchaseInvoice = (props: IProps) => {
  const { t } = useTranslation();
  return (
    <EditInvoice
      {...props}
      title={t("Sales.All_sales.Invoice.Edit_reject_purchase_invoice")}
      baseUrl={PURCHASE_REJECT_INVOICE_LIST}
      type="purchase_rej"
    />
  );
};
