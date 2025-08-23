import React from 'react';
import PayAndReceiveTransactions from '../../Transactions/PayAndReceiveTransactions';
import { useTranslation } from 'react-i18next';
import { SUPPLIER_PAY_REC_M } from '../../../constants/permissions';
export const SupplierPayAndReceiveCash = () => {
  const { t } = useTranslation();
  return (
    <PayAndReceiveTransactions
      title={t('Employees.Pay_and_receive_cash')}
      baseUrl='/pay_receive_cash/supplier/'
      backText={t('Expenses.Suppliers.1')}
      backUrl='/supplier'
      place='supplierPayAndRecCash'
      modalTitle=''
      model={SUPPLIER_PAY_REC_M}
    />
  );
};

export default SupplierPayAndReceiveCash;
