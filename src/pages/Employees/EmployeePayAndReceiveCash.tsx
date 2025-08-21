import React from "react";
import PayAndReceiveTransactions from "../Transactions/PayAndReceiveTransactions";
import { useTranslation } from "react-i18next";
import { EMPLOYEE_PAY_REC_M } from "../../constants/permissions";
export const EmployeePayAndReceiveCash = () => {
  const { t } = useTranslation();
  return (
    <PayAndReceiveTransactions
      title={t("Employees.Pay_and_receive_cash")}
      baseUrl="/pay_receive_cash/staff/"
      backText={t("Employees.1")}
      backUrl="/employee"
      place="employeePayAndRecCash"
      modalTitle=""
      model={EMPLOYEE_PAY_REC_M}
    />
  );
};

export default EmployeePayAndReceiveCash;
