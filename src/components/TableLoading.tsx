import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Affix, Spin } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { Colors } from "../pages/colors";

export default function TableLoading({ pagination }: { pagination?: boolean }) {
  const { t } = useTranslation();
  const antIcon = (
    <Loading3QuartersOutlined
      spin
      style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}
    />
  );
  return (
    <div
      style={{
        textAlign: "end",
        marginTop: pagination ? "-110px" : "-55px",
        marginInlineEnd: "10px",
        position: "absolute",
        zIndex: 100,
        left: t("Dir") === "rtl" ? 0 : undefined,
        right: t("Dir") === "ltr" ? 0 : undefined,
      }}
    >
      <Affix
        offsetBottom={20}
        // target={() => document.getElementById("mainComponent")}
      >
        <Spin
          indicator={antIcon}
          style={{
            padding: "10px 12px",
            borderRadius: "8px",
            backgroundColor: Colors.primaryColor,
          }}
        />
      </Affix>
    </div>
  );
}
