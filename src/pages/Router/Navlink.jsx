import { useCallback } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../MediaQurey';
import { ConfigProvider, Menu } from 'antd';
import { useDarkMode } from '../../Hooks/useDarkMode';
import { checkPermissionsModel } from '../../Functions';
import {
  BALANCE_SHEET_P,
  BANK_PAGE_M,
  BANK_TRANSACTION_PAGE_M,
  CASH_PAGE_M,
  CHART_OF_ACCOUNT_M,
  CURRENCY_PAGE_M,
  CUSTOMER_AND_EMPLOYEE_PAGE_M,
  CUSTOMER_PAGE_M,
  DASHBOARD_M,
  EMPLOYEE_PAGE_M,
  EXPENSE_PAGE_M,
  FISCAL_YEAR_M,
  INCOME_PAGE_M,
  INVENTORY_PAGE_M,
  INVOICE_PAGE_M,
  OPINING_ACCOUNT_M,
  PRODUCT_PAGE_M,
  REPORT_M,
  SALES_INVOICE_M,
  SUPPLIER_PAGE_M,
  WAREHOUSE_PAGE_M,
  WITHDRAW_PAGE_M,
} from '../../constants/permissions';
import {
  ACCOUNTING_ROUTES,
  APPROVE_CENTER,
  BALANCE,
  BANK,
  BANK_CASH_ROUTES,
  BANK_ROUTES,
  BANK_TRANSACTION,
  BANK_TRANSACTION_ROUTES,
  CASH,
  CASH_ROUTES,
  CHART_OF_ACCOUNT,
  CONTACTS,
  CONTACTS_ROUTES,
  CURRENCY_RATE,
  CURRENCY_ROUTES,
  CUSTOMER,
  CUSTOMER_ROUTES,
  DASHBOARD,
  EMPLOYEE,
  EMPLOYEE_ROUTES,
  EXPENSE,
  EXPENSES_AND_INCOME_ROUTES,
  EXPENSE_ROUTES,
  FISCAL_YEAR,
  INCOME,
  INCOME_ROUTES,
  INVENTORY,
  INVENTORY_ROUTES,
  INVOICES,
  OPENING_ACCOUNT,
  PARTNERS,
  PARTNERS_ROUTES,
  PRODUCT,
  PRODUCT_ROUTES,
  REPORT,
  REPORT_ROUTES,
  SUPPLIER,
  SUPPLIER_ROUTES,
  WAREHOUSE,
  WAREHOUSE_ROUTES,
  WITHDRAW,
  WITHDRAW_ROUTES,
} from '../../constants/routes';

import { lazyRetry } from '../../utils/lazyRetry';
import {
  FaWallet,
  FaShoppingCart,
  FaRegUser,
  FaDollarSign,
  FaRegCreditCard,
  FaChartBar,
  FaUniversity,
  FaCalculator,
  FaCheckCircle,
  FaBuromobelexperte,
} from 'react-icons/fa';

// Lazy-loaded components (unchanged)
export const Inventory = () => {
  lazyRetry(() => import('../sales/Products'));
  lazyRetry(() => import('../sales/AllSales'));
  lazyRetry(() => import('../Warehouse'));
  lazyRetry(() => import('../Expenses/Suppliers'));
};
export const Contacts = () => {
  return (import('../sales/Customer'), import('../Employees'));
};
export const ExpenseAndIncome = () => {
  return (
    lazyRetry(() => import('../Expenses/Expenses/RecordExpense')),
    lazyRetry(() => import('../Expenses/IncomeType/RecordIncomes')),
    lazyRetry(() => import('../Expenses/WithDraw/WithDrawPayAndReceiveCash'))
  );
};
export const BankAndCash = () => {
  return (
    lazyRetry(() => import('../Banking/CashBox/index')),
    lazyRetry(() => import('../Banking/Bank'))
  );
};
export const Accounting = () => {
  return (
    lazyRetry(() => import('../OpeningAccounts/OpenAccounts/index')),
    lazyRetry(() => import('../Company/AccountAndSettings/Financial')),
    lazyRetry(() => import('../Accounting/ChartsOfAccounts'))
  );
};
export const Dashboard = () => import('../Dashboard');
export const CurrencyRate = () =>
  lazyRetry(() => import('../Currency/Currency rate/CurrencyRate'));
