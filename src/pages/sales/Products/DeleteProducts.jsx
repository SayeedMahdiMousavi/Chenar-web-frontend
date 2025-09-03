import React, { Fragment, useCallback, useState } from 'react';
import EditProduct from './EditProduct';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import { message, Menu, Dropdown, Popconfirm } from 'antd';
// import Edit from "./services/Edit";
import EditDefaultUnit from './EditDefaultUnit';
import EditUnitConversion from './EditUnitConversion';
import { ActionMessage } from '../../SelfComponents/TranslateComponents/ActionMessage';
import ActionButton from '../../SelfComponents/ActionButton';
import PrintBarcode from './PrintSections/PrintBarcode';
import ProductVipPercent from './ProductVipPercent';
import EditMultipleBarcode from './MultipleBarcode/EditMultipleBarcode';
import AddUnitsToProductItem from './AddUnitsToProductItem';
import { ActivePopconfirm, RemovePopconfirm } from '../../../components';
import { useActiveItem, useRemoveItem } from '../../../Hooks';
import { PRODUCT_M } from '../../../constants/permissions';
import { checkPermissions } from '../../../Functions';
import ProductView from './ProductView';

function TableAction(props) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [removeVipLoading, setRemoveVipLoading] = useState(false);
  const [removeVipVisible, setRemoveVipVisible] = useState(false);
  const [activeVisible, setActiveVisible] = useState(false);

  //active product item
  const {
    reset: activeReset,
    isLoading: activeLoading,
    handleActiveItem,
  } = useActiveItem({
    baseUrl: `${props.baseUrl}${props?.record?.id}/`,
    setVisible,
    recordName: props.record.name,
    handleUpdateItems: props?.handleUpdateItems,
    type: 'active',
    setActiveVisible,
  });

  //inactive product item
  const {
    reset: inactiveReset,
    isLoading: inactiveLoading,
    handleActiveItem: handleInactiveItem,
  } = useActiveItem({
    baseUrl: `${props.baseUrl}${props?.record?.id}/`,
    setVisible,
    recordName: props.record.name,
    handleUpdateItems: props?.handleUpdateItems,
    type: 'deactivate',
    setActiveVisible,
  });

  //delete product item
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
    handleUpdateItems: props?.handleUpdateItems,
  });

  const handleSuccessEditVip = () => {
    queryClient.invalidateQueries(props.baseUrl);
  };

  const { mutate: mutateDeleteVipPercent } = useMutation(
    async (id) =>
      await axiosInstance
        .delete(`/product/price/vip/${id}/`)
        .then((res) => {
          setRemoveVipLoading(false);
          setRemoveVipVisible(false);

          message.success(
            <ActionMessage
              name={props.record?.name}
              message='Sales.Product_and_services.Form.Vip_remove_success_message'
            />,
          );
          setVisible(false);
        })
        .catch((error) => {
          setRemoveVipLoading(false);

          message.error(`${error?.response?.data?.data?.message}`);
        }),
    {
      onSuccess: handleSuccessEditVip,
    },
  );
  let removeVip = false;

  const handelDeleteVipPercent = async () => {
    if (removeVip) {
      return;
    }
    removeVip = true;
    setRemoveVipLoading(true);
    setRemoveVipVisible(true);
    try {
      mutateDeleteVipPercent(props.record.id, {
        onSuccess: () => {},
      });

      removeVip = false;
    } catch (info) {
      removeVip = false;
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setRemoveVisible(false);
    setActiveVisible(false);
    setRemoveVipVisible(false);
    reset();
    activeReset();
    inactiveReset();
  };

  const handleClickRemove = () => {
    setRemoveVisible(!removeVisible);
    setActiveVisible(false);
    setRemoveVipVisible(false);
  };
  const handelClickVipRemove = () => {
    setRemoveVipVisible(!removeVipVisible);
    setRemoveVisible(false);
    setActiveVisible(false);
  };
  const handleClickInactive = () => {
    setRemoveVisible(false);
    setActiveVisible(!activeVisible);
    setRemoveVipVisible(false);
  };
  const handleClickEdit = () => {
    setRemoveVisible(false);
    setActiveVisible(false);
    setRemoveVipVisible(false);
    //
  };

  const status = props?.record?.status;

  const getItems = () => {
    const items = [];
  
    // View Product
    items.push({
      key: 'view',
      label: (
        <ProductView record={props?.record} setDropDownVisible={setVisible} />
      ),
      onClick: handleClickEdit,
    });
  
    // Remove Product
    if (status === 'active') {
      items.push({
        key: 'remove',
        label: (
          <RemovePopconfirm
            itemName={props?.record?.name}
            open={removeVisible}
            loading={isLoading}
            onConfirm={handleDeleteItem}
            onCancel={handleCancel}
            onClick={handleClickRemove}
            permission={PRODUCT_M}
          />
        ),
      });
    }
  
    // Edit Product, Add Units, Edit Multiple Barcode
    if (
      status === 'active' &&
      checkPermissions(`change_${PRODUCT_M}`)
    ) {
      items.push(
        {
          key: 'edit',
          label: (
            <EditProduct
              dropVisible={setVisible}
              edit={props.edit}
              handleUpdateItems={props?.handleUpdateItems}
              baseUrl={props.baseUrl}
              record={props.record}
            />
          ),
          onClick: handleClickEdit,
        },
        {
          key: 'add-units',
          label: (
            <AddUnitsToProductItem
              setVisible={setVisible}
              record={props?.record}
              baseUrl={props.baseUrl}
            />
          ),
          onClick: handleClickEdit,
        },
        {
          key: 'edit-multi-barcode',
          label: (
            <EditMultipleBarcode
              setVisible={setVisible}
              record={props?.record}
              baseUrl={props.baseUrl}
            />
          ),
          onClick: handleClickEdit,
        }
      );
    }
  
    // Print Barcode
    if (
      status === 'active' &&
      props?.record?.product_barcode?.length > 0
    ) {
      items.push({
        key: 'print-barcode',
        label: (
          <PrintBarcode
            setVisible={setVisible}
            record={props?.record}
            type="single"
          />
        ),
        onClick: handleClickEdit,
      });
    }
  
    // Edit Default Unit
    if (
      status === 'active' &&
      props?.record?.product_units?.length > 1 &&
      checkPermissions(`change_${PRODUCT_M}`)
    ) {
      items.push({
        key: 'edit-default-unit',
        label: (
          <EditDefaultUnit
            setVisible={setVisible}
            record={props?.record}
            unit={props?.record?.default_unit?.name}
            baseUrl={props.baseUrl}
          />
        ),
        onClick: handleClickEdit,
      });
    }
  
    // Edit Unit Conversion
    if (
      status === 'active' &&
      props?.record?.product_units?.length > 1 &&
      checkPermissions(`change_${PRODUCT_M}`)
    ) {
      items.push({
        key: 'edit-unit-conversion',
        label: (
          <EditUnitConversion
            dropVisible={setVisible}
            record={props?.record}
            baseUrl={props.baseUrl}
          />
        ),
        onClick: handleClickEdit,
      });
    }
  
    // Product VIP Percent
    if (
      status === 'active' &&
      props?.record?.is_have_vip_price &&
      checkPermissions(`change_${PRODUCT_M}`)
    ) {
      items.push({
        key: 'vip-percent',
        label: (
          <ProductVipPercent
            setVisible={setVisible}
            record={props?.record}
            baseUrl={props.baseUrl}
          />
        ),
        onClick: handleClickEdit,
      });
    }
  
    // Remove VIP Percent
    if (
      status === 'active' &&
      props?.record?.vip_price !== null &&
      props?.record?.is_have_vip_price &&
      checkPermissions(`delete_${PRODUCT_M}`)
    ) {
      items.push({
        key: 'remove-vip-percent',
        label: (
          <Popconfirm
            placement="topRight"
            open={removeVipVisible}
            okButtonProps={{ loading: removeVipLoading }}
            title={
              <ActionMessage
                name={props?.record?.name}
                message="Sales.Product_and_services.Form.Vip_remove_message"
              />
            }
            onConfirm={handelDeleteVipPercent}
            okText={t('Manage_users.Yes')}
            cancelText={t('Manage_users.No')}
            onCancel={handleCancel}
          >
            <div onClick={handelClickVipRemove}>
              {t('Sales.Product_and_services.Form.Remove_vip_percent')}
            </div>
          </Popconfirm>
        ),
      });
    }
  
    // Active/Inactive Product
    items.push({
      key: 'active-inactive',
      label: (
        <ActivePopconfirm
          {...{
            itemName: props?.record?.name,
            visible: activeVisible,
            loading: status === 'active' ? inactiveLoading : activeLoading,
            onConfirm:
              status === 'active' ? handleInactiveItem : handleActiveItem,
            onCancel: handleCancel,
            onClick: handleClickInactive,
            type: status === 'active' ? 'deactivate' : 'active',
            permission: PRODUCT_M,
          }}
        />
      ),
    });
  
    return items;
  };
  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  return (
    <Dropdown
      menu={{ items: getItems() }}
      trigger={['click']}
      onOpenChange={handleVisibleChange}
      open={visible}
      disabled={props.hasSelected}
      placement='bottomRight'
    >
      <span   onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!removeVisible && !activeVisible) {
            setVisible(true);
          }
        }}>
      <ActionButton
        onClick={handleVisibleChange}
        disabled={props.hasSelected}
      />
      </span>
    </Dropdown>
  );
}

export default TableAction;
