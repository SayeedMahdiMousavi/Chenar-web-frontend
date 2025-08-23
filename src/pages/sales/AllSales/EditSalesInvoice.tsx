import React from 'react';
import EditInvoice from './Invoice/EditInvoice';
import { useTranslation } from 'react-i18next';
import {
  SALES_INVOICE_LIST,
  SALES_ORDER_INVOICE_LIST,
} from '../../../constants/routes';

interface IProps {
  setVisible: (value: boolean) => void;
  record: any;
  type?: string;
}
export const EditSalesInvoice = (props: IProps) => {
  const { t } = useTranslation();
  return (
    <EditInvoice
      {...props}
      title={
        props?.type === 'salesOrder'
          ? t('Edit_sales_order')
          : t('Sales.All_sales.Invoice.Edit_sales_invoice')
      }
      baseUrl={
        props?.type === 'salesOrder'
          ? SALES_ORDER_INVOICE_LIST
          : SALES_INVOICE_LIST
      }
      type='sales'
    />
  );
};
