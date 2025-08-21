import React, { useState } from "react";
import { useMediaQuery } from "../../MediaQurey";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient, useMutation } from "react-query";
import axiosInstance from "../../ApiBaseUrl";
import {
  Form,
  Col,
  Row,
  Input,
  message,
  Typography,
  Checkbox,
  InputNumber,
  Radio,
  Divider,
  Skeleton,
  Space,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import CheckEmail from "./CheckEmail";
import { useDarkMode } from "../../../Hooks/useDarkMode";
import { CancelButton, SaveButton } from "../../../components";
import { addMessage, manageErrors, updateMessage } from "../../../Functions";

const { Text } = Typography;
export default function STMPEmail() {
  const { t } = useTranslation();
  const [mode] = useDarkMode();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const isTablet = useMediaQuery("(max-width: 575px)");
  const isMobile = useMediaQuery("(max-width: 425px)");
  const [error, setError] = useState(0);
  const [email, setEmail] = useState(false);
  const [smtp, setSmtp] = useState("");
  const [disable, setDisable] = useState();

  const result = useQuery("/company/company_smtp/default_smtp/", async () => {
    const result = await axiosInstance
      .get(`/company/company_smtp/default_smtp/`)
      .then((res) => {
        setSmtp(res?.data?.default);
        setDisable(res?.data?.default === "default_smtp" ? true : false);
        return res.data;
      });
    return result;
  });

  const { data, status } = useQuery("/company/company_smtp/", async () => {
    const result = await axiosInstance
      .get(`/company/company_smtp/`)
      .then((res) => {
        setError(res.status);
        return res.data;
      });
    return result;
  });

  const onClickEmail = async () => {
    setEmail(true);
    form.setFieldsValue({
      emailHost: data?.host,
      emailHostUser: data?.username,
      password: data?.password,
      emailTls: data?.use_tls,
      port: data?.port,
      title: data?.default_from_email,
    });
  };

  const addSmtpEmail = async (value) =>
    await axiosInstance.post(`/company/company_smtp/`, value, { timeout: 0 });

  const {
    mutate: mutateAddSmtpEmail,
    isLoading,
    reset,
  } = useMutation(addSmtpEmail, {
    onSuccess: () => {
      setEmail(false);
      setError(0);
      addMessage(t("Company.SMTP_email"));
      queryClient.invalidateQueries("/company/company_smtp/");
      queryClient.invalidateQueries("/company/company_smtp/default_smtp/");
    },
    onError: () => {
      message.error(t("Company.Smtp_add_error"));
    },
  });

  const editSmtpEmail = async (value) =>
    await axiosInstance.put(`/company/company_smtp/1/`, value, { timeout: 0 });

  const {
    mutate: mutateEditSmtpEmail,
    isLoading: editLoading,
    reset: editReset,
  } = useMutation(editSmtpEmail, {
    onSuccess: () => {
      setEmail(false);
      updateMessage(t("Company.SMTP_email"));
      setError(0);
      queryClient.invalidateQueries("/company/company_smtp/");
      queryClient.invalidateQueries("/company/company_smtp/default_smtp/");
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const onFinish = async (values) => {
    if (error === 204) {
      const allData = {
        host: values?.emailHost,
        username: values?.emailHostUser,
        password: values?.password,
        use_tls: values?.emailTls,
        port: values?.port,
        default_from_email: values?.title,
        status: !disable,
      };
      mutateAddSmtpEmail(allData);

      return;
    } else {
      const allData = {
        host: values?.emailHost,
        username: values?.emailHostUser,
        password: values?.password,
        use_tls: values.emailTls,
        port: values?.port,
        default_from_email: values?.title,
        status: !disable,
      };
      mutateEditSmtpEmail(allData);

      return;
    }
  };
  const onChangeStmpEmail = (e) => {
    const value = e.target.value;

    if (value === "default_smtp") {
      setSmtp(value);
      setDisable(true);
    } else {
      setDisable(false);
      setSmtp(value);
    }
  };

  const cancel = () => {
    setEmail(false);
    reset();
    editReset();
    form.resetFields();
  };
  if (status === "loading") {
    return (
      <Row justify="space-around">
        <Col span={23} className="product_table_skeleton banner">
          <Skeleton
            loading={true}
            paragraph={{ rows: 5 }}
            title={false}
            active
          ></Skeleton>
        </Col>
      </Row>
    );
  }
  return (
    <div>
      {email ? (
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{ emailTls: false }}
        >
          <Radio.Group
            value={smtp}
            onChange={onChangeStmpEmail}
            className="num"
          >
            <Row className="account_setting_drawer_name">
              <Col span={6} gutter={[5, 5]}>
                <Row gutter={5} align="middle">
                  <Col lg={24} sm={24} xs={24} style={styles.title(isTablet)}>
                    <Text strong={true}>{t("Company.SMTP_email")}</Text>
                  </Col>
                </Row>
              </Col>
              <Col span={18}>
                <Row
                  gutter={[5, 15]}
                  style={{ paddingTop: "15px" }}
                  align="middle"
                >
                  <Radio value="default_smtp">
                    {t("Company.Default_SMTP_email")}
                  </Radio>
                  <Col span={24}>
                    {" "}
                    <Divider />
                  </Col>

                  <Col span={24}>
                    {" "}
                    <Radio value="custom_smtp">
                      {t("Company.Custom_SMTP_email")}
                    </Radio>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Radio.Group>
          <Row>
            <Col span={6}></Col>
            <Col span={18}>
              <Row gutter={[8, 8]}>
                <Col lg={7} sm={8} xs={isMobile ? 11 : 10}>
                  <Text strong={true}>{t("Company.Email_host")}</Text>
                </Col>

                <Col lg={10} sm={12} xs={isMobile ? 13 : 12}>
                  <Form.Item
                    name="emailHost"
                    style={styles.margin}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: `${t("Company.Form.Required_email")}`,
                      },
                    ]}
                  >
                    <Input disabled={disable} />
                  </Form.Item>
                </Col>
                <Col lg={2} sm={3} xs={0}></Col>
                <Col lg={7} sm={8} xs={isMobile ? 11 : 10}>
                  <Text strong={true}>{t("Company.Email_host_user")}</Text>
                </Col>
                <Col lg={10} sm={12} xs={isMobile ? 13 : 12}>
                  <Form.Item
                    name="emailHostUser"
                    style={styles.margin}
                    rules={[
                      {
                        type: "email",
                        message: `${t("Form.Email_Message")}`,
                      },
                      {
                        required: true,
                        whitespace: true,
                        message: `${t("Company.Form.Required_email")}`,
                      },
                    ]}
                  >
                    <Input disabled={disable} />
                  </Form.Item>
                </Col>
                <Col lg={2} sm={1} xs={isMobile ? 0 : 2}>
                  {" "}
                </Col>
                <Col lg={5} sm={6} xs={0}>
                  {" "}
                </Col>
                <Col lg={7} sm={8} xs={isMobile ? 11 : 10}>
                  <Text strong={true}>{t("Company.Email_password")}</Text>
                </Col>
                <Col lg={10} sm={12} xs={isMobile ? 13 : 12}>
                  <Form.Item
                    name="password"
                    style={styles.margin}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: `${t("Company.Form.Required_password")}`,
                      },
                    ]}
                  >
                    <Input.Password disabled={disable} />
                  </Form.Item>
                </Col>
                <Col lg={2} sm={0} xs={isMobile ? 0 : 2}>
                  {" "}
                </Col>
                <Col lg={5} sm={6} xs={0}>
                  {" "}
                </Col>
                <Col lg={7} sm={8} xs={isMobile ? 11 : 10}>
                  <Text strong={true}>{t("Company.Email_tls")}</Text>
                </Col>
                <Col lg={10} sm={12} xs={isMobile ? 13 : 12}>
                  {" "}
                  <Form.Item
                    name="emailTls"
                    valuePropName="checked"
                    style={styles.margin}
                  >
                    <Checkbox disabled={disable}></Checkbox>
                  </Form.Item>
                </Col>
                <Col lg={2} sm={1} xs={isMobile ? 0 : 2}></Col>
                <Col lg={5} sm={6} xs={0}></Col>
                <Col lg={7} sm={8} xs={isMobile ? 11 : 10}>
                  {" "}
                  <Text strong={true}>{t("Company.Email_title")}</Text>
                </Col>
                <Col lg={10} sm={12} xs={isMobile ? 13 : 12}>
                  {" "}
                  <Form.Item
                    name="title"
                    style={styles.margin}
                    rules={[
                      {
                        message: `${t("Company.Email_title_required")}`,
                        required: true,
                        whitespace: true,
                      },
                    ]}
                  >
                    <Input disabled={disable} />
                  </Form.Item>
                </Col>
                <Col lg={2} sm={1} xs={isMobile ? 0 : 2}></Col>
                <Col lg={5} sm={6} xs={0}></Col>
                <Col lg={7} sm={8} xs={isMobile ? 11 : 10}>
                  {" "}
                  <Text strong={true}>{t("Company.Email_port")}</Text>
                </Col>
                <Col lg={10} sm={12} xs={isMobile ? 13 : 12}>
                  {" "}
                  <Form.Item
                    name="port"
                    style={styles.margin}
                    rules={[
                      {
                        message: `${t("Company.Email_port_required")}`,
                        required: true,
                      },
                    ]}
                  >
                    <InputNumber
                      type="number"
                      className="num"
                      inputMode="numeric"
                      min={1}
                      max={1000}
                      disabled={disable}
                    />
                  </Form.Item>
                </Col>
                <Col lg={2} sm={1} xs={isMobile ? 0 : 2}></Col>
                <Col lg={0} sm={0} xs={isMobile ? 11 : 10}></Col>
                <Divider />

                <Col
                  lg={17}
                  sm={17}
                  xs={isMobile ? 13 : 14}
                  style={{ textAlign: "end" }}
                >
                  <Space>
                    <CancelButton htmlType="button" onClick={cancel} />

                    <SaveButton
                      htmlType="submit"
                      disabled={!data && smtp === "default_smtp" ? true : false}
                      loading={isLoading || editLoading}
                    />

                    <CheckEmail />
                  </Space>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      ) : (
        <Row
          className={
            mode === "dark"
              ? "account_setting_drawer_hover_dark account_setting_drawer_name"
              : "account_setting_drawer_hover account_setting_drawer_name"
          }
          onClick={onClickEmail}
        >
          <Col span={24}>
            <Row>
              <Col lg={12} sm={14} xs={24}>
                <Text strong={true}> {t("Company.SMTP_email")}</Text>
              </Col>
              <Col sm={0} xs={10}></Col>
              <Col lg={12} sm={10} xs={14}>
                {" "}
                <Row justify="space-between">
                  <Col></Col>
                  <Col>
                    <EditOutlined className="font" />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row className="line_height">
              <Col lg={5} sm={6} xs={0}></Col>
              <Col lg={7} sm={8} xs={10}>
                <Text>{t("Company.Email_host")}</Text>
                <br />
                <Text> {t("Company.Email_host_user")}</Text>
                <br />
                <Text> {t("Company.Email_password")}</Text>
                <br />
                <Text> {t("Company.Email_tls")}</Text>
                <br />
                <Text> {t("Company.Email_title")}</Text>
                <br />
                <Text> {t("Company.Email_port")}</Text>
              </Col>
              <Col lg={12} sm={10} xs={14}>
                <Text>
                  {result?.data?.default === "custom_smtp" ? (
                    data?.host
                  ) : (
                    <Text>{t("Company.Default_email_host")}</Text>
                  )}
                </Text>
                <br />
                <Text>
                  {" "}
                  {result?.data?.default === "custom_smtp" ? (
                    data?.username
                  ) : (
                    <Text>{t("Company.Default_email_host_user")}</Text>
                  )}
                </Text>
                <br />
                <Text>
                  {result?.data?.default === "custom_smtp" ? (
                    data?.password
                  ) : (
                    <Text>{t("Company.Default_email_password")}</Text>
                  )}
                </Text>
                <br />
                <Text>
                  {result?.data?.default === "custom_smtp" ? (
                    data?.use_tls?.toString()
                  ) : (
                    <Text>{t("Company.Default_email_tls")}</Text>
                  )}
                </Text>
                <br />
                <Text>
                  {result?.data?.default === "custom_smtp" ? (
                    data?.default_from_email
                  ) : (
                    <Text>{t("Company.Default_email_title")}</Text>
                  )}
                </Text>
                <br />
                <Text>
                  {result?.data?.default === "custom_smtp" ? (
                    data?.port
                  ) : (
                    <Text>{t("Company.Default_email_port")} </Text>
                  )}
                </Text>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </div>
  );
}
const styles = {
  upload: { marginTop: "4rem" },
  margin: { margin: "0rem" },
  cancel: { margin: "10px 10px" },
  title: (isTablet) => ({
    textAlign: isTablet ? "center" : "",
    padding: isTablet ? "23px 0px 23px 0px" : "",
  }),
};
