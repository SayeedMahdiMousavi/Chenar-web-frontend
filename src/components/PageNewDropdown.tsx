import React, { useState } from 'react';
import { Dropdown, Button, DropDownProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../pages/MediaQurey';
import { FaAngleDown as DownIcon, FaAngleUp as UpIcon } from 'react-icons/fa';

interface IProps extends DropDownProps {
  text?: string;
}

export function PageNewDropdown({ overlay, text, ...rest }: IProps) {
  const { t } = useTranslation();
  const isMiniTablet = useMediaQuery('(max-width:576px)');
  const isLaptop = useMediaQuery('(max-width:1550px)');
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag);
  };

  return (
    <Dropdown
      overlay={overlay}
      trigger={['click']}
      {...rest}
      placement='bottomCenter'
      onOpenChange={handleVisibleChange}
    >
        <span
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          
        }}
      >
      <Button
        className='num table-col'
        type='primary'
        shape='round'
        size={isMiniTablet ? 'small' : isLaptop ? 'middle' : 'large'}
      >
        {text ? text : t('Sales.Product_and_services.New')}{' '}
        {visible ? (
          <UpIcon style={styles.icon} />
        ) : (
          <DownIcon style={styles.icon} />
        )}
      </Button>
      </span>
    </Dropdown>
  );
}

const styles = {
  icon: {
    fontSize: '10px',
  },
};
