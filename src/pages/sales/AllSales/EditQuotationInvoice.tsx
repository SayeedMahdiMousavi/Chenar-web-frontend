import React from "react";
import EditInvoice from "./Invoice/EditInvoice";
import { useTranslation } from "react-i18next";
import { QUOTATION_INVOICE_LIST } from "../../../constants/routes";
interface IProps {
  setVisible: (value: boolean) => void;
  record: any;
}
export const EditQuotationInvoice = (props: IProps) => {
  const { t } = useTranslation();
  return (
    <EditInvoice
      {...props}
      title={t("Sales.All_sales.Invoice.Edit_quotation_invoice")}
      baseUrl={QUOTATION_INVOICE_LIST}
      type="quotation"
    />
  );
};
