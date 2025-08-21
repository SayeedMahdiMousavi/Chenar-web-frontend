import React from "react";
import { useTranslation } from "react-i18next";
import InvoicesTable from "./InvoicesTable";
import ReportBody from "../../ReportBody";
import { INVOICES_LIST } from "../../../../constants/routes";
export const invoicesBaseUrl = INVOICES_LIST;
const Invoices = (props) => {
  const { t } = useTranslation();

  return (
    <ReportBody
      title={t("Reports.Invoices")}
      type="warehouse"
      table={<InvoicesTable baseUrl={invoicesBaseUrl} />}
    />
  );
};

export default Invoices;
