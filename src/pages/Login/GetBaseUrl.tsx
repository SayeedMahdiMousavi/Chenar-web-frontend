import React, { Fragment, useState, useRef } from 'react';
import { Modal, Col, Row, Button, InputNumber } from 'antd';
import { useMediaQuery } from '../MediaQurey';
import { Form, Input, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ModalDragTitle } from '../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { Styles } from '../styles';
import { BASE_URL } from '../LocalStorageVariables';
import axiosInstance from '../ApiBaseUrl';
import { CancelButton, SaveButton } from '../../components';


const GetBaseUrl = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const isBgTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');

  const showModal = () => {
    if (localStorage.getItem(BASE_URL)) {
      const baseUrl = localStorage.getItem(BASE_URL);
      const splitBaseUrl = baseUrl?.split(':');
      form.setFieldsValue({
        base: `${splitBaseUrl?.[0]}:${splitBaseUrl?.[1]}`,
        //@ts-ignore
        port: parseInt(splitBaseUrl?.[2]),
      });
    } else {
      form.setFieldsValue({
        base: `http://172.16.2.218`,
        port: 80,
      });
    }

    setIsShowModal({
      visible: true,
    });
  };

  const onCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };
  //after close method
  const handelAfterClose = () => {
    form.resetFields();
    setLoading(false);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        localStorage.setItem(BASE_URL, `${values?.base}:${values?.port}`);
        axiosInstance.defaults.baseURL = `${values?.base}:${values?.port}/api/v1`;
        setIsShowModal({
          visible: false,
        });
        message.success('Successfully save base url');
      })
      .catch((info) => {});
  };

  return (
    <div>
      <a onClick={showModal}>Server config</a>
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title='Server config information'
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled} nodeRef={ref as React.RefObject<HTMLElement>}>
            <div ref={ref}>{modal}</div>
          </Draggable>
        )}
        centered
        open={isShowModal.visible}
        onCancel={onCancel}
        destroyOnClose
        afterClose={handelAfterClose}
        wrapClassName='warehouse_add_modal'
        style={Styles.modal(isMobile)}
        bodyStyle={Styles.modalBody(isMobile, isSubBase, isMiniTablet)}
        width={isMobile ? '100%' : isTablet ? 380 : isBgTablet ? 380 : 380}
        footer={
          <Fragment>
            <CancelButton onClick={onCancel} />
            <SaveButton onClick={handleOk} loading={loading} />
          </Fragment>
        }
      >
        <Form
          form={form}
          hideRequiredMark={true}
          scrollToFirstError={true}
          layout='vertical'
        >
          <Form.Item
            style={styles.formItem}
            label={
              <span>
                Base url
                <span className='star'>*</span>
              </span>
            }
            name='base'
            rules={[
              { required: true, message: `Base url is required !` },
              // { type: "url", message: `Base url is not a valid url` },
            ]}
          >
            <Input autoFocus />
          </Form.Item>
          <Form.Item
            name='port'
            style={styles.formItem}
            label={
              <span>
                Port
                <span className='star'>*</span>
              </span>
            }
            rules={[
              { required: true, message: `Port is required !` },
              { type: 'integer', message: `Port is not av valid integer` },
            ]}
          >
            <InputNumber className='num' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

interface IStyles {
  formItem: React.CSSProperties;
}

const styles: IStyles = {
  formItem: { marginBottom: '8px' },
};

export default GetBaseUrl;
