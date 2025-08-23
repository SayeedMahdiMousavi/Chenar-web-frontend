import React from 'react';
import Categories from '../sales/Products/Categories/Categories';
import { useTranslation } from 'react-i18next';
import { EMPLOYEE_CATEGORY_M } from '../../constants/permissions';
export const EmployeeCategories = () => {
  const { t } = useTranslation();
  return (
    <Categories
      title={t('Employees.Employees_categories')}
      url='/staff_account/staff_category/'
      backText={t('Employees.1')}
      backUrl='/employee'
      model={EMPLOYEE_CATEGORY_M}
    />
  );
};

export default EmployeeCategories;
