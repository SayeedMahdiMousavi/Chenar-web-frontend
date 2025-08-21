//pages route
export const ROLES = '/roles';
export const USERS = '/users';
export const WELCOME = '/welcome';
export const DASHBOARD = '/dashboard';
export const WAREHOUSE = '/warehouse';
export const WAREHOUSE_ADJUSTMENT = '/warehouse-adjustment';
export const WAREHOUSE_PRODUCT_TRANSFER = '/warehouse-product-transfer';
export const MONEY_TRANSFER = '/money-transfer';
export const BANK = '/bank';
export const CASH = '/cash';
export const BANK_TRANSACTION = '/bank-transaction';
export const INVENTORY = '/inventory';
export const INVOICES = '/invoice';
export const CUSTOMER = '/customer';
export const CUSTOMER_DETAILS = '/customer-details';
export const CUSTOMER_PAY_REC = '/customer-payAndReceive-cash';
export const CUSTOMER_CATEGORY = '/customer-categories';
export const PRODUCT = '/product';
export const PRODUCT_PRICE = '/price-recording';
export const PRODUCT_INVENTORY = '/product-inventory';
export const PRODUCT_CATEGORY = '/product-categories';
export const PRODUCT_UNIT = '/product-units';
export const CURRENCY = '/currency';
export const CURRENCY_RATE = '/currency-rate';
export const CURRENCY_EXCHANGE = '/currency-exchange';
export const CONTACTS = '/contacts';
export const EXPENSE = '/expense';
export const EXPENSE_TYPE = '/expense-definition';
export const EXPENSE_CATEGORY = '/expense-categories';
export const INCOME = '/income';
export const INCOME_TYPE = '/income-definition';
export const WITHDRAW = '/withdraw';
export const WITHDRAW_TYPE = '/withdraw-definition';
export const SUPPLIER = '/supplier';
export const SUPPLIER_DETAILS = '/supplier-details';
export const SUPPLIER_PAY_REC = '/supplier-payAndReceive_cash';
export const SUPPLIER_CATEGORY = '/supplier-categories';
export const EMPLOYEE = '/employee';
export const PARTNERS = '/partners';
export const EMPLOYEE_SALARY = '/record-salaries';
export const EMPLOYEE_PAY_REC = '/employee-payAndReceive-cash';
export const EMPLOYEE_CATEGORY = '/employee-categories';
export const EMPLOYEE_DETAILS = '/employee-details';
export const REPORT = '/report';
export const REPORT_CHILDE = '/all-reports';
export const BALANCE = '/balance';
export const BACKUP = '/backup';
export const BACKUP_SETTING = '/online-drive-settings';
export const BACKUP_AUTOMATIC = '/automatic-backup';
export const BRANCH = '/branch';
export const USER = '/users';
export const CUSTOM_FORM_STYLE = '/custom-form-styles';
export const CHART_OF_ACCOUNT = '/chart_of_accounts';
export const OPENING_ACCOUNT = '/open_account';
export const FISCAL_YEAR = '/fiscal_year';
export const APPROVE_CENTER = '/approve_center';
export const AUDITING_CENTER = '/audit_center';

//routes group
export const PRODUCT_ROUTES = [
  PRODUCT,
  PRODUCT_CATEGORY,
  PRODUCT_UNIT,
  PRODUCT_INVENTORY,
  PRODUCT_PRICE,
];
export const WAREHOUSE_ROUTES = [
  WAREHOUSE_ADJUSTMENT,
  WAREHOUSE_PRODUCT_TRANSFER,
  WAREHOUSE,
];
export const SUPPLIER_ROUTES = [SUPPLIER, SUPPLIER_PAY_REC, SUPPLIER_CATEGORY];

export const INVENTORY_ROUTES = [
  ...PRODUCT_ROUTES,
  ...WAREHOUSE_ROUTES,
  INVOICES,
];

export const CUSTOMER_ROUTES = [
  CUSTOMER,
  CUSTOMER_CATEGORY,
  CUSTOMER_PAY_REC,
  PARTNERS,
];

