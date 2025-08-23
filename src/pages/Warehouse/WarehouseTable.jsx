/* eslint-disable react/display-name */
import React, { Fragment, useCallback, useMemo, useState } from 'react';
import axiosInstance from '../ApiBaseUrl';
import Filters from '../sales/Products/Units/Filters';
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../MediaQurey';
import Action from './Action';
import { PaginateTable } from '../../components/antd';
import { checkPermissions } from '../../Functions';
import { WAREHOUSE_M } from '../../constants/permissions';
// import PrintReports from "../PrintComponents/PrintReports";

const { Column } = Table;
const WarehouseTable = (props) => {
  const isMobile = useMediaQuery('(max-width:400px)');
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ state: 'active' });

  //get warehouse list
  const getWarehouses = useCallback(
    async ({ queryKey }) => {
      const { page, pageSize, search, order, state } = queryKey?.[1] || {
        page: 1,
        pageSize: 10,
        search: '',
        order: 'id',
        state: filters.state,
      };
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?page=${page}&page_size=${pageSize}&search=${search}&ordering=${order}&status=${state}`,
      );
      return data;
    },
    [props.baseUrl],
  );

  const columns = useMemo(
    () => (type, hasSelected) => {
      const sorter = type !== 'print' ? true : false;
      return (
        <React.Fragment>
          <Column
            title={t('Warehouse.Warehouse_id').toUpperCase()}
            dataIndex='id'
            key='id'
            width={type !== 'print' ? 145 : false}
            sorter={sorter && { multiple: 4 }}
            fixed={sorter}
            className='table-col'
            // align="center"
          />
          <Column
            title={t('Form.Name').toUpperCase()}
            dataIndex='name'
            fixed={sorter}
            key='name'
            className='table-col'
            sorter={sorter && { multiple: 3 }}
          />

          <Column
            title={t('Warehouse.Responsible').toUpperCase()}
            dataIndex='responsible'
            key='responsible'
            className='table-col'
            sorter={sorter && { multiple: 2 }}
          />
          <Column
            title={t('Form.Address').toUpperCase()}
            dataIndex='address'
            key='address'
            className='table-col'
            sorter={sorter && { multiple: 1 }}
          />

          {type !== 'print' &&
            checkPermissions([
              `delete_${WAREHOUSE_M}`,
              `change_${WAREHOUSE_M}`,
            ]) && (
              <Column
                title={t('Table.Action')}
                key='action'
                align='center'
                width={isMobile ? 50 : 70}
                className='table-col'
                render={(text, record) => (
                  <Action
                    record={record}
                    hasSelected={hasSelected}
                    baseUrl={props.baseUrl}
                    handleUpdateItems={props.handleUpdateItems}
                  />
                )}
              />
            )}
        </React.Fragment>
      );
    },
    [isMobile, props.baseUrl, props.handleUpdateItems, t],
  );

  return (
    <Fragment>
      {/* <PrintReports /> */}
      <PaginateTable
        title={t('Warehouse.1')}
        model={WAREHOUSE_M}
        columns={columns}
        queryKey={props.baseUrl}
        placeholder={t('Employees.Filter_by_name')}
        handleGetData={getWarehouses}
        filters={filters}
        filterNode={(setPage, setVisible) => (
          <Filters
            setFilters={setFilters}
            setVisible={setVisible}
            setPage={setPage}
          />
        )}
      />
    </Fragment>
  );
};

export default WarehouseTable;
