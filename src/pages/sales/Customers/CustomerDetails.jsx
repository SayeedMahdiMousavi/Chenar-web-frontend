import React, { useState, useEffect, useCallback } from "react";
import EditCustomer from "./EditCustomer";
import { useTranslation } from "react-i18next";
import CustomerDetailsShowMore from "./CustomerDetailsShowMore";
import CustomerDetailsActive from "./CustomerDetailsActive";
import {
  Row,
  Col,
  Divider,
  Tooltip,
  Tabs,
  Input,
  List,
  Upload,
  Typography,
  message,
  Space,
  Spin,
  Affix,
} from "antd";
import {
  MailTwoTone,
  PhoneTwoTone,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { useMediaQuery } from "../../MediaQurey";
// import NewTransaction from "./Transaction/NewTransaction";
import { useParams } from "react-router-dom";
import { Colors } from "../../colors";
import axiosInstance from "../../ApiBaseUrl";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { ActionMessage } from "../../SelfComponents/TranslateComponents/ActionMessage";
import { checkPermissions } from "../../../Functions";
import { CUSTOMER_M } from "../../../constants/permissions";
import { PageBackIcon } from "../../../components";
import { CUSTOMER } from "../../../constants/routes";

const baseUrl = "/customer_account/customer/";
const { Paragraph } = Typography;
const { Dragger } = Upload;
const { TabPane } = Tabs;
const { TextArea } = Input;
const gray = Colors.borderColor;

function CustomerDetails(props) {
  const queryClient = useQueryClient();
  const params = useParams();
  const isMobile = useMediaQuery("(max-width: 576px)");
  const isMobileMini = useMediaQuery("(max-width: 425px)");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [collapse, setCollapse] = useState(isMobile ? false : true);
  const { t } = useTranslation();
  const [notes, setNotes] = useState("");
  const [save, setSave] = useState(true);
  const isSubMobile = useMediaQuery("(max-width: 400px)");

  const getCustomer = async ({ queryKey }) => {
    const { id } = queryKey?.[1] || {};
    const { data } = await axiosInstance.get(
      `/customer_account/customer/${id}/?expand=discount_card,discount_card.discount_card,category`
    );
    return data;
  };

  const result = useQuery(
    ["/customer_account/customer1/", { id: params?.id }],
    getCustomer,
    { enabled: !!params?.id }
  );

  const [fileList, setFileList] = useState([]);
  const [file, setFile] = useState({});
  useEffect(() => {
    const attachment =
      result?.data?.attachment && result?.data?.attachment.split("/");
    const attachmentData = result?.data?.attachment
      ? [
          {
            uid: "-1",
            name: attachment?.[6],
            status: "done",
            url: result?.data?.attachment,
          },
        ]
      : [];
    setFileList(attachmentData);
    setNotes(result?.data && result?.data?.notes);
  }, [result.data]);

  const onClickShow = useCallback(() => {
    setCollapse((prev) => !prev);
  }, []);

  const data = [
    {
      title: `${t("Sales.Customers.Customer")}`,
      content: result?.data?.full_name,
    },
    {
      title: `${t("Form.Email")}`,
      content: (
        <a href={`mailto:${result?.data?.email}`} target="_blank">
          {" "}
          {result?.data?.email}{" "}
        </a>
      ),
    },
    {
      title: `${t("Form.Phone")}`,
      content: result?.data?.phone_number,
    },
    {
      title: `${t("Form.Mobile")}`,
      content: result?.data?.mobile_number ? result?.data?.mobile_number : "",
    },
  ];
  const data1 = [
    {
      title: `${t("Form.Fax")}`,
      content: `${result?.data?.fax_number}`,
    },
    {
      title: `${t("Form.Website")}`,
      content: (
        <a href={`${result?.data?.website}`} target="_blank">
          {" "}
          {result?.data?.website}{" "}
        </a>
      ),
    },
    {
      title: `${t("Form.Billing_address")}`,
      content: `${
        result?.data?.full_billing_address
          ? result?.data?.full_billing_address
          : ""
      }`,
    },
    {
      title: `${t("Form.Shipping_address")}`,
      content: `${
        result?.data?.full_shipping_address
          ? result?.data?.full_shipping_address
          : ""
      }`,
    },
  ];

  const editAttachment = async (value) => {
    await axiosInstance
      .patch(`/customer_account/customer/${props.match.params.id}/`, value, {
        timeout: 0,
        onUploadProgress: (progressEvent) => {
          var percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      })
      .then((res) => {
        setFileList([file]);
        message.success(
          <ActionMessage name={file?.name} message="Message.Update" />
        );
        setLoading(false);
        setProgress(0);
        setFile({});
        const index = fileList.indexOf(fileList?.[1]);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(newFileList);
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response?.data?.attachment) {
          message.error(`${error?.response?.data?.attachment?.[0]}`);
        }
      });
  };
  const { mutate: mutateEditAttachment } = useMutation(editAttachment, {
    onSuccess: () => {
      queryClient.invalidateQueries(`/customer_account/customer/`);
      queryClient.invalidateQueries(`/customer_account/customer`);
      queryClient.invalidateQueries(`/customer_account/customer1/`);
    },
  });

  const onChangeAttachment = async () => {
    try {
      const formData = new FormData();
      formData.append("attachment", file);
      setLoading(true);
      mutateEditAttachment(formData);
    } catch (info) {
      console.log("Validate Failed:", info);
      
    }
  };

  const deleteAttachment = async (value) => {
    await axiosInstance
      .patch(`/customer_account/customer/${props.match.params.id}/`, value)
      .then((res) => {
        message.success(
          <ActionMessage name={fileList?.[0]?.name} message="Message.Remove" />
        );
        const index = fileList.indexOf(fileList?.[0]);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(newFileList);
        setFile({});
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response?.data?.attachment) {
          message.error(`${error?.response?.data?.attachment?.[0]}`);
        }
      });
  };

  const { mutate: mutateDeleteAttachment } = useMutation(deleteAttachment, {
    onSuccess: () => {
      queryClient.invalidateQueries(`/customer_account/customer/`);
      queryClient.invalidateQueries(`/customer_account/customer`);
      queryClient.invalidateQueries(`/customer_account/customer1/`);
    },
  });
  const prop = {
    customRequest: onChangeAttachment,
    name: "file",
    maxCount: 1,
    onRemove: (file) => {
      const formData = { is_delete_attach: true };
      (async () => {
        mutateDeleteAttachment(formData);
      })();
    },
    fileList: fileList,
    beforeUpload: (file, fileList) => {
      setFile(file);
    },
  };

  const onChangeNotes = (e) => {
    setSave(false);
    setNotes(e.target.value);
  };

  const editNote = async (value) => {
    await axiosInstance
      .patch(`/customer_account/customer/${props.match.params.id}/`, value, {})
      .then((res) => {
        setSave(true);
      })
      .catch((error) => {
        if (error?.response?.data?.notes) {
          message.error(`${error?.response?.data?.notes?.[0]}`);
        } else {
          message.error("Something went wrong ");
        }
      });
  };

  const { mutate: mutateEditNotes } = useMutation(editNote, {
    onSuccess: () => {
      queryClient.invalidateQueries(`/customer_account/customer/`);
      queryClient.invalidateQueries(`/customer_account/customer`);
      queryClient.invalidateQueries(`/customer_account/customer1/`);
    },
  });
  const onPressEnterNotes = async (e) => {
    try {
      mutateEditNotes({ notes: e.target.value });
    } catch (info) {
      console.log("Validate Failed:", info);
      
    }
  };

  return (
    <Row justify="end" style={styles.body}>
      {collapse ? (
        <Col md={5} sm={7} xs={24}>
          <Affix
            offsetTop={0}
            target={() => document.getElementById("mainComponent")}
          >
            <Row className="num" justify="start">
              <Col style={{ width: "calc(100% - 1px)" }}>
                <Row gutter={[0, 10]} style={styles.sidebar}>
                  <Col span={24}>
                    <Row justify="space-between">
                      <Col span={19}>
                        <PageBackIcon
                          previousPageName={t("Sales.Customers.1")}
                          url={CUSTOMER}
                        />
                      </Col>

                      <Col
                        sm={{ span: 4 }}
                        xs={{ span: 4 }}
                        style={{ textAlign: "end" }}
                      >
                        <MenuFoldOutlined
                          onClick={onClickShow}
                          className="table__header2-icon"
                        />
                      </Col>
                    </Row>
                  </Col>

                  <Col sm={24} xs={{ span: 24 }}>
                    <CustomerDetailsShowMore baseUrl={baseUrl} />
                  </Col>
                </Row>
              </Col>
              <Col>
                <Divider
                  type="vertical"
                  className="divider"
                  style={styles.divider}
                />
              </Col>
            </Row>
          </Affix>
        </Col>
      ) : (
        <Col md={1} xs={2}>
          <Affix
            offsetTop={0}
            target={() => document.getElementById("mainComponent")}
          >
            <Row className="num">
              <Col
                style={{
                  paddingTop: "15px",
                  width: "calc(100% - 1px)",
                  textAlign: "center",
                }}
              >
                <MenuUnfoldOutlined
                  onClick={onClickShow}
                  className="table__header2-icon"
                />
              </Col>

              <Col>
                <Divider
                  type="vertical"
                  className="divider"
                  style={styles.divider}
                />
              </Col>
            </Row>
          </Affix>
        </Col>
      )}

      <Col
        md={collapse ? 19 : 23}
        sm={collapse ? 17 : 22}
        xs={isMobile && collapse ? 0 : 22}
        // className={online ? "page-body" : "page-body-offline"}
      >
        <Spin
          tip={t("Message.Loading")}
          spinning={result?.isFetching || result?.isLoading ? true : false}
        >
          <Row justify="space-around">
            <Col span={23}>
              <Row className="customer__details-header" align="middle">
                <Col
                  md={7}
                  sm={collapse ? 7 : 8}
                  xs={8}
                  //
                >
                  <Typography.Text
                    strong={true}
                    className="ellipses__header boob"
                  >
                    {result?.data?.full_name}
                  </Typography.Text>
                </Col>
                <Col md={2} sm={collapse ? 3 : 2} xs={collapse ? 3 : 4}>
                  <Row justify="space-around">
                    <Col span={11}>
                      <a href={`mailto:${result?.data?.email}`} target="_blank">
                        <MailTwoTone
                          className="table__header2-icon"
                          twoToneColor={Colors.primaryColor}
                        />
                      </a>
                    </Col>
                    <Col span={12}>
                      <Tooltip
                        title={
                          result?.data?.mobile_number
                            ? result?.data?.mobile_number
                            : t("Sales.Customers.Details.Phone_notFound")
                        }
                      >
                        <PhoneTwoTone
                          className="table__header2-icon"
                          twoToneColor={Colors.primaryColor}
                        />
                      </Tooltip>
                    </Col>
                  </Row>
                </Col>
                <Col
                  xl={
                    collapse ? { span: 8, offset: 7 } : { span: 6, offset: 9 }
                  }
                  lg={
                    collapse ? { span: 10, offset: 5 } : { span: 8, offset: 7 }
                  }
                  md={
                    collapse ? { span: 11, offset: 4 } : { span: 9, offset: 6 }
                  }
                  sm={
                    collapse ? { span: 14, offset: 0 } : { span: 12, offset: 2 }
                  }
                  xs={{ span: 12, offset: 0 }}
                >
                  {result?.data?.status === "active" ? (
                    <Row
                      justify="space-around"
                      align="middle"
                      gutter={isSubMobile ? [0, 6] : []}
                    >
                      <Col sm={7} xs={isSubMobile ? { span: 13 } : { span: 7 }}>
                        {/* <EditCustomer
                              record={result && result?.data}
                              attachment={fileList?.[0]?.name}
                              baseUrl={baseUrl}
                            /> */}
                      </Col>

                      <Col
                        sm={15}
                        xs={isSubMobile ? { span: 20 } : { span: 15 }}
                      >
                        {/* <NewTransaction /> */}
                      </Col>
                    </Row>
                  ) : (
                    <Row>
                      <Col
                        xs={
                          isSubMobile
                            ? { span: 18, offset: 3 }
                            : { span: 14, offset: 8 }
                        }
                      >
                        <CustomerDetailsActive record={result?.data} />
                      </Col>
                    </Row>
                  )}
                </Col>
              </Row>
              <Row className="num">
                <Col
                  xl={collapse ? 17 : 19}
                  lg={collapse ? 15 : 17}
                  md={collapse ? 14 : 16}
                  sm={collapse ? 12 : 14}
                  xs={14}
                >
                  <Row gutter={[8, 10]}>
                    <Col
                      xl={collapse ? 20 : 21}
                      md={collapse ? 18 : 19}
                      sm={collapse ? 13 : 15}
                      xs={isSubMobile ? 13 : 15}
                      className="ellipses"
                    >
                      {result?.data?.full_billing_address
                        ? result?.data?.full_billing_address
                        : ""}
                    </Col>
                    <Col xl={10} lg={11} sm={13} xs={20}>
                      <Paragraph className="ellipses" ellipsis={{ rows: 1 }}>
                        {notes}
                      </Paragraph>
                    </Col>
                  </Row>
                </Col>
                <Col
                  xl={
                    collapse ? { span: 5, offset: 2 } : { span: 4, offset: 1 }
                  }
                  lg={
                    collapse ? { span: 6, offset: 3 } : { span: 5, offset: 2 }
                  }
                  md={
                    collapse ? { span: 7, offset: 3 } : { span: 6, offset: 2 }
                  }
                  sm={
                    collapse ? { span: 9, offset: 3 } : { span: 8, offset: 2 }
                  }
                  xs={
                    isSubMobile
                      ? { span: 7, offset: 0 }
                      : { span: 8, offset: 2 }
                  }
                >
                  <Row gutter={[0, 10]}>
                    <Col span={24}>
                      {/* <Row style={styles.drawerHeader}>
                            <Col span={1} offset={2}>
                              <Divider
                                type="vertical"
                                className="divider"
                                style={styles.divider1}
                              />
                            </Col>
                            <Col span={19} offset={2}>
                              <Title
                                level={4}
                                type="secondary"
                                style={styles.margin}
                              >
                                {" "}
                                AED1,200.00
                                <br />
                              </Title>

                              <span>{t("Sales.Customers.Details.Open")}</span>
                            </Col>
                          </Row> */}
                    </Col>

                    <Col span={24}>
                      {/* <Row>
                            <Col span={1} offset={2}>
                              <Divider
                                type="vertical"
                                className="divider"
                                style={styles.divider2}
                              />
                            </Col>
                            <Col span={19} offset={2}>
                              <Title
                                level={4}
                                type="secondary"
                                style={styles.margin}
                              >
                                {" "}
                                AED1,200.00
                                <br />
                              </Title>

                              <span>
                                {t("Sales.Customers.Details.Overdue")}
                              </span>
                            </Col>
                          </Row> */}
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Tabs
                    animated={true}
                    defaultActiveKey="2"
                    tabBarStyle={{
                      borderBottom: `1px solid ${gray}`,
                    }}
                  >
                    {/* <TabPane
                          tab={t("Sales.Customers.Details.Transaction_list")}
                          key="1"
                        >
                          <TransactionTable collapse={collapse} />
                        </TabPane> */}
                    <TabPane
                      tab={t("Sales.Customers.Details.Customer_details")}
                      key="2"
                    >
                      <Row
                        gutter={{
                          xl: 50,
                          lg: collapse ? 35 : 50,
                          md: collapse ? 20 : 30,
                          xs: 50,
                        }}
                      >
                        {result?.data?.status === "active" && (
                          <Col span={24}>
                            <Row justify="end">
                              <Col
                                lg={2}
                                md={3}
                                sm={4}
                                xs={isMobileMini ? 5 : 4}
                              >
                                {checkPermissions(`change_${CUSTOMER_M}`) && (
                                  <EditCustomer
                                    record={result && result?.data}
                                    attachment={fileList?.[0]?.name}
                                    baseUrl={baseUrl}
                                  />
                                )}
                              </Col>
                            </Row>
                          </Col>
                        )}
                        <Col md={12} xs={24}>
                          <List
                            itemLayout="horizontal"
                            dataSource={data}
                            renderItem={(item) => (
                              <List.Item style={styles.listItem}>
                                <Row className="num">
                                  <Col style={{ width: `130px` }}>
                                    <h4> {item.title}</h4>
                                  </Col>
                                  <Col>{item.content}</Col>
                                </Row>
                              </List.Item>
                            )}
                          />
                        </Col>
                        <Col md={12} xs={24}>
                          <List
                            itemLayout="horizontal"
                            dataSource={data1}
                            renderItem={(item) => (
                              <List.Item style={styles.listItem}>
                                <Row className="num">
                                  <Col style={{ width: `130px` }}>
                                    <h4> {item.title}</h4>
                                  </Col>
                                  <Col>{item.content}</Col>
                                </Row>
                              </List.Item>
                            )}
                          />
                        </Col>
                      </Row>
                      {!result?.data?.system_default && (
                        <Row gutter={[50, 10]} style={styles.notes}>
                          <Col md={12} sm={12} xs={24}>
                            <div style={styles.label}>{t("Form.Notes")}</div>

                            <TextArea
                              defaultValue={`${result && result?.data?.notes}`}
                              value={notes}
                              onChange={onChangeNotes}
                              onPressEnter={onPressEnterNotes}
                              autoSize={{ minRows: 3, maxRows: 3 }}
                            />
                            <span className="note_save">
                              {" "}
                              {save
                                ? t("Sales.Customers.Details.nothing_to_save")
                                : t("Sales.Customers.Details.Notes_edit_save")}
                            </span>
                          </Col>
                          <Col
                            md={11}
                            sm={11}
                            xs={24}
                            style={styles.attachment}
                          >
                            <div style={styles.label}>
                              {t("Form.Attachments")}{" "}
                            </div>
                            <Dragger {...prop}>
                              <Row justify="center">
                                <Col>
                                  <Space size="small" style={styles.dragSpace}>
                                    <p className="ant-upload-text">
                                      {t("Form.Drag_Drop")}
                                    </p>
                                    <Typography.Text strong={true}>
                                      {loading ? progress + "%" : ""}
                                    </Typography.Text>
                                  </Space>
                                </Col>
                              </Row>
                            </Dragger>
                          </Col>
                        </Row>
                      )}
                    </TabPane>
                  </Tabs>
                </Col>
              </Row>
            </Col>
          </Row>
        </Spin>
      </Col>
    </Row>
  );
}

const styles = {
  drawerHeader: { paddingTop: "15px" },
  attachment: { height: "85px" },
  dragSpace: { padding: "0px 5px 5px 5px" },
  divider: {
    height: "100vh",
    margin: "0px",
    background: `${gray}`,
  },
  divider1: {
    height: "100%",
    margin: "0px",
    width: ".4rem",
    background: "#faad14",
  },
  divider2: {
    height: "100%",
    margin: "0px",
    width: ".4rem",
    background: "#cf1322",
  },
  margin: { margin: "0px" },
  listItem: {
    borderBottom: `1px solid ${gray} `,
    wordWrap: " break-word",
    wordBreak: "break-all",
  },
  notes: { marginBottom: "24px" },
  sidebar: { margin: "15px 4%" },
  body: { margin: "0px -2%" },
  label: { margin: "7px 0px" },
};

export default CustomerDetails;
