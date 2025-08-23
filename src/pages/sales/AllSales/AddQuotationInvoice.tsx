import React from 'react';
import AddInvoice from './Invoice/Invoice';
import { useTranslation } from 'react-i18next';
import { QUOTATION_INVOICE_LIST } from '../../../constants/routes';
export const AddQuotationInvoice = () => {
  const { t } = useTranslation();
  return (
    <AddInvoice
      title={t('Sales.All_sales.Invoice.Quotation_invoice')}
      baseUrl={QUOTATION_INVOICE_LIST}
      type='quotation'
    />
  );
};
