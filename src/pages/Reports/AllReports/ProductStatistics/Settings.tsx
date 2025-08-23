import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal, Button, Typography, Space, InputNumber } from 'antd';
import { PRODUCT_STATISTIC_SETTINGS } from '../../../LocalStorageVariables';
import { CancelButton, SaveButton } from '../../../../components';

const { Title } = Typography;

interface IProps {
  setMinAvailable: (value: number) => void;
}
export default function ProductStatisticsSettings(props: IProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const onFinish = async (values: any) => {
    localStorage.setItem(PRODUCT_STATISTIC_SETTINGS, values?.available ?? 0);
    props.setMinAvailable(values?.available ?? 0);

    setVisible(false);
  };

  const showModal = () => {
    setVisible(true);
    const availableMin = localStorage.getItem(PRODUCT_STATISTIC_SETTINGS);
    if (availableMin) {
      form.setFieldsValue({ available: availableMin });
    }
  };

  const handleCancel = () => {
    setVisible(false);

    form.resetFields();
  };

  const handelAfterClose = () => {
    form.resetFields();
  };

  const handelFocus = (e: any) => {
    e.target.select();
  };
  return (
    <div>
      <div onClick={showModal}>{t('Manage_users.Settings')}</div>
      <Modal
        maskClosable={false}
        open={visible}
        onOk={onFinish}
        onCancel={handleCancel}
        footer={null}
        width={310}
        //@ts-ignore
        handelAfterClose={handelAfterClose}
      >
        <Form
          layout='vertical'
          onFinish={onFinish}
          hideRequiredMark={true}
          form={form}
          initialValues={{
            available: 10,
          }}
        >
          <Title level={5}>{t('Reports.Product_statistics_settings')}</Title>
          <Form.Item
            name='available'
            label={t('Reports.Minimum_available')}
            style={{ margin: '22px 0px' }}
          >
            <InputNumber min={0} className='num' onFocus={handelFocus} />
          </Form.Item>

          <Form.Item className='formItem textAlign__end'>
            <Space>
              <CancelButton onClick={handleCancel} />
              <SaveButton htmlType='submit' />
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
