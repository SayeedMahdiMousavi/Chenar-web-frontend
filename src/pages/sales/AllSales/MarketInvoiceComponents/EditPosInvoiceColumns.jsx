import React from 'react';
import { Form, Select, InputNumber, Input, Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';

const FormItem = Form.Item;
export const EditPosInvoiceColumns = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  save,
  getPrice,
  form,
  findProductStatistics,
  barcodeButtonRef,
  ...restProps
}) => {
  const { t } = useTranslation();

  const onChangeUnits = (value) => {
    const row = form.getFieldsValue();
    const newPrice = getPrice(record, value);

    const ok = findProductStatistics(record, 'unit', value, row?.qty - 1);

    if (ok && Boolean(newPrice)) {
      form.setFieldsValue({ each_price: newPrice });
      save({ ...record, each_price: newPrice });
    } else if (ok) {
      // save(record);
    } else if (newPrice) {
      form.setFieldsValue({ unit: record?.unit });
      // save({ ...record, each_price: newPrice });
    } else {
      form.setFieldsValue({ unit: record?.unit });
      // save(record);
    }
  };

  const onOkBluerPrice = () => {
    barcodeButtonRef.current.focus();
  };

  const onBlurPrice = () => {
    const row = form.getFieldsValue();
    const rate = record?.price?.find(
      (item) => item?.unit?.id === row?.unit?.value,
    );
    if (row?.each_price < rate?.perches_rate) {
      save(record);
      Modal.warning({
        bodyStyle: { direction: t('Dir') },
        content: t(
          'Sales.All_sales.Invoice.error_message_when_sales_is_less_than_purchase',
        ),
        onOk: onOkBluerPrice,
      });
    } else {
      save(record);
    }
  };
  const onPressEnterPrice = (e) => {
    e.target.blur();
  };

  const handleOnFocus = (e) => {
    e.target.select();
  };

  const handleEnterQty = (e) => {
    const row = form.getFieldsValue();
    // e.target.blur();

    const ok = findProductStatistics(
      record,
      'edit',
      row?.unit?.value,
      e.target.value - 1,
    );
    // if (ok) {

    //   save(record);
    // } else {
    // form.setFieldsValue({ qty: record?.qty });
    save(record);
    // }
  };

  // const handleBluerQty = () => {
  //   const row = form.getFieldsValue();
  //   const oK = findProductStatistics(
  //     record,
  //     "edit",
  //     row?.unit?.value,
  //     row?.qty ? row?.qty - 1 : 0
  //   );

  //   // if (oK) {
  //   // } else {
  //   //   form.setFieldsValue({ qty: record?.qty });
  //   // }
  // };
  const getInput = () => {
    switch (dataIndex) {
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
            <InputNumber
              className='num'
              min={0}
              type='number'
              inputMode='numeric'
              onPressEnter={handleEnterQty}
              onFocus={handleOnFocus}
              // onBlur={handleBluerQty}
              autoFocus
            />
          </FormItem>
        );

      case 'unit':
        return (
          <FormItem name={dataIndex} style={styles.margin}>
            <Select
              dropdownMatchSelectWidth={false}
              onChange={onChangeUnits}
              labelInValue
            >
              {record?.product_units?.map((item) => (
                <Select.Option
                  value={item?.unit?.id}
                  key={item?.id}
                  label={item?.unit?.name}
                >
                  {item?.unit?.name}
                </Select.Option>
              ))}
            </Select>
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
              min={0}
              type='number'
              inputMode='numeric'
              onPressEnter={onPressEnterPrice}
              onBlur={onBlurPrice}
              onFocus={handleOnFocus}
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
  table: { margin: '0px 0px 24px 0px' },
};
