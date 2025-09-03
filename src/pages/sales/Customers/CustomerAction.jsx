import React, { Fragment, useCallback, useState } from 'react';
import { Menu, Dropdown } from 'antd';
import { useQueryClient } from 'react-query';
import { connect } from 'react-redux';
import ActionButton from '../../SelfComponents/ActionButton';
import { ActivePopconfirm, RemovePopconfirm } from '../../../components';
import { useActiveItem, useRemoveItem } from '../../../Hooks';
import { CUSTOMER_M } from '../../../constants/permissions';
import EditCustomer from './EditCustomer';
function CustomerAction(props) {
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);
  // const [removeCardLoading, setRemoveCardLoading] = useState(false);
  // const [removeCardVisible, setRemoveCardVisible] = useState(false);
  const [activeVisible, setActiveVisible] = useState(false);

  const handleUpdateItems = useCallback(() => {
    queryClient.invalidateQueries(props.baseUrl);
    queryClient.invalidateQueries(`${props.baseUrl}infinite/`);
  }, [props.baseUrl, queryClient]);

  //active customer item
  const {
    reset: activeReset,
    isLoading: activeLoading,
    handleActiveItem,
  } = useActiveItem({
    baseUrl: `${props.baseUrl}${props?.record?.id}/`,
    setVisible,
    recordName: props?.record?.full_name,
    handleUpdateItems: handleUpdateItems,
    type: 'active',
    setActiveVisible,
  });

  //inactive customer item
  const {
    reset: inactiveReset,
    isLoading: inactiveLoading,
    handleActiveItem: handleInactiveItem,
  } = useActiveItem({
    baseUrl: `${props.baseUrl}${props?.record?.id}/`,
    setVisible,
    recordName: props?.record?.full_name,
    handleUpdateItems: handleUpdateItems,
    type: 'deactivate',
    setActiveVisible,
  });

  //delete customer item
  const {
    reset,
    isLoading,
    handleDeleteItem,
    removeVisible,
    setRemoveVisible,
  } = useRemoveItem({
    baseUrl: `${props.baseUrl}${props?.record?.id}/`,
    setVisible,
    recordName: props?.record?.full_name,
    handleUpdateItems: handleUpdateItems,
  });

  // props.delete(props.record.id, e);
  // setVisible(false);
  // };
  // const { mutate: mutateDeleteCard,isLoading} = useMutation(
  //   async (id) =>
  //     await axiosInstance
  //       .delete(`${props.baseUrl}${id}/remove_discount_card/`)
  //       .then((res) => {
  //         setRemoveCardLoading(false);
  //         setRemoveCardVisible(false);
  //         message.success(
  //           <ActionMessage
  //             name={`${t("Sales.Customers.Discount.Customers_discount")} ${
  //               props.record?.first_name
  //             } ${props.record?.last_name} `}
  //             message="Message.Remove"
  //           />
  //         );

  //         setVisible(false);
  //       })
  //       .catch((error) => {
  //         setRemoveCardLoading(false);
  //
  //         message.error(`${error?.response?.data?.message}`);
  //       }),
  //   {
  //     onSuccess: () => queryClient.invalidateQueries(`${props.baseUrl}`),
  //   }
  // );
  // let oneRequestCard = false;
  // const handelDeleteCard = async (e) => {
  //   if (oneRequestCard) {
  //     return;
  //   }
  //   oneRequestCard = true;
  //   setRemoveCardLoading(true);
  //   try {
  //     mutateDeleteCard(props.record.id, {
  //       onSuccess: () => {},
  //     });

  //     oneRequestCard = false;
  //   } catch (info) {
  //
  //     oneRequestCard = false;
  //   }

  //   // props.delete(props.record.id, e);
  //   // setVisible(false);
  // };
  const handleCancel = () => {
    setVisible(false);
    setRemoveVisible(false);
    setActiveVisible(false);
    reset();
    activeReset();
    inactiveReset();
    // setRemoveCardVisible(false);
  };
  const handleClickRemove = () => {
    setRemoveVisible(!removeVisible);
    // setRemoveCardVisible(false);
    setActiveVisible(false);
  };
  const handleClickInactive = () => {
    setRemoveVisible(false);
    // setRemoveCardVisible(false);
    setActiveVisible(!activeVisible);
  };
  // const onClickRemoveCard = () => {
  //   setRemoveVisible(false);
  //   setRemoveCardVisible(!removeCardVisible);
  //   setActiveVisible(false);
  // };
  const handleClickEdit = useCallback(() => {
    setRemoveVisible(false);
    setActiveVisible(false);
  }, [setRemoveVisible]);

  const status = props?.record?.status;
  const attachmentName = props?.record?.attachment?.split('/')?.at(-1);
  const menuItems = [
    status === 'active' && props?.record?.system_default !== true && {
      key: 'remove',
      label: (
        <RemovePopconfirm
          itemName={props?.record?.full_name}
          open={removeVisible}
          loading={isLoading}
          onConfirm={handleDeleteItem}
          onCancel={handleCancel}
          onClick={handleClickRemove}
          permission={CUSTOMER_M}
        />
      ),
    },
    status === 'active' && {
      key: 'edit',
      label: (
        <EditCustomer
          record={props?.record}
          attachment={attachmentName}
          baseUrl={props.baseUrl}
          type='table'
          setVisible={setVisible}
          handleClickEdit={handleClickEdit}
        />
      ),
    },
    props?.record?.system_default !== true && {
      key: 'active',
      label: (
        <ActivePopconfirm
          {...{
            itemName: props?.record?.full_name,
            visible: activeVisible,
            loading: status === 'active' ? inactiveLoading : activeLoading,
            onConfirm:
              status === 'active' ? handleInactiveItem : handleActiveItem,
            onCancel: handleCancel,
            onClick: handleClickInactive,
            type: status === 'active' ? 'deactivate' : 'active',
            permission: CUSTOMER_M,
          }}
        />
      ),
    },
  ].filter(Boolean);
  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };
  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['click']}
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

export default connect(null)(CustomerAction);