export const Report = () => lazyRetry(() => import('../Reports/Reports'));
export const ApproveCenter = () => lazyRetry(() => import('../ApproveCenter'));

function Navlinks({ close, collapsed, ...rest }) {
  const { t } = useTranslation();
  const location = useLocation();
  const isMobileBased = useMediaQuery('(max-width: 576px)');
  const [mode] = useDarkMode();
  const params = useParams();

  const closeDrawer = () => {
    if (isMobileBased) {
      // close();
    }
  };

  const routePath = location.pathname;

  const handleCheckRout = useCallback(
    (routes) => {
      const className = routes?.includes(routePath)
        ? `sidebar_subMenu-${mode} ${
            collapsed && mode === 'light'
              ? 'submenu-item-selected-collapsed'
              : ''
          }`
        : '';
      const style = routes?.includes(routePath);
      return { style, className };
    },
    [mode, collapsed, routePath],
  );

  const handleCheckMenuRout = useCallback(
    (routes) => {
      const className =
        routes?.includes(routePath) && collapsed
          ? 'ant-menu-item-selected-collapsed'
          : routes?.includes(routePath)
            ? `ant-menu-item-selected1`
            : '';
      return className;
    },
    [collapsed, routePath],
  );

  // Define the menu items array
  const menuItems = [
    checkPermissionsModel(DASHBOARD_M) && {
      key: DASHBOARD,
      className: handleCheckMenuRout([DASHBOARD]),
      style: styles.mainMenuItem(collapsed),
      icon: <FaWallet />,
      label: <Link to={DASHBOARD}>{t('Dashboard.1')}</Link>,
      onMouseEnter: Dashboard,
    },
    checkPermissionsModel(BALANCE_SHEET_P) && {
      key: '/balance',
      className: handleCheckMenuRout([BALANCE]),
      style: styles.mainMenuItem(collapsed),
      icon: <FaChartBar />,
      label: <Link to={BALANCE}>{t('Reports.Journal_book')}</Link>,
    },
    checkPermissionsModel(INVENTORY_PAGE_M) && {
      key: INVENTORY,
      className: handleCheckRout(INVENTORY_ROUTES)?.className,
      style: {
        ...handleCheckRout(INVENTORY_ROUTES)?.style,
        ...styles.subMenuItem,
      },
      icon: <FaShoppingCart />,
      label: t('Sales.Product_and_services.Inventory.1'),
      onMouseEnter: Inventory,
      children: [
        checkPermissionsModel(PRODUCT_PAGE_M) && {
          key: PRODUCT,
          style: {
            ...styles.menuItem,
            ...handleCheckRout(PRODUCT_ROUTES)?.style,
          },
          label: <Link to={PRODUCT}>{t('Sales.Product_and_services.1')}</Link>,
        },
        checkPermissionsModel(WAREHOUSE_PAGE_M) && {
          key: WAREHOUSE,
          style: {
            ...styles.menuItem,
            ...handleCheckRout(WAREHOUSE_ROUTES)?.style,
          },
          label: <Link to={WAREHOUSE}>{t('Warehouse.1')}</Link>,
        },
        checkPermissionsModel(INVOICE_PAGE_M) && {
          key: INVOICES,
          style: styles.menuItem,
          label: <Link to={INVOICES}>{t('Sales.All_sales.1')}</Link>,
        },
      ].filter(Boolean),
    },
    checkPermissionsModel(CUSTOMER_AND_EMPLOYEE_PAGE_M) && {
      key: CONTACTS,
      className: handleCheckRout(CONTACTS_ROUTES)?.className,
      style: {
        ...handleCheckRout(CONTACTS_ROUTES)?.style,
        ...styles.subMenuItem,
      },
      icon: <FaRegUser />,
      label: t('Contacts.1'),
      onMouseEnter: Contacts,
      children: [
        checkPermissionsModel(CUSTOMER_PAGE_M) && {
          key: CUSTOMER,
          style: {
            ...styles.menuItem,
            ...handleCheckRout(CUSTOMER_ROUTES)?.style,
          },
          label: <Link to={CUSTOMER}>{t('Sales.Customers.1')}</Link>,
        },
        checkPermissionsModel(SUPPLIER_PAGE_M) && {
          key: SUPPLIER,
          style: {
            ...styles.menuItem,
            ...handleCheckRout(SUPPLIER_ROUTES)?.style,
          },
          label: <Link to={SUPPLIER}>{t('Expenses.Suppliers.1')}</Link>,
        },
        checkPermissionsModel(EMPLOYEE_PAGE_M) && {
          key: EMPLOYEE,
          style: {
            ...styles.menuItem,
            ...handleCheckRout(EMPLOYEE_ROUTES)?.style,
          },
          label: <Link to={EMPLOYEE}>{t('Employees.1')}</Link>,
        },
        checkPermissionsModel(EMPLOYEE_PAGE_M) && {
          key: PARTNERS,
          style: {
            ...styles.menuItem,
            ...handleCheckRout(PARTNERS_ROUTES)?.style,
          },
          label: <Link to={PARTNERS}>{t('Partners.1')}</Link>,
        },
      ].filter(Boolean),
    },
    (checkPermissionsModel(EXPENSE_PAGE_M) ||
      checkPermissionsModel(INCOME_PAGE_M) ||
      checkPermissionsModel(WITHDRAW_PAGE_M)) && {
      key: EXPENSE,
      className: handleCheckRout(EXPENSES_AND_INCOME_ROUTES)?.className,
      style: {
        ...handleCheckRout(EXPENSES_AND_INCOME_ROUTES)?.style,
        ...styles.subMenuItem,
      },
      icon: <FaRegCreditCard />,
      label: t('Expenses.Expenses_and_incomes'),
      onMouseEnter: ExpenseAndIncome,
      children: [
        checkPermissionsModel(EXPENSE_PAGE_M) && {
          key: EXPENSE,
          style: {
            ...styles.menuItem,
            ...handleCheckRout(EXPENSE_ROUTES)?.style,
          },
          label: <Link to={EXPENSE}>{t('Expenses.1')}</Link>,
        },
        checkPermissionsModel(INCOME_PAGE_M) && {
          key: INCOME,
          style: {
            ...styles.menuItem,
            ...handleCheckRout(INCOME_ROUTES)?.style,
          },
          label: <Link to={INCOME}>{t('Expenses.Income.1')}</Link>,
        },
        checkPermissionsModel(WITHDRAW_PAGE_M) && {
          key: WITHDRAW,
          style: {
            ...styles.menuItem,
            ...handleCheckRout(WITHDRAW_ROUTES)?.style,
          },
          label: <Link to={WITHDRAW}>{t('Expenses.With_draw.1')}</Link>,
        },
      ].filter(Boolean),
    },
    (checkPermissionsModel(BANK_PAGE_M) ||
      checkPermissionsModel(CASH_PAGE_M) ||
      checkPermissionsModel(BANK_TRANSACTION_PAGE_M)) && {
      key: BANK,
      className: handleCheckRout(BANK_CASH_ROUTES)?.className,
      style: {
        ...handleCheckRout(BANK_CASH_ROUTES)?.style,
        ...styles.subMenuItem,
      },
      icon: <FaUniversity />,
      label: t('Banking.Banking_and_cash'),
      onMouseEnter: BankAndCash,
      children: [
        checkPermissionsModel(BANK_PAGE_M) && {
          key: BANK,
          style: { ...styles.menuItem, ...handleCheckRout(BANK_ROUTES)?.style },
          label: <Link to={BANK}>{t('Banking.1')}</Link>,
        },
        checkPermissionsModel(CASH_PAGE_M) && {
          key: CASH,
          style: { ...styles.menuItem, ...handleCheckRout(CASH_ROUTES)?.style },
          label: <Link to={CASH}>{t('Banking.Cash_box.1')}</Link>,
        },
        checkPermissionsModel(BANK_TRANSACTION_PAGE_M) && {
          key: BANK_TRANSACTION,
          style: {
            ...styles.menuItem,
            ...handleCheckRout(BANK_TRANSACTION_ROUTES)?.style,
          },
          label: (
            <Link to={BANK_TRANSACTION}>{t('Banking.Transactions.1')}</Link>
          ),
        },
      ].filter(Boolean),
    },
    checkPermissionsModel(CURRENCY_PAGE_M) && {
      key: CURRENCY_RATE,
      className: handleCheckMenuRout(CURRENCY_ROUTES),
      style: {
        ...styles.mainMenuItem(collapsed),
        ...handleCheckRout(CURRENCY_ROUTES)?.style,
      },
      icon: <FaDollarSign />,
      label: (
        <Link to={CURRENCY_RATE}>
          {t('Sales.Product_and_services.Currency.Currency_and_exchange')}
        </Link>
      ),
      onMouseEnter: CurrencyRate,
    },
    (checkPermissionsModel(CHART_OF_ACCOUNT_M) ||
      checkPermissionsModel(OPINING_ACCOUNT_M) ||
      checkPermissionsModel(FISCAL_YEAR_M)) && {
      key: CHART_OF_ACCOUNT,
      className: handleCheckRout(ACCOUNTING_ROUTES)?.className,
      style: {
        ...handleCheckRout(ACCOUNTING_ROUTES)?.style,
        ...styles.subMenuItem,
      },
      icon: <FaCalculator />,
      label: t('Accounting.1'),
      onMouseEnter: Accounting,
      children: [
        checkPermissionsModel(CHART_OF_ACCOUNT_M) && {
          key: CHART_OF_ACCOUNT,
          style: styles.menuItem,
          label: (
            <Link to={CHART_OF_ACCOUNT}>
              {t('Accounting.Chart_of_accounts.1')}
            </Link>
          ),
        },
        checkPermissionsModel(OPINING_ACCOUNT_M) && {
          key: OPENING_ACCOUNT,
          style: styles.menuItem,
          label: <Link to={OPENING_ACCOUNT}>{t('Opening_accounts.1')}</Link>,
        },
        checkPermissionsModel(FISCAL_YEAR_M) && {
          key: FISCAL_YEAR,
          style: styles.menuItem,
          label: <Link to={FISCAL_YEAR}>{t('Company.Financial_period')}</Link>,
        },
      ].filter(Boolean),
    },
    checkPermissionsModel(REPORT_M) && {
      key: `${REPORT}/${params?.id === 'warehouse' ? 'warehouse' : 'financial'}`,
      className: handleCheckMenuRout(REPORT_ROUTES),
      style: {
        ...styles.mainMenuItem(collapsed),
        ...handleCheckRout(REPORT_ROUTES)?.style,
      },
      icon: <FaCheckCircle />,
      label: (
        <Link
          to={`${REPORT}/${params?.id === 'warehouse' ? 'warehouse' : 'financial'}`}
        >
          {t('Reports.1')}
        </Link>
      ),
      onMouseEnter: Report,
    },
    checkPermissionsModel(SALES_INVOICE_M) && {
      key: APPROVE_CENTER,
      className: handleCheckMenuRout([APPROVE_CENTER]),
      style: styles.mainMenuItem(collapsed),
      icon: <FaBuromobelexperte />,
      label: <Link to={APPROVE_CENTER}>{t('Approve_center.1')}</Link>,
      onMouseEnter: ApproveCenter,
    },
  ].filter(Boolean); // Remove falsy values (e.g., when permissions are not met)

  return (
    <Menu
      mode={isMobileBased ? 'inline' : 'vertical'}
      theme={mode}
      selectedKeys={[routePath]}
      style={{
        border: 'none',
        width: collapsed ? '67px' : '',
      }}
      onClick={closeDrawer}
      items={menuItems}
      {...rest}
    />
  );
}

const styles = {
  menuItem: {
    margin: '0',
  },
  menuDivider: {
    margin: '0',
    marginInlineStart: '16px',
  },
  mainMenuItem: (collapsed) => ({
    margin: '0',
    height: '50px',
    paddingTop: '5px',
  }),
  subMenuItem: {
    margin: '0',
    height: '50px',
    paddingTop: '1px',
  },
  link: { color: 'inherit' },
};

export default Navlinks;
