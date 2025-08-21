import { Col, Row } from "antd";
import React from "react";
import { DeleteButton } from "../../../components";
import { PRODUCT_INVENTORY_LIST } from "../../../constants/routes";
import { useRemoveItem } from "../../../Hooks";
import { ActionMessage } from "../../SelfComponents/TranslateComponents/ActionMessage";
import EditProductInventory from "./Edit";

interface IProps {
  handleUpdateItems: () => void;
  record: any;
  hasSelected: boolean;
}

export default function ProductInventoryAction({
  handleUpdateItems,
  record,
  hasSelected,
}: IProps) {
  //delete product inventory item
  const { isLoading, handleDeleteItem, removeVisible, setRemoveVisible } =
    useRemoveItem({
      baseUrl: `${PRODUCT_INVENTORY_LIST}${record?.id}/`,
      recordName: record?.product?.name,
      handleUpdateItems: handleUpdateItems,
      removeMessage:
        "Sales.Product_and_services.Inventory.Product_inventory_remove_success_message",
      messageValues: {
        product: record?.product?.name,
        unit: record?.unit?.name,
      },
    });

  return (
    <Row justify="space-around">
      <Col>
        <EditProductInventory
          handleUpdateItems={handleUpdateItems}
          {...{
            productName: record?.product?.name,
            productId: record?.product?.id,
            id: record?.id,
            warehouseName: record?.warehouse_in?.name,
            warehouseId: record?.warehouse_in?.id,
            unitName: record?.unit?.name,
            unitId: record?.unit?.id,
            qty: parseFloat(record?.qty),
            price: parseFloat(record?.each_price),
            expirationDate: record?.expire_date,
            registerDate: record?.registered_date,
            unitConversion: record?.unit_conversion_rate,
            hasSelected,
          }}
        />
      </Col>
      <Col>
        <DeleteButton
          onConfirm={handleDeleteItem}
          disabled={hasSelected}
          open={removeVisible}
          setVisible={setRemoveVisible}
          loading={isLoading}
          titleMessage={
            <ActionMessage
              values={{
                product: record?.product?.name,
                unit: record?.unit?.name,
              }}
              message="Sales.Product_and_services.Inventory.Product_inventory_remove_message"
            />
          }
        />
      </Col>
    </Row>
  );
}
