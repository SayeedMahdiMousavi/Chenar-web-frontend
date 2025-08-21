import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { checkPermissionsModel } from '../../Functions';
import {
  BANK_PAGE_M,
  BANK_TRANSACTION_PAGE_M,
  CASH_PAGE_M,
} from '../../constants/permissions';
import { BANK, BANK_TRANSACTION, CASH } from '../../constants/routes';
import { NavbarMenuItems } from '../../components';
import { BankAndCash } from '../Router/Navlink';

const Navbar = () => {
  const { t } = useTranslation();

  const finalMenuItems = useMemo(() => {
    const menuItems = [
      {
        route: BANK,
        name: t('Banking.1'),
        model: BANK_PAGE_M,
      },
      {
        route: CASH,
        name: t('Banking.Cash_box.1'),
        model: CASH_PAGE_M,
      },
      {
        route: BANK_TRANSACTION,
        name: t('Banking.Transactions.1'),
        model: BANK_TRANSACTION_PAGE_M,
      },
    ];
    return menuItems?.filter((item) => checkPermissionsModel(item?.model));
  }, [t]);

  return (
    <NavbarMenuItems menuItems={finalMenuItems} onMouseEnter={BankAndCash} />
  );
};

export default Navbar;
