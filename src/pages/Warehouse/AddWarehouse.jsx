import React, { useState } from "react";
import { Modal, Col, Row, Button } from "antd";
import { useMediaQuery } from "../MediaQurey";
import { useMutation } from "react-query";
import axiosInstance from "../ApiBaseUrl";
import { Form, Input } from "antd";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";
import { ModalDragTitle } from "../SelfComponents/ModalDragTitle";
import { Styles } from "../styles";
import { trimString } from "../../Functions/TrimString";
import { addMessage, manageErrors } from "../../Functions";
import { CancelButton, PageNewButton, SaveButton } from "../../components";
import { WAREHOUSE_M } from "../../constants/permissions";
import { CloseCircleOutlined } from "@ant-design/icons";

const AddWarehouse = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });

  const [disabled, setDisabled] = useState(true);
  const isMiniTablet = useMediaQuery("(max-width: 576px)");
  const isMobile = useMediaQuery("(max-width: 425px)");
  const isSubBase = useMediaQuery("(max-width: 375px)");
  const isBgTablet = useMediaQuery("(max-width: 1024px)");
  const isTablet = useMediaQuery("(max-width: 768px)");

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

  const handleAddWarehouse = async (value) => {
    return await axiosInstance.post(props.baseUrl, value);
  };

  const {
    mutate: mutateAddWarehouse,
    isLoading,
    reset,
  } = useMutation(handleAddWarehouse, {
    onSuccess: (values) => {
      setIsShowModal({
        visible: false,
      });
      addMessage(values?.data?.name);
      props.handleUpdateItems();
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      mutateAddWarehouse({
        name: trimString(values.name),
        responsible: trimString(values.responsible),
        address: trimString(values.address),
      });
    });
  };

  const handleAfterClose = () => {
    form.resetFields();
    reset();
  };

  return (
    <div>
      <PageNewButton onClick={showModal} model={WAREHOUSE_M} />
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t("Warehouse.Add_warehouse")}
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
        wrapClassName="warehouse_add_modal"
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
          <Form.Item
            label={
              <>
                {t("Warehouse.Responsible")}
                <span className="star">*</span>
              </>
            }
            name="responsible"
            rules={[
              {
                required: true,
                message: t("Warehouse.Required_responsible"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <span>
                {t("Form.Address")}
                <span className="star">*</span>
              </span>
            }
            name="address"
            rules={[{ required: true, message: t("Form.Required_address") }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddWarehouse;
