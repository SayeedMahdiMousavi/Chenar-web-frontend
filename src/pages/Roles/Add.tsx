import React, { memo, useRef, useState } from 'react';
import { Modal, Col, Row } from 'antd';
import { useMediaQuery } from '../MediaQurey';
import { useMutation } from 'react-query';
import axiosInstance from '../ApiBaseUrl';
import { Form, Input, message } from 'antd';
import { useTranslation } from 'react-i18next';
import Draggable, { DraggableCore } from 'react-draggable';
import { ModalDragTitle } from '../SelfComponents/ModalDragTitle';
import { Styles } from '../styles';
import { ActionMessage } from '../SelfComponents/TranslateComponents/ActionMessage';
import { trimString } from '../../Functions/TrimString';
import { manageErrors } from '../../Functions';
import { ROLES_LIST } from '../../constants/routes';
import {
  CancelButton,
  PageNewButton,
  PermissionsFormItem,
  SaveButton,
} from '../../components';
import { permissionsList, USER_ROLE_M } from '../../constants/permissions';
import { useQuery } from 'react-query';

interface IProps {
  handleUpdateItems: () => void;
}
let AddRole: React.FC<IProps> = (props) => {
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
  const [permissionsState, setPermissionsState] = useState<any[]>([]);

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

  const handleAddRole = async (value: any) => {
    return await axiosInstance.post(ROLES_LIST, value);
  };

  const {
    mutate: mutateAddRole,
    isLoading,
    reset,
  } = useMutation(handleAddRole, {
    onSuccess: (values) => {
      setIsShowModal({
        visible: false,
      });

      message.success(
        <ActionMessage name={values?.data?.name} message='Message.Add' />,
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
          name: trimString(values.name),
          permissions: values?.permissions,
        };
        mutateAddRole(data);
      })
      .catch((info) => {
        //
      });
  };

  const handleAfterClose = () => {
    form.resetFields();
    reset();
  };

  const handleGetPermissionFunction = async () => {
    const { data } = await axiosInstance.get(
      '/user_account/permit/?page=1&page_size=10000',
    );
    return data;
  };

  const permissionData = useQuery('', handleGetPermissionFunction);
  const modalRef = useRef<HTMLElement>(null as unknown as HTMLElement);

  if (
    permissionData?.data?.results?.length > 0 &&
    permissionsState?.length === 0
  ) {
    let createPermissions = [];
    let tempPermission: {
      codeName: number;
      title: string;
      key: string;
      id: number;
    }[] = [];
    for (let obj of permissionData?.data?.results) {
      if (tempPermission?.length <= 4) {
        let data: {
          codeName: number;
          title: string;
          key: string;
          id: number;
        } = {
          codeName: obj?.id,
          key: obj?.codename,
          title: obj?.name,
          id: obj.id,
        };
        tempPermission.push(data);
        if (tempPermission?.length === 4) {
          createPermissions.push({
            model: tempPermission?.[0]?.title,
            title: tempPermission?.[0]?.title,
            key: tempPermission?.[0]?.title,
            children: tempPermission,
          });
          tempPermission = [];
        }
      }
    }
    // const createPermissionList = permissionData?.data?.results?.map((item:any) =>{

    // })
    //
    setPermissionsState(createPermissions);
  }
  return (
    <div>
      <PageNewButton onClick={showModal} model={USER_ROLE_M} />

      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Roles_information')}
          />
        }
        modalRender={(modal) => (
          <DraggableCore disabled={disabled} nodeRef={modalRef}>
            <div
              ref={(el) => {
                if (el) modalRef.current = el;
              }}
            >
              {modal}
            </div>
          </DraggableCore>
        )}
        afterClose={handleAfterClose}
        destroyOnClose
        centered
        open={isShowModal.visible}
        onCancel={onCancel}
        wrapClassName='warehouse_add_modal'
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
            <Input autoFocus autoComplete='off' />
          </Form.Item>
          {
            //@ts-ignore
            // name.toUpperCases()
          }
          <PermissionsFormItem
            // treeData={permissionsList}
            treeData={permissionsState}
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

AddRole = memo(AddRole);

export default AddRole;
