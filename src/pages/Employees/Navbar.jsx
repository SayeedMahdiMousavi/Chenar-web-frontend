import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { checkPermissionsModel } from "../../Functions";
import {
  CUSTOMER_PAGE_M,
  EMPLOYEE_PAGE_M,
  SUPPLIER_PAGE_M,
} from "../../constants/permissions";
import { CUSTOMER, EMPLOYEE, PARTNERS, SUPPLIER } from "../../constants/routes";
import { NavbarMenuItems } from "../../components";
import { Contacts } from "../Router/Navlink";

const ContactsNavbar = () => {
  const { t } = useTranslation();

  const finalMenuItems = useMemo(() => {
    const menuItems = [
      {
        route: CUSTOMER,
        name: t("Sales.Customers.1"),
        model: CUSTOMER_PAGE_M,
      },
      {
        route: SUPPLIER,
        name: t("Expenses.Suppliers.1"),
        model: SUPPLIER_PAGE_M,
      },
      {
        route: EMPLOYEE,
        name: t("Employees.1"),
        model: EMPLOYEE_PAGE_M,
      },
      {
        route: PARTNERS,
        name: t("Partners.1"),
        model: EMPLOYEE_PAGE_M,
      },
    ];
    return menuItems?.filter((item) => checkPermissionsModel(item?.model));
  }, [t]);

  return <NavbarMenuItems menuItems={finalMenuItems} onMouseEnter={Contacts} />;
};

export default ContactsNavbar;
