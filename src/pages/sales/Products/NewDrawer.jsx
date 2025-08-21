import React, { useState } from "react";
import { Drawer, Button, Row, Col, Modal } from "antd";
import ModalAppServices from "./services/servicesModal";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "../../MediaQurey";
import { GlobalHotKeys } from "react-hotkeys";
import AddProduct from "./AddProduct";

const DrawerApp = (props) => {
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const isMiniComputer = useMediaQuery("(max-width:1024px)");
  const isTabletBase = useMediaQuery("(max-width:768px)");
  const isMiniTablet = useMediaQuery("(max-width:576px)");
  const isMobileBase = useMediaQuery("(max-width:425px)");
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const keyMap = {
    NEW_PRODUCT_OR_SERVICE: ["Control+M", "Control+m"],
  };
  const handlers = {
    NEW_PRODUCT_OR_SERVICE: (event) => {
      event.preventDefault();
      event.stopPropagation();
      setVisible(true);
    },
  };

  return (
    <div>
      <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
        <Button
          className="Drawer-button"
          type="primary"
          onClick={showDrawer}
          shape="round"
        >
          {t("Sales.Product_and_services.New")}
        </Button>

        <Drawer
          maskClosable={false}
          title={t("Sales.Product_and_services.Add_product/service")}
          closable={false}
          placement={i18n.language === "en" ? "right" : "left"}
          onClose={onClose}
          open={visible}
          className={styles.bodyStyle(isTabletBase)}
          width={
            isMobileBase
              ? "75%"
              : isMiniTablet
              ? "63%"
              : isTabletBase
              ? "50%"
              : isMiniComputer
              ? "40%"
              : "31%"
          }
        >
          <Row>
            <Col span={24}>
              <AddProduct
                closeDrawer={onClose}
                place="product"
                setUnits=""
                form=""
                baseUrl={props.baseUrl}
              />
            </Col>
            <Col span={24}>
              <Modal maskClosable={false} AppServices closeDrawer={onClose} />
            </Col>
          </Row>
        </Drawer>
      </GlobalHotKeys>
    </div>
  );
};
const styles = {
  bodyStyle: (isTabletBase) => ({}),
};

export default DrawerApp;
