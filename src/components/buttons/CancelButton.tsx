import { Button, ButtonProps } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function CancelButton(props: ButtonProps & { theme?: string }) {
  const { t } = useTranslation();
  const style = props.theme === 'dark' ? { color: '#fff', borderColor: '#fff' } : {};
  return (
    <Button ghost type="primary" {...props} style={style}>
      {t('Form.Cancel')}
    </Button>
  );
}
