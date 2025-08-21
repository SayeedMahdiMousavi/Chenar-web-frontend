import React, { useState, Fragment } from "react";
import EditBranch from "./Edit";
import { Menu, Dropdown } from "antd";
import { connect } from "react-redux";
import ActionButton from "../SelfComponents/ActionButton";
import { BRANCH_M } from "../../constants/permissions";
import { useActiveItem, useRemoveItem } from "../../Hooks";
import { ActivePopconfirm, RemovePopconfirm } from "../../components";

function Action(props) {
  const [visible, setVisible] = useState(false);
  const [activeVisible, setActiveVisible] = useState(false);

  //active branch item
  const {
    reset: activeReset,
    isLoading: activeLoading,
    handleActiveItem,
  } = useActiveItem({
    baseUrl: `${props.baseUrl}${props?.record?.id}/`,
    setVisible,
    recordName: props.record.name,
    handleUpdateItems: props.handleUpdateItems,
    type: "active",
    setActiveVisible,
  });

  //inactive branch item
  const {
    reset: inactiveReset,
    isLoading: inactiveLoading,
    handleActiveItem: handleInactiveItem,
  } = useActiveItem({
    baseUrl: `${props.baseUrl}${props?.record?.id}/`,
    setVisible,
    recordName: props.record.name,
    handleUpdateItems: props.handleUpdateItems,
    type: "deactivate",
    setActiveVisible,
  });

  //delete branch item
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
  const action = (
    <Menu>
      {!props?.record?.system_default && status === "active" && (
        <Fragment>
          <ActivePopconfirm
            {...{
              itemName: props?.record?.name,
              visible: activeVisible,
              loading: status === "active" ? inactiveLoading : activeLoading,
              onConfirm:
                status === "active" ? handleInactiveItem : handleActiveItem,
              onCancel: handleCancel,
              onClick: handleClickInactive,
              type: status === "active" ? "deactivate" : "active",
              permission: BRANCH_M,
            }}
          />
          <RemovePopconfirm
            itemName={props?.record?.name}
            open={removeVisible}
            loading={isLoading}
            onConfirm={handleDeleteItem}
            onCancel={handleCancel}
            onClick={handleClickRemove}
            permission={BRANCH_M}
          />
        </Fragment>
      )}
      {status === "active" && (
        <EditBranch
          record={props.record}
          setVisible={setVisible}
          baseUrl={props.baseUrl}
          handleUpdateItems={props.handleUpdateItems}
          handleClickEdit={handleClickEdit}
        />
      )}
    </Menu>
  );

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  return (
    <Dropdown
      overlay={action}
      trigger={["click"]}
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

export default connect(null)(Action);
