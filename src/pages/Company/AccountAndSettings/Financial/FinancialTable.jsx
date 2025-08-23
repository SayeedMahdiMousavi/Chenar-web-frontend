import React, { useCallback, useMemo } from 'react';
import axiosInstance from '../../../ApiBaseUrl';
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../../../MediaQurey';
import Edit from './Edit';
import ShowDate from '../../../SelfComponents/JalaliAntdComponents/ShowDate';
import { PaginateTable } from '../../../../components/antd';
import { checkPermissions } from '../../../../Functions';
import { FISCAL_YEAR_M } from '../../../../constants/permissions';

const { Column } = Table;
const dateFormat = 'YYYY-MM-DD';
const datePFormat = 'jYYYY/jM/jD';
const FinancialTable = (props) => {
  const isMobile = useMediaQuery('(max-width:400px)');
  const { t } = useTranslation();

  const handleGetFiscalYears = useCallback(async ({ queryKey }) => {
    const { page, pageSize, order, search } = queryKey?.[1] || {};
    const { data } = await axiosInstance.get(
      `/system_setting/finance_period/?page=${page}&page_size=${pageSize}&ordering=${order}&search=${search}`,
    );

    return data;
  }, []);

  const columns = useMemo(
    () => (
      <React.Fragment>
        <Column
          title={t('Form.Name').toUpperCase()}
          width={isMobile ? 75 : 180}
          dataIndex='name'
          key='name'
          fixed={true}
          sorter={{ multiple: 5 }}
          className='table-col'
        />

        <Column
          title={t('Taxes.Form.Start_date').toUpperCase()}
          dataIndex='start_date'
          key='start_date'
          render={(text) => {
            return (
              <ShowDate
                date={text}
                dateFormat={dateFormat}
                datePFormat={datePFormat}
              />
            );
          }}
          className='table-col'
          sorter={{ multiple: 4 }}
        />
        <Column
          title={t('Taxes.Form.End_date').toUpperCase()}
          dataIndex='end_date'
          key='end_date'
          render={(text) => {
            return (
              <ShowDate
                date={text}
                dateFormat={dateFormat}
                datePFormat={datePFormat}
              />
            );
          }}
          className='table-col'
          sorter={{ multiple: 3 }}
        />
        <Column
          title={t('Sales.Product_and_services.Status').toUpperCase()}
          dataIndex='is_running'
          key='is_running'
          className='table-col'
          render={(text, record) => (
            <React.Fragment>
              {' '}
              {text
                ? `${t('Sales.Product_and_services.Active')}`
                : `${t('Sales.Product_and_services.Inactive')}`}
            </React.Fragment>
          )}
          sorter={{ multiple: 2 }}
        />
        <Column
          title={t('Form.Description').toUpperCase()}
          dataIndex='description'
          key='description'
          className='table-col'
          sorter={{ multiple: 1 }}
        />

        {checkPermissions(`change_${FISCAL_YEAR_M}`) && (
          <Column
            title={t('Table.Action')}
            key='action'
            width={isMobile ? 50 : 70}
            fixed={'right'}
            align='center'
            className='table-col'
            render={(text, record) => (
              <Edit record={record} baseUrl={props.baseUrl} />
            )}
          />
        )}
      </React.Fragment>
    ),
    [isMobile, props.baseUrl, t],
  );

  return (
    <PaginateTable
      columns={columns}
      queryKey={props.baseUrl}
      handleGetData={handleGetFiscalYears}
      rowSelectable={false}
      model={FISCAL_YEAR_M}
      placeholder={t('Employees.Filter_by_name')}
    />
  );
};

export default FinancialTable;
