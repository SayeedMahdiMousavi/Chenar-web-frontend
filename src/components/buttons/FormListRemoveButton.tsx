import React from 'react';
import { Button } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';

export function FormListRemoveButton({
  onClick,
  ...rest
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      shape='circle'
      size='small'
      type='text'
      danger
      icon={<MinusCircleOutlined onClick={onClick} />}
      {...rest}
    />
  );
}
