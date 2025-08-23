import React, { useCallback, useState } from 'react';
import { Menu, Dropdown } from 'antd';
import ActionButton from '../SelfComponents/ActionButton';
import { RemovePopconfirm } from '../../components';
import { useRemoveItem } from '../../Hooks';
import EditRole from './Edit';
import { ROLES_LIST } from '../../constants/routes';
import { USER_ROLE_M } from '../../constants/permissions';

interface IProps {
  record: {
    name: string;
    permissions: string[];
    id?: number;
    system_default: boolean;
  };
  handleUpdateItems: () => void;
}
const RoleTableAction = (props: IProps) => {
  const [visible, setVisible] = useState(false);

  //delete role item
  const {
    reset,
    isLoading,
    handleDeleteItem,
    removeVisible,
    setRemoveVisible,
  } = useRemoveItem({
    baseUrl: `${ROLES_LIST}${props?.record?.id}/`,
    setVisible,
    recordName: props?.record?.name,
    handleUpdateItems: props?.handleUpdateItems,
  });

  const handleCancel = () => {
    setVisible(false);
    setRemoveVisible(false);
    reset();
  };
  const handleClickRemove = () => {
    setRemoveVisible(!removeVisible);
  };

  const handleClickEdit = useCallback(() => {
    setRemoveVisible(false);
    setVisible(false);
    setRemoveVisible(false);
  }, []);

  // const action = (
  //   <Menu>
  //     {/* {props?.system_default === false && ( */}

  //     <RemovePopconfirm
  //       itemName={props?.name}
  //       openConfirm={removeVisible}
  //       loading={isLoading}
  //       onConfirm={handleDeleteItem}
  //       onCancel={handleCancel}
  //       onClick={handleClickRemove}
  //       permission={USER_ROLE_M}
  //     />

  //     {/* )} */}

  //     <EditRole
  //       {...{
  //         ...props,
  //         setVisible,
  //         handleClickEdit,
  //       }}
  //     />
  //   </Menu>
  // );

  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag);
  };

  const getItems = () => {
    return [
      {
        key: 'remove',
        label: (
          <RemovePopconfirm
            itemName={props?.record?.name}
            openConfirm={removeVisible}
            loading={isLoading}
            onCancel={handleCancel}
            onConfirm={() => {
              handleDeleteItem();
              setRemoveVisible(false);
              setVisible(false);
            }}
            onClick={handleClickRemove}
            permission={USER_ROLE_M}
          />
        ),
      },
      {
        key: 'edit',
        label: (
          <EditRole
            handleUpdateItems={props?.handleUpdateItems}
            {...{
              ...props?.record,
              setVisible,
              handleClickEdit,
            }}
          />
        ),
      },
    ];
  };

  return (
    <Dropdown
      menu={{ items: getItems() }}
      trigger={['click']}
      onOpenChange={handleVisibleChange}
      open={visible}
      placement='bottomRight'
      disabled={props?.record?.system_default === true}
    >
      <span
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!removeVisible) {
            setVisible(!visible);
          }
        }}
      >
        <ActionButton onClick={handleVisibleChange} />
      </span>
    </Dropdown>
  );
};

export default RoleTableAction;
