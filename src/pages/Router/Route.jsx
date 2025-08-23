import React, { useState, useLayoutEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import LoginPage from '../Login/LoginPage';
import ResetPassword from '../Login/ResetPassword';
import PublicRoute from '../Routes/PublicRoute';
import PrivateRoute from '../Routes/PrivateRoute';

import axiosInstance from '../ApiBaseUrl';
import { notification } from 'antd';

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
  lazyRetry(() => import('../Banking/extraBanks/transactions')),
);
const CashBox = React.lazy(() =>
  lazyRetry(() => import('../Banking/CashBox/index')),
);
const Expenses = React.lazy(() =>
  lazyRetry(() => import('../Expenses/Expenses/index')),
);
const Suppliers = React.lazy(() =>
  lazyRetry(() => import('../Expenses/Suppliers')),
);
const ChartsOfAccounts = React.lazy(() =>
  lazyRetry(() => import('../Accounting/ChartsOfAccounts')),
);
const Employees = React.lazy(() => lazyRetry(() => import('../Employees')));
const Partners = React.lazy(() => lazyRetry(() => import('../Partners')));
const Warehouse = React.lazy(() => lazyRetry(() => import('../Warehouse')));
const OpenAccounts = React.lazy(() =>
  lazyRetry(() => import('../OpeningAccounts/OpenAccounts/index')),
);
const RecordExpense = React.lazy(() =>
  lazyRetry(() => import('../Expenses/Expenses/RecordExpense')),
);
const RecordIncomes = React.lazy(() =>
  lazyRetry(() => import('../Expenses/IncomeType/RecordIncomes')),
);
const FinancialPeriod = React.lazy(() =>
  lazyRetry(() => import('../Company/AccountAndSettings/Financial')),
);
const WithDrawPayAndReceiveCash = React.lazy(() =>
  lazyRetry(() => import('../Expenses/WithDraw/WithDrawPayAndReceiveCash')),
);
const Dashboard = React.lazy(() => lazyRetry(() => import('../Dashboard')));
const Journal_book = React.lazy(() =>
  lazyRetry(() => import('../Reports/AllReports/JournalBook/journalBookToday')),
);
const Reports = React.lazy(() => lazyRetry(() => import('../Reports/Reports')));
const CustomerDetails = React.lazy(() =>
  lazyRetry(() => import('../sales/Customers/CustomerDetails')),
);
const Units = React.lazy(() =>
  lazyRetry(() => import('../sales/Products/Units')),
);
const SupplierDetails = React.lazy(() =>
  lazyRetry(() => import('../Expenses/Suppliers/SupplierDetails')),
);
const ManageUsers = React.lazy(() =>
  lazyRetry(() => import('../Settings/ManageUsers/index')),
);
const Inventory = React.lazy(() =>
  lazyRetry(() => import('../OpeningAccounts/Inventory/Inventory')),
);
const Currency = React.lazy(() =>
  lazyRetry(() => import('../Currency/Currency')),
);
const CurrencyRate = React.lazy(() =>
  lazyRetry(() => import('../Currency/Currency rate/CurrencyRate')),
);
const PriceRecording = React.lazy(() =>
  lazyRetry(() => import('../sales/Products/PriceRecording/PriceRecording')),
);
const IncomeType = React.lazy(() =>
  lazyRetry(() => import('../Expenses/IncomeType/IncomeType')),
);
const ProductCategories = React.lazy(() =>
  lazyRetry(() => import('../sales/Products/ProductCategories')),
);
const CustomerCategories = React.lazy(() =>
  lazyRetry(() => import('../sales/Customers/CustomerCategories')),
);
const ExpenseCategories = React.lazy(() =>
  lazyRetry(() => import('../Expenses/Expenses/ExpenseCategories')),
);
const SupplierCategories = React.lazy(() =>
  lazyRetry(() => import('../Expenses/Suppliers/SupplierCategories')),
);
const EmployeeCategories = React.lazy(() =>
  lazyRetry(() => import('../Employees/EmployeeCategories')),
);
const WithDraw = React.lazy(() =>
  lazyRetry(() => import('../Expenses/WithDraw/WithDraw')),
);
const RecordSalaries = React.lazy(() =>
  lazyRetry(() => import('../Employees/RecordSalaries')),
);
const MoneyTransfer = React.lazy(() =>
  lazyRetry(() => import('../Banking/MoneyTransfer')),
);
const EmployeePayAndReceiveCash = React.lazy(() =>
  lazyRetry(() => import('../Employees/EmployeePayAndReceiveCash')),
);
const CustomerPayAndReceiveCash = React.lazy(() =>
  lazyRetry(() => import('../sales/Customers/CustomerPayAndReceiveCash')),
);
const SupplierPayAndReceiveCash = React.lazy(() =>
  lazyRetry(() => import('../Expenses/Suppliers/SupplierPayAndReceiveCash')),
);
const Backup = React.lazy(() =>
  lazyRetry(() => import('../Company/AccountAndSettings/Backup/index')),
);
const AllReports = React.lazy(() =>
  lazyRetry(() => import('../Reports/AllReports/AllReports')),
);
const ApproveCenter = React.lazy(() =>
  lazyRetry(() => import('../ApproveCenter')),
);
const Auditing = React.lazy(() => lazyRetry(() => import('../Auditing')));
const CurrencyExchange = React.lazy(() =>
  lazyRetry(() => import('../Currency/CurrencyExchange')),
);
const WarehouseAdjustment = React.lazy(() =>
  lazyRetry(() => import('../Warehouse/WarehouseAdjustment')),
);
const CompanyBranch = React.lazy(() =>
  lazyRetry(() => import('../CompanyBranch')),
);
const OnlineDriveSettings = React.lazy(() =>
  lazyRetry(() => import('../Backup/OnlineDriveSettings')),
);
const AutomaticBackup = React.lazy(() =>
  lazyRetry(() => import('../Backup/AutomaticBackup')),
);
const Roles = React.lazy(() => lazyRetry(() => import('../Roles')));
const ProductTransfer = React.lazy(() =>
  lazyRetry(() => import('../sales/AllSales/ProductTransfer')),
);
const EmployeeDetails = React.lazy(() =>
  lazyRetry(() => import('../Employees/EmployeeDetails')),
);
const CustomFormStyles = React.lazy(() =>
  lazyRetry(() => import('../CustomFormStyles')),
);
const AddCompany = React.lazy(() =>
  lazyRetry(() => import('../Company/Addcompany')),
);
const ForgetPassword = React.lazy(() =>
  lazyRetry(
    () => import(/* webpackChunkName: "group" */ '../Login/ForgetPassword'),
  ),
);

