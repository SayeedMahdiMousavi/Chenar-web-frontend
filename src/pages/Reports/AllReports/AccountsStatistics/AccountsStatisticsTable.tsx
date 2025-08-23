import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axiosInstance from '../../../ApiBaseUrl';
import { Table, Menu, Typography, Checkbox, Descriptions } from 'antd';
import { useTranslation } from 'react-i18next';
import { utcDate } from '../../../../Functions/utcDate';
import { useQuery } from 'react-query';
import AccountsStatisticsFilters from './Filters';
import useGetRunningPeriod from '../../../../Hooks/useGetRunningPeriod';
import { useMemo } from 'react';
// import useGetBaseCurrency from "../../../../Hooks/useGetBaseCurrency";
import ShowDate from '../../../SelfComponents/JalaliAntdComponents/ShowDate';
import { ReportTable, Statistics } from '../../../../components/antd';
import { reportsDateFormat } from '../../../../Context';
import { TableSummaryCell } from '../../../../components';
import { ACCOUNT_STATISTIC_RESULT_LIST } from '../../../../constants/routes';

const { Column } = Table;
interface IProps {
  baseUrl: string;
  place: string;
  title: string;
}
const dateFormat = reportsDateFormat;

const AccountsStatisticsTable: React.FC<IProps> = (props) => {
  const [selectResult, setSelectResult] = useState<boolean>(false);
  const { t } = useTranslation();
  const [{ dateTime, credit, debit }, setColumns] = useState({
    dateTime: true,
    credit: true,
    debit: true,
  });
  const [search, setSearch] = useState<string | number>('');

  const [filters, setFilters] = useState<any>({
    customer: { value: '', label: '' },
    currency: { value: '', label: '' },
    startDate: '',
    endDate: utcDate().format(dateFormat),
  });

  const { customer, startDate, endDate, currency } = filters;

  //get base currency
  // const baseCurrency = useGetBaseCurrency();
  // const baseCurrencyId = baseCurrency?.data?.id;
  // const baseCurrencyName = baseCurrency?.data?.name;

  // useEffect(() => {
  //   if (baseCurrencyId) {
  //     setFilters((prev: any) => {
  //       return {
  //         ...prev,
  //         currency: {
  //           value: baseCurrencyId,
  //           label: baseCurrencyName,
  //         },
  //       };
  //     });
  //   }
  // }, [baseCurrencyId, baseCurrencyName]);

  //get running period
  const runningPeriod = useGetRunningPeriod();
  const curStartDate = runningPeriod?.data?.start_date;

  useEffect(() => {
    if (curStartDate) {
      setFilters((prev: any) => {
        return {
          ...prev,
          startDate: curStartDate
            ? moment(curStartDate, dateFormat).format(dateFormat)
            : '',
        };
      });
    }
  }, [curStartDate]);

  //setting checkbox
  const onChangeDateTime = (e: any) =>
    setColumns((prev) => {
      return { ...prev, dateTime: e?.target?.checked };
    });

  const onChangeDebit = (e: any) => {
    setColumns((prev) => {
      return { ...prev, debit: e?.target?.checked };
    });
  };

  const onChangeCredit = (e: any) => {
    setColumns((prev) => {
      return { ...prev, credit: e?.target?.checked };
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
        <Checkbox defaultChecked onChange={onChangeDateTime} checked={dateTime}>
          {t('Sales.All_sales.Invoice.Date_and_time')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='3'>
        <Checkbox onChange={onChangeDebit} checked={debit}>
          {t('Debit')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='4'>
        <Checkbox onChange={onChangeCredit} checked={credit}>
          {t('Credit')}
        </Checkbox>
      </Menu.Item>
    </Menu>
  );

  const currencyId = currency?.value ?? '';
  const customerId = customer?.value ?? '';

  const handleGetAccountStatistic = React.useCallback(
    //@ts-ignore
    async ({ queryKey }) => {
      const {
        page,
        pageSize,
        search,
        order,
        startDate,
        endDate,
        currency,
        customer,
      } = queryKey?.[1];
      const currencyId = currency?.value ?? '';
      const customerId = customer?.value ?? '';
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?page=${page}&page_size=${pageSize}&ordering=${order}&currency=${currencyId}&date_time_after=${startDate}&date_time_before=${endDate}&search=${search}&account=${customerId}`,
      );
      return data;
    },
    [props.baseUrl],
  );

  const result = useQuery(
    [
      ACCOUNT_STATISTIC_RESULT_LIST,
      {
        search,
        customerId,
        startDate,
        endDate,
        currencyId,
      },
    ],
    async ({ queryKey }) => {
      const { endDate, startDate, customerId, search, currencyId }: any =
        queryKey?.[1];
      const { data } = await axiosInstance.get(
        `${ACCOUNT_STATISTIC_RESULT_LIST}?search=${search}&account=${customerId}&date_time_after=${startDate}&date_time_before=${endDate}&currency=${currencyId}`,
      );
      return data;
    },
    {
      enabled: !!customerId,
      // cacheTime: 0
    },
  );

  const resultData = result?.data?.results;

  // const printColumns = useMemo(() => {
  //   const newColumns = [
  //     {
  //       title: t("Table.Row"),
  //       dataIndex: "serial",
  //       key: "serial",
  //       width: 40,
  //       align: "center",
  //       className: "print-table-column",
  //     },
  //     {
  //       title: t("Form.Description"),
  //       dataIndex: "desc",
  //       key: "desc",
  //       className: "print-table-column",
  //     },

  //     {
  //       title: t("Sales.All_sales.Invoice.Date_and_time"),
  //       dataIndex: "time",
  //       key: "time",
  //       className: "print-table-column",
  //       render: (text: string) => {
  //         return <ShowDate date={text} />;
  //       },
  //     },
  //     {
  //       title: t("Debit"),
  //       dataIndex: "db",
  //       key: "db",
  //       className: "print-table-column",
  //       render: (text: any) => {
  //         return <>{fixedNumber(text ?? 0, 4)} </>;
  //       },
  //     },
  //     {
  //       title: t("Credit"),
  //       dataIndex: "cr",
  //       key: "cr",
  //       className: "print-table-column",
  //       render: (text: any) => {
  //         return <>{fixedNumber(text ?? 0, 4)} </>;
  //       },
  //     },
  //     {
  //       title: t("Sales.Product_and_services.Inventory.Currency"),
  //       dataIndex: "currency",
  //       key: "currency",
  //       className: "print-table-column",
  //       render: () => {
  //         return <>{currency?.label} </>;
  //       },
  //     },
  //   ];
  //   return newColumns;
  // }, [currency, t]);

  // const resultColumns = useMemo(() => {
  //   const newColumns = [
  //     {
  //       title: t("Table.Row"),
  //       dataIndex: "serial",
  //       key: "serial",
  //       width: 40,
  //       align: "center",
  //       className: "print-table-column",
  //       render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
  //     },
  //     {
  //       title: t("Reports.Total_debit"),
  //       dataIndex: "total_db",
  //       key: "total_db",
  //       className: "print-table-column",
  //     },

  //     {
  //       title: t("Reports.Total_credit"),
  //       dataIndex: "total_cr",
  //       key: "total_cr",
  //       className: "print-table-column",
  //     },
  //     {
  //       title: t("Reports.Result"),
  //       dataIndex: "result",
  //       key: "result",
  //       className: "print-table-column",
  //       render: (text: any) => {
  //         return <>{fixedNumber(text ?? 0, 4)} </>;
  //       },
  //     },
  //     {
  //       title: t("Reports.Result_name"),
  //       dataIndex: "result_name",
  //       key: "result_name",
  //       className: "print-table-column",
  //     },
  //     {
  //       title: t("Sales.Product_and_services.Inventory.Currency"),
  //       dataIndex: "currency",
  //       key: "currency",
  //       className: "print-table-column",
  //     },
  //   ];
  //   return newColumns;
  // }, [t]);

  const columns = useMemo(
    () => (type: string) => {
      const sorter = type !== 'print' ? true : false;
      return (
        <React.Fragment>
          <Column
            title={t('Form.Description').toUpperCase()}
            dataIndex='desc'
            key='desc'
            sorter={sorter && { multiple: 5 }}
            width={type !== 'print' ? 300 : undefined}
            fixed={type !== 'print' ? 'left' : undefined}
            className='table-col'
          />

          {dateTime && (
            <Column
              title={t('Sales.All_sales.Invoice.Date_and_time').toUpperCase()}
              dataIndex='date_time'
              key='date_time'
              className='table-col'
              render={(text) => {
                return <ShowDate date={text} />;
              }}
              sorter={sorter && { multiple: 4 }}
            />
          )}

          {debit && (
            <Column
              title={t('Debit').toUpperCase()}
              dataIndex='receivement'
              key='receivement'
              sorter={sorter && { multiple: 3 }}
              render={(value) => <Statistics value={value} />}
              className='table-col'
            />
          )}

          {credit && (
            <Column
              title={t('Credit').toUpperCase()}
              dataIndex='payment'
              key='payment'
              render={(value) => <Statistics value={value} />}
              className='table-col'
              sorter={sorter && { multiple: 2 }}
            />
          )}

          <Column
            title={t(
              'Sales.Product_and_services.Inventory.Currency',
            ).toUpperCase()}
            sorter={sorter && { multiple: 1 }}
            dataIndex='currency_name'
            key='currency_name'
            className='table-col'
          />
        </React.Fragment>
      );
    },
    [credit, dateTime, debit, t],
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

        <Column
          title={t('Reports.Total_debit').toUpperCase()}
          dataIndex='total_receivement'
          key='total_receivement'
          render={(value) => <Statistics value={value} />}
        />

        <Column
          title={t('Reports.Total_credit').toUpperCase()}
          dataIndex='total_payment'
          key='total_payment'
          render={(value) => <Statistics value={value} />}
        />

        <Column
          title={t('Reports.Result').toUpperCase()}
          dataIndex='result'
          key='result'
          render={(value) => <Statistics value={Math.abs(value ?? 0)} />}
        />

        <Column
          title={t('Reports.Result_name').toUpperCase()}
          dataIndex='result_name'
          key='result_name'
          render={(_, record: any) => {
            return record?.total_receivement > record?.total_payment
              ? t('Debit')
              : record?.total_receivement < record?.total_payment
                ? t('Credit')
                : null;
          }}
        />

        <Column
          title={t(
            'Sales.Product_and_services.Inventory.Currency',
          ).toUpperCase()}
          dataIndex='currency_calc'
          key='currency_calc'
        />
      </React.Fragment>
    ),
    [t],
  );

  const onChangeSelectResult = (e: any) => {
    setSelectResult(e.target.checked);
  };

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
      {customer?.label && (
        <Descriptions.Item label={t('Banking.Form.Account_name')}>
          {customer?.label}
        </Descriptions.Item>
      )}
      {currency?.label && (
        <Descriptions.Item
          label={t('Sales.Product_and_services.Inventory.Currency')}
        >
          {currency?.label}
        </Descriptions.Item>
      )}
    </Descriptions>
  );

  const summary = () => {
    return (
      <>
        <Table.Summary.Row>
          <TableSummaryCell index={0} type='checkbox'>
            <Checkbox onChange={onChangeSelectResult} checked={selectResult} />
          </TableSummaryCell>
          <TableSummaryCell index={1}>
            {t('Sales.Customers.Form.Total')}
          </TableSummaryCell>
          {debit && (
            <TableSummaryCell index={2}>
              {t('Reports.Total_debit')}
            </TableSummaryCell>
          )}

          {credit && (
            <TableSummaryCell index={3}>
              {t('Reports.Total_credit')}
            </TableSummaryCell>
          )}

          <TableSummaryCell index={4}>{t('Reports.Result')}</TableSummaryCell>

          <TableSummaryCell index={5}>
            {t('Reports.Result_name')}
          </TableSummaryCell>

          <TableSummaryCell index={6}>
            {t('Sales.Product_and_services.Inventory.Currency')}
          </TableSummaryCell>
        </Table.Summary.Row>
        {resultData?.map((item: any) => {
          return (
            <Table.Summary.Row>
              <TableSummaryCell isSelected={selectResult} index={0} />
              <TableSummaryCell isSelected={selectResult} index={1} />
              {debit && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={2}
                  type='total'
                  value={item?.total_receivement}
                />
              )}

              {credit && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={3}
                  type='total'
                  value={item?.total_payment}
                />
              )}

              <TableSummaryCell
                isSelected={selectResult}
                index={4}
                type='total'
                value={Math.abs(item?.result ?? 0)}
              />

              <TableSummaryCell isSelected={selectResult} index={5}>
                {item?.total_receivement > item?.total_payment
                  ? t('Debit')
                  : item?.total_receivement < item?.total_payment
                    ? t('Credit')
                    : null}
              </TableSummaryCell>

              <TableSummaryCell isSelected={selectResult} index={6}>
                {item?.currency_calc}
              </TableSummaryCell>
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
      setSelectResult={setSelectResult}
      selectResult={selectResult}
      title={props.title}
      columns={columns}
      queryKey={props.baseUrl}
      handleGetData={handleGetAccountStatistic}
      settingMenu={setting}
      filters={filters}
      filterNode={(setPage, setSelectedRowKeys) => (
        <AccountsStatisticsFilters
          setPage={setPage}
          setFilters={setFilters}
          setSelectedRowKeys={setSelectedRowKeys}
          setSelectResult={setSelectResult}
        />
      )}
      filtersComponent={printFilters}
      resultDataSource={resultData}
      resultDomColumns={resultColumns}
      queryConf={{
        //  cacheTime: 0,
        enabled: !!customerId,
      }}
      summary={summary}
      resultLoading={result.isLoading}
      resultFetching={result.isFetching}
    />
  );
};
const styles = {
  settingsMenu: { minWidth: '130px', paddingBottom: '10px' },
};

export default AccountsStatisticsTable;
