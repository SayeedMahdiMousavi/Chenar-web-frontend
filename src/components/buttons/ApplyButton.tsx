import { Button, ButtonProps } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function ApplyButton(props: ButtonProps) {
  const { t } = useTranslation();
  return (
    <Button htmlType='submit' type='primary' {...props}>
      {t('Form.Apply')}
    </Button>
  );
}
