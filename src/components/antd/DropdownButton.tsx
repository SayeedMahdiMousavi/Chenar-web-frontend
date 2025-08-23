import React from 'react';
import { Dropdown, Button } from 'antd';
import { DownIcon, UpIcon } from '../../icons';
import { useTranslation } from 'react-i18next';

interface IProps {
  text: string;
  dropdownProps: any;
  rightButtonProps?: any;
  leftButtonProps?: any;
}

export default function DropdownButton(props: IProps) {
  const { t } = useTranslation();
  return (
    <Dropdown.Button
      trigger={['click']}
      placement={t('Dir') === 'rtl' ? 'topLeft' : 'topRight'}
      buttonsRender={() => [
        <Button
          type='primary'
          {...props.leftButtonProps}
          disabled={props?.dropdownProps?.disabled}
        >
          {props.text}
        </Button>,
        <Button
          icon={
            props?.dropdownProps?.visible ? (
              <DownIcon style={icon} />
            ) : (
              <UpIcon style={icon} />
            )
          }
          type='primary'
          disabled={props?.dropdownProps?.disabled}
          {...props.rightButtonProps}
        />,
      ]}
      {...props.dropdownProps}
    >
      {props.text}
    </Dropdown.Button>
  );
}

const icon = { fontSize: '10px' };