export const EMPLOYEE_ROUTES = [
  EMPLOYEE,
  EMPLOYEE_CATEGORY,
  EMPLOYEE_PAY_REC,
  EMPLOYEE_SALARY,
];
export const PARTNERS_ROUTES = [
  PARTNERS,
  // EMPLOYEE_CATEGORY,
  // EMPLOYEE_PAY_REC,
  // EMPLOYEE_SALARY,
];
export const CONTACTS_ROUTES = [
  ...CUSTOMER_ROUTES,
  ...EMPLOYEE_ROUTES,
  ...SUPPLIER_ROUTES,
];
export const EXPENSE_ROUTES = [EXPENSE, EXPENSE_TYPE, EXPENSE_CATEGORY];
export const INCOME_ROUTES = [INCOME, INCOME_TYPE];
export const WITHDRAW_ROUTES = [WITHDRAW, WITHDRAW_TYPE];
export const EXPENSES_AND_INCOME_ROUTES = [
  ...EXPENSE_ROUTES,
  ...INCOME_ROUTES,
  ...WITHDRAW_ROUTES,
];

export const BANK_ROUTES = [BANK, `${MONEY_TRANSFER}${BANK}`];
export const CASH_ROUTES = [CASH, `${MONEY_TRANSFER}${CASH}`];
export const BANK_TRANSACTION_ROUTES = [
  BANK_TRANSACTION,
  `${BANK_TRANSACTION}${BANK_TRANSACTION}`,
];
export const BANK_CASH_ROUTES = [
  ...BANK_ROUTES,
  ...CASH_ROUTES,
  ...BANK_TRANSACTION_ROUTES,
];
export const ACCOUNTING_ROUTES = [
  CHART_OF_ACCOUNT,
  OPENING_ACCOUNT,
  FISCAL_YEAR,
];
export const CURRENCY_ROUTES = [CURRENCY, CURRENCY_RATE, CURRENCY_EXCHANGE];
export const REPORT_ROUTES = [
  `${REPORT}/financial`,
  `${REPORT}/warehouse`,
  `${REPORT_CHILDE}/journal`,
  `${REPORT_CHILDE}/balance-sheet`,
  `${REPORT_CHILDE}/income-statement`,
  `${REPORT_CHILDE}/currency-exchange`,
  `${REPORT_CHILDE}/currency-history`,
  `${REPORT_CHILDE}/expenses`,
  `${REPORT_CHILDE}/income`,
  `${REPORT_CHILDE}/cash-transactions`,
  `${REPORT_CHILDE}/money-transfer`,
  `${REPORT_CHILDE}/product-statistics`,
  `${REPORT_CHILDE}/expired-products`,
  `${REPORT_CHILDE}/product-deficits`,
  `${REPORT_CHILDE}/warehouse-statistics`,
  `${REPORT_CHILDE}/warehouse-cart-x`,
  `${REPORT_CHILDE}/sales`,
  `${REPORT_CHILDE}/invoices`,
  `${REPORT_CHILDE}/total-sold-products`,
  `${REPORT_CHILDE}/total-sold-by-customer`,
  `${REPORT_CHILDE}/product-purchase-price`,
  `${REPORT_CHILDE}/product-sales-price`,
  `${REPORT_CHILDE}/fiscal_periods_income`,
  `${REPORT_CHILDE}/trial-balance`,
  `${REPORT_CHILDE}/detailed-balance`,
  `${REPORT_CHILDE}/accounts-statistics`,
  `${REPORT_CHILDE}/debit-credit`,
  `${REPORT_CHILDE}/product-profit-average`,
];

//serve routes
export const SALES_INVOICE_LIST = '/invoice/sales_order/';
export const SALES_ORDER_INVOICE_LIST = '/invoice/sales_order/';
export const SALES_REJECT_INVOICE_LIST = '/invoice/sales_reject/';
export const PURCHASE_INVOICE_LIST = '/invoice/purchase/';
export const PURCHASE_ORDER_INVOICE_LIST = '/invoice/purchase_order/';
export const PURCHASE_REJECT_INVOICE_LIST = '/invoice/purchase_reject/';
export const QUOTATION_INVOICE_LIST = '/invoice/estimate/';
export const WAREHOUSE_ADJUSTMENT_INVOICE_LIST = '/invoice/adjustment/';
export const OPENING_ACCOUNT_LIST = '/opening_balance/account_balance/';
export const OPENING_ACCOUNT_RESULT_LIST =
  '/opening_balance/account_balance/get_capital_to_base/';
