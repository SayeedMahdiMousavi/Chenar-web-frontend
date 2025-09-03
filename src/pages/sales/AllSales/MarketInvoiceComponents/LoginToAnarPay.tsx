import React, { useState, useRef } from 'react';
import { Modal, Col, Row, Button } from 'antd';
import { useMediaQuery } from '../../../MediaQurey';
import { useMutation } from 'react-query';
import { request, gql } from 'graphql-request';
import { Form, Input, message } from 'antd';
import { Colors } from '../../../colors';
import { useTranslation } from 'react-i18next';
import { LockFilled, UnlockFilled } from '@ant-design/icons';
import { ModalDragTitle } from '../../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import {
  PAY_ACCESS_TOKEN,
  PAY_REFRESH_TOKEN,
} from '../../../LocalStorageVariables';
import { CancelButton, SaveButton } from '../../../../components';

interface IProps {
  graphqlEndPoint: string;
}
const LoginToAnarPay: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const ref = useRef<HTMLDivElement>(null);
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 425px)');

  const showModal = () => {
    setIsShowModal({
      visible: true,
    });
  };

  const handelCancel = () => {
    setIsShowModal({
      visible: false,
    });
    form.resetFields();
    setLoading(false);
  };

  const handelAfterClose = () => {
    form.resetFields();
  };

  const { mutate: mutateLoginMoneyAccount } = useMutation(
    async (value: { userName: string; password: string }) => {
      await request(
        props.graphqlEndPoint,
        gql`
          query ($where: anarPayManagerLoginWhereInput!) {
            anarPayManagerLogin(where: $where) {
              accessToken
              refreshToken
            }
          }
        `,
        { where: value },
      )
        .then((res: any) => {
          setLoading(false);
          localStorage.setItem(
            PAY_ACCESS_TOKEN,
            `${res?.anarPayManagerLogin?.accessToken}`,
          );

          localStorage.setItem(
            PAY_REFRESH_TOKEN,
            `${res?.anarPayManagerLogin?.refreshToken}`,
          );
          setIsShowModal({
            visible: false,
          });
          message.success(t('Sales.All_sales.Invoice.Anar_pay_login_message'));
        })
        .catch((error) => {
          message.error(t('Manage_users.Log_in_error_message'));
          setLoading(false);
        });
    },
  );
  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        mutateLoginMoneyAccount({
          userName: values.username,
          password: values.password,
        });
      })
      .catch((info) => {});
  };

  return (
    <div>
      <Button
        type='primary'
        shape='round'
        onClick={showModal}
        style={{
          boxShadow: '0px 0px 5px -2px rgba(255,255,255,1)',
        }}
        icon={
          localStorage.getItem(PAY_REFRESH_TOKEN) ? (
            <UnlockFilled />
          ) : (
            <LockFilled />
          )
        }
      ></Button>
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Sales.All_sales.Invoice.Login_to_anar_pay')}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled} nodeRef={ref as React.RefObject<HTMLElement>}>
            <div ref={ref}>{modal}</div>
          </Draggable>
        )}
        centered
        open={isShowModal.visible}
        afterClose={handelAfterClose}
        onCancel={handelCancel}
        width={isMobile ? '100%' : isTablet ? '370px' : '370px'}
        footer={
          <Row justify='end' align='middle'>
            <Col>
              <CancelButton onClick={handelCancel} />
              <SaveButton onClick={handleOk} loading={loading} />
            </Col>
          </Row>
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
            label={
              <span>
                {t('Form.User_name')}
                <span className='star'>*</span>
              </span>
            }
            style={styles.margin}
            rules={[
              { required: true, message: `${t('Form.User_name_required')}` },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='password'
            style={styles.margin}
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
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
const styles = {
  cancel: { margin: '0px 8px' },
  margin: { margin: '4px' },
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
    color: `${Colors.gray}`,
    paddingTop: '8px',
    paddingInlineEnd: '24px',
  },
};

export default LoginToAnarPay;
