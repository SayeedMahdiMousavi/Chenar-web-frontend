import React from 'react';
import AddInvoice from './Invoice/Invoice';
import { useTranslation } from 'react-i18next';
import { SALES_INVOICE_LIST } from '../../../constants/routes';
export const SalesInvoice = () => {
  const { t } = useTranslation();
  return (
    <AddInvoice
      title={t('Sales.All_sales.Invoice.Sales_invoice')}
      baseUrl={SALES_INVOICE_LIST}
      type='sales'
    />
  );
};
