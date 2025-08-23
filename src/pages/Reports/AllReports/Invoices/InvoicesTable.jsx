import React, { useEffect, useMemo, useState } from 'react';
import Filters from './Filters';
import moment from 'moment';
import { useQuery } from 'react-query';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Checkbox, Table, Button, Menu, Typography, Descriptions } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../../../MediaQurey';
import axiosInstance from '../../../ApiBaseUrl';
import { utcDate } from '../../../../Functions/utcDate';
import useGetRunningPeriod from '../../../../Hooks/useGetRunningPeriod';
import ShowDate from '../../../SelfComponents/JalaliAntdComponents/ShowDate';
import { AntdTag, ReportTable, Statistics } from '../../../../components/antd';
import { TableSummaryCell } from '../../../../components';
import { Colors } from '../../../colors';
import { INVOICES_RESULT_LIST } from '../../../../constants/routes';
import { MANI_INVOICES_VALUE } from '../../../../constants';

const { Column } = Table;
const dateFormat = 'YYYY-MM-DD HH:mm';

const InvoicesTable = (props) => {
  const [selectResult, setSelectResult] = useState(false);
  const isMobile = useMediaQuery('(max-width: 576px)');
  const { t } = useTranslation();
  const [visibility, setVisibility] = useState(false);
  const [
    {
      customer,
      type,
      date,
      total,
      discount,
      expense,
      remind,
      currency,
      cashAmount,
      description,
    },
    setColumns,
  ] = useState({
    customer: true,
    type: true,
    date: true,
    total: true,
    discount: true,
    expense: true,
    remind: true,
    currency: true,
    cashAmount: true,
    cashCurrency: true,
    description: true,
  });

  const [filters, setFilters] = useState({
    invoiceType: {
      value: MANI_INVOICES_VALUE,
      label: t('All_posting_invoice'),
    },
    status: { value: 'pending', label: t('Pending') },
    startDate: '',
    endDate: utcDate().format(dateFormat),
  });
  const { startDate, endDate, invoiceType, status } = filters;

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
  const [search, setSearch] = useState('');

  // setting  checkbox show More
  const handelVisibility = () => {
    setVisibility(!visibility);
  };

  //setting checkbox
  const onChangeCustomer = (e) =>
    setColumns((prev) => {
      return { ...prev, customer: e.target.checked };
    });
  const onChangeType = (e) =>
    setColumns((prev) => {
      return { ...prev, type: e.target.checked };
    });

  const onChangeDate = (e) => {
    setColumns((prev) => {
      return { ...prev, date: e.target.checked };
    });
  };

  const onChangeTotal = (e) => {
    setColumns((prev) => {
      return { ...prev, total: e.target.checked };
    });
  };
  const onchangeCashAmount = (e) => {
    setColumns((prev) => {
      return { ...prev, cashAmount: e.target.checked };
    });
  };
  const onChangeCurrency = (e) => {
    setColumns((prev) => {
      return { ...prev, currency: e.target.checked };
    });
  };

  const onChangeDiscount = (e) => {
    setColumns((prev) => {
      return { ...prev, discount: e.target.checked };
    });
  };

  const onChangeExpense = (e) => {
    setColumns((prev) => {
      return { ...prev, expense: e.target.checked };
    });
  };

  const onChangeRemind = (e) => {
    setColumns((prev) => {
      return { ...prev, remind: e.target.checked };
    });
  };

  const onChangeDescription = (e) => {
    setColumns((prev) => {
      return { ...prev, description: e.target.checked };
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
        <Checkbox onChange={onChangeType} checked={type}>
          {t('Sales.Product_and_services.Type')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='2'>
        <Checkbox onChange={onChangeCustomer} checked={customer}>
          {t('Sales.Customers.Customer')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='4'>
        <Checkbox onChange={onChangeDate} checked={date}>
          {t('Sales.Customers.Form.Date')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='7'>
        <Checkbox onChange={onChangeExpense} checked={expense}>
          {t('Expenses.1')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='6'>
        <Checkbox onChange={onChangeDiscount} checked={discount}>
          {t('Sales.Customers.Discount.1')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='8'>
        <Checkbox onChange={onChangeTotal} checked={total}>
          {t('Sales.Customers.Form.Total')}
        </Checkbox>
      </Menu.Item>

      {visibility && (
        <React.Fragment>
          <Menu.Item key='5'>
            <Checkbox onChange={onChangeRemind} checked={remind}>
              {t('Sales.All_sales.Invoice.Remain_amount')}
            </Checkbox>
          </Menu.Item>
          <Menu.Item key='10'>
            <Checkbox onChange={onChangeCurrency} checked={currency}>
              {t('Sales.Product_and_services.Inventory.Currency')}
            </Checkbox>
          </Menu.Item>
          <Menu.Item key='9'>
            <Checkbox onChange={onchangeCashAmount} checked={cashAmount}>
              {t('Sales.All_sales.Purchase_and_sales.Cash')}
            </Checkbox>
          </Menu.Item>

          <Menu.Item key='11'>
            <Checkbox onChange={onChangeDescription} checked={description}>
              {t('Form.Description')}
            </Checkbox>
          </Menu.Item>
        </React.Fragment>
      )}

      <Menu.Item
        key='14'
        onClick={handelVisibility}
        className='table__header2-setting-showMore'
        style={{ textAlign: 'end' }}
      >
        {visibility ? (
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

  const invoiceValue = invoiceType?.value;
  const statusValue = status?.value;
  const handleGetInvoices = React.useCallback(
    async ({ queryKey }) => {
      const {
        page,
        pageSize,
        search,
        order,
        startDate,
        endDate,
        invoiceType,
        status,
      } = queryKey?.[1] || {};
      const invoiceValue = invoiceType?.value;
      const statusValue = status?.value;
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?page=${page}&page_size=${pageSize}&search=${search}&ordering=${order}&expand=currency,cash_payment.currency,cash_payment.currency_calc&date_time_after=${startDate}&date_time_before=${endDate}&invoice_type_in=${invoiceValue}&invoice_state=${statusValue}`,
      );
      return data;
    },
    [props.baseUrl],
  );

  const getInvoicesResult = React.useCallback(async ({ queryKey }) => {
    const { search, startDate, endDate, invoiceValue, statusValue } =
      queryKey?.[1] || {};
    const { data } = await axiosInstance.get(
      `${INVOICES_RESULT_LIST}?expand=currency&search=${search}&page_size=200&date_time_after=${startDate}&date_time_before=${endDate}&invoice_type_in=${invoiceValue}&invoice_state=${statusValue}`,
    );
    return data;
  }, []);

  const result = useQuery(
    [
      INVOICES_RESULT_LIST,
      {
        startDate,
        endDate,
        invoiceValue,
        search,
        statusValue,
      },
    ],
    getInvoicesResult,
    // { enabled: !!startDate, cacheTime: 0 }
  );

  const columns = useMemo(
    (tableType) => {
      const sorter = tableType !== 'print' ? true : false;
      return (
        <React.Fragment>
          {/* <ColumnGroup
            title={t(
              "Sales.All_sales.Purchase_and_sales.Invoice_details"
            ).toUpperCase()}
          > */}
          <Column
            title={t(
              'Sales.All_sales.Purchase_and_sales.Invoice_id',
            ).toUpperCase()}
            dataIndex='id'
            key='id'
            width={tableType !== 'print' ? 130 : undefined}
            sorter={sorter && { multiple: 12 }}
            className='table-col'
            align='center'
          />
          {type && (
            <Column
              title={t('Sales.Product_and_services.Type').toUpperCase()}
              dataIndex='invoice_type'
              key='invoice_type'
              sorter={sorter && { multiple: 11 }}
              className='table-col'
            />
          )}
          {customer && (
            <Column
              title={t('Sales.Customers.Customer').toUpperCase()}
              dataIndex='customer'
              key='customer'
              sorter={sorter && { multiple: 10 }}
              className='table-col'
            />
          )}
          {date && (
            <Column
              title={t('Sales.Customers.Form.Date').toUpperCase()}
              width={tableType !== 'print' ? (isMobile ? 70 : 180) : undefined}
              dataIndex='date_time'
              key='date_time'
              sorter={sorter && { multiple: 9 }}
              render={(text) => {
                return <ShowDate date={text} />;
              }}
              className='table-col'
            />
          )}
          {expense && (
            <Column
              title={t('Expenses.1').toUpperCase()}
              dataIndex='expense'
              key='expense'
              sorter={sorter && { multiple: 8 }}
              className='table-col'
              render={(value) => <Statistics value={value} />}
            />
          )}
          {discount && (
            <Column
              title={t('Sales.Customers.Discount.1').toUpperCase()}
              dataIndex='discount'
              key='discount'
              sorter={sorter && { multiple: 7 }}
              className='table-col'
              render={(value) => <Statistics value={value} />}
            />
          )}

          {total && (
            <Column
              title={t('Sales.Customers.Form.Total').toUpperCase()}
              dataIndex='invoice_total'
              key='invoice_total'
              sorter={sorter && { multiple: 6 }}
              className='table-col'
              render={(value) => <Statistics value={value} />}
            />
          )}
          {remind && (
            <Column
              title={t('Sales.All_sales.Invoice.Remain_amount').toUpperCase()}
              dataIndex='remain'
              key='remain'
              sorter={sorter && { multiple: 5 }}
              width={tableType !== 'print' ? 160 : undefined}
              className='table-col'
              render={(value) => <Statistics value={value} />}
            />
          )}

          {currency && (
            <Column
              title={t(
                'Sales.Product_and_services.Inventory.Currency',
              ).toUpperCase()}
              dataIndex='currency'
              key='currency'
              sorter={sorter && { multiple: 4 }}
              className='table-col'
              render={(currency) => {
                return <span>{t(`Reports.${currency?.symbol}`)}</span>;
              }}
            />
          )}
          {/* </ColumnGroup>
          {(cashAmount || cashCurrency) && (
            <ColumnGroup
              title={t("Sales.All_sales.Purchase_and_sales.Cash").toUpperCase()}
            > */}
          {cashAmount && (
            <Column
              title={t('Sales.All_sales.Purchase_and_sales.Cash').toUpperCase()}
              dataIndex='cash_payment'
              key='cash_payment'
              className='table-col'
              render={(value) => {
                return (
                  <span style={styles.unit}>
                    {sorter
                      ? value?.map((item) => {
                          return (
                            <AntdTag key={item?.id} color={Colors.primaryColor}>
                              <Statistics
                                value={item?.amount}
                                suffix={item?.currency?.symbol}
                                className='invoiceStatistic'
                                valueStyle={{ color: Colors.primaryColor }}
                              />
                              {item?.currency?.id !==
                                item?.currency_calc?.id && (
                                <React.Fragment>
                                  {' '}
                                  {t('Equivalent')}{' '}
                                  <Statistics
                                    value={item?.amount_calc}
                                    suffix={item?.currency_calc?.symbol}
                                    className='invoiceStatistic'
                                    valueStyle={{
                                      color: Colors.primaryColor,
                                    }}
                                  />
                                </React.Fragment>
                              )}
                            </AntdTag>
                          );
                        })
                      : value?.map((item, index) => {
                          if (index === 0) {
                            return (
                              <>
                                <Statistics
                                  value={item?.amount}
                                  suffix={item?.currency?.symbol}
                                  className='invoiceStatistic'
                                />
                                {item?.currency?.id !==
                                  item?.currency_calc?.id && (
                                  <React.Fragment>
                                    {' '}
                                    {t('Equivalent')}{' '}
                                    <Statistics
                                      value={item?.amount_calc}
                                      suffix={item?.currency_calc?.symbol}
                                      className='invoiceStatistic'
                                    />
                                  </React.Fragment>
                                )}
                              </>
                            );
                          }
                          return (
                            <>
                              <Statistics
                                value={item?.amount}
                                suffix={item?.currency?.symbol}
                                className='invoiceStatistic'
                                valueStyle={{ fontSize: 'inherit' }}
                              />
                              {item?.currency?.id !==
                                item?.currency_calc?.id && (
                                <React.Fragment>
                                  {' '}
                                  {t('Equivalent')}{' '}
                                  <Statistics
                                    value={item?.amount_calc}
                                    suffix={item?.currency_calc?.symbol}
                                    className='invoiceStatistic'
                                    valueStyle={{ fontSize: 'inherit' }}
                                  />
                                </React.Fragment>
                              )}
                            </>
                          );
                        })}
                  </span>
                );
              }}
            />
          )}
          {/* {cashCurrency && (
                <Column
                  title={t(
                    "Sales.Product_and_services.Inventory.Currency"
                  ).toUpperCase()}
                  dataIndex="cash_fin__currency__name"
                  key="cash_fin__currency__name"
                  className="table-col"
                  sorter={sorter && { multiple: 2 }}
                />
              )}
            </ColumnGroup>
          )} */}
          {description && (
            <Column
              title={t('Form.Description').toUpperCase()}
              dataIndex='description'
              key='description'
              className='table-col'
              sorter={sorter && { multiple: 1 }}
            />
          )}
        </React.Fragment>
      );
    },
    [
      cashAmount,
      currency,
      customer,
      date,
      description,
      discount,
      expense,
      isMobile,
      remind,
      t,
      total,
      type,
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

        {expense && (
          <Column
            title={t('Expenses.1').toUpperCase()}
            dataIndex='total_expense'
            render={(value) => <Statistics value={value} />}
          />
        )}
        {discount && (
          <Column
            title={t('Sales.Customers.Discount.1').toUpperCase()}
            dataIndex='total_discount'
            key='total_discount'
            render={(value) => <Statistics value={value} />}
          />
        )}

        {total && (
          <Column
            title={t('Sales.Customers.Form.Total').toUpperCase()}
            dataIndex='total_net_amount'
            key='total_net_amount'
            render={(value) => <Statistics value={value} />}
          />
        )}
        {remind && (
          <Column
            title={t('Sales.All_sales.Invoice.Remain_amount').toUpperCase()}
            dataIndex='total_remain'
            key='total_remain'
            render={(value) => <Statistics value={value} />}
          />
        )}

        {currency && (
          <Column
            title={t(
              'Sales.Product_and_services.Inventory.Currency',
            ).toUpperCase()}
            dataIndex='currency'
            key='currency'
            render={(currency) => {
              return (
                <span>
                  {currency?.symbol
                    ? t(`Reports.${currency?.symbol}`)
                    : currency}
                </span>
              );
            }}
          />
        )}

        {cashAmount && (
          <Column
            title={t('Sales.All_sales.Invoice.Cash_amount').toUpperCase()}
            dataIndex='total_cash'
            key='total_cash'
            render={(value) => <Statistics value={value} />}
          />
        )}
        {/* {cashCurrency && (
          <Column
            title={t(
              "Sales.All_sales.Purchase_and_sales.Cash_currency"
            ).toUpperCase()}
            dataIndex="cash_currency_name"
            key="cash_currency_name"
          />
        )} */}
      </React.Fragment>
    ),
    [cashAmount, currency, discount, expense, remind, t, total],
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
      {invoiceType?.label && (
        <Descriptions.Item label={t('Sales.Product_and_services.Type')}>
          {invoiceType?.label}
        </Descriptions.Item>
      )}
      {status?.label && (
        <Descriptions.Item label={t('Sales.Product_and_services.Status')}>
          {status?.label}
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
        <Table.Summary.Row>
          <TableSummaryCell index={0} type='checkbox'>
            <Checkbox onChange={onChangeSelectResult} checked={selectResult} />
          </TableSummaryCell>
          <TableSummaryCell index={1} />
          <TableSummaryCell index={2} />
          {type && <TableSummaryCell index={3} />}
          {customer && <TableSummaryCell index={4} />}
          {date && <TableSummaryCell index={5} />}
          {expense && (
            <TableSummaryCell index={6}>{t('Expenses.1')}</TableSummaryCell>
          )}
          {discount && (
            <TableSummaryCell index={7}>
              {t('Sales.Customers.Discount.1')}
            </TableSummaryCell>
          )}
          {total && (
            <TableSummaryCell index={8}>
              {t('Sales.Customers.Form.Total')}
            </TableSummaryCell>
          )}
          {remind && (
            <TableSummaryCell index={9}>
              {t('Sales.All_sales.Invoice.Remain_amount')}
            </TableSummaryCell>
          )}

          {currency && (
            <TableSummaryCell index={10}>
              {t('Sales.Product_and_services.Inventory.Currency')}
            </TableSummaryCell>
          )}
          {cashAmount && (
            <TableSummaryCell index={11}>
              {t('Sales.All_sales.Invoice.Cash_amount')}
            </TableSummaryCell>
          )}

          {description && <TableSummaryCell index={13} />}
        </Table.Summary.Row>

        {result?.data?.results?.map((item) => {
          return (
            <Table.Summary.Row key={item?.id}>
              <TableSummaryCell isSelected={selectResult} index={0} />
              <TableSummaryCell isSelected={selectResult} index={1} />
              <TableSummaryCell isSelected={selectResult} index={2} />

              {type && <TableSummaryCell isSelected={selectResult} index={3} />}
              {customer && (
                <TableSummaryCell isSelected={selectResult} index={4} />
              )}

              {date && <TableSummaryCell isSelected={selectResult} index={5} />}
              {expense && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={6}
                  type='total'
                  value={item?.total_expense}
                />
              )}

              {discount && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={7}
                  type='total'
                  value={item?.total_discount}
                />
              )}
              {total && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={8}
                  type='total'
                  value={item?.total_net_amount}
                />
              )}
              {remind && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={9}
                  type='total'
                  value={item?.total_remain}
                />
              )}

              {currency && (
                <TableSummaryCell isSelected={selectResult} index={10}>
                  {item?.currency}
                </TableSummaryCell>
              )}

              {cashAmount && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={11}
                  type='total'
                  value={item?.total_cash}
                />
              )}

              {description && (
                <TableSummaryCell isSelected={selectResult} index={13} />
              )}
            </Table.Summary.Row>
          );
        })}
      </>
    );
  };

  return (
    <>
      <ReportTable
        pagination={true}
        setSearch={setSearch}
        search={search}
        setSelectResult={setSelectResult}
        selectResult={selectResult}
        title={t('Reports.Invoices')}
        columns={columns}
        queryKey={props.baseUrl}
        handleGetData={handleGetInvoices}
        settingMenu={setting}
        filters={filters}
        filterNode={(setPage, setSelectedRowKeys) => (
          <Filters
            setFilters={setFilters}
            setPage={setPage}
            setSelectedRowKeys={setSelectedRowKeys}
            setSelectResult={setSelectResult}
          />
        )}
        filtersComponent={printFilters}
        resultDataSource={result?.data?.results}
        resultDomColumns={resultColumns}
        // queryConf={{ cacheTime: 0 }}
        // summary={summary}
        resultLoading={result.isLoading}
        resultFetching={result.isFetching}
      />
      <div>
        <Table
          // columns={resultColumns}
          dataSource={result?.data?.results}
        >
          {resultColumns}
        </Table>
      </div>
    </>
  );
};
const styles = {
  card: { background: '#3498db', padding: '24px 20px' },
  settingsMenu: { width: '170px', paddingBottom: '10px' },
};

export default InvoicesTable;
