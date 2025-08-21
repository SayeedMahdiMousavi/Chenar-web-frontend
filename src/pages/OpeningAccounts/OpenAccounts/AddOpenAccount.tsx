import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import axiosInstance from "../../ApiBaseUrl";
import {
  Modal,
  Form,
  Row,
  Col,
  message,
  Divider,
  InputNumber,
  Select,
} from "antd";
import dayjs from "dayjs";
import { useMediaQuery } from "../../MediaQurey";
import { ModalDragTitle } from "../../SelfComponents/ModalDragTitle";
import Draggable from "react-draggable";
import { Styles } from "../../styles";
import { CurrencyProperties } from "../../Transactions/Components/CurrencyProperties";
import { ReceiveDetailsProperties } from "../../Transactions/Components/ReceiveDetailsProperties";
import { AccountName } from "./AccountName";
import {
  changeGToJ,
  handlePrepareDateForServer,
  utcDate,
} from "../../../Functions/utcDate";
import useGetCalender from "../../../Hooks/useGetCalender";
import useGetBaseCurrency from "../../../Hooks/useGetBaseCurrency";
import {
  PageNewButton,
  ResetButton,
  SaveAndNewButton,
} from "../../../components";
import { OPINING_ACCOUNT_M } from "../../../constants/permissions";
import { manageErrors } from "../../../Functions";

