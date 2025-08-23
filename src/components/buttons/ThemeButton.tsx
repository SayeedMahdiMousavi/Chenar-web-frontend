import { Button, ButtonProps } from 'antd';
import React from 'react';
import { useDarkMode } from '../../Hooks/useDarkMode';
import { MoonIcon } from '../../icons';
import { SunIcon } from '../../icons/SunIcon';

export function ThemeButton({ onClick, style, ...rest }: ButtonProps) {
  const [mode] = useDarkMode();
  return (
    <Button
      onClick={onClick}
      style={{
        padding: '7.5px 0px',
        borderRadius: '12px',
        ...style,
      }}
      icon={
        mode !== 'dark' ? (
          <SunIcon style={styles.icon} />
        ) : (
          <MoonIcon style={styles.icon} />
        )
      }
      type='text'
      size='large'
      shape='circle'
      {...rest}
    />
  );
}

const styles = {
  icon: { fontSize: '22px' },
};
