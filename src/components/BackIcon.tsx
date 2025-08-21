import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function BackIcon({ url, name }: { url: string; name: string }) {
  const { i18n } = useTranslation();

  return (
    <Link to={url} className="category__product">
      {i18n.language === "en" ? <LeftOutlined /> : <RightOutlined />}
      {name}
    </Link>
  );
}
