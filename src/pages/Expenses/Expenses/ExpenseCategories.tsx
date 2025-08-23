import React from 'react';
import Categories from '../../sales/Products/Categories/Categories';
import { useTranslation } from 'react-i18next';
import { EXPENSE_CATEGORY_M } from '../../../constants/permissions';
export const ExpenseCategories = () => {
  const { t } = useTranslation();
  return (
    <Categories
      title={t('Expenses.Expenses_categories')}
      url='/expense_revenue/expense/category/'
      backText={t('Expenses.Expenses_definition')}
      backUrl='/expense-definition'
      model={EXPENSE_CATEGORY_M}
    />
  );
};

export default ExpenseCategories;
