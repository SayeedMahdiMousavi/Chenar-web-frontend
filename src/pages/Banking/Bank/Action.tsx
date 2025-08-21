import React, { useCallback, useState } from "react";
import { useQueryClient } from "react-query";
import EditBankAccount from "./EditBankAccount";
import { Menu, Dropdown } from "antd";
import { connect } from "react-redux";
import ActionButton from "../../SelfComponents/ActionButton";
import { RemovePopconfirm } from "../../../components";
import { useRemoveItem } from "../../../Hooks";
import { BANK_M } from "../../../constants/permissions";

interface IProps {
  record: any;
  hasSelected: boolean;
  baseUrl: string;
}
const Action: React.FC<IProps> = (props) => {
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);

  const handleUpdateItems = useCallback(() => {
    queryClient.invalidateQueries(props.baseUrl);
  }, [props.baseUrl, queryClient]);

  //delete bank item
  const {
    reset,
    isLoading,
    handleDeleteItem,
    removeVisible,
    setRemoveVisible,
  } = useRemoveItem({
    baseUrl: `${props.baseUrl}${props?.record?.id}/`,
    setVisible,
    recordName: props?.record?.account_name,
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
      {props?.record?.system_default === false && (
        <RemovePopconfirm
          itemName={props?.record?.account_name}
          open={removeVisible}
          loading={isLoading}
          onConfirm={handleDeleteItem}
          onCancel={handleCancel}
          onClick={handleClickRemove}
          permission={BANK_M}
        />
      )}

      <EditBankAccount
        record={props.record}
        setVisible={setVisible}
        baseUrl={props.baseUrl}
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
      disabled={props.hasSelected}
    >
      <ActionButton onClick={handleVisibleChange} />
    </Dropdown>
  );
};

export default connect(null)(Action);
