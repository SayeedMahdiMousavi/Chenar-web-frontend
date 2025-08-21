import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Colors } from "../../colors";
import {
  Drawer,
  Form,
  Col,
  Row,
  Input,
  Select,
  message,
  Alert,
  Typography,
  TreeSelect,
  Space,
} from "antd";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../ApiBaseUrl";
import { useMediaQuery } from "../../MediaQurey";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { ActionMessage } from "../../SelfComponents/TranslateComponents/ActionMessage";
import { trimString } from "../../../Functions/TrimString";
import { InfiniteScrollSelectFormItem } from "../../../components/antd";
import { useGetPermissions } from "../../../Hooks";
import { CancelButton, EditMenuItem, SaveButton } from "../../../components";
import { USERS_M } from "../../../constants/permissions";

const { Option } = Select;
const { Paragraph } = Typography;

const EditUser = ({
  record,
  baseUrl,
  permits,
  setVisible: setMenuVisible,
  handleClickEdit,
  ...rest
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const isTablet = useMediaQuery("(max-width:768px)");
  const isMobile = useMediaQuery("(max-width:425px)");

  //get permissions list
  const { data: permissions } = useGetPermissions();

  const showDrawer = async () => {
    setUser(record?.user_type);
    setUserName(record?.username);
    setVisible(true);
    setMenuVisible(false);
    handleClickEdit();
    setPassword("");
    form.setFieldsValue({
      user: record?.user_type,
      userName: record?.username,
      firstName: record?.first_name,
      email: record?.email,
      employee: {
        value: record?.user_staff?.id,
        label: record?.user_staff?.full_name,
      },
      permissions: permits,
    });
  };

  const onClose = () => {
    setVisible(false);
  };
  const onChangeName = async (value) => {
    setUser(value);
  };
  const onChangePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (
      (reg.test(value) &&
        reg1.test(value) &&
        reg2.test(value) &&
        value !== userName) ||
      value === ""
    ) {
      setErrorMessage(false);
    }
  };

  const onChangeUserName = (e) => {
    setUserName(e.target.value);
  };

  const EditUser = async (value) => {
    await axiosInstance
      .patch(`${baseUrl}${record?.username}/`, value)
      .then((res) => {
        setLoading(false);

        message.success(
          <ActionMessage name={res.data.username} message="Message.Update" />
        );
        setVisible(false);
        form.resetFields();
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response.data?.user_type?.[0]) {
          message.error(`${error?.response.data?.user_type?.[0]}`);
        } else if (error?.response?.data?.username?.[0]) {
          message.error(`${error?.response.data?.username?.[0]}`);
        } else if (error?.response?.data?.first_name?.[0]) {
          message.error(`${error?.response.data?.first_name?.[0]}`);
        } else if (error?.response?.data?.user_staff?.[0]) {
          message.error(`${error?.response.data?.user_staff?.[0]}`);
        } else if (error?.response?.data?.email?.[0]) {
          message.error(`${error?.response.data?.email?.[0]}`);
        } else if (error?.response?.data?.password?.[0]) {
          message.error(`${error?.response.data?.password?.[0]}`);
        }
      });
  };
  const { mutate: mutateEditUsers } = useMutation(EditUser, {
    onSuccess: () => queryClient.invalidateQueries(`${baseUrl}`),
  });

  const onFinish = () => {
    form
      .validateFields()
      .then(async (value) => {
        const allData = {
          password: value?.password && value?.password,
          username: trimString(value?.userName),
          first_name: trimString(value?.firstName),
          email: trimString(value?.email),
          user_type: value?.user,
          permits: value?.permissions,
          user_staff: value?.employee?.value,
        };
        if (allData.password === "") {
          delete allData["password"];
        }

        if (password) {
          if (
            !reg.test(password) ||
            !reg1.test(password) ||
            !reg2.test(password) ||
            password === userName
          ) {
            setErrorMessage(true);
            return;
          } else {
            setErrorMessage(false);

            setLoading(true);
            mutateEditUsers(allData, {
              onSuccess: () => {},
            });
          }
        } else {
          setLoading(true);

          mutateEditUsers(allData, {
            onSuccess: () => {},
          });
        }
      })
      .catch((info) => {
        
      });
  };

  const handleAfterVisibleChange = (value) => {
    if (value === false) {
      setLoading(false);
      form.resetFields();
      setPassword("");
      setUserName("");
      setErrorMessage(false);
      setUser("");
    }
  };
  return (
    <div>
      <EditMenuItem {...rest} onClick={showDrawer} permission={USERS_M} />

      <Drawer
        maskClosable={false}
        title={t("Manage_users.Update_user_information")}
        width={isMobile ? "80%" : isTablet ? 500 : 500}
        onClose={onClose}
        open={visible}
        afterVisibleChange={handleAfterVisibleChange}
        placement={t("Dir") === "ltr" ? "right" : "left"}
        footer={
          <div className="textAlign__end">
            <Space>
              <CancelButton onClick={onClose} />
              <SaveButton onClick={onFinish} loading={loading} />
            </Space>
          </div>
        }
      >
        <Form layout="vertical" hideRequiredMark form={form}>
          <Row>
            <Col span={24}>
              {errorMessage ? (
                <Alert
                  message={t("Manage_users.Password_validation_error")}
                  type="error"
                />
              ) : (
                <div></div>
              )}
              <Form.Item
                name="user"
                label={t("Sales.Product_and_services.Type")}
              >
                <Select onChange={onChangeName}>
                  <Option value="admin">
                    {t("Manage_users.Company_admin")}
                  </Option>
                  {/* <Option value="standard">
                    {t("Manage_users.Standard_user")}
                  </Option>
                  <Option value="report_only">
                    {t("Manage_users.Reports_only")}
                  </Option> */}
                  <Option value="custom">
                    {t("Manage_users.Custom_user")}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            {user === "custom" && (
              <Col span={24}>
                <Form.Item
                  label={
                    <span>
                      {t("Manage_users.Permissions")}
                      <span className="star">*</span>
                    </span>
                  }
                  name="permissions"
                  rules={[
                    {
                      required: true,
                      message: t("Manage_users.Permissions_required"),
                    },
                  ]}
                >
                  <TreeSelect
                    showSearch
                    treeData={permissions}
                    treeCheckable={true}
                    treeNodeFilterProp="title"
                    placeholder={t("Manage_users.User_permissions_placeholder")}
                    className="num"
                    showarrow={true}
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={24}>
              <Form.Item
                name="userName"
                label={
                  <span>
                    {t("Form.User_name")}
                    <span className="star">*</span>
                  </span>
                }
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: `${t("Form.User_name_required")}`,
                  },
                ]}
              >
                <Input onChange={onChangeUserName} />
              </Form.Item>
              <Form.Item name="firstName" label={t("Form.Name1")}>
                <Input />
              </Form.Item>
              <InfiniteScrollSelectFormItem
                name="employee"
                label={
                  <span>
                    {t("Employees.Employee")}
                    <span className="star">*</span>
                  </span>
                }
                fields="full_name,id"
                baseUrl="/staff_account/staff/"
                rules={[
                  {
                    required: true,
                    message: t("Employees.Employee_required"),
                  },
                ]}
              />

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
              <Form.Item
                label={
                  <span>
                    {t("Company.Form.Password")}
                    <span className="star">*</span>
                  </span>
                }
                validateStatus={errorMessage ? "error" : undefined}
                name="password"
                dependencies={[String & Number]}
                style={styles.margin}
              >
                <Input.Password onChange={onChangePassword} />
              </Form.Item>
            </Col>
            {password && (
              <Col span={24}>
                {" "}
                <Form.Item
                  name="confirm"
                  label={
                    <span>
                      {t("Company.Form.Confirm_password")}
                      <span className="star">*</span>
                    </span>
                  }
                  dependencies={["password"]}
                  hasFeedback
                  style={styles.margin}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: `${t("Company.Form.Required_confirm")}`,
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          `${t("Company.Form.Confirm_match")}`
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
            )}
            <Col span={24}>
              {password && (
                <Paragraph>
                  {reg.test(password) ? (
                    <CheckOutlined className="list_tick" />
                  ) : (
                    <CloseOutlined style={styles.close} />
                  )}
                  &nbsp; {t("Manage_users.Password_validation_error1")}
                  <br />
                  {reg1.test(password) ? (
                    <CheckOutlined className="list_tick" />
                  ) : (
                    <CloseOutlined style={styles.close} />
                  )}
                  &nbsp; {t("Manage_users.Password_validation_error2")}
                  <br />
                  {password !== userName ? (
                    <CheckOutlined className="list_tick" />
                  ) : (
                    <CloseOutlined style={styles.close} />
                  )}
                  &nbsp; {t("Manage_users.Password_validation_error3")} <br />
                  {reg2.test(password) ? (
                    <CheckOutlined className="list_tick" />
                  ) : (
                    <CloseOutlined style={styles.close} />
                  )}
                  &nbsp; {t("Manage_users.Password_validation_error4")} <br />
                </Paragraph>
              )}
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};
const reg = /(?=.*?[A-z]).{8,}/;
const reg1 = /(?=.*?[#?!@$%^&*-])/;
const reg2 = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/;
const styles = {
  margin: { marginBottom: "12px" },
  cancel: { margin: " 0 8px" },
  userSetting: { marginBottom: ".8rem" },
  close: { color: `${Colors.red}` },
};

export default EditUser;
