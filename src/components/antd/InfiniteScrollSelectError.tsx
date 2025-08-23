import React from 'react';
import { Result } from 'antd';
import RetryButton from '../../pages/SelfComponents/RetryButton';
import { useTranslation } from 'react-i18next';
import { CloseCircleFilled, WifiOutlined } from '@ant-design/icons';

interface IProps {
  error: any;
  handleRetry: () => void;
}
export default function InfiniteScrollSelectError(props: IProps) {
  const { t } = useTranslation();

  const res = props?.error?.response;
  const message = props?.error?.message;

  return (
    <Result
      icon={
        message === 'Network Error' ? (
          <WifiOutlined style={{ fontSize: '35px' }} />
        ) : (
          <CloseCircleFilled style={{ fontSize: '35px' }} />
        )
      }
      status={
        res?.status === 500 ? '500' : res?.status === 403 ? '403' : 'error'
      }
      style={{ padding: '10px 0px' }}
      title={
        <div style={{ fontSize: '12px' }}>
          {res?.status === 500
            ? t('Message.Something')
            : res?.status === 403
              ? '403'
              : message === 'Network Error'
                ? t('Internet.No_internet')
                : res?.statusText}
        </div>
      }
      subTitle={
        message === 'Network Error'
          ? t('Internet.Check_internet')
          : res?.status === 500
            ? undefined
            : res?.status === 403
              ? t('Internet.Not_access_route_message')
              : message
      }
      extra={[
        <RetryButton
          handleRetry={props?.handleRetry}
          size='small'
          style={styles?.retryButton}
        />,
      ]}
    />
  );
}
const styles = {
  retryButton: { margin: '0px' },
};
