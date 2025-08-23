import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../ApiBaseUrl';
import { useTranslation } from 'react-i18next';
import { message, Button, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import { ActionMessage } from '../SelfComponents/TranslateComponents/ActionMessage';

function InActive(props) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [activeVisible, setActiveVisible] = useState(false);
  const [activeLoading, setActiveLoading] = useState(false);

  const { mutate: mutateInActive, isLoading } = useMutation(
    async (value) =>
      await axiosInstance
        .patch(`/staff_account/staff/${props.record.id}/`, value)
        .then((res) => {
          message.success(
            <ActionMessage
              name={`${props?.record?.first_name} ${props?.record?.last_name}`}
              message='Message.Inactive'
            />,
          );
          setActiveLoading(false);
        })
        .catch((error) => {
          setActiveLoading(false);
        }),
    {
      onSuccess: () => queryClient.invalidateQueries(`/staff_account/staff/`),
    },
  );
  let Inactive = false;
  const handelInActive = async () => {
    if (Inactive) {
      return;
    }
    Inactive = true;
    setActiveLoading(true);
    try {
      mutateInActive(
        { status: 'deactivate' },
        {
          onSuccess: () => {},
        },
      );

      Inactive = false;
    } catch (info) {
      Inactive = false;
    }
  };
  const onClickActive = () => {
    setActiveVisible(!activeVisible);
  };
  const cancel = () => {
    setActiveVisible(false);
  };
  return (
    <Popconfirm
      placement='topRight'
      title={t('Employees.Employee_inactive_message')}
      onConfirm={handelInActive}
      okText={t('Manage_users.Yes')}
      cancelText={t('Manage_users.No')}
      open={activeVisible}
      okButtonProps={{ loading: activeLoading }}
      onCancel={cancel}
    >
      <Button shape='round' className='num' onClick={onClickActive}>
        {t('Sales.Customers.Table.inactive')}
      </Button>
    </Popconfirm>
  );
}

export default connect(null)(InActive);
