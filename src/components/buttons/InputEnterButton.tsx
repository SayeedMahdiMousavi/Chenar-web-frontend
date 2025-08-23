import { Button } from 'antd';
import React from 'react';
import { BarcodeIcon } from '../../icons';

export function InputEnterButton({ style, ...rest }: any) {
  return (
    <Button
      icon={<BarcodeIcon style={styles.icon} />}
      style={styles.button}
      {...rest}
    />
  );
}

const styles = {
  icon: { fontSize: '22px' },
  button: {
    borderStartStartRadius: '0px',
    borderEndStartRadius: '0px',
    borderStartEndRadius: '5px',
    borderEndEndRadius: '5px',
    paddingTop: '4px',
  },
};
