import React, { useState } from 'react';
import axiosInstance from '../../ApiBaseUrl';
import { useQuery } from 'react-query';
import { Table, Menu, Typography, Checkbox } from 'antd';
import { useTranslation } from 'react-i18next';
import Action from './Action';
import { useMediaQuery } from '../../MediaQurey';
import { useMemo } from 'react';
import ShowDate from '../../SelfComponents/JalaliAntdComponents/ShowDate';
import { PaginateTable, Statistics } from '../../../components/antd';
import { OPINING_ACCOUNT_M } from '../../../constants/permissions';
import { checkActionColumnPermissions } from '../../../Functions';
import { TableSummaryCell } from '../../../components';
import { useGetBaseCurrency } from '../../../Hooks';
import { OPENING_ACCOUNT_RESULT_LIST } from '../../../constants/routes';

const { Column } = Table;
interface IProps {
  baseUrl: string;
  handleUpdateItems: () => void;
}

const OpenAccountsTable: React.FC<IProps> = (props) => {
  const [selectResult, setSelectResult] = useState<boolean>(false);
  const isMobile = useMediaQuery('(max-width:425px)');
  const [search, setSearch] = useState<number | string>('');
  const { t } = useTranslation();
  const [{ currencyRate, date, debit, credit, notes }, setColumns] = useState({
    currencyRate: true,
    date: false,
    debit: true,
    credit: true,
    notes: false,
  });

  //setting checkbox
  const onChangeCurrencyRate = () =>
    setColumns((prev) => {
      return { ...prev, currencyRate: !currencyRate };
    });

  const onChangeCredit = () => {
    setColumns((prev) => {
      return { ...prev, credit: !credit };
    });
  };

  const onChangeNotes = () => {
    setColumns((prev) => {
      return { ...prev, notes: !notes };
    });
  };

  const onChangeDate = () => {
    setColumns((prev) => {
      return { ...prev, date: !date };
    });
  };

  const onChangeDebit = () => {
    setColumns((prev) => {
      return { ...prev, debit: !debit };
    });
  };

  const setting = (
    <Menu style={styles.settingsMenu}>
      <Menu.Item key='1'>
        <Typography.Text strong={true}>
          {t('Sales.Product_and_services.Columns')}
        </Typography.Text>
      </Menu.Item>
      <Menu.Item key='2'>
        <Checkbox defaultChecked onChange={onChangeCredit}>
          {t('Opening_accounts.Credit')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='3'>
        <Checkbox defaultChecked onChange={onChangeDebit}>
          {t('Opening_accounts.Debit')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='5'>
        <Checkbox defaultChecked onChange={onChangeCurrencyRate}>
          {t('Sales.Product_and_services.Currency.Currency_rate')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='6'>
        <Checkbox onChange={onChangeDate}>
          {t('Sales.All_sales.Invoice.Date_and_time')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='7'>
        <Checkbox onChange={onChangeNotes}>{t('Form.Description')}</Checkbox>
      </Menu.Item>
    </Menu>
  );

  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyName = baseCurrency?.data?.name;

  const handleGetOpenAccount = React.useCallback(
    //@ts-ignore
    async ({ queryKey }) => {
      const { page, pageSize, search, order } = queryKey?.[1];
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?expand=account.id,account.name,pay_by,rec_by,currency&page=${page}&page_size=${pageSize}&ordering=${order}&search=${search}`,
      );
      console.log('data', data);
      return data;
    },
    [props.baseUrl],
  );
  //@ts-ignore
  const getAllCapital = React.useCallback(async ({ queryKey }) => {
    const { search } = queryKey?.[1];
    const { data } = await axiosInstance.get(
      `${OPENING_ACCOUNT_RESULT_LIST}?expand=*&search=${search}`,
    );
    return data;
  }, []);

  const openingAccountsResult = useQuery(
    [OPENING_ACCOUNT_RESULT_LIST, { search }],
    getAllCapital,
  );

  const columns = useMemo(
    () => (type: string, hasSelected: boolean) => {
      const sorter = type !== 'print' ? true : false;
      return (
        <React.Fragment>
          {type !== 'result' && (
            <Column
              title={t('Banking.Form.Account_number').toUpperCase()}
              dataIndex='pay_by'
              key='pay_by'
              width={type === 'originalTable' ? 170 : undefined}
              fixed={sorter}
              className='table-col'
              // align="center"
              render={(record: any) => {
                return <>{record?.id} </>;
              }}
              sorter={sorter && { multiple: 8 }}
            />
          )}
          <Column
            title={t('Banking.Form.Account_name').toUpperCase()}
            dataIndex='pay_by'
            key='pay_by'
            fixed={sorter}
            sorter={sorter && { multiple: 7 }}
            render={(text: any) => {
              return <>{text?.name} </>;
            }}
            className='table-col'
          />
          {debit && (
            <Column
              title={t('Opening_accounts.Debit').toUpperCase()}
              dataIndex='debit'
              key='debit'
              sorter={sorter && { multiple: 5 }}
              // render={(value) => <Statistics value={value} />}
              render={(_, record: any) =>
                record?.transaction_type === 'debit' ? (
                  <Statistics value={record?.amount} />
                ) : (
                  0
                )
              }
            />
          )}
          {credit && (
            <Column
              title={t('Opening_accounts.Credit').toUpperCase()}
              dataIndex='credit'
              key='credit'
              render={(_, record: any) =>
                record?.transaction_type === 'credit' ? (
                  <Statistics value={record?.amount} />
                ) : (
                  0
                )
              }
              sorter={sorter && { multiple: 6 }}
            />
          )}

          <Column
            title={t(
              'Sales.Product_and_services.Inventory.Currency',
            ).toUpperCase()}
            dataIndex='currency'
            key='currency'
            sorter={sorter && { multiple: 4 }}
            render={(text: any) => {
              return <>{t(`Reports.${text?.symbol}`)} </>;
            }}
            className='table-col'
          />

          {currencyRate && (
            <Column
              title={t(
                'Sales.Product_and_services.Currency.Currency_rate',
              ).toUpperCase()}
              dataIndex='currency_rate'
              key='currency_rate'
              render={(value) => <Statistics value={value} />}
              className='table-col'
              sorter={sorter && { multiple: 3 }}
            />
          )}
          {date && (
            <Column
              title={t('Sales.All_sales.Invoice.Date_and_time').toUpperCase()}
              dataIndex='date_time'
              key='date_time'
              className='table-col'
              render={(text: string) => {
                return <ShowDate date={text} />;
              }}
              sorter={sorter && { multiple: 2 }}
            />
          )}

          {notes && (
            <Column
              title={`${t('Form.Description').toUpperCase()}`}
              dataIndex='description'
              key='description'
              sorter={sorter && { multiple: 1 }}
              className='table-col'
            />
          )}

          {type === 'originalTable' &&
            checkActionColumnPermissions(OPINING_ACCOUNT_M) && (
              <Column
                title={t('Table.Action').toUpperCase()}
                key='action'
                width={isMobile ? 50 : 70}
                align='center'
                render={(text, record) => (
                  <Action
                    record={record}
                    baseUrl={props.baseUrl}
                    hasSelected={hasSelected}
                    handleUpdateItems={props?.handleUpdateItems}
                  />
                )}
                fixed={'right'}
                className='table-col'
              />
            )}
        </React.Fragment>
      );
    },
    [credit, currencyRate, date, debit, isMobile, notes, props, t],
  );
  const resultColumns = useMemo(() => {
    return (
      <React.Fragment>
        <Column
          title={t('Table.Row').toUpperCase()}
          dataIndex='serial'
          key='serial'
          width={40}
          className='table-col'
          align='center'
          fixed={false}
          render={(text, __, index) => (
            <React.Fragment>{index + 1}</React.Fragment>
          )}
        />
        {credit && (
          <Column
            title={t('Opening_accounts.Credit').toUpperCase()}
            dataIndex='credit'
            key='credit'
            render={(_, record: any) =>
              record?.result && (
                <Statistics
                  value={
                    Math.sign(record?.result) === -1
                      ? Math.abs(record?.result)
                      : 0
                  }
                />
              )
            }
          />
        )}
        {debit && (
          <Column
            title={t('Opening_accounts.Debit').toUpperCase()}
            dataIndex='debit'
            key='debit'
            render={(_, record: any) =>
              record?.result && (
                <Statistics
                  value={
                    Math.sign(record?.result) === 1
                      ? Math.abs(record?.result)
                      : 0
                  }
                />
              )
            }
          />
        )}
        <Column
          title={t(
            'Sales.Product_and_services.Inventory.Currency',
          ).toUpperCase()}
          dataIndex='currency'
          key='currency'
          render={(text: any) => {
            return <>{baseCurrencyName} </>;
          }}
          className='table-col'
        />
      </React.Fragment>
    );
  }, [baseCurrencyName, credit, debit, t]);

  const onChangeSelectResult = (e: any) => {
    setSelectResult(e.target.checked);
  };
  return (
    <PaginateTable
      title={t('Opening_accounts.1')}
      model={OPINING_ACCOUNT_M}
      columns={columns}
      queryKey={props.baseUrl}
      handleGetData={handleGetOpenAccount}
      settingMenu={setting}
      selectResult={selectResult}
      resultDataSource={[openingAccountsResult?.data]}
      resultDomColumns={resultColumns}
      setSelectResult={setSelectResult}
      resultLoading={
        openingAccountsResult?.isLoading || openingAccountsResult?.isFetching
      }
      setSearch={setSearch}
      search={search}
      summary={() => {
        return (
          <>
            {[openingAccountsResult?.data]?.length > 0 &&
              [openingAccountsResult?.data]?.map((item: any, index: number) => (
                <Table.Summary.Row>
                  <TableSummaryCell
                    type='checkbox'
                    index={0}
                    isSelected={selectResult}
                    color={'inherit'}
                  >
                    {index === 0 && (
                      <Checkbox
                        onChange={onChangeSelectResult}
                        checked={selectResult}
                      />
                    )}
                  </TableSummaryCell>
                  <TableSummaryCell
                    index={1}
                    isSelected={selectResult}
                    color={'inherit'}
                  />
                  <TableSummaryCell
                    index={2}
                    isSelected={selectResult}
                    color={'inherit'}
                  >
                    {index === 0 && t('Form.Total_price')}
                  </TableSummaryCell>
                  <TableSummaryCell
                    index={3}
                    isSelected={selectResult}
                    color={'inherit'}
                  >
                    {/* {item?.account?.name} */}
                  </TableSummaryCell>
                  {credit && (
                    <TableSummaryCell
                      index={4}
                      type='total'
                      value={
                        Math.sign(item?.result) === -1
                          ? Math.abs(-item?.result)
                          : 0
                      }
                      isSelected={selectResult}
                      color={'inherit'}
                    />
                    // <TableSummaryCell
                    //   index={4}
                    //   type="total"
                    //   value={item?.credit}
                    //   isSelected={selectResult}
                    // />
                  )}
                  {debit && (
                    <TableSummaryCell
                      index={5}
                      type='total'
                      value={
                        Math.sign(item?.result) === 1
                          ? Math.abs(item?.result)
                          : 0
                      }
                      isSelected={selectResult}
                      color={'inherit'}
                    />
                  )}
                  <TableSummaryCell
                    index={6}
                    isSelected={selectResult}
                    color={'inherit'}
                  >
                    {baseCurrencyName}
                  </TableSummaryCell>

                  {currencyRate && (
                    <TableSummaryCell
                      index={7}
                      // type="total"
                      // value={item?.currency_rate}
                      isSelected={selectResult}
                      color={'inherit'}
                    />
                  )}

                  {date && (
                    <TableSummaryCell
                      index={8}
                      isSelected={selectResult}
                      color={'inherit'}
                    />
                  )}
                  {notes && (
                    <TableSummaryCell
                      index={9}
                      isSelected={selectResult}
                      color={'inherit'}
                    />
                  )}
                  <TableSummaryCell
                    index={10}
                    isSelected={selectResult}
                    color={'inherit'}
                  />
                </Table.Summary.Row>
              ))}
          </>
        );
      }}
    />
  );
};
const styles = {
  settingsMenu: { width: '160px', paddingBottom: '10px' },
};

export default OpenAccountsTable;
