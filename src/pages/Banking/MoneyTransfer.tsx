import React from "react";
import Transactions from "../Transactions";
import { useTranslation } from "react-i18next";
import { MONEY_TRANSFER_M } from "../../constants/permissions";
export const MoneyTransfer = (props: any) => {
  const { t } = useTranslation();

  return (
    <Transactions
      title={t("Banking.Money_transfer")}
      baseUrl="/pay_receive_cash/bank_cash_transfer/"
      backText={
        props.match.params.id === "bank"
          ? t("Banking.1")
          : t("Banking.Cash_box.1")
      }
      backUrl={props.match.params.id === "bank" ? "/bank" : "/cash"}
      place="moneyTransfer"
      modalTitle={t("Banking.Money_transfer_information")}
      model={MONEY_TRANSFER_M}
    />
  );
};

export default MoneyTransfer;
