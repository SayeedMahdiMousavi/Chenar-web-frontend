import { Button, Row } from "antd";
import React, { CSSProperties } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  handleRetry: () => void;
  style?: CSSProperties;
  size?: "middle" | "small" | "large";
}

export default function RetryButton(props: IProps) {
  const { t } = useTranslation();
  return (
    <Row justify="center">
      <Button
        size={props.size ? props.size : "small"}
        style={props.style ? props.style : styles.button}
        type="primary"
        danger
        onClick={props.handleRetry}
      >
        {t("Form.Retry")}
      </Button>
    </Row>
  );
}

interface IStyles {
  button: CSSProperties;
}
const styles: IStyles = {
  button: { margin: "24px" },
};
