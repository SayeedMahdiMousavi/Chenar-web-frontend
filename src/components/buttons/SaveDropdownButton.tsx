import React from 'react';
import { Menu } from 'antd';
import DropdownButton from '../antd/DropdownButton';
import { useTranslation } from 'react-i18next';
import { SaveIcon } from '../../icons';
import { Colors } from '../../pages/colors';

interface IProps {
  onSubmit: () => void;
  dropdownProps: any;
  loading?: boolean;
}

export default function SaveDropdownButton(props: IProps) {
  const { t } = useTranslation();
  const menu = (
    <Menu style={styles.menu}>
      <Menu.Item key='0' onClick={props.onSubmit} style={styles.menuItem}>
        {t('Form.Save_and_new')}
      </Menu.Item>
    </Menu>
  );
  return (
    <DropdownButton
      leftButtonProps={{
        icon: <SaveIcon />,
        onClick: props.onSubmit,
        loading: props?.loading,
      }}
      dropdownProps={{ overlay: menu, ...props.dropdownProps }}
      text={t('Form.Save')}
    />
  );
}

const styles = {
  menuItem: {
    backgroundColor: Colors.primaryColor,
    color: 'white',
  },
  menu: {
    padding: '2px',
    backgroundColor: Colors.primaryColor,
    borderRadius: '8px',
  },
};
