import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'antd';
import { useQueryClient } from 'react-query';
import ActionButton from '../../SelfComponents/ActionButton';
import EditMarketInvoice from './EditMarkitInvoice';
import ReadonlyInvoiceItems from './ReadonlyInvoiceItems';
import { EditSalesInvoice } from './EditSalesInvoice';
import { EditRejectSalesInvoice } from './EditRejectSalesInvoice';
import { EditPurchaseInvoice } from './EditPurchaseInvoice';
import { EditRejectPurchaseInvoice } from './EditRejectPurchaseInvoice';
import { EditQuotationInvoice } from './EditQuotationInvoice';
// import EditProductTransfer from "./ProductTransfer/EditProductTransfer";

import {
  expireProductsBaseUrl,
  productStatisticsBaseUrl,
} from '../../Reports/AllReports/AllReports';
import { RemovePopconfirm } from '../../../components';
import { useRemoveItem } from '../../../Hooks';
import {
  // PRODUCT_TRANSFER_INVOICE_M,
  PURCHASE_INVOICE_M,
  PURCHASE_REJ_INVOICE_M,
  QUOTATION_INVOICE_M,
  SALES_INVOICE_M,
  SALES_REJ_INVOICE_M,
} from '../../../constants/permissions';
import { checkPermissions } from '../../../Functions';
import {
  PURCHASE_INVOICE_LIST,
  PURCHASE_ORDER_INVOICE_LIST,
  PURCHASE_REJECT_INVOICE_LIST,
  QUOTATION_INVOICE_LIST,
  SALES_INVOICE_LIST,
  SALES_ORDER_INVOICE_LIST,
  SALES_REJECT_INVOICE_LIST,
} from '../../../constants/routes';

function TransactionAction(props) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const handleUpdateItems = useCallback(() => {
    queryClient.invalidateQueries(props.baseUrl);
    if (props.baseUrl !== QUOTATION_INVOICE_LIST) {
      queryClient.invalidateQueries(expireProductsBaseUrl);
      queryClient.invalidateQueries(productStatisticsBaseUrl);
    }
  }, [props.baseUrl, queryClient]);

  //delete invoice item
  const {
    reset,
    isLoading,
    handleDeleteItem,
    removeVisible,
    setRemoveVisible,
  } = useRemoveItem({
    baseUrl: `${props.baseUrl}${props?.record?.id}/`,
    setVisible,
    recordName: `${t('Sales.All_sales.Invoice.Invoice')} ${props?.record?.id}`,
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

  const invoiceItemsProps =
    props.baseUrl === SALES_REJECT_INVOICE_LIST
      ? {
          baseUrl: SALES_REJECT_INVOICE_LIST,
          type: 'sales_rej',
          title: t('Sales.All_sales.Invoice.Reject_sales_invoice'),
          permission: SALES_REJ_INVOICE_M,
        }
      : props.baseUrl === PURCHASE_INVOICE_LIST
        ? {
            baseUrl: PURCHASE_INVOICE_LIST,
            type: 'purchase',
            title: t('Sales.All_sales.Invoice.Purchase_invoice'),
            permission: PURCHASE_INVOICE_M,
          }
        : props.baseUrl === PURCHASE_REJECT_INVOICE_LIST
          ? {
              baseUrl: PURCHASE_REJECT_INVOICE_LIST,
              type: 'purchase_rej',
              title: t('Sales.All_sales.Invoice.Reject_purchase_invoice'),
              permission: PURCHASE_REJ_INVOICE_M,
            }
          : props.baseUrl === QUOTATION_INVOICE_LIST
            ? {
                baseUrl: QUOTATION_INVOICE_LIST,
                type: 'quotation',
                title: t('Sales.All_sales.Invoice.Quotation_invoice'),
                permission: QUOTATION_INVOICE_M,
              }
            : // : props.baseUrl === "warehouse_transfer_invoice/"
              // ? {
              //     baseUrl: "warehouse_transfer_invoice/",
              //     type: "productTransfer",
              //     title: startCase(t("Sales.All_sales.Invoice.Product_transfer")),
              //     permission: PRODUCT_TRANSFER_INVOICE_M,
              //   }
              {
                baseUrl: SALES_INVOICE_LIST,
                type: 'sales',
                title: t('Sales.All_sales.Invoice.Sales_invoice'),
                permission: SALES_INVOICE_M,
              };

  const menuItems = [
    {
      key: 'remove',
      label: (
        <RemovePopconfirm
          itemName={`${t('Sales.All_sales.Invoice.Invoice')} ${props?.record?.id}`}
          open={removeVisible}
          loading={isLoading}
          onConfirm={handleDeleteItem}
          onCancel={handleCancel}
          onClick={handleClickRemove}
          permission={invoiceItemsProps?.permission}
        />
      ),
    },
    {
      key: 'readonly',
      onClick: handleClickEdit,
      label: (
        <ReadonlyInvoiceItems
          setVisible={setVisible}
          record={props?.record}
          {...invoiceItemsProps}
        />
      ),
    },
    checkPermissions(`change_${invoiceItemsProps?.permission}`) && {
      key: 'edit',
      onClick: handleClickEdit,
      label:
        props.baseUrl === SALES_REJECT_INVOICE_LIST ? (
          <EditRejectSalesInvoice setVisible={setVisible} record={props?.record} />
        ) : props.baseUrl === SALES_ORDER_INVOICE_LIST ? (
          <EditSalesInvoice
            setVisible={setVisible}
            record={props?.record}
            type='salesOrder'
          />
        ) : props.baseUrl === PURCHASE_INVOICE_LIST ? (
          <EditPurchaseInvoice setVisible={setVisible} record={props?.record} />
        ) : props.baseUrl === PURCHASE_ORDER_INVOICE_LIST ? (
          <EditPurchaseInvoice
            setVisible={setVisible}
            record={props?.record}
            type='purchaseOrder'
          />
        ) : props.baseUrl === PURCHASE_REJECT_INVOICE_LIST ? (
          <EditRejectPurchaseInvoice setVisible={setVisible} record={props?.record} />
        ) : props.baseUrl === QUOTATION_INVOICE_LIST ? (
          <EditQuotationInvoice setVisible={setVisible} record={props?.record} />
        ) : props?.record?.sales_source === 'pos' &&
          props.baseUrl === SALES_INVOICE_LIST ? (
          <EditMarketInvoice setVisible={setVisible} record={props?.record} />
        ) : (
          <EditSalesInvoice setVisible={setVisible} record={props?.record} />
        ),
    },
  ].filter(Boolean);

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };
  const onMenuClick = ({ key }) => {
    if (key === 'readonly' || key === 'edit') {
      handleClickEdit();
    }
  };
  return (
    <Dropdown
      menu={{ items: menuItems, onClick: onMenuClick }}
      trigger={['click']}
      onOpenChange={handleVisibleChange}
      open={visible}
      disabled={props.hasSelected}
    >
            <span
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!removeVisible) {
            setVisible(true);
          }
        }}
      >
      <ActionButton onClick={handleVisibleChange} />
      </span>
    </Dropdown>
  );
}

export default TransactionAction;
