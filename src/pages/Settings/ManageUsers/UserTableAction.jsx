import React, { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import EditUser from './EditUser';
import { message, Dropdown } from 'antd';
import { connect } from 'react-redux';
import { ActionMessage } from '../../SelfComponents/TranslateComponents/ActionMessage';
import ActionButton from '../../SelfComponents/ActionButton';
import { ActivePopconfirm, RemovePopconfirm } from '../../../components';
import { useRemoveItem } from '../../../Hooks';
import { USERS_M } from '../../../constants/permissions';

function UserTableAction(props) {
  const queryClient = useQueryClient();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeVisible, setActiveVisible] = useState(false);
  const [activeLoading, setActiveLoading] = useState(false);

  const { mutate: mutateActive } = useMutation(
    async (value) =>
      await axiosInstance.patch(
        `${props.baseUrl}${props?.record?.username}/`,
        value,
      ),
    {
      onSuccess: () => {
        setActiveVisible(false);
        setActiveLoading(false);
        setDropdownOpen(false); // Close dropdown after success
        message.success(
          <ActionMessage
            name={props?.record?.username}
            message='Message.Active'
          />,
        );
        queryClient.invalidateQueries(props.baseUrl);
      },
      onError: () => {
        setActiveLoading(false);
        setActiveVisible(false);
        setDropdownOpen(false); // Close dropdown on error
      },
    },
  );

  const { mutate: mutateInactive } = useMutation(
    async (value) =>
      await axiosInstance.patch(
        `${props?.baseUrl}${props?.record?.username}/`,
        value,
      ),
    {
      onSuccess: () => {
        setActiveVisible(false);
        setActiveLoading(false);
        setDropdownOpen(false); // Close dropdown after success
        message.success(
          <ActionMessage
            name={props?.record?.username}
            message='Message.Inactive'
          />,
        );
        queryClient.invalidateQueries(props.baseUrl);
      },
      onError: () => {
        setActiveLoading(false);
        setActiveVisible(false);
        setDropdownOpen(false); // Close dropdown on error
      },
    },
  );

  const handleActiveItem = useCallback(() => {
    setActiveLoading(true);
    mutateActive({ is_active: true });
  }, [mutateActive]);

  const handleInactiveItem = useCallback(() => {
    setActiveLoading(true);
    mutateInactive({ is_active: false });
  }, [mutateInactive]);

  const handleUpdateItems = useCallback(() => {
    queryClient.invalidateQueries(props.baseUrl);
  }, [props.baseUrl, queryClient]);

  const {
    reset,
    isLoading,
    handleDeleteItem,
    removeVisible,
    setRemoveVisible,
  } = useRemoveItem({
    baseUrl: `${props.baseUrl}${props?.record?.username}/`,
    setVisible: setDropdownOpen,
    recordName: props?.record?.username,
    handleUpdateItems: handleUpdateItems,
  });

  const handleCancel = useCallback(
    (e) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      setRemoveVisible(false);
      setActiveVisible(false);
      reset();
      setDropdownOpen(false);
    },
    [reset, setRemoveVisible],
  );

  const handleClickRemove = useCallback((e) => {
    if (e) {
      e.stopPropagation();
    }
    setRemoveVisible(true);
  }, []);

  const handleClickActive = useCallback((e) => {
    if (e) {
      e.stopPropagation();
    }
    setActiveVisible(true);
  }, []);

  const handleClickEdit = useCallback((e) => {
    if (e) {
      e.stopPropagation();
    }
    // No need to set dropdownOpen here; EditUser will handle its own modal
  }, []);

  const handleDropdownVisibleChange = useCallback(
    (flag) => {
      // Only close dropdown if no popconfirm is open
      if (!flag && !removeVisible && !activeVisible) {
        setDropdownOpen(false);
      } else if (flag) {
        setDropdownOpen(true);
      }
    },
    [removeVisible, activeVisible],
  );

  const permits = props?.record?.permits?.map((item) => item?.id);
  const status = props?.record?.is_active;

  const getItems = () => {
    const items = [];

    if (props.record.is_active) {
      items.push({
        key: 'remove',
        label: (
          <RemovePopconfirm
            itemName={props?.record?.username}
            open={removeVisible}
            loading={isLoading}
            onConfirm={() => {
              handleDeleteItem();
              setRemoveVisible(false);
              setDropdownOpen(false); // Close dropdown after confirm
            }}
            onCancel={handleCancel}
            onClick={handleClickRemove}
            permission={USERS_M}
          />
        ),
      });
    }

    if (props.record.user_type !== 'admin') {
      items.push({
        key: 'active',
        label: (
          <ActivePopconfirm
            itemName={props?.record?.username}
            visible={activeVisible}
            loading={activeLoading}
            onConfirm={() => {
              status ? handleInactiveItem() : handleActiveItem();
              setActiveVisible(false);
            }}
            onCancel={handleCancel}
            onClick={handleClickActive}
            type={status ? 'deactivate' : 'active'}
            permission={USERS_M}
          />
        ),
      });
    }

    if (status) {
      items.push({
        key: 'edit',
        label: (
          <EditUser
            record={props.record}
            setVisible={setDropdownOpen}
            permits={permits}
            baseUrl={props.baseUrl}
            handleClickEdit={handleClickEdit}
          />
        ),
      });
    }

    return items;
  };

  return (
    <Dropdown
      menu={{ items: getItems() }}
      trigger={['click']}
      onOpenChange={handleDropdownVisibleChange}
      open={dropdownOpen}
      disabled={props?.record?.system_default === true}
      placement='bottomRight'
    >
      <span
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!removeVisible && !activeVisible) {
            setDropdownOpen(!dropdownOpen);
          }
        }}
      >
        <ActionButton
          disabled={
            props?.record?.system_default === true ||
            props?.selectedRowKeys?.length > 0
          }
        />
      </span>
    </Dropdown>
  );
}

export default connect(null)(UserTableAction);
