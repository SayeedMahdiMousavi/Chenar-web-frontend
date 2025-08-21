import React, { useState } from "react";
import { useMediaQuery } from "../../MediaQurey";
import { useTranslation } from "react-i18next";
import { Layout, Drawer, Button, Menu } from "antd";
import BillingAndSubscriptions from "./BillingAndSubscriptions";
import { connect } from "react-redux";
import Company from "./Company";
import Navbar from "./Navbar";
import STMPEmail from "./STMPEmail";
import Backup from "./Backup/index";
import FinancialPeriod from "./Financial";
import { useDarkMode } from "../../../Hooks/useDarkMode";
import InvoiceSettings from "./InvoicesSettings";

const { Sider, Content } = Layout;
const AccountSettings = (props) => {
  const { t } = useTranslation();
  const [mode] = useDarkMode();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState("company");

  const isTablet = useMediaQuery("(max-width: 767px)");

  const onClickMenu = ({ item, key }) => {
    setCurrent(key);
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
    setCurrent("company");
  };

  return (
    <div>
      <div onClick={showDrawer}>{t("Company.Account_and_settings")}</div>

      <Drawer
        maskClosable={false}
        mask={true}
        title={
          <div>
            <div style={styles.row}>
              {isTablet && (
                <div>
                  <Navbar onClickMenu={onClickMenu} current={current} />
                </div>
              )}
              <div>{t("Company.Account_and_settings")}</div>
              <div></div>
            </div>
          </div>
        }
        height="100%"
        onClose={onClose}
        destroyOnClose
        open={visible}
        placement="top"
        bodyStyle={{ padding: 0, overflow: "hidden" }}
        footer={
          <div style={{ textAlign: "end" }}>
            <Button type="primary" shape="round" onClick={onClose}>
              {t("Step.Done")}
            </Button>
          </div>
        }
      >
        <Layout>
          <Sider
            width={isTablet ? 0 : 215}
            trigger={null}
            collapsible
            theme={mode}
          >
            <Menu
              mode="vertical"
              theme={mode}
              style={{ height: "100vh" }}
              defaultOpenKeys={["1"]}
              selectedKeys={[current]}
              defaultSelectedKeys={["1"]}
              onClick={onClickMenu}
            >
              <Menu.Item
                // className="Account__details__show"
                key="company"
                style={styles.margin}
              >
                {t("Company.1")}
              </Menu.Item>
              <Menu.Item
                key="smtpEmail"
                style={styles.margin}

                // className="Account__details__show"
              >
                {t("Company.SMTP_email")}
              </Menu.Item>
              {/* <Menu.Item
                key="invoices"
                style={styles.margin}
              >
                {t("Reports.Invoices")}
              </Menu.Item> */}
              {/* <Menu.Item
                // className="Account__details__show"
                key="backup"
                style={styles.margin}
              >
                {t("Company.Backup")}
              </Menu.Item> */}
              {/* <Menu.Item
                // className="Account__details__show"
                key="billing"
                style={styles.margin}
              >
                {t("Company.Billing_subscription")}
              </Menu.Item> */}

              {/* <Menu.Item
                // className="Account__details__show"
                key="period"
                style={styles.margin}
              >
                {t("Company.Financial_period")}
              </Menu.Item> */}

              {/* <Menu.Item
                className='Account__details__show'
                key='5'
                style={styles.margin}
                onClick={onClickAdvance}
              >
                Advanced
              </Menu.Item> */}
            </Menu>
          </Sider>

          <Content className="account_setting_drawer">
            {current === "company" ? (
              <Company />
            ) : current === "smtpEmail" ? (
              <STMPEmail />
            ) : current === "billing" ? (
              <BillingAndSubscriptions />
            ) : current === "backup" ? (
              <Backup />
            ) : current === "period" ? (
              <FinancialPeriod />
            ) : (
              // : current === "invoices" ? (
              //   <InvoiceSettings />
              // )
              <div>nothing</div>
            )}
          </Content>
        </Layout>
      </Drawer>
    </div>
  );
};
const styles = {
  nav: (isMobileBased) => ({ height: isMobileBased ? "7vh" : "5vh" }),
  upload: { marginTop: "4rem" },
  margin: { margin: "0rem" },
  cancel: { margin: "0 8px" },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
};

const mapStateToProps = (state) => {
  return {
    rtl: state.direction.rtl,
    ltr: state.direction.ltr,
  };
};

export default connect(mapStateToProps)(AccountSettings);
