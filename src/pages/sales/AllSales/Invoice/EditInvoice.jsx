import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import startCase from 'lodash/startCase';
import { fixedNumber, math, print } from '../../../../Functions/math';
import { debounce } from 'throttle-debounce';
import { Drawer, Form, Col, Row, message, Space, Modal, Spin } from 'antd';
import axiosInstance from '../../../ApiBaseUrl';
import { useMutation, useQueryClient } from 'react-query';
import InvoiceTable from './InvoiceTable';
import useGetCalender from '../../../../Hooks/useGetCalender';
import {
  handlePrepareDateForDateField,
  handlePrepareDateForServer,
} from '../../../../Functions/utcDate';
import useGetBaseCurrency from '../../../../Hooks/useGetBaseCurrency';
import PrintInvoiceButton from '../MarketInvoiceComponents/PrintInvoiceButton';
import { ActionMessage } from '../../../SelfComponents/TranslateComponents/ActionMessage';
import {
  expireProductsBaseUrl,
  productStatisticsBaseUrl,
} from '../../../Reports/AllReports/AllReports';
import InvoiceHeader from './SalesInvoiceComponents/Header';
import MultipleCashPayment from './SalesInvoiceComponents/MultipleCashPayment';
import InvoicesFooter from './SalesInvoiceComponents/Footer';
import { handleFindUnitConversionRate } from '../../../../Functions';
import { CancelButton, SaveButton } from '../../../../components';

const invoiceFixedNumber = (value) => {
  const newValue = fixedNumber(value, 20);
  return newValue;
};

