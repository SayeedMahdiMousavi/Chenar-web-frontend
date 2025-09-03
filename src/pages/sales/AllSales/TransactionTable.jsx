import React, { Fragment, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { SettingOutlined, SearchOutlined } from '@ant-design/icons';
import { Row, Col, Table, Dropdown, Button, Space, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../../MediaQurey';
import TransactionAction from './TransactionAction';
import { usePaginationNumber } from '../../usePaginationNumber';
import axiosInstance from '../../ApiBaseUrl';
import { SearchInput } from '../../SelfComponents/SearchInput';
import PrintButton from '../../SelfComponents/PrintButton';
import ReloadButton from '../../../components/buttons/ReloadButton';
import ShowDate from '../../SelfComponents/JalaliAntdComponents/ShowDate';
import { checkPermissions } from '../../../Functions';
import {
  INVOICES_P,
  PURCHASE_INVOICE_M,
  PURCHASE_ORDER_INVOICE_M,
  PURCHASE_REJ_INVOICE_M,
  QUOTATION_INVOICE_M,
  SALES_INVOICE_M,
  SALES_ORDER_INVOICE_M,
  SALES_REJ_INVOICE_M,
} from '../../../constants/permissions';
import SalesTotal from './SalesTotal';
import TableError from '../../../components/antd/TableError';
import { AntdTag, Statistics } from '../../../components/antd';
import {
  PURCHASE_INVOICE_LIST,
  PURCHASE_ORDER_INVOICE_LIST,
  PURCHASE_REJECT_INVOICE_LIST,
  QUOTATION_INVOICE_LIST,
  SALES_INVOICE_LIST,
  SALES_ORDER_INVOICE_LIST,
  SALES_REJECT_INVOICE_LIST,
} from '../../../constants/routes';
import InvoicesTableSettings from './InvoicesTableSettings';
import { Colors } from '../../colors';

export const handleCheckViewInvoice = (invoice) => {
  return checkPermissions(`view_${invoice}`);
};

const TransactionTable = () => {
  const queryClient = useQueryClient();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState(false);
  const isMobile = useMediaQuery('(max-width: 576px)');
  const { t } = useTranslation();
  const [filterColumns, setColumns] = useState({
    customer: true,
    date: true,
    total: true,
    currency: true,
    cashCurrency: true,
    representative: false,
    invoiceStatus: false,
    createdBy: false,
    createdAt: false,
    modifiedBy: false,
    modifiedDate: false,
    description: false,
  });
  const [search, setSearch] = useState('');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [order, setOrder] = useState('-id');
  const [invoiceId, setInvoiceId] = useState('');
  const [baseUrl, setBaseUrl] = useState(
    handleCheckViewInvoice(SALES_INVOICE_M)
      ? SALES_INVOICE_LIST
      : handleCheckViewInvoice(SALES_REJ_INVOICE_M)
        ? SALES_REJECT_INVOICE_LIST
        : handleCheckViewInvoice(SALES_ORDER_INVOICE_M)
          ? SALES_ORDER_INVOICE_LIST
          : handleCheckViewInvoice(PURCHASE_INVOICE_M)
            ? PURCHASE_INVOICE_LIST
            : handleCheckViewInvoice(PURCHASE_REJ_INVOICE_M)
              ? PURCHASE_REJECT_INVOICE_LIST
              : handleCheckViewInvoice(PURCHASE_ORDER_INVOICE_M)
                ? PURCHASE_ORDER_INVOICE_LIST
                : handleCheckViewInvoice(QUOTATION_INVOICE_M)
                  ? QUOTATION_INVOICE_LIST
                  : '',
  );

  const {
    customer,
    date,
    total,
    currency,
    cashCurrency,
    representative,
    invoiceStatus,
    createdBy,
    createdAt,
    modifiedBy,
    modifiedDate,
    description,
  } = filterColumns;

  const setting = (
    <InvoicesTableSettings
      {...filterColumns}
      setColumns={setColumns}
      baseUrl={baseUrl}
    />
  );

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  // Row selection
  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };

  const getInvoices = React.useCallback(
    async ({ queryKey }) => {
      const { page, pageSize, search, order, invoiceId } = queryKey?.[1] || {};
      const { data } = await axiosInstance.get(
        `${baseUrl}?page=${page}&page_size=${pageSize}&search=${search}&ordering=${order}&id=${invoiceId}&omit=cash_payment.date_time,cash_payment.pay_by,cash_payment.rec_by,cash_payment.description,cash_payment.currency_rate_calc,cash_payment.currency_rate&expand=cash_payment,cash_payment.currency,cash_payment.currency_calc,created_by,modified_by,representative,currency,customer&fields=id,currency,currency_rate,date_time,description,customer,created_by,created,cash_payment,invoice_state,invoice_total,invoice_type,modified,modified_by,representative`,
      );
      return data;
    },
    [baseUrl],
  );

  const { isLoading, isFetching, data, status, error, refetch } = useQuery(
    [baseUrl, { page, pageSize, search, order, invoiceId }],
    getInvoices,
  );

  const hasMore = Boolean(data?.nextPageNumber);

  React.useEffect(() => {
    if (hasMore && !isFetching) {
      queryClient.prefetchQuery(
        [baseUrl, { page: page + 1, pageSize, search, order, invoiceId }],
        getInvoices,
      );
    }
  }, [
    order,
    data,
    page,
    pageSize,
    search,
    baseUrl,
    getInvoices,
    invoiceId,
    queryClient,
    hasMore,
    isFetching,
  ]);

  // Pagination
  const paginationChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };
  const onPageSizeChange = (current, size) => {
    setPageSize(size);
    setPage(current);
  };
  const onChangeTable = (_, __, sorter) => {
    if (sorter.order === 'ascend') {
      setOrder(sorter.field);
    } else if (sorter.order === 'descend') {
      setOrder(`-${sorter.field}`);
    } else {
      setOrder(`-id`);
    }
  };
  const pagination = {
    total: data?.count,
    pageSizeOptions: [5, 10, 20, 50],
    onShowSizeChange: onPageSizeChange,
    defaultPageSize: 5,
    current: page,
    pageSize: pageSize,
    defaultCurrent: 1,
    onChange: paginationChange,
    showTotal: (total) =>
      `${t('Pagination.Total')} ${total} ${t('Pagination.Item')}`,
    showQuickJumper: true,
    showSizeChanger: true,
    responsive: true,
    showLessItems: true,
  };

  const allData = usePaginationNumber(data, page, pageSize);
  const handleChangeBaseUrl = (value) => {
    setPage(1);
    setBaseUrl(value);
  };

  const onReload = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const hasSelected = selectedRowKeys.length > 0;

  const columns = useMemo(
    () =>
      (type = 'default') => {
        const sorter = type !== 'print';
        return [
          {
            title: t('Table.Row').toUpperCase(),
            dataIndex: 'serial',
            key: 'serial',
            width: type !== 'print' ? 80 : 40,
            className: 'table-col',
            align: 'center',
            fixed: type !== 'print' ? true : false,
            render: (text, __, index) => (type !== 'print' ? text : index + 1),
          },
          {
            title: t(
              'Sales.All_sales.Purchase_and_sales.Invoice_id',
            ).toUpperCase(),
            dataIndex: 'id',
            key: 'id',
            width: type !== 'print' ? 155 : undefined,
            sorter: sorter && { multiple: 13 },
            className: 'table-col',
            align: 'center',
          },
          ...(customer
            ? [
                {
                  title:
                    baseUrl === PURCHASE_INVOICE_LIST ||
                    baseUrl === PURCHASE_REJECT_INVOICE_LIST
                      ? t('Expenses.Suppliers.Supplier').toUpperCase()
                      : t('Sales.Customers.Customer').toUpperCase(),
                  dataIndex: 'customer',
                  key: 'customer',
                  sorter: sorter && { multiple: 12 },
                  className: 'table-col',
                  render: (text) => text?.content_object?.full_name,
                },
              ]
            : []),
          ...(date
            ? [
                {
                  title: t('Sales.Customers.Form.Date').toUpperCase(),
                  dataIndex: 'date_time',
                  key: 'date_time',
                  sorter: sorter && { multiple: 11 },
                  render: (text) => <ShowDate date={text} />,
                  className: 'table-col',
                },
              ]
            : []),
          ...(total
            ? [
                {
                  title: t('Sales.Customers.Form.Total').toUpperCase(),
                  dataIndex: 'invoice_total',
                  key: 'invoice_total',
                  sorter: sorter && { multiple: 10 },
                  className: 'table-col',
                  render: (value) => value && <Statistics value={value} />,
                },
              ]
            : []),
          ...(currency
            ? [
                {
                  title: t(
                    'Sales.Product_and_services.Inventory.Currency',
                  ).toUpperCase(),
                  dataIndex: 'currency',
                  key: 'currency',
                  sorter: sorter && { multiple: 9 },
                  className: 'table-col',
                  render: (text) => t(`Reports.${text?.symbol}`),
                },
                {
                  title: t(
                    'Sales.Product_and_services.Currency.Currency_rate',
                  ).toUpperCase(),
                  dataIndex: 'currency_rate',
                  key: 'currency_rate',
                  sorter: sorter && { multiple: 8 },
                  className: 'table-col',
                  render: (value) => parseFloat(value),
                },
              ]
            : []),
          ...(cashCurrency && baseUrl !== QUOTATION_INVOICE_LIST
            ? [
                {
                  title: t(
                    'Sales.All_sales.Purchase_and_sales.Cash',
                  ).toUpperCase(),
                  dataIndex: 'cash_payment',
                  key: 'cash_payment',
                  className: 'table-col',
                  render: (value) => (
                    <span style={styles.unit}>
                      {sorter
                        ? value?.map((item) => (
                            <AntdTag key={item?.id} color={Colors.primaryColor}>
                              <Statistics
                                value={item?.amount}
                                suffix={item?.currency?.symbol}
                                className='invoiceStatistic'
                                valueStyle={{ color: Colors.primaryColor }}
                              />
                              {item?.currency?.id !==
                                item?.currency_calc?.id && (
                                <>
                                  {' '}
                                  {t('Equivalent')}{' '}
                                  <Statistics
                                    value={item?.amount_calc}
                                    suffix={item?.currency_calc?.symbol}
                                    className='invoiceStatistic'
                                    valueStyle={{ color: Colors.primaryColor }}
                                  />
                                </>
                              )}
                            </AntdTag>
                          ))
                        : value?.map((item, index) => (
                            <Fragment key={item?.id}>
                              <Statistics
                                value={item?.amount}
                                suffix={item?.currency?.symbol}
                                className='invoiceStatistic'
                                valueStyle={{
                                  fontSize: index === 0 ? 'inherit' : undefined,
                                }}
                              />
                              {item?.currency?.id !==
                                item?.currency_calc?.id && (
                                <>
                                  {' '}
                                  {t('Equivalent')}{' '}
                                  <Statistics
                                    value={item?.amount_calc}
                                    suffix={item?.currency_calc?.symbol}
                                    className='invoiceStatistic'
                                    valueStyle={{
                                      fontSize:
                                        index === 0 ? 'inherit' : undefined,
                                    }}
                                  />
                                </>
                              )}
                            </Fragment>
                          ))}
                    </span>
                  ),
                },
              ]
            : []),
          ...(representative && baseUrl === SALES_INVOICE_LIST
            ? [
                {
                  title: t('Representative').toUpperCase(),
                  dataIndex: 'representative',
                  key: 'representative',
                  sorter: sorter && { multiple: 7 },
                  className: 'table-col',
                  render: (text) => text?.content_object?.full_name,
                },
              ]
            : []),
          ...(invoiceStatus
            ? [
                {
                  title: t('Sales.Product_and_services.Status').toUpperCase(),
                  dataIndex: 'invoice_state',
                  key: 'invoice_state',
                  sorter: sorter && { multiple: 6 },
                  className: 'table-col',
                },
              ]
            : []),
          ...(createdBy
            ? [
                {
                  title: t('Form.Created_by').toUpperCase(),
                  dataIndex: 'created_by',
                  key: 'created_by',
                  sorter: sorter && { multiple: 5 },
                  width: type !== 'print' ? 140 : undefined,
                  render: (text) => text?.username,
                },
              ]
            : []),
          ...(createdAt
            ? [
                {
                  title: t(
                    'Sales.Product_and_services.Form.Created_date',
                  ).toUpperCase(),
                  dataIndex: 'created',
                  key: 'created',
                  sorter: sorter && { multiple: 4 },
                  className: 'table-col',
                  render: (text) => <ShowDate date={text} />,
                },
              ]
            : []),
          ...(modifiedBy
            ? [
                {
                  title: t(
                    'Sales.Product_and_services.Form.Modified_by',
                  ).toUpperCase(),
                  dataIndex: 'modified_by',
                  key: 'modified_by',
                  sorter: sorter && { multiple: 3 },
                  render: (text) => text?.username,
                },
              ]
            : []),
          ...(modifiedDate
            ? [
                {
                  title: t(
                    'Sales.Product_and_services.Form.Modified_date',
                  ).toUpperCase(),
                  dataIndex: 'modified',
                  key: 'modified',
                  sorter: sorter && { multiple: 2 },
                  render: (text) => <ShowDate date={text} />,
                },
              ]
            : []),
          ...(description
            ? [
                {
                  title: t('Form.Description').toUpperCase(),
                  dataIndex: 'description',
                  key: 'description',
                  className: 'table-col',
                  sorter: sorter && { multiple: 1 },
                },
              ]
            : []),
          ...(type !== 'print'
            ? [
                {
                  title: t('Table.Action'),
                  key: 'action',
                  align: 'center',
                  width: isMobile ? 50 : 70,
                  render: (text, record) => (
                    <TransactionAction
                      record={record}
                      baseUrl={baseUrl}
                      hasSelected={hasSelected}
                    />
                  ),
                  fixed: 'right',
                  className: 'table-col',
                },
              ]
            : []),
        ];
      },
    [
      t,
      customer,
      baseUrl,
      date,
      total,
      representative,
      invoiceStatus,
      currency,
      createdBy,
      createdAt,
      modifiedBy,
      modifiedDate,
      cashCurrency,
      description,
      isMobile,
      hasSelected,
    ],
  );

  const handleRetry = () => {
    refetch();
  };

  const emptyText =
    status !== 'error' ? undefined : (
      <TableError error={error} handleRetry={handleRetry} />
    );

  return (
    <div className='table-col table__padding'>
      {collapsed || !checkPermissions(INVOICES_P) ? null : <SalesTotal />}

      <Row>
        <Col span={24}>
          <Table
            expandable
            id='allSales'
            className='table-content'
            size='small'
            locale={{ emptyText: emptyText }}
            loading={isLoading || isFetching ? true : false}
            rowSelection={rowSelection}
            rowKey={(record) => record?.id}
            onChange={onChangeTable}
            pagination={pagination}
            dataSource={allData}
            bordered={true}
            scroll={{ x: 'max-content', scrollToFirstRowOnChange: true }}
            columns={columns()} // Use the columns array
            title={() => {
              return (
                <Row className='num' align='middle' gutter={5}>
                  <Col md={{ span: 22 }} xs={{ span: 21 }}>
                    <Space
                      size={12}
                      style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}
                    >
                      <SearchInput
                        setPage={setPage}
                        placeholder={t('Form.Search')}
                        setSearch={setSearch}
                        suffix={
                          <SearchOutlined className='search_icon_color' />
                        }
                      />
                      <SearchInput
                        setPage={setPage}
                        placeholder={t('Form.Filter_by_id')}
                        setSearch={setInvoiceId}
                        style={{ width: '150px' }}
                      />
                      <Select
                        value={baseUrl}
                        onChange={handleChangeBaseUrl}
                        style={{ width: '180px' }}
                      >
                        {handleCheckViewInvoice(SALES_INVOICE_M) && (
                          <Select.Option value={SALES_INVOICE_LIST}>
                            {t('Sales.All_sales.Invoice.Sales_invoice')}
                          </Select.Option>
                        )}
                        {handleCheckViewInvoice(SALES_REJ_INVOICE_M) && (
                          <Select.Option value={SALES_REJECT_INVOICE_LIST}>
                            {t('Sales.All_sales.Invoice.Reject_sales_invoice')}
                          </Select.Option>
                        )}
                        {handleCheckViewInvoice(SALES_ORDER_INVOICE_M) && (
                          <Select.Option value={SALES_ORDER_INVOICE_LIST}>
                            {t('Sales_order')}
                          </Select.Option>
                        )}
                        {handleCheckViewInvoice(PURCHASE_INVOICE_M) && (
                          <Select.Option value={PURCHASE_INVOICE_LIST}>
                            {t('Sales.All_sales.Invoice.Purchase_invoice')}
                          </Select.Option>
                        )}
                        {handleCheckViewInvoice(PURCHASE_REJ_INVOICE_M) && (
                          <Select.Option value={PURCHASE_REJECT_INVOICE_LIST}>
                            {t(
                              'Sales.All_sales.Invoice.Reject_purchase_invoice',
                            )}
                          </Select.Option>
                        )}
                        {handleCheckViewInvoice(PURCHASE_ORDER_INVOICE_M) && (
                          <Select.Option value={PURCHASE_ORDER_INVOICE_LIST}>
                            {t('Purchase_order')}
                          </Select.Option>
                        )}
                        {handleCheckViewInvoice(QUOTATION_INVOICE_M) && (
                          <Select.Option value={QUOTATION_INVOICE_LIST}>
                            {t('Sales.All_sales.Invoice.Quotation_invoice')}
                          </Select.Option>
                        )}
                      </Select>
                      {selectedRowKeys?.length > 0 && (
                        <ReloadButton
                          onReload={onReload}
                          selectedRowKeys={selectedRowKeys}
                        />
                      )}
                    </Space>
                  </Col>
                  <Col
                    md={{ span: 2 }}
                    xs={{ span: 3 }}
                    className='textAlign__end'
                  >
                    <Space size={1} align='start'>
                      <PrintButton
                        disabled={selectedRowKeys?.length === 0}
                        domColumns={columns('print')}
                        title={t('Sales.All_sales.Purchase_and_sales.1')}
                        dataSource={selectedRows}
                      />
                      <Dropdown
                        menu={{ items: [{ key: 'settings', label: setting }] }}
                        trigger={['click']}
                        onOpenChange={handleVisibleChange}
                        open={visible}
                        placement='bottomRight'
                      >
                        <Button
                          shape='circle'
                          icon={<SettingOutlined />}
                          style={styles.settingIcon}
                          type='link'
                        />
                      </Dropdown>
                    </Space>
                  </Col>
                </Row>
              );
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

const styles = {
  settingIcon: { width: '26px', minWidth: '25px' },
  icon: { fontSize: '20px' },
  unit: {}, // Added to ensure styles.unit is defined
};

export default TransactionTable;
