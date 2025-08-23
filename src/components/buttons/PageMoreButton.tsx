import React, { JSXElementConstructor, ReactElement, useState } from 'react';
import { Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { checkPermissionsModel } from '../../Functions';
import { useMediaQuery } from '../../pages/MediaQurey';
import { DownIcon, UpIcon } from '../../icons';

export function PageMoreButton({
  overlay,
  permissions,
}: {
  overlay: ReactElement<any, string | JSXElementConstructor<any>>;
  permissions: string[];
}) {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const isMiniTablet = useMediaQuery('(max-width:576px)');
  const isLaptop = useMediaQuery('(max-width:1550px)');

  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag);
  };

  return checkPermissionsModel(permissions) ? (
    <Dropdown
      overlay={overlay}
      trigger={['click']}
      onOpenChange={handleVisibleChange}
      open={visible}
      placement='bottomCenter'
    >
      <Button
        shape='round'
        type='primary'
        size={isMiniTablet ? 'small' : isLaptop ? 'middle' : 'large'}
        // className="more-button"
        block
        ghost
        // icon=
      >
        {t('Sales.Product_and_services.More')}{' '}
        {visible ? (
          <UpIcon style={styles.icon} />
        ) : (
          <DownIcon style={styles.icon} />
        )}
      </Button>
    </Dropdown>
  ) : null;
}

const styles = {
  icon: {
    fontSize: '10px',
  },
};
