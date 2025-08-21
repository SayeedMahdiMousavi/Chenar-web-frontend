import React from "react";
import { useTranslation } from "react-i18next";
import { Layout, Tabs, Typography } from "antd";
import PagHeader from "../SelfComponents/PagHeader";
import IncomeStatementDefault from "./AllReports/IncomeStatement/incomeStatementDefault";

const ReportBody = (props) => {
  const { t } = useTranslation();

  return (
    <Layout>
      <PagHeader
        title={props.title}
        back={true}
        backText={t("Reports.1")}
        backUrl={`/report/${props.type}`}
      />
      {/* <IncomeStatementDefault baseUrl="/accounting_reports/financial/balance/main/default" />

       <IncomeStatementDefault baseUrl="/accounting_reports/financial/balance/main/" /> */}
      {props?.baseUrl === "/accounting_reports/financial/balance/main/" ? (
        <>
          <Tabs defaultActiveKey="1" >
            <Tabs.TabPane tab={t("Reports.Default_Balance")} key="1">
            <IncomeStatementDefault
            baseUrl="/accounting_reports/financial/balance/main/default"
            title={t("Reports.Default_Balance")}
          />
            </Tabs.TabPane>
            <Tabs.TabPane tab={t("Reports.Main_Balance")} key="2">
            <IncomeStatementDefault
            baseUrl="/accounting_reports/financial/balance/main/"
            title={t("Reports.Main_Balance")}
          />
            </Tabs.TabPane>
          </Tabs>
          

          
        </>
      ) : (
        props?.table
      )}

      {/* {props.table} */}
    </Layout>
  );
};

export default ReportBody;
