import  { useState } from "react";
import { Drawer } from "antd";
import NavLink from "./Navlink";
import { MenuOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
function MobileNav() {
  const [visible, setVisible] = useState(false);
  const { i18n } = useTranslation();

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <div>
      <MenuOutlined
        className="trigger"
        style={{ fontSize: "1.5rem" }}
        onClick={showDrawer}
      />

      <Drawer
        maskClosable={false}
        placement={i18n.language === "en" ? "left" : "right"}
        closable={false}
        onClose={onClose}
        width="60%"
        open={visible}
        bodyStyle={{ padding: "0px" }}
      >
        <NavLink close={onClose} />
      </Drawer>
    </div>
  );
}

export default MobileNav;
