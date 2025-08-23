import React from 'react';
import { Button } from 'antd';
import { DotsIcon } from '../../icons';

interface IProps {
  onClick: (flag: any) => void;
  disabled?: boolean;
}
export default function ActionButton(props: IProps) {
  const handleStopPropagation = (e: any) => {
    e.stopPropagation();
  };
  return (
    <Button
      type='text'
      size='small'
      onClick={props.onClick}
      onDoubleClick={handleStopPropagation}
      icon={
        <DotsIcon
          style={props.disabled ? styles.actionButton1 : styles.actionButton}
          className='action-button'
        />
      }
      disabled={props.disabled}
    />
  );
}
const styles = {
  actionButton: { fontSize: '20px' },
  actionButton1: { fontSize: '20px', color: 'gray' },
};