const Routers = () => {
  const { i18n } = useTranslation();
  const [userName] = useState(() => window.localStorage.getItem('user_id'));

  const changeLanguage = React.useCallback(async () => {
    if (userName) {
      const result = await axiosInstance.get(
        `/user_account/user_profile/${userName}/?expand=*&fields=user_language,user_theme`,
      );
      await i18n.changeLanguage(result?.data?.user_language?.symbol || 'en');
    }
  }, [userName]);

  useLayoutEffect(() => {
    changeLanguage();
  }, [changeLanguage]);

  const internet = () => {
    if (navigator.onLine) {
      notification.success({
        message: 'Internet is coming back',
        description: 'Please refresh your browser',
        duration: 6,
        key: 1,
        zIndex: 10000,
      });
      notification.close(2);
    } else {
      notification.close(1);
      notification.error({
        message: 'No internet access',
        description: 'Please check your connection',
        duration: 6,
        maxCount: 1,
        key: 2,
        zIndex: 10000,
      });
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
      {
        path: INVOICES,
        component: AllSales,
        model: INVOICE_PAGE_M,
      },
      {
        path: CUSTOMER,
        component: Customer,
        model: CUSTOMER_PAGE_M,
      },
      {
        path: `${CUSTOMER_DETAILS}/:id`,
        component: CustomerDetails,
        model: CUSTOMER_M,
      },
      {
        path: CUSTOMER_PAY_REC,
        component: CustomerPayAndReceiveCash,
        model: CUSTOMER_PAY_REC_M,
      },
      {
        path: CUSTOMER_CATEGORY,
        component: CustomerCategories,
        model: CUSTOMER_CATEGORY_M,
      },
      {
        path: PRODUCT,
        component: Products,
        model: PRODUCT_PAGE_M,
      },
      {
        path: PRODUCT_PRICE,
        component: PriceRecording,
        model: PRODUCT_PRICE_M,
      },
      {
        path: PRODUCT_INVENTORY,
        component: Inventory,
        model: PRODUCT_INVENTORY_M,
      },
      {
        path: PRODUCT_CATEGORY,
        component: ProductCategories,
        model: PRODUCT_CATEGORY_M,
      },
      {
        path: PRODUCT_UNIT,
        component: Units,
        model: PRODUCT_UNIT_M,
      },
      {
        path: CURRENCY,
        component: Currency,
        model: CURRENCY_M,
      },
      {
        path: CURRENCY_RATE,
        component: CurrencyRate,
        model: CURRENCY_PAGE_M,
      },
      {
        path: CURRENCY_EXCHANGE,
        component: CurrencyExchange,
        model: CURRENCY_EXCHANGE_M,
      },
      {
        path: EXPENSE,
        component: RecordExpense,
        model: EXPENSE_PAGE_M,
      },
      {
        path: EXPENSE_TYPE,
        component: Expenses,
        model: EXPENSE_TYPE_PAGE_M,
      },
      {
        path: EXPENSE_CATEGORY,
        component: ExpenseCategories,
        model: EXPENSE_CATEGORY_M,
      },
      {
        path: INCOME,
        component: RecordIncomes,
        model: INCOME_PAGE_M,
      },
      {
        path: INCOME_TYPE,
        component: IncomeType,
        model: INCOME_TYPE_M,
      },
      {
        path: WITHDRAW,
        component: WithDrawPayAndReceiveCash,
        model: WITHDRAW_M,
      },
      {
        path: WITHDRAW_TYPE,
        component: WithDraw,
        model: WITHDRAW_TYPE_M,
      },
      {
        path: SUPPLIER,
        component: Suppliers,
        model: SUPPLIER_PAGE_M,
      },
      {
        path: `${SUPPLIER_DETAILS}/:id`,
        component: SupplierDetails,
        model: SUPPLIER_M,
      },
      {
        path: SUPPLIER_PAY_REC,
        component: SupplierPayAndReceiveCash,
        model: SUPPLIER_PAY_REC_M,
      },
      {
        path: SUPPLIER_CATEGORY,
        component: SupplierCategories,
        model: SUPPLIER_CATEGORY_M,
      },
      {
        path: PARTNERS,
        component: Partners,
        model: EMPLOYEE_PAGE_M,
      },
      {
        path: EMPLOYEE,
        component: Employees,
        model: EMPLOYEE_PAGE_M,
      },
      {
        path: EMPLOYEE_SALARY,
        component: RecordSalaries,
        model: EMPLOYEE_M,
      },
      {
        path: `${EMPLOYEE_DETAILS}/:id`,
        component: EmployeeDetails,
        model: EMPLOYEE_M,
      },
      {
        path: EMPLOYEE_PAY_REC,
        component: EmployeePayAndReceiveCash,
        model: EMPLOYEE_PAY_REC_M,
      },
      {
        path: EMPLOYEE_CATEGORY,
        component: EmployeeCategories,
        model: EMPLOYEE_CATEGORY_M,
      },
      {
        path: `${REPORT}/:id`,
        component: Reports,
        model: REPORT_M,
        permission: REPORT_P,
      },
      {
        path: `${REPORT_CHILDE}/:id`,
        component: AllReports,
        model: REPORT_M,
        permission: REPORT_P,
      },
      {
        path: '/backup',
        component: Backup,
        model: BANK_PAGE_M,
      },
      {
        path: BACKUP_SETTING,
        component: OnlineDriveSettings,
        model: BACKUP_SETTINGS_M,
      },
      {
        path: BACKUP_AUTOMATIC,
        component: AutomaticBackup,
        model: BACKUP_SETTINGS_M,
      },
      {
        path: BRANCH,
        component: CompanyBranch,
        model: BRANCH_PAGE_M,
      },
      {
        path: USER,
        component: ManageUsers,
        model: USERS_PAGE_M,
      },
      {
        path: ROLES,
        component: Roles,
        model: USER_ROLE_M,
      },
      {
        path: CUSTOM_FORM_STYLE,
        component: CustomFormStyles,
        model: CUSTOM_FORM_STYLE_M,
      },
      {
        path: CHART_OF_ACCOUNT,
        component: ChartsOfAccounts,
        model: CHART_OF_ACCOUNT_M,
      },
      {
        path: OPENING_ACCOUNT,
        component: OpenAccounts,
        model: OPINING_ACCOUNT_M,
      },
      {
        path: FISCAL_YEAR,
        component: FinancialPeriod,
        model: FISCAL_YEAR_M,
      },
      {
        path: APPROVE_CENTER,
        component: ApproveCenter,
        model: SALES_INVOICE_M,
      },
      {
        path: AUDITING_CENTER,
        component: Auditing,
        model: AUDIT_CENTER_PAGE_M,
      },
    ],
    [],
  );

  const { t } = useTranslation();

  return (
    <div style={{ overflowY: 'hidden' }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PublicRoute element={<LoginPage />} />} />
          <Route
            path='/index.html'
            element={<PublicRoute element={<LoginPage />} />}
          />
          <Route
            path='/company'
            element={<PublicRoute element={<AddCompany />} />}
          />
          <Route
            path='/reset'
            element={<PublicRoute element={<ForgetPassword />} />}
          />
          <Route
            path='/forget/:id'
            element={<PublicRoute element={<ResetPassword />} />}
          />
          {privetRoutes?.map((item) => {
            return (
              <Route
                key={item?.path}
                path={item?.path}
                element={
                  <PrivateRoute element={item?.component} model={item?.model} />
                }
              />
            );
          })}
          <Route component={NotFound} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Routers;
