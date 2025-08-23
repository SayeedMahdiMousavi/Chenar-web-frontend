import React from 'react';
import Categories from '../../sales/Products/Categories/Categories';
import { useTranslation } from 'react-i18next';
import { SUPPLIER_CATEGORY_M } from '../../../constants/permissions';
export const SupplierCategories = () => {
  const { t } = useTranslation();
  return (
    <Categories
      title={t('Expenses.Suppliers.Suppliers_categories')}
      url='/supplier_account/supplier_category/'
      backText={t('Expenses.Suppliers.1')}
      backUrl='/supplier'
      model={SUPPLIER_CATEGORY_M}
    />
  );
};

export default SupplierCategories;
