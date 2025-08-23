import React from 'react';
import { Space, Descriptions } from 'antd';
import { Statistics } from '../../../../../components/antd';
import { useTranslation } from 'react-i18next';

interface IProps {
  total: number;
  discount: number;
  expense: number;
  finalAmount: number;
  cashAmount: number;
  remainAmount: number;
  type: string;
}

export default function InvoiceSummary({
  total,
  discount,
  expense,
  finalAmount,
  cashAmount,
  remainAmount,
  type,
}: IProps) {
  const { t } = useTranslation();
  return (
    <Space direction='vertical'>
      <Descriptions
        bordered
        size='small'
        column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        contentStyle={styles.descriptionContent}
        labelStyle={styles.descriptionLabel}
      >
        <Descriptions.Item label={t('Sales.Customers.Form.Total')}>
          <Statistics value={total} />
        </Descriptions.Item>
        <Descriptions.Item label={t('Sales.Customers.Discount.1')}>
          <Statistics value={discount} />
        </Descriptions.Item>
        <Descriptions.Item label={t('Expenses.1')}>
          <Statistics value={expense} />
        </Descriptions.Item>
        <Descriptions.Item
          label={t('Final_amount')}
          contentStyle={styles.total}
          labelStyle={styles.total}
        >
          <Statistics value={finalAmount} />
        </Descriptions.Item>
      </Descriptions>
      {type !== 'quotation' && (
        <Descriptions
          bordered
          size='small'
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
          contentStyle={styles.descriptionContent}
          labelStyle={styles.descriptionLabel}
        >
          <Descriptions.Item
            label={
              type === 'sales' || type === 'purchase_rej'
                ? t('Employees.Receive_cash')
                : t('Employees.Pay_cash')
            }
          >
            <Statistics value={cashAmount} />
          </Descriptions.Item>
          <Descriptions.Item
            label={t('Sales.All_sales.Invoice.Remain_amount')}
            contentStyle={styles.total}
            labelStyle={styles.total}
          >
            <Statistics value={remainAmount} />
          </Descriptions.Item>
        </Descriptions>
      )}
    </Space>
  );
}
interface IStyles {
  totalInput: React.CSSProperties;
  descriptionLabel: React.CSSProperties;
  descriptionContent: React.CSSProperties;
  total: React.CSSProperties;
}

const styles: IStyles = {
  totalInput: { marginBottom: '10px' },
  descriptionLabel: { width: '135px', border: 'none' },
  descriptionContent: { textAlign: 'end', padding: '8px 10px', border: 'none' },
  total: { fontWeight: 'bold' },
};
