import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Menu, Dropdown, message, Popconfirm } from 'antd';
import CheckPassword from './CheckPassword';
import ActionButton from '../../../SelfComponents/ActionButton';
import { RemovePopconfirm } from '../../../../components';
import { useGetCalender, useRemoveItem } from '../../../../Hooks';
import moment from 'moment';
import { changeGToJ } from '../../../../Functions/utcDate';
import { useMutation } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';
import { ActionMessage } from '../../../SelfComponents/TranslateComponents/ActionMessage';
import { BACKUP_M } from '../../../../constants/permissions';
import { checkPermissions } from '../../../../Functions';

const dateFormat = 'YYYY-MM-DD HH:mm a';
const datePFormat = 'jYYYY/jM/jD HH:mm a';
function TableAction(props) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);

  const {
    mutate: mutateUploadBackup,
    isLoading: uploadLoading,
    reset: uploadReset,
  } = useMutation(
    async (id) =>
      await axiosInstance.get(`${props.baseUrl}${id}/upload_to_dropbox`, {
        timeout: 0,
      }),
    {
      onSuccess: () => {
        message.success(
          <ActionMessage
            name={props?.record?.name}
            message='Upload.Upload_to_dropbox_success_message'
          />,
        );
        setUploadVisible(false);
        setVisible(false);
      },
      onError: (error) => {
        if (error?.response?.data) {
          message.error(error?.response?.data?.message);
        }
      },
    },
  );

  const handleUpload = () => {
    mutateUploadBackup(props?.record?.id);
  };

  //get current calender
  const userCalender = useGetCalender();
  const calenderCode = userCalender?.data?.user_calender?.code;

  const finalDate =
    props?.record?.created &&
    (calenderCode === 'gregory'
      ? moment(props?.record?.created)?.format(dateFormat)
      : changeGToJ(
          moment(props?.record?.created)?.format(dateFormat),
          dateFormat,
          datePFormat,
          'show',
        ));

  const handleUpdateItems = useCallback(() => {
    queryClient.invalidateQueries(props.baseUrl);
  }, [props.baseUrl, queryClient]);

  //delete opening account item
  const {
    reset,
    isLoading,
    handleDeleteItem,
    removeVisible,
    setRemoveVisible,
  } = useRemoveItem({
    baseUrl: `${props.baseUrl}${props?.record?.id}/`,
    setVisible,
    recordName: finalDate,
    handleUpdateItems: handleUpdateItems,
  });

  const handleCancel = () => {
    setVisible(false);
    setRemoveVisible(false);
    setUploadVisible(false);
    reset();
    uploadReset();
  };

  const handleClickRemove = () => {
    setRemoveVisible(!removeVisible);
  };
  const handelClickUpload = () => {
    setUploadVisible(!uploadVisible);
  };

  const handleClickEdit = () => {
    setRemoveVisible(false);
    setUploadVisible(false);
  };

  const action = (
    <Menu>
      <RemovePopconfirm
        itemName={finalDate}
        open={removeVisible}
        loading={isLoading}
        onConfirm={handleDeleteItem}
        onCancel={handleCancel}
        onClick={handleClickRemove}
        permission={BACKUP_M}
      />

      {checkPermissions(`upload_to_cloud_${BACKUP_M}`) && (
        <Menu.Item>
          <Popconfirm
            placement='topRight'
            open={uploadVisible}
            okButtonProps={{ loading: uploadLoading }}
            title={
              <ActionMessage
                name={finalDate}
                message='Upload.Upload_to_dropbox_message'
              />
            }
            onConfirm={handleUpload}
            okText={t('Manage_users.Yes')}
            cancelText={t('Manage_users.No')}
            onCancel={handleCancel}
          >
            <div onClick={handelClickUpload}>
              {t('Upload.Upload_to_dropbox')}
            </div>
          </Popconfirm>
        </Menu.Item>
      )}

      {/* {parseFloat(props?.record?.size) === 0 ? null : ( */}
      <Menu.Item onClick={handleClickEdit}>
        <a
          href={props?.record?.db_file_path}
          target='_blank'
          rel='noopener noreferrer'
        >
          {t('Upload.Download')}
        </a>
      </Menu.Item>
      <Menu.Item onClick={handleClickEdit}>
        <a
          href={props?.record?.media_file_path}
          target='_blank'
          rel='noopener noreferrer'
        >
          {t('Upload.Download_media')}
        </a>
      </Menu.Item>
      {/* )}
      {parseFloat(props?.record?.size) === 0 ? null : ( */}
      {checkPermissions(`restore_${BACKUP_M}`) && (
        <Menu.Item onClick={handleClickEdit}>
          <CheckPassword record={props.record} setVisible={setVisible} />
        </Menu.Item>
      )}
      {/* )} */}
    </Menu>
  );

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  return (
    <Dropdown
      overlay={action}
      trigger={['click']}
      onOpenChange={handleVisibleChange}
      open={visible}
    >
      <ActionButton
        onClick={handleVisibleChange}
        disabled={
          props?.record?.system_default === true ||
          props?.selectedRowKeys?.length > 0
            ? true
            : false
        }
      />
    </Dropdown>
  );
}

export default TableAction;
