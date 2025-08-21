import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { checkPermissionsModel } from "../../Functions";
import {
  CHART_OF_ACCOUNT_M,
  FISCAL_YEAR_M,
  OPINING_ACCOUNT_M,
} from "../../constants/permissions";
import {
  CHART_OF_ACCOUNT,
  FISCAL_YEAR,
  OPENING_ACCOUNT,
} from "../../constants/routes";
import { NavbarMenuItems } from "../../components";
import { Accounting } from "../Router/Navlink";

const Navbar = () => {
  const { t } = useTranslation();

  const finalMenuItems = useMemo(() => {
    const menuItems = [
      {
        route: CHART_OF_ACCOUNT,
        name: t("Accounting.Chart_of_accounts.1"),
        model: CHART_OF_ACCOUNT_M,
      },
      {
        route: OPENING_ACCOUNT,
        name: t("Opening_accounts.1"),
        model: OPINING_ACCOUNT_M,
      },
      {
        route: FISCAL_YEAR,
        name: t("Company.Financial_period"),
        model: FISCAL_YEAR_M,
      },
    ];
    return menuItems?.filter((item) => checkPermissionsModel(item?.model));
  }, [t]);

  return (
    <NavbarMenuItems menuItems={finalMenuItems} onMouseEnter={Accounting} />
  );
};

export default Navbar;
