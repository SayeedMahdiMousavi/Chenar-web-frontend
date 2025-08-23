import React, { ReactNode } from 'react';
import { InputNumber, InputNumberProps } from 'antd';
import { Colors } from '../pages/colors';

interface IProps extends InputNumberProps {
  addAfter?: ReactNode;
}

export function InputNumberWithAddAfter({
  addAfter,
  onFocus,
  ...rest
}: IProps) {
  const handleFocus = (e: any) => {
    e.target.select();
  };
  return (
    <>
      <InputNumber
        min={1}
        onFocus={onFocus ? onFocus : handleFocus}
        type='number'
        inputMode='numeric'
        style={styles.input}
        {...rest}
      />

      <div className='ant-input-group-addon' style={styles.addAfter}>
        {addAfter}
      </div>
    </>
  );
}

const styles = {
  addAfter: {
    paddingTop: '2px',
    verticalAlign: 'middle',
    display: 'inline-block',
    lineHeight: '24px',
    height: '32px',
    width: '26px',
    padding: '2px',
    borderEndStartRadius: 0,
    borderStartStartRadius: 0,
    borderEndEndRadius: 5,
    borderStartEndRadius: 5,
    borderInlineEnd: `1px solid ${Colors.borderColor}`,
    borderInlineStart: '0px',
  },
  input: {
    verticalAlign: 'middle',
    borderEndEndRadius: 0,
    borderStartEndRadius: 0,
  },
};
