import React from "react";
import { Button, Result, Typography } from "antd";
import RetryButton from "../../pages/SelfComponents/RetryButton";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";  
import { WifiOutlined } from "@ant-design/icons";

const { Paragraph } = Typography;

interface IProps {
  error: any;
  handleRetry: () => void;
}
export default function TableError(props: IProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const res = props?.error?.response;
  const message = props?.error?.message;

  const handleClickBack = () => {
    navigate(-1);
  };

  return (
    <Result
      icon={message === "Network Error" ? <WifiOutlined /> : undefined}
      status={
        res?.status === 500 ? "500" : res?.status === 403 ? "403" : "error"
      }
      style={{ padding: "10px 0px" }}
      title={
        res?.status === 500
          ? t("Message.Something")
          : res?.status === 403
          ? "403"
          : message === "Network Error"
          ? t("Internet.No_internet")
          : res?.statusText
      }
      subTitle={
        message === "Network Error" || res?.status === 500
          ? undefined
          : res?.status === 403
          ? t("Internet.Not_access_route_message")
          : message
      }
      extra={
        res?.status === 500
          ? [
              <Button type="primary" ghost onClick={handleClickBack}>
                {t("Step.Back")}
              </Button>,
            ]
          : [
              <RetryButton
                handleRetry={props?.handleRetry}
                size="middle"
                style={styles?.retryButton}
              />,
            ]
      }
    >
      {message === "Network Error" && (
        <Paragraph style={styles.paragraph}>
          <ul style={styles.list}>
            <li>{t("Internet.Check_internet")} </li>
            <li>{t("Internet.Connect_wifi")} </li>
            <li>{t("Internet.Network_diagnostics")} </li>
          </ul>
        </Paragraph>
      )}
    </Result>
  );
}

interface IStyles {
  retryButton: React.CSSProperties;
  paragraph: React.CSSProperties;
  list: React.CSSProperties;
}

const styles: IStyles = {
  retryButton: { margin: "0px" },
  paragraph: { textAlign: "start" },
  list: { listStyleType: "disc" },
};
