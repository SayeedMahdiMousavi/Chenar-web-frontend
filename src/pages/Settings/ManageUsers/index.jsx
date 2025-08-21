import React from "react";
import { useTranslation } from "react-i18next";
import { Row, Col, Layout, Menu } from "antd";
import { Title } from "../../SelfComponents/Title";
import { useMediaQuery } from "../../MediaQurey";
import UsersTable from "./UsersTable";
import AddUser from "./AddUser";
import { Link } from "react-router-dom";
import { ROLES } from "../../../constants/routes";
import { PageMoreButton } from "../../../components";
import { USERS_M, USER_ROLE_M } from "../../../constants/permissions";
import { checkPermissionsModel } from "../../../Functions";

const baseUrl = "/user_account/users/";
const ManageUsers = (props) => {
  const { t } = useTranslation();
  const isMiniTablet = useMediaQuery("(max-width:485px)");
  const isMobile = useMediaQuery("(max-width:425px)");
  const isMiniMobile = useMediaQuery("(max-width:375px)");

  const menu = (
    <Menu>
      <Menu.Item key="2">
        <Link to={ROLES}>{t("Roles")}</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
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
              <Title value={t("Manage_users.Users")} model={USERS_M} />
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
              <PageMoreButton permissions={[USER_ROLE_M]} overlay={menu} />
            </Col>
            <Col xl={13} md={12} sm={13} xs={24}>
              <AddUser baseUrl={baseUrl} />
            </Col>
          </Row>
          {/* <GiveFeedback /> */}
        </Col>
      </Row>

      {checkPermissionsModel(USERS_M) && <UsersTable baseUrl={baseUrl} />}
    </Layout>
  );
};

export default ManageUsers;
