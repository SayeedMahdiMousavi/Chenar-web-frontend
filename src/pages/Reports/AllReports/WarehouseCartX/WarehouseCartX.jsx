import React from 'react';
import { useTranslation } from 'react-i18next';
import WarehouseCardXTable from './WarehouseCardXTable';
import ReportBody from '../../ReportBody';
import { WAREHOUSE_CARDX_LIST } from '../../../../constants/routes';

const baseUrl = WAREHOUSE_CARDX_LIST;
const WarehouseCardX = () => {
  const { t } = useTranslation();

  return (
    <ReportBody
      title={t('Reports.Warehouse_cart_x')}
      type='warehouse'
      table={<WarehouseCardXTable baseUrl={baseUrl} />}
    />
  );
};

export default WarehouseCardX;