interface IProps {
  baseUrl: string;
  handleUpdateItems: () => void;
}
const { Option } = Select;
const dateFormat = "YYYY-MM-DD HH:mm";
const AddOpenAccount: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [currencyValue, setCurrencyValue] = useState(1);
  const [form] = Form.useForm();
  const [bankValue, setBankValue] = useState("");
  const [visible, setVisible] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const isMiniTablet = useMediaQuery("(max-width: 576px)");
  const isMobile = useMediaQuery("(max-width: 425px)");
  const isBigMobile = useMediaQuery("(max-width: 480px)");
  const isSubBase = useMediaQuery("(max-width: 375px)");

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  const messageKey = "addOpiningAccount";
  const addOpenAccount = async ({
    value,
  }: {
    value: {
      account: string;
      // credit: number;
      // debit: number;
      transaction_type: string;
      currency: number;
      currency_rate: number;
      date_time: string;
      description: string;
      amount: number;
    };
    type: string;
  }) => await axiosInstance.post(props.baseUrl, value);

  const {
    mutate: mutateAddOpenAccount,
    isLoading,
    reset,
  } = useMutation(addOpenAccount, {
    onSuccess: (values, { type }) => {
      if (type !== "0") {
        setIsShowModal({
          visible: false,
        });
        message.success(t("Message.Transaction_add_message"));
      } else {
        setVisible(false);
        form.resetFields();
        setBankValue("");
        message.destroy(messageKey);
        message.success({
          content: t("Message.Transaction_add_message"),
          duration: 3,
        });
      }

      props.handleUpdateItems();
    },
    onError: (error) => {
      message.destroy();
      manageErrors(error);
    },
  });

  const onFinish = (e: any) => {
    const type = e?.key;
    form.validateFields().then(async (values) => {
      if (type === "0") {
        message.loading({
          content: t("Message.Loading"),
          key: messageKey,
        });
      }

      const allData = {
        account: values?.accountName?.value,
        // credit: values?.credit ?? 0,
        // debit: values.debit ?? 0,
        // credit: values.type === "credit" ? values?.amount : "",
        // debit: values.type === "debit" ? values?.amount : "",
        amount: values?.amount,
        currency: values.currency?.value,
        currency_rate: values?.currencyRate,
        date_time: handlePrepareDateForServer({
          date: values?.date,
          calendarCode,
        }),
        description: values.description,
        transaction_type: values?.type,
      };
      // if (values.debit === "") {
      //   delete allData["debit"];
      // }
      // if (values.credit === "") {
      //   delete allData["credit"];
      // }
      // if (values.type === "debit") {
      //   delete allData["credit"];
      // }
      // if (values.type === "credit") {
      //   delete allData["debit"];
      // }
      mutateAddOpenAccount({ value: allData, type });
    });
  };

  const showModal = () => {
    setIsShowModal({
      visible: true,
    });
  };

  const handleCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };

  const handelAfterClose = () => {
    form.resetFields();
    setBankValue("");
    reset();
  };

  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyId = baseCurrency?.data?.id;
  const baseCurrencyName = baseCurrency?.data?.name;

  React.useEffect(() => {
    setCurrencyValue(baseCurrencyId);
  }, [baseCurrencyId]);

  const handleChangeName = (value: string) => {
    setBankValue(value);
    if (value === "BNK" || value === "CSH") {
      form.setFieldsValue({ type: "debit" });
    }
  };

  return (
    <div>
      <PageNewButton onClick={showModal} model={OPINING_ACCOUNT_M} />
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t("Opening_accounts.Open_account_information")}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
        style={Styles.modal(isMobile)}
        bodyStyle={Styles.modalBody(isMobile, isSubBase, isMiniTablet)}
        open={isShowModal.visible}
        destroyOnClose
        afterClose={handelAfterClose}
        centered
        width={500}
        onCancel={handleCancel}
        footer={
          <Row justify="space-between">
            <Col>
              <ResetButton onClick={handelAfterClose} />
            </Col>
            <Col>
              <SaveAndNewButton
                onSubmit={onFinish}
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
          }}
        >
          <Row gutter={10}>
            <Col span={isBigMobile ? 24 : 12}>
              <AccountName onChange={handleChangeName} />
            </Col>
            <Col span={24}>
              <Divider />
            </Col>
            <Col span={isBigMobile ? 24 : 12}>
              <Form.Item
                name="type"
                rules={[
                  {
                    required: true,
                    message: t("Sales.Customers.Discount.Required_type"),
                  },
                ]}
                style={styles.margin}
              >
                <Select
                  className="num"
                  disabled={bankValue === "BNK" || bankValue === "CSH"}
                  placeholder={t("Sales.Product_and_services.Type")}
                >
                  <Option value="debit">{t("Opening_accounts.Debit")}</Option>
                  <Option value="credit">{t("Opening_accounts.Credit")}</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={isBigMobile ? 24 : 12}>
              <Form.Item
                name="amount"
                preserve={false}
                style={styles.margin}
                rules={[
                  {
                    required: true,
                    message: t("Sales.Customers.Form.Amount_required"),
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  type="number"
                  className="num"
                  inputMode="numeric"
                  placeholder={t("Sales.Customers.Form.Amount")}
                />
              </Form.Item>
            </Col>
            {/* {bankValue === "BNK" || bankValue === "CSH" ? null : (
              <Col span={isBigMobile ? 24 : 12}>
                {" "}
                <Form.Item
                  name="credit"
                  preserve={false}
                  style={styles.margin}
                  rules={[
                    {
                      required: debit === "" ? true : false,
                      message: t("Opening_accounts.Credit_required"),
                    },
                  ]}
                >
                  <InputNumber
                    disabled={debit === "" ? false : true}
                    onChange={onChangeCredit}
                    min={0}
                    type="number"
                    className="num"
                    inputMode="numeric"
                    placeholder={t("Opening_accounts.Credit")}
                    style={{ textAlign: "start" }}
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={isBigMobile ? 24 : 12}>
              {" "}
              <Form.Item
                name="debit"
                style={styles.margin}
                rules={[
                  {
                    required: credit === "" ? true : false,
                    message: t("Opening_accounts.Debit_required"),
                  },
                ]}
              >
                <InputNumber
                  disabled={credit === "" ? false : true}
                  onChange={onChangeDebit}
                  min={0}
                  type="number"
                  className="num"
                  inputMode="numeric"
                  placeholder={t("Opening_accounts.Debit")}
                />
              </Form.Item>
            </Col> */}

            <Col span={24}>
              <Divider />
            </Col>
            <Col span={24}>
              <CurrencyProperties
                currencyValue={currencyValue}
                setCurrencyValue={setCurrencyValue}
                form={form}
                type="openAccount"
              />{" "}
            </Col>
            <Col span={24}>
              <Divider />
            </Col>
            <Col span={24}>
              <ReceiveDetailsProperties type="openAccount" />{" "}
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

interface IStyles {
  margin: React.CSSProperties;
}
const styles: IStyles = {
  margin: { margin: "0rem" },
};

export default AddOpenAccount;
