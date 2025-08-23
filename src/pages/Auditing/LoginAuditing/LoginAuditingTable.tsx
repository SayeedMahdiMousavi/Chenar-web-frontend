import React, { useState, useCallback, useMemo } from 'react';
import axiosInstance from '../../ApiBaseUrl';
import { LoginAuditingFilters } from './Filters';
import { Table, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import ViewAuditing from './View';
import ShowDate from '../../SelfComponents/JalaliAntdComponents/ShowDate';
import { PaginateTable } from '../../../components/antd';
import Photo from '../../sales/Products/Photo';
import { LOGIN_AUDIT_M } from '../../../constants/permissions';

const { Column } = Table;
const baseUrl = '/auditing/login/';

const LoginAuditingTable = () => {
  const { t } = useTranslation();

  const [filters, setFilters] = useState<any>({
    loginStatus: '',
    browser: '',
    os: '',
    ip: '',
    isMobile: '',
    isPC: '',
    isTablet: '',
    isTouchable: '',
    isBot: '',
    // startDate: "",
    // endDate: "",
  });

  const handleGetLoginAuditing = useCallback(
    async ({ queryKey }: { queryKey: any[] }) => {
      const {
        page,
        pageSize,
        search,
        order,
        loginStatus,
        // startDate,
        // endDate,
        browser,
        os,
        ip,
        isMobile,
        isPC,
        isTablet,
        isTouchable,
        isBot,
      } = queryKey?.[1];
      const { data } = await axiosInstance.get(
        `${baseUrl}?page=${page}
        &page_size=${pageSize}
        &ordering=${order}
        &login_status=${loginStatus}
        &browser=${browser}
        &os=${os}
        &device_is_mobile=${isMobile}
        &device_is_tablet=${isTablet}
        &device_is_touch_capable=${isTouchable}
        &device_is_pc=${isPC}
        &device_is_bot=${isBot}
        &ip=${ip}
        &username=${search}
    
        &expand=*`,
      );
      return data;
    },
    [],
  );
  const columns = useMemo(
    () => () => (
      <React.Fragment>
        <Column
          title={t('Company.User').toUpperCase()}
          dataIndex='username'
          key='username'
          fixed={true}
          className='table-col'
          sorter={{ multiple: 3 }}
          render={(text, record: any) => {
            return (
              <React.Fragment>
                <Space>
                  <Photo
                    photo={record?.user_photo}
                    content={text?.[0]?.toUpperCase()}
                  />
                  {text}
                </Space>
              </React.Fragment>
            );
          }}
        />
        <Column
          title={t('Auditing.Login_type').toUpperCase()}
          dataIndex='login_type'
          key='login_type'
          sorter={{ multiple: 2 }}
          className='table-col'
        />

        <Column
          title={t('Sales.All_sales.Invoice.Date_and_time').toUpperCase()}
          dataIndex='datetime'
          key='datetime'
          className='table-col'
          sorter={{ multiple: 1 }}
          render={(text: string) => {
            return <ShowDate date={text} />;
          }}
        />

        <Column
          title={t('Table.Action').toUpperCase()}
          key='action'
          align='center'
          width={60}
          render={(text, record) => <ViewAuditing record={record} />}
          fixed={'right'}
          className='table-col'
        />
      </React.Fragment>
    ),
    [t],
  );

  return (
    <div className='table-col table__padding'>
      <PaginateTable
        columns={columns}
        queryKey={baseUrl}
        model={LOGIN_AUDIT_M}
        handleGetData={handleGetLoginAuditing}
        rowSelectable={false}
        filters={filters}
        filterNode={(setPage, setVisible) => (
          <LoginAuditingFilters
            setFilters={setFilters}
            setVisible={setVisible}
            setPage={setPage}
          />
        )}
      />
    </div>
  );
};

export default LoginAuditingTable;
