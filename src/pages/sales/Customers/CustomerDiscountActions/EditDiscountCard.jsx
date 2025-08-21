import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Typography,
  Input,
  // TreeSelect,
  message,
  // InputNumber,
  Select,
} from "antd";
import startCase from "lodash/startCase";
import { useMutation, useQueryClient, useQuery } from "react-query";
import axiosInstance from "../../../ApiBaseUrl";
// import { EditOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { ActionMessage } from "../../../SelfComponents/TranslateComponents/ActionMessage";
import { CancelButton, SaveButton } from "../../../../components";
const { Title } = Typography;

const EditDiscountCard = (props) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [discountCard, setDiscountCard] = useState();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const getDiscountCards = async (key) => {
    const { data } = await axiosInstance.get(
      `/customer_account/discount/card/?page=1&page_size=200`
    );
    return data;
  };

  const discountCards = useQuery(
    "/customer_account/discount/card/",
    getDiscountCards
  );

  // 

  const editCustomerCard = async (value) => {
    await axiosInstance
      .patch(
        `/customer_account/customer/${props.record.id}/extend_discount_card_time/`,
        value
      )
      .then((res) => {
        // setLoading(false);
        setVisible(false);
        // 
        // props.form.setFieldsValue({
        //   type: res?.data?.id,
        // });
        // form.resetFields();
        message.success(
          <ActionMessage
            name={`${t("Sales.Customers.Discount.Customers_discount")} ${
              props.record?.first_name
            } ${props.record?.last_name} `}
            message="Message.Update"
          />
        );

        props.setVisible(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response?.data?.discount_card?.[0]) {
          message.error(`${error?.response?.data?.discount_card?.[0]}`);
        } else if (error?.response?.data?.number_of_month?.[0]) {
          message.error(`${error?.response?.data?.number_of_month?.[0]}`);
        }
      });
  };
  const { mutate: mutateEditCustomerCard } = useMutation(editCustomerCard, {
    onSuccess: () =>
      queryClient.invalidateQueries(`/customer_account/customer/`),
  });
  const addCustomerCard = async (value) => {
    await axiosInstance
      .post(
        `/customer_account/customer/${props.record.id}/assign_discount_card/`,
        value
      )
      .then((res) => {
        setLoading(false);
        setVisible(false);
        // 
        // props.form.setFieldsValue({
        //   type: res?.data?.id,
        // });
        form.resetFields();
        message.success(
          <ActionMessage
            name={`${t("Sales.Customers.Discount.Customers_discount")} ${
              props.record?.first_name
            } ${props.record?.last_name} `}
            message="Message.Add"
          />
        );

        props.setVisible(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response?.data?.discount_card?.[0]) {
          message.error(`${error?.response?.data?.discount_card?.[0]}`);
        } else if (error?.response?.data?.number_of_month?.[0]) {
          message.error(`${error?.response?.data?.number_of_month?.[0]}`);
        }
      });
  };
  const { mutate: mutateAddCustomerCard } = useMutation(addCustomerCard, {
    onSuccess: () =>
      queryClient.invalidateQueries(`/customer_account/customer/`),
  });

  const onFinish = async (value) => {
    // 
    setLoading(true);
    const allData = {
      discount_card: value?.type?.value,
      number_of_month: value?.number_of_month,
    };
    if (props?.record?.discount_card?.id) {
      mutateEditCustomerCard(allData);
      return;
    } else {
      mutateAddCustomerCard(allData);
    }
  };
  const showModal = () => {
    props.setVisible(false);
    // 
    if (props?.record?.discount_card?.id) {
      form.setFieldsValue({
        type: {
          value: props?.record?.discount_card?.discount_card?.id,
          label: props?.record?.discount_card?.discount_card?.name,
        },
        number_of_month: props?.record?.discount_card?.number_of_month,
      });
    }

    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handelAfterClose = () => {
    form.resetFields();
    setLoading(false);
  };
  const onChangeDiscountCard = async (value) => {
    // 

    setDiscountCard(value);
    const discountCard = discountCards?.data?.results?.find(
      (item) => item.id === value?.value
    );
    form.setFieldsValue({ number_of_month: discountCard.number_of_month });
    // await axiosInstance
    //   .get(`/customer_account/discount/card/${value}`)
    //   .then((res) => {
    //     form.setFieldsValue({ number_of_month: res?.data?.number_of_month });
    //   });
  };
  const onClearDiscountCard = () => {
    setDiscountCard();
    form.setFieldsValue({ number_of_month: "" });
  };
  return (
    <div>
      <div onClick={showModal}>
        {props?.record?.discount_card?.id
          ? t("Sales.Customers.Edit_customer_card")
          : t("Sales.Customers.Add_customer_card")}
      </div>

      <Modal
        maskClosable={false}
        open={visible}
        onOk={onFinish}
        onCancel={handleCancel}
        destroyOnClose={true}
        footer={null}
        width={360}
        afterClose={handelAfterClose}
      >
        {/* [
            <Button key="back" onClick={handleCancel}>
              Return
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
              Submit
            </Button>,
          ] */}
        <Form
          layout="vertical"
          onFinish={onFinish}
          hideRequiredMark={true}
          form={form}
        >
          <Title level={5}>
            {props?.record?.discount_card?.id
              ? startCase(t("Sales.Customers.Edit_customer_card"))
              : startCase(t("Sales.Customers.Add_customer_card"))}
          </Title>
          <Form.Item
            name="type"
            label={
              <span>
                {t("Sales.Customers.Discount.Customers_discount")}
                <span className="star">*</span>
              </span>
            }
            rules={[
              {
                required: true,
                message: `${t(
                  "Sales.Customers.Discount.Discount_card_required"
                )}`,
              },
            ]}
          >
            <Select
              onChange={onChangeDiscountCard}
              onClear={onClearDiscountCard}
              showSearch
              showArrow
              allowClear
              labelInValue
              optionLabelProp="label"
              optionFilterProp="label"
              popupClassName="z_index"
              dropdownRender={(menu) => (
                <div>
                  {/* <AddType form={form} /> */}
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
          <Form.Item
            name="number_of_month"
            label={
              <span>
                {t("Sales.Product_and_services.Inventory.Expiration_date")}
                <span className="star">*</span>
              </span>
            }
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
              min={0}
              type="number"
              // style={{ width: `calc(100% - 60px)` }}
              inputMode="numeric"
              // formatter={(value) => `${value}M`}
              // parser={(value) => value.replace("M", "")}
              suffix={<span>{t("Sales.Customers.Discount.Month")}</span>}
            />
          </Form.Item>

          <Form.Item className="margin">
            <div className="import__footer">
              <CancelButton onClick={handleCancel} />
              <SaveButton htmlType="submit" loading={loading} />
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
// const styles = {};
export default EditDiscountCard;
