import React, { useCallback, useMemo, useState } from 'react';
import axiosInstance from '../ApiBaseUrl';
import Filters from '../sales/Products/Units/Filters';
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../MediaQurey';
import Action from './Action';
import { PaginateTable } from '../../components/antd';
import { BRANCH_M } from '../../constants/permissions';
import { checkActionColumnPermissions } from '../../Functions';

const { Column } = Table;
const CompanyBranchTable = (props) => {
  const isMobile = useMediaQuery('(max-width:400px)');
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ state: 'active' });

  //get warehouse list
  const getWarehouses = useCallback(
    async ({ queryKey }) => {
      const { page, pageSize, search, order, state } = queryKey?.[1] || {};
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?page=${page}&page_size=${pageSize}&search=${search}&ordering=${order}&status=${state}`,
      );
      return data;
    },
    [props.baseUrl],
  );

  const columns = useMemo(
    (type, hasSelected) => (
      <React.Fragment>
        <Column
          title={t('Company_branch.Branch_id').toUpperCase()}
          dataIndex='id'
          key='id'
          width={type !== 'print' ? 145 : false}
          sorter={true}
          fixed={type !== 'print' ? true : undefined}
          className='table-col'
          align='center'
        />
        <Column
          title={t('Form.Name').toUpperCase()}
          dataIndex='name'
          fixed={type !== 'print' ? true : false}
          key='name'
          className='table-col'
          sorter={true}
        />

        <Column
          title={t('Warehouse.Responsible').toUpperCase()}
          dataIndex='responsible'
          key='responsible'
          className='table-col'
          sorter={true}
        />
        <Column
          title={t('Form.Address').toUpperCase()}
          dataIndex='address'
          key='address'
          className='table-col'
          sorter={true}
        />

        {type !== 'print' && checkActionColumnPermissions(BRANCH_M) && (
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
              />
            )}
          />
        )}
      </React.Fragment>
    ),
    [isMobile, props.baseUrl, t],
  );

  return (
    <PaginateTable
      title={t('Company_branch.1')}
      columns={columns}
      model={BRANCH_M}
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
  );
};

export default CompanyBranchTable;
