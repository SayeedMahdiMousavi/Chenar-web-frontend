import React, { Fragment } from 'react';
import { Form, Space, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import ReceiveCash from './ReceiveCash';
import { DeleteButton } from '../../../../../components';
import { Statistics } from '../../../../../components/antd';

interface IProps {
  type: string;
  actionType: string;
  form: any;
  responseId: boolean;
  calendarCode: string;
  finalAmount: number;
  currencySymbol: string;
  setCashAmount: (value: number) => void;
  cashAmount: number;
  prevCashCurrency?: any;
}

function MultipleCashPayment({
  type,
  form,
  responseId,
  calendarCode,
  finalAmount,
  currencySymbol,
  setCashAmount,
  actionType,
  prevCashCurrency,
  cashAmount,
}: IProps) {
  const { t } = useTranslation();

  const handleRemoveItem = React.useCallback(
    (index: number) => {
      const cashList = form
        .getFieldValue('cashList')
        ?.filter((_: any, itemIndex: number) => itemIndex !== index);

      const amount = cashList?.reduce((sum: number, item: any) => {
        return sum + item?.cashAmount;
      }, 0);
      setCashAmount(amount ?? 0);
      form.setFieldsValue({
        cashList: cashList,
      });
    },
    [form, setCashAmount],
  );

  const columns = [
    {
      dataIndex: 'bank',
    },
    {
      dataIndex: 'currencySymbol',
      render: (value: any, record: any) => (
        <Fragment>
          <Statistics
            value={record?.amount}
            suffix={value}
            className='invoiceStatistic'
          />
          {record?.currency?.value !== record?.currency_calc?.value && (
            <Fragment>
              {' '}
              {t('Equivalent')}{' '}
              <Statistics
                value={record?.amount_calc}
                suffix={record?.calCurrencySymbol}
                className='invoiceStatistic'
              />
            </Fragment>
          )}
        </Fragment>
      ),
    },
    {
      dataIndex: 'Action',
      title: 'action',
      align: 'center',
      width: 60,
      render: (_: any, record: any, index: number) => (
        <Space align='center' size={10}>
          <ReceiveCash
            calenderCode={calendarCode}
            setCashAmount={setCashAmount}
            place={
              type === 'sales' || type === 'sales_rej'
                ? 'customerPayAndRecCash'
                : 'supplierPayAndRecCash'
            }
            type={
              type === 'sales' || type === 'purchase_rej'
                ? 'recCash'
                : 'payCash'
            }
            form={form}
            totalPrice={finalAmount}
            currencySymbol={currencySymbol}
            actionType='edit'
            item={`${index}`}
            invoiceType={type}
            responseId={responseId}
            prevCashCurrency={prevCashCurrency}
          />
          <DeleteButton
            itemName={record?.bank}
            onConfirm={() => handleRemoveItem(index)}
            disabled={responseId}
          />
        </Space>
      ),
    },
  ];

  return (
    <Form.Item
      shouldUpdate={(prevValues, curValues) =>
        prevValues.cashList !== curValues.cashList
      }
      label={
        type === 'sales' || type === 'purchase_rej'
          ? t('Cash_receivements')
          : t('Cash_payments')
      }
    >
      {({ getFieldValue }: any) => {
        const cashList = getFieldValue('cashList') || [];

        return (
          <Fragment>
            <Table
              pagination={false}
              size='small'
              locale={{ emptyText: t('Invoice_no_cash') }}
              dataSource={cashList}
              showHeader={false}
              rowKey={(record) => record?.key}
              bordered
              //@ts-ignore
              columns={columns}
            />
            {cashList?.length < 2 && (
              <ReceiveCash
                calenderCode={calendarCode}
                place={
                  type === 'sales' || type === 'sales_rej'
                    ? 'customerPayAndRecCash'
                    : 'supplierPayAndRecCash'
                }
                type={
                  type === 'sales' || type === 'purchase_rej'
                    ? 'recCash'
                    : 'payCash'
                }
                form={form}
                invoiceType={type}
                setCashAmount={setCashAmount}
                totalPrice={finalAmount}
                currencySymbol={currencySymbol}
                actionType={actionType}
                responseId={responseId}
                prevCashCurrency={prevCashCurrency}
                addDisabled={
                  finalAmount <= 0 || responseId || finalAmount <= cashAmount
                }
              />
            )}
          </Fragment>
        );
      }}
    </Form.Item>
  );
}

//@ts-ignore
// eslint-disable-next-line no-func-assign
MultipleCashPayment = React.memo(MultipleCashPayment);

export default MultipleCashPayment;
