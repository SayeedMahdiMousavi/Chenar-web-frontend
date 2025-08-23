import React from 'react';
import { Avatar } from 'antd';
import { useTranslation } from 'react-i18next';

export function DefaultLogo({ style, ...rest }: any) {
  const { t } = useTranslation();

  return (
    <Avatar
      shape='square'
      size={45}
      gap={10}
      style={{ ...styles, ...style }}
      {...rest}
      // src={"/android-chrome-512x512.png"}
    >
      {t('Company.Logo')}
    </Avatar>
  );
}

const styles = {
  backgroundColor: '#78909c',
  marginBottom: '6px',
  // color: "white",
};
