import React, { useMemo } from 'react';
import axiosInstance from '../../ApiBaseUrl';
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../../MediaQurey';
import Action from './Action';
import { PaginateTable } from '../../../components/antd';
import { EXPENSE_TYPE_M } from '../../../constants/permissions';
import { checkActionColumnPermissions } from '../../../Functions';

const { Column } = Table;

const ExpensesTable = (props) => {
  const isMobile = useMediaQuery('(max-width: 576px)');
  const { t } = useTranslation();

  const handleGetExpenses = async ({ queryKey }) => {
    const { page, pageSize, search, order } = queryKey?.[1] || {};
    const { data } = await axiosInstance.get(
      `${props.baseUrl}?page=${page}&page_size=${pageSize}&ordering=${order}&search=${search}`,
    );
    return data;
  };

  const columns = useMemo(
    (type, hasSelected) => {
      const sorter = type !== 'print' ? true : false;
      return (
        <React.Fragment>
          <Column
            title={t('Expenses.Expense_id').toUpperCase()}
            dataIndex='id'
            key='id'
            width={type !== 'print' ? 150 : false}
            fixed={sorter}
            className='table-col'
            // align="center"
            sorter={sorter && { multiple: 3 }}
          />
          <Column
            title={t('Form.Name').toUpperCase()}
            dataIndex='name'
            key='name'
            fixed={sorter}
            render={(text) => (
              <React.Fragment>
                <span>{text}</span>
              </React.Fragment>
            )}
            sorter={sorter && { multiple: 2 }}
            className='table-col'
          />
          <Column
            title={`${t('Sales.Product_and_services.Category').toUpperCase()}`}
            dataIndex='category'
            key='category'
            className='table-col'
            render={(text, record) => {
              return <span>{text?.get_fomrated_path}</span>;
            }}
            sorter={sorter && { multiple: 1 }}
          />

          {type !== 'print' && checkActionColumnPermissions(EXPENSE_TYPE_M) && (
            <Column
              title={t('Table.Action')}
              key='action'
              align='center'
              width={isMobile ? 65 : 80}
              render={(text, record) => (
                <Action
                  record={record}
                  hasSelected={hasSelected}
                  baseUrl={props.baseUrl}
                />
              )}
              fixed={'right'}
              className='table-col'
            />
          )}
        </React.Fragment>
      );
    },
    [isMobile, props.baseUrl, t],
  );

  return (
    <PaginateTable
      title={t('Expenses.Expenses_definition')}
      model={EXPENSE_TYPE_M}
      columns={columns}
      queryKey={props.baseUrl}
      handleGetData={handleGetExpenses}
    />
  );
};

export default ExpensesTable;
