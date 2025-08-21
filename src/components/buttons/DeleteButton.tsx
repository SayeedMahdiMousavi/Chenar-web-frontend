import { Button, ButtonProps, Popconfirm } from "antd";
import React, { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { DeleteIcon } from "../../icons";
import { ActionMessage } from "../../pages/SelfComponents/TranslateComponents/ActionMessage";

interface IProps extends ButtonProps {
  itemName?: string | number;
  onConfirm: () => void;
  visible?: boolean;
  setVisible?: (value: boolean) => void;
  loading?: boolean;
  titleMessage?: ReactNode;
}

export function DeleteButton({
  itemName,
  onConfirm,
  disabled,
  setVisible,
  visible,
  loading,
  titleMessage,
  ...rest
}: IProps) {
  const { t } = useTranslation();
  const [localVisible, setLocalVisible] = useState(false);

  const handleClickDelete = () => {
    if (setVisible) setVisible(!visible);
  };
  const handleChangeVisible = (flag: boolean) => {
    setLocalVisible(flag);
  };

  return (
    <Popconfirm
      placement="topLeft"
      title={
        titleMessage ? (
          titleMessage
        ) : (
          <ActionMessage
            name={itemName}
            message="Message.Remove_item_message"
          />
        )
      }
      okText={t("Manage_users.Yes")}
      cancelText={t("Manage_users.No")}
      disabled={disabled}
      onCancel={handleClickDelete}
      open={Boolean(setVisible) ? visible : localVisible}
      onOpenChange={handleChangeVisible}
      onConfirm={onConfirm}
      okButtonProps={{
        loading,
      }}
    >
      <Button
        size="small"
        type="text"
        disabled={disabled}
        onClick={handleClickDelete}
        icon={<DeleteIcon style={styles.icon} />}
        {...rest}
      />
    </Popconfirm>
  );
}

const styles = { icon: { fontSize: "15px" } };
