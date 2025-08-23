import React, { useState, useRef } from 'react';
import { useMediaQuery } from '../../MediaQurey';
import { useMutation } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import { Form, Input, App, Modal, Menu, Typography, Space } from 'antd';
import { Colors } from '../../colors';
import { useTranslation } from 'react-i18next';
import ChangePassword from './ChangePassword';
import { LockOutlined, EditOutlined } from '@ant-design/icons';
import { ModalDragTitle } from '../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { ItemSkeleton } from '../UserProfile';
import { CancelButton } from '../../../components';
const CheckPassword = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const { message } = App.useApp();
  const nodeRef = useRef(null);

  const showModal = () => {
    setIsShowModal({
      visible: true,
    });
  };

  const onCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };

  const handelAfterClose = () => {
    form.resetFields();
  };

  const checkPassword = async (value) => {
    await axiosInstance
      .post(`/user_account/user_profile/check_password/`, value)
      .then(() => {
        setLoading(false);
        setVisible(true);
      })
      .catch((error) => {
        setLoading(false);

        if (error?.response?.data?.message) {
          message.error(`${error?.response?.data?.message?.[0]}`);
        }
      });
  };

  const { mutate: mutateCheckPassword } = useMutation(checkPassword, {
    // onSuccess: () => queryClient.invalidateQueries(`/company/backup/`),
  });

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        mutateCheckPassword({
          username: values.username,
          password: values.password,
        });
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const restore = () => {
    setVisible(false);
  };

  return (
    <div>
      <Menu style={styles.menu} selectable={false} mode='inline'>
        <Menu.Item
          key='2'
          className={
            props.data?.user_theme?.type === 'dark'
              ? 'profile_menu_hove_dark'
              : 'profile_menu_hove'
          }
          style={styles.menuItem}
          onClick={showModal}
        >
          <ItemSkeleton isLoading={props?.loading}>
            <div className='profile_menu_content'>
              <LockOutlined style={styles.menuItemIcon} />
              <Typography.Text>
                {props?.data?.username && <span>********</span>}
                <br />
                <Typography.Text strong={true}>
                  {t('Company.Form.Password')}
                </Typography.Text>
              </Typography.Text>
            </div>
            <EditOutlined className='profile_edit_icon' />
          </ItemSkeleton>
        </Menu.Item>
      </Menu>
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
          <Draggable nodeRef={nodeRef} disabled={disabled}>
            <div ref={nodeRef}>{modal}</div>
          </Draggable>
        )}
        centered
        open={isShowModal.visible}
        afterClose={handelAfterClose}
        onCancel={onCancel}
        className={styles.bodyStyle}
        width={isMobile ? '100%' : isTablet ? 350 : 350}
        footer={
          <div className='textAlign__end'>
            <Space>
              <CancelButton onClick={onCancel} />
              <ChangePassword
                data={props.data}
                setVisible={setVisible}
                handleOk={handleOk}
                visible={visible}
                restore={restore}
                setIsShowModal={setIsShowModal}
                loading={loading}
              />
            </Space>
          </div>
        }
      >
        <Form
          form={form}
          requiredMark={true}
          scrollToFirstError={true}
          layout='vertical'
        >
          <Form.Item
            name='username'
            label={
              <span>
                {t('Form.User_name')}
                <span className='star'>*</span>
              </span>
            }
            rules={[
              { required: true, message: `${t('Form.User_name_required')}` },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='password'
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
  menu: { border: 'none' },
  menuItem: {
    lineHeight: '20px',
    padding: '10px 0px',
    height: 'fit-content',
    margin: '0px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemIcon: {
    fontSize: '20px',
    color: Colors.gray,
    paddingTop: '8px',
    paddingInlineEnd: '24px',
  },
  bodyStyle: { padding: '12px 24px' },
};

export default CheckPassword;
