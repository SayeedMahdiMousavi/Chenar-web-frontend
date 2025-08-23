import React from 'react';
import AddInvoice from './Invoice/Invoice';
import { useTranslation } from 'react-i18next';
import { PURCHASE_INVOICE_LIST } from '../../../constants/routes';
export const AddPurchaseInvoice = () => {
  const { t } = useTranslation();
  return (
    <AddInvoice
      title={t('Sales.All_sales.Invoice.Purchase_invoice')}
      baseUrl={PURCHASE_INVOICE_LIST}
      type='purchase'
    />
  );
};
