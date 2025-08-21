import React, { useCallback } from "react";
import { Form, Select, InputNumber, Input, Modal } from "antd";
import axiosInstance from "../../../../ApiBaseUrl";

import { DatePickerFormItem } from "../../../../SelfComponents/JalaliAntdComponents/DatePickerFormItem";
import { useTranslation } from "react-i18next";
import { InfiniteScrollSelectFormItem } from "../../../../../components/antd";
import { manageNetworkError } from "../../../../../Functions/manageNetworkError";
import { ActionMessage } from "../../../../SelfComponents/TranslateComponents/ActionMessage";
import { math, print } from "../../../../../Functions/math";
import ShowDate from "../../../../SelfComponents/JalaliAntdComponents/ShowDate";

const FormItem = Form.Item;
const { Option } = Select;
const fields =
  "id,name,product_units,unit_conversion,price.unit,price.sales_rate,price.perches_rate,product_barcode.unit,product_barcode.barcode,expiration_date,product_statistic.available,product_statistic.warehouse";
const baseUrl = "/product/items/";
const endUrl =
  "status=active&expand=product_units,product_units.unit,unit_conversion,unit_conversion.unit,price,price.unit,product_barcode,product_barcode.unit,expiration_date";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  save,
  form,
  globalForm,
  units,
  setUnits,
  handleGetProductPrice,
  invoiceType,
  setLoading,
  setProductItem,
  productItem,
  warehouse,
  dateFormat,
  datePFormat,
  ...restProps
}) => {
  const { t } = useTranslation();

  const onSave = () => {
    save(productItem?.id ? productItem : record);
  };

  const handleChangeProductName = useCallback(
    async (value) => {
      setLoading(true);
      await axiosInstance
        .get(`${baseUrl}${value?.value}?${endUrl}&fields=${fields}`)
        .then((res) => {
          const newProduct = res?.data;
          const productUnits = newProduct?.product_units?.map((item) => {
            return { id: item?.unit?.id, name: item?.unit?.name };
          });
          setUnits(productUnits);
          const purUnit = newProduct?.product_units?.find((item) =>
            invoiceType === "sales" ||
            invoiceType === "sales_rej" ||
            invoiceType === "quotation"
              ? item?.default_sal === true
              : item?.default_pur === true
          );
          const newPrice = handleGetProductPrice(newProduct, purUnit?.unit?.id);
          form.setFieldsValue({
            id: { value: newProduct?.id, label: newProduct?.id },
            unit: { value: purUnit?.unit?.id, label: purUnit?.unit?.name },
            qty: 1,
            each_price: newPrice && parseFloat(newPrice),
            productStatistic: newProduct?.product_statistic,
            expirationDate: undefined,
          });
          const allData = {
            ...newProduct,
            key: record?.key,
            row: record?.row,
            serial: record?.serial,
          };
          if (newPrice) {
            save(allData);
          } else {
            setProductItem(allData);
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          manageNetworkError(error);
          form.setFieldsValue({
            product: undefined,
            id: undefined,
            unit: undefined,
            qty: 1,
            each_price: undefined,
          });
          setUnits([]);
        });
    },
    [
      form,
      handleGetProductPrice,
      invoiceType,
      record?.key,
      record?.row,
      record?.serial,
      save,
      setProductItem,
      setLoading,
      setUnits,
    ]
  );

  const handleChangeProductId = useCallback(
    async (value) => {
      setLoading(true);

      await axiosInstance
        .get(`${baseUrl}${value?.value}?${endUrl}&fields=${fields}`)
        .then((res) => {
          const newProduct = res?.data;

          const productUnits = newProduct?.product_units?.map((item) => {
            return { id: item?.unit?.id, name: item?.unit?.name };
          });
          setUnits(productUnits);
          const purUnit = newProduct?.product_units?.find((item) =>
            invoiceType === "sales" ||
            invoiceType === "sales_rej" ||
            invoiceType === "quotation"
              ? item?.default_sal === true
              : item?.default_pur === true
          );
          const newPrice = handleGetProductPrice(newProduct, purUnit?.unit?.id);
          form.setFieldsValue({
            product: { label: newProduct?.name, value: newProduct?.id },
            unit: { value: purUnit?.unit?.id, label: purUnit?.unit?.name },
            qty: 1,
            each_price: newPrice && parseFloat(newPrice),
            productStatistic: newProduct?.product_statistic,
            expirationDate: undefined,
          });
          const allData = {
            ...newProduct,
            key: record?.key,
            row: record?.row,
            serial: record?.serial,
          };

          if (newPrice) {
            save(allData);
          } else {
            setProductItem(allData);
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          manageNetworkError(error);
          form.setFieldsValue({
            product: undefined,
            id: undefined,
            unit: undefined,
            qty: 1,
            each_price: undefined,
          });
          setUnits([]);
        });
    },
    [
      form,
      handleGetProductPrice,
      invoiceType,
      record?.key,
      record?.row,
      record?.serial,
      save,
      setLoading,
      setUnits,
      setProductItem,
    ]
  );

  const onChangeUnits = (value) => {
    const newPrice = handleGetProductPrice(record, value?.value);
    form.setFieldsValue({ each_price: newPrice && parseFloat(newPrice) });
    if (newPrice) {
      onSave();
    }
  };

  const onChangeWarehouse = () => {
    const row = form.getFieldsValue();
    form.setFieldsValue({ expirationDate: undefined });
    if (row?.product?.value) {
      onSave();
    }
  };

  const onBlurPrice = () => {
    const formData = form.getFieldsValue();
    const productPrice = record?.price?.find(
      (item) => item?.unit?.id === formData?.unit?.value
    );

    if (
      invoiceType === "sales" ||
      invoiceType === "sales_rej" ||
      invoiceType === "quotation"
    ) {
      const currencyRate = globalForm.getFieldValue("currencyRate");
      const purchasePrice = print(
        math.evaluate(`${productPrice?.perches_rate ?? 0}/${currencyRate ?? 1}`)
      );
      if (parseFloat(formData?.each_price) < parseFloat(purchasePrice)) {
        Modal.warning({
          bodyStyle: { direction: t("Dir") },
          content: (
            <ActionMessage
              message="Sales.All_sales.Invoice.error_message_when_sales_is_less_than_purchase"
              name={formData?.product?.label}
            />
          ),
        });
      }
      onSave();
    } else {
      onSave();
    }
  };

  const onPressEnterPrice = (e) => {
    // onSave();
    e.target.blur();
  };

  const onChangeExpireDate = () => {
    const row = form.getFieldsValue();
    if (row?.product?.value) {
      onSave();
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const numberInputReg = /^0/;
  const numberInputReg1 = /^0./;
  const discountFormat = (value) => {
    return parseFloat(value) > 20
      ? 20
      : parseFloat(value) < 0
      ? 0
      : numberInputReg1.test(value)
      ? value
      : numberInputReg.test(value)
      ? 0
      : value;
  };

  const priceFormat = (value) => {
    return parseFloat(value) > 0
      ? value
      : parseFloat(value) <= 0
      ? 0.0000001
      : numberInputReg.test(value)
      ? 0
      : value;
  };

  const getInput = () => {
    switch (dataIndex) {
      case "id":
        return (
          <InfiniteScrollSelectFormItem
            name={dataIndex}
            style={styles.margin}
            fields="name,id"
            baseUrl={baseUrl}
            onChange={handleChangeProductId}
          />
        );
      case "product":
        return (
          <InfiniteScrollSelectFormItem
            name={dataIndex}
            rules={[
              {
                required: true,
                message: t("Sales.All_sales.Invoice.Product_name_required"),
              },
            ]}
            style={styles.margin}
            fields="name,id"
            baseUrl={baseUrl}
            onChange={handleChangeProductName}
            dropdownMatchSelectWidth={false}
          />
        );
      case "unit":
        return (
          <FormItem name={dataIndex} style={styles.margin}>
            <Select
              dropdownMatchSelectWidth={false}
              onChange={onChangeUnits}
              labelInValue
            >
              {units?.map((item) => (
                <Option value={item?.id} key={item?.id} label={item?.name}>
                  {item?.name}
                </Option>
              ))}
            </Select>
          </FormItem>
        );
      case "expirationDate":
        return invoiceType === "sales" ? (
          <FormItem
            style={styles.margin}
            shouldUpdate={(prevValues, curValues) =>
              prevValues.id !== curValues.id ||
              prevValues.product !== curValues.product ||
              prevValues.warehouse !== curValues.warehouse
            }
          >
            {({ getFieldValue }) => {
              const warehouse = getFieldValue("warehouse");
              const productStatistic = getFieldValue("productStatistic");
              const warehouseId = warehouse?.value
                ? warehouse?.value
                : warehouse;

              return (
                <FormItem style={styles.margin} name={dataIndex}>
                  <Select dropdownMatchSelectWidth={false}>
                    {productStatistic
                      ?.filter(
                        (item) =>
                          Boolean(item?.expire_date) &&
                          warehouseId === item?.warehouse
                      )
                      ?.map((item) => (
                        <Option
                          value={item?.expire_date}
                          key={item?.expire_date}
                        >
                          <ShowDate
                            date={item?.expire_date}
                            dateFormat={dateFormat}
                            datePFormat={datePFormat}
                          />
                        </Option>
                      ))}
                  </Select>
                </FormItem>
              );
            }}
          </FormItem>
        ) : (
          <DatePickerFormItem
            style={styles.margin}
            name={dataIndex}
            label=""
            rules={[]}
            format=""
            onChange={onChangeExpireDate}
          />
        );
      case "warehouse":
        return (
          <InfiniteScrollSelectFormItem
            dropdownMatchSelectWidth={false}
            name="warehouse"
            onChange={onChangeWarehouse}
            style={styles.margin}
            fields="name,id"
            baseUrl="/inventory/warehouse/"
          />
        );
      case "qty":
        return (
          <FormItem
            style={styles.margin}
            name={dataIndex}
            rules={[
              {
                required: true,
                message: t("Sales.Product_and_services.Form.Quantity_required"),
              },
            ]}
          >
            <InputNumber
              className="num"
              min={0}
              // precision={3}
              onFocus={handleFocus}
              type="number"
              inputMode="numeric"
              onPressEnter={onSave}
            />
          </FormItem>
        );
      case "discountPercent":
        return (
          <FormItem style={styles.margin} name={dataIndex}>
            <InputNumber
              className="num"
              min={0}
              max={20}
              // precision={3}
              onFocus={handleFocus}
              formatter={discountFormat}
              parser={discountFormat}
              type="number"
              inputMode="numeric"
              onPressEnter={onSave}
            />
          </FormItem>
        );
      case "each_price":
        return (
          <FormItem
            style={styles.margin}
            name={dataIndex}
            rules={[
              {
                required: true,
                message: t("Sales.Product_and_services.Form.Price_required"),
              },
            ]}
          >
            <InputNumber
              className="num"
              formatter={priceFormat}
              parser={priceFormat}
              type="number"
              inputMode="numeric"
              onPressEnter={onPressEnterPrice}
              onBlur={onBlurPrice}
              onFocus={handleFocus}
            />
          </FormItem>
        );
      case "description":
        return (
          <FormItem name={dataIndex} style={styles.margin}>
            <Input onPressEnter={onSave} />
          </FormItem>
        );
      default:
        return (
          <FormItem name={dataIndex} style={styles.margin}>
            <Input />
          </FormItem>
        );
    }
  };
  return <td {...restProps}>{editing ? getInput() : children}</td>;
};
const styles = {
  margin: { marginBottom: 0 },
  spin: { margin: "10px 20px" },
};
export default EditableCell;
