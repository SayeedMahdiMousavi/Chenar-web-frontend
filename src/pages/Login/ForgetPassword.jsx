import React, { useState } from "react";
import { Form, Input, Button, message, Result } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import axiosInstance from "../ApiBaseUrl";

export default function ForgetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const handleSend = async (value) => {
    await axiosInstance
      .post(`/user_account/reset_password/send_email`, value, {
        timeout: 30000,
      })
      .then((res) => {
        setSuccess(true);
        setError(false);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response?.data?.email?.[0]) {
          setSuccess(false);
          setError(true);
        }
      });
  };

  const { mutate: mutateSend } = useMutation(handleSend, {});
  const onFinish = async (values) => {
    try {
      setLoading(true);
      mutateSend({
        email: values.email,
      });
    } catch (error) {
      message.error(`${error}`);
    }
  };

  const retry = () => {
    setSuccess(false);
    setError(false);
    setLoading(false);
  };

  const onBack = () => {
    navigate("/");
  };

  return (
    <div className="box-layout">
      <div className="reset_box">
        {window.navigator.onLine ? (
          <div>
            {success ? (
              <Result
                status="success"
                title={t("Manage_users.Reset_success_message")}
                subTitle={t("Manage_users.Reset_success_sub_message")}
                extra={[
                  <Button key="console" style={styles.back} onClick={onBack}>
                    {t("Manage_users.Back_login")}
                  </Button>,
                  <Button key="buy" type="primary" onClick={retry}>
                    {t("Manage_users.Send_again")}
                  </Button>,
                ]}
              />
            ) : error ? (
              <Result
                status="404"
                title={t("Form.Not_found")}
                subTitle={t("Manage_users.Reset_error_message")}
                extra={
                  <Button type="primary" onClick={retry}>
                    {t("Form.Retry")}
                  </Button>
                }
              />
            ) : (
              <div>
                {" "}
                <h4
                  className="box-layout__title"
                  style={{ lineHeight: "20px" }}
                >
                  {t("Manage_users.Reset_message")}
                </h4>
                <Form hideRequiredMark layout="vertical" onFinish={onFinish}>
                  <Form.Item
                    name="email"
                    label={
                      <span>
                        {t("Form.Email")}
                        <span className="star">*</span>
                      </span>
                    }
                    rules={[
                      {
                        type: "email",
                        message: `${t("Form.Email_Message")}`,
                      },
                      {
                        required: true,
                        whitespace: true,
                        message: `${t("Form.Required_email")}`,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item style={styles.textAlign}>
                    <Button onClick={onBack} shape="round" style={styles.back}>
                      {t("Form.Back")}
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      shape="round"
                      loading={loading}
                    >
                      {t("Sales.Customers.Table.Send")}
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            )}
          </div>
        ) : (
          <Result
            icon={
              <img
                src="/images/noInternet.png"
                alt={t("Internet.No_internet")}
                className="no_internet"
              />
            }
            title={t("Internet.No_internet_message")}
          />
        )}
      </div>
    </div>
  );
}
const styles = {
  back: { margin: "0px 8px" },
  textAlign: { textAlign: "end" },
};
