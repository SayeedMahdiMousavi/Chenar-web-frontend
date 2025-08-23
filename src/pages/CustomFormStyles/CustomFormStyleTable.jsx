import React, { useCallback, useMemo } from 'react';
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';
import Action from './Action';
import { useMediaQuery } from '../MediaQurey';
import axiosInstance from '../ApiBaseUrl';
import { PaginateTable } from '../../components/antd';
import { checkActionColumnPermissions } from '../../Functions';
import { CUSTOM_FORM_STYLE_M } from '../../constants/permissions';

const { Column } = Table;

const CustomFormStylesTable = (props) => {
  const isMobile = useMediaQuery('(max-width:400px)');
  const { t } = useTranslation();

  const handleGetCustomFormStyles = useCallback(
    async ({ queryKey }) => {
      const { page, pageSize, order } = queryKey?.[1] || {};
      const { data } = await axiosInstance.get(
        `${props?.baseUrl}?page=${page}&page_size=${pageSize}&ordering=${order}`,
      );
      return data;
    },
    [props.baseUrl],
  );

  const columns = useMemo(
    // eslint-disable-next-line react/display-name
    () => (type, hasSelected) => (
      <React.Fragment>
        <Column
          title={t('Form.Name').toUpperCase()}
          dataIndex='template_name_fa'
          key='template_name_fa'
          fixed={type !== 'print' ? true : false}
          sorter={{ multiple: 2 }}
          render={(text, record) => <React.Fragment>{text}</React.Fragment>}
          className='table-col'
        />
        <Column
          title={t('Custom_form_styles.Form_type  ').toUpperCase()}
          dataIndex='invoice_type'
          key='invoice_type'
          className='table-col'
          sorter={{ multiple: 1 }}
        />
        {checkActionColumnPermissions(CUSTOM_FORM_STYLE_M) && (
          <Column
            title={t('Table.Action')}
            key='action'
            width={isMobile ? 70 : 90}
            align='center'
            render={(text, record) => (
              <Action record={record} baseUrl={props?.baseUrl} />
            )}
            className='table-col'
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
      handleGetData={handleGetCustomFormStyles}
      rowSelectable={false}
      header={false}
      model={CUSTOM_FORM_STYLE_M}
    />
  );
};

export default CustomFormStylesTable;
