import React from "react";
import Transactions from "../../Transactions";
import { useTranslation } from "react-i18next";
import { INCOME_M } from "../../../constants/permissions";
export const RecordIncomes = () => {
  const { t } = useTranslation();
  return (
    <Transactions
      title={t("Expenses.Income.1")}
      baseUrl="/pay_receive_cash/income_cash/"
      backText={t("Expenses.1")}
      backUrl="/expense"
      place="recordIncome"
      modalTitle={t("Expenses.Income.Income_information")}
      model={INCOME_M}
    />
  );
};

export default RecordIncomes;
