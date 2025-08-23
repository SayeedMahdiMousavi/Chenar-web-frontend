import { Button, ButtonProps } from 'antd';
import React from 'react';
import { ViewIcon } from '../../icons';
import { Colors } from '../../pages/colors';

export function ViewButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      icon={<ViewIcon style={styles.icon} />}
      shape='round'
      size='small'
      type='text'
    />
  );
}

const styles = {
  icon: { fontSize: '16px', color: Colors.primaryColor },
};
