import React from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { checkPermissions } from '../../Functions';
import { useMediaQuery } from '../../pages/MediaQurey';
import { PlusIcon } from '../../icons';

export function PageNewButton({
  onClick,
  model,
  text,
}: {
  onClick?: () => void;
  model: string;
  text?: string;
}) {
  const { t, i18n } = useTranslation();
  const isMiniTablet = useMediaQuery('(max-width:576px)');
  const isLaptop = useMediaQuery('(max-width:1550px)');

  return !checkPermissions(`add_${model}`) ? null : (
    <Button
      // className="new_button"
      size={isMiniTablet ? 'small' : isLaptop ? 'middle' : 'large'}
      type='primary'
      onClick={onClick}
      shape='round'
      block
      icon={
        <PlusIcon
          style={{ fontSize: i18n?.language === 'en' ? '12px' : '10px' }}
        />
      }
    >
      {text ? text : t('Sales.Product_and_services.New')}
    </Button>
  );
}
