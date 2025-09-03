import React, { useState, useRef } from 'react';
import { Modal, Col, Row, Button } from 'antd';
import { useMediaQuery } from '../MediaQurey';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../ApiBaseUrl';
import { Form, Input } from 'antd';
// import { useDatabase } from "@nozbe/watermelondb/hooks";
// import withObservables from "@nozbe/with-observables";
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
import { useTranslation } from 'react-i18next';
import { ModalDragTitle } from '../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { Styles } from '../styles';
import { trimString } from '../../Functions/TrimString';
import { manageErrors, updateMessage } from '../../Functions';
import { CancelButton, EditMenuItem, SaveButton } from '../../components';
import { WAREHOUSE_M } from '../../constants/permissions';

const EditWarehouse = ({
  setVisible,
  record,
  handleUpdateItems,
  baseUrl,
  handleClickEdit,
  ...rest
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const ref = useRef(null);
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [disabled, setDisabled] = useState(true);
  const isBgTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');

  const showModal = () => {
    handleClickEdit();
    form.setFieldsValue({
      name: record?.name,
      responsible: record?.responsible,
      address: record?.address,
    });
    setIsShowModal({
      visible: true,
    });
    setVisible(false);
  };

  const onCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };

  const handleEditWarehouse = async (value) =>
    await axiosInstance.put(`${baseUrl}${record.id}/`, value);

  const {
    mutate: mutateEditWarehouse,
    isLoading,
    reset,
  } = useMutation(handleEditWarehouse, {
    onSuccess: (value) => {
      setIsShowModal({
        visible: false,
      });
      updateMessage(value?.data?.name);

      handleUpdateItems();
      if (record?.id === 106001) {
        queryClient.invalidateQueries(`${baseUrl}default/`);
      }
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      const data = {
        name: trimString(values.name),
        responsible: trimString(values.responsible),
        address: trimString(values.address),
      };
      mutateEditWarehouse(data);
    });
  };

  const handleAfterClose = () => {
    form.resetFields();
    reset();
  };

  return (
    <div>
      <EditMenuItem {...rest} onClick={showModal} permission={WAREHOUSE_M} />

      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Warehouse.Add_warehouse')}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled} nodeRef={ref}>
            <div ref={ref}>{modal}</div>
          </Draggable>
        )}
        centered
        destroyOnClose
        afterClose={handleAfterClose}
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
        >
          <Form.Item
            label={
              <span>
                {t('Form.Name')}
                <span className='star'>*</span>
              </span>
            }
            name='name'
            rules={[{ required: true, message: `${t('Form.Name_required')}` }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <span>
                {t('Warehouse.Responsible')}
                <span className='star'>*</span>
              </span>
            }
            name='responsible'
            rules={[
              {
                required: true,
                message: `${t('Warehouse.Required_responsible')}`,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <span>
                {t('Form.Address')}
                <span className='star'>*</span>
              </span>
            }
            name='address'
            rules={[
              { required: true, message: `${t('Form.Required_address')}` },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EditWarehouse;
