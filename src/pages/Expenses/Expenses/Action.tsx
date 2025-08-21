import React, { useCallback, useState } from "react";
import { useQueryClient } from "react-query";
import { Menu, Dropdown } from "antd";
import EditExpense from "./EditExpense";
import ActionButton from "../../SelfComponents/ActionButton";
import { RemovePopconfirm } from "../../../components";
import { useRemoveItem } from "../../../Hooks";
import { EXPENSE_M } from "../../../constants/permissions";

interface IProps {
  record: any;
  editingKey: string;
  hasSelected: boolean;
  baseUrl: string;
}

const Action: React.FC<IProps> = (props) => {
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);

  const handleUpdateItems = useCallback(() => {
    queryClient.invalidateQueries(props.baseUrl);
  }, [props.baseUrl, queryClient]);

  //delete expense item
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
    handleUpdateItems: handleUpdateItems,
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
        itemName={props?.record?.name}
        open={removeVisible}
        loading={isLoading}
        onConfirm={handleDeleteItem}
        onCancel={handleCancel}
        onClick={handleClickRemove}
        permission={EXPENSE_M}
      />

      <EditExpense
        record={props.record}
        setVisible={setVisible}
        baseUrl={props?.baseUrl}
        handleClickEdit={handleClickEdit}
      />
    </Menu>
  );

  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag);
  };

  return (
    <Dropdown
      overlay={action}
      trigger={["click"]}
      onOpenChange={handleVisibleChange}
      open={visible}
      disabled={props?.record?.system_default === true || props.hasSelected}
    >
      <ActionButton
        onClick={handleVisibleChange}
        disabled={props?.record?.system_default === true || props.hasSelected}
      />
    </Dropdown>
  );
};

export default Action;
