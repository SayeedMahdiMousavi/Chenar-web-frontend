import React from "react";

const createOption = (t: any) => {
  const slash = " / ";
  const options = [
    {
      label: t("Dashboard.1"),
      options: [
        {
          value: t("Dashboard.1"),
          link: "/dashboard",
        },
      ],
    },
    {
      label: t("Reports.Journal_book"),
      options: [
        {
          value:t("Reports.Journal_book"),
          link: "/balance",
        },
      ],
    },
    {
      label:
        t("Sales.Product_and_services.Inventory.1") +
        slash +
        t("Sales.Product_and_services.1"),
      options: [
        {
          value: t("Sales.Product_and_services.1"),
          link: "/product",
        },
      ],
    },
    {
      label:
        t("Sales.Product_and_services.Inventory.1") +
        slash +
        t("Sales.Product_and_services.1") +
        slash +
        t("Sales.Product_and_services.More") +
        slash +
        t("Sales.Product_and_services.Categories.Product_categories"),
      options: [
        {
          value: t("Sales.Product_and_services.Categories.Product_categories"),
          link: "/product-categories",
        },
      ],
    },
    {
      label:
        t("Sales.Product_and_services.Inventory.1") +
        slash +
        t("Sales.Product_and_services.1") +
        slash +
        t("Sales.Product_and_services.More") +
        slash +
        t("Sales.Product_and_services.Units.Product_units"),
      options: [
        {
          value: t("Sales.Product_and_services.Units.Product_units"),
          link: "/product-units",
        },
      ],
    },
    {
      label:
        t("Sales.Product_and_services.Inventory.1") +
        slash +
        t("Sales.Product_and_services.1") +
        slash +
        t("Sales.Product_and_services.More") +
        slash +
        t("Sales.Product_and_services.Inventory.Product_inventory"),
      options: [
        {
          value: t("Sales.Product_and_services.Inventory.Product_inventory"),
          link: "/product-inventory",
        },
      ],
    },
    {
      label:
        t("Sales.Product_and_services.Inventory.1") +
        slash +
        t("Sales.Product_and_services.1") +
        slash +
        t("Sales.Product_and_services.More") +
        slash +
        t("Sales.Product_and_services.Price_recording.1"),
      options: [
        {
          value: t("Sales.Product_and_services.Price_recording.1"),
          link: "/price-recording",
        },
      ],
    },
    {
      label:
        t("Sales.Product_and_services.Inventory.1") + slash + t("Warehouse.1"),
      options: [
        {
          value: t("Warehouse.1"),
          link: "/warehouse",
        },
      ],
    },
    {
      label:
        t("Sales.Product_and_services.Inventory.1") +
        slash +
        t("Warehouse.1") +
        slash +
        t("Sales.Product_and_services.More") +
        slash +
        t("Warehouse.Warehouse_adjustment"),
      options: [
        {
          value: t("Warehouse.Warehouse_adjustment"),
          link: "/warehouse-adjustment",
        },
      ],
    },
    {
      label:
        t("Sales.Product_and_services.Inventory.1") +
        slash +
        t("Warehouse.1") +
        slash +
        t("Sales.Product_and_services.More") +
        slash +
        t("Sales.All_sales.Invoice.Product_transfer"),
      options: [
        {
          value: t("Sales.All_sales.Invoice.Product_transfer"),
          link: "/warehouse-product-transfer",
        },
      ],
    },
    {
      label:
        t("Sales.Product_and_services.Inventory.1") +
        slash +
        t("Sales.All_sales.Purchase_and_sales.1"),
      options: [
        {
          value: t("Sales.All_sales.Purchase_and_sales.1"),
          link: "/invoice",
        },
      ],
    },
    {
      label: t("Contacts.1") + slash + t("Sales.Customers.1"),
      options: [
        {
          value: t("Sales.Customers.1"),
          link: "/customer",
        },
      ],
    },
    {
      label:
        t("Contacts.1") +
        slash +
        t("Sales.Customers.1") +
        slash +
        t("Sales.Product_and_services.More") +
        slash +
        t("Sales.Customers.Customer_Categories"),
      options: [
        {
          value: t("Sales.Customers.Customer_Categories"),
          link: "/customer-categories",
        },
      ],
    },
    {
      label:
        t("Contacts.1") +
        slash +
        t("Sales.Customers.1") +
        slash +
        t("Sales.Product_and_services.More") +
        slash +
        t("Employees.Pay_and_receive_cash"),
      options: [
        {
          value: t("Employees.Pay_and_receive_cash"),
          link: "/customer-payAndReceive-cash",
        },
      ],
    },
    {
      label: t("Contacts.1") + slash + t("Expenses.Suppliers.1"),
      options: [
        {
          value: t("Expenses.Suppliers.1"),
          link: "/supplier",
        },
      ],
    },
    {
      label:
        t("Contacts.1") +
        slash +
        t("Expenses.Suppliers.1") +
        slash +
        t("Sales.Product_and_services.More") +
        slash +
        t("Expenses.Suppliers.Suppliers_categories"),
      options: [
        {
          value: t("Expenses.Suppliers.Suppliers_categories"),
          link: "/supplier-categories",
        },
      ],
    },
    {
      label:
        t("Contacts.1") +
        slash +
        t("Expenses.Suppliers.1") +
        slash +
        t("Sales.Product_and_services.More") +
        slash +
        t("Employees.Pay_and_receive_cash"),
      options: [
        {
          value: t("Employees.Pay_and_receive_cash"),
          link: "/supplier-payAndReceive_cash",
        },
      ],
    },
    {
      label: t("Contacts.1") + slash + t("Employees.1"),
      options: [
        {
          value: t("Employees.1"),
          link: "/employee",
        },
      ],
    },
    {
      label:
        t("Contacts.1") +
        slash +
        t("Employees.1") +
        slash +
        t("Sales.Product_and_services.More") +
        slash +
        t("Employees.Employees_categories"),
      options: [
        {
          value: t("Employees.Employees_categories"),
          link: "/employee-categories",
        },
      ],
    },
    {
      label:
        t("Contacts.1") +
        slash +
        t("Employees.1") +
        slash +
        t("Sales.Product_and_services.More") +
        slash +
        t("Employees.Record_salaries"),
      options: [
        {
          value: t("Employees.Record_salaries"),
          link: "/record-salaries",
        },
      ],
    },
    {
      label:
        t("Contacts.1") +
        slash +
        t("Employees.1") +
        slash +
        t("Sales.Product_and_services.More") +
        slash +
        t("Employees.Pay_and_receive_cash"),
      options: [
        {
          value: t("Employees.Pay_and_receive_cash"),
          link: "/employee-payAndReceive-cash",
        },
      ],
    },
    {
      label: t("Contacts.1") + slash + t("Partners.1"),
      options: [
        {
          value: t("Partners.1"),
          link: "/partners",
        },
      ],
    },
    {
      label: t("Expenses.Expenses_and_incomes") + slash + t("Expenses.1"),
      options: [
        {
          value: t("Expenses.1"),
          link: "/expense",
        },
      ],
    },
    {
      label:
        t("Expenses.Expenses_and_incomes") +
        slash +
        t("Expenses.1") +
        slash +
        t("Sales.Product_and_services.More") +
        slash +
        t("Expenses.Expenses_definition"),
      options: [
        {
          value: t("Expenses.Expenses_definition"),
          link: "/expense-definition",
        },
      ],
    },
    {
      label:
        t("Expenses.Expenses_and_incomes") +
        slash +
        t("Expenses.1") +
        slash +
        t("Sales.Product_and_services.More") +
        slash +
        t("Expenses.Expenses_definition") +
        slash +
        t("Sales.Product_and_services.More") +
        slash +
        t("Expenses.Expenses_categories"),
      options: [
        {
          value: t("Expenses.Expenses_categories"),
          link: "/expense-categories",
        },
      ],
    },
    {
      label:
        t("Expenses.Expenses_and_incomes") + slash + t("Expenses.Income.1"),
      options: [
        {
          value: t("Expenses.Income.1"),
          link: "/income",
        },
      ],
    },
    {
      label:
        t("Expenses.Expenses_and_incomes") +
        slash +
        t("Expenses.Income.1") +
        slash +
        t("Sales.Product_and_services.More") +
        slash +
        t("Expenses.Income.Income_type"),
      options: [
        {
          value: t("Expenses.Income.Income_type"),
          link: "/income-definition",
        },
      ],
    },
    {
      label:
        t("Expenses.Expenses_and_incomes") +
        slash +
        t("Expenses.With_draw.With_draw_and_deposit_cash"),
      options: [
        {
          value: t("Expenses.With_draw.With_draw_and_deposit_cash"),
          link: "/withdraw",
        },
      ],
    },
    {
      label:
        t("Expenses.Expenses_and_incomes") +
        slash +
        t("Expenses.With_draw.With_draw_and_deposit_cash") +
        slash +
        t("Sales.Product_and_services.More") +
        slash +
        t("Expenses.With_draw.With_definition"),
      options: [
        {
          value: t("Expenses.With_draw.With_definition"),
          link: "/withdraw-definition",
        },
      ],
    },
    {
      label:
        t("Banking.Banking_and_cash") +
        slash +
        t("Banking.1") +
        slash +
        t("Sales.Product_and_services.More") +
        slash +
        t("Banking.Money_transfer"),
      options: [
        {
          value: t("Banking.Money_transfer"),
          link: "/money-transfer/bank",
        },
      ],
    },
    {
      label: t("Banking.Banking_and_cash") + slash + t("Banking.Cash_box.1"),
      options: [
        {
          value: t("Banking.Cash_box.1"),
          link: "/cash",
        },
      ],
    },
    {
      label:
        t("Banking.Banking_and_cash") +
        slash +
        t("Banking.Cash_box.1") +
        slash +
        t("Sales.Product_and_services.More") +
        slash +
        t("Banking.Money_transfer"),
      options: [
        {
          value: t("Banking.Money_transfer"),
          link: "/money-transfer/cash",
        },
      ],
    },
    {
      label:
        t("Sales.Product_and_services.Currency.Currency_and_exchange") +
        slash +
        t("Sales.Product_and_services.Currency.Currency_rate"),
      options: [
        {
          value: t("Sales.Product_and_services.Currency.Currency_rate"),
          link: "/currency-rate",
        },
      ],
    },
    {
      label:
        t("Sales.Product_and_services.Currency.Currency_and_exchange") +
        slash +
        t("Sales.Product_and_services.Currency.Currency_rate") +
        slash +
        t("Sales.Product_and_services.More") +
        slash +
        t("Sales.Product_and_services.Inventory.Currency"),
      options: [
        {
          value: t("Sales.Product_and_services.Inventory.Currency"),
          link: "/currency",
        },
      ],
    },
    {
      label:
        t("Sales.Product_and_services.Currency.Currency_and_exchange") +
        slash +
        t("Sales.Product_and_services.Currency.Currency_rate") +
        slash +
        t("Sales.Product_and_services.More") +
        slash +
        t("Reports.Currency_exchange"),
      options: [
        {
          value: t("Reports.Currency_exchange"),
          link: "/currency-exchange",
        },
      ],
    },
    {
      label: t("Accounting.1") + slash + t("Accounting.Chart_of_accounts.1"),
      options: [
        {
          value: t("Accounting.Chart_of_accounts.1"),
          link: "/chart_of_accounts",
        },
      ],
    },
    {
      label: t("Accounting.1") + slash + t("Opening_accounts.1"),
      options: [
        {
          value: t("Opening_accounts.1"),
          link: "/open_account",
        },
      ],
    },
    {
      label: t("Accounting.1") + slash + t("Company.Financial_period"),
      options: [
        {
          value: t("Company.Financial_period"),
          link: "/fiscal_year",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Financial_reports") +
        slash +
        t("Reports.Journal_book"),
      options: [
        {
          value: t("Reports.Journal_book"),
          link: "/all-reports/journal",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Financial_reports") +
        slash +
        t("Reports.Balance_sheet") +
        slash +
        t("Reports.Default_Balance"),
      options: [
        {
          value: t("Reports.Default_Balance"),
          link: "/all-reports/balance-sheet",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Financial_reports") +
        slash +
        t("Reports.Balance_sheet") +
        slash +
        t("Reports.Main_Balance"),
      options: [
        {
          value: t("Reports.Main_Balance"),
          link: "/all-reports/balance-sheet",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Financial_reports") +
        slash +
        t("Reports.Income_statement"),
      options: [
        {
          value: t("Reports.Income_statement"),
          link: "/all-reports/income-statement",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Financial_reports") +
        slash +
        t("Reports.Trial_balance"),
      options: [
        {
          value: t("Reports.Trial_balance"),
          link: "/all-reports/trial-balance",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Financial_reports") +
        slash +
        t("Reports.Detailed_balance"),
      options: [
        {
          value: t("Reports.Detailed_balance"),
          link: "/all-reports/detailed-balance",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Financial_reports") +
        slash +
        t("Reports.Accounts_statistics"),
      options: [
        {
          value: t("Reports.Accounts_statistics"),
          link: "/all-reports/accounts-statistics",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Financial_reports") +
        slash +
        t("Reports.Debit_and_credit"),
      options: [
        {
          value: t("Reports.Debit_and_credit"),
          link: "/all-reports/debit-credit",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Financial_reports") +
        slash +
        t("Reports.Currency_exchange"),
      options: [
        {
          value: t("Reports.Currency_exchange"),
          link: "/all-reports/currency-exchange",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Financial_reports") +
        slash +
        t("Sales.Product_and_services.Currency.Currency_history"),
      options: [
        {
          value: t("Sales.Product_and_services.Currency.Currency_history"),
          link: "/all-reports/currency-history",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Financial_reports") +
        slash +
        t("Expenses.1"),
      options: [
        {
          value: t("Expenses.1"),
          link: "/all-reports/expenses",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Financial_reports") +
        slash +
        t("Expenses.Income.1"),
      options: [
        {
          value: t("Expenses.Income.1"),
          link: "/all-reports/income",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Financial_reports") +
        slash +
        t("Reports.Cash_transactions"),
      options: [
        {
          value: t("Reports.Cash_transactions"),
          link: "/all-reports/cash-transactions",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Financial_reports") +
        slash +
        t("Banking.Money_transfer"),
      options: [
        {
          value: t("Banking.Money_transfer"),
          link: "/all-reports/money-transfer",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Warehouse_reports") +
        slash +
        t("Reports.Product_statistics"),
      options: [
        {
          value: t("Reports.Product_statistics"),
          link: "/all-reports/product-statistics",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Warehouse_reports") +
        slash +
        t("Reports.Expired_products"),
      options: [
        {
          value: t("Reports.Expired_products"),
          link: "/all-reports/expired-products",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Warehouse_reports") +
        slash +
        t("Reports.Product_deficits"),
      options: [
        {
          value: t("Reports.Product_deficits"),
          link: "/all-reports/product-deficits",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Warehouse_reports") +
        slash +
        t("Reports.Warehouse_statistics"),
      options: [
        {
          value: t("Reports.Warehouse_statistics"),
          link: "/all-reports/warehouse-statistics",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Warehouse_reports") +
        slash +
        t("Reports.Warehouse_cart_x"),
      options: [
        {
          value: t("Reports.Warehouse_cart_x"),
          link: "/all-reports/warehouse-cart-x",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Warehouse_reports") +
        slash +
        t("Sales.All_sales.Invoice.Sales_invoice"),
      options: [
        {
          value: t("Sales.All_sales.Invoice.Sales_invoice"),
          link: "/all-reports/sales",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Warehouse_reports") +
        slash +
        t("Reports.Total_sold_products"),
      options: [
        {
          value: t("Reports.Total_sold_products"),
          link: "/all-reports/total-sold-products",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Warehouse_reports") +
        slash +
        t("Sales.Customers.Table.Invoices"),
      options: [
        {
          value: t("Sales.Customers.Table.Invoices"),
          link: "/all-reports/invoices",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Warehouse_reports") +
        slash +
        t("Reports.Total_sold_by_customer"),
      options: [
        {
          value: t("Reports.Total_sold_by_customer"),
          link: "/all-reports/total-sold-by-customer",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Warehouse_reports") +
        slash +
        t("Reports.Product_purchases_price"),
      options: [
        {
          value: t("Reports.Product_purchases_price"),
          link: "/all-reports/product-purchase-price",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Warehouse_reports") +
        slash +
        t("Reports.Product_sales_price"),
      options: [
        {
          value: t("Reports.Product_sales_price"),
          link: "/all-reports/product-sales-price",
        },
      ],
    },
    {
      label:
        t("Reports.1") +
        slash +
        t("Reports.Warehouse_reports") +
        slash +
        t("Reports.Product_profit_average"),
      options: [
        {
          value: t("Reports.Product_profit_average"),
          link: "/all-reports/product-profit-average",
        },
      ],
    },
  ];
  return options;
};
export { createOption };
