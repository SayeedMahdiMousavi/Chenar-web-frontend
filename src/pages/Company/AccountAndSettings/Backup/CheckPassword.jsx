import React, { useState } from 'react';
import { Modal, Space } from 'antd';
import { useMediaQuery } from '../../../MediaQurey';
import { useMutation } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';
import RestoreBackup from './RestoreBackup';
import { Form, Input, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ModalDragTitle } from '../../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { trimString } from '../../../../Functions/TrimString';
import { CancelButton } from '../../../../components';

const CheckPassword = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [visible, setVisible] = useState(false);
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 425px)');

  const showModal = () => {
    setIsShowModal({
      visible: true,
    });
    props.setVisible(false);
  };

  const onCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };

  const checkPassword = async (value) =>
    await axiosInstance.post(
      `/user_account/user_profile/check_password/`,
      value,
    );

  const {
    mutate: mutateCheckPassword,
    isLoading,
    reset,
  } = useMutation(checkPassword, {
    onSuccess: () => {
      setVisible(false);
    },
    onError: (error) => {
      if (error?.response?.data?.message) {
        message.error(error?.response?.data?.message?.[0]);
      }
    },
  });

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      mutateCheckPassword({
        username: trimString(values.username),
        password: values.password,
      });
    });
  };

  const handleAfterClose = () => {
    form.resetFields();
    reset();
  };

  return (
    <div>
      <div onClick={showModal}>{t('Company.Restore')}</div>
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Company.Check_password')}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
        centered
        afterClose={handleAfterClose}
        open={isShowModal.visible}
        onCancel={onCancel}
        width={isMobile ? '100%' : isTablet ? 380 : 380}
        footer={
          <div className='textAlign__end'>
            <Space>
              <CancelButton onClick={onCancel} />{' '}
              <RestoreBackup
                record={props.record}
                setVisible={setVisible}
                handleOk={handleOk}
                open={visible}
                loading={isLoading}
                setIsShowModal={setIsShowModal}
              />
            </Space>
          </div>
        }
      >
        <Form
          form={form}
          hideRequiredMark={true}
          scrollToFirstError={true}
          layout='vertical'
        >
          <Form.Item
            name='username'
            label={t('Form.User_name')}
            style={styles.formItem}
            rules={[
              { required: true, message: `${t('Form.User_name_required')}` },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='password'
            style={styles.formItem}
            label={
              <span>
                {t('Company.Form.Password')}
                <span className='star'>*</span>
              </span>
            }
            rules={[
              {
                required: true,
                message: `${t('Company.Form.Required_password')}`,
              },
            ]}
          >
            <Input.Password onPressEnter={handleOk} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
const styles = {
  cancel: { margin: '0px 8px' },
  formItem: { marginBottom: '10px' },
};

export default CheckPassword;
