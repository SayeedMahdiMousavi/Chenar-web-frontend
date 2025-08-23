import React, { useState } from 'react';
import EditOpenAccount from './EditOpenAccount';
import { Menu, Dropdown } from 'antd';
import ActionButton from '../../SelfComponents/ActionButton';
import { RemovePopconfirm } from '../../../components';
import { useRemoveItem } from '../../../Hooks';
import { useTranslation } from 'react-i18next';
import { OPINING_ACCOUNT_M } from '../../../constants/permissions';

interface IProps {
  record: any;
  baseUrl: string;
  hasSelected: boolean;
  handleUpdateItems: () => void;
}
const Action: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  //delete opening account item
  const {
    reset,
    isLoading,
    handleDeleteItem,
    removeVisible,
    setRemoveVisible,
  } = useRemoveItem({
    baseUrl: `${props.baseUrl}${props?.record?.id}/`,
    setVisible,
    recordName: props?.record?.account?.name,
    handleUpdateItems: props?.handleUpdateItems,
    removeMessage: t('Message.Transaction_remove_message'),
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
        itemName={t(
          'Sales.All_sales.Purchase_and_sales.Transaction',
        ).toLocaleLowerCase()}
        openConfirm={removeVisible}
        loading={isLoading}
        onConfirm={handleDeleteItem}
        onCancel={handleCancel}
        onClick={handleClickRemove}
        permission={OPINING_ACCOUNT_M}
      />

      <EditOpenAccount
        baseUrl={props.baseUrl}
        record={props.record}
        setVisible={setVisible}
        handleClickEdit={handleClickEdit}
        handleUpdateItems={props?.handleUpdateItems}
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
      disabled={props?.record?.account?.id === 'CCA-301' || props?.hasSelected}
    >
      <ActionButton
        onClick={handleVisibleChange}
        disabled={props?.record?.system_default || props?.hasSelected}
      />
    </Dropdown>
  );
};

export default Action;
