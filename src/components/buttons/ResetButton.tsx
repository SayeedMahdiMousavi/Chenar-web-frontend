import { ButtonProps, Button } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CircularArrowIcon } from '../../icons';

export function ResetButton(props: ButtonProps) {
  const { t } = useTranslation();
  return (
    <Button
      ghost
      type='primary'
      htmlType='reset'
      {...props}
      icon={<CircularArrowIcon />}
    >
      {t('Form.Reset')}
    </Button>
  );
}
