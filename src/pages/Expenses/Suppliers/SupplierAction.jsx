import React, { Fragment, useCallback, useState } from 'react';
import { useQueryClient } from 'react-query';
import { Menu, Dropdown } from 'antd';
import ActionButton from '../../SelfComponents/ActionButton';
import { ActivePopconfirm, RemovePopconfirm } from '../../../components';
import { useActiveItem, useRemoveItem } from '../../../Hooks';
import { SUPPLIER_M } from '../../../constants/permissions';
import EditSupplier from './EditSupplier';

function SupplierAction(props) {
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);
  const [activeVisible, setActiveVisible] = useState(false);

  const handleUpdateItems = useCallback(() => {
    queryClient.invalidateQueries(props.baseUrl);
    queryClient.invalidateQueries(`${props.baseUrl}infinite/`);
  }, [props.baseUrl, queryClient]);

  //active supplier item
  const {
    reset: activeReset,
    isLoading: activeLoading,
    handleActiveItem,
  } = useActiveItem({
    baseUrl: `${props.baseUrl}${props?.record?.id}/`,
    setVisible,
    recordName: props?.record?.full_name,
    handleUpdateItems: handleUpdateItems,
    type: 'active',
    setActiveVisible,
  });

  //inactive supplier item
  const {
    reset: inactiveReset,
    isLoading: inactiveLoading,
    handleActiveItem: handleInactiveItem,
  } = useActiveItem({
    baseUrl: `${props.baseUrl}${props?.record?.id}/`,
    setVisible,
    recordName: props?.record?.full_name,
    handleUpdateItems: handleUpdateItems,
    type: 'deactivate',
    setActiveVisible,
  });

  //delete supplier item
  const {
    reset,
    isLoading,
    handleDeleteItem,
    removeVisible,
    setRemoveVisible,
  } = useRemoveItem({
    baseUrl: `${props.baseUrl}${props?.record?.id}/`,
    setVisible,
    recordName: props?.record?.full_name,
    handleUpdateItems: handleUpdateItems,
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
  const handleClickEdit = useCallback(() => {
    setRemoveVisible(false);
    setActiveVisible(false);
  }, [setRemoveVisible]);

  const status = props?.record?.status;
  const attachmentName = props?.record?.attachment?.split('/')?.at(-1);
  const action = (
    <Menu>
      {status === 'active' && props?.record?.system_default !== true && (
        <Fragment>
          <RemovePopconfirm
            itemName={props?.record?.full_name}
            open={removeVisible}
            loading={isLoading}
            onConfirm={handleDeleteItem}
            onCancel={handleCancel}
            onClick={handleClickRemove}
            permission={SUPPLIER_M}
          />
        </Fragment>
      )}

      {status === 'active' && (
        <EditSupplier
          record={props?.record}
          attachment={attachmentName}
          type='table'
          setVisible={setVisible}
          handleClickEdit={handleClickEdit}
        />
      )}
      {props?.record?.system_default !== true && (
        <ActivePopconfirm
          {...{
            itemName: props?.record?.full_name,
            visible: activeVisible,
            loading: status === 'active' ? inactiveLoading : activeLoading,
            onConfirm:
              status === 'active' ? handleInactiveItem : handleActiveItem,
            onCancel: handleCancel,
            onClick: handleClickInactive,
            type: status === 'active' ? 'deactivate' : 'active',
            permission: SUPPLIER_M,
          }}
        />
      )}
      {/* {status === "active" && (
        <Menu.Item onClick={onClickEdit}>
          {" "}
          {t("Expenses.Suppliers.Create_expense")}
        </Menu.Item>
      )}
      {status === "active" && (
        <Menu.Item onClick={onClickEdit}>
          {t("Expenses.Suppliers.Write_cheque")}
        </Menu.Item>
      )} */}
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
      disabled={props.hasSelected}
    >
      <ActionButton
        onClick={handleVisibleChange}
        disabled={props.hasSelected}
      />
    </Dropdown>
  );
}

export default SupplierAction;
