import React from 'react';
import axiosInstance from '../../ApiBaseUrl';
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../../MediaQurey';
import { useCallback } from 'react';
import { useMemo } from 'react';
import ShowDate from '../../SelfComponents/JalaliAntdComponents/ShowDate';
import { Statistics } from '../../../components/antd';
import { PRODUCT_INVENTORY_M } from '../../../constants/permissions';
import { PRODUCT_INVENTORY_LIST } from '../../../constants/routes';
import { PaginateTable } from '../../../components/antd/PaginateTable';
import ProductInventoryAction from './Action';
import { checkPermissions } from '../../../Functions';

const expireDateFormat = 'YYYY-MM-DD';
const expireDatePFormat = 'jYYYY/jM/jD';
const { Column } = Table;
const ProductInventory = ({
  handleUpdateItems,
}: {
  handleUpdateItems: () => void;
}) => {
  const isMobile = useMediaQuery('(max-width:400px)');
  const { t } = useTranslation();

  const columns = useMemo(
    () => (type: string, hasSelected: boolean) => {
      const sorter = type !== 'print';
      return (
        <React.Fragment>
          <Column
            title={t('Sales.All_sales.Invoice.Product_name').toUpperCase()}
            dataIndex='product'
            key='product'
            fixed={type !== 'print' ? true : undefined}
            sorter={sorter && { multiple: 7 }}
            render={(value: any) => value?.name}
          />
          <Column
            title={t('Sales.Product_and_services.Units.Unit').toUpperCase()}
            dataIndex='unit'
            key='unit'
            render={(value: any) => value?.name}
            sorter={sorter && { multiple: 6 }}
          />
          <Column
            title={t('Warehouse.1').toUpperCase()}
            dataIndex='warehouse_in'
            key='warehouse_in'
            render={(value: any) => value?.name}
            sorter={sorter && { multiple: 5 }}
          />
          <Column
            title={t('Sales.All_sales.Invoice.Quantity').toUpperCase()}
            dataIndex='qty'
            key='qty'
            sorter={sorter && { multiple: 4 }}
            render={(value: number) => value && <Statistics value={value} />}
          />
          <Column
            title={t('Taxes.Tax_rates.Purchases').toUpperCase()}
            dataIndex='each_price'
            key='each_price'
            sorter={sorter && { multiple: 3 }}
            render={(value: number) => value && <Statistics value={value} />}
          />
          <Column
            title={t('Register_date').toUpperCase()}
            dataIndex='registered_date'
            key='registered_date'
            sorter={sorter && { multiple: 2 }}
            render={(value: any) => <ShowDate date={value} />}
          />
          <Column
            title={t(
              'Sales.Product_and_services.Inventory.Expiration_date',
            ).toUpperCase()}
            dataIndex='expire_date'
            key='expire_date'
            sorter={sorter && { multiple: 1 }}
            render={(value: any) => (
              <ShowDate
                date={value}
                datePFormat={expireDatePFormat}
                dateFormat={expireDateFormat}
              />
            )}
          />

          {type !== 'print' &&
            checkPermissions([
              `delete_${PRODUCT_INVENTORY_M}`,
              `change_${PRODUCT_INVENTORY_M}`,
            ]) && (
              <Column
                title={t('Table.Action')}
                key='action'
                align='center'
                width={isMobile ? 50 : 80}
                className='table-col'
                render={(_, record: any) => (
                  <ProductInventoryAction
                    record={record}
                    hasSelected={hasSelected}
                    handleUpdateItems={handleUpdateItems}
                  />
                )}
              />
            )}
        </React.Fragment>
      );
    },
    [handleUpdateItems, isMobile, t],
  );
  //@ts-ignore
  const handleGetProductInventory = useCallback(async ({ queryKey }) => {
    const { page, pageSize, search, order } = queryKey?.[1];
    const { data } = await axiosInstance.get(
      `${PRODUCT_INVENTORY_LIST}?page=${page}&page_size=${pageSize}&ordering=${order}&status=active&search=${search}&expand=unit,product,warehouse_in
&fields=id,registered_date,unit,unit_conversion_rate,warehouse_in,expire_date,qty,each_price,product.name,product.id`,
    );

    return data;
  }, []);

  return (
    <PaginateTable
      model={PRODUCT_INVENTORY_M}
      placeholder={t('Sales.Product_and_services.Find_Products_and_Services')}
      title={t('Sales.Product_and_services.Inventory.Product_inventory')}
      columns={columns}
      queryKey={PRODUCT_INVENTORY_LIST}
      handleGetData={handleGetProductInventory}
    />
  );
};

export default ProductInventory;
