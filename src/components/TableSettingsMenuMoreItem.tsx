import React from "react";
import { Menu, MenuItemProps, Button } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface IProps extends MenuItemProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
}

export function TableSettingsMenuMoreItem({
  visible,
  setVisible,
  ...rest
}: IProps) {
  const { t } = useTranslation();

  const handelVisibility = () => {
    setVisible(!visible);
  };

  return (
    <Menu.Item
      {...rest}
      key="more"
      onClick={handelVisibility}
      className="table__header2-setting-showMore"
      style={{ textAlign: "end" }}
    >
      {visible ? (
        <Button
          type="link"
          icon={<UpOutlined />}
          className="table__header2-setting-showMore"
        >
          {t("Sales.Product_and_services.Show_less")}
        </Button>
      ) : (
        <Button
          type="link"
          icon={<DownOutlined />}
          className="table__header2-setting-showMore"
        >
          {t("Sales.Product_and_services.Show_More")}
        </Button>
      )}
    </Menu.Item>
  );
}
