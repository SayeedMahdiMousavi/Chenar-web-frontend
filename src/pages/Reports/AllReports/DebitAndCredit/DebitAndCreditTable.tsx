import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axiosInstance from '../../../ApiBaseUrl';
import { Table, Menu, Typography, Checkbox, Descriptions } from 'antd';
import { useTranslation } from 'react-i18next';
import { utcDate } from '../../../../Functions/utcDate';
import { useQuery } from 'react-query';
import DebitAndCreditFilters from './Filters';
import useGetRunningPeriod from '../../../../Hooks/useGetRunningPeriod';
// import useGetBaseCurrency from "../../../../Hooks/useGetBaseCurrency";
import { useMemo } from 'react';
import ShowDate from '../../../SelfComponents/JalaliAntdComponents/ShowDate';
import { ReportTable, Statistics } from '../../../../components/antd';
import { reportsDateFormat } from '../../../../Context';
import { TableSummaryCell } from '../../../../components';
import { DEBIT_CREDIT_RESULT_LIST } from '../../../../constants/routes';

const { Column, ColumnGroup } = Table;
interface IProps {
  baseUrl: string;
  title: string;
  place: string;
}
const dateFormat = reportsDateFormat;
const DebitAndCreditTable: React.FC<IProps> = (props) => {
  const [selectResult, setSelectResult] = useState<boolean>(false);
  const { t } = useTranslation();
  const [{ isCurrency, calCurrency, details }, setColumns] = useState({
    isCurrency: false,
    calCurrency: true,
    details: true,
  });

  const [search, setSearch] = useState<string | number>('');

  const [filters, setFilters] = useState<any>({
    transactionType: { value: '', label: '' },
    customer: { value: '', label: '' },
    currency: {},
    startDate: '',
    endDate: utcDate().format(dateFormat),
  });

  const { transactionType, customer, startDate, endDate, currency } = filters;

  // //get base currency
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
  const onChangeIsCurrency = (e: any) =>
    setColumns((prev) => {
      return { ...prev, isCurrency: e.target.checked };
    });

  const onChangeDetails = (e: any) => {
    setColumns((prev) => {
      return { ...prev, details: e.target.checked };
    });
  };

  const onChangeCalCurrency = (e: any) => {
    setColumns((prev) => {
      return { ...prev, calCurrency: e.target.checked };
    });
  };

  const setting = (
    <Menu style={styles.settingsMenu}>
      <Menu.Item key='1'>
        <Typography.Text strong={true}>
          {t('Sales.Product_and_services.Columns')}
        </Typography.Text>
      </Menu.Item>
      <Menu.Item key='3'>
        <Checkbox onChange={onChangeDetails} checked={details}>
          {t('Sales.Customers.Receive_cash.Receive_details')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='2'>
        <Checkbox onChange={onChangeIsCurrency} checked={isCurrency}>
          {t('Sales.Customers.Receive_cash.Paid_currency')}
        </Checkbox>
      </Menu.Item>

      <Menu.Item key='4'>
        <Checkbox onChange={onChangeCalCurrency} checked={calCurrency}>
          {t('Sales.Customers.Receive_cash.Calculate_currency')}
        </Checkbox>
      </Menu.Item>
    </Menu>
  );

  const currencyId = currency?.value ?? '';
  const customerId = customer?.value ?? '';
  const transType = transactionType?.value ?? '';

  const handleGetDebitCredit = React.useCallback(
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
        transactionType,
      }: any = queryKey?.[1];
      const currencyId = currency?.value ?? '';
      const customerId = customer?.value ?? '';
      const transType = transactionType?.value ?? '';
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?page=${page}&page_size=${pageSize}&ordering=${order}&currency=${currencyId}&date_time_after=${startDate}&date_time_before=${endDate}&search=${search}&account=${customerId}&transaction_type=${transType}`
      );
      return data;
    },
    [props.baseUrl]
  );

  const result = useQuery(
    [
      DEBIT_CREDIT_RESULT_LIST,
      {
        search,
        customerId,
        startDate,
        endDate,
        currencyId,
        transType,
      },
    ],
    async ({ queryKey }) => {
      const {
        endDate,
        startDate,
        customerId,
        search,
        currencyId,
        transType,
      }: any = queryKey?.[1];
      const { data } = await axiosInstance.get(
        `${DEBIT_CREDIT_RESULT_LIST}?search=${search}&account=${customerId}&date_time_after=${startDate}&date_time_before=${endDate}&currency=${currencyId}&transaction_type=${transType}`
      );
      return data;
    }
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
  //       title: t("Sales.Customers.Receive_cash.Receive_details"),
  //       className: "print-table-column",
  //       children: [
  //         {
  //           title: t("Banking.Form.Account_id"),
  //           dataIndex: "customer_id",
  //           key: "customer_id",
  //           className: "print-table-column",
  //         },
  //         {
  //           title: t("Banking.Form.Account_name"),
  //           dataIndex: "customer_name",
  //           key: "customer_name",
  //           className: "print-table-column",
  //         },
  //       ],
  //     },
  //     {
  //       title: t("Sales.Customers.Receive_cash.Receive_details"),
  //       className: "print-table-column",
  //       children: [
  //         {
  //           title: t("Sales.All_sales.Invoice.Date_and_time"),
  //           dataIndex: "time",
  //           key: "time",
  //           className: "print-table-column",
  //           render: (text: string) => {
  //             return <ShowDate date={text} />;
  //           },
  //         },
  //         {
  //           title: t("Form.Description"),
  //           dataIndex: "desc",
  //           key: "desc",
  //           className: "print-table-column",
  //         },
  //       ],
  //     },

  //     {
  //       title: t("Sales.Customers.Receive_cash.Paid_currency"),
  //       className: "print-table-column",
  //       children: [
  //         {
  //           title: t("Debit"),
  //           dataIndex: "db",
  //           key: "db",
  //           className: "print-table-column",
  //           render: (text: any) => {
  //             return <>{fixedNumber(text ?? 0, 4)} </>;
  //           },
  //         },
  //         {
  //           title: t("Credit"),
  //           dataIndex: "cr",
  //           key: "cr",
  //           render: (text: any) => {
  //             return <>{fixedNumber(text ?? 0, 4)} </>;
  //           },
  //           className: "print-table-column",
  //         },
  //         {
  //           title: t("Sales.Product_and_services.Inventory.Currency"),
  //           dataIndex: "cur",
  //           key: "cur",
  //           className: "print-table-column",
  //         },
  //         {
  //           title: t("Sales.Product_and_services.Currency.Currency_rate"),
  //           dataIndex: "cur_rate",
  //           key: "cur_rate",
  //           className: "print-table-column",
  //           render: (text: any) => {
  //             var num = parseFloat(text);
  //             return <>{num}</>;
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       title: t("Sales.Customers.Receive_cash.Calculate_currency"),
  //       className: "print-table-column",
  //       children: [
  //         {
  //           title: t("Debit"),
  //           dataIndex: "calc_db",
  //           key: "calc_db",
  //           className: "print-table-column",
  //           render: (text: any) => {
  //             return <>{fixedNumber(text ?? 0, 4)} </>;
  //           },
  //         },
  //         {
  //           title: t("Credit"),
  //           dataIndex: "calc_cr",
  //           key: "calc_cr",
  //           className: "print-table-column",
  //           render: (text: any) => {
  //             return <>{fixedNumber(text ?? 0, 4)} </>;
  //           },
  //         },
  //         {
  //           title: t("Sales.Product_and_services.Inventory.Currency"),
  //           dataIndex: "calc_cur",
  //           key: "calc_cur",
  //           className: "print-table-column",
  //         },
  //         {
  //           title: t("Sales.Product_and_services.Currency.Currency_rate"),
  //           dataIndex: "calc_cur_rate",
  //           key: "calc_cur_rate",
  //           className: "print-table-column",
  //           render: (text: any) => {
  //             var num = parseFloat(text ?? 0);
  //             return <>{num}</>;
  //           },
  //         },
  //       ],
  //     },
  //   ];
  //   return newColumns;
  // }, [t]);

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
          <ColumnGroup title={t('Accounting.Account')}>
            <Column
              title={t('Banking.Form.Account_id').toUpperCase()}
              dataIndex='customer_id'
              key='customer_id'
              sorter={sorter && { multiple: 7 }}
              className='table-col'
            />

            <Column
              title={t('Banking.Form.Account_name').toUpperCase()}
              dataIndex='customer_name'
              key='customer_name'
              sorter={sorter && { multiple: 6 }}
              className='table-col'
            />
          </ColumnGroup>
          {details && (
            <ColumnGroup
              title={t('Sales.Customers.Receive_cash.Receive_details')}
            >
              <Column
                title={t('Sales.All_sales.Invoice.Date_and_time').toUpperCase()}
                dataIndex='date_time'
                key='date_time'
                className='table-col'
                render={(text) => {
                  return <ShowDate date={text} />;
                }}
                sorter={sorter && { multiple: 5 }}
              />

              <Column
                title={`${t('Form.Description').toUpperCase()}`}
                dataIndex='desc'
                key='desc'
                sorter={sorter && { multiple: 9 }}
                className='table-col'
              />
            </ColumnGroup>
          )}
          {isCurrency && (
            <ColumnGroup
              title={t('Sales.Customers.Receive_cash.Paid_currency')}
            >
              <Column
                title={t('Debit').toUpperCase()}
                dataIndex='db'
                key='db'
                // sorter={sorter && { multiple: 8 }}
                render={(_: any, record: any) => {
                  return (
                    <Statistics
                      value={
                        record?.transaction_type === 'payment'
                          ? 0
                          : record?.amount
                      }
                    />
                  );
                }}
                className='table-col'
              />

              <Column
                title={t('Credit').toUpperCase()}
                dataIndex='cr'
                key='cr'
                render={(_: any, record: any) => {
                  return (
                    <Statistics
                      value={
                        record?.transaction_type !== 'payment'
                          ? 0
                          : record?.amount
                      }
                    />
                  );
                }}
                className='table-col'
                // sorter={sorter && { multiple: 7 }}
              />

              <Column
                title={t(
                  'Sales.Product_and_services.Inventory.Currency'
                ).toUpperCase()}
                dataIndex='currency_name'
                key='currency_name'
                sorter={sorter && { multiple: 4 }}
                className='table-col'
              />

              <Column
                title={t(
                  'Sales.Product_and_services.Currency.Currency_rate'
                ).toUpperCase()}
                dataIndex='currency_rate'
                key='currency_rate'
                render={(value: any) => <Statistics value={value} />}
                className='table-col'
                sorter={sorter && { multiple: 3 }}
              />
            </ColumnGroup>
          )}
          {calCurrency && (
            <ColumnGroup
              title={t('Sales.Customers.Receive_cash.Calculate_currency')}
            >
              <Column
                title={t('Debit').toUpperCase()}
                dataIndex='calc_db'
                key='calc_db'
                // sorter={sorter && { multiple: 4 }}
                render={(_: any, record: any) => {
                  return (
                    <Statistics
                      value={
                        record?.transaction_type === 'payment'
                          ? 0
                          : record?.amount_calc
                      }
                    />
                  );
                }}
                className='table-col'
              />

              <Column
                title={t('Credit').toUpperCase()}
                dataIndex='calc_cr'
                key='calc_cr'
                render={(_: any, record: any) => {
                  return (
                    <Statistics
                      value={
                        record?.transaction_type !== 'payment'
                          ? 0
                          : record?.amount_calc
                      }
                    />
                  );
                }}
                className='table-col'
                // sorter={sorter && { multiple: 3 }}
              />

              <Column
                title={t(
                  'Sales.Product_and_services.Inventory.Currency'
                ).toUpperCase()}
                dataIndex='currency_calc_name'
                key='currency_calc_name'
                sorter={sorter && { multiple: 2 }}
                className='table-col'
              />

              <Column
                title={t(
                  'Sales.Product_and_services.Currency.Currency_rate'
                ).toUpperCase()}
                dataIndex='currency_rate_calc'
                key='currency_rate_calc'
                render={(value) => <Statistics value={value} />}
                className='table-col'
                sorter={sorter && { multiple: 1 }}
              />
            </ColumnGroup>
          )}
        </React.Fragment>
      );
    },
    [calCurrency, details, isCurrency, t]
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
          render={(value) => <Statistics value={value} />}
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
            'Sales.Product_and_services.Inventory.Currency'
          ).toUpperCase()}
          dataIndex='currency'
          key='currency'
        />
      </React.Fragment>
    ),
    [t]
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
      {transactionType?.label && (
        <Descriptions.Item label={t('Reports.Debit_or_credit')}>
          {transactionType?.label}
        </Descriptions.Item>
      )}
    </Descriptions>
  );
  const onChangeSelectResult = (e: any) => {
    setSelectResult(e.target.checked);
  };

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

          <TableSummaryCell index={2}>
            {t('Reports.Total_debit')}
          </TableSummaryCell>

          <TableSummaryCell index={3}>
            {t('Reports.Total_credit')}
          </TableSummaryCell>

          {details && (
            <React.Fragment>
              <TableSummaryCell index={4}>
                {t('Reports.Result')}
              </TableSummaryCell>

              <TableSummaryCell index={5}>
                {t('Reports.Result_name')}
              </TableSummaryCell>
            </React.Fragment>
          )}

          {(isCurrency || calCurrency) && (
            <TableSummaryCell index={6} colSpan={8}>
              {t('Sales.Product_and_services.Inventory.Currency')}
            </TableSummaryCell>
          )}
        </Table.Summary.Row>
        {resultData?.map((item: any) => {
          return (
            <Table.Summary.Row>
              <TableSummaryCell isSelected={selectResult} index={0} />
              <TableSummaryCell isSelected={selectResult} index={1} />

              <TableSummaryCell
                isSelected={selectResult}
                index={2}
                type='total'
                value={item?.total_receivement}
              />

              <TableSummaryCell
                isSelected={selectResult}
                index={3}
                type='total'
                value={item?.total_payment}
              />

              {details && (
                <React.Fragment>
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
                </React.Fragment>
              )}
              {(isCurrency || calCurrency) && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={6}
                  colSpan={8}
                >
                  {item?.currency}
                </TableSummaryCell>
              )}
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
      handleGetData={handleGetDebitCredit}
      settingMenu={setting}
      filters={filters}
      filterNode={(setPage, setSelectedRowKeys) => (
        <DebitAndCreditFilters
          setFilters={setFilters}
          setPage={setPage}
          setSelectedRowKeys={setSelectedRowKeys}
          setSelectResult={setSelectResult}
        />
      )}
      filtersComponent={printFilters}
      resultDataSource={resultData}
      resultDomColumns={resultColumns}
      summary={summary}
      resultLoading={result.isLoading}
      resultFetching={result.isFetching}
    />
  );
};
const styles = {
  settingsMenu: { minWidth: '130px', paddingBottom: '10px' },
};

export default DebitAndCreditTable;
