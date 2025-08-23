import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { usePaginationNumber } from '../../../usePaginationNumber';
import axiosInstance from '../../../ApiBaseUrl';
import { WAREHOUSE_SALES_INVOICE_RESULT_LIST } from '../../../../constants/routes';

const SalesInvoiceResultTable = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [order, setOrder] = useState('-id');

  //row selection
  const onSelectChange = (selectedRowKeys, selectedRows) => {
    props.setSelectedRowKeys(selectedRowKeys);
    props.setSelectedRows(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys: props.selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };

  const {
    search,
    startDate,
    endDate,
    accountId,
    representativeId,
    statusValue,
  } = props.filter;

  const getSalesResult = React.useCallback(async ({ queryKey }) => {
    const {
      page,
      pageSize,
      search,
      order,
      accountId,
      startDate,
      endDate,
      representativeId,
      statusValue,
    } = queryKey?.[1] || {};
    const { data } = await axiosInstance.get(
      `${WAREHOUSE_SALES_INVOICE_RESULT_LIST}?page=${page}&ordering=${order}&page_size=${pageSize}&search=${search}&customer=${accountId}&representative=${representativeId}&invoice_state=${statusValue}&date_time_after=${startDate}&date_time_before=${endDate}`,
    );
    return data;
  }, []);

  const { isLoading, isFetching, data } = useQuery(
    [
      WAREHOUSE_SALES_INVOICE_RESULT_LIST,
      {
        page,
        pageSize,
        search,
        order,
        accountId,
        startDate,
        endDate,
        representativeId,
        statusValue,
      },
    ],
    getSalesResult,
    // { enabled: !!startDate }
  );

  const hasMore = Boolean(data?.nextPageNumber);
  React.useEffect(() => {
    if (hasMore) {
      queryClient.prefetchQuery(
        [
          WAREHOUSE_SALES_INVOICE_RESULT_LIST,
          {
            page: page + 1,
            pageSize,
            search,
            order,
            accountId,
            startDate,
            endDate,
            representativeId,
            statusValue,
          },
        ],
        getSalesResult,
      );
    }
  }, [
    order,
    data,
    page,
    pageSize,
    search,
    props.baseUrl,
    getSalesResult,
    accountId,
    startDate,
    endDate,
    queryClient,
    hasMore,
    representativeId,
    statusValue,
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
    hideOnSinglePage: true,
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
      rowKey={(record) => record.serial}
      onChange={onChangeTable}
      pagination={pagination}
      dataSource={allData}
      bordered={true}
      scroll={{ x: 'max-content', scrollToFirstRowOnChange: true }}
    >
      {props.tableChildren}
    </Table>
  );
};

export default SalesInvoiceResultTable;
