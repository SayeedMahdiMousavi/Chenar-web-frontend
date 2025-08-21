import React from "react";
import { Popconfirm, Button } from "antd";
import { DeleteOutlined, DeleteTwoTone } from "@ant-design/icons";
import { ActionMessage } from "../../../SelfComponents/TranslateComponents/ActionMessage";
import { useTranslation } from "react-i18next";
import { Colors } from "../../../colors";

function PosInvoiceTableAction({
  editingKey,
  recordKey,
  name,
  handleDelete,
  responseId,
}) {
  const { t } = useTranslation();

  const handleDeleteProduct = React.useCallback(() => {
    handleDelete(recordKey);
  }, [handleDelete, recordKey]);

  return (
    <Popconfirm
      placement="topLeft"
      title={
        <ActionMessage name={name} message="Message.Remove_item_message" />
      }
      onConfirm={handleDeleteProduct}
      okText={t("Manage_users.Yes")}
      cancelText={t("Manage_users.No")}
      disabled={editingKey !== "" || responseId}
    >
      <Button
        shape="circle"
        size="small"
        disabled={editingKey !== "" || responseId}
        style={styles.icon}
        icon={
          editingKey !== "" ? (
            <DeleteOutlined />
          ) : (
            <DeleteTwoTone twoToneColor={Colors.red} />
          )
        }
      ></Button>
    </Popconfirm>
  );
}

export const Actions = PosInvoiceTableAction;

const styles = {
  icon: {
    background: "#F2F1F6",
    border: "1px",
  },
};
