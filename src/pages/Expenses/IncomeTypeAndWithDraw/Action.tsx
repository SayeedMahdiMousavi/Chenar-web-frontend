import React, { useCallback, useState } from "react";
import { useQueryClient } from "react-query";
import { Menu, Dropdown } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import { RemovePopconfirm } from "../../../components";
import { useRemoveItem } from "../../../Hooks";

interface IProps {
  record: any;
  editingKey: string;
  baseUrl: string;
  hasSelected: boolean;
  model: string;
}

const Action: React.FC<IProps> = (props) => {
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);

  const handleUpdateItems = useCallback(() => {
    queryClient.invalidateQueries(props.baseUrl);
  }, [props.baseUrl, queryClient]);

  //delete income item
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

  const action = (
    <Menu>
      <RemovePopconfirm
        itemName={props?.record?.name}
        open={removeVisible}
        loading={isLoading}
        onConfirm={handleDeleteItem}
        onCancel={handleCancel}
        onClick={handleClickRemove}
        permission={props?.model}
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
      disabled={
        props.editingKey !== "" ||
        props?.record?.system_default === true ||
        props.hasSelected
      }
    >
      <a className="ant-dropdown-link" href="#">
        <CaretDownOutlined />
      </a>
    </Dropdown>
  );
};

export default Action;
