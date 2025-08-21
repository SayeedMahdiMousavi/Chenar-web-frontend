import React, { useState } from "react";
import { Modal, Col, Row, Button } from "antd";
import { useMediaQuery } from "../../MediaQurey";
import UploadFile from "../../sales/UploadFile";
import axiosInstance from "../../ApiBaseUrl";
import { useMutation, useQueryClient } from "react-query";
import { Form, Input, Tooltip, InputNumber, Tabs, message } from "antd";
import Uplod from "../../sales/Upload";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Styles } from "../../styles";
import { ModalDragTitle } from "../../SelfComponents/ModalDragTitle";
import Draggable from "react-draggable";
import { CategoryField } from "../../SelfComponents/CategoryField";
import { ActionMessage } from "../../SelfComponents/TranslateComponents/ActionMessage";
import { trimString } from "../../../Functions/TrimString";
import {
  useGetBaseCurrency,
  useGetCalender,
  useGetDefaultCategory,
} from "../../../Hooks";
import {
  PageNewButton,
  ResetButton,
  SaveAndNewButton,
} from "../../../components";
import { SUPPLIER_M } from "../../../constants/permissions";
import BankCashOpenAccount from "../../Banking/BankCashOpenAccount";
import {
  changeGToJ,
  handlePrepareDateForServer,
  utcDate,
} from "../../../Functions/utcDate";
import dayjs from "dayjs";
import { debounce } from "throttle-debounce";
import { addMessage, manageErrors } from "../../../Functions";
import {
  OPENING_ACCOUNT_LIST,
  OPENING_ACCOUNT_RESULT_LIST,
} from "../../../constants/routes";

