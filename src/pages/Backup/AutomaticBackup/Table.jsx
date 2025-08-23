/* eslint-disable react/display-name */
import React, { useCallback, useMemo } from 'react';
import axiosInstance from '../../ApiBaseUrl';
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../../MediaQurey';
import Action from './Action';
import { AntdTag, PaginateTable } from '../../../components/antd';
import ShowDate from '../../SelfComponents/JalaliAntdComponents/ShowDate';
import { Colors } from '../../colors';
import { ScheduleOutlined, SyncOutlined } from '@ant-design/icons';
import { checkActionColumnPermissions } from '../../../Functions';
import { BACKUP_SETTINGS_M } from '../../../constants/permissions';

const { Column } = Table;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const datePFormat = 'jYYYY/jM/jD HH:mm:ss';
const AutomaticBackupTable = (props) => {
  const isMobile = useMediaQuery('(max-width:400px)');
  const { t } = useTranslation();

  //get automatic backup list
  const handleGetAutomaticBackup = useCallback(
    async ({ queryKey }) => {
      const { page, pageSize, search, order } = queryKey?.[1] || {
        page: 1,
        pageSize: 10,
        search: '',
        order: 'id',
      };
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?page=${page}&page_size=${pageSize}&search=${search}&ordering=${order}`,
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
            title={t('Sales.Product_and_services.Type').toUpperCase()}
            dataIndex='task_type'
            fixed={sorter}
            key='task_type'
            className='table-col'
            sorter={{ multiple: 4 }}
            render={(value) =>
              value === 'clocked' ? (
                <AntdTag
                  color={Colors.primaryColor}
                  icon={<ScheduleOutlined />}
                >
                  {t('Company.Schedule')}
                </AntdTag>
              ) : (
                <AntdTag color={Colors.primaryColor} icon={<SyncOutlined />}>
                  {t('Company.Intervale')}
                </AntdTag>
              )
            }
          />

          <Column
            title={t('Sales.Customers.Form.Date').toUpperCase()}
            dataIndex='clocked'
            key='clocked'
            className='table-col'
            sorter={{ multiple: 3 }}
            render={(value, record) =>
              value ? (
                <ShowDate
                  date={value?.clocked_time}
                  dateFormat={dateFormat}
                  datePFormat={datePFormat}
                />
              ) : (
                record?.interval != null &&
                // <AntdTag color={Colors.primaryColor}>
                parseFloat(record?.interval?.every) +
                  ' ' +
                  props?.periodList?.find(
                    (item) => item?.value === record?.interval?.period,
                  )?.display_name

                // </AntdTag>
              )
            }
          />
          <Column
            title={t('Company.Enabled').toUpperCase()}
            dataIndex='enabled'
            key='enabled'
            className='table-col'
            sorter={{ multiple: 2 }}
            align='center'
            width={130}
            // render={(value) => <TrueFalseTableColumn value={value} />}
            render={(value) =>
              value ? (
                <AntdTag color={Colors.primaryColor}>
                  {t('Company.Enable')}
                </AntdTag>
              ) : (
                <AntdTag color={Colors.red}>{t('Company.Disable')}</AntdTag>
              )
            }
          />
          <Column
            title={t('Form.Description').toUpperCase()}
            dataIndex='description'
            key='description'
            className='table-col'
            sorter={{ multiple: 1 }}
          />

          {type !== 'print' &&
            checkActionColumnPermissions(BACKUP_SETTINGS_M) && (
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
                    periodList={props.periodList}
                  />
                )}
              />
            )}
        </React.Fragment>
      );
    },
    [isMobile, props.baseUrl, props.handleUpdateItems, props.periodList, t],
  );

  return (
    <PaginateTable
      columns={columns}
      queryKey={props.baseUrl}
      model={BACKUP_SETTINGS_M}
      placeholder={t('Form.Search')}
      handleGetData={handleGetAutomaticBackup}
      rowSelectable={false}
    />
  );
};

export default AutomaticBackupTable;
