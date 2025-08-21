import React from "react";
import { useTranslation } from "react-i18next";
import {
  BALANCE_SHEET_LIST,
  DETAIL_BALANCE_LIST,
  EXPIRE_PRODUCTS_LIST,
  FISCAL_YEAR_INCOME_LIST,
  INCOME_STATEMENT_LIST,
  INVOICE_BY_PERSON_LIST,
  INVOICE_BY_PRODUCT_LIST,
  PRODUCT_DEFICITS_LIST,
  PRODUCT_PURCHASE_PRICE_LIST,
  PRODUCT_SALES_PRICE_LIST,
  PRODUCT_STATISTIC_LIST,
  PROFIT_AVERAGE_LIST,
  TRIAL_BALANCE_LIST,
  WAREHOUSE_STATISTIC_LIST,
} from "../../../constants/routes";
import NotFound from "../../Router/NotFound";
import AccountsStatisticsReport from "./AccountsStatistics/AccountsStatistics";
import CurrencyHistory from "./CurrencyHistory/CurrencyHistory";
import DebitAndCreditReport from "./DebitAndCredit/DebitAndCredit";
import ExpensesReport from "./Expenses/Expenses";
import ExpiredProducts from "./ExpiredProducts/ExpiredProducts";
import IncomeStatements from "./IncomeStatement/IncomeStatements";
import IncomingProducts from "./IncomingProducts/IncomingProducts";
import Invoices from "./Invoices/Invoices";
import JournalBook from "./JournalBook/JournalBook";
import ProductProfileAverage from "./ProductProfileAverage/ProductProfileAverage";
import ProductStatistics from "./ProductStatistics/ProductStatistics";
import Sales from "./Sales/Sales";
import TotalSoldByCustomer from "./TotalSoldByCustomer/TotalSoldByCustomer";
import TotalSoledProducts from "./TotalSoledProducts/TotalSoledProducts";
import TrialBalance from "./TrialBalance/TrialBalance";
import WarehouseCartX from "./WarehouseCartX/WarehouseCartX";
import WarehouseStatistics from "./WarehouseStatistics/WarehouseStatistics";

