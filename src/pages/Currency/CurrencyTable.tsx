import React, { useCallback, useMemo } from 'react';
import axiosInstance from '../ApiBaseUrl';
import { useQueryClient, useMutation } from 'react-query';
import Action from './Action';
import { Table, Switch, Typography, Space, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../MediaQurey';
import { checkActionColumnPermissions } from '../../Functions';
import { CURRENCY_M } from '../../constants/permissions';
import { PaginateTable } from '../../components/antd/PaginateTable';
import { CURRENCY_LIST, CURRENCY_RATE_LIST } from '../../constants/routes';
// import { TrueFalseIcon } from "../../components";
import { useGetBaseCurrency } from '../../Hooks';

const { Column } = Table;
interface Props {}
const CurrencyTable: React.FC<Props> = (props) => {
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery('(max-width:400px)');
  const { t } = useTranslation();
  //get base currency
  const baseCurrency = useGetBaseCurrency();

  const { mutate: mutateActiveCurrency } = useMutation(
    async (data: any) =>
      await axiosInstance.patch(`${CURRENCY_LIST}${data.symbol}/`, data.value),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CURRENCY_LIST);
        queryClient.invalidateQueries(CURRENCY_RATE_LIST);
      },
      onError: (err, variables, previousValue) => {
        queryClient.setQueryData(CURRENCY_LIST, previousValue);
      },
    },
  );

  const handleGetCurrencyList = async ({ queryKey }: any) => {
    const { page, pageSize, search, order } = queryKey?.[1];
    const { data } = await axiosInstance.get(
      `${CURRENCY_LIST}?page=${page}&page_size=${pageSize}&search=${search}&ordering=${order}`,
    );

    return data;
  };

  const handleChangeStatus = useCallback(
    async (value: boolean, symbol: number) => {
      mutateActiveCurrency({
        value: { is_active: value },
        symbol: symbol,
      });
    },
    [mutateActiveCurrency],
  );

  const columns = useMemo(
    () => (type: string) => {
      const sorter = type !== 'print' ? true : false;
      return (
        <React.Fragment>
          <Column
            title={t('Form.Name').toUpperCase()}
            dataIndex='name'
            fixed={sorter}
            key='name'
            className='table-col'
            sorter={sorter && { multiple: 3 }}
            width='20%'
          />

          <Column
            title={t('Sales.Product_and_services.Units.Symbol')}
            dataIndex='symbol'
            key='symbol'
            className='table-col'
            sorter={sorter && { multiple: 2 }}
            width={120}
          />
          {/* <Column
            title={t(
              "Sales.Product_and_services.Currency.Default"
            ).toUpperCase()}
            dataIndex="is_base"
            key="is_base"
            render={(value) => {
              return <TrueFalseIcon value={value} />;
            }}
            className="table-col"
            width={130}
            // align="center"
            sorter={sorter && { multiple: 1 }}
          /> */}
          <Column
            title={t('Sales.Product_and_services.Status').toUpperCase()}
            dataIndex='is_active'
            key='is_active'
            render={(value, record: any) => {
              return (
                <Switch
                  checked={value}
                  onChange={(value) =>
                    handleChangeStatus(value, record?.symbol)
                  }
                />
              );
            }}
          />
          {type !== 'print' && checkActionColumnPermissions(CURRENCY_M) && (
            <Column
              title={t('Table.Action')}
              key='action'
              align='center'
              width={isMobile ? 50 : 70}
              fixed={sorter ? 'right' : undefined}
              className='table-col'
              //@ts-ignore
              render={(text, record) => <Action record={record} />}
            />
          )}
        </React.Fragment>
      );
    },
    [handleChangeStatus, isMobile, t],
  );

  return (
    <PaginateTable
      title={t('Sales.Product_and_services.Currency.1')}
      columns={columns}
      model={CURRENCY_M}
      queryKey={CURRENCY_LIST}
      handleGetData={handleGetCurrencyList}
      rowSelectable={false}
      type='currency'
      header={
        <Space style={styles.header} size={15}>
          <Typography.Text>{t('Base_currency')}</Typography.Text>
          <Input
            value={baseCurrency?.data?.name}
            suffix={baseCurrency?.data?.symbol}
            disabled
            style={styles.input}
          />
        </Space>
      }
    />
  );
};

const styles = {
  header: { paddingInlineStart: '15px' },
  input: { width: '150px' },
};

export default CurrencyTable;
