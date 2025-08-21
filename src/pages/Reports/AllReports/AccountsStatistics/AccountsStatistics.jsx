import React from "react";
import AccountsStatisticsTable from "./AccountsStatisticsTable";
import ReportBody from "../../ReportBody";
import { ACCOUNT_STATISTIC_LIST } from "../../../../constants/routes";

export const accountStatisticsUrl = ACCOUNT_STATISTIC_LIST;
const AccountsStatisticsReport = (props) => {
  return (
    <ReportBody
      title={props.title}
      type="financial"
      table={
        <AccountsStatisticsTable
          baseUrl={accountStatisticsUrl}
          place={props.place}
          title={props.title}
        />
      }
    />
  );
};

export default AccountsStatisticsReport;
