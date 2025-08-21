import React, { useState } from "react";
import { Modal, Col, Row, InputNumber } from "antd";
import { useMediaQuery } from "../../MediaQurey";
import { useMutation } from "react-query";
import axiosInstance from "../../ApiBaseUrl";
import { Form, Input, message, Switch, Select } from "antd";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";
import { ModalDragTitle } from "../../SelfComponents/ModalDragTitle";
import { Styles } from "../../styles";
import { ActionMessage } from "../../SelfComponents/TranslateComponents/ActionMessage";
import { manageErrors } from "../../../Functions";
import { DatePickerFormItem } from "../../SelfComponents/JalaliAntdComponents/DatePickerFormItem";
import { handlePrepareDateForServer } from "../../../Functions/utcDate";
import { useGetCalender } from "../../../Hooks";
import { CancelButton, SaveButton } from "../../../components";

const dateFormat = "YYYY-MM-DD HH:mm:ss";
const AddInterval = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [period, setPeriod] = useState("days");
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });

  const [disabled, setDisabled] = useState(true);
  const isMiniTablet = useMediaQuery("(max-width: 576px)");
  const isMobile = useMediaQuery("(max-width: 425px)");
  const isSubBase = useMediaQuery("(max-width: 375px)");
  const isBgTablet = useMediaQuery("(max-width: 1024px)");
  const isTablet = useMediaQuery("(max-width: 768px)");

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  const intervale = props?.type === "intervale";

  const showModal = () => {
    setIsShowModal({
      visible: true,
    });
  };

  const onCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };

  const handleAddInterval = async (value) => {
    return await axiosInstance.post(`${props.baseUrl}`, value);
  };

  const {
    mutate: mutateAddInterval,
    isLoading,
    reset,
  } = useMutation(handleAddInterval, {
    onSuccess: (values) => {
      setIsShowModal({
        visible: false,
      });

      message.success(
        <ActionMessage name={values?.data?.description} message="Message.Add" />
      );
      props.handleUpdateItems();
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      const data = {
        description: values.description,
        enabled: values.enabled,
      };

      if (intervale) {
        data["interval"] = { every: values.every, period: values?.period };
        mutateAddInterval(data);
      } else {
        const dateTime = handlePrepareDateForServer({
          date: values?.date,
          calendarCode,
        });
        data["clocked"] = { clocked_time: dateTime };
        mutateAddInterval(data);
      }
    });
  };

  const handleAfterClose = () => {
    form.resetFields();
    reset();
    setPeriod("days");
  };

  const handleChangePeriod = (value) => {
    setPeriod(value);
  };

  return (
    <div>
      <div onClick={showModal}>
        {intervale ? t("Company.Intervale") : t("Company.Schedule")}
      </div>
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={
              intervale ? t("Company.Add_intervale") : t("Company.Add_schedule")
            }
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
        afterClose={handleAfterClose}
        destroyOnClose
        centered
        open={isShowModal.visible}
        onCancel={onCancel}
        style={Styles.modal(isMobile)}
        bodyStyle={Styles.modalBody(isMobile, isSubBase, isMiniTablet)}
        width={isMobile ? "100%" : isTablet ? 370 : isBgTablet ? 370 : 370}
        footer={
          <Row justify="end" align="middle">
            <Col>
              <CancelButton onClick={onCancel} />
              <SaveButton onClick={handleOk} loading={isLoading} />
            </Col>
          </Row>
        }
      >
        <Form
          form={form}
          hideRequiredMark={true}
          scrollToFirstError={true}
          layout="vertical"
          initialValues={{ enabled: true, every: 1, period: "days" }}
        >
          {intervale ? (
            <Form.Item
              label={
                <>
                  {t("Company.Intervale")}
                  <span className="star">*</span>
                </>
              }
              style={styles.margin}
            >
              <Input.Group compact>
                <Form.Item
                  name="every"
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: t("Company.Intervale_required"),
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "40%" }}
                    type="number"
                    min={
                      period === "minutes"
                        ? 10
                        : period === "seconds"
                        ? 600
                        : undefined
                    }
                  />
                </Form.Item>
                <Form.Item name="period" noStyle>
                  <Select
                    style={{ width: "60%" }}
                    onChange={handleChangePeriod}
                  >
                    {props?.periodList?.map((item) => (
                      <Select.Option value={item?.value} key={item?.value}>
                        {item?.display_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Input.Group>
            </Form.Item>
          ) : (
            <DatePickerFormItem
              placeholder=""
              name="date"
              label={t("Sales.Customers.Form.Date")}
              showTime={true}
              format={dateFormat}
              rules={[
                { type: "object" },
                {
                  required: true,
                  message: t("Sales.Customers.Form.Date_required"),
                },
              ]}
              style={styles.margin}
            />
          )}
          <Form.Item
            name="description"
            label={t("Form.Description")}
            style={styles.margin}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label={t("Company.Enabled")}
            name="enabled"
            valuePropName="checked"
            style={{ ...styles.margin, width: "90px" }}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const styles = {
  margin: { marginBottom: "8px" },
  modal: { maxHeight: `calc(100vh - 135px)`, overflowY: "auto" },
};

export default AddInterval;
