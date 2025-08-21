import React, { useState, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Modal,
  Row,
  Col,
  Space,
  App,
} from "antd";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../ApiBaseUrl";
import { useMutation, useQueryClient } from "react-query";
import { Colors } from "../../colors";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useMediaQuery } from "../../MediaQurey";
import { ModalDragTitle } from "../../SelfComponents/ModalDragTitle";
import Draggable from "react-draggable";
import { ActionMessage } from "../../SelfComponents/TranslateComponents/ActionMessage";
import { useGetUserInfo } from "../../../Hooks";
import { CancelButton, SaveButton } from "../../../components";

const { Paragraph } = Typography;
export default function ChangePassword(props) {
  const queryClient = useQueryClient();
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [form] = Form.useForm();
  const [password, setPassword] = useState("");
  const isBgTablet = useMediaQuery("(max-width: 1024px)");
  const isTablet = useMediaQuery("(max-width: 768px)");
  const isMobile = useMediaQuery("(max-width: 425px)");
   const nodeRef = useRef(null);
  const { message } = App.useApp();

  const changeProfilePassword = async (value) => {
    await axiosInstance
      .patch(
        `/user_account/user_profile/${props?.data?.username}/`,
        value
      )
      .then(() => {
        props.setVisible(false);
        message.success(
          <ActionMessage
            name={t("Company.Form.Password")}
            message="Message.Update"
          />
        );
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response?.data?.password?.[0]) {
          message.error(`${error?.response?.data?.password?.[0]}`);
        } 
      });
  };

  const { mutate: mutatePassword } = useMutation(changeProfilePassword, {
    onSuccess: () =>
      queryClient.invalidateQueries(`/user_account/user_profile/`),
  });
  const onFinish = async () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        mutatePassword({
          password: values.password,
        });
      })
      .catch(() => {
        setLoading(false);
        message.error(t("Company.Form.Required_password"));
        
      });
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onCancel = () => {
    props.setVisible(false);
  };

  const handelAfterClose = () => {
    setLoading(false);

    props.setIsShowModal({
      visible: false,
    });
    form.resetFields();
  };

  // get user information
  const { data } = useGetUserInfo();

  const userName = data?.username;

  return (
    <div className="">
      <Button type="primary" onClick={props.handleOk} loading={props.loading}>
        {t("Sales.Customers.Table.Send")}
      </Button>
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t("Profile.Edit_your_password")}
          />
        }
        modalRender={(modal) => (
            <Draggable nodeRef={nodeRef} disabled={disabled}>
               <div ref={nodeRef}>{modal}</div>
           </Draggable>
        )}
        afterClose={handelAfterClose}
        destroyOnClose
        centered
        open={props.visible}
        onCancel={onCancel}
        styles={styles.bodyStyle}
        width={isMobile ? "100%" : isTablet ? "80%" : isBgTablet ? 400 : 400}
        footer={
          <Row justify="end" align="middle">
            <Col>
              <CancelButton onClick={onCancel} />
              <SaveButton onClick={onFinish} loading={loading} />
            </Col>
          </Row>
        }
      >
        <Form requiredMark layout="vertical" form={form}>
          <Form.Item
            label={
              <span>
                {t("Company.Form.Password")}
                <span className="star">*</span>
              </span>
            }
            name="password"
            style={styles.margin}
            rules={[
              {
                required: true,
                message: `${t("Company.Form.Required_password")}`,
              },
            ]}
          >
            <Input.Password onChange={onChangePassword} />
          </Form.Item>

          <Form.Item
            name="confirm"
            label={
              <span>
                {t("Company.Form.Confirm_password")}
                <span className="star">*</span>
              </span>
            }
            style={styles.margin}
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: `${t("Company.Form.Required_confirm")}`,
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(`${t("Company.Form.Confirm_match")}`);
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Paragraph style={styles.margin}>
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
            <Space size={2} align="start">
              {reg2.test(password) ? (
                <CheckOutlined className="list_tick" />
              ) : (
                <CloseOutlined style={styles.close} />
              )}
              &nbsp; {t("Manage_users.Password_validation_error4")}
            </Space>
          </Paragraph>
        </Form>
      </Modal>
    </div>
  );
}
const reg = /(?=.*?[A-z]).{8,}/;
const reg1 = /(?=.*?[#?!@$%^&*-])/;
const reg2 = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/;
const styles = {
  close: { color: `${Colors.red}` },
  margin: { margin: "4px" },
  bodyStyle: { padding: "12px 24px" },
};
