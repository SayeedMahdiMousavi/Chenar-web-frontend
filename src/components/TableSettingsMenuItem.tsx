import React, { ReactNode } from 'react';
import { Menu, Checkbox, MenuItemProps } from 'antd';

interface IProps extends MenuItemProps {
  children: ReactNode;
  checked: boolean;
  setColumns: (value: any) => void;
  name: string;
}

export function TableSettingsMenuItem({
  children,
  checked,
  name,
  setColumns,
  ...rest
}: IProps) {
  const onChange = (e: any) => {
    const name = e.target.name;
    const checked = e.target.checked;

    setColumns((prev: any) => {
      return { ...prev, [name]: checked };
    });
  };
  return (
    <Menu.Item key={name} {...rest}>
      <Checkbox onChange={onChange} checked={checked} name={name}>
        {children}
      </Checkbox>
    </Menu.Item>
  );
}
