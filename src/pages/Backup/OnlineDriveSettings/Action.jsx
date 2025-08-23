import React, { useState } from 'react';

import EditOnlineDriveSettings from './Edit';
import { Menu, Dropdown } from 'antd';
import { connect } from 'react-redux';
import ActionButton from '../../SelfComponents/ActionButton';
import { RemovePopconfirm } from '../../../components';
import { useRemoveItem } from '../../../Hooks';
import { BACKUP_SETTINGS_M } from '../../../constants/permissions';

function Action(props) {
  const [visible, setVisible] = useState(false);

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

    reset();
  };

  const handleClickRemove = () => {
    setRemoveVisible(!removeVisible);
  };

  const handleClickEdit = () => {
    setRemoveVisible(false);
  };

  const action = (
    <Menu>
      <RemovePopconfirm
        itemName={props?.record?.id}
        open={removeVisible}
        loading={isLoading}
        onConfirm={handleDeleteItem}
        onCancel={handleCancel}
        onClick={handleClickRemove}
        permission={BACKUP_SETTINGS_M}
      />

      <EditOnlineDriveSettings
        record={props.record}
        setVisible={setVisible}
        baseUrl={props.baseUrl}
        handleUpdateItems={props.handleUpdateItems}
        handleClickEdit={handleClickEdit}
      />
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
      <ActionButton onClick={handleVisibleChange} />
    </Dropdown>
  );
}

export default connect(null)(Action);