const dateFormat1 = 'YYYY-MM-DD';
const EditInvoice = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [prevStatistic, setPrevStatistic] = useState([]);
  const [visible, setVisible] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [cashAmount, setCashAmount] = useState(0);
  const [form] = Form.useForm();
  const [count, setCount] = useState(1);
  const [response, setResponse] = useState({});
  const [totalOfItems, setTotalOfItems] = useState(0);
  const [currencyValue, setCurrencyValue] = useState(1);
  const [prevCurrency, setPrevCurrency] = useState(1);
  const [editingKey, setEditingKey] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [editSpin, setEditSpin] = useState(false);
  const [prevCashCurrency, setPrevCashCurrency] = useState([]);
  const [data, setData] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [expense, setExpense] = useState(0);
  const [warehouseId, setWarehouseId] = useState(0);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [cashPaymentItems, setCashPaymentItems] = useState([]);
  const [{ globalDiscount, productDiscount }, setIsDiscount] = useState({
    globalDiscount: false,
    productDiscount: false,
  });

  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyId = baseCurrency?.data?.id;
  const baseCurrencySymbol = baseCurrency?.data?.symbol;

  const showDrawer = () => {
    props.setVisible(false);
    setEditSpin(true);
    setVisible(true);
  };

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  const onHeaderCollapsed = () => {
    setShowHeader(!showHeader);
  };

  const handleAddProduct = useCallback(async () => {
    const newData = {
      key: count,
      row: `${count}`,
      serial: count,
      id: { value: '', label: '' },
      // product: { value: "", label: "" },
      // unit: { value: "", label: "" },
      qty: 1,
      // each_price: 0,
      // total_price: 0,
      description: '',
    };

    setData((prev) => [...prev, newData]);
    const neCount = count + 1;
    setCount(neCount);
  }, [count]);

  const handelChangeCurrencyChangeAllTotalPrice = useCallback(
    (data, currencyRate, newCurrencyRate) => {
      const newData = data?.map((item) => {
        const eachPrice = print(
          math.evaluate(
            `(${item?.each_price ?? 0}*${currencyRate ?? 1})/${
              newCurrencyRate ?? 1
            }`,
          ),
        );
        const discount = print(
          math.evaluate(
            `(${item?.discount ?? 0}*${currencyRate ?? 1})/${
              newCurrencyRate ?? 1
            }`,
          ),
        );
        return {
          ...item,
          each_price: eachPrice,
          total_price: invoiceFixedNumber(
            print(math.evaluate(`${item?.qty}*${eachPrice}`)),
          ),
          discount,
        };
      });

      setData(newData);

      const cashList = form?.getFieldValue('cashList');
      if (cashList?.length) {
        const newData = cashList?.reduce(
          ({ newItems, cashAmount }, item) => {
            const newCashAmount = print(
              math.evaluate(
                `(${item?.cashAmount ?? 0}*${currencyRate ?? 1})/${
                  newCurrencyRate ?? 1
                }`,
              ),
            );
            return {
              newItems: [
                ...newItems,
                {
                  ...item,
                  cashAmount: newCashAmount,
                },
              ],
              cashAmount: cashAmount + parseFloat(newCashAmount),
            };
          },
          { newItems: [], cashAmount: 0 },
        );
        setCashAmount(newData?.cashAmount);
        form.setFieldsValue({ cashList: newData?.newItems });
      }

      const discountData = form.getFieldValue('discount');

      setExpense((prev) => {
        const newExpense = print(
          math.evaluate(
            `(${prev ?? 0}*${currencyRate ?? 1})/${newCurrencyRate ?? 1}`,
          ),
        );
        form.setFieldsValue({ expense: newExpense });
        return newExpense;
      });

      if (discountData && discountData > 0) {
        const newDiscount = print(
          math.evaluate(
            `(${discountData ?? 0}*${currencyRate ?? 1})/${
              newCurrencyRate ?? 1
            }`,
          ),
        );

        setDiscount(newDiscount);
        form.setFieldsValue({ discount: newDiscount });
      }
    },
    [form],
  );

  const onChangeCurrency = useCallback(
    (value) => {
      const currencyRate = form.getFieldValue('currencyRate');
      const newCurrencyRate = print(
        math.evaluate(`${value?.base_amount ?? 0}/${value?.equal_amount ?? 1}`),
      );

      setPrevCurrency(newCurrencyRate);

      handelChangeCurrencyChangeAllTotalPrice(
        data,
        currencyRate ?? 1,
        newCurrencyRate,
      );

      setCurrencySymbol(value?.symbol);
    },
    [data, form, handelChangeCurrencyChangeAllTotalPrice],
  );

  const onChangeCurrencyRate = useCallback(
    (value) => {
      handelChangeCurrencyChangeAllTotalPrice(data, prevCurrency, value);
      setPrevCurrency(value ?? 1);
    },
    [data, handelChangeCurrencyChangeAllTotalPrice, prevCurrency],
  );

  const handleChangeExpense = (value, type) => {
    debounceExpenseFun(value, type);
  };

  const debounceExpenseFun = debounce(400, (value, type) => {
    const total = data?.reduce(
      (sum, item) => print(math.evaluate(`${sum}+${item?.total_price ?? 0}`)),
      0,
    );

    setTotalOfItems(invoiceFixedNumber(total) ?? 0);
    const newValue = parseFloat(value ?? 0);
    if (type === 'discount') {
      setDiscount(newValue);
      setIsDiscount((prev) => ({
        ...prev,
        productDiscount: newValue > 0 ? true : false,
      }));
    } else {
      setExpense(newValue);
    }
  });

  React.useEffect(() => {
    const formData = form.getFieldsValue();
    const { total, discount } = (data || []).reduce(
      ({ total, discount }, item) => ({
        total: print(math.evaluate(`${total}+${item?.total_price ?? 0}`)),
        discount: print(math.evaluate(`${discount}+${item?.discount ?? 0}`)),
      }),
      { total: 0, discount: 0 },
    );
    const totalDataValue = invoiceFixedNumber(total) ?? 0;
    const newDiscount = fixedNumber(discount) ?? 0;
    if (parseFloat(totalDataValue) <= parseFloat(formData.discount)) {
      const discount = fixedNumber(totalDataValue, 5);
      form.setFieldsValue({
        discount: parseInt(totalDataValue),
      });
      setDiscount(discount);
      setTotalOfItems(discount);
    } else {
      setTotalOfItems(invoiceFixedNumber(totalDataValue));
      if (newDiscount > 0) {
        setDiscount(newDiscount);
        setIsDiscount((prev) => ({
          ...prev,
          globalDiscount: newDiscount > 0 ? true : false,
        }));
      }
    }
  }, [data, editSpin, form]);
  const recordId = props?.record?.id;

  const editSalesInvoice = useCallback(
    async (value) => {
      return await axiosInstance
        .put(`${props.baseUrl}${recordId}/`, value, { timeout: 0 })
        .then((res) => {
          message.success(
            <ActionMessage
              name={`${t('Sales.All_sales.Invoice.Invoice')} ${res?.data?.id}`}
              message='Message.Update'
            />,
          );

          setResponse(res.data);
          // setVisible(false);
          queryClient.invalidateQueries(props.baseUrl);
          if (props?.type !== 'quotation') {
            queryClient.invalidateQueries(expireProductsBaseUrl);
            queryClient.invalidateQueries(productStatisticsBaseUrl);
          }
          return res;
        })
        .catch((error) => {
          const res = error?.response?.data;
          if (res?.customer?.[0]) {
            message.error(res?.customer?.[0]);
          } else if (res?.warehouse?.[0]) {
            message.error(res?.warehouse?.[0]);
          } else if (res?.currency?.[0]) {
            message.error(res?.currency?.[0]);
          } else if (res?.date_time?.[0]) {
            message.error(res?.date_time?.[0]);
          } else if (res?.currency_rate?.[0]) {
            message.error(res?.currency_rate?.[0]);
          } else if (res?.description?.[0]) {
            message.error(res?.description?.[0]);
          } else if (res?.payment_summery) {
            const payment = res?.payment_summery;
            if (payment?.discount?.[0]) {
              message.error(payment?.discount?.[0]);
            } else if (payment?.expense?.[0]) {
              message.error(payment?.expense?.[0]);
            } else if (payment?.net_amount?.[0]) {
              message.error(payment?.net_amount?.[0]);
            } else if (payment?.remain?.[0]) {
              message.error(payment?.remain?.[0]);
            }
          } else if (res?.payment_cash) {
            const cash = res?.payment_cash;
            if (cash?.pay_by?.[0]) {
              message.error(cash?.pay_by?.[0]);
            } else if (cash?.rec_by?.[0]) {
              message.error(cash?.rec_by?.[0]);
            } else if (cash?.date_time?.[0]) {
              message.error(cash?.date_time?.[0]);
            } else if (cash?.amount?.[0]) {
              message.error(cash?.amount?.[0]);
            } else if (cash?.amount_calc?.[0]) {
              message.error(cash?.amount_calc?.[0]);
            } else if (cash?.currency?.[0]) {
              message.error(cash?.currency?.[0]);
            } else if (cash?.currency_calc?.[0]) {
              message.error(cash?.currency_calc?.[0]);
            } else if (cash?.currency_rate?.[0]) {
              message.error(cash?.currency_rate?.[0]);
            } else if (cash?.currency_rate_calc?.[0]) {
              message.error(cash?.currency_rate_calc?.[0]);
            }
          } else if (res?.invoice_item) {
            const item = res?.invoice_item?.[0];
            if (item?.product?.[0]) {
              message.error(item?.product?.[0]);
            } else if (item?.qty?.[0]) {
              message.error(item?.qty?.[0]);
            } else if (res?.invoice_item?.unit?.[0]) {
              message.error(item?.unit?.[0]);
            } else if (item?.unit_conversion_rate?.[0]) {
              message.error(item?.unit_conversion_rate?.[0]);
            } else if (item?.each_price?.[0]) {
              message.error(item?.each_price?.[0]);
            } else if (item?.total_price?.[0]) {
              message.error(item?.total_price?.[0]);
            } else if (item?.warehouse?.[0]) {
              message.error(item?.warehouse?.[0]);
            } else if (item?.expire_date?.[0]) {
              message.error(item?.expire_date?.[0]);
            } else if (item?.description?.[0]) {
              message.error(item?.description?.[0]);
            }
          } else if (props?.type === 'quotation') {
            if (res?.discount?.[0]) {
              message.error(res?.discount?.[0]);
            } else if (res?.expense?.[0]) {
              message.error(res?.expense?.[0]);
            } else if (res?.net_amount?.[0]) {
              message.error(res?.net_amount?.[0]);
            } else if (res?.remain?.[0]) {
              message.error(res?.remain?.[0]);
            }
          }
          return error;
        });
    },
    [props.baseUrl, props.type, recordId, t, queryClient],
  );

  const {
    mutate: mutateEditSalesInvoice,
    isLoading,
    reset,
  } = useMutation(editSalesInvoice);

  const finalAmount = useMemo(
    () =>
      fixedNumber(
        print(
          math.evaluate(
            `(${totalOfItems ?? 0} + ${expense ?? 0}) - ${discount ?? 0}`,
          ),
        ),
      ),
    [discount, expense, totalOfItems],
  );

  const remainAmount = useMemo(
    () =>
      fixedNumber(
        print(math.evaluate(`${finalAmount ?? 0} - ${cashAmount ?? 0}`)),
      ),
    [cashAmount, finalAmount],
  );

  const summary = useMemo(() => {
    const data = [
      [
        {
          label: t('Sales.Customers.Form.Total'),
          value: totalOfItems,
        },
        {
          label: t('Sales.Customers.Discount.1'),
          value: discount,
        },
        {
          label: t('Expenses.1'),
          value: expense,
        },
        { label: t('Final_amount'), value: finalAmount },
      ],

      [
        {
          label:
            props?.type === 'sales' || props?.type === 'purchase_rej'
              ? t('Employees.Receive_cash')
              : t('Employees.Pay_cash'),
          value: cashAmount,
        },
        {
          label: t('Sales.All_sales.Invoice.Remain_amount'),
          value: remainAmount,
        },
      ],
    ];
    return props?.type === 'quotation' ? [data?.[0]] : data;
  }, [
    t,
    totalOfItems,
    discount,
    expense,
    finalAmount,
    props.type,
    cashAmount,
    remainAmount,
  ]);

  const handleSendOrder = () => {
    form.validateFields().then(async (values) => {
      const items = data?.reduce((items, item) => {
        console.log('itemssssssssss', item);
        if (item?.product?.value) {
          const expireDate =
            item?.expirationDate && props?.type !== 'sales'
              ? handlePrepareDateForServer({
                  date: item?.expirationDate,
                  calendarCode,
                  dateFormat: dateFormat1,
                })
              : item?.expirationDate;
          const warehouse = item?.warehouse?.value
            ? item?.warehouse?.value
            : values?.warehouseName?.value;
          const newItem = {
            unit: item?.unit?.value,
            unit_conversion_rate:
              item?.unit?.value === item?.prevUnit
                ? item?.unitConversionRate
                : handleFindUnitConversionRate(
                    item?.unit_conversion,
                    item?.unit?.value,
                    item?.product_units,
                  ),
            product: item?.id?.value,
            qty: item?.qty,
            each_price: invoiceFixedNumber(item?.each_price),
            description: item.description,
            warehouse_out: warehouse,
            warehouse_in: warehouse,
            expire_date:
              props.type === 'sales'
                ? item?.expirationDate
                : item?.expirationDate
                  ? expireDate
                  : undefined,
            invoice: props?.record?.id,
            id: item?.itemId,
            discount: item?.discountPercent,
          };
          if (
            props.type === 'sales' ||
            props?.type === 'purchase_rej' ||
            props?.type === 'quotation'
          ) {
            delete newItem['warehouse_in'];
          } else {
            delete newItem['warehouse_out'];
          }

          return [...items, newItem];
        } else {
          return items;
        }
      }, []);

      const updatedItems = items?.filter((item) => item?.id);
      const updatedItemsIds = items?.map((item) => item?.id);
      const createdItems = items?.filter((item) => item?.id);
      const deletedItems = invoiceItems?.filter(
        (item) => !updatedItemsIds?.includes(item),
      );

      if (items?.length === 0) {
        Modal.warning({
          bodyStyle: { direction: t('Dir') },
          title: t('Sales.All_sales.Invoice.Invoice_no_data_message'),
        });
      } else {
        const cashList = form.getFieldValue('cashList');
        const cashPayment = cashList?.map((item) => {
          return {
            pay_by: item?.pay_by?.value,
            rec_by: item?.rec_by?.value,
            description: item?.description,
            amount: item?.amount && invoiceFixedNumber(item?.amount),
            currency: item?.currency?.value,
            currency_rate: item?.currency_rate,
            amount_calc:
              item?.amount_calc && invoiceFixedNumber(item?.amount_calc),
            currency_calc: item?.currency_calc?.value,
            currency_rate_calc: item?.currency_rate_calc,
            id: item?.itemId,
          };
        });

        const cashPaymentUpdatedItems = cashPayment?.filter((item) =>
          Boolean(item?.id),
        );
        const cashPaymentUpdatedItemsIds = cashPayment?.map((item) => item?.id);
        const cashPaymentCreatedItems = cashPayment?.filter((item) => item?.id);
        const cashPaymentDeletedItems = cashPaymentItems?.filter(
          (item) => !cashPaymentUpdatedItemsIds?.includes(item),
        );
        console.log('values', values);
        console.log('data', data);
        const invoiceData = {
          invoice_state: values?.status,
          representative: `STF-${values?.employee?.value}`,
          // discount: invoiceFixedNumber(values?.discount),
          discount: values?.discount,
          expense: invoiceFixedNumber(values?.expense),
          currency: values?.currency?.value,
          currency_rate: values.currencyRate,
          date_time: handlePrepareDateForServer({
            date: values?.date,
            calendarCode,
          }),
          description: values.description,
          customer: `${
            props.type === 'purchase' || props.type === 'purchase_rej'
              ? 'SUP'
              : 'CUS'
          }-${values?.account?.value}`,
          invoice_items: {
            created_items:
              createdItems?.length === 0 ? undefined : createdItems,
            deleted_items:
              deletedItems?.length === 0 ? undefined : deletedItems,
            updated_items:
              updatedItems?.length === 0 ? undefined : updatedItems,
          },
        };
        if (props.type !== 'sales') {
          delete invoiceData['representative'];
        }
        if (props?.type === 'quotation') {
          mutateEditSalesInvoice(invoiceData);
        } else {
          const allData = {
            ...invoiceData,
            cash_payment: {
              created_items:
                cashPaymentCreatedItems?.length === 0
                  ? undefined
                  : cashPaymentCreatedItems,
              deleted_items:
                cashPaymentDeletedItems?.length === 0
                  ? undefined
                  : cashPaymentDeletedItems,
              updated_items:
                cashPaymentUpdatedItems?.length === 0
                  ? undefined
                  : cashPaymentUpdatedItems,
            },
          };
          console.log('all Data', allData);
          if (cashAmount > finalAmount) {
            Modal.confirm({
              bodyStyle: { direction: t('Dir') },
              title: t('Invoice_final_amount_less_than_pay_cash_message'),
              onOk: () => mutateEditSalesInvoice(allData),
            });
          } else {
            mutateEditSalesInvoice(allData);
          }
        }
      }
    });
  };

  const handelCancel = () => {
    setVisible(false);
  };

  const handleAfterVisibleChange = useCallback(
    async (visible) => {
      if (visible === false) {
        form.resetFields();
        setPrevCurrency(1);
        setEditingKey('');
        setCount(1);
        setData([]);
        setCurrencyValue(baseCurrencyId);
        setSelectedRowKeys([]);
        setTotalOfItems(0);
        setDiscount(0);
        setExpense(0);
        setResponse({});
        setCashAmount(0);
        setShowHeader(true);
        setShowFooter(true);
        setCurrencySymbol(baseCurrencySymbol);
        setEditSpin(false);
        setPrevCashCurrency([]);
        reset();
        setIsDiscount({
          productDiscount: false,
          globalDiscount: false,
        });
        setInvoiceItems([]);
        setPrevStatistic([]);
        setCashPaymentItems([]);
        setWarehouseId('');
      } else {
        const allData = await axiosInstance
          .get(
            `${props.baseUrl}${recordId}/?omit=created_by,customer.content_type,invoice_total,created,modified,
modified_by,order_invoice_finish,representative.content_type&expand=cash_payment.pay_by,
cash_payment.rec_by,cash_payment.currency,cash_payment.currency_calc,representative,
customer,currency,invoice_items.warehouse_out,invoice_items.warehouse_in,invoice_items.product.product_barcode
,invoice_items.product.product_barcode.unit,invoice_items.unit,invoice_items.product.product_units
,invoice_items.product.product_units.unit,invoice_items.product.price,invoice_items.product.price.unit
,invoice_items.product.unit_conversion,invoice_items.product.unit_conversion.unit,invoice_items.product.product_statistic`,
            { timeout: 0 },
          )
          .catch((error) => {
            setEditSpin(false);
            return error;
          });

        if (allData?.data) {
          const { data } = allData;

          const newData = data?.invoice_items?.reduce(
            (
              { items, totalItems, statistic, invoiceItemsIds, discount },
              item,
              index,
            ) => {
              const warehouse =
                props.type === 'purchase' || props.type === 'sales_rej'
                  ? item?.warehouse_in
                  : item?.warehouse_out;

              const productStatistic = {
                id: item?.product?.id,
                statistic:
                  parseFloat(item?.unit_conversion_rate) ??
                  0 * parseFloat(item?.qty),
                key: index + 1,
                warehouse: warehouse?.id,
              };

              const expireDate =
                item?.expire_date && props?.type !== 'sales'
                  ? handlePrepareDateForDateField({
                      date: item?.expire_dat,
                      calendarCode,
                      dateFormat: dateFormat1,
                    })
                  : item?.expire_date;
              // const expireDate =
              //   item?.expire_date && props?.type !== "sales"
              //     ? calendarCode === "gregory"
              //       ? moment(item?.expire_date, dateFormat)
              //       : dayjs(changeGToJ(item?.expire_date, dateFormat), {
              //           //@ts-ignore
              //           jalali: true,
              //         })
              //     : item?.expire_date;

              const totalPrice = parseFloat(
                print(
                  math.evaluate(`${item?.each_price ?? 0} * ${item?.qty ?? 0}`),
                ),
              );

              const totalOfItems = parseFloat(
                print(math.evaluate(`${totalItems ?? 0} + ${totalPrice ?? 0}`)),
              );
              const newDiscount = parseFloat(
                print(
                  math.evaluate(`${discount ?? 0} + ${item?.discount ?? 0}`),
                ),
              );

              const newItem = {
                ...item?.product,
                key: index + 1,
                serial: index + 1,
                product: {
                  label: item?.product?.name,
                  value: item?.product?.id,
                },
                id: { label: item?.product?.id, value: item?.product?.id },
                unit: { value: item?.unit?.id, label: item?.unit?.name },
                prevUnit: item?.unit?.id,
                qty: parseFloat(item?.qty),
                each_price: parseFloat(item?.each_price),
                total_price: totalPrice,
                warehouse: {
                  value: warehouse?.id,
                  label: warehouse?.name,
                },
                expirationDate: expireDate,
                itemId: item?.id,
                description: item?.description,
                unitConversionRate: item?.unit_conversion_rate,
                discount: item?.discount ?? 0,
                discountPercent: parseFloat(
                  print(
                    math.evaluate(
                      `(100 * ${item?.discount ?? 0}) / ${totalPrice ?? 1}`,
                    ),
                  ),
                ),
              };
              return {
                items: [...items, newItem],
                totalItems: totalOfItems,
                discount: newDiscount,
                statistic: [...statistic, productStatistic],
                invoiceItemsIds: [...invoiceItemsIds, item?.id],
              };
            },
            {
              items: [],
              totalItems: 0,
              statistic: [],
              invoiceItemsIds: [],
              discount: 0,
            },
          );
          const date = handlePrepareDateForDateField({
            date: data?.date_time,
            calendarCode,
          });
          const cashPayment = data?.cash_payment?.reduce(
            ({ items, itemsId, prevCashPayment, cashAmount }, item, index) => {
              const amount = parseFloat(item?.amount);
              const itemCashAmount = fixedNumber(
                parseFloat(
                  print(
                    math.evaluate(
                      `(${item?.currency_rate ?? 0} / ${
                        data?.currency_rate ?? 1
                      }) * ${item?.amount ?? 1}`,
                    ),
                  ),
                ),
              );
              const newItem = {
                date_time: date,
                description: item?.description,
                currency: {
                  value: item?.currency?.id,
                  label: item?.currency?.name,
                },
                currencySymbol: item?.currency?.symbol,
                calCurrencySymbol: item?.currency_calc?.symbol,
                currency_rate: item?.currency_rate,
                amount: parseFloat(item?.amount),
                amount_calc: parseFloat(item?.amount_calc),
                currency_calc: {
                  value: item?.currency_calc?.id,
                  label: item?.currency_calc?.name,
                },
                currency_rate_calc: item?.currency_rate_calc,
                cashAmount: itemCashAmount ?? 0,
                bank:
                  props.type === 'purchase' || props.type === 'purchase_rej'
                    ? item?.pay_by?.name
                    : item?.rec_by?.name,
                pay_by: {
                  value: item?.pay_by?.id,
                  label: item?.pay_by?.name,
                },
                rec_by: {
                  value: item?.rec_by?.id,
                  label: item?.rec_by?.name,
                },
                itemId: item?.id,
                key: index + 1,
              };

              const prevItem = prevCashPayment?.find(
                (item) =>
                  item?.currency === item?.currency?.id &&
                  item?.bank === item?.pay_by?.id,
              );

              if (prevItem?.currency) {
                return {
                  items: [...items, newItem],
                  itemsId: [...itemsId, item?.id],
                  prevCashPayment: prevCashPayment?.map((item) => {
                    if (
                      item?.currency === prevItem?.currency &&
                      item?.bank === prevItem?.bank
                    ) {
                      return {
                        ...item,
                        amount: parseFloat(item?.amount) + parseFloat(amount),
                      };
                    } else {
                      return item;
                    }
                  }),
                  cashAmount: cashAmount + itemCashAmount,
                };
              } else {
                return {
                  items: [...items, newItem],
                  itemsId: [...itemsId, item?.id],
                  prevCashPayment: [
                    ...prevCashPayment,
                    {
                      currency: item?.currency?.id,
                      amount: parseFloat(item?.amount),
                      bank: item?.pay_by?.id,
                    },
                  ],
                  cashAmount: cashAmount + itemCashAmount,
                };
              }
            },
            { items: [], itemsId: [], prevCashPayment: [], cashAmount: 0 },
          );

          const warehouse =
            props.type === 'purchase' || props.type === 'sales_rej'
              ? data?.invoice_items?.[0]?.warehouse_in
              : data?.invoice_items?.[0]?.warehouse_out;

          form.setFieldsValue({
            date: date,
            currency: {
              value: data?.currency?.id,
              label: data?.currency?.name,
            },
            currencyRate: data?.currency_rate,
            description: data?.description,
            account: {
              value: data?.customer?.content_object?.id,
              label: data?.customer?.content_object?.full_name,
            },
            warehouseName: {
              value: warehouse?.id,
              label: warehouse?.name,
            },
            employee: {
              value: data?.representative?.content_object?.id,
              label: data?.representative?.content_object?.full_name,
            },
            status: data?.invoice_state,
            discount: parseFloat(data?.discount ?? 0),
            expense: parseFloat(data?.expense ?? 0),
            cashList: cashPayment?.items,
          });
          setIsDiscount({
            productDiscount: parseFloat(data?.discount) > 0 ? true : false,
            globalDiscount: parseFloat(newData?.discount) > 0 ? true : false,
          });
          setInvoiceItems(newData?.invoiceItemsIds);
          setTotalOfItems(newData?.totalItems);
          setPrevStatistic(newData?.statistic);
          setCount(data?.invoice_items?.length + 1);
          setDiscount(
            parseFloat(data?.discount ?? 0) > 0
              ? parseFloat(data?.discount ?? 0)
              : parseFloat(newData?.discount),
          );
          setExpense(parseFloat(data?.expense ?? 0));
          setCashAmount(cashPayment?.cashAmount);
          setPrevCashCurrency(cashPayment?.prevCashPayment);
          setCashPaymentItems(cashPayment?.itemsId);
          setData(newData?.items);
          setCurrencySymbol(data?.currency?.symbol);
          setCurrencyValue(data?.currency?.id);
          setPrevCurrency(data?.currency_rate);
          setEditSpin(false);
        }
      }
    },
    [
      form,
      baseCurrencyId,
      baseCurrencySymbol,
      reset,
      props.baseUrl,
      props.type,
      recordId,
      calendarCode,
    ],
  );

  return (
    <div>
      <div type='primary' shape='round' onClick={showDrawer} className='num'>
        {props.title}
      </div>
      <Drawer
        maskClosable={false}
        mask={true}
        title={startCase(props.title)}
        height='100%'
        onClose={handelCancel}
        open={visible}
        destroyOnClose
        afterVisibleChange={handleAfterVisibleChange}
        placement='top'
        bodyStyle={{ paddingBottom: 10 }}
        footer={
          <Row justify='end'>
            <Col>
              <Space size={10}>
                {props?.type === 'sales' && (
                  <PrintInvoiceButton
                    // disabled={false}
                    disabled={!response?.id}
                    title={startCase(t('Warehouse_remittance'))}
                    dataSource={data}
                    type='warehouseRemittance'
                    summary={[]}
                    form={form}
                    id={response?.id}
                    printText={t('Warehouse_remittance')}
                    isPrinted={true}
                  />
                )}
                <PrintInvoiceButton
                  disabled={!response?.id}
                  title={startCase(props.title)}
                  dataSource={data}
                  type={props.type}
                  summary={summary}
                  form={form}
                  id={response?.id}
                  isPrinted={true}
                />
                <CancelButton onClick={handelCancel} disabled={response?.id} />
                <SaveButton
                  onClick={handleSendOrder}
                  loading={isLoading}
                  disabled={
                    editSpin || editingKey !== '' || response?.id ? true : false
                  }
                />
              </Space>
            </Col>
          </Row>
        }
      >
        <Form layout='vertical' hideRequiredMark form={form}>
          <Spin spinning={editSpin} size='large'>
            <Row>
              {showHeader ? (
                <Col span={24}>
                  <InvoiceHeader
                    {...{
                      form,
                      type: props?.type,
                      responseId: Boolean(response?.id),
                      currencyValue,
                      setCurrencyValue,
                      onChangeCurrency,
                      onChangeCurrencyRate,
                      setWarehouseId,
                    }}
                  />
                </Col>
              ) : null}
              <Col span={24}>
                <InvoiceTable
                  data={data}
                  form={form}
                  setData={setData}
                  onHeaderCollapsed={onHeaderCollapsed}
                  showHeader={showHeader}
                  // onFooterCollapsed={onFooterCollapsed}
                  // showFooter={showFooter}
                  setCount={setCount}
                  count={count}
                  place='edit'
                  warehouseId={warehouseId}
                  prevStatistic={prevStatistic}
                  setSelectedRowKeys={setSelectedRowKeys}
                  selectedRowKeys={selectedRowKeys}
                  currency={baseCurrency?.data}
                  handleAddProduct={handleAddProduct}
                  type={props.type}
                  setEditingKey={setEditingKey}
                  editingKey={editingKey}
                  responseId={response?.id}
                  productDiscount={productDiscount}
                />
              </Col>
              {showFooter && (
                <Col span={24}>
                  <InvoicesFooter
                    {...{
                      responseId: Boolean(response?.id),
                      type: props?.type,
                      handleChangeExpense,
                      total: totalOfItems,
                      cashAmount,
                      discount,
                      expense,
                      remainAmount,
                      finalAmount,
                      globalDiscount,
                    }}
                  >
                    {props?.type !== 'quotation' && (
                      <MultipleCashPayment
                        {...{
                          form,
                          type: props?.type,
                          responseId: Boolean(response?.id),
                          calendarCode,
                          finalAmount,
                          currencySymbol,
                          setCashAmount,
                          actionType: 'edit',
                          prevCashCurrency,
                          cashAmount,
                        }}
                      />
                    )}
                  </InvoicesFooter>
                </Col>
              )}
            </Row>
          </Spin>
        </Form>
      </Drawer>
    </div>
  );
};

export default EditInvoice;
