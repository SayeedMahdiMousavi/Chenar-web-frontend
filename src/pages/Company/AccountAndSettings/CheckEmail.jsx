import React, { useState } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import { CancelButton } from '../../../components';
const CheckEmail = (props) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();
  const showModal = () => {
    setVisible(true);
  };
  const checkEmail = async (value) =>
    await axiosInstance.post(`/company/company_smtp/smtp_check/`, value, {
      timeout: 0,
    });

  const {
    mutate: mutateCheckEmail,
    isLoading,
    reset,
  } = useMutation(checkEmail, {
    onSuccess: (values) => {
      setVisible(false);

      message.success(t('Company.Check_email_success_message'));
    },
    onError: (error) => {
      message.error(t('Company.Check_email_error_message'));
    },
  });

  const handleOk = (values) => {
    form
      .validateFields()
      .then(async (values) => {
        const allData = {
          email: values?.email,
        };
        mutateCheckEmail(allData, {
          onSuccess: () => {},
        });
      })
      .catch((info) => {
        message.error(`${info}`);
      });
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleAfterClose = () => {
    reset();
    form.resetFields();
  };

  return (
    <>
      <Button type='primary' onClick={showModal} ghost>
        {t('Company.Check_email')}
      </Button>
      <Modal
        maskClosable={false}
        title={t('Company.Check_email')}
        open={visible}
        onOk={handleOk}
        width={370}
        onCancel={handleCancel}
        afterClose={handleAfterClose}
        footer={[
          <CancelButton key='back' onClick={handleCancel} />,
          <Button
            key='submit'
            type='primary'
            loading={isLoading}
            onClick={handleOk}
          >
            {t('Sales.Customers.Table.Send')}
          </Button>,
        ]}
      >
        <Form layout='vertical' hideRequiredMark form={form}>
          <Form.Item
            name='email'
            label={
              <span>
                {t('Form.Email')}
                <span className='star'>*</span>
              </span>
            }
            style={styles.margin}
            rules={[
              {
                type: 'email',
                message: `${t('Form.Email_Message')}`,
              },
              {
                required: true,
                message: `${t('Company.Form.Required_email')}`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const styles = {
  margin: { margin: '0px' },
};
export default CheckEmail;
