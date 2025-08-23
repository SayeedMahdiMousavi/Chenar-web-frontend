import React, { useState } from 'react';
import { Modal, Col, Row, Button } from 'antd';
import { useMediaQuery } from '../../MediaQurey';
import { useMutation } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import { Form, Input, message, Checkbox, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import Draggable from 'react-draggable';
import { ModalDragTitle } from '../../SelfComponents/ModalDragTitle';
import { Styles } from '../../styles';
import { ActionMessage } from '../../SelfComponents/TranslateComponents/ActionMessage';
import { manageErrors } from '../../../Functions';
import { CancelButton, PageNewButton, SaveButton } from '../../../components';
import { BACKUP_SETTINGS_M } from '../../../constants/permissions';

const AddOnlineDriveSettings = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });

  const [disabled, setDisabled] = useState(true);
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');
  const isBgTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');

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

  const handleAddOnlineDriveSettings = async (value) => {
    return await axiosInstance.post(`${props.baseUrl}`, value);
  };

  const {
    mutate: mutateAddOnlineDriveSettings,
    isLoading,
    reset,
  } = useMutation(handleAddOnlineDriveSettings, {
    onSuccess: (values) => {
      setIsShowModal({
        visible: false,
      });

      message.success(
        <ActionMessage name={values?.data?.platform} message='Message.Add' />,
      );
      props.handleUpdateItems();
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        const data = {
          platform: values.platform,
          access_token: values.accessToken,
          default: values.default,
        };
        mutateAddOnlineDriveSettings(data);
      })
      .catch((info) => {
        //
      });
  };

  const handleAfterClose = () => {
    form.resetFields();
    reset();
  };

  return (
    <div>
      <PageNewButton onClick={showModal} model={BACKUP_SETTINGS_M} />
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Company.Add_online_drive_settings')}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
        afterClose={handleAfterClose}
        destroyOnClose
        centered
        open={isShowModal.visible}
        onCancel={onCancel}
        style={Styles.modal(isMobile)}
        bodyStyle={Styles.modalBody(isMobile, isSubBase, isMiniTablet)}
        width={isMobile ? '100%' : isTablet ? 370 : isBgTablet ? 370 : 370}
        footer={
          <Row justify='end' align='middle'>
            <Col>
              <CancelButton onClick={onCancel} />
              <SaveButton onClick={handleOk} loading={isLoading} />
            </Col>
          </Row>
        }
      >
        <Form
          form={form}
          hideRequiredMark={true}
          scrollToFirstError={true}
          layout='vertical'
          initialValues={{ default: false }}
        >
          <Form.Item
            label={
              <span>
                {t('Company.Platform')}
                <span className='star'>*</span>
              </span>
            }
            name='platform'
            rules={[
              { required: true, message: `${t('Company.Platform_required')}` },
            ]}
          >
            <Select autoFocus>
              <Select.Option value='drop_box'>
                {t('Company.Drop_box')}
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={
              <span>
                {t('Company.Access_token')}
                <span className='star'>*</span>
              </span>
            }
            name='accessToken'
            rules={[
              {
                required: true,
                message: t('Company.Access_token_required'),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name='default' valuePropName='checked'>
            <Checkbox>{t('Company.Default')}</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddOnlineDriveSettings;
