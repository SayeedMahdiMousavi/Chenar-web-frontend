import React from 'react';
import Categories from '../Products/Categories/Categories';
import { useTranslation } from 'react-i18next';
import { CUSTOMER_CATEGORY_M } from '../../../constants/permissions';
export const CustomerCategories = () => {
  const { t } = useTranslation();
  return (
    <Categories
      title={t('Sales.Customers.Customer_Categories')}
      url='/customer_account/customer_category/'
      backText={t('Sales.Customers.1')}
      backUrl='/customer'
      model={CUSTOMER_CATEGORY_M}
    />
  );
};

export default CustomerCategories;
