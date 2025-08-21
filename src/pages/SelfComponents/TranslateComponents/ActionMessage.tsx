import React from "react";
import { Trans } from "react-i18next";
import { Typography } from "antd";

interface IProps {
  name?: string | number | undefined;
  message: string;
  values?: any;
}
export const ActionMessage: React.FC<IProps> = ({ message, values, name }) => {
  return (
    <Trans
      i18nKey={message} // optional -> fallbacks to defaults if not provided
      values={Boolean(values) ? values : { name: name }}
      components={{
        danger: <Typography.Text type="danger" strong={true} />,
        bold: <Typography.Text strong={true} />,
      }}
    />
  );
};
