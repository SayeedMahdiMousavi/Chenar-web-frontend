import React from 'react';
import { useQuery } from 'react-query';
import { Table } from 'antd';
import axiosInstance from '../../../ApiBaseUrl';
import { WAREHOUSE_CARDX_RESULT_LIST } from '../../../../constants/routes';

const WarehouseCardXResultTable = (props) => {
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

  const { productId } = props.filter;

  const getSalesReport = React.useCallback(async ({ queryKey }) => {
    const {
      search,
      customerId,
      startDate,
      endDate,
      productId,
      warehouseId,
      invoiceTypeValue,
      status,
    } = queryKey?.[1] || {};
    const { data } = await axiosInstance.get(
      `${WAREHOUSE_CARDX_RESULT_LIST}?search=${
        search ?? ''
      }&customer=${customerId}&id=${productId}&warehouse=${warehouseId}&invoice_type_in=${invoiceTypeValue}&invoice_state=${status}`,
    );
    return data;
  }, []);

  const { isLoading, isFetching, data } = useQuery(
    [WAREHOUSE_CARDX_RESULT_LIST, props.filter],
    getSalesReport,
    {
      enabled: !!productId,
      // , cacheTime: 0
    },
  );

  return (
    <Table
      expandable
      id='allSales'
      className='table-content'
      size='small'
      loading={isLoading || isFetching ? true : false}
      rowSelection={rowSelection}
      rowKey={(record) => `${record.warehouse}${record.currency}`}
      pagination={false}
      dataSource={data?.results}
      bordered={true}
      scroll={{ x: 'max-content', scrollToFirstRowOnChange: true }}
    >
      {props.columns('originalTable')}
    </Table>
  );
};

export default WarehouseCardXResultTable;
