import React from "react";
import { Trans } from "react-i18next";
import { Typography } from "antd";

interface IProps {
  values: any;
  message: string;
}
export const TranslateMessage: React.FC<IProps> = (props) => {
  return (
    <Trans
      i18nKey={props?.message} // optional -> fallbacks to defaults if not provided
      values={props?.values}
      components={{
        danger: <Typography.Text type="danger" strong={true} />,
        bold: <Typography.Text strong={true} />,
      }}
    />
  );
};
