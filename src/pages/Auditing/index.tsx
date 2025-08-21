import React from "react";
import { Row, Col, Tabs } from "antd";
import { useTranslation } from "react-i18next";
import PageHeader from "../SelfComponents/LayoutComponents/PagHeader";
import { Colors } from "../colors";
import LoginAuditingTable from "./LoginAuditing/LoginAuditingTable";
import CrudAuditingTable from "./CrudAuditing/CrudAuditingTable";
import { checkPermissions } from "../../Functions";
import { CRUD_AUDIT_M, LOGIN_AUDIT_M } from "../../constants/permissions";

const { TabPane } = Tabs;
const gray = Colors.borderColor;
export default () => {
  const { t } = useTranslation();
  return (
    <PageHeader
      title={t("Auditing.1")}
      table={
        <Tabs
          defaultActiveKey="1"
          tabBarStyle={{
            borderBottom: `1px solid ${gray}`,
            width: "100%",
          }}
        >
          {checkPermissions(`view_${LOGIN_AUDIT_M}`) && (
            <TabPane tab={t("Auditing.Login")} key="1">
              <LoginAuditingTable />
            </TabPane>
          )}
          {checkPermissions(`view_${CRUD_AUDIT_M}`) && (
            <TabPane tab={t("Auditing.Crud")} key="2">
              <CrudAuditingTable />
            </TabPane>
          )}
        </Tabs>
      }
    >
      <Row justify="end">
        <Col></Col>
      </Row>
    </PageHeader>
  );
};
