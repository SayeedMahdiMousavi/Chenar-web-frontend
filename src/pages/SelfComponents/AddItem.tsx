import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
interface IProps {
  showModal: () => void;
}
export const AddItem: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  return (
    <span className="add_button" onClick={props.showModal}>
      <PlusOutlined className="addItemIcon" />
      &nbsp;{t("Sales.Product_and_services.Form.Add_item")}
    </span>
  );
};
