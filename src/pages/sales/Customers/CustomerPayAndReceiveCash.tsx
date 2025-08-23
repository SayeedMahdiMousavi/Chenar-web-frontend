import React from 'react';
import PayAndReceiveTransactions from '../../Transactions/PayAndReceiveTransactions';
import { useTranslation } from 'react-i18next';
import { CUSTOMER_PAY_REC_M } from '../../../constants/permissions';
export const CustomerPayAndReceiveCash = () => {
  const { t } = useTranslation();
  return (
    <PayAndReceiveTransactions
      title={t('Employees.Pay_and_receive_cash')}
      baseUrl='/pay_receive_cash/customer/'
      backText={t('Sales.Customers.1')}
      backUrl='/customer'
      place='customerPayAndRecCash'
      modalTitle=''
      model={CUSTOMER_PAY_REC_M}
    />
  );
};

export default CustomerPayAndReceiveCash;
