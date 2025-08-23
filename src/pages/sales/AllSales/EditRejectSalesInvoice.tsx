import React from 'react';

import { useTranslation } from 'react-i18next';
import { SALES_REJECT_INVOICE_LIST } from '../../../constants/routes';
import EditInvoice from './Invoice/EditInvoice';

interface IProps {
  setVisible: (value: boolean) => void;
  record: any;
}
export const EditRejectSalesInvoice = (props: IProps) => {
  const { t } = useTranslation();
  return (
    <EditInvoice
      {...props}
      title={t('Sales.All_sales.Invoice.Edit_reject_sales_invoice')}
      baseUrl={SALES_REJECT_INVOICE_LIST}
      type='sales_rej'
    />
  );
};
