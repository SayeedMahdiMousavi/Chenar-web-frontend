import React, { useMemo } from "react";
import { Form, TreeSelect } from "antd";
// import { permissionsList } from "../constants/permissions";
import { useTranslation } from "react-i18next";

interface IProps {
  label?: string;
  placeholder?: string;
  rules?: any;
  treeData: any[];
  form: any;
  getPermissionsId?:(data:number[]) => void
}

export function PermissionsFormItem(props: IProps) {
  const { t } = useTranslation();
  const handleChange = (value: string[]) => {
    let permissionsId:number[] = []
    for (let data of value){
      // 
      // 
      for (let perm of props.treeData){
       for (let child of perm?.children){
         if (data === child?.key){
           permissionsId.push(child.key)
         }
       }
        
      }

    }
    if (props?.getPermissionsId)
   props?.getPermissionsId(permissionsId)
  };

  const handleSelect = (value: string) => {
    
    // const splitValue = value?.split("_");
    // if (splitValue?.[0] === "change" || splitValue?.[0] === "delete") {
    //   const prevPermits = props?.form.getFieldValue("permissions");

    //   props?.form.setFieldsValue({
    //     permissions: [...prevPermits, `view_${splitValue?.[1]}`],
    //   });
    // }
  };

  const permissions = useMemo(() => {
    return [
      {
        title: t("Sales.Product_and_services.Inventory.1"),
        value: "inventory",
        children: [
          {
            title: "Product Management",
            value: "product_management",
            children: [
              {
                title: t("Sales.Product_and_services.1"),
                value: "product",
                children: [
                  {
                    title: "Can add Product",
                    value: "add_product",
                  },
                  {
                    title: "Can change Product",
                    value: "change_product",
                  },
                  {
                    title: "Can delete Product",
                    value: "delete_product",
                  },
                  {
                    title: "Can view Product",
                    value: "view_product",
                  },
                ],
              },
              {
                title: t("Sales.Product_and_services.Units.1"),
                value: "product_unit",
                children: [
                  {
                    title: "Can add unit",

                    value: "add_unit",
                  },
                  {
                    title: "Can change unit",

                    value: "change_unit",
                  },
                  {
                    title: "Can delete unit",

                    value: "delete_unit",
                  },
                  {
                    title: "Can view unit",

                    value: "view_unit",
                  },
                ],
              },
              {
                title: t(
                  "Sales.Product_and_services.Categories.Product_categories"
                ),
                value: "product_category",
                children: [
                  {
                    title: "Can add ProductCategory",
                    value: "add_productcategory",
                  },
                  {
                    title: "Can change ProductCategory",
                    value: "change_productcategory",
                  },
                  {
                    title: "Can delete ProductCategory",
                    value: "delete_productcategory",
                  },
                  {
                    title: "Can view ProductCategory",
                    value: "view_productcategory",
                  },
                ],
              },

              {
                title: t(
                  "Sales.Product_and_services.Inventory.Product_inventory"
                ),
                value: "product_inventory",
                children: [
                  {
                    title: "Can add on hand product",
                    value: "add_onhandproduct",
                  },
                  {
                    title: "Can change on hand product",
                    value: "change_onhandproduct",
                  },
                  {
                    title: "Can delete on hand product",
                    value: "delete_onhandproduct",
                  },
                  {
                    title: "Can view on hand product",
                    value: "view_onhandproduct",
                  },
                ],
              },
              {
                title: t("Sales.Product_and_services.Price_recording.1"),
                value: "price_recording",
                children: [
                  {
                    title: "Can add product price",
                    value: "add_productprice",
                  },
                  {
                    title: "Can change product price",
                    value: "change_productprice",
                  },
                  {
                    title: "Can delete product price",
                    value: "delete_productprice",
                  },
                  {
                    title: "Can view product price",
                    value: "view_productprice",
                  },
                ],
              },
            ],
          },
          {
            title: "Warehouse management",
            value: "warehouse_management",
            children: [
              {
                title: t("Warehouse.1"),
                value: "warehouse",
                children: [
                  {
                    title: "Can add warehouse",
                    value: "add_warehouse",
                  },
                  {
                    title: "Can change warehouse",
                    value: "change_warehouse",
                  },
                  {
                    title: "Can delete warehouse",
                    value: "delete_warehouse",
                  },
                  {
                    title: "Can view warehouse",
                    value: "view_warehouse",
                  },
                ],
              },
              {
                title: t("Sales.All_sales.Invoice.Product_transfer"),
                value: "product_transfer",
                children: [
                  {
                    title: "Can add product  transfer invoice",

                    value: "add_producttransferinvoice",
                  },
                  {
                    title: "Can change product  transfer invoice",

                    value: "change_producttransferinvoice",
                  },
                  {
                    title: "Can delete product  transfer invoice",

                    value: "delete_producttransferinvoice",
                  },
                  {
                    title: "Can view product  transfer invoice",

                    value: "view_producttransferinvoice",
                  },
                ],
              },
              {
                title: t("Warehouse.Warehouse_adjustment"),
                value: "warehouse_adjustment",
                children: [
                  {
                    title: "Can add product adjust invoice",

                    value: "add_productadjustinvoice",
                  },
                  {
                    title: "Can change product adjust invoice",

                    value: "change_productadjustinvoice",
                  },
                  {
                    title: "Can delete product adjust invoice",

                    value: "delete_productadjustinvoice",
                  },
                  {
                    title: "Can view product adjust invoice",

                    value: "view_productadjustinvoice",
                  },
                ],
              },
            ],
          },
          {
            title: t("Sales.All_sales.1"),
            value: "sales_and_purchases",
            children: [
              {
                title: t("Sales.All_sales.Invoice.Sales_invoice"),
                value: "sales_invoice",
                children: [
                  {
                    title: "Can add sales invoice",

                    value: "add_salesinvoice",
                  },
                  {
                    title: "Can change sales invoice",

                    value: "change_salesinvoice",
                  },
                  {
                    title: "Can delete sales invoice",

                    value: "delete_salesinvoice",
                  },
                  {
                    title: "Can view sales invoice",

                    value: "view_salesinvoice",
                  },
                ],
              },
              {
                title: t("Sales_order"),
                value: "sales_order_invoice",
                children: [
                  {
                    title: "Can add sales order invoice",

                    value: "add_salesorderinvoice",
                  },
                  {
                    title: "Can change sales order invoice",

                    value: "change_salesorderinvoice",
                  },
                  {
                    title: "Can delete sales order invoice",

                    value: "delete_salesorderinvoice",
                  },
                  {
                    title: "Can view sales order invoice",

                    value: "view_salesorderinvoice",
                  },
                ],
              },
              {
                title: t("Sales.All_sales.Invoice.Reject_sales_invoice"),
                value: "sales_return_invoice",
                children: [
                  {
                    title: "Can add sales reject invoice",

                    value: "add_salesrejectinvoice",
                  },
                  {
                    title: "Can change sales reject invoice",

                    value: "change_salesrejectinvoice",
                  },
                  {
                    title: "Can delete sales reject invoice",

                    value: "delete_salesrejectinvoice",
                  },
                  {
                    title: "Can view sales reject invoice",

                    value: "view_salesrejectinvoice",
                  },
                ],
              },
              {
                title: t("Sales.All_sales.Invoice.Purchase_invoice"),
                value: "purchase_invoice",
                children: [
                  {
                    title: "Can add purchase  invoice",

                    value: "add_purchaseinvoice",
                  },
                  {
                    title: "Can change purchase  invoice",

                    value: "change_purchaseinvoice",
                  },
                  {
                    title: "Can delete purchase  invoice",

                    value: "delete_purchaseinvoice",
                  },
                  {
                    title: "Can view purchase  invoice",

                    value: "view_purchaseinvoice",
                  },
                ],
              },
              {
                title: t("Purchase_order"),
                value: "purchase_order_invoice",
                children: [
                  {
                    title: "Can add sales order invoice",

                    value: "add_purchaseorderinvoice",
                  },
                  {
                    title: "Can change sales order invoice",

                    value: "change_purchaseorderinvoice",
                  },
                  {
                    title: "Can delete sales order invoice",

                    value: "delete_purchaseorderinvoice",
                  },
                  {
                    title: "Can view sales order invoice",

                    value: "view_purchaseorderinvoice",
                  },
                ],
              },
              {
                title: t("Sales.All_sales.Invoice.Reject_purchase_invoice"),
                value: "return_purchase_invoice",
                children: [
                  {
                    title: "Can add purchase reject invoice",
                    value: "add_purchaserejectinvoice",
                  },
                  {
                    title: "Can change purchase reject invoice",
                    value: "change_purchaserejectinvoice",
                  },
                  {
                    title: "Can delete purchase reject invoice",
                    value: "delete_purchaserejectinvoice",
                  },
                  {
                    title: "Can view purchase reject invoice",
                    value: "view_purchaserejectinvoice",
                  },
                ],
              },
              {
                title: t("Sales.All_sales.Invoice.Quotation_invoice"),
                value: "quotation_invoice",
                children: [
                  {
                    title: "Can add estimate invoice",

                    value: "add_estimateinvoice",
                  },
                  {
                    title: "Can change estimate invoice",

                    value: "change_estimateinvoice",
                  },
                  {
                    title: "Can delete estimate invoice",

                    value: "delete_estimateinvoice",
                  },
                  {
                    title: "Can view estimate invoice",
                    value: "view_estimateinvoice",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: t("Contacts.1"),
        value: "contacts",
        children: [
          {
            title: "Customer management",
            value: "customer_management",
            children: [
              {
                title: t("Sales.Customers.1"),
                value: "customers",
                children: [
                  {
                    title: "Can add customer",

                    value: "add_customer",
                  },
                  {
                    title: "Can change customer",

                    value: "change_customer",
                  },
                  {
                    title: "Can delete customer",

                    value: "delete_customer",
                  },
                  {
                    title: "Can view customer",

                    value: "view_customer",
                  },
                ],
              },
              {
                title: t("Sales.Customers.Customer_Categories"),
                value: "customers_categories",
                children: [
                  {
                    title: "Can add customer category",

                    value: "add_customercategory",
                  },
                  {
                    title: "Can change customer category",

                    value: "change_customercategory",
                  },
                  {
                    title: "Can delete customer category",

                    value: "delete_customercategory",
                  },
                  {
                    title: "Can view customer category",

                    value: "view_customercategory",
                  },
                ],
              },
              {
                title: t("Employees.Pay_and_receive_cash"),
                value: "customers_pay_and_receive_cash",
                children: [
                  {
                    title: "Can add customer pay and receive",
                    value: "add_customerpayrec",
                  },
                  {
                    title: "Can change customer pay and receive",
                    value: "change_customerpayrec",
                  },
                  {
                    title: "Can delete customer pay and receive",
                    value: "delete_customerpayrec",
                  },
                  {
                    title: "Can view customer pay and receive",
                    value: "view_customerpayrec",
                  },
                ],
              },
            ],
          },
          {
            title: "Supplier management",
            value: "supplier_management",
            children: [
              {
                title: t("Expenses.Suppliers.1"),
                value: "suppliers",
                children: [
                  {
                    title: "Can add Supplier",

                    value: "add_supplier",
                  },
                  {
                    title: "Can change Supplier",

                    value: "change_supplier",
                  },
                  {
                    title: "Can delete Supplier",

                    value: "delete_supplier",
                  },
                  {
                    title: "Can view Supplier",

                    value: "view_supplier",
                  },
                ],
              },
              {
                title: t("Expenses.Suppliers.Suppliers_categories"),
                value: "supplier_category",
                children: [
                  {
                    title: "Can add SupplierCategory",

                    value: "add_suppliercategory",
                  },
                  {
                    title: "Can change SupplierCategory",

                    value: "change_suppliercategory",
                  },
                  {
                    title: "Can delete SupplierCategory",

                    value: "delete_suppliercategory",
                  },
                  {
                    title: "Can view SupplierCategory",

                    value: "view_suppliercategory",
                  },
                ],
              },
              {
                title: t("Employees.Pay_and_receive_cash"),
                value: "supplier_pay_and_receive_cash",
                children: [
                  {
                    title: "Can add supplier pay and receive",

                    value: "add_supplierpayrec",
                  },
                  {
                    title: "Can change supplier pay and receive",

                    value: "change_supplierpayrec",
                  },
                  {
                    title: "Can delete supplier pay and receive",

                    value: "delete_supplierpayrec",
                  },
                  {
                    title: "Can view supplier pay and receive",

                    value: "view_supplierpayrec",
                  },
                ],
              },
            ],
          },
          {
            title: "Employee management",
            value: "employee_management",
            children: [
              {
                title: t("Employees.1"),
                value: "employees",
                children: [
                  {
                    title: "Can add Staff",

                    value: "add_staff",
                  },
                  {
                    title: "Can change Staff",

                    value: "change_staff",
                  },
                  {
                    title: "Can delete Staff",

                    value: "delete_staff",
                  },
                  {
                    title: "Can view Staff",

                    value: "view_staff",
                  },
                ],
              },
              {
                title: t("Employees.Employees_categories"),
                value: "employee_category",
                children: [
                  {
                    title: "Can add StaffCategory",

                    value: "add_staffcategory",
                  },
                  {
                    title: "Can change StaffCategory",

                    value: "change_staffcategory",
                  },
                  {
                    title: "Can delete StaffCategory",

                    value: "delete_staffcategory",
                  },
                  {
                    title: "Can view StaffCategory",

                    value: "view_staffcategory",
                  },
                ],
              },
              {
                title: t("Employees.Pay_and_receive_cash"),
                value: "employee_pay_and_receive_cash",
                children: [
                  {
                    title: "Can add staff pay and receive",

                    value: "add_staffpayrec",
                  },
                  {
                    title: "Can change staff pay and receive",

                    value: "change_staffpayrec",
                  },
                  {
                    title: "Can delete staff pay and receive",

                    value: "delete_staffpayrec",
                  },
                  {
                    title: "Can view staff pay and receive",

                    value: "view_staffpayrec",
                  },
                ],
              },
              {
                title: t("Employees.Record_salaries"),
                value: "record_salaries",
                children: [
                  {
                    title: "Can add staff salary",
                    value: "add_staffsalary",
                  },
                  {
                    title: "Can change staff salary",
                    value: "change_staffsalary",
                  },
                  {
                    title: "Can delete staff salary",
                    value: "delete_staffsalary",
                  },
                  {
                    title: "Can view staff salary",
                    value: "view_staffsalary",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: t("Expenses.Expenses_and_incomes"),
        value: "expenses_and_income",
        children: [
          {
            title: "Manage expenses",
            value: "manage_expenses",
            children: [
              {
                title: t("Expenses.1"),
                value: "expenses",
                children: [
                  {
                    title: "Can add expense cash",
                    value: "add_expensecashfin",
                  },
                  {
                    title: "Can change expense cash",
                    value: "change_expensecashfin",
                  },
                  {
                    title: "Can delete expense cash",
                    value: "delete_expensecashfin",
                  },
                  {
                    title: "Can view expense cash",
                    value: "view_expensecashfin",
                  },
                ],
              },
              {
                title: t("Expenses.Expenses_definition"),
                value: "expenses_definition",
                children: [
                  {
                    title: "Can add ExpenseType",
                    value: "add_expensetype",
                  },
                  {
                    title: "Can change ExpenseType",
                    value: "change_expensetype",
                  },
                  {
                    title: "Can delete ExpenseType",
                    value: "delete_expensetype",
                  },
                  {
                    title: "Can view ExpenseType",
                    value: "view_expensetype",
                  },
                ],
              },
              {
                title: t("Expenses.Expenses_categories"),
                value: "expenses_categories",
                children: [
                  {
                    title: "Can add ExpenseCategory",

                    value: "add_expensecategory",
                  },
                  {
                    title: "Can change ExpenseCategory",

                    value: "change_expensecategory",
                  },
                  {
                    title: "Can delete ExpenseCategory",

                    value: "delete_expensecategory",
                  },
                  {
                    title: "Can view ExpenseCategory",

                    value: "view_expensecategory",
                  },
                ],
              },
            ],
          },
          {
            title: "Manage incomes",
            value: "manage_incomes",
            children: [
              {
                title: t("Expenses.Income.1"),
                value: "incomes",
                children: [
                  {
                    title: "Can add income cash",

                    value: "add_incomecashfin",
                  },
                  {
                    title: "Can change income cash",

                    value: "change_incomecashfin",
                  },
                  {
                    title: "Can delete income cash",

                    value: "delete_incomecashfin",
                  },
                  {
                    title: "Can view income cash",

                    value: "view_incomecashfin",
                  },
                ],
              },
              {
                title: t("Expenses.Income.Income_type"),
                value: "incomes_type",
                children: [
                  {
                    title: "Can add IncomeType",
                    value: "add_incometype",
                  },
                  {
                    title: "Can change IncomeType",
                    value: "change_incometype",
                  },
                  {
                    title: "Can delete IncomeType",
                    value: "delete_incometype",
                  },
                  {
                    title: "Can view IncomeType",
                    value: "view_incometype",
                  },
                ],
              },
            ],
          },
          {
            title: "Manage withdraws",
            value: "manage_withdraws",
            children: [
              {
                title: t("Expenses.With_draw.1"),
                value: "With_draw",
                children: [
                  {
                    title: "Can add withdrawals or reject withdrawals",

                    value: "add_withdrawpayrec",
                  },
                  {
                    title: "Can change withdrawals or reject withdrawals",

                    value: "change_withdrawpayrec",
                  },
                  {
                    title: "Can delete withdrawals or reject withdrawals",

                    value: "delete_withdrawpayrec",
                  },
                  {
                    title: "Can view withdrawals or reject withdrawals",

                    value: "view_withdrawpayrec",
                  },
                ],
              },
              {
                title: t("Expenses.With_draw.With_definition"),
                value: "Withdraw_definition",
                children: [
                  {
                    title: "Can add WidthDraw",
                    value: "add_widthdraw",
                  },
                  {
                    title: "Can change WidthDraw",
                    value: "change_widthdraw",
                  },
                  {
                    title: "Can delete WidthDraw",
                    value: "delete_widthdraw",
                  },
                  {
                    title: "Can view WidthDraw",
                    value: "view_widthdraw",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: t("Banking.Banking_and_cash"),
        value: "bank_and_cash",
        children: [
          {
            title: t("Banking.1"),
            value: "banking",
            children: [
              {
                title: "Can add bank",

                value: "add_bank",
              },
              {
                title: "Can change bank",

                value: "change_bank",
              },
              {
                title: "Can delete bank",

                value: "delete_bank",
              },
              {
                title: "Can view bank",

                value: "view_bank",
              },
            ],
          },
          {
            title: t("Banking.Cash_box.1"),
            value: "cash_box",
            children: [
              {
                title: "Can add Cash",

                value: "add_cash",
              },
              {
                title: "Can change Cash",

                value: "change_cash",
              },
              {
                title: "Can delete Cash",

                value: "delete_cash",
              },
              {
                title: "Can view Cash",

                value: "view_cash",
              },
            ],
          },
          {
            title: t("Banking.Money_transfer"),
            value: "money_transfer",
            children: [
              {
                title: "Can add cash transfer",

                value: "add_bankcashtransfer",
              },
              {
                title: "Can change cash transfer",

                value: "change_bankcashtransfer",
              },
              {
                title: "Can delete cash transfer",

                value: "delete_bankcashtransfer",
              },
              {
                title: "Can view cash transfer",

                value: "view_bankcashtransfer",
              },
            ],
          },
        ],
      },
      {
        title: t("Sales.Product_and_services.Currency.Currency_and_exchange"),
        value: "currency_and_exchange",
        children: [
          {
            title: t("Sales.Product_and_services.Currency.1"),
            value: "currency",
            children: [
              {
                title: "Can add currency",

                value: "add_currency",
              },
              {
                title: "Can change currency",

                value: "change_currency",
              },
              {
                title: "Can delete currency",

                value: "delete_currency",
              },
              {
                title: "Can view currency",

                value: "view_currency",
              },
            ],
          },
          {
            title: t("Sales.Product_and_services.Currency.Currency_rate"),
            value: "currency_rate",
            children: [
              {
                title: "Can add currency rate",

                value: "add_currencyrate",
              },
              {
                title: "Can change currency rate",

                value: "change_currencyrate",
              },
              {
                title: "Can delete currency rate",

                value: "delete_currencyrate",
              },
              {
                title: "Can view currency rate",

                value: "view_currencyrate",
              },
            ],
          },
          {
            title: t("Reports.Currency_exchange"),
            value: "currency_exchange",
            children: [
              {
                title: "Can add exchange union",
                value: "add_exchangeunion",
              },
              {
                title: "Can change exchange union",
                value: "change_exchangeunion",
              },
              {
                title: "Can delete exchange union",
                value: "delete_exchangeunion",
              },
              {
                title: "Can view exchange union",
                value: "view_exchangeunion",
              },
            ],
          },
        ],
      },
      {
        title: t("Accounting.1"),
        value: "accounting",
        children: [
          {
            title: t("Accounting.Chart_of_accounts.1"),
            value: "chart_of_accounts",
            children: [
              {
                title: "Can view ChartOfAccount",
                value: "view_chartofaccount",
              },
            ],
          },
          {
            title: t("Opening_accounts.1"),
            value: "opening_accounts",
            children: [
              {
                title: "Can add opening balance",

                value: "add_openingbalance",
              },
              {
                title: "Can change opening balance",

                value: "change_openingbalance",
              },
              {
                title: "Can delete opening balance",

                value: "delete_openingbalance",
              },
              {
                title: "Can view opening balance",

                value: "view_openingbalance",
              },
            ],
          },
          {
            title: t("Company.Financial_period"),
            value: "fiscal_year",
            children: [
              {
                title: "Can add Financial Period",
                value: "add_financialperiod",
              },
              {
                title: "Can change Financial Period",
                value: "change_financialperiod",
              },
              {
                title: "Can delete Financial Period",
                value: "delete_financialperiod",
              },
              {
                title: "Can view Financial Period",
                value: "view_financialperiod",
              },
            ],
          },
        ],
      },
      {
        title: t("Manage_users.Settings"),
        value: "settings",
        children: [
          {
            title: t("Company.Account_and_settings"),
            value: "general_settings",
            children: [
              {
                title: t("Company.1"),
                value: "company",
                children: [
                  {
                    title: "Can add CompanyInfo",
                    value: "add_companyinfo",
                  },
                  {
                    title: "Can change CompanyInfo",
                    value: "change_companyinfo",
                  },
                  {
                    title: "Can delete CompanyInfo",
                    value: "delete_companyinfo",
                  },
                  {
                    title: "Can view CompanyInfo",
                    value: "view_companyinfo",
                  },
                ],
              },
              {
                title: t("Company.SMTP_email"),
                value: "SMTP_email",
                children: [
                  {
                    title: "Can add CompanySmtp",
                    value: "add_companysmtp",
                  },
                  {
                    title: "Can change CompanySmtp",
                    value: "change_companysmtp",
                  },
                  {
                    title: "Can delete CompanySmtp",
                    value: "delete_companysmtp",
                  },
                  {
                    title: "Can view CompanySmtp",
                    value: "view_companysmtp",
                  },
                ],
              },
            ],
          },
          {
            title: t("Auditing.1"),
            value: "auditing",
            children: [
              {
                title: t("Auditing.Login"),
                value: "login_auditing",
                children: [
                  {
                    title: "Can view login event",
                    value: "view_loginevent",
                  },
                ],
              },
              {
                title: t("Auditing.Crud"),
                value: "crud_auditing",
                children: [
                  {
                    title: "Can view CRUD event",
                    value: "view_crudevent",
                  },
                ],
              },
            ],
          },
          {
            title: t("Custom_form_styles.1"),
            value: "custom_form_styles",
            children: [
              {
                title: "Can add pos invoice setting",

                value: "add_posinvoicesetting",
              },
              {
                title: "Can change pos invoice setting",

                value: "change_posinvoicesetting",
              },
              {
                title: "Can delete pos invoice setting",

                value: "delete_posinvoicesetting",
              },
              {
                title: "Can view pos invoice setting",

                value: "view_posinvoicesetting",
              },
            ],
          },
        ],
      },
      {
        title: t("Manage_users.1"),
        value: "manage_users",
        children: [
          {
            title: t("Manage_users.Users"),
            value: "users",
            children: [
              {
                title: "Can add SystemUser",
                value: "add_systemuser",
              },
              {
                title: "Can change SystemUser",
                value: "change_systemuser",
              },
              {
                title: "Can delete SystemUser",
                value: "delete_systemuser",
              },
              {
                title: "Can view SystemUser",
                value: "view_systemuser",
              },
            ],
          },
          {
            title: t("Roles"),
            value: "roles",
            children: [
              {
                title: "Can add group",
                value: "add_group",
              },
              {
                title: "Can change group",
                value: "change_group",
              },
              {
                title: "Can delete group",
                value: "delete_group",
              },
              {
                title: "Can view group",
                value: "view_group",
              },
            ],
          },
        ],
      },
      {
        title: "Manage backups",
        value: "manage_backups",
        children: [
          {
            title: t("Company.Backup"),
            value: "backup",
            children: [
              {
                title: "Can add backup",
                value: "add_backup",
              },
              {
                title: "Can change backup",
                value: "change_backup",
              },
              {
                title: "Can delete backup",
                value: "delete_backup",
              },
              {
                title: "Can view backup",
                value: "view_backup",
              },
              {
                title: "Can restore backup",
                value: "restore_backup",
              },
              {
                title: "Can upload to cloud",
                value: "upload_to_cloud_backup",
              },
            ],
          },
          {
            title: t("Company.Online_drive_settings"),
            value: "online_drive_settings",
            children: [
              {
                title: "Can add backup settings",
                value: "add_backupsettings",
              },
              {
                title: "Can change backup settings",
                value: "change_backupsettings",
              },
              {
                title: "Can delete backup settings",
                value: "delete_backupsettings",
              },
              {
                title: "Can view backup settings",
                value: "view_backupsettings",
              },
            ],
          },
        ],
      },
      {
        title: t("Reports.1"),
        value: "reports",
        children: [
          {
            title: t("Reports.Financial_reports"),
            value: "financial_reports",
            children: [
              {
                title: t("Reports.Financial_statement"),
                value: "financial_statement",
                children: [
                  {
                    title: "Can view journal report",
                    value: "view_JournalReport",
                  },
                  {
                    title: "Can view profit and lost report",
                    value: "view_ProfitAndLostReport",
                  },
                  {
                    title: "Can view fiscal profit report",
                    value: "view_FiscalProfitReport",
                  },
                  {
                    title: "Can view main balance report",
                    value: "view_MainBalanceReport",
                  },
                  {
                    title: "Can view trial balance report",
                    value: "view_TrialBalanceReport",
                  },
                  {
                    title: "Can view detailed balance report",
                    value: "view_DetailedBalanceReport",
                  },
                ],
              },
              {
                title: t("Reports.Accounts_statistics"),
                value: "accounts_statistics",
                children: [
                  {
                    title: "Can view account statistic report",
                    value: "view_AccountStatisticReport",
                  },
                  {
                    title: "Can view account debit credit report",
                    value: "view_AccountDebitCreditReport",
                  },
                ],
              },
              {
                title: t("Sales.Product_and_services.Currency.1"),
                value: "currency_reports",
                children: [
                  {
                    title: "Can view exchange union",
                    value: "view_exchangeunion",
                  },
                  {
                    title: "Can view currency rate",
                    value: "view_currencyrate",
                  },
                ],
              },
              {
                title: t("Expenses.Expenses_and_incomes"),
                value: "expenses_and_incomes_reports",
                children: [
                  {
                    title: "Can view expense cash",
                    value: "view_expensecashfin",
                  },
                  {
                    title: "Can view income cash",
                    value: "view_incomecashfin",
                  },
                ],
              },
              {
                title: t("Reports.Extra"),
                value: "financial_extra_reports",
                children: [
                  {
                    title: "Can view cash flow",
                    value: "view_cashflow",
                  },
                ],
              },
            ],
          },
          {
            title: t("Reports.Warehouse_reports"),
            value: "warehouse_reports",
            children: [
              {
                title: t("Reports.Product_statistics"),
                value: "product_statistics",
                children: [
                  {
                    title: "Can view product statistic report",
                    value: "view_ProductStatisticReport",
                  },
                  {
                    title: "Can view product expiration report",
                    value: "view_ProductExpirationReport",
                  },
                  {
                    title: "Can view product deficits report",
                    value: "view_ProductDeficitsReport",
                  },
                ],
              },
              {
                title: t("Reports.Warehouse_statistics"),
                value: "warehouse_statistics",
                children: [
                  {
                    title: "Can view warehouse statistic report",
                    value: "view_WarehouseStatisticReport",
                  },
                  {
                    title: "Can view warehouse cardext report",
                    value: "view_WarehouseCardextReport",
                  },
                ],
              },
              {
                title: t("Reports.Sales_and_purchases"),
                value: "sales_and_purchases",
                children: [
                  {
                    title: "Can view sales invoice report",
                    value: "view_SalesInvoiceReport",
                  },
                  {
                    title: "Can view invoice report",
                    value: "view_InvoiceReport",
                  },
                  {
                    title: "Can view invoice by product report",
                    value: "view_InvoiceByProductReport",
                  },
                  {
                    title: "Can view invoice by person report",
                    value: "view_InvoiceByPersonReport",
                  },
                ],
              },
              {
                title: t("Reports.Sales_and_purchases_price"),
                value: "sales_and_purchases_price",
                children: [
                  {
                    title: "Can view purchase price report view set",
                    value: "view_PurchasePriceReportViewSet",
                  },
                  {
                    title: "Can view sales price report view set",
                    value: "view_SalesPriceReportViewSet",
                  },
                ],
              },
              {
                title: t("Reports.Extra"),
                value: "warehouse_extra_reports",
                children: [
                  {
                    title: "Can view product profit report",
                    value: "view_ProductProfitReport",
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  }, [t]);

  return (
    <Form.Item label={props?.label} name="permissions" rules={props?.rules}>
      <TreeSelect
        showSearch
        onChange={handleChange}
        treeData={props?.treeData}
        treeCheckable={true}
        allowClear
        onSelect={handleSelect as any}
        dropdownMatchSelectWidth={false}
        placeholder={props?.placeholder}
        className="num"
        // maxTagCount={5}
        showarrow={true}
      />
    </Form.Item>
  );
}
