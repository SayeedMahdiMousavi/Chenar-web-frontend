import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { checkPermissionsModel } from "../../Functions";
import {
  INVOICE_PAGE_M,
  PRODUCT_PAGE_M,
  WAREHOUSE_PAGE_M,
} from "../../constants/permissions";
import { INVOICES, PRODUCT, WAREHOUSE } from "../../constants/routes";
import { NavbarMenuItems } from "../../components";
import { Inventory } from "../Router/Navlink";

const InventoryNavbar = () => {
  const { t } = useTranslation();

  const finalMenuItems = useMemo(() => {
    const menuItems = [
      {
        route: PRODUCT,
        name: t("Sales.Product_and_services.1"),
        model: PRODUCT_PAGE_M,
      },
      {
        route: WAREHOUSE,
        name: t("Warehouse.1"),
        model: WAREHOUSE_PAGE_M,
      },
      {
        route: INVOICES,
        name: t("Sales.All_sales.1"),
        model: INVOICE_PAGE_M,
      },
    ];
    return menuItems?.filter((item) => checkPermissionsModel(item?.model));
  }, [t]);

  return (
    <NavbarMenuItems menuItems={finalMenuItems} onMouseEnter={Inventory} />
  );
};

export default InventoryNavbar;
