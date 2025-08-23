import React, { useCallback, useState } from 'react';
import { useQueryClient } from 'react-query';
import { Menu, Dropdown } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { RemovePopconfirm } from '../../../components';
import { useRemoveItem } from '../../../Hooks';
import { CASH_M } from '../../../constants/permissions';

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

  //delete cash item
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

  const action = (
    <Menu>
      <RemovePopconfirm
        itemName={props?.record?.account_name}
        openConfirm={removeVisible}
        loading={isLoading}
        onConfirm={handleDeleteItem}
        onCancel={handleCancel}
        onClick={handleClickRemove}
        permission={CASH_M}
      />
    </Menu>
  );

  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag);
  };

  return (
    <Dropdown
      overlay={action}
      trigger={['click']}
      onOpenChange={handleVisibleChange}
      open={visible}
      disabled={
        props.editingKey !== '' ||
        props?.record?.system_default === true ||
        props.hasSelected
      }
    >
      <a>
        <CaretDownOutlined />
      </a>
    </Dropdown>
  );
};

export default Action;
