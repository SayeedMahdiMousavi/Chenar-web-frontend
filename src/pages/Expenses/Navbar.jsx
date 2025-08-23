import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { checkPermissionsModel } from '../../Functions';
import {
  EXPENSE_PAGE_M,
  INCOME_PAGE_M,
  WITHDRAW_PAGE_M,
} from '../../constants/permissions';
import { EXPENSE, INCOME, WITHDRAW } from '../../constants/routes';
import { NavbarMenuItems } from '../../components';
import { ExpenseAndIncome } from '../Router/Navlink';

const Navbar = () => {
  const { t } = useTranslation();

  const finalMenuItems = useMemo(() => {
    const menuItems = [
      {
        route: EXPENSE,
        name: t('Expenses.1'),
        model: EXPENSE_PAGE_M,
      },
      {
        route: INCOME,
        name: t('Expenses.Income.1'),
        model: INCOME_PAGE_M,
      },
      {
        route: WITHDRAW,
        name: t('Expenses.With_draw.1'),
        model: WITHDRAW_PAGE_M,
      },
    ];
    return menuItems?.filter((item) => checkPermissionsModel(item?.model));
  }, [t]);

  return (
    <NavbarMenuItems
      menuItems={finalMenuItems}
      onMouseEnter={ExpenseAndIncome}
    />
  );
};

export default Navbar;
