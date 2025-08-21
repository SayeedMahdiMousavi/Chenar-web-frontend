import React from "react";
import EditInvoice from "./Invoice/EditInvoice";
import { useTranslation } from "react-i18next";
import {
  PURCHASE_INVOICE_LIST,
  PURCHASE_ORDER_INVOICE_LIST,
} from "../../../constants/routes";
interface IProps {
  setVisible: (value: boolean) => void;
  record: any;
  type?: string;
}
export const EditPurchaseInvoice = (props: IProps) => {
  const { t } = useTranslation();
  return (
    <EditInvoice
      {...props}
      title={
        props?.type === "purchaseOrder"
          ? t("Edit_purchase_order")
          : t("Sales.All_sales.Invoice.Edit_purchase_invoice")
      }
      baseUrl={
        props?.type === "purchaseOrder"
          ? PURCHASE_ORDER_INVOICE_LIST
          : PURCHASE_INVOICE_LIST
      }
      type="purchase"
    />
  );
};
