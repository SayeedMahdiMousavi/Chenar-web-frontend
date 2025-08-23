import React, { memo, useState } from 'react';
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
import {
  CancelButton,
  EditMenuItem,
  PermissionsFormItem,
  SaveButton,
} from '../../components';
import { permissionsList, USER_ROLE_M } from '../../constants/permissions';
import { ROLES_LIST } from '../../constants/routes';

interface IRoleData {
  name: string;
  permissions: string[];
  id?: number;
}
interface IProps {
  name: string;
  permissions: string[];
  id?: number;
  setVisible: (value: boolean) => void;
  handleUpdateItems: () => void;
  handleClickEdit: () => void;
}

let EditRole: React.FC<IProps> = ({
  id,
  name,
  permissions,
  setVisible,
  handleUpdateItems,
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
    setVisible(false);
    handleClickEdit();
    form.setFieldsValue({
      name,
      permissions,
    });
    setIsShowModal({
      visible: true,
    });
  };

  const onCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };

  const handleEditRole = async (value: IRoleData) => {
    return await axiosInstance.put(`${ROLES_LIST}${id}/`, value);
  };

  const {
    mutate: mutateEditRole,
    isLoading,
    reset,
  } = useMutation(handleEditRole, {
    onSuccess: (value) => {
      setIsShowModal({
        visible: false,
      });
      message.success(
        <ActionMessage name={value?.data?.name} message='Message.Update' />,
      );

      handleUpdateItems();
      if (id === 106001) {
        queryClient.invalidateQueries(`${ROLES_LIST}default/`);
      }
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      const data: IRoleData = {
        name: trimString(values.name)!,
        permissions: values.permissions,
      };
      mutateEditRole(data);
    });
  };

  const handleAfterClose = () => {
    form.resetFields();
    reset();
  };

  return (
    <div>
      <EditMenuItem {...rest} onClick={showModal} permission={USER_ROLE_M} />

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
            name='name'
            rules={[{ required: true, message: t('Form.Name_required') }]}
          >
            <Input autoFocus />
          </Form.Item>
          <PermissionsFormItem
            treeData={permissionsList}
            form={form}
            label={t('Manage_users.Permissions')}
            rules={[
              {
                required: true,
                message: t('Manage_users.Permissions_required'),
              },
            ]}
          />
        </Form>
      </Modal>
    </div>
  );
};

EditRole = memo(EditRole);

export default EditRole;
