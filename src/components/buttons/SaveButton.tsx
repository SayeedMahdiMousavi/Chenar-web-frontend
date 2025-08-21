import { ButtonProps, Button } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { SaveIcon } from "../../icons";

interface IProps extends ButtonProps {
  text?: string;
  ref?: React.RefObject<HTMLButtonElement>;
}

export function SaveButton({ text, ...rest }: IProps) {
  const { t } = useTranslation();
  return (
    <Button type="primary" icon={<SaveIcon />} {...rest}>
      {text ? text : t("Form.Save")}
    </Button>
  );
}
