import { InfoCircleOutlined } from "@ant-design/icons";
import { Form, Select, InputNumber, Tooltip } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import {
  InfiniteScrollSelectError,
  InfiniteScrollSelectFormItem,
} from "../../../components/antd";
import { PRODUCT_LIST } from "../../../constants/routes";
import axiosInstance from "../../ApiBaseUrl";
import { DatePickerFormItem } from "../../SelfComponents/JalaliAntdComponents/DatePickerFormItem";
import { CenteredSpin } from "../../SelfComponents/Spin";

const dateFormat = "YYYY-MM-DD HH:mm";
const expireDateFormat = "YYYY-MM-DD";
export default function ProductInventoryFormItems({
  form,
  setProduct,
  product,
}: any) {
  const { t } = useTranslation();
  const [productId, setProductId] = useState("");

  const finalProduct = Boolean(product) ? product : productId;
  const finalSetProduct = Boolean(setProduct) ? setProduct : setProductId;

  const { data, isLoading, status, error, refetch, isFetching } = useQuery(
    [`${PRODUCT_LIST}unit/`, { finalProduct }],
    async () => {
      const { data } = await axiosInstance.get(
        `${PRODUCT_LIST}${finalProduct}/?expand=product_units.unit,unit_conversion
&fields=product_units.unit,product_units.base_unit,unit_conversion.from_unit,unit_conversion.ratio`
      );
      return data;
    },
    {
      enabled: !!finalProduct,
    }
  );

  const handleChangeProductName = (value: any) => {
    finalSetProduct(value?.value);
    form.setFieldsValue({ unit: undefined });
  };

  const handleChangeUnit = (value: any) => {
    const unitConversion = data?.unit_conversion.find(
      (item: any) => item?.from_unit?.id === value?.value
    );

    form.setFieldsValue({
      unitConversion: unitConversion?.ratio ?? 1,
    });
  };

  const handleRetry = () => {
    refetch();
  };
  return (
    <>
      <InfiniteScrollSelectFormItem
        name="product"
        label={
          <span>
            {t("Sales.All_sales.Invoice.Product_name")}
            <span className="star">*</span>
          </span>
        }
        rules={[
          {
            required: true,
            message: t("Sales.All_sales.Invoice.Product_name_required"),
          },
        ]}
        fields="name,id"
        baseUrl={PRODUCT_LIST}
        onChange={handleChangeProductName}
      />
      <Form.Item
        label={
          <>
            {t("Sales.Product_and_services.Units.Unit")}
            <span className="star">*</span>{" "}
            <Tooltip title={t("Product_inventory_unit_int")}>
              {" "}
              <InfoCircleOutlined />
            </Tooltip>
          </>
        }
        name="unit"
        rules={[
          {
            required: true,
            message: t(
              "Sales.Product_and_services.Price_recording.Unit_required"
            ),
          },
        ]}
      >
        <Select
          labelInValue
          loading={isLoading}
          onChange={handleChangeUnit}
          notFoundContent={
            status !== "error" ? (
              t("Product_inventory_unit_help")
            ) : (
              <InfiniteScrollSelectError
                error={error}
                handleRetry={handleRetry}
              />
            )
          }
          dropdownRender={(menu) => (
            <div>
              {status === "loading" || isFetching ? (
                <CenteredSpin size="small" />
              ) : (
                menu
              )}
            </div>
          )}
        >
          {data?.product_units
            .filter((item: { base_unit: boolean }) => item?.base_unit)
            ?.map((item: any) => (
              <Select.Option
                value={item?.unit?.id}
                key={item?.unit?.id}
                label={item?.unit?.name}
              >
                {item?.unit?.name}
              </Select.Option>
            ))}
          {data?.unit_conversion?.map((item: any) => (
            <Select.Option
              value={item?.from_unit?.id}
              key={item?.from_unit?.id}
              label={item?.from_unit?.name}
            >
              {item?.from_unit?.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <InfiniteScrollSelectFormItem
        label={
          <span>
            {t("Warehouse.Warehouse_name")}
            <span className="star">*</span>
          </span>
        }
        dropdownMatchSelectWidth={false}
        name="warehouse"
        fields="name,id"
        baseUrl="/inventory/warehouse/"
        rules={[
          {
            message: t("Warehouse.Warehouse_name_required"),
            required: true,
          },
        ]}
      />
      <Form.Item
        name="qty"
        label={
          <>
            {t("Sales.All_sales.Invoice.Quantity")}
            <span className="star">*</span>
          </>
        }
        rules={[
          {
            message: `${t("Sales.All_sales.Invoice.Quantity_required")}`,
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
        name="price"
        label={
          <>
            {t("Sales.Product_and_services.Price_recording.Purchase_price")}
            <span className="star">*</span>
          </>
        }
        rules={[
          {
            message: t("Purchase_price_required"),
            required: true,
          },
        ]}
      >
        <InputNumber
          min={0.01}
          type="number"
          className="num"
          inputMode="numeric"
        />
      </Form.Item>
      <DatePickerFormItem
        name="expirationDate"
        placeholder=""
        label={t("Sales.Product_and_services.Inventory.Expiration_date")}
        showTime={false}
        format={expireDateFormat}
        rules={[
          { type: "object" },
          // {
          //   required: true,
          //   message: t(
          //     "Sales.Product_and_services.Inventory.Expiration_date_required"
          //   ),
          // },
        ]}
      />
      <DatePickerFormItem
        name="registerDate"
        placeholder=""
        label={
          <span>
            {t("Register_date")}
            <span className="star">*</span>
          </span>
        }
        showTime={true}
        format={dateFormat}
        rules={[
          { type: "object" },
          {
            required: true,
            message: t("Register_date_required"),
          },
        ]}
      />
    </>
  );
}
