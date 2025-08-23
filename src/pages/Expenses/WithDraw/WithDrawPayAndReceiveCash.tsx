import React from 'react';
import PayAndReceiveTransactions from '../../Transactions/PayAndReceiveTransactions';
import { useTranslation } from 'react-i18next';
import { WITHDRAW_M } from '../../../constants/permissions';
export const WithDrawPayAndReceiveCash = () => {
  const { t } = useTranslation();
  return (
    <PayAndReceiveTransactions
      title={t('Expenses.With_draw.With_draw_and_deposit_cash')}
      baseUrl='/pay_receive_cash/withdrawal/'
      backText=''
      backUrl=''
      place='withdrawPayAndRecCash'
      modalTitle=''
      model={WITHDRAW_M}
    />
  );
};

export default WithDrawPayAndReceiveCash;
