import  { useEffect, useLayoutEffect, useState } from "react";
import { Result, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
export default function NotFound() {
  const { t } = useTranslation();
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const refreshToken = localStorage.getItem("refresh_token");

  useEffect(() => {
    setTimeout(() => {
      setLoad(true);
    }, 1500);
  }, []);

  useLayoutEffect(() => {
    if (!refreshToken) {
      navigate("/");
    }
  }, [navigate, refreshToken]);
  return (
    <div className="notFound__body">
      {load ? (
        <Result
          status="404"
          title="404"
          subTitle={t("Internet.Not_found_route_message")}
        />
      ) : (
        <Spin size="large" />
      )}
    </div>
  );
}
