import React, { useCallback } from "react";
import AddWarehouse from "./AddWarehouse";
import WarehouseTable from "./WarehouseTable";
import { useTranslation } from "react-i18next";
import { Title } from "../SelfComponents/Title";
import { Row, Col, Menu } from "antd";
import { useMediaQuery } from "../MediaQurey";
import InventoryNavbar from "../sales/Navbar";
import { Link } from "react-router-dom";
import { useQueryClient } from "react-query";
import {
  PRODUCT_TRANSFER_INVOICE_M,
  WAREHOUSE_ADJUSTMENT_M,
  WAREHOUSE_M,
} from "../../constants/permissions";
import { PageMoreButton } from "../../components";
import { WAREHOUSE_PRODUCT_TRANSFER } from "../../constants/routes";
import { checkPermissionsModel } from "../../Functions";
// import ImportProduct from "./ImportProductAndService";

const baseUrl = "/inventory/warehouse/";

function Warehouse(props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isMiniTablet = useMediaQuery("(max-width:485px)");
  const isMobile = useMediaQuery("(max-width:425px)");
  const isMiniMobile = useMediaQuery("(max-width:375px)");

  const handleUpdateItems = useCallback(() => {
    queryClient.invalidateQueries(baseUrl);
    queryClient.invalidateQueries(`${baseUrl}infinite/`);
  }, [queryClient]);

  const menu = (
    <Menu>
      {/* <Menu.Item key="1">
        <Link to="/warehouse-notification">
          {t("Warehouse.Notification.1")}
        </Link>
      </Menu.Item> */}
      {checkPermissionsModel(WAREHOUSE_ADJUSTMENT_M) && (
        <Menu.Item key="2">
          <Link to="/warehouse-adjustment">
            {t("Warehouse.Warehouse_adjustment")}
          </Link>
        </Menu.Item>
      )}
      {checkPermissionsModel(PRODUCT_TRANSFER_INVOICE_M) && (
        <Menu.Item key="3">
          <Link to={WAREHOUSE_PRODUCT_TRANSFER}>
            {t("Sales.All_sales.Invoice.Product_transfer")}
          </Link>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <>
      <InventoryNavbar />

      <Row className="categore-header" align="middle" justify="start">
        <Col
          xl={{ span: 7 }}
          md={{ span: 8 }}
          sm={{ span: 10 }}
          xs={{ span: 13 }}
          className="Sales__content-3-body"
        >
          <Row>
            <Col span={24}>
              <Title value={t("Warehouse.1")} model={WAREHOUSE_M} />
            </Col>
          </Row>
        </Col>
        <Col
          xl={{ span: 6, offset: 11 }}
          md={{ span: 8, offset: 8 }}
          sm={{ span: 10, offset: 4 }}
          xs={
            isMiniMobile
              ? { span: 8, offset: 3 }
              : isMiniTablet
              ? { span: 7, offset: 4 }
              : { span: 6, offset: 5 }
          }
        >
          <Row justify={isMobile ? "center" : "space-around"} gutter={[0, 5]}>
            <Col xl={10} md={10} sm={9} xs={23}>
              <PageMoreButton
                permissions={[
                  PRODUCT_TRANSFER_INVOICE_M,
                  WAREHOUSE_ADJUSTMENT_M,
                ]}
                overlay={menu}
              />
            </Col>
            <Col xl={13} md={12} sm={13} xs={24}>
              <AddWarehouse
                baseUrl={baseUrl}
                handleUpdateItems={handleUpdateItems}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <WarehouseTable baseUrl={baseUrl} handleUpdateItems={handleUpdateItems} />
    </>
  );
}

export default Warehouse;
