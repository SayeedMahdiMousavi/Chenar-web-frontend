import React, { Fragment, memo, useState } from "react";
import { Menu } from "antd";
import { useTranslation } from "react-i18next";
import BarcodeLabelSettings from "./BarcodeLabelSettings";
import {
  TableSettingsMenu,
  TableSettingsMenuItem,
  TableSettingsMenuMoreItem,
} from "../../../components";

function ProductSettings({
  setColumns,
  price,
  barcode,
  description,
  createdBy,
  photo,
  modifiedDate,
  modifiedBy,
  vip,
  category,
  createdDate,
  ...rest
}: any) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <TableSettingsMenu {...rest}>
      <TableSettingsMenuItem
        setColumns={setColumns}
        checked={category}
        name="category"
      >
        {t("Sales.Product_and_services.Form.Category")}
      </TableSettingsMenuItem>
      <TableSettingsMenuItem
        setColumns={setColumns}
        name="price"
        checked={price}
      >
        {t("Sales.Product_and_services.Price_recording.Sales_price")}
      </TableSettingsMenuItem>

      <TableSettingsMenuItem
        setColumns={setColumns}
        name="photo"
        checked={photo}
      >
        {t("Form.Photo")}
      </TableSettingsMenuItem>
      <TableSettingsMenuItem
        setColumns={setColumns}
        name="barcode"
        checked={barcode}
      >
        {t("Sales.Product_and_services.Form.Barcode")}
      </TableSettingsMenuItem>
      <TableSettingsMenuItem
        checked={createdBy}
        setColumns={setColumns}
        name="createdBy"
      >
        {t("Sales.Product_and_services.Form.Created_by")}
      </TableSettingsMenuItem>
      <TableSettingsMenuItem
        setColumns={setColumns}
        name="modifiedBy"
        checked={modifiedBy}
      >
        {t("Sales.Product_and_services.Form.Modified_by")}
      </TableSettingsMenuItem>
      {visible && (
        <Fragment>
          <TableSettingsMenuItem
            setColumns={setColumns}
            name="createdDate"
            checked={createdDate}
          >
            {t("Sales.Product_and_services.Form.Created_date")}
          </TableSettingsMenuItem>
          <TableSettingsMenuItem
            setColumns={setColumns}
            name="modifiedDate"
            checked={modifiedDate}
          >
            {t("Sales.Product_and_services.Form.Modified_date")}
          </TableSettingsMenuItem>

          <TableSettingsMenuItem
            setColumns={setColumns}
            name="vip"
            checked={vip}
          >
            {t("Sales.Product_and_services.Form.Vip_price")}
          </TableSettingsMenuItem>

          <TableSettingsMenuItem
            setColumns={setColumns}
            name="description"
            checked={description}
          >
            {t("Form.Description")}
          </TableSettingsMenuItem>

          <Menu.Item key="12">
            <BarcodeLabelSettings />
          </Menu.Item>
        </Fragment>
      )}
      <TableSettingsMenuMoreItem {...{ setVisible, visible }} />
    </TableSettingsMenu>
  );
}

//@ts-ignore
// eslint-disable-next-line no-func-assign
ProductSettings = memo(ProductSettings);

export default ProductSettings;
