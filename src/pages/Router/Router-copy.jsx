import React, { useState, useLayoutEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { notification } from 'antd';

import LoginPage from '../Login/LoginPage';
import ResetPassword from '../Login/ResetPassword';
import PublicRoute from '../Routes/PublicRoute';
import PrivateRoute from '../Routes/PrivateRoute';

import axiosInstance from '../ApiBaseUrl';

import NotFound from './NotFound';
import {
  APPROVE_CENTER,
  AUDITING_CENTER,
  BACKUP_AUTOMATIC,
  BACKUP_SETTING,
  BANK,
  BRANCH,
  CASH,
  CHART_OF_ACCOUNT,
  CURRENCY,
  CURRENCY_EXCHANGE,
  CURRENCY_RATE,
  CUSTOMER,
  CUSTOMER_CATEGORY,
  CUSTOMER_DETAILS,
  CUSTOMER_PAY_REC,
  CUSTOM_FORM_STYLE,
  DASHBOARD,
  BALANCE,
  EMPLOYEE,
  EMPLOYEE_CATEGORY,
  EMPLOYEE_DETAILS,
  EMPLOYEE_PAY_REC,
  EMPLOYEE_SALARY,
  EXPENSE,
  EXPENSE_CATEGORY,
  EXPENSE_TYPE,
  FISCAL_YEAR,
  INCOME,
  INCOME_TYPE,
  INVOICES,
  MONEY_TRANSFER,
  OPENING_ACCOUNT,
  PRODUCT,
  PRODUCT_CATEGORY,
  PRODUCT_INVENTORY,
  PRODUCT_PRICE,
  PRODUCT_UNIT,
  REPORT,
  REPORT_CHILDE,
  ROLES,
  SUPPLIER,
  SUPPLIER_CATEGORY,
  SUPPLIER_DETAILS,
  SUPPLIER_PAY_REC,
  USER,
  WAREHOUSE,
  WAREHOUSE_ADJUSTMENT,
  WAREHOUSE_PRODUCT_TRANSFER,
  WITHDRAW,
  WITHDRAW_TYPE,
  PARTNERS,
  BANK_TRANSACTION,
} from '../../constants/routes';
import {
  AUDIT_CENTER_PAGE_M,
  BACKUP_SETTINGS_M,
  BANK_PAGE_M,
  BANK_TRANSACTION_PAGE_M,
  BRANCH_PAGE_M,
  CASH_PAGE_M,
  CHART_OF_ACCOUNT_M,
  CURRENCY_EXCHANGE_M,
  CURRENCY_M,
  CURRENCY_PAGE_M,
  CUSTOMER_CATEGORY_M,
  CUSTOMER_M,
  CUSTOMER_PAGE_M,
  CUSTOMER_PAY_REC_M,
  CUSTOM_FORM_STYLE_M,
  DASHBOARD_M,
  EMPLOYEE_CATEGORY_M,
  EMPLOYEE_M,
  EMPLOYEE_PAGE_M,
  EMPLOYEE_PAY_REC_M,
  EXPENSE_CATEGORY_M,
  EXPENSE_PAGE_M,
  EXPENSE_TYPE_PAGE_M,
  FISCAL_YEAR_M,
  INCOME_PAGE_M,
  INCOME_TYPE_M,
  INVOICE_PAGE_M,
  MONEY_TRANSFER_M,
  OPINING_ACCOUNT_M,
  PRODUCT_CATEGORY_M,
  PRODUCT_INVENTORY_M,
  PRODUCT_PAGE_M,
  PRODUCT_PRICE_M,
  PRODUCT_TRANSFER_INVOICE_M,
  PRODUCT_UNIT_M,
  REPORT_M,
  REPORT_P,
  SALES_INVOICE_M,
  SUPPLIER_CATEGORY_M,
  SUPPLIER_M,
  SUPPLIER_PAGE_M,
  SUPPLIER_PAY_REC_M,
  USERS_PAGE_M,
  USER_ROLE_M,
  WAREHOUSE_M,
  WAREHOUSE_PAGE_M,
  WITHDRAW_M,
  WITHDRAW_TYPE_M,
} from '../../constants/permissions';


// a function to retry loading a chunk to avoid chunk load error for out of date code
export const lazyRetry = function (componentImport) {
  return new Promise((resolve, reject) => {
    // try to import the component
    componentImport()
      .then((component) => {
        resolve(component);
      })
      .catch((error) => {
        // TO DO
        reject(error); // there was an error
      });
  });
  
};
const Products = React.lazy(() => lazyRetry(() => import('../sales/Products')));
const AllSales = React.lazy(() => lazyRetry(() => import('../sales/AllSales')));
const Customer = React.lazy(() => lazyRetry(() => import('../sales/Customer')));
const Banking = React.lazy(() => lazyRetry(() => import('../Banking/Bank')));
const BankTransactions = React.lazy(() =>
  lazyRetry(() => import('../Banking/extraBanks/transactions'))
);
const CashBox = React.lazy(() =>
  lazyRetry(() => import('../Banking/CashBox/index'))
);
const Expenses = React.lazy(() =>
  lazyRetry(() => import('../Expenses/Expenses/index'))
);
const Suppliers = React.lazy(() =>
  lazyRetry(() => import('../Expenses/Suppliers'))
);
const ChartsOfAccounts = React.lazy(() =>
  lazyRetry(() => import('../Accounting/ChartsOfAccounts'))
);
const Employees = React.lazy(() => lazyRetry(() => import('../Employees')));
const Partners = React.lazy(() => lazyRetry(() => import('../Partners')));
const Warehouse = React.lazy(() => lazyRetry(() => import('../Warehouse')));
const OpenAccounts = React.lazy(() =>
  lazyRetry(() => import('../OpeningAccounts/OpenAccounts/index'))
);
const RecordExpense = React.lazy(() =>
  lazyRetry(() => import('../Expenses/Expenses/RecordExpense'))
);
const RecordIncomes = React.lazy(() =>
  lazyRetry(() => import('../Expenses/IncomeType/RecordIncomes'))
);
const FinancialPeriod = React.lazy(() =>
  lazyRetry(() => import('../Company/AccountAndSettings/Financial'))
);
const WithDrawPayAndReceiveCash = React.lazy(() =>
  lazyRetry(() => import('../Expenses/WithDraw/WithDrawPayAndReceiveCash'))
);
const Dashboard = React.lazy(() => lazyRetry(() => import('../Dashboard')));
const Journal_book = React.lazy(() =>
  lazyRetry(() => import('../Reports/AllReports/JournalBook/journalBookToday'))
);
const Reports = React.lazy(() => lazyRetry(() => import('../Reports/Reports')));
const CustomerDetails = React.lazy(() =>
  lazyRetry(() => import('../sales/Customers/CustomerDetails'))
);
const Units = React.lazy(() =>
  lazyRetry(() => import('../sales/Products/Units'))
);
const SupplierDetails = React.lazy(() =>
  lazyRetry(() => import('../Expenses/Suppliers/SupplierDetails'))
);
const ManageUsers = React.lazy(() =>
  lazyRetry(() => import('../Settings/ManageUsers/index'))
);
const Inventory = React.lazy(() =>
  lazyRetry(() => import('../OpeningAccounts/Inventory/Inventory'))
);
const Currency = React.lazy(() =>
  lazyRetry(() => import('../Currency/Currency'))
);
const CurrencyRate = React.lazy(() =>
  lazyRetry(() => import('../Currency/Currency rate/CurrencyRate'))
);
const PriceRecording = React.lazy(() =>
  lazyRetry(() => import('../sales/Products/PriceRecording/PriceRecording'))
);
const IncomeType = React.lazy(() =>
  lazyRetry(() => import('../Expenses/IncomeType/IncomeType'))
);
const ProductCategories = React.lazy(() =>
  lazyRetry(() => import('../sales/Products/ProductCategories'))
);
const CustomerCategories = React.lazy(() =>
  lazyRetry(() => import('../sales/Customers/CustomerCategories'))
);
const ExpenseCategories = React.lazy(() =>
  lazyRetry(() => import('../Expenses/Expenses/ExpenseCategories'))
);
const SupplierCategories = React.lazy(() =>
  lazyRetry(() => import('../Expenses/Suppliers/SupplierCategories'))
);
const EmployeeCategories = React.lazy(() =>
  lazyRetry(() => import('../Employees/EmployeeCategories'))
);
const WithDraw = React.lazy(() =>
  lazyRetry(() => import('../Expenses/WithDraw/WithDraw'))
);
const RecordSalaries = React.lazy(() =>
  lazyRetry(() => import('../Employees/RecordSalaries'))
);
const MoneyTransfer = React.lazy(() =>
  lazyRetry(() => import('../Banking/MoneyTransfer'))
);
const EmployeePayAndReceiveCash = React.lazy(() =>
  lazyRetry(() => import('../Employees/EmployeePayAndReceiveCash'))
);
const CustomerPayAndReceiveCash = React.lazy(() =>
  lazyRetry(() => import('../sales/Customers/CustomerPayAndReceiveCash'))
);
const SupplierPayAndReceiveCash = React.lazy(() =>
  lazyRetry(() => import('../Expenses/Suppliers/SupplierPayAndReceiveCash'))
);
const Backup = React.lazy(() =>
  lazyRetry(() => import('../Company/AccountAndSettings/Backup/index'))
);
const AllReports = React.lazy(() =>
  lazyRetry(() => import('../Reports/AllReports/AllReports'))
);
const ApproveCenter = React.lazy(() =>
  lazyRetry(() => import('../ApproveCenter'))
);
const Auditing = React.lazy(() => lazyRetry(() => import('../Auditing')));
const CurrencyExchange = React.lazy(() =>
  lazyRetry(() => import('../Currency/CurrencyExchange'))
);
const WarehouseAdjustment = React.lazy(() =>
  lazyRetry(() => import('../Warehouse/WarehouseAdjustment'))
);
const CompanyBranch = React.lazy(() =>
  lazyRetry(() => import('../CompanyBranch'))
);
const OnlineDriveSettings = React.lazy(() =>
  lazyRetry(() => import('../Backup/OnlineDriveSettings'))
);
const AutomaticBackup = React.lazy(() =>
  lazyRetry(() => import('../Backup/AutomaticBackup'))
);
const Roles = React.lazy(() => lazyRetry(() => import('../Roles')));
const ProductTransfer = React.lazy(() =>
  lazyRetry(() => import('../sales/AllSales/ProductTransfer'))
);
const EmployeeDetails = React.lazy(() =>
  lazyRetry(() => import('../Employees/EmployeeDetails'))
);
const CustomFormStyles = React.lazy(() =>
  lazyRetry(() => import('../CustomFormStyles'))
);
const AddCompany = React.lazy(() =>
  lazyRetry(() => import('../Company/Addcompany'))
);
const ForgetPassword = React.lazy(() =>
  lazyRetry(() =>
    import(/* webpackChunkName: "group" */ '../Login/ForgetPassword')
  )
);

const Routers = () => {
  const { i18n } = useTranslation();
  const [userName] = useState(() => window.localStorage.getItem('user_id'));

  const changeLanguage = React.useCallback(async () => {
    if (userName) {
      const result = await axiosInstance.get(
        `/user_account/${userName}/user_profile/${userName}/?expand=*&fields=user_language,user_theme`
      );

      await i18n.changeLanguage(`${result?.data?.user_language?.symbol}`);
    }
  }, [userName]);

  useLayoutEffect(() => {
    changeLanguage();
  }, [changeLanguage]);

  const internet = () => {
    if (navigator.onLine) {
      // props.internet(true);
      const args = {
        message: 'Internet is coming back',
        description: 'Please refresh your browser',
        duration: 6,
        key: 1,
        zIndex: 10000,
      };

      notification['success'](args);
      notification.close(2);
    } else {
      // props.internet(false);
      notification.close(1);
      const args = {
        message: 'No internet access ',
        description: 'Please check your connection',
        duration: 6,
        maxCount: 1,
        key: 2,
        zIndex: 10000,
      };
      notification['error'](args);
    }
  };

  window.addEventListener('online', internet);
  window.addEventListener('offline', internet);

  const privetRoutes = useMemo(
    () => [
      {
        path: DASHBOARD,
        component: Dashboard,
        model: DASHBOARD_M,
      },
      {
        path: BALANCE,
        component: Journal_book,
        model: DASHBOARD_M,
        // model:""
      },
      {
        path: WAREHOUSE,
        component: Warehouse,
        model: WAREHOUSE_PAGE_M,
      },
      {
        path: WAREHOUSE_ADJUSTMENT,
        component: WarehouseAdjustment,
        model: WAREHOUSE_M,
      },
      {
        path: WAREHOUSE_PRODUCT_TRANSFER,
        component: ProductTransfer,
        model: PRODUCT_TRANSFER_INVOICE_M,
      },
      {
        path: `${MONEY_TRANSFER}/:id`,
        component: MoneyTransfer,
        model: MONEY_TRANSFER_M,
      },
      {
        path: BANK,
        component: Banking,
        model: BANK_PAGE_M,
      },
      {
        path: CASH,
        component: CashBox,
        model: CASH_PAGE_M,
      },
      {
        path: BANK_TRANSACTION,
        component: BankTransactions,
        model: BANK_TRANSACTION_PAGE_M,
      },
    ],
    []
  );

  return (
    <div style={{ overflowY: 'hidden' }}>
      <BrowserRouter>
        <Routes>
          <PublicRoute path='/' exact component={() => <LoginPage />} />
          <PublicRoute
            exact
            path='/index.html'
            component={() => <LoginPage />}
          />
          <PublicRoute path='/company' exact component={AddCompany} />
          <PublicRoute path='/reset' exact component={ForgetPassword} />
          <PublicRoute path='/forget/:id' exact component={ResetPassword} />


          {privetRoutes?.map((item) => {
            return (
              <PrivateRoute
                key={item?.path}
                path={item?.path}
                component={item?.component}
                model={item?.model}
              />
            );
          })}


          <PrivateRoute
            path={INVOICES}
            component={AllSales}
            model={INVOICE_PAGE_M}
          />

          <PrivateRoute
            model={CUSTOMER_PAGE_M}
            path={CUSTOMER}
            component={Customer}
          />
          <PrivateRoute
            path={`${CUSTOMER_DETAILS}/:id`}
            model={CUSTOMER_M}
            component={CustomerDetails}
          />

          <PrivateRoute
            path={CUSTOMER_PAY_REC}
            model={CUSTOMER_PAY_REC_M}
            component={CustomerPayAndReceiveCash}
          />

          <PrivateRoute
            path={CUSTOMER_CATEGORY}
            model={CUSTOMER_CATEGORY_M}
            component={CustomerCategories}
          />


          <PrivateRoute
            path={PRODUCT}
            model={PRODUCT_PAGE_M}
            component={Products}
          />

          <PrivateRoute
            path={PRODUCT_PRICE}
            model={PRODUCT_PRICE_M}
            component={PriceRecording}
          />

          <PrivateRoute
            path={PRODUCT_INVENTORY}
            model={PRODUCT_INVENTORY_M}
            component={Inventory}
          />

          <PrivateRoute
            path={PRODUCT_CATEGORY}
            model={PRODUCT_CATEGORY_M}
            component={ProductCategories}
          />

          <PrivateRoute
            path={PRODUCT_UNIT}
            model={PRODUCT_UNIT_M}
            component={Units}
          />

          <PrivateRoute
            path={CURRENCY}
            model={CURRENCY_M}
            component={Currency}
          />

          <PrivateRoute
            path={CURRENCY_RATE}
            model={CURRENCY_PAGE_M}
            component={CurrencyRate}
          />

          <PrivateRoute
            path={CURRENCY_EXCHANGE}
            model={CURRENCY_EXCHANGE_M}
            component={CurrencyExchange}
          />


          <PrivateRoute
            path={EXPENSE}
            model={EXPENSE_PAGE_M}
            component={RecordExpense}
          />

          <PrivateRoute
            path={EXPENSE_TYPE}
            model={EXPENSE_TYPE_PAGE_M}
            component={Expenses}
          />

          <PrivateRoute
            path={EXPENSE_CATEGORY}
            model={EXPENSE_CATEGORY_M}
            component={ExpenseCategories}
          />

          <PrivateRoute
            path={INCOME}
            model={INCOME_PAGE_M}
            component={RecordIncomes}
          />

          <PrivateRoute
            path={INCOME_TYPE}
            model={INCOME_TYPE_M}
            component={IncomeType}
          />

          <PrivateRoute
            path={WITHDRAW}
            model={WITHDRAW_M}
            component={WithDrawPayAndReceiveCash}
          />

          <PrivateRoute
            path={WITHDRAW_TYPE}
            model={WITHDRAW_TYPE_M}
            component={WithDraw}
          />

          <PrivateRoute
            path={SUPPLIER}
            model={SUPPLIER_PAGE_M}
            component={Suppliers}
          />
          <PrivateRoute
            path={`${SUPPLIER_DETAILS}/:id`}
            model={SUPPLIER_M}
            component={SupplierDetails}
          />
          <PrivateRoute
            path={SUPPLIER_PAY_REC}
            component={SupplierPayAndReceiveCash}
            model={SUPPLIER_PAY_REC_M}
          />

          <PrivateRoute
            path={SUPPLIER_CATEGORY}
            component={SupplierCategories}
            model={SUPPLIER_CATEGORY_M}
          />

          <PrivateRoute
            path={PARTNERS}
            model={EMPLOYEE_PAGE_M}
            component={Partners}
          />
          <PrivateRoute
            path={EMPLOYEE}
            model={EMPLOYEE_PAGE_M}
            component={Employees}
          />

          <PrivateRoute
            path={EMPLOYEE_SALARY}
            model={EMPLOYEE_M}
            component={RecordSalaries}
          />
          <PrivateRoute
            path={`${EMPLOYEE_DETAILS}/:id`}
            model={EMPLOYEE_M}
            component={EmployeeDetails}
          />

          <PrivateRoute
            path={EMPLOYEE_PAY_REC}
            model={EMPLOYEE_PAY_REC_M}
            component={EmployeePayAndReceiveCash}
          />

          <PrivateRoute
            path={EMPLOYEE_CATEGORY}
            model={EMPLOYEE_CATEGORY_M}
            component={EmployeeCategories}
          />

          <PrivateRoute
            path={`${REPORT}/:id`}
            model={REPORT_M}
            permission={REPORT_P}
            component={Reports}
          />

          <PrivateRoute
            path={`${REPORT_CHILDE}/:id`}
            model={REPORT_M}
            permission={REPORT_P}
            component={AllReports}
          />

          <PrivateRoute path='/backup' model={BANK_PAGE_M} component={Backup} />

          <PrivateRoute
            path={BACKUP_SETTING}
            model={BACKUP_SETTINGS_M}
            component={OnlineDriveSettings}
          />

          <PrivateRoute
            path={BACKUP_AUTOMATIC}
            model={BACKUP_SETTINGS_M}
            component={AutomaticBackup}
          />

          <PrivateRoute
            path={BRANCH}
            component={CompanyBranch}
            model={BRANCH_PAGE_M}
          />

          <PrivateRoute
            path={USER}
            model={USERS_PAGE_M}
            component={ManageUsers}
          />

          <PrivateRoute path={ROLES} model={USER_ROLE_M} component={Roles} />

          <PrivateRoute
            path={CUSTOM_FORM_STYLE}
            model={CUSTOM_FORM_STYLE_M}
            component={CustomFormStyles}
          />

          <PrivateRoute
            path={CHART_OF_ACCOUNT}
            model={CHART_OF_ACCOUNT_M}
            component={ChartsOfAccounts}
          />

          <PrivateRoute
            path={OPENING_ACCOUNT}
            model={OPINING_ACCOUNT_M}
            component={OpenAccounts}
          />

          <PrivateRoute
            path={FISCAL_YEAR}
            model={FISCAL_YEAR_M}
            component={FinancialPeriod}
          />

          <PrivateRoute
            path={APPROVE_CENTER}
            model={SALES_INVOICE_M}
            component={ApproveCenter}
          />

          <PrivateRoute
            path={AUDITING_CENTER}
            model={AUDIT_CENTER_PAGE_M}
            component={Auditing}
          />
     
          <Route component={NotFound} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Routers;
