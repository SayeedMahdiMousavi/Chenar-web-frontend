import React from 'react';
import { Popconfirm, Menu } from 'antd';
import { ActionMessage } from '../../pages/SelfComponents/TranslateComponents/ActionMessage';
import { useTranslation } from 'react-i18next';
import { checkPermissions } from '../../Functions';

interface IProps {
  onConfirm: () => void;
  onCancel: () => void;
  onClick: () => void;
  itemName: string | number;
  visible: boolean;
  loading: boolean;
  type: 'active' | 'deactivate';
  permission: string;
}
export default function ActivePopconfirm({
  onCancel,
  onConfirm,
  itemName,
  visible,
  loading,
  type,
  permission,
  ...rest
}: IProps) {
  const { t } = useTranslation();

  return !checkPermissions(permission) ? null : (
    <Popconfirm
      placement='topLeft'
      title={
        <ActionMessage
          name={itemName}
          message={
            type === 'active'
              ? 'Message.Active_item_message'
              : 'Message.Inactive_item_message'
          }
        />
      }
      onConfirm={onConfirm}
      open={visible}
      okButtonProps={{ loading: loading }}
      okText={t('Manage_users.Yes')}
      cancelText={t('Manage_users.No')}
      onCancel={onCancel}
    >
      <Menu.Item {...rest}>
        {type === 'active'
          ? t('Sales.Product_and_services.Active')
          : t('Sales.Customers.Table.inactive')}
      </Menu.Item>
    </Popconfirm>
  );
}
