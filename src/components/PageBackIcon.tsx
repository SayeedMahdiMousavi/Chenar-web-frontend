import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function PageBackIcon({
  previousPageName,
  url,
}: {
  previousPageName: string;
  url: string;
}) {
  const { t } = useTranslation();

  return (
    <Link to={url} className="category__product">
      {t("Dir") === "ltr" ? <LeftOutlined /> : <RightOutlined />}
      {previousPageName}
    </Link>
  );
}
