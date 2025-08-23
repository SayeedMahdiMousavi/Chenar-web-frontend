import { Table } from 'antd';
import { re } from 'mathjs';
import React from 'react';
import { useTranslation } from 'react-i18next';

const JournalBookBankAccount = (props: any) => {
  const { t } = useTranslation();
  const column = [
    {
      title: t('Banking.Form.Account_name'),
      dataIndex: 'account_name',
      key: 'account_name',
    },
    {
      title: t('Banking.Form.Previous_inventory'),
      dataIndex: 'previous',
      key: 'previous',
    },
    {
      title: t('Banking.Form.Credit'),
      dataIndex: 'credit',
      key: 'credit',
    },
    {
      title: t('Banking.Form.Debit'),
      dataIndex: 'debit',
      key: 'debit',
    },
    {
      title: t('Banking.Form.Total'),
      dataIndex: 'previous',
      key: 'previous',
      render: (previous: string, record: any) => {
        const total =
          parseFloat(previous) +
          parseFloat(record?.debit) -
          parseFloat(record?.credit);
        return <span>{total}</span>;
      },
    },
    {
      title: t('Banking.Form.Currency'),
      dataIndex: 'currency__name',
      key: 'currency__name',
      render: (text: string) => {
        return <span>{t(`Reports.${text}`)}</span>;
      },
    },
  ];
  return (
    <div style={{ marginTop: '1.5rem', width: '100%' }}>
      <Table columns={column} pagination={false} dataSource={props?.data} />
    </div>
  );
};

export default JournalBookBankAccount;
