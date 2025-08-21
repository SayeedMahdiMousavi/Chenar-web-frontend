import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col, Menu } from "antd";
import { useDarkMode } from "../../Hooks/useDarkMode";

const Navbar = () => {
  const { t } = useTranslation();
  const { location } = useLocation();
  const [mode] = useDarkMode();

  return (
    <Row>
      <Col span={24}>
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          className="sub_nave"
        >
          <Menu.Item key="/currency">
            <Link to="/currency">
              {t("Sales.Product_and_services.Currency.1")}
            </Link>
          </Menu.Item>
        </Menu>
      </Col>
    </Row>
  );
};
export default Navbar;
