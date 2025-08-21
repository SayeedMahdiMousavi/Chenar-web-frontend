import React, { useCallback } from "react";
import AddOnlineDriveSettings from "./Add";
import OnlineDriveSettingsTable from "./Table";
import { useTranslation } from "react-i18next";
import { Title } from "../../SelfComponents/Title";
import { Row, Col } from "antd";
import { useMediaQuery } from "../../MediaQurey";
import { useQueryClient } from "react-query";
import { PageBackIcon } from "../../../components";

const baseUrl = "/system_setting/backup/online_drive/";
function OnlineDriveSettings() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isMiniTablet = useMediaQuery("(max-width:485px)");
  const isMobile = useMediaQuery("(max-width:425px)");
  const isMiniMobile = useMediaQuery("(max-width:375px)");

  const handleUpdateItems = useCallback(() => {
    queryClient.invalidateQueries(baseUrl);
  }, [queryClient]);

  return (
    <>
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
              <Title value={t("Company.Online_drive_settings")} />
            </Col>
            <Col span={24}>
              <PageBackIcon
                previousPageName={t("Company.Backup")}
                url="/backup"
              />
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
            <Col xl={10} md={10} sm={9} xs={23}></Col>
            <Col xxl={12} xl={13} md={12} sm={13} xs={24}>
              <AddOnlineDriveSettings
                baseUrl={baseUrl}
                handleUpdateItems={handleUpdateItems}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <OnlineDriveSettingsTable
        baseUrl={baseUrl}
        handleUpdateItems={handleUpdateItems}
      />
    </>
  );
}

export default OnlineDriveSettings;
