import React, { Fragment, memo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  TableSettingsMenu,
  TableSettingsMenuItem,
  TableSettingsMenuMoreItem,
} from "../../../components";
import {
  PURCHASE_INVOICE_LIST,
  PURCHASE_REJECT_INVOICE_LIST,
  QUOTATION_INVOICE_LIST,
  SALES_INVOICE_LIST,
} from "../../../constants/routes";

function InvoicesTableSettings({
  setColumns,
  baseUrl,
  customer,
  date,
  description,
  createdBy,
  photo,
  total,
  currency,
  cashCurrency,
  cashAmount,
  createdAt,
  representative,
  invoiceStatus,
  modifiedBy,
  modifiedDate,
  ...rest
}: any) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <TableSettingsMenu {...rest}>
      <TableSettingsMenuItem
        setColumns={setColumns}
        name="customer"
        checked={customer}
      >
        {baseUrl === PURCHASE_INVOICE_LIST ||
        baseUrl === PURCHASE_REJECT_INVOICE_LIST
          ? t("Expenses.Suppliers.Supplier")
          : t("Sales.Customers.Customer")}
      </TableSettingsMenuItem>
      <TableSettingsMenuItem setColumns={setColumns} name="date" checked={date}>
        {t("Sales.Customers.Form.Date")}
      </TableSettingsMenuItem>
      <TableSettingsMenuItem
        setColumns={setColumns}
        name="total"
        checked={total}
      >
        {t("Sales.Customers.Form.Total")}
      </TableSettingsMenuItem>
      <TableSettingsMenuItem
        setColumns={setColumns}
        name="currency"
        checked={currency}
      >
        {t("Sales.Product_and_services.Inventory.Currency")}
      </TableSettingsMenuItem>
      {baseUrl !== QUOTATION_INVOICE_LIST && (
        <TableSettingsMenuItem
          setColumns={setColumns}
          name="cashCurrency"
          checked={cashCurrency}
        >
          {t("Sales.All_sales.Purchase_and_sales.Cash")}
        </TableSettingsMenuItem>
      )}
      {baseUrl === SALES_INVOICE_LIST && (
        <TableSettingsMenuItem
          setColumns={setColumns}
          name="representative"
          checked={representative}
        >
          {t("Representative")}
        </TableSettingsMenuItem>
      )}
      <TableSettingsMenuItem
        setColumns={setColumns}
        name="invoiceStatus"
        checked={invoiceStatus}
      >
        {t("Sales.Product_and_services.Status")}
      </TableSettingsMenuItem>

      {visible && (
        <Fragment>
          <TableSettingsMenuItem
            checked={createdBy}
            setColumns={setColumns}
            name="createdBy"
          >
            {t("Sales.Product_and_services.Form.Created_by")}
          </TableSettingsMenuItem>
          <TableSettingsMenuItem
            setColumns={setColumns}
            name="createdAt"
            checked={createdAt}
          >
            {t("Sales.Product_and_services.Form.Created_date")}
          </TableSettingsMenuItem>
          <TableSettingsMenuItem
            setColumns={setColumns}
            name="modifiedBy"
            checked={modifiedBy}
          >
            {t("Sales.Product_and_services.Form.Modified_by")}
          </TableSettingsMenuItem>
          <TableSettingsMenuItem
            setColumns={setColumns}
            name="modifiedDate"
            checked={modifiedDate}
          >
            {t("Sales.Product_and_services.Form.Modified_date")}
          </TableSettingsMenuItem>
          <TableSettingsMenuItem
            setColumns={setColumns}
            name="description"
            checked={description}
          >
            {t("Form.Description")}
          </TableSettingsMenuItem>
        </Fragment>
      )}
      <TableSettingsMenuMoreItem {...{ setVisible, visible }} />
    </TableSettingsMenu>
  );
}

//@ts-ignore
// eslint-disable-next-line no-func-assign
InvoicesTableSettings = memo(InvoicesTableSettings);

export default InvoicesTableSettings;
