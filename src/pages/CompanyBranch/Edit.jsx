import React, { useState } from 'react';
import { Modal, Col, Row, Button } from 'antd';
import { useMediaQuery } from '../MediaQurey';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../ApiBaseUrl';
import { Form, Input, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ModalDragTitle } from '../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { Styles } from '../styles';
import { ActionMessage } from '../SelfComponents/TranslateComponents/ActionMessage';
import { trimString } from '../../Functions/TrimString';
import { manageErrors } from '../../Functions';
import { CancelButton, EditMenuItem, SaveButton } from '../../components';
import { BRANCH_M } from '../../constants/permissions';

const EditBranch = ({
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

  const handleEditBranch = async (value) => {
    return await axiosInstance.put(`${baseUrl}${record.id}/`, value);
  };

  const {
    mutate: mutateEditBranch,
    isLoading,
    reset,
  } = useMutation(handleEditBranch, {
    onSuccess: (value) => {
      setIsShowModal({
        visible: false,
      });
      message.success(
        <ActionMessage name={value?.data?.name} message='Message.Update' />,
      );
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
    form
      .validateFields()
      .then(async (values) => {
        const data = {
          name: trimString(values.name),
          responsible: trimString(values.responsible),
          address: trimString(values.address),
        };
        mutateEditBranch(data, {
          onSuccess: () => {},
        });
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
      <EditMenuItem {...rest} onClick={showModal} permission={BRANCH_M} />

      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Company_branch.Branch_information')}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
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
            style={styles.formItem}
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
            style={styles.formItem}
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
            style={styles.formItem}
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
const styles = {
  formItem: { marginBottom: '8px' },
};

export default EditBranch;
