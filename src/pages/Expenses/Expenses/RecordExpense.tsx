import React from "react";
import Transactions from "../../Transactions";
import { useTranslation } from "react-i18next";
import { EXPENSE_M } from "../../../constants/permissions";
export const RecordExpense = () => {
  const { t } = useTranslation();
  return (
    <Transactions
      title={t("Expenses.1")}
      baseUrl="/pay_receive_cash/expense_cash/"
      backText={t("Expenses.1")}
      backUrl="/expense"
      place="recordExpense"
      modalTitle={t("Expenses.Expenses_information")}
      model={EXPENSE_M}
    />
  );
};

export default RecordExpense;
