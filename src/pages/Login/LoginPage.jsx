import  { useState } from "react";
import { Form, Input, Button, Checkbox, Row, Col, App } from "antd";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../ApiBaseUrl";
import { trimString } from "../../Functions/TrimString";
import { Detector } from "react-detect-offline";
import { useDarkMode } from "../../Hooks/useDarkMode";
import { lessVars } from "../../theme/index";
import { allPermissions } from "../../constants/permissions";

import {
  USER_MODEL_LS,
  USER_PERMISSIONS_LS,
  USER_TYPE,
} from "../../constants/localStorageVars";
import { DASHBOARD } from "../../constants/routes";
import { Image } from "../../components";
import { FaUserAlt, FaLock  } from "react-icons/fa";
import LoginImage from "../../assets/svg/LoginImage";
import LoginSetting from "./LoginSetting";
import { Colors } from "../colors";

const loadPrivateContent = () => {
  return import("../Dashboard");
};



const LoginPage = (props) => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  // const [permissions, setPermissions] = usePermissions();
  const { i18n } = useTranslation();
  const [mode, setMode] = useDarkMode();
  const [loading, setLoading] = useState(false);

  let oneRequest = false;
  const onFinish = async (values) => {
    if (oneRequest) {
      return;
    }
    oneRequest = true;
    setLoading(true);

    try {
      await axiosInstance
        .post("/user_account/tokens/obtain/", {
          username: trimString(values.username),
          password: values.password,
        })
        .then(async (response) => {
          
          //theme
          if (response?.data?.user_theme?.type === "dark") {
            if (mode !== "dark") {
              window.less.modifyVars(lessVars.dark);
              setMode("dark");
            }
          } else {
            if (mode !== "light") {
              window.less.modifyVars(lessVars.light);
              setMode("light");
            }
          }
          //language
          if (response?.data?.user_language?.symbol !== i18n?.language) {
            // moment.locale(response?.data?.user_language?.symbol);
            await i18n.changeLanguage(
              `${response?.data?.user_language?.symbol}`
            );
          }

          axiosInstance.defaults.headers["Authorization"] =
            "Bearer " + response.data.access;
          localStorage.setItem("access_token", response.data.access);
          localStorage.setItem("refresh_token", response.data.refresh);
          localStorage.setItem("user_id", response?.data?.username);
          localStorage.setItem(USER_TYPE, response?.data?.user_type);
          
          const newAllPermissions = response?.data?.user_permit?.map((item) => {
            return item?.codename 
          })
        
          localStorage.setItem(USER_PERMISSIONS_LS,JSON.stringify(  newAllPermissions  ))

          // const newPermissions = response?.data?.user_permit?.map(
          //   (item) => item?.codename
          // );
          // ?.slice(10, 50);
          // const newModels = response?.data?.user_permit?.reduce(
          //   (models, item) => {
          //     const newItem = models?.find(
          //       (modalItem) => modalItem === item?.content_type
          //     );
          //     if (Boolean(newItem)) {
          //       return models;
          //     } else {
          //       return [...models, item?.content_type];
          //     }
          //   },
          //   []
          // );
          // ?.slice(10, 35);

          // const newModels = allPermissions?.reduce((models, item) => {
          //   const newItem = models?.find(
          //     (modalItem) => modalItem === item?.model
          //   );

          //   if (Boolean(newItem)) {
          //     return models;
          //   } else {
          //     return [...models, item?.model];
          //   }
          // }, []);
          const newModels = response?.data?.user_permit?.map((item) => {
            // 
            return item?.content_type
          })

          
          const newPermissions = allPermissions?.reduce((permissions, item) => {
            const itemPermissions = item?.permission_set?.map(
              (item) => item?.codename
            );
            return [...permissions, ...itemPermissions];
          }, []);
          // 
          // window.localStorage.setItem(
          //   USER_PERMISSIONS_LS,
          //   `${newPermissions?.join(" ")} `
          // );
          // window.localStorage.setItem(
          //   USER_MODEL_LS,
          //   `${newModels?.join(" ")} ${DASHBOARD_M}`
          // );

          let uniqueArray = newModels.filter(function(item, pos, self) {
            return self.indexOf(item) == pos;
        })
          localStorage.setItem(USER_MODEL_LS , `${JSON.stringify(uniqueArray)}`)
          
          // setPermissions({
          //   models: `${newModels?.join(" ")} ${DASHBOARD}`,
          //   userPermit: `${newPermissions?.join(" ")} `,
          // });
          navigate(DASHBOARD);
          // const permit = response?.data?.user_permit?.reduce((sum, item) => {
          //   return `${sum} ${item?.codename?.toLowerCase()}`;
          // }, "");
          // const finalPermit = `${permit} `;
          // localStorage.setItem("user_permit", finalPermit);
          // props.setPermit(finalPermit);

          // const firstUrl = getFirstUrl(finalPermit);
          // localStorage.setItem(
          //   "permit_url",
          //   response?.data?.user_permit?.[0]?.codename.toLowerCase()
          // );

          // debounceFunc(firstUrl, finalPermit);
          // history.push(`/${firstUrl}`);

          return response;
        })
        .catch((error) => {
          setLoading(false);
          if (error.response?.data) {
            message.error("Username or password is incorrect");
          }
          console.log("error", error);
          
          message.error("Something went wrong!", 2);

        });
      oneRequest = false;
    } catch (error) {
      oneRequest = false;
      
    }
  };
  const login = false;
  return (
    <Detector
      render={({ online }) => (
        <Form
          //   name='normal_login'
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
          layout="vertical"
        >
          <LoginImage
            className="box-layout"
            style={online ? {} : { height: "calc(100vh - 30px)" }}
          />
          {login ? (
            <LoginSetting />
          ) : (
            <div
              className="box-layout__login-box"
              style={{ borderRadius: "15px" }}
            >
              <Image
                width={60}
                height={60}
                src="/favicon.ico"
                preview={false}
              />
              <h2 className="box-layout__title">
                {/* {t("Accounting.1")} */}
                Chenar Accounting System
              </h2>

              <Form.Item
                name="username"
                rules={[
                  { required: true, message: `User name is required !` },
                  // { required: true, message: `${t("Form.User_name_required")}` },
                ]}
                style={styles.formItem}
              >
                <Input
                  prefix={<FaUserAlt style={styles.icon} />}
                  placeholder="User name"
                  // placeholder={t("Form.User_name")}
                  onFocus={loadPrivateContent}
                  onMouseEnter={loadPrivateContent}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: `Password is required !`,
                    // message: `${t("Company.Form.Required_password")}`,
                  },
                ]}
                style={styles.formItem}
              >
                <Input
                  prefix={<FaLock style={styles.icon} />}
                  type="password"
                  placeholder="Password"
                  onFocus={loadPrivateContent}
                  onMouseEnter={loadPrivateContent}

                  // placeholder={t("Company.Form.Password")}
                />
              </Form.Item>
              <Form.Item style={styles.formItem}>
                <Row justify="space-between">
                  <Col>
                    {" "}
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox style={{ ...styles.forgetPassword, color: Colors.primaryColor }}>
                        Remember me
                      </Checkbox>
                      {/* <Checkbox>{t("Manage_users.Remember_me")}</Checkbox> */}
                    </Form.Item>
                  </Col>
                  <Col>
                    {" "}
                    <Link to="/reset" style={styles.forgetPassword}>
                      Forgot password ?
                      {/* {t("Manage_users.Forgot_password")} */}
                    </Link>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item style={{ marginBottom: "0px" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="num"
                  loading={loading}
                  style={{ width: "100%", backgroundColor: Colors.primaryColor }}
                >
                  Log in
                </Button>
              </Form.Item>
            </div>
          )}
        </Form>
      )}
    />
  );
};

const styles = {
  icon: { marginInlineEnd: "5px", color: Colors.primaryColor },
  forgetPassword: { fontSize: "13px", color: Colors.primaryColor,},
  formItem: { textAlign: "start" },
};
export default LoginPage;
