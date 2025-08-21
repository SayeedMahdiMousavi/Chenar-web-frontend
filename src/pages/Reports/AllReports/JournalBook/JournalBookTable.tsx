import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import axiosInstance from '../../../ApiBaseUrl';
import { useQuery } from 'react-query';
import Filters from './Filters';
import { Table, Menu, Typography, Checkbox, Descriptions } from 'antd';
import { useTranslation } from 'react-i18next';
import { utcDate } from '../../../../Functions/utcDate';
import useGetRunningPeriod from '../../../../Hooks/useGetRunningPeriod';
// import { fixedNumber } from "../../../../Functions/math";
import ShowDate from '../../../SelfComponents/JalaliAntdComponents/ShowDate';
import { ReportTable, Statistics } from '../../../../components/antd';
import { reportsDateFormat } from '../../../../Context';
// import { Colors } from "../../../colors";
// import { generate } from "@ant-design/colors";
import { TableSummaryCell } from '../../../../components';
import JournalBookBankAccount from './journalBookBankAccount';

export const dateFormat = reportsDateFormat;
export const dateTimeEndDate = utcDate().format(dateFormat);

const { Column, ColumnGroup } = Table;

interface IProps {
  baseUrl: string;
  resultUrl: string;
  place: string;
}
const defaultFilterData = { value: '', label: '' };
const JournalBookTable: React.FC<IProps> = (props) => {
  const [selectResult, setSelectResult] = useState<boolean>(false);
  const [filters, setFilters] = useState<any>({
    currencyData: defaultFilterData,
    bank: defaultFilterData,
    accountType: defaultFilterData,
    startDate: '',
    endDate: utcDate().format(dateFormat),
  });

  const { t } = useTranslation();
  const [{ currency, calCurrency, details }, setColumns] = useState({
    currency: true,
    calCurrency: false,
    details: true,
  });
  const [search, setSearch] = useState<string | number>('');

  const { currencyData, bank, startDate, endDate, accountType } = filters;

  // //get running period
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

  // useEffect(() => {
  //   (async () => {
  //     // const data = await fetch(props.baseUrl)?.then((res) =>
  //     //
  //     // );

  //     // Default options are marked with *

  //     if (startDate) {
  //       await fetch(
  //         `http://93.104.209.16/api/v1${props.baseUrl}?date_time_after=${startDate}`,
  //         {
  //           cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  //           method: "GET",
  //           headers: {
  //             Authorization: "Bearer " + localStorage.getItem("access_token"),
  //             "Accept-Language": "en",
  //           },
  //         }
  //       )
  //         .then((res) => res.json())
  //         .then((data) => console.log(data?.results));
  //     }
  //   })();
  // }, [endDate, props.baseUrl, startDate]);

  //setting checkbox
  const onChangeCurrency = () =>
    setColumns((prev) => {
      return { ...prev, currency: !currency };
    });

  const onChangeDetails = () => {
    setColumns((prev) => {
      return { ...prev, details: !details };
    });
  };

  const onChangeCalCurrency = () => {
    setColumns((prev) => {
      return { ...prev, calCurrency: !calCurrency };
    });
  };

  const setting = (
    <Menu style={styles.settingsMenu}>
      <Menu.Item key='1'>
        <Typography.Text strong={true}>
          {t('Sales.Product_and_services.Columns')}
        </Typography.Text>
      </Menu.Item>
      <Menu.Item key='1'>
        <Checkbox defaultChecked onChange={onChangeCurrency}>
          {t('Sales.Customers.Receive_cash.Paid_currency')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='2'>
        <Checkbox defaultChecked onChange={onChangeDetails}>
          {t('Sales.Customers.Receive_cash.Receive_details')}
        </Checkbox>
      </Menu.Item>

      <Menu.Item key='3'>
        <Checkbox onChange={onChangeCalCurrency}>
          {t('Sales.Customers.Receive_cash.Calculate_currency')}
        </Checkbox>
      </Menu.Item>
    </Menu>
  );

  const bankId = bank?.value ?? '';
  const currencyId = currencyData?.value ?? '';
  const accountTypeValue = accountType?.value ?? '';

  const handleGetJournal = React.useCallback(
    //@ts-ignore
    async ({ queryKey }) => {
      const {
        page,
        pageSize,
        search,
        order,
        currencyData,
        startDate,
        endDate,
        bank,
        accountType,
      } = queryKey?.[1];
      const bankId = bank?.value ?? '';
      const currencyId = currencyData?.value ?? '';
      const accountTypeValue = accountType?.value ?? '';
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?page=${page}&page_size=${pageSize}&ordering=${order}&search=${search}&account_type=${accountTypeValue}&currency=${currencyId}&date_time_after=${startDate}&date_time_before=${endDate}&account=${bankId}`
      );
      return data;
    },
    [props.baseUrl]
  );

  const getJournalTotal = React.useCallback(
    //@ts-ignore
    async ({ queryKey }) => {
      const { currencyId, startDate, endDate, bankId, accountTypeValue } =
        queryKey?.[1];

      const { data } = await axiosInstance.get(
        `${props.resultUrl}?currency=${currencyId}&date_time_after=${startDate}&account_type=${accountTypeValue}&date_time_before=${endDate}&account=${bankId}`
      );
      return data;
    },
    [props.resultUrl]
  );

  const result = useQuery(
    [
      props.resultUrl,
      { currencyId, startDate, endDate, bankId, accountTypeValue },
    ],
    getJournalTotal,
    {
      enabled: !!startDate,
      // cacheTime: 0,
    }
  );

  // const pageStyle = `@media all {
  //   .page-break {
  //     // display: none;
  //   }
  // }

  // @media print {
  //   html, body {
  //     height: initial !important;
  //     overflow: initial !important;
  //     -webkit-print-color-adjust: exact;
  //   }
  // }

  // @media print {
  //   .page-break {
  //     margin-top: 1rem;
  //     display: block;
  //     page-break-before: auto;
  //   }
  // }

  // @page {
  //   size: auto;
  //   margin: 10mm 0mm;
  // }
  // `;

  // const pageStyle = `@page {
  //   size:11.69in 8.27in
  // }`;
  // const pageStyle = `@page {
  //   size: 8.27in 11.69in
  // }`;

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
  //       title: t("Sales.Customers.Receive_cash.Payer"),
  //       dataIndex: "pay_by__name",
  //       key: "pay_by__name",
  //       className: "print-table-column",
  //     },
  //     {
  //       title: t("Sales.Customers.Receive_cash.Receive_details"),
  //       className: "print-table-column",
  //       children: [
  //         {
  //           title: t("Sales.All_sales.Invoice.Date_and_time"),
  //           dataIndex: "date_time",
  //           key: "date_time",
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
  //           title: t("Sales.Customers.Form.Amount"),
  //           dataIndex: "amount",
  //           key: "amount",
  //           className: "print-table-column",
  //           render: (text: any) => {
  //             var num = parseFloat(text);
  //             return <>{num}</>;
  //           },
  //         },
  //         {
  //           title: t("Sales.Product_and_services.Inventory.Currency"),
  //           dataIndex: "currency__name",
  //           key: "currency__name",
  //           className: "print-table-column",
  //         },
  //         {
  //           title: t("Sales.Product_and_services.Currency.Currency_rate"),
  //           dataIndex: "currency_rate",
  //           key: "currency_rate",
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
  //           title: t("Sales.Customers.Form.Amount"),
  //           dataIndex: "amount_calc",
  //           key: "amount_calc",
  //           className: "print-table-column",
  //           render: (text: any) => {
  //             var num = parseFloat(text);
  //             return <>{num}</>;
  //           },
  //         },
  //         {
  //           title: t("Sales.Product_and_services.Inventory.Currency"),
  //           dataIndex: "currency_calc__name",
  //           key: "currency_calc__name",
  //           className: "print-table-column",
  //         },
  //         {
  //           title: t("Sales.Product_and_services.Currency.Currency_rate"),
  //           dataIndex: "currency_rate_calc",
  //           key: "currency_rate_calc",
  //           className: "print-table-column",
  //           render: (text: any) => {
  //             var num = parseFloat(text);
  //             return <>{num}</>;
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       title: t("Sales.Customers.Receive_cash.Receiver"),
  //       dataIndex: "rec_by__name",
  //       key: "rec_by__name",
  //       className: "print-table-column",
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
  //       title: t("Sales.Product_and_services.Inventory.Currency"),
  //       dataIndex: "currency__name",
  //       key: "currency__name",
  //       className: "print-table-column",
  //     },
  //     {
  //       title: t("Debit"),
  //       dataIndex: "debit",
  //       key: "debit",
  //       className: "print-table-column",
  //     },

  //     {
  //       title: t("Credit"),
  //       dataIndex: "credit",
  //       key: "credit",
  //       className: "print-table-column",
  //     },
  //     {
  //       title: t("Step.Previous"),
  //       dataIndex: "previous",
  //       key: "previous",
  //       className: "print-table-column",
  //       render: (text: any) => {
  //         return <>{fixedNumber(text ?? 0, 4)} </>;
  //       },
  //     },
  //     {
  //       title: t("Reports.Result"),
  //       dataIndex: "result",
  //       key: "result",
  //       className: "print-table-column",
  //       render: (text: any, record: any) => {
  //         const result =
  //           parseInt(record?.previous) +
  //           parseInt(record?.debit) -
  //           parseFloat(record?.credit);
  //         return <>{fixedNumber(result ?? 0, 4)} </>;
  //       },
  //     },
  //   ];
  //   return newColumns;
  // }, [t]);

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
      {bank?.label && (
        <Descriptions.Item label={t('Banking.Form.Account_name')}>
          {bank?.label}
        </Descriptions.Item>
      )}
      {accountType?.label && (
        <Descriptions.Item label={t('Account_type')}>
          {accountType?.label}
        </Descriptions.Item>
      )}
      {currencyData?.label && (
        <Descriptions.Item
          label={t('Sales.Product_and_services.Inventory.Currency')}
        >
          {currencyData?.label}
        </Descriptions.Item>
      )}
    </Descriptions>
  );

  const columns = useMemo(
    () => (type: string) => {
      const sorter = type !== 'print' ? true : false;
      return (
        <React.Fragment>
          <Column
            title={t('Sales.Customers.Receive_cash.Payer').toUpperCase()}
            dataIndex='pay_by_name'
            key='pay_by_name'
            fixed={type !== 'print' ? true : undefined}
            className='table-col'
            sorter={sorter && { multiple: 10 }}
          />

          <Column
            title={t('Sales.Customers.Form.Amount').toUpperCase()}
            dataIndex='amount'
            key='amount'
            sorter={sorter && { multiple: 9 }}
            render={(value) => <Statistics value={value} />}
            className='table-col'
          />

          <Column
            title={t(
              'Sales.Product_and_services.Inventory.Currency'
            ).toUpperCase()}
            dataIndex='currency_name'
            key='currency_name'
            sorter={sorter && { multiple: 8 }}
            className='table-col'
          />

          <Column
            title={t(
              'Sales.Product_and_services.Currency.Currency_rate'
            ).toUpperCase()}
            dataIndex='currency_rate'
            key='currency_rate'
            render={(value) => <Statistics value={value} />}
            className='table-col'
            sorter={sorter && { multiple: 7 }}
          />
          {/* {currency && (
            <ColumnGroup
              title={t("Sales.Customers.Receive_cash.Paid_currency")}
            ></ColumnGroup>
          )} */}

          <Column
            title={t('Sales.All_sales.Invoice.Date_and_time').toUpperCase()}
            dataIndex='date_time'
            key='date_time'
            className='table-col'
            render={(text) => {
              return <ShowDate date={text} />;
            }}
            sorter={sorter && { multiple: 6 }}
          />

          <Column
            title={`${t('Form.Description').toUpperCase()}`}
            dataIndex='desc'
            key='desc'
            sorter={sorter && { multiple: 5 }}
            className='table-col'
          />

          {/* {details && (
            <ColumnGroup
              title={t("Sales.Customers.Receive_cash.Receive_details")}
            >
              
            </ColumnGroup>
          )} */}
          {calCurrency && (
            <ColumnGroup
              title={t('Sales.Customers.Receive_cash.Calculate_currency')}
            >
              <Column
                title={t('Sales.Customers.Form.Amount').toUpperCase()}
                dataIndex='amount_calc'
                key='amount_calc'
                sorter={sorter && { multiple: 4 }}
                render={(value) => <Statistics value={value} />}
                className='table-col'
              />

              <Column
                title={t(
                  'Sales.Product_and_services.Inventory.Currency'
                ).toUpperCase()}
                dataIndex='currency_calc_name'
                key='currency_calc_name'
                sorter={sorter && { multiple: 3 }}
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
                sorter={sorter && { multiple: 2 }}
              />
            </ColumnGroup>
          )}
          <Column
            title={t('Sales.Customers.Receive_cash.Receiver').toUpperCase()}
            dataIndex='rec_by_name'
            key='rec_by_name'
            fixed={type !== 'print' ? 'right' : undefined}
            className='table-col'
            sorter={sorter && { multiple: 1 }}
          />
        </React.Fragment>
      );
    },
    [calCurrency, currency, details, t]
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
          title={t('Sales.Product_and_services.Currency.1').toUpperCase()}
          dataIndex='currency__name'
          key='currency__name'
        />

        <Column
          title={t('Debit').toUpperCase()}
          dataIndex='debit'
          key='debit'
          render={(value) => <Statistics value={value} />}
        />

        <Column
          title={t('Credit').toUpperCase()}
          dataIndex='credit'
          key='credit'
          render={(value) => <Statistics value={value} />}
        />

        <Column
          title={t('Step.Previous').toUpperCase()}
          dataIndex='previous'
          key='previous'
          render={(value) => <Statistics value={value} />}
        />

        <Column
          title={t('Reports.Result').toUpperCase()}
          dataIndex='result'
          key='result'
          render={(
            text,
            record: { previous: string; debit: string; credit: string }
          ) => {
            const result =
              parseInt(record?.previous) +
              parseInt(record?.debit) -
              parseFloat(record?.credit);
            return <Statistics value={result} />;
          }}
        />
      </React.Fragment>
    ),
    [t]
  );

  const resultData = result?.data;

  // const primary = useMemo(() => generate(Colors.primaryColor), []);

  const summary = () => {
    return (
      <>
        <Table.Summary.Row>
          <TableSummaryCell index={0} type='checkbox' color={'#000000'}>
            <Checkbox onChange={onChangeSelectResult} checked={selectResult} />
          </TableSummaryCell>
          <TableSummaryCell index={1} color={'#000000'}>
            {t('Sales.Customers.Form.Total')}
          </TableSummaryCell>
          <TableSummaryCell index={2} color={'#000000'}>
            {t('Sales.Product_and_services.Currency.1')}
          </TableSummaryCell>
          {currency && (
            <TableSummaryCell index={3} color={'#000000'}>
              {t('Debit')}
            </TableSummaryCell>
          )}
          {currency && (
            <TableSummaryCell index={4} color={'#000000'}>
              {t('Credit')}
            </TableSummaryCell>
          )}
          {currency && (
            <TableSummaryCell index={5} color={'#000000'}>
              {t('Step.Previous')}
            </TableSummaryCell>
          )}
          {details && (
            <React.Fragment>
              <TableSummaryCell index={6} color={'#000000'}>
                {t('Reports.Result')}
              </TableSummaryCell>
              <TableSummaryCell index={7} color={'#000000'} />
            </React.Fragment>
          )}
          {calCurrency && (
            <React.Fragment>
              <TableSummaryCell index={8} color={'#000000'} />
              <TableSummaryCell index={9} color={'#000000'} />
              <TableSummaryCell index={10} color={'#000000'} />
            </React.Fragment>
          )}
          <TableSummaryCell index={11} color={'#000000'} />
        </Table.Summary.Row>
        {resultData?.map((item: any) => {
          const result =
            parseFloat(item?.previous) +
            parseFloat(item?.debit) -
            parseFloat(item?.credit);
          return (
            <Table.Summary.Row>
              <TableSummaryCell
                index={0}
                isSelected={selectResult}
                color={'#000000'}
              />
              <TableSummaryCell
                index={1}
                isSelected={selectResult}
                color={'#000000'}
              />
              <TableSummaryCell
                index={2}
                isSelected={selectResult}
                color={'#000000'}
              >
                {item?.currency__name}
              </TableSummaryCell>
              {currency && (
                <TableSummaryCell
                  index={3}
                  isSelected={selectResult}
                  value={item?.debit}
                  type='total'
                  color={'#000000'}
                />
              )}
              {currency && (
                <TableSummaryCell
                  color={'#000000'}
                  index={4}
                  isSelected={selectResult}
                  value={item?.credit}
                  type='total'
                />
              )}
              {currency && (
                <TableSummaryCell
                  index={5}
                  isSelected={selectResult}
                  type='total'
                  value={item?.previous}
                  color={'#000000'}
                />
              )}
              {details && (
                <React.Fragment>
                  <TableSummaryCell
                    index={6}
                    color={'#000000'}
                    isSelected={selectResult}
                    value={result}
                    type='total'
                  />

                  <TableSummaryCell
                    index={7}
                    isSelected={selectResult}
                    color={'#0a0a0a'}
                  />
                </React.Fragment>
              )}
              {calCurrency && (
                <React.Fragment>
                  <TableSummaryCell index={8} isSelected={selectResult} />
                  <TableSummaryCell index={9} isSelected={selectResult} />
                  <TableSummaryCell index={10} isSelected={selectResult} />
                </React.Fragment>
              )}
              <TableSummaryCell index={11} isSelected={selectResult} />
            </Table.Summary.Row>
          );
        })}
      </>
    );
  };
  return (
    <>
      <ReportTable
        setSearch={setSearch}
        pagination={true}
        search={search}
        setSelectResult={setSelectResult}
        selectResult={selectResult}
        title={t('Reports.Journal_book')}
        columns={columns}
        queryKey={props.baseUrl}
        handleGetData={handleGetJournal}
        settingMenu={setting}
        filters={filters}
        filterNode={(setPage, setSelectedRowKeys) => (
          <Filters
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
          enabled: !!startDate,
        }}
        // summary={summary}
        resultLoading={result.isLoading}
        resultFetching={result.isFetching}
        paginationPosition={t('Dir') === 'ltr' ? ['topRight'] : ['topLeft']}
      />
      <JournalBookBankAccount data={result?.data} />
    </>
  );
};

const styles = {
  settingsMenu: { minWidth: '130px', paddingBottom: '10px' },
};

export default JournalBookTable;
