import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Button, Descriptions, Space } from "antd";
import { useMediaQuery } from "../../MediaQurey";
import { ModalDragTitle } from "../../SelfComponents/ModalDragTitle";
import Draggable from "react-draggable";
import { Styles } from "../../styles";
import { TrueFalseIcon, ViewButton } from "../../../components";

interface IProps {
  record: any;
}
const ViewAuditing: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [disabled, setDisabled] = useState<boolean>(true);
  const isMiniTablet = useMediaQuery("(max-width: 576px)");
  const isMobile = useMediaQuery("(max-width: 425px)");
  const isSubBase = useMediaQuery("(max-width: 375px)");

  const showModal = () => {
    setIsShowModal({
      visible: true,
    });
  };
  const handleCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };

  const userDevice = props?.record?.user_device;
  const userIp = props?.record?.user_ip;
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div>
      <ViewButton onClick={showModal} />

      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t("Auditing.Account_information")}
          />
        }
        modalRender={(modal) => (
          <div style={{ width: "100%" }}>
            <Draggable disabled={disabled} nodeRef={ref as React.RefObject<HTMLElement>}>
              <div ref={ref}>
              {modal}
              </div>
            </Draggable>
          </div>
        )}
        style={Styles.modal(isMobile)}
        bodyStyle={{
          ...Styles.modalBody(isMobile, isSubBase, isMiniTablet),
          paddingBottom: "24px",
        }}
        open={isShowModal.visible}
        destroyOnClose
        centered
        width={800}
        onCancel={handleCancel}
        footer={false}
      >
        <Space size="large" direction="vertical">
          <Descriptions
            bordered
            title={t("Auditing.User_device")}
            size="small"
            layout="vertical"
          >
            <Descriptions.Item label={t("Auditing.Device_family")}>
              {userDevice?.device_family}
            </Descriptions.Item>
            <Descriptions.Item label={t("Auditing.Operating_system")}>
              {userDevice?.os_family}
            </Descriptions.Item>
            <Descriptions.Item label={t("Auditing.Operating_system_version")}>
              {userDevice?.os_version}
            </Descriptions.Item>
            <Descriptions.Item label={t("Auditing.Browser")}>
              {userDevice?.browser_family}
            </Descriptions.Item>
            <Descriptions.Item label={t("Auditing.Browser_version")}>
              {userDevice?.browser_version}
            </Descriptions.Item>
            <Descriptions.Item label={t("Auditing.Is_computer")}>
              <TrueFalseIcon value={userDevice?.is_pc} />
            </Descriptions.Item>
            <Descriptions.Item label={t("Auditing.Is_tablet")}>
              <TrueFalseIcon value={userDevice?.is_tablet} />
            </Descriptions.Item>
            <Descriptions.Item label={t("Auditing.Is_mobile")}>
              <TrueFalseIcon value={userDevice?.is_mobile} />
            </Descriptions.Item>
            <Descriptions.Item label={t("Auditing.Is_bot")}>
              <TrueFalseIcon value={userDevice?.is_bot} />
            </Descriptions.Item>
          </Descriptions>
          <Descriptions
            bordered
            title={t("Auditing.User_ip")}
            size="small"
            layout="vertical"
          >
            <Descriptions.Item label={t("Form.Country")}>
              {userIp?.country}
            </Descriptions.Item>
            <Descriptions.Item label={t("Form.City/Town")}>
              {userIp?.city}
            </Descriptions.Item>
            <Descriptions.Item label={t("Auditing.IP")}>
              {userIp?.ip}
            </Descriptions.Item>
            <Descriptions.Item label={t("Auditing.ISP")}>
              {userIp?.isp}
            </Descriptions.Item>
            <Descriptions.Item label={t("Auditing.Latitude")}>
              {userIp?.lat}
            </Descriptions.Item>
            <Descriptions.Item label={t("Auditing.longitude")}>
              {userIp?.lon}
            </Descriptions.Item>
          </Descriptions>
        </Space>
      </Modal>
    </div>
  );
};

export default ViewAuditing;
