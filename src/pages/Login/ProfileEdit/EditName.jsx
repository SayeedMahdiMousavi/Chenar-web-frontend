import  { useState } from "react";
import { Modal, Col, Row,  Menu, Typography, Space } from "antd";
import { useMediaQuery } from "../../MediaQurey";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../ApiBaseUrl";
import { Form, Input, message } from "antd";
import { useTranslation } from "react-i18next";
import { Colors } from "../../colors";
import { MailOutlined, UserOutlined, EditOutlined } from "@ant-design/icons";
import { ActionMessage } from "../../SelfComponents/TranslateComponents/ActionMessage";
import { trimString } from "../../../Functions/TrimString";
import { ItemSkeleton } from "../UserProfile";
import { CancelButton, SaveButton } from "../../../components";

const EditName = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const isTablet = useMediaQuery("(max-width: 768px)");
  const isMobile = useMediaQuery("(max-width: 425px)");
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsShowModal({
      visible: true,
    });
    form.setFieldsValue({
      name: props?.data?.first_name,
      email: props?.data?.email,
    });
  };

  const onCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };

  const handelAfterClose = () => {
    setLoading(false);
    form.resetFields();
  };

  const changeNameOrEmail = async (value) => {
    await axiosInstance
      .patch(
        `/user_account/user_profile/${props?.data?.username}/`,
        value
      )
      .then(() => {
        setIsShowModal({
          visible: false,
        });

        if (props.name === "name") {
          message.success(
            <ActionMessage name={t("Form.Name1")} message="Message.Update" />
          );
        } else {
          message.success(
            <ActionMessage name={t("Form.Email")} message="Message.Update" />
          );
        }
        queryClient.invalidateQueries(`/user_account/user_profile/`);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const { mutate: mutateChangeNameOrEmail } = useMutation(changeNameOrEmail, {
    // onSuccess: () =>
    // queryClient.invalidateQueries(`/user_account/users/user_profile/`),
  });

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);

        const data =
          props.name === "name"
            ? {
                first_name: trimString(values.name),
              }
            : {
                email: values.email,
              };
        mutateChangeNameOrEmail(data);
      })
      .catch(() => {
        
      });
  };

  return (
    <div>
      <Menu style={styles.menu} selectable={false} mode="inline">
        <Menu.Item
          key="1"
          className={
            props.data?.user_theme?.type === "dark"
              ? "profile_menu_hove_dark"
              : "profile_menu_hove"
          }
          style={styles.menuItem}
          onClick={showModal}
        >
          <ItemSkeleton isLoading={props?.loading}>
            <div className="profile_menu_content">
              {props.name === "name" ? (
                <UserOutlined style={styles.menuItemIcon} />
              ) : (
                <MailOutlined style={styles.menuItemIcon} />
              )}
              <Typography.Text>
                {props.name === "name"
                  ? props?.data?.first_name
                  : props?.data?.email}
                <br />
                <Typography.Text strong={true}>
                  {props.name === "name"
                    ? `${t("Form.Name1")}`
                    : `${t("Form.Email")}`}
                </Typography.Text>
              </Typography.Text>
            </div>
            <EditOutlined className="profile_edit_icon" />
          </ItemSkeleton>
        </Menu.Item>
      </Menu>
      <Modal
        maskClosable={false}
        title={null}
        destroyOnClose
        afterClose={handelAfterClose}
        centered
        open={isShowModal.visible}
        onCancel={onCancel}
        width={isMobile ? "100%" : isTablet ? 350 : 350}
        footer={null}
      >
        <Form
          form={form}
          hideRequiredMark={true}
          scrollToFirstError={true}
          layout="vertical"
        >
          {props.name === "name" ? (
            <Form.Item
              name="name"
              label={
                <Typography.Title style={styles.formItemLabel} level={5}>
                  {t("Form.Name1")}
                </Typography.Title>
              }
            >
              <Input />
            </Form.Item>
          ) : (
            <Form.Item
              name="email"
              label={
                <Typography.Title style={styles.formItemLabel} level={5}>
                  {t("Form.Email")}
                </Typography.Title>
              }
              rules={[
                {
                  type: "email",
                  message: t("Form.Email_Message"),
                },
                {
                  required: true,
                  message: t("Company.Form.Required_email"),
                },
              ]}
            >
              <Input />
            </Form.Item>
          )}

          <Form.Item style={styles.formItemLabel}>
            <Row justify="end" align="middle">
              <Col>
                <Space>
                  <CancelButton onClick={onCancel} />
                  <SaveButton
                    onClick={handleOk}
                    loading={loading}
                    htmlType="submit"
                  />
                </Space>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const styles = {
  formItemLabel: { margin: "3px", paddingTop: "10px" },
  menuItem: {
    lineHeight: "20px",
    padding: "10px 0px",
    height: "fit-content",
    margin: "0px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuItemIcon: {
    fontSize: "20px",
    color: `${Colors.gray}`,
    paddingTop: "8px",
    paddingInlineEnd: "24px",
  },
  menu: { border: "none" },
};

export default EditName;
