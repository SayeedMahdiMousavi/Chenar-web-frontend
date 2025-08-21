import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Form,
  Modal,
  Button,
  Typography,
  Space,
  message,
  InputNumber,
} from "antd";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../ApiBaseUrl";
import { fixedNumber, math, print } from "../../../Functions/math";
import { debounce } from "throttle-debounce";
import { CancelButton, SaveButton } from "../../../components";

const { Title } = Typography;
interface IProps {
  setVisible?: (value: boolean) => void;
  record: any;
  baseUrl: string;
}
export default function ProductVipPercent(props: IProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [baseUnit, setBaseUnit] = useState<any>();
  const [benefit, setBenefit] = useState<number>(0);
  const [vipPercent, setVipPercent] = useState<number>(0);
  const handleSuccessEdit = () => {
    queryClient.invalidateQueries(props.baseUrl);
  };
  const { mutate: mutateAddVipPrice } = useMutation(
    async (value: any) =>
      await axiosInstance
        .post(`/product/price/vip/`, value)
        .then(() => {
          message.success(
            t("Sales.Product_and_services.Form.Vip_save_message")
          );
          setVisible(false);
        })
        .catch((error) => {
          setLoading(false);
          if (error?.response?.data?.vip_percent?.[0]) {
            message.error(`${error?.response?.data?.vip_percent?.[0]}`);
          } else if (error?.response?.data?.product?.[0]) {
            message.error(`${error?.response?.data?.product?.[0]}`);
          }
        }),
    {
      onSuccess: handleSuccessEdit,
    }
  );
  const { mutate: mutateEditVipPrice } = useMutation(
    async (value: any) =>
      await axiosInstance
        .put(`/product/price/vip/${props?.record?.id}/`, value)
        .then(() => {
          message.success(
            t("Sales.Product_and_services.Form.Vip_save_message")
          );
          setVisible(false);
        })
        .catch((error) => {
          setLoading(false);
          if (error?.response?.data?.vip_percent?.[0]) {
            message.error(`${error?.response?.data?.vip_percent?.[0]}`);
          } else if (error?.response?.data?.product?.[0]) {
            message.error(`${error?.response?.data?.product?.[0]}`);
          }
        }),
    {
      onSuccess: handleSuccessEdit,
    }
  );

  let oneRequest = false;
  const onFinish = async (values: any) => {
    setLoading(true);
    if (oneRequest) {
      return;
    }
    oneRequest = true;

    try {
      if (props?.record?.vip_price?.vip_percent) {
        mutateEditVipPrice({
          vip_percent: fixedNumber(vipPercent, 20),
          product: props?.record?.id,
        });
      } else {
        mutateAddVipPrice({
          vip_percent: fixedNumber(vipPercent, 20),
          product: props?.record?.id,
        });
      }

      oneRequest = false;
    } catch (info) {
      oneRequest = false;
    }
  };

  const checkVipPrice = (vipPercent: any, sales: number, purchase: number) => {
    const vipPrice =
      sales && purchase
        ? print(
            //@ts-ignore
            math.evaluate(`(${sales}-${purchase})*${vipPercent}/100`)
          )
        : 0;
    //@ts-ignore
    // return math.floor(vipPrice);
    return Math.round(vipPrice);
  };
  const checkVipPercent = (value: any) => {
    const vipPrice =
      baseUnit?.sales_rate && baseUnit?.perches_rate
        ? print(
            //@ts-ignore
            math.evaluate(
              `(${value}*100)/(${baseUnit?.sales_rate}-${baseUnit?.perches_rate})`
            )
          )
        : 0;
    //@ts-ignore
    setVipPercent(parseFloat(vipPrice));
    //@ts-ignore
    return parseInt(vipPrice);
  };

  const showModal = async () => {
    const baseUnit = props?.record?.price?.find((item: any) =>
      item?.unit_pro_relation?.includes("base_unit")
    );
    if (!baseUnit) {
      message.error(
        t("Sales.Product_and_services.Form.Vip_base_unit_price_message")
      );
    } else {
      const profit =
        parseFloat(baseUnit?.sales_rate) - parseFloat(baseUnit?.perches_rate);
      const vipPrice = checkVipPrice(
        //@ts-ignore
        80,
        baseUnit?.sales_rate,
        baseUnit?.perches_rate
      );
      const benefit =
        baseUnit?.sales_rate && baseUnit?.perches_rate
          ? print(
              //@ts-ignore
              math.evaluate(`${baseUnit?.sales_rate}-${vipPrice}`)
            )
          : 0;

      //@ts-ignore
      setBenefit(benefit);
      setBaseUnit(baseUnit);
      //@ts-ignore
      props.setVisible(false);
      setVisible(true);
      if (props?.record?.vip_price?.vip_percent) {
        const vipPrice = checkVipPrice(
          parseFloat(props?.record?.vip_price?.vip_percent),
          baseUnit?.sales_rate,
          baseUnit?.perches_rate
        );

        setVipPercent(parseFloat(props?.record?.vip_price?.vip_percent));
        form.setFieldsValue({
          percent: parseInt(props?.record?.vip_price?.vip_percent),
          //@ts-ignore
          price: parseFloat(parseFloat(baseUnit?.sales_rate) - vipPrice),
          profit: profit ? Math.floor(profit) : 0,
        });
      } else {
        form.setFieldsValue({
          price: parseFloat(baseUnit?.sales_rate),
          profit: profit ? Math.floor(profit) : 0,
        });
      }
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handelAfterClose = () => {
    form.resetFields();
    setLoading(false);
    setBaseUnit({});
    setBenefit(0);
  };

  const handelChangePercent = (value: string | number | null | undefined) => {
    debounceFunHandelChangePercent(value);
  };

  const debounceFunHandelChangePercent = debounce(
    500,
    async (value: string | number | null | undefined) => {
      //@ts-ignore
      setVipPercent(parseFloat(value));
      //@ts-ignore
      if (value && parseInt(value)) {
        //@ts-ignore
        const vipPrice = checkVipPrice(
          //@ts-ignore
          parseFloat(value),
          baseUnit?.sales_rate,
          baseUnit?.perches_rate
        );
        form.setFieldsValue({
          price: parseFloat(baseUnit?.sales_rate) - vipPrice,
        });
      } else {
        form.setFieldsValue({ price: parseFloat(baseUnit?.sales_rate) });
      }
    }
  );

  const handelChangePrice = (value: string | number | null | undefined) => {
    debounceFunHandelChangePrice(value);
  };

  const debounceFunHandelChangePrice = debounce(
    500,
    async (value: string | number | null | undefined) => {
      if (value) {
        //@ts-ignore
        const newValue = parseFloat(value) < benefit ? benefit : value;
        const vipValue =
          //@ts-ignore
          parseFloat(baseUnit?.sales_rate) - parseFloat(newValue);

        //@ts-ignore
        const vipPercent = checkVipPercent(vipValue);
        form.setFieldsValue({
          percent: vipPercent,
          price: newValue,
        });
      } else {
        form.setFieldsValue({ percent: 0 });
      }
    }
  );

  const inputNumberFocus = (e: any) => {
    e.target.select();
  };

  const numberInputReg = /^0/;

  const percent = (value1: any) => {
    const value = value1.replace("%", "");
    return value > 80
      ? 80
      : value < 0
      ? 0
      : numberInputReg.test(value)
      ? 0
      : value;
  };
  const regex = /^[1-9]d*$/;
  const price = (value: any) => {
    return value > parseFloat(baseUnit?.sales_rate)
      ? parseFloat(baseUnit?.sales_rate)
      : numberInputReg.test(value)
      ? benefit
      : !regex.test(value) && value
      ? parseInt(value)
      : value;
  };

  return (
    <div>
      <div onClick={showModal}>
        {props?.record?.vip_price?.vip_percent
          ? t("Sales.Product_and_services.Form.Edit_vip_percent")
          : t("Sales.Product_and_services.Form.Add_vip_percent")}
      </div>
      <Modal
        maskClosable={false}
        open={visible}
        onOk={onFinish}
        onCancel={handleCancel}
        footer={null}
        width={310}
        //@ts-ignore
        afterClose={handelAfterClose}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          hideRequiredMark={true}
          form={form}
          initialValues={{
            isVip: "true",
          }}
        >
          <Title level={5}>
            {props?.record?.vip_price?.vip_percent
              ? t("Sales.Product_and_services.Form.Edit_vip_percent")
              : t("Sales.Product_and_services.Form.Add_vip_percent")}
          </Title>
          <Form.Item name="profit" label={t("Reports.Profit")}>
            <InputNumber readOnly className="num" />
          </Form.Item>
          <Form.Item
            name="percent"
            label={
              <span>
                {t("Sales.Customers.Discount.Percent")}
                <span className="star">*</span>
              </span>
            }
            rules={[
              {
                message: `${t("Sales.Customers.Discount.Required_percent")}`,
                required: true,
              },
            ]}
          >
            <InputNumber
              min={0}
              max={80}
              className="num"
              onChange={handelChangePercent}
              formatter={(value) => `${value}%`}
              onFocus={inputNumberFocus}
              parser={percent}
            />
          </Form.Item>

          <Form.Item
            name="price"
            label={
              <span>
                {t("Sales.Product_and_services.Form.Price")}
                <span className="star">*</span>
              </span>
            }
          >
            <InputNumber
              max={baseUnit?.sales_rate}
              min={benefit && benefit}
              className="num"
              onChange={handelChangePrice}
              onFocus={inputNumberFocus}
              parser={price}
              formatter={price}
            />
          </Form.Item>
          <Form.Item className="textAlign__end" style={styles.footer}>
            <Space>
              <CancelButton onClick={handleCancel} />
              <SaveButton htmlType="submit" loading={loading} />
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

const styles = { footer: { paddingTop: "12px", marginBottom: "5px" } };
