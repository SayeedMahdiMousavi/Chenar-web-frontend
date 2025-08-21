import { PlusCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Divider,
  Row,
  Space,
  Typography,
  List,
  Skeleton,
  Radio,
  Badge,
  Card,
  Spin,
} from 'antd';
import React, { Fragment } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { utcDate } from '../../Functions/utcDate';
import axiosInstance from '../ApiBaseUrl';
import SalesChart from './SalesChart';
import TotalItem from './TotalItem';
import moment from 'moment';
import useGetRunningPeriod from '../../Hooks/useGetRunningPeriod';
import useGetBaseCurrency from '../../Hooks/useGetBaseCurrency';
import {
  useGetDebitCreditResult,
  useGetInvoicesResult,
  useGetJournalResult,
} from '../../Hooks';
import ChartHeader from './ChartHeader';
import DashboardCurrencyExchange from './CurrencyExchange';
import ConvertDate from './ConvertDate';
import { useMediaQuery } from '../MediaQurey';
import { useDarkMode } from '../../Hooks/useDarkMode';
import {
  BANK_M,
  CASH_M,
  CURRENCY_RATE_M,
  DEBIT_CREDIT_P,
  INCOME_M,
  INVOICES_P,
} from '../../constants/permissions';
import { checkPermissions } from '../../Functions';
import {
  CashIcon,
  IncomeIcon,
  MastercardIcon,
  PayableAccountIcon,
  ProfitIcon,
  ReceivableAccountIcon,
} from '../../icons';
import { math, print } from '../../Functions/math';
import { reportsDateFormat } from '../../Context';
import { Colors } from '../colors';

