import { Button, ButtonProps } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function CancelButton(props: ButtonProps) {
  const { t } = useTranslation();
  return (
    <Button ghost type='primary' {...props}>
      {t('Form.Cancel')}
    </Button>
  );
}
