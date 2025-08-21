import React, { useState } from "react";
import { Modal, Col, Row, Button } from "antd";
import { useMediaQuery } from "../../MediaQurey";
import { GlobalHotKeys } from "react-hotkeys";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../ApiBaseUrl";
import { Form, Input, Tooltip, Tabs, message, InputNumber } from "antd";
import Uplod from "../Upload";
import UploadFile from "../UploadFile";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { AddItem } from "../../SelfComponents/AddItem";
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
import { CUSTOMER_M } from "../../../constants/permissions";
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
const NewCustomer = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [file, setFile] = useState({});
  const [error, setError] = useState(false);
  const [attachment, setAttachment] = useState();
  const [attachments, setAttachments] = useState([]);
  const [attachmentError, setAttachmentError] = useState(false);
  // const [discountCard, setDiscountCard] = useState();
  // const [autoCompleteResult, setAutoCompleteResult] = useState([]);
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [disabled, setDisabled] = useState(true);
  const isBgTablet = useMediaQuery("(max-width: 1024px)");
  const isTablet = useMediaQuery("(max-width: 768px)");
  const isMiniTablet = useMediaQuery("(max-width: 576px)");
  const isMobile = useMediaQuery("(max-width: 425px)");
  const isSubBase = useMediaQuery("(max-width: 375px)");
  const [activeKey, setActiveKey] = useState("1");
  const [visible, setVisible] = useState(false);

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyId = baseCurrency?.data?.id;
  const baseCurrencyName = baseCurrency?.data?.name;

  // const getDiscountCards = async (key) => {
  //   const { data } = await axiosInstance.get(
  //     `/customer_account/discount/card/?page=1&page_size=200`
  //   );
  //   return data;
  // };

  // const discountCards = useQuery(
  //   "/customer_account/discount/card/",
  //   getDiscountCards
  // );

  const showModal = () => {
    setIsShowModal({
      visible: true,
    });
  };

  //get default category
  const defaultCategory = useGetDefaultCategory(
    "/customer_account/customer_category/"
  );

  const onTabClick = (key) => {
    setActiveKey(key);
  };

  const messageKey = "addCustomer";
  const addCustomer = async ({ value }) =>
    await axiosInstance.post(`${props.baseUrl}`, value, { timeout: 0 });

  const {
    mutate: mutateAddCustomer,
    isLoading,
    reset,
  } = useMutation(addCustomer, {
    onSuccess: (values, { type, opening_balance }) => {
      queryClient.invalidateQueries(props.baseUrl);
      if (type !== "0") {
        setIsShowModal({
          visible: false,
        });
        addMessage(values?.data?.name);
      }
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
        // setDiscountCard();

        message.destroy(messageKey);
        message.success({
          content: (
            <ActionMessage
              name={`${values.data?.first_name} ${values.data?.last_name}`}
              message="Message.Add"
            />
          ),
          duration: 3,
        });
      }
      if (props.place === "salesInvoice") {
        props.form.setFieldsValue({
          serialNumber: values?.data?.id,
          buyerName: values?.data?.id,
          phone: values?.data?.phone_number,
          mobile: values?.data?.mobile_number,
          fax: values?.data?.fax_number,
          creditLimit: values?.data?.credit_limit,
          address: values?.data?.full_billing_address,
        });
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
        formData.append("category", values?.category?.value);
        formData.append(
          "company_name",
          values.company ? trimString(values.company) : ""
        );
        formData.append("email", values.email ? values.email : "");
        formData.append(
          "phone_number",
          values.phone ? trimString(values?.phone) : ""
        );
        formData.append(
          "mobile_number",
          values.mobile ? trimString(values?.mobile) : ""
        );
        const discount = JSON.stringify({
          number_of_month: values.number_of_month,
          discount_card: values.type,
        });
        formData.append("discount", discount);
        formData.append("fax_number", values.fax ? trimString(values.fax) : "");
        formData.append(
          "website",
          values.website ? trimString(values.website) : ""
        );
        formData.append(
          "credit_limit",
          values.creditLimit ? values.creditLimit : ""
        );
        formData.append(
          "national_id_number",
          values.nationalIdNumber ? values.nationalIdNumber : ""
        );
        formData.append("notes", values?.notes ? values?.notes : "");
        formData.append("street", values?.bill_address?.street ?? "");
        formData.append("country", values?.bill_address?.country ?? "");
        formData.append("city", values?.bill_address?.city ?? "");
        formData.append("province", values?.bill_address?.province ?? "");

        formData.append(
          "plate_number",
          values?.bill_address?.plate_number ?? ""
        );
        formData.append("s_street", values?.ship_address?.street ?? "");
        formData.append("s_country", values?.ship_address?.country ?? "");
        formData.append("s_city", values?.ship_address?.city ?? "");
        formData.append("s_province", values?.ship_address?.province ?? "");
        formData.append("discount_serial", values?.discountSerial ?? "");
        formData.append(
          "s_plate_number",
          values.ship_address?.plate_number ?? ""
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
        mutateAddCustomer({
          value: formData,
          type,
          opening_balance: isOpen ? openBalance : undefined,
        });
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
    setFileList([]);
    setFile();
    setActiveKey("1");
    setAttachments([]);
    setAttachment();
    setError(false);
    // setDiscountCard();

    setAttachmentError(false);
  };

  //sipping address
  const onChangeStreet = async () => {
    const row = await form.getFieldsValue();

    form.setFieldsValue({ ship_address: { street: row.bill_address.street } });
  };
  const onChangeCountry = async () => {
    const row = await form.getFieldsValue();

    form.setFieldsValue({
      ship_address: { country: row.bill_address.country },
    });
  };
  const onChangeProvince = async () => {
    const row = await form.getFieldsValue();

    form.setFieldsValue({
      ship_address: { province: row.bill_address.province },
    });
  };
  const onChangeCity = async () => {
    const row = await form.getFieldsValue();

    form.setFieldsValue({ ship_address: { city: row.bill_address.city } });
  };
  const onChangePostalCode = async () => {
    const row = await form.getFieldsValue();

    form.setFieldsValue({
      ship_address: { plate_number: row.bill_address.plate_number },
    });
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

  const keyMap = {
    NEW_CUSTOMER: ["Control+M", "Control+m"],
  };
  const handlers = {
    NEW_CUSTOMER: (event) => {
      event.preventDefault();
      event.stopPropagation();
      setIsShowModal({
        visible: true,
      });

      // 
    },
  };

  // const onChangeDiscountCard = async (value) => {
  //   // 

  //   setDiscountCard(value);
  //   setDiscountCard(value);
  //   const discountCard = discountCards?.data?.results?.find(
  //     (item) => item.id === value
  //   );
  //   form.setFieldsValue({ number_of_month: discountCard.number_of_month });
  //   // await axiosInstance
  //   //   .get(`/customer_account/discount/card/${value}`)
  //   //   .then((res) => {
  //   //     form.setFieldsValue({ number_of_month: res?.data?.number_of_month });
  //   //   });
  // };
  // const onClearDiscountCard = () => {
  //   setDiscountCard();
  //   form.setFieldsValue({ number_of_month: "" });
  // };

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
    <div>
      {props.place === "salesInvoice" ? (
        <AddItem showModal={showModal} />
      ) : (
        <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
          <PageNewButton onClick={showModal} model={CUSTOMER_M} />
        </GlobalHotKeys>
      )}
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t("Sales.Customers.Customer_information")}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
        centered
        open={isShowModal.visible}
        onCancel={handleCancel}
        afterClose={handelAfterClose}
        destroyOnClose={true}
        width={isMobile ? "100%" : isTablet ? "100%" : isBgTablet ? 1050 : 1050}
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
            ship_address: {
              country: t("Sales.Customers.Form.Afghanistan"),
            },
            prefix: "0093",
            prefi: "0093",
            date:
              calendarCode === "gregory"
                ? utcDate()
                : dayjs(changeGToJ(utcDate().format(dateFormat), dateFormat), {
                    //@ts-ignore
                    jalali: true,
                  }),
            currency: {
              value: baseCurrencyId,
              label: baseCurrencyName,
            },
            currencyRate: 1,
            transactionType: "credit",
          }}
        >
          <Row>
            <Col md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
              <Row gutter={10} align="bottom">
                <Col
                  // style={styles.firstRow(isMobile, isTablitBase)}
                  xl={{ span: 6 }}
                  lg={6}
                  md={7}
                  // md={{ span: 7 }}
                  // sm={5}
                  // xs={10}
                >
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
                <Col xl={{ span: 17 }} lg={17} md={16}>
                  <Row gutter={10}>
                    <Col xl={{ span: 8 }} md={{ span: 8 }}>
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

                    <Col xl={{ span: 8 }} md={{ span: 8 }}>
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
                    <Col xl={{ span: 8 }} md={{ span: 8 }}>
                      <Form.Item
                        label={<span>{t("Form.Nick_name")}</span>}
                        name="nickName"
                        style={styles.formItem}
                      >
                        <Input onChange={handleChangeName} />
                      </Form.Item>
                    </Col>

                    <Col xl={{ span: 12 }} md={{ span: 12 }}>
                      <Form.Item
                        label={t("Display_name")}
                        name="displayName"
                        style={styles.formItem}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col xl={{ span: 12 }} md={{ span: 12 }}>
                      <Form.Item
                        label={<span> {t("Form.Company")}</span>}
                        name="company"
                        style={styles.formItem}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col xl={{ span: 12 }} md={{ span: 12 }}>
                  {" "}
                  <Form.Item noStyle>
                    <CategoryField
                      form={form}
                      url="/customer_account/customer_category/"
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
                {/* <Col sm={{ span: 12 }} xs={24}>
                  <Form.Item
                    name="nationalIdNumber"
                    label={t("Sales.Customers.Form.National_id_number")}
                    className="margin"
                  >
                    <InputNumber
                      min={1}
                      type="number"
                      className="num"
                      inputMode="numeric"
                    />
                  </Form.Item>
                </Col> */}
                <Col md={{ span: 11 }} sm={{ span: 12 }} xs={24}>
                  <Form.Item
                    name="creditLimit"
                    label={t("Sales.Customers.Form.Credit_limit")}
                    className="margin"
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
            </Col>
            <Col md={12} sm={24} xs={24}>
              <Row gutter={[10]}>
                <Col md={{ span: 23, offset: 1 }} sm={24} xs={24}>
                  {" "}
                  <Form.Item
                    name="email"
                    label={t("Form.Email")}
                    style={styles.formItem}
                    rules={[
                      {
                        type: "email",
                        message: `${t("Form.Email_Message")}`,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={{ span: 11, offset: 1 }} sm={12} xs={24}>
                  {" "}
                  <Form.Item
                    name="phone"
                    label={
                      <span>
                        {t("Form.Phone")}&nbsp;
                        <Tooltip
                          title={
                            <span>{t("Form.Phone_sample")} 799773529</span>
                          }
                        >
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </span>
                    }
                    style={styles.formItem}
                  >
                    <Input style={styles.row} />
                  </Form.Item>
                </Col>
                <Col sm={{ span: 12 }} xs={24}>
                  <Form.Item
                    name="mobile"
                    label={
                      <span>
                        {t("Form.Mobile")}&nbsp;
                        <Tooltip
                          title={`${t("Form.Mobile_sample")} 0799773529 `}
                        >
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </span>
                    }
                    style={styles.formItem}
                  >
                    <Input style={styles.row} />
                  </Form.Item>
                </Col>
                <Col md={{ span: 11, offset: 1 }} sm={12} xs={24}>
                  <Form.Item
                    name="fax"
                    label={
                      <span>
                        {t("Form.Fax")}
                        &nbsp;
                        <Tooltip
                          title={`${t(
                            "Form.Fax_sample"
                          )} 93799773529@efaxsend.com `}
                        >
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </span>
                    }
                    style={styles.formItem}
                  >
                    <Input style={styles.row} />
                  </Form.Item>
                </Col>
                <Col sm={{ span: 12 }} xs={24}>
                  <Form.Item
                    name="website"
                    label={t("Form.Website")}
                    style={styles.formItem}
                    rules={[
                      {
                        type: "url",
                        message: t("Form.Required_website"),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Tabs
                type="card"
                // animated={true}
                activeKey={activeKey}
                onTabClick={onTabClick}
                size="small"
                tabBarStyle={styles.tab(isMobile)}
              >
                <TabPane tab={t("Opening_account")} key="1">
                  <Row gutter={10}>
                    <Col
                      md={11}
                      sm={18}
                      xs={24}
                      style={{ padding: "10px 5px" }}
                    >
                      <BankCashOpenAccount
                        {...{ form, baseCurrencyId }}
                        type="customer"
                      />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab={t("Form.Address")} key="2">
                  <Row>
                    <Col md={12} sm={24} xs={24}>
                      <Row>
                        <Col md={23} sm={24} xs={24}>
                          <Form.Item
                            label={t("Form.Billing_address")}
                            name={["bill_address", "street"]}
                            style={styles.address}
                          >
                            <Input
                              onChange={onChangeStreet}
                              placeholder={t("Form.Street")}
                            />
                          </Form.Item>
                        </Col>
                        <Col md={{ span: 11 }} sm={12} xs={24}>
                          <Form.Item
                            name={["bill_address", "country"]}
                            style={styles.address}
                          >
                            <Input
                              onChange={onChangeCountry}
                              placeholder={t("Form.Country")}
                            />
                          </Form.Item>
                          <Form.Item
                            name={["bill_address", "city"]}
                            style={styles.address}
                          >
                            <Input
                              onChange={onChangeCity}
                              placeholder={t("Form.City/Town")}
                            />
                          </Form.Item>
                        </Col>
                        <Col
                          sm={{ span: 11, offset: 1 }}
                          // md={{ span: 13 }}
                          xs={24}
                        >
                          <Form.Item
                            name={["bill_address", "province"]}
                            style={styles.address}
                          >
                            <Input
                              onChange={onChangeProvince}
                              placeholder={t("Form.State/Province")}
                            />
                          </Form.Item>
                          <Form.Item
                            name={["bill_address", "plate_number"]}
                            style={styles.address}
                          >
                            <Input
                              onChange={onChangePostalCode}
                              placeholder={t("Form.Postal_code")}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={12} sm={24} xs={24}>
                      <Row>
                        <Col md={{ span: 23, offset: 1 }} sm={24} xs={24}>
                          <Form.Item
                            label={t("Form.Shipping_address")}
                            name={["ship_address", "street"]}
                            style={styles.address}
                          >
                            <Input placeholder={t("Form.Street")} />
                          </Form.Item>
                        </Col>
                        <Col
                          md={{ span: 11, offset: 1 }}
                          sm={12}
                          xs={{ span: 24 }}
                        >
                          <Form.Item
                            name={["ship_address", "country"]}
                            style={styles.address}
                          >
                            <Input placeholder={t("Form.Country")} />
                          </Form.Item>
                          <Form.Item
                            name={["ship_address", "city"]}
                            style={styles.formItem}
                          >
                            <Input placeholder={t("Form.City/Town")} />
                          </Form.Item>
                        </Col>
                        <Col sm={{ span: 11, offset: 1 }} xs={{ span: 24 }}>
                          <Form.Item
                            name={["ship_address", "province"]}
                            style={styles.address}
                          >
                            <Input placeholder={t("Form.State/Province")} />
                          </Form.Item>
                          <Form.Item
                            name={["ship_address", "plate_number"]}
                            style={styles.formItem}
                          >
                            <Input placeholder={t("Form.Postal_code")} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </TabPane>

                <TabPane
                  style={{ marginBottom: "0rem" }}
                  tab={t("Form.Notes")}
                  key="3"
                >
                  <Row>
                    <Col span={24}>
                      <Form.Item
                        name="notes"
                        label={t("Form.Notes")}
                        className="margin1"
                      >
                        <Input.TextArea
                          autoSize={{ minRows: 4, maxRows: 4 }}
                          showCount
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </TabPane>

                <TabPane tab={t("Form.Attachments")} key="4">
                  <Row>
                    <Col md={8} sm={14} xs={20}>
                      <Form.Item
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
                {/* <TabPane
                  tab={t("Sales.Customers.Discount.Customers_discount")}
                  key="4"
                >
                  <Row>
                    <Col span={12}>
                      <Row gutter={15}>
                        <Col span={12}>
                          <Form.Item
                            name="type"
                            label={
                              <span>
                                {t(
                                  "Sales.Customers.Discount.Customers_discount"
                                )}
                     
                              </span>
                            }
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: `${t(
                            //       "Sales.Customers.Discount.Required_type"
                            //     )}`,
                            //   },
                            // ]}
                            className="margin"
                          >
                            <Select
                              onChange={onChangeDiscountCard}
                              onClear={onClearDiscountCard}
                              showSearch
                              showArrow
                              allowClear
                              optionLabelProp="label"
                              optionFilterProp="label"
                              popupClassName="z_index"
                              dropdownRender={(menu) => (
                                <div>
                                 
                                  {menu}
                                </div>
                              )}
                            >
                              {discountCards?.data?.results?.map((item) => (
                                <Select.Option
                                  value={item?.id}
                                  key={item?.id}
                                  label={item?.name}
                                >
                                  {item?.name}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="number_of_month"
                            label={
                              <span>
                                {t(
                                  "Sales.Product_and_services.Inventory.Expiration_date"
                                )}
                                <span className="star">*</span>
                              </span>
                            }
                            className="margin"
                            rules={[
                              {
                                message: `${t(
                                  "Sales.Customers.Discount.Required_expiration_data"
                                )}`,
                                required: true,
                              },
                            ]}
                          >
                            <Input
                              min={1}
                              type="number"
                              // style={{ width: `calc(100% - 60px)` }}
                              inputMode="numeric"
                              // formatter={(value) => `${value}M`}
                              // parser={(value) => value.replace("M", "")}
                              suffix={
                                <span>
                                  {t("Sales.Customers.Discount.Month")}
                                </span>
                              }
                            />
                          </Form.Item>
                        </Col>
                    
                        <Col span={12}>
                          <Form.Item
                            name="discountSerial"
                            label={t("Form.Discount_serial_number")}
                            style={styles.name}
                            rules={[
                              {
                                message: `${t(
                                  "Form.Required_discount_serial_No"
                                )}`,
                                required: discountCard ? true : false,
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={12}></Col>
                  </Row>
                </TabPane> */}
                {/* <TabPane tab={t("Form.Payment")} key='4'>
                    <Row>
                      <Col span={10}>
                        <Form.Item
                          name='openBalance'
                          label={t("Form.Open_balance")}
                          style={styles.name}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                  </TabPane> */}
              </Tabs>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
const styles = {
  address: { marginBottom: ".5rem" },
  tab: (isMobile) => ({
    marginBottom: "8px",
    marginTop: isMobile ? "1rem" : "5px",
  }),
  formItem: { marginBottom: "10px" },
};
// const enhancProduct = withObservables(["groups"], ({ database }) => ({
//   groups: database.collections.get("groups").query().observe(),
// }));
// export default connect(null, { addProducts })(
//   withDatabase(enhancProduct(NewCustomer))
// );

export default NewCustomer;
