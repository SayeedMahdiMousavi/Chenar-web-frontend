import React, { useCallback, useState } from "react";
import { useQueryClient } from "react-query";
import { Menu, Dropdown } from "antd";
import EditCurrency from "./EditCurrency";
import ActionButton from "../SelfComponents/ActionButton";
import { currencyRateBaseUrl } from "./Currency rate/CurrencyRate";
import { RemovePopconfirm } from "../../components";
import { useRemoveItem } from "../../Hooks";
import { CURRENCY_M } from "../../constants/permissions";

interface IProps {
  record: any;
}
const Action: React.FC<IProps> = (props) => {
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);

  const handleUpdateItems = useCallback(() => {
    queryClient.invalidateQueries(`/currency/`);
    queryClient.invalidateQueries(currencyRateBaseUrl);
  }, [queryClient]);

  //delete currency item
  const {
    reset,
    isLoading,
    handleDeleteItem,
    removeVisible,
    setRemoveVisible,
  } = useRemoveItem({
    baseUrl: `/currency/${props?.record?.symbol}/`,
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
        openConfirm={removeVisible}
        loading={isLoading}
        onConfirm={handleDeleteItem}
        onCancel={handleCancel}
        onClick={handleClickRemove}
        permission={CURRENCY_M}
      />

      <EditCurrency
        record={props.record}
        setVisible={setVisible}
        handleClickEdit={handleClickEdit}
      />
    </Menu>
  );

  const handleVisibleChange = (flag: any) => {
    setVisible(flag);
  };

  return (
    <Dropdown
      overlay={action}
      trigger={["click"]}
      onOpenChange={handleVisibleChange}
      open={visible}
      disabled={props?.record?.system_default === true}
    >
      <ActionButton
        onClick={handleVisibleChange}
        disabled={props?.record?.system_default === true ? true : false}
      />
    </Dropdown>
  );
};

export default Action;
