import React from "react";
import { useTranslation } from "react-i18next";
import { Row, Col, Menu } from "antd";
import { useMediaQuery } from "../../../MediaQurey";
import BackupTable from "./BackupTable";
import UploadBackup from "./UploadBackup";
import AddBackup from "./AddBackup";
import { Title } from "../../../SelfComponents/Title";
import { Link } from "react-router-dom";
import { PageMoreButton } from "../../../../components";
import { BACKUP_M, BACKUP_SETTINGS_M } from "../../../../constants/permissions";
import { checkPermissions, checkPermissionsModel } from "../../../../Functions";

const baseUrl = "/system_setting/backup/manage/";

const Backup = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width:430px)");

  const menu = (
    <Menu>
      {checkPermissions(`upload_to_cloud_${BACKUP_M}`) && (
        <Menu.Item key="1">
          <UploadBackup baseUrl={baseUrl} />{" "}
        </Menu.Item>
      )}
      {checkPermissionsModel(BACKUP_SETTINGS_M) && (
        <Menu.Item key="2">
          <Link to="/automatic-backup">{t("Company.Automatic_backup")}</Link>
        </Menu.Item>
      )}
      {checkPermissionsModel(BACKUP_SETTINGS_M) && (
        <Menu.Item key="3">
          <Link to="/online-drive-settings">
            {t("Company.Online_drive_settings")}
          </Link>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <>
      <Row className="Sales__content-3" align="middle" justify="start">
        <Col
          xl={{ span: 7 }}
          md={{ span: 8 }}
          sm={{ span: 10 }}
          xs={{ span: 13 }}
          className="Sales__content-3-body"
        >
          <Title value={t("Company.Backup")} model={BACKUP_M} />
        </Col>
        <Col
          xl={{ span: 6, offset: 11 }}
          md={{ span: 8, offset: 8 }}
          sm={{ span: 10, offset: 4 }}
        >
          <Row justify={isMobile ? "center" : "space-around"} gutter={[0, 5]}>
            <Col xl={10} md={10} sm={9} xs={23}>
              <PageMoreButton
                permissions={[BACKUP_SETTINGS_M]}
                overlay={menu}
              />
            </Col>
            <Col xl={13} md={12} sm={13} xs={24}>
              <AddBackup baseUrl={baseUrl} />
            </Col>
          </Row>
        </Col>
      </Row>
      {(checkPermissionsModel(BACKUP_M) ||
        checkPermissions(`restore_${BACKUP_M}`)) && (
        <BackupTable baseUrl={baseUrl} />
      )}
    </>
  );
};

export default Backup;
