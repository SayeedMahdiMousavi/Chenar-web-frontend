import { Col, Row } from 'antd';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useGetBaseCurrency,
  useGetInvoicesResult,
  useGetRunningPeriod,
} from '../../../Hooks';
import moment from 'moment';

import TotalItem from '../../Dashboard/TotalItem';
import { INVOICES_P } from '../../../constants/permissions';
import {
  CashIcon,
  IncomeIcon,
  PayableAccountIcon,
  ProfitIcon,
} from '../../../icons';

const dateFormat = 'YYYY-MM-DD HH:mm';
function SalesTotal() {
  const [startDate, setStartDate] = useState('');
  const { t } = useTranslation();

  //get running period
  const runningPeriod = useGetRunningPeriod();
  const curStartDate = runningPeriod?.data?.start_date;
  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyName = baseCurrency?.data?.symbol;

  useEffect(() => {
    if (curStartDate) {
      setStartDate(
        curStartDate ? moment(curStartDate, dateFormat).format(dateFormat) : '',
      );
    }
  }, [curStartDate]);

  const handleFindTotalInvoices = useCallback(
    (result: any) => {
      const total = result?.data?.results?.find(
        (item: any) => item?.currency == baseCurrencyName,
      );
      // console.log(" total" , total  , "baseCurrency" , baseCurrencyName)
      return {
        total: total?.total_net_amount,
        totalCash: total?.total_cash,
      };
    },
    [baseCurrencyName],
  );

  //get sales and purchases result
  const salesResult = useGetInvoicesResult(startDate, 'sales');
  const purchaseResult = useGetInvoicesResult(startDate, 'purchase');
  const salesReturnResult = useGetInvoicesResult(startDate, 'sales_rej');
  const purchaseReturnResult = useGetInvoicesResult(startDate, 'purchase_rej');
  const totalPurchased = handleFindTotalInvoices(
    purchaseResult?.data?.results?.[0],
  )?.total;
  // console.log("salesResult " , salesResult)
  const totalSales = handleFindTotalInvoices(
    salesResult?.data?.results?.[0],
  )?.total;
  const totalSalesCash = handleFindTotalInvoices(salesResult)?.totalCash;
  const totalReturnSales = handleFindTotalInvoices(salesReturnResult)?.total;
  const totalReturnPurchased =
    handleFindTotalInvoices(purchaseReturnResult)?.total;

  // console.log("salesResult" , salesResult , "totalReturnSales" , totalReturnSales)
  return (
    <Row justify='space-around'>
      <Col span={24}>
        <Row gutter={[10, 20]} align='middle' style={{ marginBottom: '20px' }}>
          {/* <Col md={8} sm={12} xs={24}>
            <Card
              hoverable
              className="customer_admin"
              bordered={false}
              bodyStyle={styles.card}
            >
              <Statistic
                title={
                  <span style={{ color: "white" }}>
                    {t("Sales.Customers.Unpaid_last_year")}
                  </span>
                }
                loading={
                  !Boolean(startDate)
                    ? true
                    : purchaseResult?.isLoading ||
                      purchaseReturnResult?.isLoading
                }
                value={
                  parseFloat(totalPurchased ?? 0) -
                  parseFloat(totalReturnPurchased ?? 0)
                }
                precision={0}
                valueStyle={{ color: "white" }}
                suffix={
                  <span style={{ color: "white", fontSize: "1rem" }}>
                    {baseCurrencyName}
                  </span>
                }
              />
            </Card>
          </Col> */}
          {/* <Col md={8} sm={12} xs={24}>
            <Card
              hoverable
              bordered={false}
              bodyStyle={{
                background: "#08979c",
                padding: "24px 18px",
              }}
            >
              <Statistic
                title={
                  <span style={{ color: "white" }}>
                    {t("Sales.Customers.Unbilled_last_year")}
                  </span>
                }
                loading={
                  !Boolean(startDate)
                    ? true
                    : salesResult?.isLoading || salesReturnResult?.isLoading
                }
                value={
                  parseFloat(totalSales ?? 0) -
                  parseFloat(totalReturnSales ?? 0)
                }
                precision={0}
                valueStyle={{ color: "white" }}
                suffix={
                  <span style={{ color: "white", fontSize: "1rem" }}>
                    {baseCurrencyName}
                  </span>
                }
              />
            </Card>
          </Col> */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <TotalItem
              title={t('Sales.Customers.Unbilled_last_year')}
              value={
                parseFloat(totalSales ?? 0) - parseFloat(totalReturnSales ?? 0)
              }
              // value={totalSales ||  totalReturnSales}
              // bgColor="#65ADFF"
              // rgbaBgColor="rgba(101,173,255,.7)"
              bgImage='./images/svg/dashboardGreenCard.svg'
              icon={<ProfitIcon />}
              loading={
                !Boolean(startDate)
                  ? true
                  : salesResult?.isLoading || salesReturnResult?.isLoading
              }
              permission={INVOICES_P}
              span={6}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <TotalItem
              title={t('Sales.Customers.Unpaid_last_year')}
              value={
                parseFloat(totalPurchased ?? 0) -
                parseFloat(totalReturnPurchased ?? 0)
              }
              // bgColor="#21C0AD"
              // rgbaBgColor="rgba(33,192,173,.7)"
              bgImage='./images/svg/dashboardBlueCard.svg'
              icon={<IncomeIcon />}
              loading={
                !Boolean(startDate)
                  ? true
                  : purchaseResult?.isLoading || purchaseReturnResult?.isLoading
              }
              permission={INVOICES_P}
              span={6}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <TotalItem
              title={t('Sales.Customers.Paid')}
              value={totalSalesCash ?? 0}
              // bgColor="#FF6594"
              // rgbaBgColor="rgba(255,101,148,.7)"
              bgImage='./images/svg/dashboardYellowCard.svg'
              icon={<PayableAccountIcon />}
              loading={
                !Boolean(startDate)
                  ? true
                  : salesResult?.isLoading || salesReturnResult?.isLoading
              }
              permission={INVOICES_P}
              span={6}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <TotalItem
              title={t('Dashboard.Payment_accounts')}
              value={totalSalesCash ?? 0}
              // bgColor="#FF6594"
              // rgbaBgColor="rgba(255,101,148,.7)"
              bgImage='./images/svg/dashboardPinkCard.svg'
              icon={<CashIcon />}
              loading={
                !Boolean(startDate)
                  ? true
                  : salesResult?.isLoading || salesReturnResult?.isLoading
              }
              permission={INVOICES_P}
              span={6}
            />
          </Col>

          {/* <Col md={8} sm={24} xs={24}>
            <Card
              hoverable
              bordered={false}
              bodyStyle={{
                background: "#2ecc71",
                padding: "24px 18px",
              }}
            >
              <Statistic
                title={
                  <span style={{ color: "white" }}>
                    {t("Sales.Customers.Paid")}
                  </span>
                }
                loading={
                  !Boolean(startDate)
                    ? true
                    : salesResult?.isLoading || salesReturnResult?.isLoading
                }
                value={totalSalesCash ?? 0}
                precision={0}
                valueStyle={{ color: "white" }}
                suffix={
                  <span style={{ color: "white", fontSize: "1rem" }}>
                    {baseCurrencyName}
                  </span>
                }
              />
            </Card>
          </Col> */}
        </Row>
      </Col>
    </Row>
  );
}

//@ts-ignore
// eslint-disable-next-line no-func-assign
SalesTotal = memo(SalesTotal);
export default SalesTotal;
