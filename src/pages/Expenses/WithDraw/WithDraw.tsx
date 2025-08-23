import React from 'react';
import { useTranslation } from 'react-i18next';
import { WITHDRAW_TYPE_M } from '../../../constants/permissions';
import RootComponent from '../IncomeTypeAndWithDraw/RootComponent';

export const WithDraw = () => {
  const { t } = useTranslation();
  return (
    <RootComponent
      title={t('Expenses.With_draw.With_definition')}
      baseUrl='/expense_revenue/withdraw/'
      addTitle={t('Expenses.With_draw.With_draw_information')}
      backText={t('Expenses.With_draw.1')}
      backUrl='/withdraw'
      model={WITHDRAW_TYPE_M}
    />
  );
};

export default WithDraw;
