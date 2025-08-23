import React, { useState } from 'react';
import { Modal, Col, Row, Button } from 'antd';
import { useMediaQuery } from '../../../MediaQurey';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';
import { Form, Input, Descriptions, Progress, message, Checkbox } from 'antd';
import { useTranslation } from 'react-i18next';
import { ModalDragTitle } from '../../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import ShowDate from '../../../SelfComponents/JalaliAntdComponents/ShowDate';
import {
  CancelButton,
  PageNewButton,
  SaveButton,
} from '../../../../components';
import { BACKUP_M } from '../../../../constants/permissions';
import { manageErrors } from '../../../../Functions';

const AddBackup = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });

  const [response, setResponse] = useState({});
  const [disabled, setDisabled] = useState(true);
  const isBgTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const [percent, setPercent] = useState(0);
  const [status, setStatus] = useState('normal');

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

  const AddBackup = async (value) =>
    await axiosInstance.post(
      `${props.baseUrl}`,
      value,
      {
        timeout: 0,

        // onUploadProgress: (progressEvent) => {
        //   var percentCompleted = Math.round(
        //     (progressEvent.loaded * 100) / progressEvent.total
        //   );
        //
        //   // setPercent(percentCompleted);
        // },
        // onDownloadProgress: function (progressEvent) {
        //   // Do whatever you want with the native progress event
        //   var percentCompleted = Math.round(
        //     (progressEvent.loaded * 100) / progressEvent.total
        //   );
        //   setPercent(percentCompleted);
        //
        // },
      },
      // {
      //   onUploadProgress: (progressEvent) => {
      //     var percentCompleted = Math.round(
      //       (progressEvent.loaded * 100) / progressEvent.total
      //     );
      //     setPercent(percentCompleted);
      //   },
      // }
    );

  const {
    mutate: mutateAddBackup,
    isLoading,
    reset,
  } = useMutation(AddBackup, {
    onSuccess: (values) => {
      setPercent(100);
      setStatus('success');
      setResponse(values?.data);
      queryClient.invalidateQueries(props.baseUrl);
    },
    onError: (error) => {
      setStatus('exception');
      manageErrors(error);
    },
  });

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      setStatus('active');
      setPercent(99.9);

      mutateAddBackup({
        note: values.note,
        media_backup: values.media_backup,
      });
    });
  };

  const handleAfterClose = () => {
    setPercent(0);
    setStatus('normal');
    form.resetFields();
    setResponse({});
    reset();
  };

  return (
    <div>
      <PageNewButton onClick={showModal} model={BACKUP_M} />
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Company.New_backup')}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
        destroyOnClose
        afterClose={handleAfterClose}
        centered
        open={isShowModal.visible}
        onCancel={onCancel}
        width={isMobile ? '100%' : isTablet ? 400 : isBgTablet ? 400 : 400}
        footer={
          <Row justify='end' align='middle'>
            <Col>
              <Button type='primary' ghost disabled={!response.db_file_path}>
                <a
                  href={`${response?.db_file_path}`}
                  target='blank'
                  rel='download'
                >
                  {t('Upload.Download')}
                </a>
              </Button>
              <CancelButton
                onClick={onCancel}
                disabled={response.db_file_path}
              />
              <SaveButton
                onClick={handleOk}
                disabled={response.db_file_path}
                loading={isLoading}
              />
            </Col>
          </Row>
        }
      >
        <Form
          form={form}
          hideRequiredMark={true}
          scrollToFirstError={true}
          layout='vertical'
          initialValues={{ media_backup: false }}
        >
          <Row justify='center'>
            <Col>
              <Progress
                type='circle'
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                percent={percent}
                status={status}
              />
            </Col>
          </Row>
          {response?.db_file_path ? (
            <Row>
              <Col>
                <Descriptions
                  column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 2, xs: 1 }}
                >
                  <Descriptions.Item label={t('Company.Created_by')}>
                    {response?.created_by}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('Company.File_size')}>
                    {response?.db_file_size_formated}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('Sales.Customers.Form.Date')}>
                    <ShowDate date={response?.created} />
                  </Descriptions.Item>
                  <Descriptions.Item label={t('Form.Notes')}>
                    {response?.note}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          ) : (
            <>
              <Form.Item
                name='note'
                label={t('Form.Description')}
                style={{ marginBottom: '8px' }}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                name='media_backup'
                valuePropName='checked'
                style={styles.formItem}
              >
                <Checkbox>{t('Company.Media_backup')}</Checkbox>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

const styles = {
  formItem: { marginBottom: '0px' },
};
export default AddBackup;
