import React, { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../../ApiBaseUrl';
import { useQuery } from 'react-query';
import moment from 'moment';
import { Checkbox, Menu, Table, Typography, Descriptions } from 'antd';
import { useTranslation } from 'react-i18next';
import Filters from './Filters';
import { utcDate } from '../../../../Functions/utcDate';
import useGetRunningPeriod from '../../../../Hooks/useGetRunningPeriod';
import { ReportTable, Statistics } from '../../../../components/antd';
import { reportsDateFormat } from '../../../../Context';
import { TableSummaryCell } from '../../../../components';
import { PROFIT_AVERAGE_RESULT_LIST } from '../../../../constants/routes';
import { useGetBaseCurrency } from '../../../../Hooks';

const { Column, ColumnGroup } = Table;
const dateFormat = reportsDateFormat;
const ProductProfileAverageTable = (props) => {
  const [selectResult, setSelectResult] = useState(false);
  const { t } = useTranslation();
  const [
    { unit, available, averageTotalPrice, averagePrice, profit, currency },
    setColumns,
  ] = useState({
    unit: true,
    available: true,
    averageTotalPrice: false,
    averagePrice: false,
    profit: true,
    currency: true,
  });

  const [filters, setFilters] = useState({
    category: { value: '', label: '' },
    product: { value: '', label: '' },
    startDate: '',
    endDate: utcDate().format(dateFormat),
  });

  const [search, setSearch] = useState('');

  const { category, product, startDate, endDate } = filters;

  //get running period
  const runningPeriod = useGetRunningPeriod();
  const curStartDate = runningPeriod?.data?.start_date;

  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyName = baseCurrency?.data?.name;

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

  const onChangeCurrency = (e) =>
    setColumns((prev) => {
      return { ...prev, currency: !currency };
    });

  const onChangeAverageTotalPrice = (e) =>
    setColumns((prev) => {
      return { ...prev, averageTotalPrice: e.target.checked };
    });
  const onChangeProfit = (e) =>
    setColumns((prev) => {
      return { ...prev, profit: !profit };
    });

  const onChangeAveragePrice = (e) => {
    setColumns((prev) => {
      return { ...prev, averagePrice: e.target.checked };
    });
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
      <Menu.Item key='3'>
        <Checkbox checked={available} onChange={onChangeAvailable}>
          {t('Reports.Sales_quantity')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='4'>
        <Checkbox checked={averagePrice} onChange={onChangeAveragePrice}>
          {t('Reports.Average_price')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='5'>
        <Checkbox
          checked={averageTotalPrice}
          onChange={onChangeAverageTotalPrice}
        >
          {t('Reports.Average_total_price')}
        </Checkbox>
      </Menu.Item>

      <Menu.Item key='6'>
        <Checkbox onChange={onChangeProfit} checked={profit}>
          {t('Reports.Profit')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='7'>
        <Checkbox onChange={onChangeCurrency} checked={currency}>
          {t('Sales.Product_and_services.Inventory.Currency')}
        </Checkbox>
      </Menu.Item>
    </Menu>
  );

  const categoryId = category?.value;
  const productId = product?.value;

  const handleGetProfitAverage = React.useCallback(
    async ({ queryKey }) => {
      const {
        page,
        pageSize,
        search,
        order,
        product,
        category,
        startDate,
        endDate,
      } = queryKey?.[1] || {};
      const categoryId = category?.value;
      const productId = product?.value;
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?page=${page}&page_size=${pageSize}&ordering=${order}&id=${productId}&date_time_after=${startDate}&date_time_before=${endDate}&search=${search}&category=${categoryId}`,
      );
      return data;
    },
    [props.baseUrl],
  );

  const handleGetProductProfitResult = React.useCallback(
    async ({ queryKey }) => {
      const { productId, categoryId, startDate, endDate, search } =
        queryKey?.[1] || {};
      const { data } = await axiosInstance.get(
        `${PROFIT_AVERAGE_RESULT_LIST}?id=${productId}&search=${search}&date_time_after=${startDate}&date_time_before=${endDate}&category=${categoryId}`,
      );
      return data;
    },
    [],
  );

  const result = useQuery(
    [
      PROFIT_AVERAGE_RESULT_LIST,
      { productId, categoryId, startDate, endDate, search },
    ],
    handleGetProductProfitResult,
    // { cacheTime: 0 }
  );

  const resultData = [result?.data];

  const columns = useMemo(
    (type) => {
      const sorter = type !== 'print';
      return (
        <React.Fragment>
          <ColumnGroup title={t('Reports.Product_details').toUpperCase()}>
            {/* <Column
              title={t("Sales.Product_and_services.Product_id").toUpperCase()}
              dataIndex="id"
              key="id"
              fixed={true}
              width={130}
              sorter={{ multiple: 8 }}
              className="table-col"
              align="center"
            /> */}
            <Column
              title={`${t(
                'Sales.Product_and_services.Categories.Name',
              ).toUpperCase()}`}
              // width={isMobile ? 70 : 180}
              dataIndex='name'
              key='name'
              // fixed={true}
              className='table-col'
              sorter={sorter && { multiple: 8 }}
            />

            {unit && (
              <Column
                title={t('Sales.Product_and_services.Units.Unit').toUpperCase()}
                dataIndex='unit'
                key='unit'
                sorter={sorter && { multiple: 7 }}
                className='table-col'
              />
            )}
            {available && (
              <Column
                title={t('Reports.Sales_quantity').toUpperCase()}
                dataIndex='qty'
                key='qty'
                className='table-col'
                sorter={sorter && { multiple: 6 }}
                render={(value) => <Statistics value={value} />}
              />
            )}
          </ColumnGroup>
          {averagePrice && (
            <ColumnGroup title={t('Reports.Average_price').toUpperCase()}>
              <Column
                title={t(
                  'Sales.Product_and_services.Price_recording.Purchase_price',
                ).toUpperCase()}
                dataIndex='purchase_avrage'
                key='purchase_avrage'
                className='table-col'
                sorter={sorter && { multiple: 5 }}
                render={(value) => <Statistics value={value} />}
              />

              <Column
                title={t(
                  'Sales.Product_and_services.Price_recording.Sales_price',
                ).toUpperCase()}
                dataIndex='sales_average'
                key='sales_average'
                className='table-col'
                sorter={sorter && { multiple: 4 }}
                render={(value) => <Statistics value={value} />}
              />
            </ColumnGroup>
          )}
          {averageTotalPrice && (
            <ColumnGroup title={t('Reports.Average_total_price').toUpperCase()}>
              <Column
                title={t(
                  'Sales.Product_and_services.Price_recording.Purchase_price',
                ).toUpperCase()}
                dataIndex='purchase'
                key='purchase'
                className='table-col'
                sorter={sorter && { multiple: 3 }}
                render={(_, record) => {
                  const purchases = record?.purchase_price ?? 0;
                  const qty = record?.sales_quantity ?? 0;
                  const total = parseFloat(purchases) * parseFloat(qty);
                  return <Statistics value={total} />;
                }}
              />

              <Column
                title={t(
                  'Sales.Product_and_services.Price_recording.Sales_price',
                ).toUpperCase()}
                dataIndex='sales'
                key='sales'
                className='table-col'
                sorter={sorter && { multiple: 2 }}
                render={(text, record) => {
                  const purchases = record?.sales_price ?? 0;
                  const qty = record?.sales_quantity ?? 0;
                  const total = parseFloat(purchases) * parseFloat(qty);
                  return <Statistics value={total} />;
                }}
              />
            </ColumnGroup>
          )}
          {profit && (
            <Column
              title={t('Reports.Profit').toUpperCase()}
              dataIndex='profit'
              key='profit'
              className='table-col'
              // sorter={sorter&&{ multiple: 10 }}
              render={(value) => {
                // const purchases = record?.sales_price ?? 0;
                // const sales = record?.purchase_price ?? 0;
                // const qty = record?.sales_quantity ?? 0;
                // const totalSales = parseFloat(purchases) * parseFloat(qty);
                // const totalPurchases = parseFloat(sales) * parseFloat(qty);
                return <Statistics value={value} />;
              }}
            />
          )}
          {currency && (
            <Column
              title={t(
                'Sales.Product_and_services.Inventory.Currency',
              ).toUpperCase()}
              dataIndex='currency'
              key='currency'
              className='table-col'
              fixed='right'
              sorter={sorter && { multiple: 1 }}
              render={() => baseCurrencyName}
            />
          )}
        </React.Fragment>
      );
    },
    [
      available,
      averagePrice,
      averageTotalPrice,
      baseCurrencyName,
      currency,
      profit,
      t,
      unit,
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
          className='table-col'
          fixed='left'
          align='center'
          render={(_, __, index) => (
            <React.Fragment>{index + 1}</React.Fragment>
          )}
        />
        {averageTotalPrice && (
          <Column
            title={t('Taxes.Tax_rates.Purchases').toUpperCase()}
            dataIndex='total_purchase'
            key='total_purchase'
            render={(value) => <Statistics value={value} />}
          />
        )}
        {averageTotalPrice && (
          <Column
            title={t('Sales.1').toUpperCase()}
            dataIndex='total_sales'
            key='total_sales'
            render={(value) => <Statistics value={value} />}
          />
        )}
        {profit && (
          <Column
            title={t('Reports.Profit').toUpperCase()}
            dataIndex='total_profit'
            key='total_profit'
            render={(value) => {
              // const profit =
              //   parseFloat(record?.total_sales ?? 0) -
              //   parseFloat(record?.total_purchase ?? 0);
              return <Statistics value={value} />;
            }}
          />
        )}
      </React.Fragment>
    ),
    [averageTotalPrice, profit, t],
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

  const summary = () => {
    return (
      <>
        {resultData?.map((item) => {
          // const profit1 =
          //   parseFloat(item?.total_sales ?? 0) -
          //   parseFloat(item?.total_purchase ?? 0);
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

              <TableSummaryCell isSelected={selectResult} index={1}>
                {t('Sales.Customers.Form.Total')}
              </TableSummaryCell>

              <TableSummaryCell isSelected={selectResult} index={2} />

              {unit && <TableSummaryCell isSelected={selectResult} index={3} />}

              {available && (
                <TableSummaryCell isSelected={selectResult} index={4} />
              )}

              {averagePrice && (
                <TableSummaryCell isSelected={selectResult} index={5} />
              )}

              {averagePrice && (
                <TableSummaryCell isSelected={selectResult} index={6} />
              )}

              {averageTotalPrice && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={7}
                  type='total'
                  value={item?.total_purchase}
                />
              )}

              {averageTotalPrice && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={8}
                  type='total'
                  value={item?.total_sales}
                />
              )}
              {profit && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={9}
                  type='total'
                  value={item?.total_profit}
                />
              )}
              {currency && (
                <TableSummaryCell isSelected={selectResult} index={10} />
              )}
            </Table.Summary.Row>
          );
        })}
      </>
    );
  };
  return (
    <ReportTable
      setSearch={setSearch}
      search={search}
      setSelectResult={setSelectResult}
      selectResult={selectResult}
      title={props.title}
      columns={columns}
      queryKey={props.baseUrl}
      handleGetData={handleGetProfitAverage}
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
      resultDataSource={resultData}
      resultDomColumns={resultColumns}
      // queryConf={{ cacheTime: 0 }}
      summary={summary}
      resultLoading={result.isLoading}
      resultFetching={result.isFetching}
    />
  );
};

const styles = {
  settingsMenu: { width: '165px', paddingBottom: '10px' },
};

export default ProductProfileAverageTable;