export const PRODUCT_LIST = '/product/items/';
export const PRODUCT_UNIT_LIST = '/product/unit/';
export const PRODUCT_INVENTORY_LIST = '/opening_balance/onhand_product/';
export const EMPLOYEE_LIST = '/staff_account/staff/';
export const CURRENCY_LIST = '/currency/';
export const CURRENCY_RATE_LIST = '/currency/active_currency_rate/';
export const ROLES_LIST = '/user_account/roles/';
export const USERS_LIST = '/user_account/users/';
export const PERMISSIONS_LIST = '/user_account/permit';
export const WAREHOUSE_PRODUCT_TRANSFER_LIST = '/invoice/transfer/';

//reports server routes
export const PRODUCT_STATISTIC_LIST =
  '/accounting_reports/warehouse/product_statistic/';
export const PRODUCT_DEFICITS_LIST =
  '/accounting_reports/warehouse/product_deficits/';
export const PRODUCT_SALES_PRICE_LIST =
  '/accounting_reports/warehouse/sales_price/';
export const PRODUCT_PURCHASE_PRICE_LIST =
  '/accounting_reports/warehouse/purchase_price/';
export const EXPIRE_PRODUCTS_LIST =
  '/accounting_reports/warehouse/product_expiration/';
export const WAREHOUSE_STATISTIC_LIST =
  '/accounting_reports/warehouse/inventory/';
export const WAREHOUSE_STATISTIC_RESULT_LIST =
  '/accounting_reports/warehouse/inventory/result/';
export const WAREHOUSE_CARDX_LIST =
  '/accounting_reports/warehouse/warehouse_cardex/';
export const WAREHOUSE_CARDX_RESULT_LIST =
  '/accounting_reports/warehouse/warehouse_cardex/result/';
export const WAREHOUSE_SALES_INVOICE_LIST =
  '/accounting_reports/warehouse/sales_invoice/';
export const WAREHOUSE_SALES_INVOICE_RESULT_LIST =
  '/accounting_reports/warehouse/sales_invoice/result/';
export const INVOICE_BY_PRODUCT_LIST =
  '/accounting_reports/warehouse/invoice_by_product/';
export const INVOICE_BY_PRODUCT_RESULT_LIST =
  '/accounting_reports/warehouse/invoice_by_product/result/';
export const INVOICE_BY_PERSON_LIST =
  '/accounting_reports/warehouse/invoice_by_person/';
export const INVOICE_BY_PERSON_RESULT_LIST =
  '/accounting_reports/warehouse/invoice_by_person/result/';
export const INVOICES_LIST = '/accounting_reports/warehouse/invoice_report/';
export const INVOICES_RESULT_LIST =
  '/accounting_reports/warehouse/invoice_report/result/';
export const PROFIT_AVERAGE_LIST =
  '/accounting_reports/warehouse/product_profit/';
export const PROFIT_AVERAGE_RESULT_LIST =
  '/accounting_reports/warehouse/product_profit/result/';
export const JOURNAL_LIST = '/accounting_reports/financial/journal/';
export const JOURNAL_RESULT_LIST =
  '/accounting_reports/financial/journal/result/';
export const ACCOUNT_STATISTIC_LIST =
  '/accounting_reports/financial/account_statistic/';
export const ACCOUNT_STATISTIC_RESULT_LIST =
  '/accounting_reports/financial/account_statistic/result/';
export const DEBIT_CREDIT_LIST = '/accounting_reports/financial/debit_credit/';
export const DEBIT_CREDIT_RESULT_LIST =
  '/accounting_reports/financial/debit_credit/result/';
export const DETAIL_BALANCE_LIST =
  '/accounting_reports/financial/balance/detailed/';
export const TRIAL_BALANCE_LIST =
  '/accounting_reports/financial/balance/trial/';
export const INCOME_STATEMENT_LIST =
  '/accounting_reports/financial/profit_lost/';
export const FISCAL_YEAR_INCOME_LIST =
  '/accounting_reports/financial/profit_lost/year/';
export const BALANCE_SHEET_LIST = '/accounting_reports/financial/balance/main/';
