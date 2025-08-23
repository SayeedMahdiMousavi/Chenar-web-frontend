import React, { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import axiosInstance from '../../../ApiBaseUrl';
import { Table, Descriptions } from 'antd';
import { useTranslation } from 'react-i18next';
import Filters from '../IncomeStatement/Filters';
import { utcDate } from '../../../../Functions/utcDate';
import useGetRunningPeriod from '../../../../Hooks/useGetRunningPeriod';
import { ReportTable, Statistics } from '../../../../components/antd';

const { Column, ColumnGroup } = Table;
interface IProps {
  baseUrl: string;
  place: string;
  title: string;
}
const dateFormat = 'YYYY-MM-DD';

const TrialBalanceTable: React.FC<IProps> = (props) => {
  const { t } = useTranslation();

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: utcDate().format(dateFormat),
  });

  const { startDate, endDate } = filters;

  //get running period
  const runningPeriod = useGetRunningPeriod();
  const curStartDate = runningPeriod?.data?.start_date;

  useEffect(() => {
    if (curStartDate) {
      setFilters((prev) => {
        return {
          ...prev,
          startDate: curStartDate
            ? moment(curStartDate, dateFormat).format(dateFormat)
            : '',
        };
      });
    }
  }, [curStartDate]);

  const columns = useMemo(
    () => (type: string) => {
      const sorter = type !== 'print' ? true : false;
      return (
        <React.Fragment>
          {/* <Column
              title={t("Banking.Form.Account_id").toUpperCase()}
              dataIndex="account_id"
              key="account"
              sorter={sorter && { multiple: 7 }}
            /> */}
          <Column
            title={t('Banking.Form.Account_name').toUpperCase()}
            dataIndex='account'
            key='account'
            sorter={sorter && { multiple: 7 }}
          />

          <Column
            title={t('Banking.Form.Account_name').toUpperCase()}
            dataIndex='account_name'
            key='account_name'
            sorter={sorter && { multiple: 5 }}
          />
          {/* <ColumnGroup title={t("Accounting.Account")}>
          </ColumnGroup> */}

          <Column
            title={t('Debit').toUpperCase()}
            dataIndex='debit'
            key='debit'
            sorter={sorter && { multiple: 5 }}
            render={(_, record: any) => (
              <Statistics
                value={
                  Math.sign(record?.result) === 1
                    ? Math.abs(record?.result ?? 0)
                    : 0
                }
              />
            )}
          />

          <Column
            title={t('Credit').toUpperCase()}
            dataIndex='credit'
            key='credit'
            sorter={sorter && { multiple: 4 }}
            render={(_, record: any) => (
              <Statistics
                value={
                  Math.sign(record?.result) === -1
                    ? Math.abs(record?.result ?? 0)
                    : 0
                }
              />
            )}
          />

          <Column
            title={t(
              'Sales.Product_and_services.Inventory.Currency',
            ).toUpperCase()}
            dataIndex={
              props?.title === 'Details balance' ||
              props?.title === 'بیلانس مشرح'
                ? 'amount_currency'
                : 'currency_name'
            }
            key={
              props?.title === 'Detailed balance'
                ? 'amount_currency'
                : 'currency_name'
            }
            sorter={sorter && { multiple: 3 }}
            render={(text) => {
              return <span>{t(`Reports.${text}`)}</span>;
            }}
          />
          {/* <ColumnGroup title={t("Reports.Details")}>
          </ColumnGroup> */}
          {/* {props.place === "trialBalance" && (
            <ColumnGroup
              title={t("Sales.Product_and_services.Currency.Default_currency")}
            >
              <Column
                title={t("Debit").toUpperCase()}
                dataIndex="debit"
                key="debit"
                sorter={sorter && { multiple: 2 }}
              />

              <Column
                title={t("Credit").toUpperCase()}
                dataIndex="credit"
                key="credit"
                sorter={sorter && { multiple: 1 }}
              />
            </ColumnGroup>
          )} */}
        </React.Fragment>
      );
    },
    [t],
  );

  const printFilters = (
    <Descriptions
      layout='horizontal'
      style={{ width: '100%', paddingTop: '40px' }}
      column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
      size='small'
    >
      <Descriptions.Item label={t('Form.From')}>
        {startDate} {t('Form.To')} : {endDate}
      </Descriptions.Item>
    </Descriptions>
  );

  const handleGetDetailedBalance = useCallback(
    async ({ queryKey }: any) => {
      const { page, pageSize, search, order, startDate, endDate } =
        queryKey?.[1];
      const { data } = await axiosInstance.get(
        `${props?.baseUrl}?page=${page}&page_size=${pageSize}&search=${search}`,
        // &date_time_before=${endDate}&date_time_after=${startDate}
      );
      console.log('data', data);
      return data;
    },
    [props],
  );

  return (
    <ReportTable
      pagination={true}
      title={props?.title}
      columns={columns}
      queryKey={props?.baseUrl}
      handleGetData={handleGetDetailedBalance}
      filters={filters}
      filterNode={(setPage, setSelectedRowKeys) => (
        <Filters
          setFilters={setFilters}
          setPage={setPage}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      )}
      place='detailedBalance'
      rowKey='account_id'
      filtersComponent={printFilters}
    />
  );
};

export default TrialBalanceTable;
