import React, { Fragment, useState } from 'react';

import EditWarehouse from './EditWarehouse';
import { Menu, Dropdown } from 'antd';
import { connect } from 'react-redux';
import ActionButton from '../SelfComponents/ActionButton';
import { ActivePopconfirm, RemovePopconfirm } from '../../components';
import { useActiveItem, useRemoveItem } from '../../Hooks';
import { WAREHOUSE_M } from '../../constants/permissions';

function Action(props) {
  const [visible, setVisible] = useState(false);
  const [activeVisible, setActiveVisible] = useState(false);

  //active warehouse item
  const {
    reset: activeReset,
    isLoading: activeLoading,
    handleActiveItem,
  } = useActiveItem({
    baseUrl: `${props.baseUrl}${props?.record?.id}/`,
    setVisible,
    recordName: props.record.name,
    handleUpdateItems: props.handleUpdateItems,
    type: 'active',
    setActiveVisible,
  });

  //inactive warehouse item
  const {
    reset: inactiveReset,
    isLoading: inactiveLoading,
    handleActiveItem: handleInactiveItem,
  } = useActiveItem({
    baseUrl: `${props.baseUrl}${props?.record?.id}/`,
    setVisible,
    recordName: props.record.name,
    handleUpdateItems: props.handleUpdateItems,
    type: 'deactivate',
    setActiveVisible,
  });

  //delete warehouse item
  const {
    reset,
    isLoading,
    handleDeleteItem,
    removeVisible,
    setRemoveVisible,
  } = useRemoveItem({
    baseUrl: `${props.baseUrl}${props?.record?.id}/`,
    setVisible,
    recordName: props?.record?.name,
    handleUpdateItems: props.handleUpdateItems,
  });

  const handleCancel = () => {
    setVisible(false);
    setRemoveVisible(false);
    setActiveVisible(false);
    reset();
    activeReset();
    inactiveReset();
  };

  const handleClickRemove = () => {
    setRemoveVisible(!removeVisible);
  };

  const handleClickInactive = () => {
    setRemoveVisible(false);
    setActiveVisible(!activeVisible);
  };

  const handleClickEdit = () => {
    setRemoveVisible(false);
    setActiveVisible(false);
  };

  const status = props?.record?.status;
  const menuItems = [
    !props?.record?.system_default && status === 'active' && {
      key: 'active-actions',
      label: (
        <Fragment>
          <ActivePopconfirm
            {...{
              itemName: props?.record?.name,
              visible: activeVisible,
              loading: status === 'active' ? inactiveLoading : activeLoading,
              onConfirm:
                status === 'active' ? handleInactiveItem : handleActiveItem,
              onCancel: handleCancel,
              onClick: handleClickInactive,
              type: status === 'active' ? 'deactivate' : 'active',
              permission: WAREHOUSE_M,
            }}
          />
          <RemovePopconfirm
            itemName={props?.record?.name}
            open={removeVisible}
            loading={isLoading}
            onConfirm={handleDeleteItem}
            onCancel={handleCancel}
            onClick={handleClickRemove}
            permission={WAREHOUSE_M}
          />
        </Fragment>
      ),
    },
    status === 'active' && {
      key: 'edit',
      label: (
        <EditWarehouse
          record={props.record}
          setVisible={setVisible}
          baseUrl={props.baseUrl}
          handleUpdateItems={props.handleUpdateItems}
          handleClickEdit={handleClickEdit}
        />
      ),
    },
  ].filter(Boolean);
  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };
  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['click']}
      onOpenChange={handleVisibleChange}
      open={visible}
      disabled={props.hasSelected}
    >
      <span
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!removeVisible && !activeVisible) {
            setVisible(true);
          }
        }}
      >
        <ActionButton
          onClick={handleVisibleChange}
          disabled={props.hasSelected}
        />
      </span>
    </Dropdown>
  );
}

export default connect(null)(Action);
