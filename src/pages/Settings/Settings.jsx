import React from "react";
import { Row, Col, Card, Menu } from "antd";
import { Link } from "react-router-dom";
import { useMediaQuery } from "../MediaQurey";
import { useTranslation } from "react-i18next";
import AccountSettings from "../Company/AccountAndSettings/AccountSettings";
import { useDarkMode } from "../../Hooks/useDarkMode";
import AdvanceUserSettings from "../Login/AdvanceUserSettings";
import { checkPermissionsModel } from "../../Functions";
import {
  AUDIT_CENTER_PAGE_M,
  COMPANY_INFO_M,
  CUSTOM_FORM_STYLE_M,
} from "../../constants/permissions";

export default function Settings(props) {
  const isMobile = useMediaQuery("(max-width: 470px)");
  const [mode] = useDarkMode();
  const { t } = useTranslation();
  const onMenuItemClick = () => {
    props.visible();
  };

  return (
    <Row
    // className="setting_popup"
    >
      <Col md={24} sm={24} xs={isMobile ? 24 : 24}>
        <Card
          // title={t("Manage_users.Settings")}
          variant={false}
          styles={styles.card}
        >
          <Menu style={styles.menu} selectable={false}>
            {checkPermissionsModel(COMPANY_INFO_M) && (
              <Menu.Item
                onClick={onMenuItemClick}
                style={styles.margin}
                key="1"
              >
                <AccountSettings />
              </Menu.Item>
            )}

            <Menu.Item onClick={onMenuItemClick} style={styles.margin} key="2">
              <AdvanceUserSettings />
            </Menu.Item>
            {checkPermissionsModel(AUDIT_CENTER_PAGE_M) && (
              <Menu.Item
                onClick={onMenuItemClick}
                style={styles.margin}
                key="3"
              >
                <Link to="/audit_center">{t("Auditing.1")}</Link>
              </Menu.Item>
            )}
            {checkPermissionsModel(CUSTOM_FORM_STYLE_M) && (
              <Menu.Item
                key="4"
                onClick={onMenuItemClick}
                style={styles.margin}
              >
                <Link to="/custom-form-styles">
                  {t("Custom_form_styles.1")}
                </Link>
              </Menu.Item>
            )}
          </Menu>
        </Card>
      </Col>
     
    </Row>
  );
}
const styles = {
  menu: {
    border: "none",
    backgroundColor: "transparent",
    padding: "0px",
    color: "black",
  },
  card: { padding: "0px" },
  margin: { margin: "0rem", color: "black", backgroundColor: "hover: #e6f7ff" },
};
