import React, { useMemo, useState } from 'react';
import axiosInstance from '../../../ApiBaseUrl';
import { Checkbox, Menu, Descriptions, Table, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import Filters from './Filters';
import { fixedNumber } from '../../../../Functions/math';
import ProductStatisticsSettings from './Settings';
import { PRODUCT_STATISTIC_SETTINGS } from '../../../LocalStorageVariables';
import { ProductStatisticsDetails } from './Details';
import { ReportTable, Statistics } from '../../../../components/antd';

const { Column } = Table;
const ProductStatisticsTable = ({ title, baseUrl, type }) => {
  const [minAvailable, setMinAvailable] = useState(() =>
    localStorage.getItem(PRODUCT_STATISTIC_SETTINGS),
  );
  const { t } = useTranslation();
  const [{ unit, purchase, sales, barcode }, setColumns] = useState({
    unit: true,
    purchase: true,
    sales: true,
    barcode: true,
  });
  const [filters, setFilters] = useState({
    category: { value: '', label: '' },
    product: { value: '', label: '' },
    warehouse: { value: '', label: '' },
    supplier: { value: '', label: '' },
    priceMethod: { value: 'average', label: t('Reports.Average_price') },
    // availableMin: 1,
    // availableMax: 3000,
  });

  const {
    category,
    product,
    warehouse,
    supplier,
    priceMethod,
    // availableMin,
    // availableMax,
  } = filters;

  const onChangeUnit = () =>
    setColumns((prev) => {
      return { ...prev, unit: !unit };
    });
  const onChangeBarcode = () =>
    setColumns((prev) => {
      return { ...prev, barcode: !barcode };
    });

  const onChangePurchase = () =>
    setColumns((prev) => {
      return { ...prev, purchase: !purchase };
    });

  const onChangeSales = () => {
    setColumns((prev) => {
      return { ...prev, sales: !sales };
    });
  };

  const setting = (
    <Menu style={styles.settingsMenu}>
      <Menu.Item key='1'>
        <Typography.Text strong={true}>
          {t('Sales.Product_and_services.Columns')}
        </Typography.Text>
      </Menu.Item>
      <Menu.Item key='8'>
        <Checkbox checked={barcode} onChange={onChangeBarcode}>
          {t('Sales.Product_and_services.Barcode')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='2'>
        <Checkbox checked={unit} onChange={onChangeUnit}>
          {t('Sales.Product_and_services.Units.Unit')}
        </Checkbox>
      </Menu.Item>

      {type === 'purchasePrice' && (
        <Menu.Item key='3'>
          <Checkbox checked={purchase} onChange={onChangePurchase}>
            {t('Taxes.Tax_rates.Purchases')}
          </Checkbox>
        </Menu.Item>
      )}
      {type === 'salesPrice' && (
        <Menu.Item key='4'>
          <Checkbox checked={sales} onChange={onChangeSales}>
            {t('Sales.1')}
          </Checkbox>
        </Menu.Item>
      )}
      {/* {type !== "productStatistics" && type !== "productDeficits" && (
        <Menu.Item key="5">
          <Checkbox onChange={onChangeTotal} checked={total}>
            {t("Pagination.Total")}
          </Checkbox>
        </Menu.Item>
      )}
      {type !== "productStatistics" && type !== "productDeficits" && (
        <Menu.Item key="6">
          <Checkbox onChange={onChangeCurrency} checked={currency}>
            {t("Sales.Product_and_services.Inventory.Currency")}
          </Checkbox>
        </Menu.Item>
      )} */}
      <Menu.Item key='7'>
        <ProductStatisticsSettings setMinAvailable={setMinAvailable} />
      </Menu.Item>
    </Menu>
  );

  const handleGetProductStatistic = React.useCallback(
    async ({ queryKey }) =>
      // availableMin,
      // availableMax
      {
        const {
          page,
          pageSize,
          search,
          order,
          product,
          warehouse,
          category,
          supplier,
          priceMethod,
        } = queryKey?.[1] ?? {};
        const productId = product?.value ?? '';
        const warehouseId = warehouse?.value ?? '';
        const categoryId = category?.value ?? '';
        const supplierId = supplier?.value ?? '';
        const priceMethodValue = priceMethod?.value ?? '';

        const fields = `id,name,available,unit,barcode${
          type === 'salesPrice' ? ',sales_price' : ''
        }${type === 'purchasePrice' ? ',purchase_price' : ''}`;

        const { data } = await axiosInstance.get(
          `${baseUrl}?page=${page}&page_size=${pageSize}&ordering=${order}&id=${productId}&search=${search}&category=${categoryId}&supplier=${supplierId}${
            type === 'productDeficits' || type === 'productStatistics'
              ? `&warehouse=${warehouseId}`
              : type === 'purchasePrice' || type === 'salesPrice'
                ? `&price_method=${priceMethodValue}`
                : ''
          }&fields=${fields}`,
        );
        return data;
      },
    [baseUrl, type],
  );

  const minimumAvailable = minAvailable ?? 10;

  const columns = useMemo(
    (tableType) => {
      const sorter = tableType !== 'print';
      return (
        <React.Fragment>
          <Column
            title={t('Sales.Product_and_services.Product_id').toUpperCase()}
            dataIndex='id'
            key='id'
            fixed={tableType !== 'print' ? true : undefined}
            width={tableType !== 'print' ? 130 : undefined}
            sorter={sorter && { multiple: 6 }}
            className='table-col'
            align='center'
          />
          <Column
            title={t('Sales.All_sales.Invoice.Product_name').toUpperCase()}
            dataIndex='name'
            key='name'
            fixed={tableType !== 'print' ? true : undefined}
            className='table-col'
            sorter={sorter && { multiple: 5 }}
          />
          {barcode && (
            <Column
              title={t('Sales.Product_and_services.Barcode').toUpperCase()}
              dataIndex='barcode'
              key='barcode'
              className='table-col'
              sorter={sorter && { multiple: 4 }}
            />
          )}
          {unit && (
            <Column
              title={t('Sales.Product_and_services.Units.Unit').toUpperCase()}
              dataIndex='unit'
              key='unit'
              className='table-col'
            />
          )}
          {(type === 'productStatistics' || type === 'productDeficits') && (
            <Column
              title={t('Reports.Available_quantity').toUpperCase()}
              dataIndex='available'
              key='available'
              className='table-col'
              sorter={sorter && { multiple: 3 }}
              render={(value) => (
                <Statistics
                  value={value}
                  valueStyle={{
                    color:
                      fixedNumber(value ?? 0, 0) <= parseFloat(minimumAvailable)
                        ? 'red'
                        : '',
                    fontWeight: 'bold',
                  }}
                />
              )}
            />
          )}
          {purchase && type === 'purchasePrice' && (
            <Column
              title={t('Taxes.Tax_rates.Purchases').toUpperCase()}
              dataIndex='purchase_price'
              key='purchase_price'
              className='table-col'
              sorter={sorter && { multiple: 2 }}
              render={(value) => <Statistics value={value} />}
            />
          )}
          {sales && type === 'salesPrice' && (
            <Column
              title={t('Sales.1').toUpperCase()}
              dataIndex='sales_price'
              key='sales_price'
              className='table-col'
              sorter={sorter && { multiple: 1 }}
              render={(value) => <Statistics value={value} />}
            />
          )}
          {/* {total && type !== "productStatistics" && (
            <Column
              title={t("Pagination.Total").toUpperCase()}
              dataIndex="total"
              key="total"
              className="table-col"
              // sorter={{ multiple: 10 }}
              render={(text, record) => (
                <React.Fragment>
                  {record?.purchase_price &&
                    record?.available &&
                    fixedNumber(record?.purchase_price * record?.available, 4)}
                </React.Fragment>
              )}
            />
          )}
          {currency && type !== "productStatistics" && (
            <Column
              title={t(
                "Sales.Product_and_services.Inventory.Currency"
              ).toUpperCase()}
              dataIndex="currency"
              key="currency"
              className="table-col"
              sorter={{ multiple: 1 }}
            />
          )} */}
          {(type === 'productStatistics' || type === 'productDeficits') &&
            tableType !== 'print' && (
              <Column
                title={t('Table.Action').toUpperCase()}
                dataIndex='action'
                key='action'
                align='center'
                width={60}
                fixed={tableType !== 'print' ? 'right' : undefined}
                render={(_, record) => (
                  <ProductStatisticsDetails
                    id={record?.id}
                    available={record?.available}
                    unit={record?.unit}
                  />
                )}
              />
            )}
        </React.Fragment>
      );
    },
    [barcode, minimumAvailable, type, purchase, sales, t, unit],
  );

  const printFilters = (
    <Descriptions
      layout='horizontal'
      style={styles.printFilter}
      column={1}
      size='small'
    >
      {warehouse?.label && (
        <Descriptions.Item label={t('Warehouse.1')}>
          {warehouse?.label}
        </Descriptions.Item>
      )}
      {product?.label && (
        <Descriptions.Item label={t('Sales.Product_and_services.Product')}>
          {product?.label}
        </Descriptions.Item>
      )}
      {category?.label && (
        <Descriptions.Item
          label={t('Sales.Product_and_services.Form.Category')}
        >
          {category?.label}
        </Descriptions.Item>
      )}
      {supplier?.label && (
        <Descriptions.Item label={t('Expenses.Suppliers.Supplier')}>
          {supplier?.label}
        </Descriptions.Item>
      )}

      {(type === 'purchasePrice' || type === 'salesPrice') && (
        <Descriptions.Item label={t('Reports.Price_type')}>
          {priceMethod?.label}
        </Descriptions.Item>
      )}
    </Descriptions>
  );

  return (
    <ReportTable
      title={title}
      columns={columns}
      queryKey={baseUrl}
      handleGetData={handleGetProductStatistic}
      settingMenu={setting}
      filters={filters}
      filterNode={(setPage, setSelectedRowKeys) => (
        <Filters
          setFilters={setFilters}
          setSelectedRowKeys={setSelectedRowKeys}
          setPage={setPage}
          type={type}
        />
      )}
      filtersComponent={
        type === 'purchasePrice' || type === 'salesPrice'
          ? printFilters
          : Boolean(warehouse?.label) ||
              Boolean(product?.label) ||
              Boolean(category?.label) ||
              Boolean(supplier?.label)
            ? printFilters
            : undefined
      }
    />
  );
};
const styles = {
  settingsMenu: { width: '180px', paddingBottom: '10px' },
  printFilter: { width: '100%', paddingTop: '40px' },
};

export default ProductStatisticsTable;
