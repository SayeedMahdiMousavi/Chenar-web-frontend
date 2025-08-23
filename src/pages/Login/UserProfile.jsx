import React, { useState, useRef } from 'react';
import {
  Modal,
  Col,
  Row,
  Button,
  Avatar,
  Upload,
  Menu,
  Typography,
  Space,
  Skeleton,
  Image,
  Form,
  App,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Colors } from '../colors';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../ApiBaseUrl';
import CompressPhoto from '../CompressPhoto';
import { useTranslation } from 'react-i18next';
import EditName from './ProfileEdit/EditName';
import CheckPassword from './ProfileEdit/CheckPassword';
import { ModalDragTitle } from '../SelfComponents/ModalDragTitle';
import { DraggableCore } from 'react-draggable';
import { ActionMessage } from '../SelfComponents/TranslateComponents/ActionMessage';
import ImgCrop from 'antd-img-crop';
import { useGetUserInfo } from '../../Hooks';
import { USERS_LIST } from '../../constants/routes';

function UserProfile(props) {
  const modalRef = useRef(null);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  // const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [fileSize, setFileSize] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const { message } = App.useApp();

  //get user information
  const { data, isLoading } = useGetUserInfo();

  const handleVisibleChange = () => {
    setPreviewVisible(false);
  };

  const handleClickImage = () => {
    if (data?.photo) {
      setPreviewVisible(true);
    }
  };

  const showModal = () => {
    form.setFieldsValue({
      name: props?.record?.name,
      endDate: props?.record?.end_date,
      description: props?.record?.description,
    });
    props.setVisible(false);
    setIsShowModal({
      visible: true,
    });
  };

  const onCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };

  // const beforeUpload = async (file, fileList) => {
  //   const isLt2M = file.size / 1024 / 1024 < 6;
  //   setFileSize(isLt2M);

  //   const smallSize = await CompressPhoto(file, {
  //     quality: 1,
  //     width: 500,
  //     height: 550,
  //   });
  //   setFile(smallSize);
  // };

  // const handelChangeProfileImage = async (value) => {
  //   await axiosInstance
  //     .patch(`/user_account/users/${data?.username}/user_profile/`, value, {
  //       timeout: 0,
  //     })
  //     .then((res) => {
  //       message.success(
  //         <ActionMessage
  //           name={t("Profile.Profile_image")}
  //           message="Message.Update"
  //         />
  //       );
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       if (error?.response?.data?.photo) {
  //         message.error(`${error?.response?.data?.photo?.[0]}`);
  //       }
  //     });
  // };

  // const { mutate: mutateChangeProfileImage } = useMutation(
  //   handelChangeProfileImage,
  //   {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries(`/user_account/users/user_profile/`);
  //       queryClient.invalidateQueries(`${USERS_LIST}/sidebar/`);
  //     },
  //   }
  // );

  // const uploadImage = async () => {
  //   setLoading(true);
  //   if (!fileSize) {
  //     message.error(`${t("Profile.Upload_message")}`);
  //     setLoading(false);
  //   } else {
  //     try {
  //       const formData = new FormData();
  //       formData.append("photo", file, file.name);

  //       mutateChangeProfileImage(formData);
  //     } catch (error) {
  //       message.error(`${t("Profile.Upload_message")}`);
  //       setLoading(false);
  //     }
  //   }
  // };

  const uploadImage = async ({ file, onSuccess, onError }) => {
    try {
      setLoading(true);
      const compressed = await CompressPhoto(file, {
        quality: 1,
        width: 500,
        height: 550,
      });

      const fd = new FormData();
      fd.append('photo', compressed, compressed.name);

      // 4. Send with multipart header
      const response = await axiosInstance.patch(
        `/user_account/user_profile/${data.username}/`,
        fd,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 0,
        },
      );

      // 5. Notify both React‑Query and the Upload component
      queryClient.invalidateQueries(`/user_account/user_profile/`);
      queryClient.invalidateQueries(`${USERS_LIST}/sidebar/`);
      onSuccess(response.data);
      setLoading(false);
      setFileSize(0);
      message.success(
        <ActionMessage
          name={t('Profile.Profile_image')}
          message='Message.Update'
        />,
      );
    } catch (err) {
      onError(err);
      const msg = err.response?.data?.photo?.[0] || t('Profile.Upload_message');
      setLoading(false);
      message.error(msg);
    }
  };

  return (
    <div>
      <button className='num' onClick={showModal}>
        {t('Profile.1')}
      </button>

      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Profile.1')}
          />
        }
        modalRender={(modal) => (
          <DraggableCore disabled={disabled} nodeRef={modalRef}>
            <div ref={modalRef}>{modal}</div>
          </DraggableCore>
        )}
        centered
        open={isShowModal.visible}
        onCancel={onCancel}
        width={370}
        destroyOnClose
        styles={styles.body}
        footer={null}
      >
        <Form
          form={form}
          requiredMark={true}
          scrollToFirstError={true}
          layout='vertical'
        >
          <Row
            justify='center'
            className='profile_avatar'
            style={
              data?.user_theme?.type === 'dark'
                ? { background: '#1F1F1F' }
                : { background: '#f0f2f5' }
            }
          >
            <Col span={24} style={styles.textAlign}>
              <Avatar
                size={80}
                src={data?.photo}
                className='profile_avatar_image'
                style={{
                  backgroundColor: '#00a2ae',
                  verticalAlign: 'middle',
                  cursor: 'pointer',
                }}
                onClick={handleClickImage}
              >
                {data?.username?.[0]?.toUpperCase()}
                {data?.username?.[1]}
              </Avatar>
              <div className='hide-print-component'>
                <Image
                  width={200}
                  preview={{
                    src: data?.photo,
                    visible: previewVisible,
                    onVisibleChange: handleVisibleChange,
                  }}
                />
              </div>
            </Col>
            <Col span={24} style={styles.textAlign}>
              <ImgCrop
                rotate
                grid
                // aspect={1 / 1}
                modalTitle={t('Upload.Edit_image')}
                // minZoom={1}
                // fillColor="red"
                fillColor={
                  data?.user_theme?.type === 'dark' ? 'black' : 'white'
                }
                quality={0.6}
                modalCancel={t('Form.Cancel')}
                modalOk={t('Form.Save')}
              >
                <Upload
                  listType='picture'
                  name='file'
                  showUploadList={false}
                  customRequest={uploadImage}
                  // onChange={onChangeUpload}
                  accept='image/*'
                  // beforeUpload={beforeUpload}
                >
                  <Button type='primary' shape='round' loading={loading}>
                    {t('Profile.Set_profile_photo')}
                  </Button>
                </Upload>
              </ImgCrop>
            </Col>
          </Row>

          <Menu style={styles.menu} selectable={false} mode='inline'>
            <EditName name='name' data={data} loading={isLoading} />
            <Menu style={{ border: 'none' }} selectable={false} mode='inline'>
              <Menu.Item
                warnKey='1'
                className={
                  data?.user_theme?.type === 'dark'
                    ? 'profile_menu_hove_dark'
                    : 'profile_menu_hove'
                }
                style={styles.menuItem}
              >
                <ItemSkeleton isLoading={isLoading}>
                  <Space size={0}>
                    <UserOutlined style={styles.menuItemIconDark} />
                    <Typography.Text>
                      {data?.username}
                      <br />
                      <Typography.Text strong={true}>
                        {t('Form.User_name')}
                      </Typography.Text>
                    </Typography.Text>
                  </Space>
                </ItemSkeleton>
              </Menu.Item>
            </Menu>
            <CheckPassword data={data} loading={isLoading} />{' '}
            <EditName name='email' data={data} loading={isLoading} />
          </Menu>
        </Form>
      </Modal>
    </div>
  );
}

export const ItemSkeleton = (props) => (
  <Skeleton
    loading={props.isLoading}
    active
    avatar
    round={true}
    title={false}
    paragraph={{ width: '80%' }}
  >
    {' '}
    {props.children}{' '}
  </Skeleton>
);

const styles = {
  cancel: { margin: '0px 8px' },
  margin: { marginBottom: '4px' },
  body: { padding: '0px 0px 0px 0px', paddingInlineEnd: '1px' },
  menu: {
    border: 'none',
    paddingBottom: '15px',
    paddingLeft: '2px',
    paddingRight: '2px',
  },
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
    color: Colors.gray,
    paddingTop: '8px',
    paddingInlineEnd: '16px',
  },
  menuItemIconDark: {
    fontSize: '20px',
    paddingTop: '8px',
    color: Colors.gray,
    paddingInlineEnd: '24px',
  },
  textAlign: { textAlign: 'center' },
};

// eslint-disable-next-line no-func-assign
UserProfile = React.memo(UserProfile);
export default UserProfile;
