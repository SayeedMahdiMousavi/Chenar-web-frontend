import React, { useCallback, useState } from 'react';
import { Dropdown } from 'antd';
import { connect } from 'react-redux';
import { useQueryClient } from 'react-query';
import EditPOSDesignInvoice from './POSInvoice/Edit';
import { RemovePopconfirm } from '../../components';
import { useRemoveItem } from '../../Hooks';
import { CUSTOM_FORM_STYLE_M } from '../../constants/permissions';
import { checkPermissions } from '../../Functions';
import { Button } from 'antd';
import { DotsIcon } from '../../icons';
import { Colors } from '../colors';

function Action(props) {
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);

  const handleUpdateItems = useCallback(() => {
    queryClient.invalidateQueries(props.baseUrl);
  }, [props.baseUrl, queryClient]);

  // Delete opening account item
  const {
    reset,
    isLoading,
    handleDeleteItem,
    removeVisible,
    setRemoveVisible,
  } = useRemoveItem({
    baseUrl: `${props.baseUrl}${props?.record?.id}/`,
    setVisible,
    recordName: props?.record?.template_name_fa,
    handleUpdateItems: handleUpdateItems,
  });

  const handleCancel = () => {
    setRemoveVisible(false);
    handleVisibleChange(false);
    reset();
  };

  const handleClickEdit = () => {
    setRemoveVisible(false);
  };

  const handleClickRemove = () => {
    setRemoveVisible(!removeVisible);
  };

  // Define menu items using the `items` prop
  const menuItems = [
    {
      key: 'remove',
      label: (
        <RemovePopconfirm
          itemName={props?.record?.template_name_fa}
          open={removeVisible}
          loading={isLoading}
          onConfirm={handleDeleteItem}
          onCancel={handleCancel}
          onClick={handleClickRemove}
          permission={CUSTOM_FORM_STYLE_M}
        />
      ),
    },
    checkPermissions(`change_${CUSTOM_FORM_STYLE_M}`) && {
      key: 'edit',
      label: (
        <EditPOSDesignInvoice
          record={props?.record}
          setVisible={setVisible}
          baseUrl={props?.baseUrl}
        />
      ),
      onClick: handleClickEdit,
    },
  ].filter(Boolean);

  const handleVisibleChange = (flag) => {
    if (!removeVisible) {
      setVisible(true);
    }
    if (removeVisible) {
      setRemoveVisible(false);
    }
    setVisible(true);
  };

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['click']}
      onOpenChange={handleVisibleChange}
      open={visible}
      disabled={props?.record?.system_default}
    >
      <Button
        type='text'
        size='small'
        onClick={handleVisibleChange}
        icon={
          <DotsIcon
            style={props.disabled ? styles.actionButton1 : styles.actionButton}
            className='action-button'
          />
        }
        disabled={props?.record?.system_default}
      />
    </Dropdown>
  );
}

const styles = {
  actionButton: { fontSize: '20px', color: Colors.primaryColor },
  actionButton1: { fontSize: '20px', color: 'gray' },
};

export default connect(null)(Action);
