import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Dropdown } from 'antd';
import { useQueryClient } from 'react-query';
import ActionButton from '../../../SelfComponents/ActionButton';
import EditProductTransfer from './EditProductTransfer';
import {
  expireProductsBaseUrl,
  productStatisticsBaseUrl,
} from '../../../Reports/AllReports/AllReports';
import { RemovePopconfirm } from '../../../../components';
import { useRemoveItem } from '../../../../Hooks';
import { PRODUCT_TRANSFER_INVOICE_M } from '../../../../constants/permissions';
import { WAREHOUSE_PRODUCT_TRANSFER_LIST } from '../../../../constants/routes';
import ReadonlyInvoiceItems from '../ReadonlyInvoiceItems';

function WarehouseProductTransferAction({ record, hasSelected }: any) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const handleUpdateItems = useCallback(() => {
    queryClient.invalidateQueries(`${WAREHOUSE_PRODUCT_TRANSFER_LIST}`);

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
    baseUrl: `${WAREHOUSE_PRODUCT_TRANSFER_LIST}${record?.id}/`,
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
        permission={PRODUCT_TRANSFER_INVOICE_M}
      />
      <Menu.Item onClick={handleClickEdit}>
        <ReadonlyInvoiceItems
          setVisible={setVisible}
          record={record}
          {...{
            baseUrl: WAREHOUSE_PRODUCT_TRANSFER_LIST,
            type: 'productTransfer',
            title: t('Sales.All_sales.Invoice.Product_transfer'),
            permission: PRODUCT_TRANSFER_INVOICE_M,
          }}
        />
      </Menu.Item>
      <EditProductTransfer
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

export default WarehouseProductTransferAction;
