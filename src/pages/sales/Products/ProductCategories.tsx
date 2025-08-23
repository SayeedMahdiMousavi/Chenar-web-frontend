import React from 'react';
import Categories from './Categories/Categories';
import { useTranslation } from 'react-i18next';
import { PRODUCT_CATEGORY_M } from '../../../constants/permissions';
export const ProductCategories = () => {
  const { t } = useTranslation();
  return (
    <Categories
      title={t('Sales.Product_and_services.Categories.Product_categories')}
      url='/product/category/'
      backText={t('Sales.Product_and_services.1')}
      backUrl='/product'
      model={PRODUCT_CATEGORY_M}
    />
  );
};
export default ProductCategories;
