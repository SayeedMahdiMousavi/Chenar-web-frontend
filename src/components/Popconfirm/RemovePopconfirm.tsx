import React, { useState } from 'react';
import { Popconfirm } from 'antd';
import { ActionMessage } from '../../pages/SelfComponents/TranslateComponents/ActionMessage';
import { useTranslation } from 'react-i18next';
import { checkPermissions } from '../../Functions';

interface IProps {
  onConfirm: () => void;
  onCancel: () => void;
  onClick: () => void;
  itemName: string | number;
  openConfirm: boolean;
  loading: boolean;
  key?: string;
  permission: string;
}

export default function RemovePopconfirm({
  onCancel,
  onConfirm,
  onClick,
  itemName,
  openConfirm,
  loading,
  permission,
  ...rest
}: IProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(openConfirm);
  if (!checkPermissions(`delete_${permission}`)) {
    return null;
  }

  return (
    <Popconfirm
      placement='topLeft'
      title={
        <ActionMessage name={itemName} message='Message.Remove_item_message' />
      }
      onConfirm={onConfirm}
      open={open}
      okButtonProps={{ loading }}
      okText={t('Manage_users.Yes')}
      cancelText={t('Manage_users.No')}
      onCancel={() => {
        setOpen(false);
        onCancel();
      }}
    >
      <div onClick={onClick} {...rest}>
        {t('Sales.Customers.Table.Remove')}
      </div>
    </Popconfirm>
  );
}
