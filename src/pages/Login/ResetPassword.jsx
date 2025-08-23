import React, { useLayoutEffect, useState } from 'react';
import { Form, Input, Button, message, Result, Typography, Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../ApiBaseUrl';
import { useMutation } from 'react-query';
import { Colors } from '../colors';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { Paragraph } = Typography;
export default function ResetPassword(props) {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(0);
  const checkIsTokenValid = async (value) => {
    await axiosInstance
      .post(`/user_account/reset_password/validate_token`, value)
      .then((res) => {
        setNotFound(res.status);
      });
  };
  const { mutate: mutateCheckIsTokenValid } = useMutation(checkIsTokenValid);

  const handelCheckToken = React.useCallback(async () => {
    try {
      mutateCheckIsTokenValid({ token: props.match.params.id });
    } catch (error) {
      message.error(`${error}`);
    }
  }, [mutateCheckIsTokenValid, props.match.params.id]);

  useLayoutEffect(() => {
    handelCheckToken();
  }, [handelCheckToken]);

  const resetPassword = async (value) => {
    await axiosInstance
      .post(`/user_account/reset_password/confirm`, value)
      .then(() => {
        navigate('/');
        message.error('Successfully change password');
        setTimeout(() => {
          setLoading(false);
        }, 200);
      })
      .catch((error) => {
        setLoading(false);

        if (error?.response.data?.username?.[0]) {
          message.error(`${t('Manage_users.User_name_server_message')}`);
        } else if (error?.response?.data?.email?.[0]) {
          message.error(`${t('Manage_users.Email_server_message')}`);
        } else if (error?.response?.data?.password?.[0]) {
          message.error(`${t('Manage_users.Password_server_message')}`);
        }
      });
  };

  const { mutate: mutateResetPassword } = useMutation(resetPassword);
  const onFinish = async (values) => {
    try {
      if (!reg.test(password) || !reg1.test(password) || !reg2.test(password)) {
        setErrorMessage(true);
        return;
      } else {
        setErrorMessage(false);
        setLoading(true);
        mutateResetPassword({
          password: values.password,
          token: props.match.params.id,
        });
      }
    } catch (error) {
      message.error(`${error}`);
    }
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const onBack = () => {
    navigate('/');
    setNotFound(0);
  };

  return (
    <div className='box-layout'>
      <div className='reset_box'>
        {window.navigator.onLine ? (
          <div>
            {notFound === 200 ? (
              <div>
                <h1 className='box-layout__title'>
                  {' '}
                  {t('Manage_users.Reset_password')}
                </h1>
                <Form hideRequiredMark layout='vertical' onFinish={onFinish}>
                  {errorMessage && (
                    <Alert
                      message={t('Manage_users.Password_validation_error')}
                      type='error'
                    />
                  )}
                  <Form.Item
                    label={
                      <span>
                        {t('Company.Form.Password')}
                        <span className='star'>*</span>
                      </span>
                    }
                    name='password'
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: `${t('Company.Form.Required_password')}`,
                      },
                    ]}
                  >
                    <Input.Password onChange={onChangePassword} />
                  </Form.Item>

                  <Form.Item
                    name='confirm'
                    label={
                      <span>
                        {t('Company.Form.Confirm_password')}
                        <span className='star'>*</span>
                      </span>
                    }
                    style={styles.margin}
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: `${t('Company.Form.Required_confirm')}`,
                      },
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            `${t('Company.Form.Confirm_match')}`,
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Paragraph>
                    {reg.test(password) ? (
                      <CheckOutlined className='list_tick' />
                    ) : (
                      <CloseOutlined style={styles.close} />
                    )}
                    &nbsp; {t('Manage_users.Password_validation_error1')}
                    <br />
                    {reg1.test(password) ? (
                      <CheckOutlined className='list_tick' />
                    ) : (
                      <CloseOutlined style={styles.close} />
                    )}
                    &nbsp; {t('Manage_users.Password_validation_error2')}
                    <br />
                    {reg2.test(password) ? (
                      <CheckOutlined className='list_tick' />
                    ) : (
                      <CloseOutlined style={styles.close} />
                    )}
                    &nbsp; {t('Manage_users.Password_validation_error4')} <br />
                  </Paragraph>
                  <Form.Item>
                    <Button
                      type='primary'
                      htmlType='submit'
                      shape='round'
                      className='num'
                      loading={loading}
                    >
                      {t('Manage_users.Confirm')}
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            ) : (
              <Result
                status='404'
                title='404'
                subTitle={t('Manage_users.Not_found_message')}
                extra={
                  <Button type='primary' onClick={onBack}>
                    {' '}
                    {t('Manage_users.Back_login')}
                  </Button>
                }
              />
            )}
          </div>
        ) : (
          <Result
            icon={
              <img
                src='/images/noInternet.png'
                alt={t('Internet.No_internet')}
                className='no_internet'
              />
            }
            title={t('Internet.No_internet_message')}
          />
        )}
      </div>
    </div>
  );
}
const reg = /(?=.*?[A-z]).{8,}/;
const reg1 = /(?=.*?[#?!@$%^&*-])/;
const reg2 = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/;
const styles = {
  close: { color: `${Colors.red}` },
  margin: { margin: '0px' },
};
