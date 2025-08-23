import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Table } from 'antd';
import axiosInstance from '../../../ApiBaseUrl';

export const globalPaginationConf = {
  keepPreviousData: true,
  refetchOnWindowFocus: false,
};

const ExpensesResultTable = (props) => {
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

  const { search, startDate, endDate, payId, recId, accountId } = props.filters;
  // const usePaginatedProps =
  //   props.place === "cashTransactions" ? { cacheTime: 0 } : {};
  const getSalesReport = React.useCallback(
    async ({ queryKey }) => {
      const { search, order, accountId, startDate, endDate, payId, recId } =
        queryKey?.[1] || {
          search: '',
          order: '-id',
          accountId: '',
          startDate: '',
          endDate: '',
          payId: '',
          recId: '',
        };
      const { data } = await axiosInstance.get(
        `${props.baseUrl}result/?search=${search}&ordering=${order}${
          props.place !== 'currencyExchange' && props.place !== 'moneyTransfer'
            ? `&account=${accountId}`
            : ''
        }&date_time_after=${startDate}&date_time_before=${endDate}${
          props.place === 'cashTransactions' ||
          props.place === 'moneyTransfer' ||
          props.place === 'currencyExchange'
            ? `&pay_by=${payId}&rec_by=${recId}`
            : ''
        }`,
      );
      return data;
    },
    [props.baseUrl, props.place],
  );

  const { isLoading, isFetching, data } = useQuery(
    [
      `${props.baseUrl}result/`,
      {
        search,
        order,
        accountId,
        startDate,
        endDate,
        payId,
        recId,
      },
    ],
    getSalesReport,
    // usePaginatedProps
  );

  const onChangeTable = (pagination, filters, sorter) => {
    if (sorter.order === 'ascend') {
      setOrder(sorter.field);
    } else if (sorter.order === 'descend') {
      setOrder(`-${sorter.field}`);
    } else {
      setOrder(`-id`);
    }
  };

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
      pagination={false}
      dataSource={data}
      bordered={true}
      scroll={{ x: 'max-content', scrollToFirstRowOnChange: true }}
    >
      {props?.columns}
    </Table>
  );
};

export default ExpensesResultTable;
