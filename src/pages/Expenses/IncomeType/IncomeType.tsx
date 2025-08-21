import React from "react";
import { useTranslation } from "react-i18next";
import { INCOME_TYPE_M } from "../../../constants/permissions";
import RootComponent from "../IncomeTypeAndWithDraw/RootComponent";

export const IncomeType = () => {
  const { t } = useTranslation();
  return (
    <RootComponent
      title={t("Expenses.Income.Income_type")}
      baseUrl="/expense_revenue/revenue/"
      addTitle={t("Expenses.Income.Income_type_information")}
      backText={t("Expenses.Income.1")}
      backUrl="/income"
      model={INCOME_TYPE_M}
    />
  );
};

export default IncomeType;
