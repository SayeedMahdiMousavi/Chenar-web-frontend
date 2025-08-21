import React, { useCallback } from "react";
import { Form, Select, InputNumber, Input, Modal, Typography } from "antd";
import axiosInstance from "../../../../ApiBaseUrl";
import { useTranslation } from "react-i18next";
import { InfiniteScrollSelectFormItem } from "../../../../../components/antd";
import { manageNetworkError } from "../../../../../Functions/manageNetworkError";
import { manageErrors } from "../../../../../Functions";
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
  units,
  setUnits,
  productItem,
  setProductItem,
  getPrice,
  setLoading,
  dateFormat,
  datePFormat,
  ...restProps
}) => {
  const { t } = useTranslation();

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

          const purUnit = newProduct?.product_units.find(
            (item) => item?.default_sal === true
          );
          const newPrice = getPrice(newProduct, purUnit?.unit?.id);
          form.setFieldsValue({
            id: { value: newProduct?.id, label: newProduct?.id },
            unit: { value: purUnit?.unit?.id, label: purUnit?.unit?.name },
            qty: 1,
            each_price: newPrice && parseFloat(newPrice),
            expirationDate: undefined,
            productStatistic: newProduct?.product_statistic,
          });
          const allData = {
            ...newProduct,
            key: record?.key,
            row: record?.row,
            serial: record?.serial,
          };

          const row = form.getFieldsValue();

          setProductItem(allData);
          if (row.warehouse_in?.value && row.warehouse_out?.value) {
            save(allData);
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          manageNetworkError(error);
          manageErrors(error);
          form.setFieldsValue({
            product: undefined,
            id: undefined,
            unit: undefined,
            qty: 1,
            each_price: undefined,
            expirationDate: undefined,
          });
          setUnits([]);
        });
    },
    [
      setLoading,
      setUnits,
      getPrice,
      form,
      record?.key,
      record?.row,
      record?.serial,
      setProductItem,
      save,
    ]
  );

  const handleChangeProductId = useCallback(
    async (value) => {
      setLoading(true);
      await axiosInstance
        .get(`${baseUrl}${value?.value}?${endUrl}&fields=${fields}`)
        .then((res) => {
          const newProduct = res?.data;
          const row = form.getFieldsValue();
          const productUnits = newProduct?.product_units?.map((item) => {
            return { id: item?.unit?.id, name: item?.unit?.name };
          });
          setUnits(productUnits);

          const purUnit = newProduct?.product_units.find(
            (item) => item?.default_pur === true
          );
          const newPrice = getPrice(newProduct, purUnit?.unit?.id);
          form.setFieldsValue({
            product: { label: newProduct?.name, value: newProduct?.id },
            unit: { value: purUnit?.unit?.id, label: purUnit?.unit?.name },
            qty: 1,
            each_price: newPrice && parseFloat(newPrice),
            expirationDate: undefined,
            productStatistic: newProduct?.product_statistic,
          });

          const allData = {
            ...newProduct,
            key: record?.key,
            row: record?.row,
            serial: record?.serial,
          };

          setProductItem(allData);
          if (row.warehouse_in && row.warehouse_out) {
            save(allData);
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
            expirationDate: undefined,
          });
          setUnits([]);
        });
    },
    [
      form,
      getPrice,
      record?.key,
      record?.row,
      record?.serial,
      save,
      setLoading,
      setProductItem,
      setUnits,
    ]
  );

  const onSave = () => {
    save(productItem?.id ? productItem : record);
  };

  const onChangeUnits = (value) => {
    // const newPrice = getPrice(record, value?.value);
    // form.setFieldsValue({ each_price: newPrice && parseFloat(newPrice) });
    // if (newPrice) {
    onSave();
    // }
  };

  const onChangeWarehouseNameOut = (value) => {
    const row = form.getFieldsValue();

    form.setFieldsValue({ expirationDate: undefined });
    if (row?.warehouse_in?.value === value?.value) {
      Modal.warning({
        bodyStyle: { direction: t("Dir") },
        title: (
          <Typography.Paragraph>
            {t("Sales.All_sales.Invoice.Same_warehouse_message")}
          </Typography.Paragraph>
        ),
        onOk: () => {
          form.setFieldsValue({
            warehouse_out: undefined,
          });
        },
      });
    } else {
      if (row.product?.value && row.warehouse_in) {
        onSave();
      }
    }
  };

  const onChangeWarehouseNameIn = (value) => {
    const row = form.getFieldsValue();
    if (row?.warehouse_out?.value === value?.value) {
      Modal.warning({
        bodyStyle: { direction: t("Dir") },
        title: (
          <Typography.Paragraph>
            {t("Sales.All_sales.Invoice.Same_warehouse_message")}
          </Typography.Paragraph>
        ),
        onOk: () => {
          form.setFieldsValue({
            warehouse_in: undefined,
          });
        },
      });
    } else {
      if (row.product?.value && row.warehouse_out) {
        onSave();
      }
    }
  };

  const onChangeExpirationDate = () => {
    const row = form.getFieldsValue();
    if (row.product?.value && row.warehouse_out && row.warehouse_in) {
      onSave();
    }
  };

  const handleFocus = (e) => {
    e.target.select();
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

      case "warehouse_out":
        return (
          <InfiniteScrollSelectFormItem
            name={dataIndex}
            rules={[
              {
                required: true,
                message: t("Sales.All_sales.Invoice.Source_warehouse_required"),
              },
            ]}
            style={styles.margin}
            fields="name,id"
            baseUrl="/inventory/warehouse/"
            onChange={onChangeWarehouseNameOut}
            dropdownMatchSelectWidth={false}
          />
        );

      case "warehouse_in":
        return (
          <InfiniteScrollSelectFormItem
            name={dataIndex}
            rules={[
              {
                required: true,
                message: t(
                  "Sales.All_sales.Invoice.Destination_warehouse_required"
                ),
              },
            ]}
            style={styles.margin}
            fields="name,id"
            baseUrl="/inventory/warehouse/"
            onChange={onChangeWarehouseNameIn}
            dropdownMatchSelectWidth={false}
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
              type="number"
              inputMode="numeric"
              onPressEnter={onChangeExpirationDate}
              onFocus={handleFocus}
            />
          </FormItem>
        );
      case "expirationDate":
        return (
          <FormItem
            style={styles.margin}
            shouldUpdate={(prevValues, curValues) =>
              prevValues.id?.value !== curValues.id?.value ||
              prevValues.product?.value !== curValues.product?.value ||
              prevValues.warehouse_out?.value !== curValues.warehouse_out?.value
            }
          >
            {({ getFieldValue }) => {
              const warehouse = getFieldValue("warehouse_out");
              const productStatistic = getFieldValue("productStatistic");

              return (
                <FormItem style={styles.margin} name={dataIndex}>
                  <Select dropdownMatchSelectWidth={false}>
                    {productStatistic
                      ?.filter(
                        (item) =>
                          Boolean(item?.expire_date) &&
                          warehouse?.value === item?.warehouse
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