export const cashTransactionsUrl = "/pay_receive_cash/cash_flow/";
export const expireProductsBaseUrl = EXPIRE_PRODUCTS_LIST;
export const productStatisticsBaseUrl = PRODUCT_STATISTIC_LIST;
export default function AllReports(props: any) {
  const { t } = useTranslation();
  return (
    <div>
      {props.match.params.id === "journal" ? (
        <JournalBook
          backText={t("Reports.1")}
          backUrl="/report"
          place="journal"
        />
      ) : props.match.params.id === "sales" ? (
        <Sales />
      ) : props.match.params.id === "invoices" ? (
        <Invoices />
      ) : props.match.params.id === "product-statistics" ? (
        <ProductStatistics
          baseUrl={productStatisticsBaseUrl}
          type="productStatistics"
          title={t("Reports.Product_statistics")}
        />
      ) : props.match.params.id === "product-purchase-price" ? (
        <ProductStatistics
          baseUrl={PRODUCT_PURCHASE_PRICE_LIST}
          type="purchasePrice"
          title={t("Reports.Product_purchases_price")}
        />
      ) : props.match.params.id === "product-sales-price" ? (
        <ProductStatistics
          baseUrl={PRODUCT_SALES_PRICE_LIST}
          type="salesPrice"
          title={t("Reports.Product_sales_price")}
        />
      ) : props.match.params.id === "product-deficits" ? (
        <ProductStatistics
          baseUrl={PRODUCT_DEFICITS_LIST}
          type="productDeficits"
          title={t("Reports.Product_deficits")}
        />
      ) : props.match.params.id === "product-profit-average" ? (
        <ProductProfileAverage
          baseUrl={PROFIT_AVERAGE_LIST}
          type="profitAverage"
          title={t("Reports.Product_profit_average")}
        />
      ) : props.match.params.id === "warehouse-cart-x" ? (
        <WarehouseCartX />
      ) : props.match.params.id === "warehouse-statistics" ? (
        <WarehouseStatistics
          title={t("Reports.Warehouse_statistics")}
          baseUrl={WAREHOUSE_STATISTIC_LIST}
          type="warehouseStatistics"
        />
      ) : props.match.params.id === "expired-products" ? (
        <ExpiredProducts
          title={t("Reports.Expired_products")}
          baseUrl={expireProductsBaseUrl}
          type="expiredProducts"
        />
      ) : props.match.params.id === "total-sold-products" ? (
        <TotalSoledProducts
          title={t("Reports.Total_sold_products")}
          baseUrl={INVOICE_BY_PRODUCT_LIST}
          type="totalSoldProducts"
        />
      ) : props.match.params.id === "total-sold-by-customer" ? (
        <TotalSoldByCustomer
          title={t("Reports.Total_sold_by_customer")}
          baseUrl={INVOICE_BY_PERSON_LIST}
          type="totalSoldByCustomer"
        />
      ) : props.match.params.id === "expenses" ? (
        <ExpensesReport
          title={t("Expenses.1")}
          baseUrl="/pay_receive_cash/expense_cash/"
          place="expenses"
        />
      ) : props.match.params.id === "income" ? (
        <ExpensesReport
          title={t("Expenses.Income.1")}
          baseUrl="/pay_receive_cash/income_cash/"
          place="income"
        />
      ) : props.match.params.id === "money-transfer" ? (
        <ExpensesReport
          title={t("Banking.Money_transfer")}
          baseUrl="/pay_receive_cash/bank_cash_transfer/"
          place="moneyTransfer"
        />
      ) : props.match.params.id === "cash-transactions" ? (
        <ExpensesReport
          title={t("Reports.Cash_transactions")}
          baseUrl={cashTransactionsUrl}
          place="cashTransactions"
        />
      ) : props.match.params.id === "currency-exchange" ? (
        <ExpensesReport
          title={t("Reports.Currency_exchange")}
          baseUrl="/pay_receive_cash/exchange_union/"
          place="currencyExchange"
        />
      ) : props.match.params.id === "currency-history" ? (
        <CurrencyHistory />
      ) : props.match.params.id === "income-statement" ? (
        <IncomeStatements
          title={t("Reports.Income_statement")}
          baseUrl={INCOME_STATEMENT_LIST}
          place="incomeStatement"
        />
      ) : props.match.params.id === "fiscal_periods_income" ? (
        <IncomeStatements
          title={t("Reports.Fiscal_periods_income")}
          baseUrl={FISCAL_YEAR_INCOME_LIST}
          place="fiscalYearIncome"
        />
      ) : props.match.params.id === "balance-sheet" ? (
        <IncomeStatements
          title={t("Reports.Balance_sheet")}
          baseUrl={BALANCE_SHEET_LIST}
          place="balanceSheet"
        />
      ) : props.match.params.id === "trial-balance" ? (
        <TrialBalance
          title={t("Reports.Trial_balance")}
          baseUrl={TRIAL_BALANCE_LIST}
          place="trialBalance"
        />
      ) : props.match.params.id === "detailed-balance" ? (
        <TrialBalance
          title={t("Reports.Detailed_balance")}
          baseUrl={DETAIL_BALANCE_LIST}
          place="detailedBalance"
        />
      ) : props.match.params.id === "debit-credit" ? (
        <DebitAndCreditReport
          title={t("Reports.Debit_and_credit")}
          place="debitCredit"
        />
      ) : props.match.params.id === "incoming-products" ? (
        <IncomingProducts
          title={t("Reports.Incoming_products")}
          baseUrl="/invoice/sales_invoice/"
          type="incoming"
        />
      ) : props.match.params.id === "outgoing-products" ? (
        <IncomingProducts
          title={t("Reports.Outgoing_products")}
          baseUrl="/invoice/sales_invoice/"
          type="outgoing"
        />
      ) : props.match.params.id === "accounts-statistics" ? (
        <AccountsStatisticsReport
          title={t("Reports.Accounts_statistics")}
          type="accountsStatistics"
        />
      ) : (
        <NotFound />
        // <Link to="/report">{t("Reports.1")} </Link>
      )}
    </div>
  );
}
