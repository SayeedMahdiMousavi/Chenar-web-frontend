import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../ApiBaseUrl";
// import {
//   CustomerServiceOutlined,
//   CaretDownOutlined,
//   PlusOutlined,
// } from "@ant-design/icons";
import {
  Form,
  Input,
  InputNumber,
  Button,
  // Select,
  // Dropdown,
  // Menu,
  Row,
  Col,
  // Divider,
  Modal,
  message,
} from "antd";
import { useMediaQuery } from "../../../MediaQurey";

import { connect } from "react-redux";
import { ModalDragTitle } from "../../../SelfComponents/ModalDragTitle";
import Draggable from "react-draggable";
import { trimString } from "../../../../Functions/TrimString";
import { ActionMessage } from "../../../SelfComponents/TranslateComponents/ActionMessage";
import { CancelButton, SaveButton } from "../../../../components";

// import { useDatabase } from "@nozbe/watermelondb/hooks";
// import withObservables from "@nozbe/with-observables";
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
// const { Option } = Select;
const layout = {
  labelCol: {
    xl: { span: 24 },
    md: { span: 24 },
    xs: { span: 24 },
  },
  wrapperCol: {
    xl: { span: 24 },
    md: { span: 24 },
    xs: { span: 24 },
  },
};

const ModalAppServices = (props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [disabled, setDisabled] = useState(true);
  const [form] = Form.useForm();
  // const database = useDatabase();
  // const [items, setItems] = useState([]);
  // const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   setItems(props.groups);
  // }, [props.groups]);
  const isMiniComputer = useMediaQuery("(max-width:1024px)");
  const isTablitBase = useMediaQuery("(max-width:768px)");
  const isMiniTablit = useMediaQuery("(max-width:576px)");
  const isMobileBase = useMediaQuery("(max-width:425px)");
  const [fields, setFields] = useState([
    { name: ["name"], value: props.record.name },
    { name: ["price"], value: props.record.price },
    { name: ["description"], value: props.record.description },
  ]);
  // const onNameChange = (event) => {
  //   const name = event.target.value;
  //   setName(name);
  // };

  // const addItem = async () => {
  //   // 
  //   // const { items, name } = this.state;
  //   if (!name) {
  //   } else {
  //     let groups = database.collections.get("groups");
  //     await database.action(async () => {
  //       await groups.create((group) => {
  //         group.name = name;
  //       });
  //     });
  //     setItems([...items, name]);
  //     setName("");
  //   }
  // };
  const editService = async (value) => {
    await axiosInstance
      .put(`/product_service/service/${props.record.name}/`, value)
      .then((res) => {
        // setLoading(false);
        setIsShowModal({
          visible: false,
        });

        message.success(
          <ActionMessage name={res.data?.name} message="Message.Update" />
        );
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response?.data?.name?.[0]) {
          message.error(`${error?.response?.data?.name?.[0]}`);
        } else if (error?.response?.data?.price?.[0]) {
          message.error(`${error?.response.data?.price?.[0]}`);
        } else if (error?.response?.data?.description?.[0]) {
          message.error(`${error?.response.data?.description?.[0]}`);
        }
      });
  };
  const { mutate: mutateEditProduct } = useMutation(editService, {
    onSuccess: () => queryClient.invalidateQueries(`/product_service/product/`),
  });

  const onFinish = async () => {
    // 
    // setProducts(values);
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        // const products = database.collections.get("products");

        // await database.action(async () => {
        //   const bok = await products.find(props.record.id);

        //   await bok.update((product) => {
        //     product.name = values.name;
        //     product.price = values.price;
        //     product.group = values.group;
        //     product.description = values.description;
        //   });
        // });
        const allData = {
          name: trimString(values?.name),
          price: values?.price,
          description: trimString(values?.description),
          // product_type: "service",
        };
        mutateEditProduct(allData, {
          onSuccess: () => {},
        });
      })
      .catch((info) => {
        
      });
  };

  const showModal = () => {
    props.dropVisible(false);
    setIsShowModal({
      visible: true,
    });
  };

  const handleCancel = (e) => {
    setIsShowModal({
      visible: false,
    });
  };

  const handleAfterClose = () => {
    setLoading(false);
    form.resetFields();
  };

  // const onFieldsChange = (changedFields, allFields) => {
  //   
  // };
  return (
    <Row>
      <div onClick={showModal} className="num">
        {t("Sales.Product_and_services.Edit_service")}{" "}
      </div>
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t("Sales.Product_and_services.Service_information")}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
        open={isShowModal.visible}
        centered
        destroyOnClose={true}
        width={
          isMobileBase
            ? "100vw"
            : isMiniTablit
            ? "70vw"
            : isTablitBase
            ? "50vw"
            : isMiniComputer
            ? "40vw"
            : "30vw"
        }
        onCancel={handleCancel}
        afterClose={handleAfterClose}
        bodyStyle={styles.bodyStyle}
        footer={
          <Row justify="end">
            <Col>
              <CancelButton onClick={handleCancel} />
              <SaveButton onClick={onFinish} loading={loading} />
            </Col>
            {/* <Col xl={3} md={3} xs={3}>
              <Dropdown
                overlay={menu}
                trigger={["click"]}
                placement='bottomCenter'
              >
                <Button
                  type='primary'
                  shape='round'
                  icon={<CaretDownOutlined />}
                  size='small'
                  style={styles.drop(isMobileBase, isTablitBase)}
                />
              </Dropdown>
            </Col> */}
          </Row>
        }
      >
        <Form
          {...layout}
          // labelAlign={props.rtl ? "right" : "left"}
          // name='nest-messages'
          // layout={isMobileBase ? "vertical" : "horizontal"}
          fields={fields}
          layout="vertical"
          hideRequiredMark={true}
          colon={false}
          form={form}
          // onFieldsChange={onFieldsChange}
        >
          <Form.Item
            name="name"
            label={
              <span>
                {t("Form.Name")} <span className="star">*</span>
              </span>
            }
            rules={[
              {
                required: true,
                message: t("Form.Name_required"),
              },
              {
                whitespace: true,
                message: t("Form.Name_required"),
              },
            ]}
            className="margin"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label={
              <span>
                {t("Sales.Product_and_services.Form.Price")}
                <span className="star">*</span>
              </span>
            }
            className="margin"
            rules={[
              {
                message: `${t(
                  "Sales.Product_and_services.Form.Price_required"
                )}`,
                required: true,
              },
            ]}
          >
            <InputNumber
              min={1}
              type="number"
              className="num"
              inputMode="numeric"
            />
          </Form.Item>

          <Form.Item
            name="description"
            style={styles.description}
            label={t("Form.Description")}
            className="margin1"
          >
            <Input.TextArea showCount />
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
};
const styles = {
  bodyStyle: {
    maxHeight: `calc(100vh - 194px)`,
    overflowY: "auto",
  },
  drop: (isMobileBase, isTablitBase) => ({
    height: "100%",
    width: "100%",
  }),
  add: {
    flex: "none",
    padding: "4px",
    display: "block",
    cursor: "pointer",
  },
  marginButtom: (isMobileBase) => ({
    marginBottom: isMobileBase ? ".5rem" : "",
  }),

  description: {
    marginBottom: "0rem",
  },
};
const mapStateToProps = (state) => ({
  rtl: state.direction.rtl,
  ltr: state.direction.ltr,
});

// const enhancProduct = withObservables(["groups"], ({ database }) => ({
//   groups: database.collections.get("groups").query().observe(),
// }));

// export default connect(mapStateToProps)(
//   withDatabase(enhancProduct(ModalAppServices))
// );
export default connect(mapStateToProps)(ModalAppServices);