const { TabPane } = Tabs;
const dateFormat = "YYYY-MM-DD HH:mm";
const AddSupplier = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [fileList, setFileList] = useState([]);
  const [file, setFile] = useState({});
  const [error, setError] = useState(false);
  const [attachment, setAttachment] = useState();
  const [attachments, setAttachments] = useState([]);
  const [attachmentError, setAttachmentError] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [visible, setVisible] = useState(false);
  const [activeKey, setActiveKey] = useState("1");
  const isBgTablet = useMediaQuery("(max-width: 1024px)");
  const isTablet = useMediaQuery("(max-width: 768px)");
  const isMiniTablet = useMediaQuery("(max-width: 576px)");
  const isMobile = useMediaQuery("(max-width: 425px)");
  const isSubBase = useMediaQuery("(max-width: 375px)");

  // get default category
  const defaultCategory = useGetDefaultCategory(
    "/supplier_account/supplier_category/"
  );

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyId = baseCurrency?.data?.id;
  const baseCurrencyName = baseCurrency?.data?.name;

  const showModal = () => {
    setIsShowModal({
      visible: true,
    });
  };
  const messageKey = "addSupplier";
  const addEmployee = async (value) =>
    await axiosInstance.post(`/supplier_account/supplier/`, value?.value, {
      timeout: 0,
    });

  const {
    mutate: mutateAddEmployee,
    isLoading,
    reset,
  } = useMutation(addEmployee, {
    onSuccess: (values, { type, opening_balance }) => {
      queryClient.invalidateQueries(`/supplier_account/supplier/`);

      if (type === "0") {
        setVisible(false);
        form.resetFields();
        setError(false);
        setAttachmentError(false);
        setFileList([]);
        setFile();
        setActiveKey("1");
        setAttachments([]);
        setAttachment();
        message.destroy(messageKey);
        message.success({
          content: (
            <ActionMessage
              name={`${values?.data?.first_name} ${values?.data?.last_name}`}
              message="Message.Add"
            />
          ),
          duration: 3,
        });
      } else {
        setIsShowModal({
          visible: false,
        });
        addMessage(`${values?.data?.first_name} ${values?.data?.last_name}`);
      }

      if (opening_balance) {
        queryClient.invalidateQueries(OPENING_ACCOUNT_RESULT_LIST);
        queryClient.invalidateQueries(OPENING_ACCOUNT_LIST);
      }
    },
    onError: (error) => {
      message.destroy();
      manageErrors(error);
      if (error?.response?.data?.non_field_errors?.[0]) {
        if (
          error?.response?.data?.non_field_errors?.[0] ===
          "this person  is already exist"
        ) {
          message.error(
            `${error?.response?.data?.non_field_errors?.[0]}. ${t(
              "Sales.Customers.Form.First_and_last_name_error"
            )}`
          );
        } else {
          message.error(`${error?.response.data?.non_field_errors?.[0]}`);
        }
      }
    },
  });

  const handleOk = (e) => {
    const type = e?.key;
    form.validateFields().then(async (values) => {
      if (error || attachmentError) {
        message.error(
          `${t("Sales.Product_and_services.Form.Units_error_message")}`
        );
        return;
      } else {
        const formData = new FormData();
        if (file?.name) {
          formData.append("photo", file, file.name);
        }
        if (attachment?.name) {
          formData.append("attachment", attachment);
        }
        formData.append("first_name", trimString(values.name));
        formData.append("last_name", trimString(values.lastName));
        formData.append(
          "nike_name",
          values.nickName ? trimString(values.nickName) : ""
        );
        formData.append("category", values.category?.value);
        formData.append(
          "company_name",
          values.company ? trimString(values.company) : ""
        );
        formData.append("email", values.email ? values.email : "");
        formData.append("phone_number", values.phone ? values?.phone : "");
        formData.append("mobile_number", values.mobile ? values?.mobile : "");
        formData.append("fax_number", values.fax ? values.fax : "");
        formData.append("website", values.website ? values.website : "");
        formData.append(
          "credit_limit",
          values.creditLimit ? values.creditLimit : ""
        );
        formData.append(
          "national_id_number",
          values.nationalIdNumber ? values.nationalIdNumber : ""
        );

        formData.append(
          "business_id",
          values.businessIdNo ? values.businessIdNo : ""
        );
        formData.append("notes", values.notes ? values.notes : "");

        formData.append(
          "street",
          values?.bill_address?.street ? values.bill_address.street : ""
        );
        formData.append(
          "country",
          values?.bill_address?.country ? values.bill_address.country : ""
        );
        formData.append(
          "city",
          values?.bill_address?.city ? values.bill_address.city : ""
        );
        formData.append(
          "province",
          values?.bill_address?.province ? values.bill_address.province : ""
        );
        formData.append(
          "plate_number",
          values?.bill_address?.plate_number
            ? values.bill_address.plate_number
            : ""
        );

        const openBalance = {
          currency: values?.currency?.value,
          currency_rate: values?.currencyRate,
          amount: values?.amount,
          date_time: handlePrepareDateForServer({
            date: values?.date,
            calendarCode,
          }),
          transaction_type: values?.transactionType,
        };

        const isOpen = Boolean(values?.amount) && values?.amount > 0;
        if (isOpen) {
          formData.append("opening_balance", JSON.stringify([openBalance]));
        }
        if (type === "0") {
          message.loading({
            content: t("Message.Loading"),
            key: messageKey,
          });
        }
        mutateAddEmployee({
          value: formData,
          type: type,
          opening_balance: isOpen ? openBalance : undefined,
        });
        return;
      }
    });
  };

  const handleCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };

  const handelAfterClose = () => {
    form.resetFields();
    reset();
    setError(false);
    setAttachmentError(false);
    setFileList([]);
    setFile();
    setActiveKey("1");
    setAttachments([]);
    setAttachment();
  };

  //upload
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const onChangeDrag = ({ fileList: newFileList }) => {
    setAttachments(newFileList);
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const normFile1 = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const onTabClick = (key) => {
    setActiveKey(key);
  };

  const handleChangeName = (e) => {
    debounceFunc(e.target.value);
  };

  const debounceFunc = debounce(500, async () => {
    const formData = form.getFieldsValue();
    form.setFieldsValue({
      displayName: `${formData?.name ?? ""} ${formData?.lastName ?? ""} ${
        formData?.nickName ?? ""
      }`,
    });
  });
  return (
    <Row className="modal">
      <Col span={24}>
        <PageNewButton onClick={showModal} model={SUPPLIER_M} />

        <Modal
          maskClosable={false}
          title={
            <ModalDragTitle
              disabled={disabled}
              setDisabled={setDisabled}
              title={t("Expenses.Suppliers.Supplier_information")}
            />
          }
          modalRender={(modal) => (
            <Draggable disabled={disabled}>{modal}</Draggable>
          )}
          centered
          destroyOnClose={true}
          afterClose={handelAfterClose}
          open={isShowModal.visible}
          onCancel={handleCancel}
          width={isMobile ? "100%" : isTablet ? "85%" : isBgTablet ? 600 : 600}
          style={Styles.modal(isMobile)}
          bodyStyle={Styles.modalBody(isMobile, isSubBase, isMiniTablet)}
          footer={
            <Row justify="space-between" align="middle">
              <Col>
                <ResetButton onClick={handelAfterClose} />
              </Col>
              <Col className="text_align_center">
                {/* <a href="#">{t("Form.Privacy")}</a> */}
              </Col>

              <Col>
                <SaveAndNewButton
                  onSubmit={handleOk}
                  loading={isLoading}
                  open={visible}
                  setVisible={setVisible}
                />
              </Col>
            </Row>
          }
        >
          <Form
            form={form}
            hideRequiredMark={true}
            scrollToFirstError={true}
            layout="vertical"
            initialValues={{
              category: { label: defaultCategory?.name, value: 1 },
              bill_address: {
                country: t("Sales.Customers.Form.Afghanistan"),
              },
              prefix: "0093",
              prefi: "0093",
              gender: "male",
              date:
                calendarCode === "gregory"
                  ? utcDate()
                  : dayjs(
                      changeGToJ(utcDate().format(dateFormat), dateFormat),
                      {
                        //@ts-ignore
                        jalali: true,
                      }
                    ),
              currency: {
                value: baseCurrencyId,
                label: baseCurrencyName,
              },
              currencyRate: 1,
              transactionType: "credit",
            }}
          >
            <Row gutter={[10]} align="bottom">
              <Col xl={{ span: 6 }} md={{ span: 7 }} sm={5} xs={10}>
                <Form.Item
                  name="upload"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  help={error ? `${t("Form.Photo_error")}` : undefined}
                  validateStatus={error === true ? "error" : undefined}
                  className="upload margin1"
                >
                  <Uplod
                    setFile={setFile}
                    name={t("Form.Photo")}
                    setFileList={setFileList}
                    fileList={fileList}
                    onChange={onChange}
                    setError={setError}
                  />
                </Form.Item>
              </Col>
              <Col span={18}>
                <Row gutter={10}>
                  <Col xl={{ span: 12 }}>
                    <Form.Item
                      label={
                        <span>
                          {t("Form.Name1")}
                          <span className="star">*</span>
                        </span>
                      }
                      name="name"
                      style={styles.formItem}
                      rules={[
                        {
                          whitespace: true,
                          message: `${t("Form.Name_required")}`,
                          required: true,
                        },
                      ]}
                    >
                      <Input
                        autoFocus
                        autoComplete="off"
                        onChange={handleChangeName}
                      />
                    </Form.Item>
                  </Col>

                  <Col xl={{ span: 12 }}>
                    {" "}
                    <Form.Item
                      label={
                        <span>
                          {t("Form.Last_Name")}
                          <span className="star">*</span>
                        </span>
                      }
                      rules={[
                        {
                          message: `${t("Form.Required_last_name")}`,
                          required: true,
                          whitespace: true,
                        },
                      ]}
                      name="lastName"
                      style={styles.formItem}
                    >
                      <Input onChange={handleChangeName} />
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 12 }}>
                    <Form.Item
                      label={<span>{t("Form.Nick_name")}</span>}
                      name="nickName"
                      style={styles.formItem}
                    >
                      <Input onChange={handleChangeName} />
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 12 }}>
                    <Form.Item
                      label={<span>{t("Display_name")}</span>}
                      name="displayName"
                      style={styles.formItem}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col xl={{ span: 12 }}>
                <Form.Item
                  name="nationalIdNumber"
                  label={t("Sales.Customers.Form.National_id_number")}
                  className="margin"
                >
                  <InputNumber
                    type="number"
                    className="num"
                    inputMode="numeric"
                  />
                </Form.Item>
              </Col>
              <Col xl={{ span: 12 }}>
                <Form.Item noStyle>
                  <CategoryField
                    form={form}
                    url="/supplier_account/supplier_category/"
                    label={
                      <span>
                        {t("Sales.Product_and_services.Form.Category")}
                        <span className="star">*</span>
                      </span>
                    }
                    style={styles.formItem}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={<span> {t("Form.Company")}</span>}
                  name="company"
                  style={styles.formItem}
                  className="num"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="businessIdNo"
                  label={t("Expenses.Suppliers.Business_id_no")}
                  style={styles.formItem}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="creditLimit"
                  label={t("Sales.Customers.Form.Credit_limit")}
                >
                  <InputNumber
                    min={1}
                    type="number"
                    className="num"
                    inputMode="numeric"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Tabs
              type="card"
              //   animated={true}
              size="small"
              tabBarStyle={styles.tab(isMobile)}
              activeKey={activeKey}
              onTabClick={onTabClick}
            >
              <TabPane tab={t("Opening_account")} key="1">
                <Row>
                  <Col md={24} sm={24} xs={24} style={{ padding: "10px 0px" }}>
                    <BankCashOpenAccount
                      {...{ form, baseCurrencyId }}
                      type="customer"
                    />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab={t("Employees.Contact")} key="2">
                <Row gutter={[10]}>
                  <Col span={24}>
                    {" "}
                    <Form.Item
                      name="email"
                      label={t("Employees.Contact")}
                      style={styles.address}
                      rules={[
                        {
                          type: "email",
                          message: `${t("Form.Email_Message")}`,
                        },
                      ]}
                    >
                      <Input placeholder={t("Form.Email")} />
                    </Form.Item>
                  </Col>
                  <Col sm={12} xs={24}>
                    {" "}
                    <Form.Item name="phone" style={styles.address} rules={[]}>
                      <Input style={styles.row} placeholder={t("Form.Phone")} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }} xs={24}>
                    <Form.Item name="mobile" style={styles.address}>
                      <Input placeholder={t("Form.Mobile")} />
                    </Form.Item>
                  </Col>

                  <Col md={{ span: 12 }} sm={12} xs={24}>
                    <Form.Item name="fax" className="margin1">
                      <Input style={styles.row} placeholder={t("Form.Fax")} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }} xs={24}>
                    <Form.Item
                      name="website"
                      className="margin1"
                      rules={[
                        {
                          type: "url",
                          message: t("Form.Required_website"),
                        },
                      ]}
                    >
                      <Input placeholder={t("Form.Website")} />
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab={t("Form.Address")} key="3">
                <Row gutter={[10]}>
                  <Col md={24} sm={24} xs={24}>
                    <Form.Item
                      label={t("Form.Address")}
                      name={["bill_address", "street"]}
                      style={styles.address}
                    >
                      <Input placeholder={t("Form.Street")} />
                    </Form.Item>
                  </Col>
                  <Col md={{ span: 12 }} sm={12} xs={24}>
                    <Form.Item
                      name={["bill_address", "country"]}
                      style={styles.address}
                    >
                      <Input placeholder={t("Form.Country")} />
                    </Form.Item>
                    <Form.Item
                      name={["bill_address", "city"]}
                      className="margin1"
                    >
                      <Input placeholder={t("Form.City/Town")} />
                    </Form.Item>
                  </Col>
                  <Col sm={12} xs={24}>
                    <Form.Item
                      name={["bill_address", "province"]}
                      style={styles.address}
                    >
                      <Input placeholder={t("Form.State/Province")} />
                    </Form.Item>
                    <Form.Item
                      name={["bill_address", "plate_number"]}
                      className="margin1"
                    >
                      <Input placeholder={t("Form.Postal_code")} />
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab={t("Form.Notes")} key="4">
                <Row gutter={10}>
                  <Col span={12}>
                    <Form.Item
                      name="notes"
                      label={t("Form.Notes")}
                      className="margin1"
                    >
                      <Input.TextArea autoSize={{ minRows: 3, maxRows: 3 }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      className="margin1"
                      label={
                        <span>
                          {t("Form.Attachments")} &nbsp;
                          <Tooltip
                            title={t("Form.Attachments_tooltip")}
                            placement="left"
                          >
                            <QuestionCircleOutlined />
                          </Tooltip>
                        </span>
                      }
                      validateStatus={
                        attachmentError === true ? "error" : undefined
                      }
                      help={
                        attachmentError === true
                          ? t("Form.Attachments_tooltip")
                          : undefined
                      }
                    >
                      <Form.Item
                        name="attachment"
                        valuePropName="fileList"
                        getValueFromEvent={normFile1}
                        noStyle
                      >
                        <UploadFile
                          setFile={setAttachment}
                          name={t("Form.Drag_Drop")}
                          setFileList={setAttachments}
                          fileList={attachments}
                          onChange={onChangeDrag}
                          setError={setAttachmentError}
                        />
                      </Form.Item>
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Form>
        </Modal>
      </Col>
    </Row>
  );
};

const styles = {
  address: { marginBottom: ".5rem" },
  tab: (isMobile) => ({
    marginBottom: "10px",
  }),
  formItem: { marginBottom: "8px" },
};

export default AddSupplier;
