import React from 'react';
import Transactions from '../Transactions';
import { useTranslation } from 'react-i18next';
import { EMPLOYEE_SALARY_M } from '../../constants/permissions';
export const RecordSalaries = () => {
  const { t } = useTranslation();
  return (
    <Transactions
      title={t('Employees.Record_salaries')}
      baseUrl='/pay_receive_cash/staff/salary/'
      backText={t('Employees.1')}
      backUrl='/employee'
      place='recordSalaries'
      modalTitle={t('Employees.Record_salaries_information')}
      model={EMPLOYEE_SALARY_M}
    />
  );
};

export default RecordSalaries;