// const reportsDateFormat = "YYYY-MM-DD HH:mm";
export default function DashboardBody(props: any) {
  const [startDate, setStartDate] = useState('');
  const [mode] = useDarkMode();
  // const [currency, setCurrency] = useState({});
  const { t } = useTranslation();
  const isMiniTablet = useMediaQuery('(max-width:1290px)');
  const [lineChartSelectState, setLineChartSelectState] = useState('Sales');
  const [isLoading, setIsLoading] = useState(false);
  const [dataChartState, setDataChartState] = useState<{
    total: number;
    result: any[];
  }>({
    total: 0,
    result: [],
  });
  const list = [
    { description: 'پرداخت معاش کارمندان', loading: false, color: 'pink' },
    { description: 'پرداخت معاش کارمندان', loading: false, color: 'red' },
    { description: 'پرداخت معاش کارمندان', loading: false, color: 'yellow' },
  ];

  //get base currency
  const baseCurrency = useGetBaseCurrency();
  // const baseCurrencyId = baseCurrency?.data?.id;
  const currencyId = baseCurrency?.data?.id;
  const baseCurrencyName = baseCurrency?.data?.name;

  // useEffect(() => {
  //   if (baseCurrencyId) {
  //     setCurrency({
  //       value: baseCurrencyId,
  //       label: baseCurrencyName,
  //     });
  //   }
  // }, [baseCurrencyId, baseCurrencyName]);

  //get running period
  const runningPeriod = useGetRunningPeriod();
  const curStartDate = runningPeriod?.data?.start_date;

  useEffect(() => {
    if (curStartDate) {
      setStartDate(
        curStartDate
          ? moment(curStartDate, reportsDateFormat).format(reportsDateFormat)
          : ''
      );
    }
  }, [curStartDate]);

  //get income result
  const incomes = useQuery(
    [`/pay_receive_cash/income_cash/result/`, { startDate }],
    async ({ queryKey }) => {
      const { startDate }: any = queryKey?.[1];
      const { data } = await axiosInstance.get(
        `/pay_receive_cash/income_cash/result/?date_time_after=${startDate}&date_time_before=${utcDate().format(
          reportsDateFormat
        )}`
      );
      return data;
    },
    {
      enabled: !!startDate && checkPermissions(`view_${INCOME_M}`),
      refetchOnWindowFocus: false,
    }
  );

  const getDataChart = async () => {
    setIsLoading(true);
    //Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, and Sunday.
    const daily = [
      {
        total: 0,
        date: t('Date.Saturday'),
      },
      {
        total: 0,
        date: t('Date.Sunday'),
      },
      {
        total: 0,
        date: t('Date.Monday'),
      },
      {
        total: 0,
        date: t('Date.Tuesday'),
      },
      {
        total: 0,
        date: t('Date.Wednesday'),
      },
      {
        total: 0,
        date: t('Date.Thursday'),
      },
      {
        total: 0,
        date: t('Date.Friday'),
      },
    ];
    const weekly = [
      {
        total: 0,
        date: t('Date.Week1'),
      },
      {
        total: 0,
        date: t('Date.Week2'),
      },
      {
        total: 0,
        date: t('Date.Week3'),
      },
      {
        total: 0,
        date: t('Date.Week4'),
      },
    ];
    const monthly = [
      {
        total: 0,
        date: t('Date.January'),
      },
      {
        total: 0,
        date: t('Date.February'),
      },
      {
        total: 0,
        date: t('Date.March'),
      },
      {
        total: 0,
        date: t('Date.April'),
      },
      {
        total: 0,
        date: t('Date.May'),
      },
      {
        total: 0,
        date: t('Date.June'),
      },
      {
        total: 0,
        date: t('Date.July'),
      },
      {
        total: 0,
        date: t('Date.August'),
      },
      {
        total: 0,
        date: t('Date.September'),
      },
      {
        total: 0,
        date: t('Date.October'),
      },
      {
        total: 0,
        date: t('Date.November'),
      },
      {
        total: 0,
        date: t('Date.December'),
      },
    ];
    if (lineChartSelectState === 'Sales') {
      const { data } = await axiosInstance.get(
        `/accounting_reports/warehouse/sales_invoice/graph_report/?report_type=${props?.duration}`
      );
      setIsLoading(false);
      if (data?.result?.length > 0) {
        return setDataChartState({
          total: data?.total,
          result: data?.result?.map((item: any) => {
            return {
              ...item,
              date: item?.date?.split('T')?.[0],
            };
          }),
        });
      } else {
        return setDataChartState({
          total: 0,
          result:
            props?.duration === 'daily'
              ? daily
              : props?.duration === 'weekly'
              ? weekly
              : monthly,
        });
      }
    }
    if (lineChartSelectState === 'Purchases') {
      const { data } = await axiosInstance.get(
        `/accounting_reports/warehouse/purchase_invoice/graph_report/?report_type=${props?.duration}`
      );
      setIsLoading(false);
      if (data?.result?.length > 0) {
        return setDataChartState({
          total: data?.total,
          result: data?.result?.map((item: any) => {
            return {
              ...item,
              date: item?.date?.split('T')?.[0],
            };
          }),
        });
      } else {
        return setDataChartState({
          total: 0,
          result:
            props?.duration === 'daily'
              ? daily
              : props?.duration === 'weekly'
              ? weekly
              : monthly,
        });
      }
    }
    if (lineChartSelectState === 'Expenses') {
      const { data } = await axiosInstance.get(
        `/accounting_reports/financial/expense_report/?report_type=${props?.duration}`
      );
      setIsLoading(false);
      if (data?.result?.length > 0) {
        return setDataChartState({
          total: data?.total,
          result: data?.result?.map((item: any) => {
            return {
              ...item,
              date: item?.date?.split('T')?.[0],
            };
          }),
        });
      } else {
        return setDataChartState({
          total: 0,
          result:
            props?.duration === 'daily'
              ? daily
              : props?.duration === 'weekly'
              ? weekly
              : monthly,
        });
      }
    }
    if (lineChartSelectState === 'Revenue') {
      const { data } = await axiosInstance.get(
        `/accounting_reports/financial/income_report/?report_type=${props?.duration}`
      );
      setIsLoading(false);
      if (data?.result?.length > 0) {
        return setDataChartState({
          total: data?.total,
          result: data?.result?.map((item: any) => {
            return {
              ...item,
              date: item?.date?.split('T')?.[0],
            };
          }),
        });
      } else {
        return setDataChartState({
          total: 0,
          result:
            props?.duration === 'daily'
              ? daily
              : props?.duration === 'weekly'
              ? weekly
              : monthly,
        });
      }
    }
  };

  useEffect(() => {
    getDataChart();
  }, [lineChartSelectState, props?.duration]);

  const handleGetDashboardTotal = async () => {
    const { data } = await axiosInstance.get(
      'accounting_reports/financial/dashboard/'
    );
    return data;
  };
  const dashboardTotal = useQuery('dashboardTotal', handleGetDashboardTotal);
  const totalIncome = incomes?.data?.find(
    (item: any) => item?.currency__name == baseCurrencyName
  )?.rec;

  //get debit and credit result
  const debitCredit = useGetDebitCreditResult({ startDate });

  const payableAccount = debitCredit?.data?.results?.[0]?.total_payment;
  const receivableAccount = debitCredit?.data?.results?.[0]?.total_receivement;

  //get sales and purchases result
  const salesResult = useGetInvoicesResult(startDate, 'sales');
  const purchasesResult = useGetInvoicesResult(startDate, 'purchase');

  const totalPurchased = purchasesResult?.data?.results?.find(
    (item: any) => item?.currency == currencyId
  )?.total_net_amount;

  const totalSales = salesResult?.data?.results?.find(
    (item: any) => item?.currency === baseCurrencyName
  )?.total_net_amount;

  //get sales and purchases result
  const bankResult = useGetJournalResult({ startDate, accountType: 'bank' });
  const cashResult = useGetJournalResult({ startDate, accountType: 'cash' });

  const bankValue = print(
    //@ts-ignore
    math.evaluate(
      `${bankResult?.data?.[0]?.debit ?? 0} - ${
        bankResult?.data?.[0]?.credit ?? 0
      }`
    )
  );

  const cashValue = print(
    //@ts-ignore
    math.evaluate(
      `${cashResult?.data?.[0]?.debit ?? 0} - ${
        cashResult?.data?.[0]?.credit ?? 0
      }`
    )
  );

  const handleSelectSales = (data: string) => {
    console.log('data', data);
    setLineChartSelectState(data);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Row gutter={[20, 0]} style={{ paddingBottom: '20px' }}>
        <Col sm={24} md={18} style={{ marginBottom: '10px' }}>
          <div style={{ width: '100%' }}>
            <Row gutter={[10, 10]} justify='space-between'>
              <Col span={24}>
                <Card
                  className='box'
                  // size="small"
                  style={{
                    height: isMiniTablet ? '452px' : '427px',
                    boxSizing: 'border-box',
                    position: 'relative',
                    backgroundColor: mode === 'dark' ? Colors.cardBg: '#fff',
                    color: mode === 'dark' ? Colors.white : 'black',
                    border: mode === 'dark' ? '1px solid #333' : '1px solid #fff',
                  }}
                  // hoverable={mode === "dark" ? false : true}
                  bodyStyle={{
                    padding: '0px',
                    height: '100%',
                    // display: salesResult?.isLoading ? "grid":"",
                    // alignItems: "center"
                  }}
                  // loading={!Boolean(startDate) ? true : salesResult?.isLoading}
                >
                  {checkPermissions(INVOICES_P) && (
                    <Fragment>
                      {isLoading && (
                        <div
                          style={{
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                            display: 'grid',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 100000,
                            left: 0,
                            right: 0,
                            top: 0,
                            color: mode === 'dark' ? Colors.white : 'black',
                            backgroundColor: mode === 'dark' ? Colors.primaryDarkBackground : Colors.white,
                            borderRadius: '10px',
                          }}
                        >
                          {' '}
                          <Spin size='large' />
                        </div>
                      )}
                      <ChartHeader
                        title={t(`Dashboard.${lineChartSelectState}`)}
                        value={dataChartState?.total?.toFixed(2)}
                        handleGetSelectValue={handleSelectSales}
                      />
                      <SalesChart
                        title={t('Sales.1')}
                        value={parseFloat(totalSales ?? 0)}
                        data={dataChartState?.result}
                      />
                    </Fragment>
                  )}
                </Card>
              </Col>
            </Row>
          </div>
        </Col>
        <Col sm={24} md={6}>
          <Space direction='vertical' size={12}>
           
            <ConvertDate />
            <DashboardCurrencyExchange permission={`view_${CURRENCY_RATE_M}`} />
          </Space>
        </Col>
      </Row>

      <Row style={{ marginTop: '0' }} gutter={[10, 10]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <TotalItem
            title={t('Dashboard.Payment_accounts')}
            value={dashboardTotal?.data?.['payable  account']}
            // bgColor="#ffc765"
            // rgbaBgColor="rgba(255,199,101,.7)"
            bgImage='./images/svg/dashboardYellowCard.svg'
            icon={<PayableAccountIcon />}
            loading={
              dashboardTotal?.isLoading
              // !Boolean(startDate) || !Boolean(currencyId)
              //   ? true
              //   : debitCredit?.isLoading
            }
            permission={DEBIT_CREDIT_P}
            // permission={`view_${INCOME_M}`}
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <TotalItem
            title={t('Dashboard.Received_accounts')}
            // value={receivableAccount}
            value={dashboardTotal?.data?.['receivable account']}
            // bgColor="#65ADFF"
            // rgbaBgColor="rgba(101,173,255,.7)"
            bgImage='./images/svg/dashboardBlueCard.svg'
            icon={<ReceivableAccountIcon />}
            loading={
              dashboardTotal?.isLoading
              // !Boolean(startDate) || !Boolean(currencyId)
              //   ? true
              //   : debitCredit?.isLoading
            }
            permission={DEBIT_CREDIT_P}
            // permission={`view_${INCOME_M}`}
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <TotalItem
            title={t('Expenses.Income.1')}
            // value={parseFloat(totalIncome ?? 0)}
            value={dashboardTotal?.data?.income}
            // bgColor="#21C0AD"
            // rgbaBgColor="rgba(33,192,173,.7)"
            bgImage='./images/svg/dashboardGreenCard.svg'
            icon={<IncomeIcon />}
            loading={
              dashboardTotal?.isLoading
              // !Boolean(startDate) ? true : incomes?.isLoading
            }
            permission={`view_${INCOME_M}`}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <TotalItem
            title={t('Dashboard.Purchases')}
            // value={parseFloat(totalPurchased ?? 0)}
            value={dashboardTotal?.data?.purchase}
            // bgColor="#9D65FF"
            // rgbaBgColor="rgba(157,101,255,.7)"
            bgImage='./images/svg/dashboardPurpleCard.svg'
            icon={<ProfitIcon />}
            loading={
              dashboardTotal?.isLoading
              // !Boolean(startDate) ? true : purchasesResult?.isLoading
            }
            permission={INVOICES_P}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <TotalItem
            title={t('Banking.1')}
            // value={bankValue}
            value={dashboardTotal?.data?.bank}
            // bgColor="#FF6594"
            // rgbaBgColor="rgba(255,101,148,.7)"
            bgImage='./images/svg/dashboardPinkCard.svg'
            icon={<MastercardIcon />}
            loading={
              dashboardTotal?.isLoading
              // !Boolean(startDate) ? true : bankResult?.isLoading
            }
            permission={`view_${BANK_M}`}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <TotalItem
            title={t('Banking.Cash_box.1')}
            // value={cashValue}
            value={dashboardTotal?.data?.['cash box']}
            // bgColor="#FF6565"
            // rgbaBgColor="rgba(255,101,101,.7)"
            bgImage='./images/svg/dashboardRedCard.svg'
            icon={<CashIcon />}
            loading={
              dashboardTotal?.isLoading
              // !Boolean(startDate) ? true : cashResult?.isLoading
            }
            permission={`view_${CASH_M}`}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <TotalItem
            title={t('Sales.1')}
            // value={cashValue}
            value={dashboardTotal?.data?.sales}
            // bgColor="#FF6565"
            // rgbaBgColor="rgba(255,101,101,.7)"
            bgImage='./images/svg/dashboardSalesBox.svg'
            icon={<ReceivableAccountIcon />}
            loading={
              dashboardTotal?.isLoading
              // !Boolean(startDate) ? true : cashResult?.isLoading
            }
            permission={`view_${CASH_M}`}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <TotalItem
            title={t('expense')}
            // value={cashValue}
            value={dashboardTotal?.data?.expense}
            // bgColor="#FF6565"
            // rgbaBgColor="rgba(255,101,101,.7)"
            bgImage='./images/svg/dashboardExpenceBox.svg'
            icon={<MastercardIcon />}
            loading={
              dashboardTotal?.isLoading
              // !Boolean(startDate) ? true : cashResult?.isLoading
            }
            permission={`view_${CASH_M}`}
          />
        </Col>
      </Row>
    </div>
  );
}
