import React, { useState } from 'react';
import { useMediaQuery } from '../../../MediaQurey';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Steps,
  message,
  Upload,
  Typography,
  Space,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../../../Hooks/useDarkMode';
import { handleClearLocalStorageLogout } from '../../../../Functions';
import { lessVars } from '../../../../theme/index';
import { CancelButton } from '../../../../components';
const { Step } = Steps;
const steps = [
  {
    title: 'First',
    content: 'First-content',
  },
  {
    title: 'Second',
    content: 'Second-content',
  },
];

const UploadBackup = (props) => {
  const queryClient = useQueryClient();
  const [mode, setMode] = useDarkMode();
  const { t } = useTranslation();
  const history = useNavigate();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [file, setFile] = useState({});
  const [fileList, setFileList] = useState([]);
  const [fileName, setFileName] = useState('');
  const [form] = Form.useForm();
  const [status, setStatus] = useState('');
  const [percent, setPercent] = useState(0);
  const [finish, setFinish] = useState(false);
  const isTabletBased = useMediaQuery('(max-width: 576px)');
  const isMobileBased = useMediaQuery('(max-width: 320px)');
  const isMiddleMobile = useMediaQuery('(max-width: 375px)');
  const showDrawer = () => {
    setVisible(true);
  };

  //steps
  const next = () => {
    const curren = current + 1;
    setCurrent(curren);
    setStatus('');
  };

  const prev = () => {
    const curren = current - 1;
    setCurrent(curren);
    setStatus('done');
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
      setVisible(true);

      // message.success(`${t("Company.Check_password_message")}`);
      // setStatus("done");
      setCurrent((prev) => {
        return prev + 1;
      });
    },
    onError: (error) => {
      if (error?.response?.data?.message) {
        message.error(`${error?.response?.data?.message?.[0]}`);
      }
    },
  });

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      mutateCheckPassword({
        username: values.username,
        password: values.password,
      });
    });
  };

  const onBeforeUpload = async (file) => {
    setFileName(file.name);

    // if (props?.fileList?.length > 1) {
    //   message.error(`${t("Upload.One_file_upload")}`);
    //   return;
    // } else {

    setFile(file);
    setFileList([file]);
    return false;
    // }
  };

  const handleRestoreBackup = async (value) =>
    await axiosInstance.post(`${props.baseUrl}restore_from_file/`, value, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 0,

      onUploadProgress: (progressEvent) => {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        setPercent(percentCompleted);
      },
    });

  const {
    mutate: mutateRestoreBackup,
    isLoading: restoreLoading,
    reset: restoreReset,
  } = useMutation(handleRestoreBackup, {
    onSuccess: (values) => {
      message.success(t('Company.Restore_completed'));
      if (mode !== 'light') {
        window.less.modifyVars(lessVars.light);
        setMode('light');
      }

      queryClient.clear();
      setFinish(true);
      handleClearLocalStorageLogout();

      history.push('/');
      queryClient.invalidateQueries(props.baseUrl);
    },
    onError: (error) => {
      setStatus('exception');
      setPercent(0);

      if (error?.response?.data?.file) {
        message.error(`${error?.response?.data?.file[0]}`);
      }
    },
  });

  const handleRestore = () => {
    try {
      const data = new FormData();
      data.append('file', file);
      setStatus('active');
      // setPercent(99.9);
      if (fileName !== '') {
        mutateRestoreBackup(data);
      } else {
        message.error(t('Company.Upload_backup_field_error_message'));
      }
    } catch (info) {
      message.error(info);
    }
  };

  const handleClose = () => {
    setVisible(false);
    form.resetFields();
    setStatus('');
    setPercent(0);
    setFile({});
    setFileName('');
    setCurrent(0);
    setFinish(false);
    reset();
    restoreReset();
  };

  return (
    <div>
      <div onClick={showDrawer}> {t('Upload.1')}</div>

      <Drawer
        maskClosable={false}
        mask={true}
        zIndex={100000}
        title={
          <Row align='middle' style={styles.nav(isTabletBased)}>
            <Col xl={7} lg={10} sm={11} xs={isMiddleMobile ? 24 : 18}>
              <h3>{t('Company.Upload_backup')}</h3>
            </Col>
            <Col
              xl={{ span: 1, offset: 14 }}
              lg={{ span: 2, offset: 10 }}
              sm={{ span: 2, offset: 8 }}
              xs={isMiddleMobile ? { span: 3, offset: 1 } : { span: 2 }}
            >
              <Row justify='space-around'>
                <Col span={11}></Col>
                <Col span={11}></Col>
              </Row>
            </Col>
          </Row>
        }
        height='100%'
        onClose={handleClose}
        open={visible}
        placement='top'
        bodyStyle={{ paddingBottom: 10 }}
        footer={
          <div className='import__footer'>
            <CancelButton onClick={handleClose} disabled={restoreLoading} />

            <Space si={8}>
              {current > 0 && (
                <Button onClick={() => prev()} disabled={restoreLoading}>
                  {t('Step.Previous')}
                </Button>
              )}
              {current < steps.length - 1 && (
                <Button
                  type='primary'
                  disabled={status !== 'done'}
                  onClick={next}
                >
                  {t('Step.Next')}
                </Button>
              )}
              {current === steps.length - 1 && !finish && (
                <Button
                  type='primary'
                  onClick={handleRestore}
                  loading={restoreLoading}
                >
                  {t('Company.Restore')}
                </Button>
              )}
              {finish && (
                <Button
                  type='primary'
                  onClick={handleClose}
                  disabled={restoreLoading}
                >
                  {t('Company.Finish')}
                </Button>
              )}
            </Space>
          </div>
        }
      >
        <div>
          <Steps
            current={current}
            type={isMobileBased ? 'navigation' : 'default'}
            responsive={false}
          >
            <Step title={t('Company.Check_password').toUpperCase()} />
            {/* <Step title={t("Step.Upload")} /> */}
            <Step title={t('Company.Restore').toUpperCase()} />
            {/* ))} */}
          </Steps>
          {current === 0 ? (
            <Row>
              <Col xxl={5} xl={7}>
                <Form
                  form={form}
                  hideRequiredMark={true}
                  scrollToFirstError={true}
                  style={styles.upload}
                  onFinish={handleOk}
                  layout='vertical'
                >
                  <Form.Item
                    name='username'
                    label={t('Form.User_name')}
                    style={styles.margin}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: `${t('Form.User_name_required')}`,
                      },
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
                        whitespace: true,
                        message: `${t('Company.Form.Required_password')}`,
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type='primary'
                      htmlType='submit'
                      shape='round'
                      loading={isLoading}
                    >
                      {t('Company.Check_password')}
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          ) : (
            <div>
              <h3 style={styles.upload}>{t('Upload.Select_Zip_file')}</h3>
              <Row gutter={[7]}>
                <Col xl={5} md={8} sm={8} xs={16}>
                  <Input value={fileName} readOnly={true} />
                </Col>
                <Col span={2}>
                  <Upload
                    // listType="text"
                    name='file'
                    maxCount={1}
                    accept='.psql'
                    showUploadList={false}
                    beforeUpload={onBeforeUpload}
                    fileList={fileList}
                  >
                    <Button type='primary' ghost disabled={restoreLoading}>
                      {t('Upload.Browse')}
                    </Button>
                  </Upload>
                </Col>
                <Col span={24}>
                  <Typography.Text strong={true}>
                    {restoreLoading ? percent + '%' : ''}
                  </Typography.Text>
                </Col>
              </Row>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
};

const styles = {
  nav: (isMobileBased) => ({ height: isMobileBased ? '7vh' : '5vh' }),
  upload: { marginTop: '4rem' },
  margin: { marginBottom: '8px' },
};

export default UploadBackup;
