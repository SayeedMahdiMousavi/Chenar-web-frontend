import React, { useCallback } from 'react';
import { Form, InputNumber, Input, Select, Tooltip } from 'antd';
import axiosInstance from '../../ApiBaseUrl';
import { useTranslation } from 'react-i18next';
import { InfiniteScrollSelectFormItem } from '../../../components/antd';
import { manageNetworkError } from '../../../Functions/manageNetworkError';
import { PRODUCT_LIST } from '../../../constants/routes';
import { InfoCircleOutlined } from '@ant-design/icons';
import { InputNumberWithAddAfter } from '../../../components';
import { fixedNumber } from '../../../Functions/math';
import { manageErrors } from '../../../Functions';
import ShowDate from '../../SelfComponents/JalaliAntdComponents/ShowDate';

const FormItem = Form.Item;

const { Option } = Select;
const WarehouseAdjustmentEditableCell = ({
  editing,
  dataIndex,
  record,
  children,
  save,
  form,
  productItem,
  setProductItem,
  setLoading,
  setData,
  fields,
  dateFormat,
  datePFormat,
  endUrl,
  ...restProps
}: any) => {
  const { t } = useTranslation();

  const handleChangeProduct = useCallback(
    async (value: any) => {
      //
      setLoading(true);
      await axiosInstance
        .get(`${PRODUCT_LIST}${value?.value}?${endUrl}&fields=${fields}`)
        .then((res) => {
          const newProduct = res?.data;
          const baseUnit = res?.data?.product_units?.find(
            (item: any) => item?.base_unit === true,
          )?.unit;

          const price = res?.data?.price?.find(
            (item: any) => item?.unit?.id === baseUnit?.id,
          )?.sales_rate;

          const row = form.getFieldsValue();
          const allData = {
            ...newProduct,
            unit: { value: baseUnit?.id, label: baseUnit?.name },
            warehouse: row?.warehouse,
            product: value,
            key: record?.key,
            row: record?.row,
            each_price: Boolean(newProduct?.average_price)
              ? newProduct?.average_price
              : price,
          };

          form.setFieldsValue({
            each_price: price,
            productStatistic: newProduct.product_statistic,
            expirationDate: undefined,
          });
          save(allData);
          // if (row.warehouse?.value && row?.newAvailable) {
          //   save(allData);
          // } else {
          setProductItem(allData);
          // setData((prev: any) => {
          //   const newItem = prev?.map((item: any) => {
          //     if (item?.key === record?.key) {
          //       return { ...item, ...allData };
          //     } else {
          //       return item;
          //     }
          //   });
          //   return newItem;
          // });
          // }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          manageErrors(error);
          manageNetworkError(error);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setLoading, record?.key, record?.row, form, save, setProductItem],
  );

  const onSave = () => {
    save(productItem?.product?.value ? productItem : record);
  };

  const handleChangeWarehouse = (value: any) => {
    const row = form.getFieldsValue();
    form.setFieldsValue({ expirationDate: undefined });
    if (row.product?.value && row?.newAvailable) {
      onSave();
    } else {
      setData((prev: any) => {
        const newItem = prev?.map((item: any) => {
          if (item?.key === record?.key) {
            return { ...item, warehouse: value };
          } else {
            return item;
          }
        });
        return newItem;
      });
    }
  };

  const handleChangeNewAvailable = () => {
    const row = form.getFieldsValue();
    if (row.product?.value && row?.warehouse?.value) {
      onSave();
    }
  };

  const handleFocus = (e: any) => {
    e.target.select();
  };

  const numberInputReg = /^0/;

  const priceFormat = (value: any) => {
    return parseFloat(value) > 0
      ? value
      : parseFloat(value) <= 0
        ? 0.0000001
        : numberInputReg.test(value)
          ? 0
          : value;
  };

  const available =
    record?.warehouse?.value &&
    record?.product_statistic &&
    record?.product_statistic?.find(
      (item: { warehouse: number }) =>
        item?.warehouse === record?.warehouse?.value,
    )?.available;

  const getInput = () => {
    switch (dataIndex) {
      case 'product':
        return (
          <InfiniteScrollSelectFormItem
            name={dataIndex}
            rules={[
              {
                required: true,
                message: t('Sales.All_sales.Invoice.Product_name_required'),
              },
            ]}
            style={styles.margin}
            fields='name,id'
            baseUrl={PRODUCT_LIST}
            onChange={handleChangeProduct}
            dropdownMatchSelectWidth={false}
          />
        );

      case 'warehouse':
        return (
          <InfiniteScrollSelectFormItem
            name={dataIndex}
            rules={[
              {
                required: true,
                message: t(
                  'Sales.All_sales.Invoice.Destination_warehouse_required',
                ),
              },
            ]}
            style={styles.margin}
            fields='name,id'
            baseUrl='/inventory/warehouse/'
            onChange={handleChangeWarehouse}
            dropdownMatchSelectWidth={false}
          />
        );
      case 'expirationDate':
        return (
          <FormItem
            style={styles.margin}
            shouldUpdate={(prevValues, curValues) =>
              prevValues.product?.value !== curValues.product?.value ||
              prevValues.warehouse?.value !== curValues.warehouse?.value
            }
          >
            {({ getFieldValue }) => {
              const warehouse = getFieldValue('warehouse');
              const productStatistic = getFieldValue('productStatistic');

              return (
                <FormItem style={styles.margin} name={dataIndex}>
                  <Select dropdownMatchSelectWidth={false}>
                    {productStatistic
                      ?.filter(
                        (item: { expire_date: string; warehouse: number }) =>
                          Boolean(item?.expire_date) &&
                          warehouse?.value === item?.warehouse,
                      )
                      ?.map((item: any) => (
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
      // case "type":
      //   return (
      //     <FormItem style={styles.margin} name={dataIndex}>
      //       <Select className="num" labelInValue>
      //         <Option value="add">{t("Add")}</Option>
      //         <Option value="minus">{t("Minus")}</Option>
      //       </Select>
      //     </FormItem>
      //   );
      case 'qty':
        return (
          <FormItem
            style={styles.margin}
            name={dataIndex}
            rules={[
              {
                required: true,
                message: t('Sales.Product_and_services.Form.Quantity_required'),
              },
            ]}
          >
            <InputNumberWithAddAfter
              addAfter={
                <Tooltip title={fixedNumber(available ?? 0)}>
                  <InfoCircleOutlined />
                </Tooltip>
              }
              min={1}
              onPressEnter={handleChangeNewAvailable}
            />
          </FormItem>
        );
      case 'each_price':
        return (
          <FormItem
            style={styles.margin}
            name={dataIndex}
            rules={[
              {
                required: true,
                message: t('Sales.Product_and_services.Form.Price_required'),
              },
            ]}
          >
            <InputNumber
              className='num'
              formatter={priceFormat}
              parser={priceFormat}
              type='number'
              inputMode='numeric'
              onPressEnter={handleChangeNewAvailable}
              onFocus={handleFocus}
            />
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
  spin: { margin: '10px 20px' },
};

export default WarehouseAdjustmentEditableCell;
