import React, { useCallback, useState } from "react";
import { useQueryClient } from "react-query";
import { Menu, Dropdown } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { ActivePopconfirm, RemovePopconfirm } from "../../../../components";
import { useActiveItem, useRemoveItem } from "../../../../Hooks";
import { PRODUCT_UNIT_M } from "../../../../constants/permissions";

function UnitAction(props) {
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);
  const [activeVisible, setActiveVisible] = useState(false);

  const handleUpdateItems = useCallback(() => {
    queryClient.invalidateQueries(props.baseUrl);
    queryClient.invalidateQueries(`${props.baseUrl}infinite/`);
  }, [props.baseUrl, queryClient]);

  //delete unit item
  const {
    reset,
    isLoading,
    handleDeleteItem,
    removeVisible,
    setRemoveVisible,
  } = useRemoveItem({
    baseUrl: `${props.baseUrl}${props.record.name}/`,
    setVisible,
    recordName: props.record.name,
    handleUpdateItems: handleUpdateItems,
  });

  //active unit item
  const {
    reset: activeReset,
    isLoading: activeLoading,
    handleActiveItem,
  } = useActiveItem({
    baseUrl: `${props.baseUrl}${props.record.name}/`,
    setVisible,
    recordName: props.record.name,
    handleUpdateItems: handleUpdateItems,
    type: "active",
    setActiveVisible,
  });

  //inactive unit item
  const {
    reset: inactiveReset,
    isLoading: inactiveLoading,
    handleActiveItem: handleInactiveItem,
  } = useActiveItem({
    baseUrl: `${props.baseUrl}${props.record.name}/`,
    setVisible,
    recordName: props.record.name,
    handleUpdateItems: handleUpdateItems,
    type: "deactivate",
    setActiveVisible,
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
    setActiveVisible((prev) => (prev ? !prev : prev));
  };

  const handleClickInactive = () => {
    setRemoveVisible((prev) => (prev ? !prev : prev));
    setActiveVisible(!activeVisible);
  };

  const status = props?.record?.status;
  const action = (
    <Menu>
      {status === "active" && (
        <RemovePopconfirm
          itemName={props?.record?.name}
          open={removeVisible}
          loading={isLoading}
          onConfirm={handleDeleteItem}
          onCancel={handleCancel}
          onClick={handleClickRemove}
          permission={PRODUCT_UNIT_M}
        />
      )}
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
          permission: PRODUCT_UNIT_M,
        }}
      />
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
      disabled={
        props.editingKey !== "" || props?.record?.system_default === true
      }
    >
      <a
        disabled={props.editingKey !== ""}
        className="ant-dropdown-link"
        href="#"
      >
        <CaretDownOutlined />
      </a>
    </Dropdown>
  );
}

export default connect(null)(UnitAction);
