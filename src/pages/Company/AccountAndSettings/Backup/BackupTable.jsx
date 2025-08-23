import React, { useMemo, useCallback } from 'react';
import axiosInstance from '../../../ApiBaseUrl';
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../../../MediaQurey';
import TableAction from './TableAction';
import ShowDate from '../../../SelfComponents/JalaliAntdComponents/ShowDate';
import { PaginateTable, Statistics } from '../../../../components/antd';
import { BACKUP_M } from '../../../../constants/permissions';
import { checkPermissions } from '../../../../Functions';

const { Column } = Table;

const BackupTable = (props) => {
  const isMobile = useMediaQuery('(max-width:400px)');
  const { t } = useTranslation();

  const handleGetBackups = useCallback(
    async ({ queryKey }) => {
      const { page, pageSize, search, order } = queryKey?.[1] || {};
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?page=${page}&page_size=${pageSize}&search=${search}&ordering=${order}&expand=*`,
      );
      return data;
    },
    [props.baseUrl],
  );

  const columns = useMemo(
    () => (
      <React.Fragment>
        <Column
          title={t('Company.User').toUpperCase()}
          width={isMobile ? 75 : 180}
          dataIndex='created_by'
          key='created_by'
          fixed={true}
          sorter={{ multiple: 4 }}
          // render={(text, record) => (
          //   <React.Fragment>{text?.username}</React.Fragment>
          // )}
          className='table-col'
        />

        <Column
          title={t('Sales.Customers.Form.Date').toUpperCase()}
          dataIndex='created'
          key='created'
          render={(text) => {
            return <ShowDate date={text} />;
          }}
          className='table-col'
          sorter={{ multiple: 3 }}
        />
        <Column
          title={t('Company.Size').toUpperCase()}
          dataIndex='db_file_size_formated'
          key='db_file_size_formated'
          className='table-col'
          sorter={{ multiple: 2 }}
        />
        <Column
          title={t('Form.Notes').toUpperCase()}
          dataIndex='note'
          key='note'
          className='table-col'
          sorter={{ multiple: 1 }}
        />

        <Column
          title={t('Table.Action')}
          key='action'
          width={isMobile ? 50 : 70}
          fixed={'right'}
          className='table-col'
          align='center'
          render={(text, record) => (
            <TableAction record={record} baseUrl={props.baseUrl} />
          )}
        />
      </React.Fragment>
    ),
    [isMobile, props.baseUrl, t],
  );

  return (
    <PaginateTable
      columns={columns}
      queryKey={props.baseUrl}
      handleGetData={handleGetBackups}
      rowSelectable={false}
      model={BACKUP_M}
      placeholder={t('Employees.Filter_by_name')}
    />
  );
};

export default BackupTable;
