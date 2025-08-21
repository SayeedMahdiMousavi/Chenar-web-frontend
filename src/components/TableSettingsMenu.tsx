import React, { ReactNode } from "react";
import { Menu, MenuProps, Typography } from "antd";
import { useTranslation } from "react-i18next";

interface IProps extends MenuProps {
  children: ReactNode;
}

export function TableSettingsMenu({ children, ...rest }: IProps) {
  const { t } = useTranslation();
  return (
    <Menu {...rest}>
      <Menu.Item key="1">
        <Typography.Text strong={true}>
          {t("Sales.Product_and_services.Columns")}
        </Typography.Text>
      </Menu.Item>
      {children}
    </Menu>
  );
}
