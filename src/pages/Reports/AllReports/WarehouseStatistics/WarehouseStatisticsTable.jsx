import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import axiosInstance from '../../../ApiBaseUrl';
import { useQuery } from 'react-query';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Checkbox, Menu, Button, Table, Typography, Descriptions } from 'antd';
import { useTranslation } from 'react-i18next';
import Filters from './Filters';
import { utcDate } from '../../../../Functions/utcDate';
import useGetRunningPeriod from '../../../../Hooks/useGetRunningPeriod';
import { ReportTable, Statistics } from '../../../../components/antd';
import { ProductStatisticsDetails } from '../ProductStatistics/Details';
import { reportsDateFormat } from '../../../../Context';
import { TableSummaryCell } from '../../../../components';
import { WAREHOUSE_STATISTIC_RESULT_LIST } from '../../../../constants/routes';

const { Column } = Table;
const dateFormat = reportsDateFormat;
const WarehouseStatisticsTable = (props) => {
  const [selectResult, setSelectResult] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const { t } = useTranslation();
  const [
    {
      unit,
      available,
      purchase,
      inventory,
      purchaseReturn,
      sales,
      salesReturn,
      incoming,
      outgoing,
      waste,
      reward,
    },
    setColumns,
  ] = useState({
    unit: true,
    available: true,
    purchase: true,
    inventory: true,
    purchaseReturn: true,
    sales: true,
    salesReturn: true,
    incoming: true,
    outgoing: true,
    waste: true,
    reward: true,
  });
  const [filters, setFilters] = useState({
    product: { value: '', label: '' },
    warehouse: { value: '', label: '' },
    startDate: '',
    endDate: utcDate().format(dateFormat),
    category: { value: '', label: '' },
  });

  const { warehouse, product, startDate, endDate, category } = filters;

  const [search, setSearch] = useState('');

  //get running period
  const runningPeriod = useGetRunningPeriod();
  const curStartDate = runningPeriod?.data?.start_date;

  useEffect(() => {
    if (curStartDate) {
      setFilters((prev) => {
        return {
          ...prev,
          startDate: curStartDate
            ? moment(curStartDate, dateFormat).format(dateFormat)
            : '',
        };
      });
    }
  }, [curStartDate]);

  const onChangeUnit = (e) =>
    setColumns((prev) => {
      return { ...prev, unit: !unit };
    });
  const onChangeAvailable = (e) =>
    setColumns((prev) => {
      return { ...prev, available: e.target.checked };
    });

  const onChangeSales = (e) =>
    setColumns((prev) => {
      return { ...prev, sales: e.target.checked };
    });

  const onChangePurchase = (e) =>
    setColumns((prev) => {
      return { ...prev, purchase: e.target.checked };
    });
  const onChangePurchaseReturn = (e) =>
    setColumns((prev) => {
      return { ...prev, purchaseReturn: e.target.checked };
    });

  const onChangeInventory = (e) => {
    setColumns((prev) => {
      return { ...prev, inventory: e.target.checked };
    });
  };
  const onChangeSalesReturn = (e) => {
    setColumns((prev) => {
      return { ...prev, salesReturn: e.target.checked };
    });
  };
  const onChangeIncoming = (e) => {
    setColumns((prev) => {
      return { ...prev, incoming: e.target.checked };
    });
  };
  const onChangeOutgoing = (e) => {
    setColumns((prev) => {
      return { ...prev, outgoing: e.target.checked };
    });
  };
  const onChangeWaste = (e) => {
    setColumns((prev) => {
      return { ...prev, waste: e.target.checked };
    });
  };
  const onChangeReward = (e) => {
    setColumns((prev) => {
      return { ...prev, reward: e.target.checked };
    });
  };

  const handleSettingVisibleChange = () => {
    setSettingsVisible(!settingsVisible);
  };

  const setting = (
    <Menu style={styles.settingsMenu}>
      <Menu.Item key='1'>
        <Typography.Text strong={true}>
          {t('Sales.Product_and_services.Columns')}
        </Typography.Text>
      </Menu.Item>
      <Menu.Item key='2'>
        <Checkbox checked={unit} onChange={onChangeUnit}>
          {t('Sales.Product_and_services.Units.Unit')}
        </Checkbox>
      </Menu.Item>

      <Menu.Item key='4'>
        <Checkbox checked={inventory} onChange={onChangeInventory}>
          {t('Reports.Inventory')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='3'>
        <Checkbox checked={purchase} onChange={onChangePurchase}>
          {t('Sales.Product_and_services.Price_recording.Purchase_price')}
        </Checkbox>
      </Menu.Item>

      <Menu.Item key='5'>
        <Checkbox onChange={onChangePurchaseReturn} checked={purchaseReturn}>
          {t('Reports.Purchase_return')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='6'>
        <Checkbox onChange={onChangeSales} checked={sales}>
          {t('Sales.Product_and_services.Price_recording.Sales_price')}
        </Checkbox>
      </Menu.Item>

      {settingsVisible && (
        <React.Fragment>
          <Menu.Item key='7'>
            <Checkbox onChange={onChangeSalesReturn} checked={salesReturn}>
              {t('Reports.Sales_return')}
            </Checkbox>
          </Menu.Item>
          <Menu.Item key='8'>
            <Checkbox onChange={onChangeIncoming} checked={incoming}>
              {t('Reports.Incoming')}
            </Checkbox>
          </Menu.Item>
          <Menu.Item key='9'>
            <Checkbox onChange={onChangeOutgoing} checked={outgoing}>
              {t('Reports.Outgoing')}
            </Checkbox>
          </Menu.Item>
          <Menu.Item key='10'>
            <Checkbox onChange={onChangeWaste} checked={waste}>
              {t('Reports.Waste')}
            </Checkbox>
          </Menu.Item>
          <Menu.Item key='11'>
            <Checkbox onChange={onChangeReward} checked={reward}>
              {t('Reports.Reward')}
            </Checkbox>
          </Menu.Item>
          <Menu.Item key='12'>
            <Checkbox checked={available} onChange={onChangeAvailable}>
              {t('Reports.Available_quantity')}
            </Checkbox>
          </Menu.Item>
        </React.Fragment>
      )}

      <Menu.Item
        key='13'
        onClick={handleSettingVisibleChange}
        className='table__header2-setting-showMore'
        style={{ textAlign: 'end' }}
      >
        {settingsVisible ? (
          <Button
            type='link'
            icon={<UpOutlined />}
            className='table__header2-setting-showMore'
          >
            {t('Sales.Product_and_services.Show_less')}
          </Button>
        ) : (
          <Button
            type='link'
            icon={<DownOutlined />}
            className='table__header2-setting-showMore'
          >
            {t('Sales.Product_and_services.Show_More')}
          </Button>
        )}
      </Menu.Item>
    </Menu>
  );

  const warehouseId = warehouse?.value;
  const productId = product?.value;
  const categoryId = category?.value ?? '';
  const handleGetWarehouseStatistics = React.useCallback(
    async ({ queryKey }) => {
      const {
        page,
        pageSize,
        search,
        order,
        product,
        warehouse,
        startDate,
        endDate,
        category,
      } = queryKey?.[1] || {};
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?page=${page}&page_size=${pageSize}&ordering=${order}&id=${product?.value}&search=${search}&warehouse=${warehouse?.value}&category=${category?.value}&date_time_after=${startDate}&date_time_before=${endDate}`,
      );

      return data;
    },
    [props.baseUrl],
  );

  const getWarehouseStatisticResult = React.useCallback(
    async ({ queryKey }) => {
      const { search, productId, warehouseId, startDate, endDate, categoryId } =
        queryKey?.[1] || {};
      const { data } = await axiosInstance.get(
        `${WAREHOUSE_STATISTIC_RESULT_LIST}?id=${productId}&search=${search}&warehouse=${warehouseId}&category=${categoryId}&date_time_after=${startDate}&date_time_before=${endDate}`,
      );
      return data;
    },
    [],
  );

  const result = useQuery(
    [
      WAREHOUSE_STATISTIC_RESULT_LIST,
      {
        search,
        productId,
        warehouseId,
        startDate,
        endDate,
        categoryId,
      },
    ],
    getWarehouseStatisticResult,
    // { enabled: !!startDate, cacheTime: 0 }
  );

  const resultData = [result?.data];

  const columns = useMemo(
    (type) => {
      const sorter = type !== 'print';
      return (
        <React.Fragment>
          <Column
            title={t('Sales.Product_and_services.Product_id').toUpperCase()}
            dataIndex='product_id'
            key='product_id'
            fixed={type !== 'print' ? true : undefined}
            width={type !== 'print' ? 130 : undefined}
            sorter={sorter && { multiple: 13 }}
            className='table-col'
            align='center'
          />
          <Column
            title={`${t('Sales.All_sales.Invoice.Product_name').toUpperCase()}`}
            dataIndex='product_name'
            key='product_name'
            fixed={type !== 'print' ? true : undefined}
            className='table-col'
            sorter={sorter && { multiple: 12 }}
          />

          {unit && (
            <Column
              title={t('Sales.Product_and_services.Units.Unit').toUpperCase()}
              dataIndex='base_unit'
              key='base_unit'
              sorter={sorter && { multiple: 11 }}
              className='table-col'
            />
          )}

          {inventory && (
            <Column
              title={t('Reports.Inventory').toUpperCase()}
              dataIndex='on_hand'
              key='on_hand'
              className='table-col'
              sorter={sorter && { multiple: 10 }}
              render={(value) => <Statistics value={value} />}
            />
          )}
          {purchase && (
            <Column
              title={t(
                'Sales.Product_and_services.Price_recording.Purchase_price',
              ).toUpperCase()}
              dataIndex='purchase'
              key='purchase'
              className='table-col'
              sorter={sorter && { multiple: 9 }}
              render={(value) => <Statistics value={value} />}
            />
          )}
          {purchaseReturn && (
            <Column
              title={t('Reports.Purchase_return').toUpperCase()}
              dataIndex='purchase_rej'
              key='purchase_rej'
              className='table-col'
              sorter={sorter && { multiple: 8 }}
              render={(value) => <Statistics value={value} />}
            />
          )}

          {sales && (
            <Column
              title={t(
                'Sales.Product_and_services.Price_recording.Sales_price',
              ).toUpperCase()}
              dataIndex='sales'
              key='sales'
              className='table-col'
              sorter={sorter && { multiple: 7 }}
              render={(value) => <Statistics value={value} />}
            />
          )}
          {salesReturn && (
            <Column
              title={t('Reports.Sales_return').toUpperCase()}
              dataIndex='sales_rej'
              key='sales_rej'
              className='table-col'
              sorter={sorter && { multiple: 6 }}
              render={(value) => <Statistics value={value} />}
            />
          )}
          {incoming && (
            <Column
              title={t('Reports.Incoming').toUpperCase()}
              dataIndex='warehous_in_rec'
              key='warehous_in_rec'
              className='table-col'
              sorter={sorter && { multiple: 5 }}
              render={(value) => <Statistics value={value} />}
            />
          )}
          {outgoing && (
            <Column
              title={t('Reports.Outgoing').toUpperCase()}
              dataIndex='warehous_out_rec'
              key='warehous_out_rec'
              className='table-col'
              sorter={sorter && { multiple: 4 }}
              render={(value) => <Statistics value={value} />}
            />
          )}
          {waste && (
            <Column
              title={t('Reports.Waste').toUpperCase()}
              dataIndex='waste'
              key='waste'
              sorter={sorter && { multiple: 3 }}
              render={(value) => <Statistics value={value} />}
            />
          )}
          {reward && (
            <Column
              title={t('Reports.Reward').toUpperCase()}
              dataIndex='reward'
              key='reward'
              sorter={sorter && { multiple: 2 }}
              render={(value) => <Statistics value={value} />}
            />
          )}

          {available && (
            <Column
              title={t('Reports.Available_quantity').toUpperCase()}
              dataIndex='available'
              key='available'
              className='table-col'
              sorter={sorter && { multiple: 1 }}
              render={(value) => {
                // const inventory = record?.remind ?? 0;
                // const sales = record?.sales ?? 0;
                // const salesReturn = record?.sales_rej ?? 0;
                // const purchase = record?.purchase ?? 0;
                // const purchaseReturn = record?.purchase_rej ?? 0;
                // const incoming = record?.warehouse_in ?? 0;
                // const outgoing = record?.warehouse_out ?? 0;
                // const total =
                //   parseFloat(salesReturn) +
                //   parseFloat(purchase) +
                //   parseFloat(inventory) +
                //   parseFloat(incoming) -
                //   (parseFloat(sales) +
                //     parseFloat(purchaseReturn) +
                //     parseFloat(outgoing));
                return <Statistics value={value} />;
              }}
            />
          )}
          {type !== 'print' && (
            <Column
              title={t('Table.Action').toUpperCase()}
              dataIndex='action'
              key='action'
              align='center'
              width={60}
              fixed={type !== 'print' ? 'right' : undefined}
              render={(text, record) => {
                // const inventory = record?.remind ?? 0;
                // const sales = record?.sales ?? 0;
                // const salesReturn = record?.sales_rej ?? 0;
                // const purchase = record?.purchase ?? 0;
                // const purchaseReturn = record?.purchase_rej ?? 0;
                // const incoming = record?.warehouse_in ?? 0;
                // const outgoing = record?.warehouse_out ?? 0;
                // const total =
                //   parseFloat(salesReturn) +
                //   parseFloat(purchase) +
                //   parseFloat(inventory) +
                //   parseFloat(incoming) -
                //   (parseFloat(sales) +
                //     parseFloat(purchaseReturn) +
                //     parseFloat(outgoing));
                return (
                  <ProductStatisticsDetails
                    id={record?.product_id}
                    available={record?.available}
                    unit={record?.base_unit}
                  />
                );
              }}
            />
          )}
        </React.Fragment>
      );
    },
    [
      available,
      incoming,
      inventory,
      outgoing,
      purchase,
      purchaseReturn,
      reward,
      sales,
      salesReturn,
      t,
      unit,
      waste,
    ],
  );

  const resultColumns = useMemo(
    () => (
      <React.Fragment>
        <Column
          title={t('Table.Row').toUpperCase()}
          dataIndex='serial'
          key='serial'
          width={40}
          align='center'
          render={(_, __, index) => (
            <React.Fragment>{index + 1}</React.Fragment>
          )}
        />
        {inventory && (
          <Column
            title={t('Sales.Product_and_services.Inventory.1').toUpperCase()}
            dataIndex='total_onhand'
            key='total_onhand'
            render={(value) => <Statistics value={value} />}
          />
        )}
        {purchase && (
          <Column
            title={t('Taxes.Tax_rates.Purchases').toUpperCase()}
            dataIndex='total_purchase'
            key='total_purchase'
            render={(value) => <Statistics value={value} />}
          />
        )}
        {purchaseReturn && (
          <Column
            title={t('Reports.Purchase_return').toUpperCase()}
            dataIndex='total_purchase_rej'
            key='total_purchase_rej'
            render={(value) => <Statistics value={value} />}
          />
        )}

        {sales && (
          <Column
            title={t('Sales.1').toUpperCase()}
            dataIndex='total_sales'
            key='total_sales'
            render={(value) => <Statistics value={value} />}
          />
        )}
        {salesReturn && (
          <Column
            title={t('Reports.Sales_return').toUpperCase()}
            dataIndex='total_sales_rej'
            key='total_sales_rej'
            render={(value) => <Statistics value={value} />}
          />
        )}
        {incoming && (
          <Column
            title={t('Reports.Incoming').toUpperCase()}
            dataIndex='total_warehouse_in'
            key='total_warehouse_in'
            render={(value) => <Statistics value={value} />}
          />
        )}
        {outgoing && (
          <Column
            title={t('Reports.Outgoing').toUpperCase()}
            dataIndex='total_warehouse_out'
            key='total_warehouse_out'
            render={(value) => <Statistics value={value} />}
          />
        )}
        {waste && (
          <Column
            title={t('Reports.Waste').toUpperCase()}
            dataIndex='total_waste'
            key='total_waste'
            render={(value) => <Statistics value={value} />}
          />
        )}
        {reward && (
          <Column
            title={t('Reports.Reward').toUpperCase()}
            dataIndex='total_reward'
            key='total_reward'
            render={(value) => <Statistics value={value} />}
          />
        )}

        {available && (
          <Column
            title={t('Reports.Available_quantity').toUpperCase()}
            dataIndex='total_available'
            key='total_available'
            render={(value) => {
              // const totalInventory = record?.total_remind ?? 0;
              // const totalSales = record?.total_sales ?? 0;
              // const totalSalesReturn = record?.total_sales_rej ?? 0;
              // const totalPurchase = record?.total_purchase ?? 0;
              // const totalPurchaseReturn = record?.total_purchase_rej ?? 0;
              // const totalIncoming = record?.total_warehouse_in ?? 0;
              // const totalOutgoing = record?.total_warehouse_out ?? 0;
              // const total =
              //   parseFloat(totalSalesReturn) +
              //   parseFloat(totalPurchase) +
              //   parseFloat(totalInventory) +
              //   parseFloat(totalIncoming) -
              //   (parseFloat(totalSales) +
              //     parseFloat(totalPurchaseReturn) +
              //     parseFloat(totalOutgoing));
              return <Statistics value={value} />;
            }}
          />
        )}
      </React.Fragment>
    ),
    [
      available,
      incoming,
      inventory,
      outgoing,
      purchase,
      purchaseReturn,
      reward,
      sales,
      salesReturn,
      t,
      waste,
    ],
  );

  const printFilters = (
    <Descriptions
      layout='horizontal'
      style={{ width: '100%', paddingTop: '40px' }}
      column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
      size='small'
    >
      <Descriptions.Item label={t('Form.From')}>
        {startDate} {t('Form.To')} : {endDate}
      </Descriptions.Item>
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
    </Descriptions>
  );

  const onChangeSelectResult = (e) => {
    setSelectResult(e.target.checked);
  };

  const summary = (pageData) => {
    return (
      <>
        {resultData?.map((item, index) => {
          // const totalInventory = item?.total_remind ?? 0;
          // const totalSales = item?.total_sales ?? 0;
          // const totalSalesReturn = item?.total_sales_rej ?? 0;
          // const totalPurchase = item?.total_purchase ?? 0;
          // const totalPurchaseReturn = item?.total_purchase_rej ?? 0;
          // const totalIncoming = item?.total_warehouse_in ?? 0;
          // const totalOutgoing = item?.total_warehouse_out ?? 0;
          // const total =
          //   parseFloat(totalSalesReturn) +
          //   parseFloat(totalPurchase) +
          //   parseFloat(totalInventory) +
          //   parseFloat(totalIncoming) -
          //   (parseFloat(totalSales) +
          //     parseFloat(totalPurchaseReturn) +
          //     parseFloat(totalOutgoing));
          return (
            <Table.Summary.Row key={item?.id}>
              <TableSummaryCell
                index={0}
                type='checkbox'
                isSelected={selectResult}
              >
                <Checkbox
                  onChange={onChangeSelectResult}
                  checked={selectResult}
                />
              </TableSummaryCell>

              <TableSummaryCell index={1} isSelected={selectResult}>
                {index === 0 && t('Sales.Customers.Form.Total')}
              </TableSummaryCell>

              <TableSummaryCell isSelected={selectResult} index={2} />

              <TableSummaryCell isSelected={selectResult} index={3} />

              {unit && <TableSummaryCell isSelected={selectResult} index={4} />}

              {inventory && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={5}
                  type='total'
                  value={item?.total_onhand}
                />
              )}

              {purchase && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={6}
                  type='total'
                  value={item?.total_purchase}
                />
              )}

              {purchaseReturn && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={7}
                  type='total'
                  value={item?.total_purchase_rej}
                />
              )}

              {sales && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={8}
                  type='total'
                  value={item?.total_sales}
                />
              )}
              {salesReturn && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={9}
                  type='total'
                  value={item?.total_sales_rej}
                />
              )}
              {incoming && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={10}
                  type='total'
                  value={item?.total_warehouse_in}
                />
              )}
              {outgoing && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={11}
                  type='total'
                  value={item?.total_warehouse_out}
                />
              )}
              {waste && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={12}
                  type='total'
                  value={item?.total_waste}
                />
              )}
              {reward && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={13}
                  type='total'
                  value={item?.total_reward}
                />
              )}
              {available && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={14}
                  type='total'
                  value={item?.total_available}
                />
              )}

              <TableSummaryCell isSelected={selectResult} index={13} />
            </Table.Summary.Row>
          );
        })}
      </>
    );
  };

  return (
    <ReportTable
      pagination={true}
      setSearch={setSearch}
      search={search}
      isSearch={false}
      setSelectResult={setSelectResult}
      title={props.title}
      columns={columns}
      rowKey='product_id'
      queryKey={props.baseUrl}
      handleGetData={handleGetWarehouseStatistics}
      settingMenu={setting}
      filters={filters}
      filterNode={(setPage, setSelectedRowKeys) => (
        <Filters
          setFilters={setFilters}
          setPage={setPage}
          type={props.type}
          setSelectedRowKeys={setSelectedRowKeys}
          setSelectResult={setSelectResult}
        />
      )}
      filtersComponent={printFilters}
      selectResult={selectResult}
      resultDataSource={resultData}
      resultDomColumns={resultColumns}
      // queryConf={{ enabled: !!startDate, cacheTime: 0 }}
      summary={summary}
      resultLoading={result.isLoading}
      resultFetching={result.isFetching}
    />
  );
};

const styles = {
  settingsMenu: { width: '165px', paddingBottom: '10px' },
};

export default WarehouseStatisticsTable;
