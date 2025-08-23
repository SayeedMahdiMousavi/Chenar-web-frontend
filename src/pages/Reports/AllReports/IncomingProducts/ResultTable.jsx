import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useQuery, useQueryClient } from 'react-query';
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { usePaginationNumber } from '../../../usePaginationNumber';
import axiosInstance from '../../../ApiBaseUrl';
import { utcDate } from '../../../../Functions/utcDate';
import { fixedNumber } from '../../../../Functions/math';

const { Column } = Table;
const dateFormat = 'YYYY-MM-DD HH:mm';

const IncomingProductsResultTable = (props) => {
  const queryClient = useQueryClient();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { t } = useTranslation();

  const [{ customerName, startDate, endDate }, setFilters] = useState({
    customerName: '',
    startDate: '',
    endDate: utcDate().format(dateFormat),
  });

  const runingPeriod = useQuery(
    '/system_setting/finance_period/get_running_period/',
    async () => {
      const result = await axiosInstance
        .get(`/system_setting/finance_period/get_running_period/`)
        .then((res) => {
          return res;
        })
        .catch((e) => {
          if (e?.response?.data?.message) {
            // message.error(`${e?.response?.data?.message}`);
          }
        });

      return result?.data;
    },
  );
  useEffect(() => {
    if (runingPeriod?.data?.start_date) {
      setFilters((prev) => {
        return {
          ...prev,
          startDate: runingPeriod?.data?.start_date
            ? moment(runingPeriod?.data?.start_date, dateFormat).format(
                dateFormat,
              )
            : '',
        };
      });
    }
  }, [runingPeriod.data.start_date]);

  const [search, setSearch] = useState('');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [order, setOrder] = useState('-id');

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
    // this.setState({ selectedRowKeys });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
    // onSelect: (record, selected, selectedRows, nativeEvent) => {
    //
    //     `record:${record} select  ${selected}  selectedRows  ${selectedRows}  nativeEvent   ${nativeEvent}`
    //   );

    // },
    // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
    // hideDefaultSelections: true,
    getCheckboxProps: (record) => ({
      disabled: record.status === 'inActive', // Column configuration not to be checked
      name: record.name,
    }),
  };

  const getSalesReport = React.useCallback(
    async ({ queryKey }) => {
      const {
        page,
        pageSize,
        search,
        order,
        customerName,
        startDate,
        endDate,
      } = queryKey?.[1] || {};
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?page=${page}&page_size=${pageSize}&id=${search}&ordering=${order}&expand=*&fields=currency,customer.content_object,date_time,id,payment_summery&customer_name=${customerName}&date_time_after=${startDate}&date_time_before=${endDate}`,
      );
      return data;
    },
    [props.baseUrl],
  );
  const { isLoading, isFetching, data } = useQuery(
    [
      `${props.baseUrl}/report`,
      { page, pageSize, search, order, customerName, startDate, endDate },
    ],
    getSalesReport,
  );
  const hasMore = Boolean(data?.nextPageNumber);
  React.useEffect(() => {
    if (hasMore) {
      queryClient.prefetchQuery(
        [
          props.baseUrl,
          {
            page: page + 1,
            pageSize,
            search,
            order,
            customerName,
            startDate,
            endDate,
          },
        ],
        getSalesReport,
      );
    }
  }, [
    order,
    data,
    page,
    pageSize,
    search,
    props.baseUrl,
    getSalesReport,
    customerName,
    startDate,
    endDate,
    queryClient,
    hasMore,
  ]);

  //
  //pagination
  const paginationChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };
  const onPageSizeChange = (current, size) => {
    setPageSize(size);
    setPage(current);
  };
  const onChangeTable = (pagination, filters, sorter) => {
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

  return (
    <Table
      expandable
      id='allSales'
      className='table-content'
      size='small'
      loading={isLoading || isFetching ? true : false}
      rowSelection={rowSelection}
      rowKey={(record) => record.id}
      onChange={onChangeTable}
      pagination={pagination}
      dataSource={allData}
      bordered={true}
      scroll={{ x: 'max-content', scrollToFirstRowOnChange: true }}
    >
      <Column
        title={t('Table.Row').toUpperCase()}
        dataIndex='serial'
        key='serial'
        width={80}
        className='table-col'
        align='center'
        fixed={true}
      />

      <Column
        title={t('Banking.Form.Account_name').toUpperCase()}
        dataIndex='customer'
        key='customer'
        fixed={true}
        sorter={true}
        className='table-col'
        render={(text, record) => {
          return (
            <React.Fragment>{text?.content_object?.full_name}</React.Fragment>
          );
        }}
      />

      {props.columnsFilter?.warehouse && (
        <Column
          title={t('Warehouse.1').toUpperCase()}
          dataIndex='name'
          key='name'
          className='table-col'
          sorter={true}
        />
      )}
      {props.columnsFilter?.product && (
        <Column
          title={t('Sales.Product_and_services.Product').toUpperCase()}
          dataIndex='name'
          key='name'
          className='table-col'
          sorter={true}
        />
      )}

      {props.columnsFilter?.unit && (
        <Column
          title={t('Sales.Product_and_services.Units.Unit').toUpperCase()}
          dataIndex='unit'
          key='unit'
          sorter={{ multiple: 5 }}
          className='table-col'
        />
      )}

      {props.columnsFilter?.qty && (
        <Column
          title={t('Reports.Available_quantity').toUpperCase()}
          dataIndex='available'
          key='available'
          className='table-col'
          sorter={{ multiple: 4 }}
          render={(text) => (
            <div direction='ltr'>{text && fixedNumber(text, 4)}</div>
          )}
        />
      )}

      {props.columnsFilter?.total && (
        <Column
          title={t('Sales.Customers.Form.Total').toUpperCase()}
          dataIndex='net_amount'
          key='net_amount'
          sorter={true}
          className='table-col'
          render={(text, record) => {
            return (
              <React.Fragment>
                {record?.payment_summery?.net_amount &&
                  parseFloat(record?.payment_summery?.net_amount)}
              </React.Fragment>
            );
          }}
        />
      )}

      {props.columnsFilter?.currency && (
        <Column
          title={t(
            'Sales.Product_and_services.Inventory.Currency',
          ).toUpperCase()}
          dataIndex='currency'
          key='currency'
          sorter={true}
          render={(text) => {
            return <React.Fragment>{text?.name}</React.Fragment>;
          }}
          className='table-col'
        />
      )}
    </Table>
  );
};

export default IncomingProductsResultTable;
