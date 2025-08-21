import React from "react";
import PayAndReceiveTransactions from "../Transactions/PayAndReceiveTransactions";
import { useTranslation } from "react-i18next";
import { CURRENCY_EXCHANGE_M } from "../../constants/permissions";
export const CurrencyExchange = () => {
  const { t } = useTranslation();
  return (
    <PayAndReceiveTransactions
      title={t("Reports.Currency_exchange")}
      baseUrl="/pay_receive_cash/exchange_union/"
      backText={t("Sales.Product_and_services.Currency.Currency_rate")}
      backUrl="currency-rate"
      place="currencyExchange"
      modalTitle=""
      model={CURRENCY_EXCHANGE_M}
    />
  );
};

export default CurrencyExchange;
