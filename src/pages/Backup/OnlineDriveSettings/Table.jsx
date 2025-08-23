import React, { useCallback, useMemo } from 'react';
import axiosInstance from '../../ApiBaseUrl';
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../../MediaQurey';
import Action from './Action';
import { PaginateTable } from '../../../components/antd';
import { TrueFalseIcon } from '../../../components';
import { BACKUP_SETTINGS_M } from '../../../constants/permissions';
import { checkActionColumnPermissions } from '../../../Functions';

const { Column } = Table;

// Define the columns as a named function/component
const ColumnsDefinition = ({
  type,
  hasSelected,
  isMobile,
  baseUrl,
  handleUpdateItems,
  t,
}) => {
  const sorter = type !== 'print' ? true : false;
  return (
    <React.Fragment>
      <Column
        title={t('Company.Platform').toUpperCase()}
        dataIndex='platform'
        fixed={sorter}
        key='platform'
        className='table-col'
        sorter={{ multiple: 3 }}
      />
      <Column
        title={t('Company.Default').toUpperCase()}
        dataIndex='default'
        key='default'
        className='table-col'
        sorter={{ multiple: 2 }}
        width={120}
        align='center'
        render={(value) => <TrueFalseIcon value={value} />}
      />
      <Column
        title={t('Company.Access_token').toUpperCase()}
        dataIndex='access_token'
        key='access_token'
        className='table-col'
        sorter={{ multiple: 1 }}
      />
      {checkActionColumnPermissions(BACKUP_SETTINGS_M) && (
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
              baseUrl={baseUrl}
              handleUpdateItems={handleUpdateItems}
            />
          )}
        />
      )}
    </React.Fragment>
  );
};

const OnlineDriveSettingsTable = (props) => {
  const isMobile = useMediaQuery('(max-width:400px)');
  const { t } = useTranslation();

  // Get online drive list
  const handleGetOnlineDriveSettings = useCallback(
    async ({ queryKey }) => {
      const { page, pageSize, search, order } = queryKey?.[1] || {};
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?page=${page}&page_size=${pageSize}&search=${search}&ordering=${order}`,
      );
      return data;
    },
    [props.baseUrl],
  );

  // Memoize the columns function
  const columns = useMemo(
    (type, hasSelected) => (
      <ColumnsDefinition
        type={type}
        hasSelected={hasSelected}
        isMobile={isMobile}
        baseUrl={props.baseUrl}
        handleUpdateItems={props.handleUpdateItems}
        t={t}
      />
    ),
    [isMobile, props.baseUrl, props.handleUpdateItems, t],
  );

  return (
    <PaginateTable
      columns={columns}
      model={BACKUP_SETTINGS_M}
      queryKey={props.baseUrl}
      placeholder={t('Form.Search')}
      handleGetData={handleGetOnlineDriveSettings}
      rowSelectable={false}
    />
  );
};

export default OnlineDriveSettingsTable;
