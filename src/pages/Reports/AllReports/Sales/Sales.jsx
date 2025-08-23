import React from 'react';
import { useTranslation } from 'react-i18next';
import SalesTable from './SalesTable';
import ReportBody from '../../ReportBody';
import { WAREHOUSE_SALES_INVOICE_LIST } from '../../../../constants/routes';

const AllSales = (props) => {
  const { t } = useTranslation();
  return (
    <ReportBody
      type='warehouse'
      title={t('Sales.All_sales.Invoice.Sales_invoice')}
      table={<SalesTable baseUrl={WAREHOUSE_SALES_INVOICE_LIST} />}
    />
  );
};

export default AllSales;
