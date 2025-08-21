import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export function FormListAddButton({
  onClick,
  text,
  ...rest
}: {
  onClick: () => void;
  style?: React.CSSProperties;
  text?: string;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <Button
      type="dashed"
      onClick={onClick}
      block
      icon={<PlusOutlined className="addItemIcon" />}
      className="margin1"
      {...rest}
    >
      {text ? text : t("Sales.Product_and_services.Form.Add_new_item")}
    </Button>
  );
}
