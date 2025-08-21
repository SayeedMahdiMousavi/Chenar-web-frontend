import React, { useState } from "react";
import { Modal, Col, Row } from "antd";
import { useMediaQuery } from "../../MediaQurey";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../ApiBaseUrl";
import { Form, Input } from "antd";
import { useTranslation } from "react-i18next";
import { ModalDragTitle } from "../../SelfComponents/ModalDragTitle";
import Draggable from "react-draggable";
import { trimString } from "../../../Functions/TrimString";
import { CancelButton, PageNewButton, SaveButton } from "../../../components";
import { addMessage, manageErrors } from "../../../Functions";

interface IProps {
  title: string;
  baseUrl: string;
  type: string;
  model: string;
}

const AddIncomeType: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const isBgTablet = useMediaQuery("(max-width: 1024px)");
  const isTablet = useMediaQuery("(max-width: 768px)");
  const isMobile = useMediaQuery("(max-width: 425px)");

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

  const addIncomeType = async (value: any) =>
    await axiosInstance.post(`${props.baseUrl}`, value);

  const {
    mutate: mutateAddWarehouse,
    isLoading,
    reset,
  } = useMutation(addIncomeType, {
    onSuccess: (values: any) => {
      setIsShowModal({
        visible: false,
      });
      addMessage(values?.data?.name);
      queryClient.invalidateQueries(props.baseUrl);
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      const data = {
        name: trimString(values.name),
      };
      mutateAddWarehouse(data);
    });
  };

  const handelAfterClose = () => {
    form.resetFields();
    reset();
  };

  return (
    <div>
      {props?.type === "incomeType" ? (
        <PageNewButton onClick={showModal} model={props?.model} />
      ) : props?.type === "chartOfAccount" &&
        props?.baseUrl === "/expense_revenue/revenue/" ? (
        <div onClick={showModal}> {t("Expenses.Income.New_income_type")}</div>
      ) : (
        <div onClick={showModal}> {t("Expenses.With_draw.New_withdraw")}</div>
      )}
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={props.title}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
        centered
        destroyOnClose
        afterClose={handelAfterClose}
        open={isShowModal.visible}
        onCancel={onCancel}
        width={isMobile ? "100%" : isTablet ? 360 : isBgTablet ? 360 : 360}
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
        >
          <Form.Item
            label={
              <span>
                {t("Form.Name")}
                <span className="star">*</span>
              </span>
            }
            name="name"
            rules={[{ required: true, message: t("Form.Name_required") }]}
          >
            <Input autoFocus autoComplete="off" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddIncomeType;
