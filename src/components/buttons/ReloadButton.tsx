import React from 'react';
import { Space, Button, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { CircularArrowIcon } from '../../icons';

export default function ReloadButton(props: {
  selectedRowKeys?: string[];
  length?: number;
  onReload: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Space size='small' align='center'>
      <Typography.Text strong={true}>
        {props?.length ? props?.length : props.selectedRowKeys?.length}{' '}
        {t('Pagination.Item')}
      </Typography.Text>
      <Button
        type='primary'
        size='small'
        icon={<CircularArrowIcon rotate={30} />}
        onClick={props.onReload}
        shape='round'
        style={styles.button}
      />
    </Space>
  );
}

const styles = {
  button: { paddingTop: '1px' },
};
