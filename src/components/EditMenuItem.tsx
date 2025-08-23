import React from 'react';
import { Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { checkPermissions } from '../Functions';

export function EditMenuItem({
  permission,
  onClick,
  key,
  ...rest
}: {
  permission: string;
  onClick: () => void;
  key?: string;
}) {
  const { t } = useTranslation();
  return !checkPermissions(`change_${permission}`) ? null : (
    <Menu.Item {...rest} onClick={onClick} key={key}>
      {t('Sales.Customers.Table.Edit')}
    </Menu.Item>
  );
}
