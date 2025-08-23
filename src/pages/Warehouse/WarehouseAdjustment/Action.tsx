import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Dropdown } from 'antd';
import { useQueryClient } from 'react-query';
import ActionButton from '../../SelfComponents/ActionButton';
import {
  expireProductsBaseUrl,
  productStatisticsBaseUrl,
} from '../../Reports/AllReports/AllReports';
import { RemovePopconfirm } from '../../../components';
import { useRemoveItem } from '../../../Hooks';
import { WAREHOUSE_ADJUSTMENT_M } from '../../../constants/permissions';
import { WAREHOUSE_ADJUSTMENT_INVOICE_LIST } from '../../../constants/routes';
import ReadonlyInvoiceItems from '../../sales/AllSales/ReadonlyInvoiceItems';
import EditWarehouseAdjustment from './Edit';

function WarehouseAdjustmentAction({ record, hasSelected }: any) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const handleUpdateItems = useCallback(() => {
    queryClient.invalidateQueries(`${WAREHOUSE_ADJUSTMENT_INVOICE_LIST}`);
    queryClient.invalidateQueries(expireProductsBaseUrl);
    queryClient.invalidateQueries(productStatisticsBaseUrl);
  }, [queryClient]);

  //delete invoice item
  const {
    reset,
    isLoading,
    handleDeleteItem,
    removeVisible,
    setRemoveVisible,
  } = useRemoveItem({
    baseUrl: `${WAREHOUSE_ADJUSTMENT_INVOICE_LIST}${record?.id}/`,
    setVisible,
    recordName: `${t('Sales.All_sales.Invoice.Invoice')} ${record?.id}`,
    handleUpdateItems: handleUpdateItems,
  });

  const handleCancel = () => {
    setVisible(false);
    setRemoveVisible(false);
    reset();
  };

  const handleClickRemove = () => {
    setRemoveVisible(!removeVisible);
  };

  const handleClickEdit = useCallback(() => {
    setRemoveVisible(false);
  }, [setRemoveVisible]);

  const action = (
    <Menu>
      <RemovePopconfirm
        itemName={`${t('Sales.All_sales.Invoice.Invoice')} ${record?.id}`}
        openConfirm={removeVisible}
        loading={isLoading}
        onConfirm={handleDeleteItem}
        onCancel={handleCancel}
        onClick={handleClickRemove}
        permission={WAREHOUSE_ADJUSTMENT_M}
      />
      <Menu.Item onClick={handleClickEdit}>
        <ReadonlyInvoiceItems
          setVisible={setVisible}
          record={record}
          {...{
            baseUrl: WAREHOUSE_ADJUSTMENT_INVOICE_LIST,
            type: 'warehouseAdjustment',
            title: t('Warehouse.Warehouse_adjustment'),
            permission: WAREHOUSE_ADJUSTMENT_M,
          }}
        />
      </Menu.Item>
      <EditWarehouseAdjustment
        {...{
          handleClickEdit,
          setVisible,
          recordId: record?.id,
          recordDate: record?.date_time,
          recordCurrency: record?.currency,
          recordCurrencyRate: record?.currency_rate,
        }}
      />
    </Menu>
  );

  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag);
  };

  return (
    <Dropdown
      overlay={action}
      trigger={['click']}
      onOpenChange={handleVisibleChange}
      open={visible}
      disabled={hasSelected}
    >
      <ActionButton onClick={handleVisibleChange} />
    </Dropdown>
  );
}

export default WarehouseAdjustmentAction;
