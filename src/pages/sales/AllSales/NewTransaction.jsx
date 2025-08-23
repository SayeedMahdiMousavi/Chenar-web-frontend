import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu } from 'antd';
import { SalesInvoice } from './SalesInvoice';
import { AddPurchaseInvoice } from './AddPurchaseInvoice';
import { AddQuotationInvoice } from './AddQuotationInvoice';
import MarketInvoice from './MarketInvoice';
import { RejectSalesInvoice } from './RejectSalesInvoice';
import { RejectPurchaseInvoice } from './RejectPurchaseInvoice';
// import ProductTransfer from "./ProductTransfer/ProductTransfer";
import { checkPermissions } from '../../../Functions';
import {
  // PRODUCT_TRANSFER_INVOICE_M,
  PURCHASE_INVOICE_M,
  QUOTATION_INVOICE_M,
  SALES_INVOICE_M,
  SALES_REJ_INVOICE_M,
} from '../../../constants/permissions';
import { AddSalesOrder } from './AddSalesOrder';
import { AddPurchaseOrder } from './AddPurchaseOrder';
import { PageNewDropdown } from '../../../components';

function NewTransaction() {
  const { t } = useTranslation();

  const menu = (
    <Menu>
      {/* <Menu.Item key="1">
        {market ? <MarketInvoice /> : <NewInvoice />}
      </Menu.Item> */}
      <Menu.ItemGroup title={t('Sales.1')}>
        {checkPermissions(`add_${SALES_INVOICE_M}`) && (
          <Menu.Item key='1'>
            <MarketInvoice />
          </Menu.Item>
        )}
        {checkPermissions(`add_${SALES_INVOICE_M}`) && (
          <Menu.Item key='2'>
            <SalesInvoice />
          </Menu.Item>
        )}
        {checkPermissions(`add_${SALES_INVOICE_M}`) && (
          <Menu.Item key='3'>
            <AddSalesOrder />
          </Menu.Item>
        )}
        {checkPermissions(`add_${SALES_REJ_INVOICE_M}`) && (
          <Menu.Item key='4'>
            <RejectSalesInvoice />
          </Menu.Item>
        )}
      </Menu.ItemGroup>
      <Menu.ItemGroup title={t('Purchase')}>
        {checkPermissions(`add_${PURCHASE_INVOICE_M}`) && (
          <Menu.Item key='5'>
            <AddPurchaseInvoice />
          </Menu.Item>
        )}
        {checkPermissions(`add_${PURCHASE_INVOICE_M}`) && (
          <Menu.Item key='6'>
            <AddPurchaseOrder />
          </Menu.Item>
        )}
        {checkPermissions(`add_${PURCHASE_INVOICE_M}`) && (
          <Menu.Item key='7'>
            <RejectPurchaseInvoice />
          </Menu.Item>
        )}
      </Menu.ItemGroup>
      {checkPermissions(`add_${QUOTATION_INVOICE_M}`) && (
        <Menu.Item key='8'>
          <AddQuotationInvoice />
        </Menu.Item>
      )}
      {/* {checkPermissions(`add_${PRODUCT_TRANSFER_INVOICE_M}`) && (
        <Menu.Item key="9">
          <ProductTransfer />
        </Menu.Item>
      )} */}

      {/* <Menu.Item key="2" onClick={onDelete}>
        {t("Sales.Customers.Details.Payment")}
      </Menu.Item>
      <Menu.Item key="3" onClick={onDelete}>
        {t("Sales.Customers.Details.Sales_recipe")}
      </Menu.Item>
      <Menu.Item key="4" onClick={onDelete}>
        {t("Sales.Customers.Estimate")}
      </Menu.Item>
      <Menu.Item key="5" onClick={onDelete}>
        {t("Sales.Customers.Details.Delayed_charge")}
      </Menu.Item>
      <Menu.Item key="6" onClick={onDelete}>
        {t("Sales.Customers.Details.Credit_note")}
      </Menu.Item>
      <Menu.Item key="7" onClick={onDelete}>
        {t("Sales.Customers.Details.Time_activity")}
      </Menu.Item> */}
    </Menu>
  );
  return (
    <PageNewDropdown
      overlay={menu}
      text={t('Sales.All_sales.Purchase_and_sales.New_invoice')}
    />
  );
}

export default NewTransaction;
