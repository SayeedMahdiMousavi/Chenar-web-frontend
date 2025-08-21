import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import startCase from "lodash/startCase";
import ReceiveCash from "./SalesInvoiceComponents/ReceiveCash";
import { fixedNumber, math, print } from "../../../../Functions/math";
import { debounce } from "throttle-debounce";
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  InputNumber,
  message,
  Space,
  Modal,
  Spin,
  Descriptions,
} from "antd";
import dayjs from "dayjs";
import { connect } from "react-redux";
import axiosInstance from "../../../ApiBaseUrl";
import { useMutation, useQueryClient } from "react-query";
import InvoiceTable from "./InvoiceTable";
import { CurrencyProperties } from "../../../Transactions/Components/CurrencyProperties";
import { DatePickerFormItem } from "../../../SelfComponents/JalaliAntdComponents/DatePickerFormItem";
import { InfiniteListNameAndIdFormItem } from "./SalesInvoiceComponents/InfiniteListNameAndIdFormItem";
import Checkbox from "antd/lib/checkbox/Checkbox";
import moment from "moment";
import { CloseOutlined } from "@ant-design/icons";
import useGetCalender from "../../../../Hooks/useGetCalender";
import { changeGToJ, changeJToG } from "../../../../Functions/utcDate";
import useGetBaseCurrency from "../../../../Hooks/useGetBaseCurrency";
import PrintInvoiceButton from "../MarketInvoiceComponents/PrintInvoiceButton";
import { ActionMessage } from "../../../SelfComponents/TranslateComponents/ActionMessage";
import { InfiniteScrollSelectFormItem } from "../../../../components/antd";
import {
  expireProductsBaseUrl,
  productStatisticsBaseUrl,
} from "../../../Reports/AllReports/AllReports";
import { handleFindUnitConversionRate } from "../../../../Functions";

const invoiceFixedNumber = (value) => {
  const newValue = fixedNumber(value, 20);
  return newValue;
};

const dateFormat = "YYYY-MM-DD HH:mm ";
const dateFormat1 = "YYYY-MM-DD";
const EditInvoice = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [prevStatistic, setPrevStatistic] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [cashReceive, setCashReceive] = useState({});
  const [form] = Form.useForm();
  const [count, setCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [remainAmount, setRemainAmount] = useState(0);
  const [response, setResponse] = useState({});
  const [totalOfItems, setTotalOfItems] = useState(0);
  const [currencyValue, setCurrencyValue] = useState(1);
  const [prevCurrency, setPrevCurrency] = useState(1);
  const [editingKey, setEditingKey] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [debit, setDebit] = useState(false);
  const [editSpin, setEditSpin] = useState(false);
  const [prevCashCurrency, setPrevCashCurrency] = useState({
    currency: "",
    amount: 0,
  });
  const [data, setData] = useState([]);
  const [account, setAccount] = useState("");
  const [warehouseName, setWarehouseName] = useState({ value: "", label: "" });
  const [currencyName, setCurrencyName] = useState("");
  const [discount, setDiscount] = useState(0);
  const [expense, setExpense] = useState(0);
  const [description, setDescription] = useState("");

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
  const calenderCode = userCalender?.data?.user_calender?.code;

  const onHeaderCollapsed = () => {
    setShowHeader(!showHeader);
  };

  const onChangeCustomerName = useCallback(
    (value) => {
      setAccount(value?.full_name);
      form.setFieldsValue({
        // customerId: value?.id,
        phone:
          value?.phone_number +
          `${value?.phone_number && value?.mobile_number && ","}` +
          value?.mobile_number,
        fax: value?.fax_number,
        creditLimit: value?.credit_limit,
        address: value?.full_billing_address,
      });
    },
    [form]
  );
  // const onChangeCustomerId = (value) => {
  //   setAccount(value?.full_name);
  //   form.setFieldsValue({
  //     customerName: {
  //       value: value?.id,
  //       label: value?.full_name,
  //     },
  //     phone: value?.phone_number + "" + value?.mobile_number,
  //     fax: value?.fax_number,
  //     creditLimit: value?.credit_limit,
  //     address: value?.full_billing_address,
  //   });
  // };

  const onChangeSupplierName = useCallback(
    (value) => {
      setAccount(value?.full_name);
      form.setFieldsValue({
        // supplierId: value?.id,
        phone:
          value?.phone_number +
          `${value?.phone_number && value?.mobile_number && ","}` +
          value?.mobile_number,
        fax: value?.fax_number,
        creditLimit: value?.credit_limit,
        address: value?.full_billing_address,
      });
    },
    [form]
  );
  // const onChangeSupplierId = (value) => {
  //   setAccount(value?.full_name);
  //   form.setFieldsValue({
  //     supplierName: {
  //       value: value?.id,
  //       label: value?.full_name,
  //     },
  //     phone: value?.phone_number + "" + value?.mobile_number,
  //     fax: value?.fax_number,
  //     creditLimit: value?.credit_limit,
  //     address: value?.full_billing_address,
  //   });
  // };

  const onChangeWarehouseName = useCallback((value) => {
    setWarehouseName({ label: value?.name, value: value?.id });
    // form.setFieldsValue({
    //   warehouseId: value?.id,
    // });
  }, []);

  // const onChangeWarehouseId = (value) => {
  //   setWarehouseName({ label: value?.name, value: value?.id });
  //   form.setFieldsValue({
  //     warehouseName: { value: value?.id, label: value.name },
  //   });
  // };

  const handleAddProduct = useCallback(async () => {
    const newData = {
      key: count,
      row: `${count}`,
      serial: count,
      id: { value: "", label: "" },
      product: { value: "", label: "" },
      unit: { value: "", label: "" },
      qty: 1,
      each_price: 0,
      total_price: 0,
      description: "",
    };

    setData((prev) => [...prev, newData]);
    setCount(count + 1);
  }, [count]);

  const handelChangeCurrencyChangeAllTotalPrice = useCallback(
    (data, currencyRate, newCurrencyRate) => {
      const newData = data?.map((item) => {
        const eachPrice = print(
          math.evaluate(
            `(${item?.each_price}*${currencyRate})/${newCurrencyRate}`
          )
        );

        return {
          ...item,
          each_price: eachPrice,
          total_price: invoiceFixedNumber(
            print(math.evaluate(`${item?.qty}*${eachPrice}`))
          ),
        };
      });
      setData(newData);
    },
    []
  );

  const payCash = cashReceive?.amount1;

  const onChangeCurrency = useCallback(
    (value) => {
      setCurrencyName(value?.name);
      const currencyRate = form.getFieldValue("currencyRate");
      const newCurrencyRate = print(
        math.evaluate(`${value?.base_amount}/${value?.equal_amount}`)
      );

      setPrevCurrency(newCurrencyRate);

      handelChangeCurrencyChangeAllTotalPrice(
        data,
        currencyRate,
        newCurrencyRate
      );
      if (payCash) {
        setCashReceive((prev) => {
          const newAmount = print(
            math.evaluate(
              `(${prev?.currency_rate}/${newCurrencyRate})*${prev?.amount}`
            )
          );
          const newCashReceive = { ...prev, amount1: newAmount };
          return newCashReceive;
        });
      }
      setCurrencySymbol(value?.symbol);
    },
    [payCash, data, form, handelChangeCurrencyChangeAllTotalPrice]
  );

  const onChangeCurrencyRate = useCallback(
    (value) => {
      handelChangeCurrencyChangeAllTotalPrice(data, prevCurrency, value);
      setPrevCurrency(value);

      if (payCash) {
        setCashReceive((prev) => {
          const newAmount = print(
            math.evaluate(`(${prev?.currency_rate}/${value})*${prev?.amount}`)
          );
          const newCashReceive = { ...prev, amount1: newAmount };
          return newCashReceive;
        });
      }
    },
    [payCash, data, handelChangeCurrencyChangeAllTotalPrice, prevCurrency]
  );

  const handleChangeExpense = (value, type) => {
    debounceExpenseFun(value, type);
  };

  const debounceExpenseFun = debounce(800, (value, type) => {
    const row = form.getFieldsValue();
    const total = data?.reduce(
      (sum, item) => print(math.evaluate(`${sum}+${item?.total_price}`)),
      0
    );

    const totalValue = total ? invoiceFixedNumber(total) : 0;
    const discount = row?.discount !== "" ? row?.discount ?? 0 : 0;
    const expense = row?.expense !== "" ? row?.expense ?? 0 : 0;
    const totalDataValue = totalValue ?? 0;
    const newTotal = print(
      math.evaluate(
        `(${invoiceFixedNumber(totalDataValue)}+${expense})-${discount}`
      )
    );

    const remainAmount = cashReceive?.amount1
      ? print(
          math.evaluate(
            `(${invoiceFixedNumber(
              totalDataValue
            )}+${expense})-(${discount}+${invoiceFixedNumber(
              cashReceive?.amount1
            )})`
          )
        )
      : print(
          math.evaluate(
            `(${invoiceFixedNumber(totalDataValue)}+${expense})-${discount}`
          )
        );

    form.setFieldsValue({
      total: invoiceFixedNumber(newTotal),
      remainAmount: invoiceFixedNumber(remainAmount),
    });

    setTotalPrice(invoiceFixedNumber(newTotal));
    setRemainAmount(invoiceFixedNumber(remainAmount));
    setTotalOfItems(invoiceFixedNumber(totalDataValue));
    if (row.expense === null) {
      form.setFieldsValue({ expense: 0 });
    }
    if (row.discount === null) {
      form.setFieldsValue({ discount: 0 });
    }
    if (type === "discount") {
      setDiscount(value ?? 0);
    } else {
      setExpense(value ?? 0);
    }
  });

  const numberInputReg = /^0/;
  const discountFormat = (value) => {
    return parseInt(value) > parseInt(totalOfItems)
      ? totalOfItems
      : value < 0
      ? 0
      : numberInputReg.test(value)
      ? 0
      : value;
  };

  const expenseFormat = (value) =>
    value < 0 ? 0 : numberInputReg.test(value) ? 0 : value;

  React.useEffect(() => {
    const row = form.getFieldsValue();
    const total = data?.reduce(
      (sum, item) => print(math.evaluate(`${sum}+${item?.total_price}`)),
      0
    );
    const totalDataValue = total ? invoiceFixedNumber(total) : 0;
    if (totalDataValue <= row.discount) {
      const remainAccount = payCash
        ? print(math.evaluate(`${row?.expense}-${invoiceFixedNumber(payCash)}`))
        : row?.expense;

      const discount = parseFloat(parseFloat(totalDataValue).toFixed(5));

      form.setFieldsValue({
        discount: parseInt(totalDataValue),
        total: row?.expense,
        remainAmount: remainAccount,
      });

      setDiscount(discount);
      setRemainAmount(invoiceFixedNumber(remainAmount));
      setTotalPrice(0);
      setTotalOfItems(discount);
    } else {
      const discount = row?.discount !== "" ? row?.discount ?? 0 : 0;
      const expense = row?.expense !== 0 ? row?.expense ?? 0 : 0;
      const total = invoiceFixedNumber(totalDataValue)
        ? invoiceFixedNumber(
            print(
              math.evaluate(
                `(${invoiceFixedNumber(totalDataValue)}+${expense})-${discount}`
              )
            )
          )
        : 0;

      const remainAmount =
        payCash && invoiceFixedNumber(payCash) > 0
          ? invoiceFixedNumber(
              print(
                math.evaluate(
                  `(${invoiceFixedNumber(
                    totalDataValue
                  )}+${expense})-(${discount}+${invoiceFixedNumber(payCash)})`
                )
              )
            )
          : invoiceFixedNumber(total);

      form.setFieldsValue({
        total: invoiceFixedNumber(total),
        remainAmount: invoiceFixedNumber(remainAmount),
      });
      setRemainAmount(invoiceFixedNumber(remainAmount));
      setTotalPrice(invoiceFixedNumber(total));
      setTotalOfItems(invoiceFixedNumber(totalDataValue));
    }
  }, [data, form, payCash, remainAmount]);

  const recordId = props?.record?.id;
  const dateTime = props?.record?.date_time;

  const editSalesInvoice = useCallback(
    async (value) => {
      await axiosInstance
        .put(`${props.baseUrl}${recordId}/`, value, { timeout: 0 })
        .then((res) => {
          message.success(
            <ActionMessage
              name={`${t("Sales.All_sales.Invoice.Invoice")} ${res?.data?.id}`}
              message="Message.Update"
            />
          );
          setLoading(false);
          setResponse(res.data);
          // setVisible(false);
          queryClient.invalidateQueries(props.baseUrl);
          if (props?.type !== "quotation") {
            queryClient.invalidateQueries(expireProductsBaseUrl);
            queryClient.invalidateQueries(productStatisticsBaseUrl);
          }
        })
        .catch((error) => {
          setLoading(false);
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
          } else if (props?.type === "quotation") {
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
        });
    },
    [props.baseUrl, recordId, props.type, t]
  );

  const { mutate: mutateEditSalesInvoice } = useMutation(editSalesInvoice, {
    onSuccess: () => {
      // queryClient.invalidateQueries(`${props.baseUrl}`);
      // if (payCash) {
      //   queryClient.invalidateQueries(`/pay_receive_cash/report/journal/`);
      //   queryClient.invalidateQueries(
      //     `/pay_receive_cash/report/journal/journal_result/`
      //   );
      // }
    },
  });

  let isSendOrder = false;
  const handleSendOrder = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        const items = data?.reduce((items, item) => {
          // 
          // const expireDate = item?.expirationDate
          //   ? calenderCode === "gregory"
          //     ? item?.expirationDate?.format(dateFormat1)
          //     : changeJToG(
          //         item?.expirationDate?.locale("fa")?.format(dateFormat1),
          //         dateFormat1
          //       )
          //   : item?.expirationDate;

          if (item?.product?.value) {
            const expireDate =
              item?.expirationDate && props?.type !== "sales"
                ? calenderCode === "gregory"
                  ? item?.expirationDate?.format(dateFormat1)
                  : changeJToG(
                      item?.expirationDate?.locale("fa")?.format(dateFormat1),
                      dateFormat1
                    )
                : item?.expirationDate;
            const newItem = {
              currency: values?.currency?.value,
              currency_rate: values?.currencyRate,
              unit: item?.unit?.value,
              unit_conversion_rate: handleFindUnitConversionRate(
                item?.unit_conversion,
                item?.unit?.value,
                item?.product_units
              ),
              product: item?.id?.value,
              qty: item?.qty,
              each_price: invoiceFixedNumber(item?.each_price),
              total_price: invoiceFixedNumber(item?.total_price),
              description: item.description,
              warehouse: item?.warehouse?.value
                ? item?.warehouse?.value
                : values?.warehouseName?.value,
              discount: 0,
              expense: 0,
              // expire_date: expireDate,
              expire_date:
                props.type === "sales"
                  ? item?.expirationDate
                  : item?.expirationDate
                  ? expireDate
                  : undefined,
              discount_type: "simple",
              invoice: props?.record?.id,
            };
            return [...items, newItem];
          } else {
            return items;
          }
        }, []);

        if (items?.length === 0) {
          Modal.warning({
            bodyStyle: { direction: t("Dir") },
            title: t("Sales.All_sales.Invoice.Invoice_no_data_message"),
          });
          setLoading(false);
        } else {
          setLoading(true);
          const payment = {
            discount: invoiceFixedNumber(values?.discount),
            expense: invoiceFixedNumber(values?.expense),
            net_amount: invoiceFixedNumber(values?.total),
            remain: invoiceFixedNumber(values?.remainAmount),
            invoice_type: props?.type,
          };
          // 
          const payCash = {
            // id:
            //   props?.record?.payment_summery?.cash_fin?.id &&
            //   props?.record?.payment_summery?.cash_fin?.id,
            fiscal_year: props?.record?.payment_summery?.cash_fin?.fiscal_year,
            pay_by: cashReceive?.pay_by?.value,
            rec_by: cashReceive?.rec_by?.value,
            date_time: cashReceive?.date_time,
            description: cashReceive?.description,
            amount:
              cashReceive?.amount && invoiceFixedNumber(cashReceive?.amount),
            currency: cashReceive?.currency?.value,
            currency_rate: cashReceive?.currency_rate,
            amount_calc:
              cashReceive?.amount_calc &&
              invoiceFixedNumber(cashReceive?.amount_calc),
            currency_calc: cashReceive?.currency_calc?.value,
            currency_rate_calc: cashReceive?.currency_rate_calc,
            transaction_type: "invoice",
            related_to:
              props.type === "purchase" || props.type === "purchase_rej"
                ? "supplier"
                : "customer",
          };
          if (props?.type === "quotation") {
            const allData = {
              ...payment,
              currency: values?.currency?.value,
              currency_rate: values?.currencyRate,
              date_time: dateTime,
              description: values?.description,
              warehouse: values?.warehouseName?.value,
              customer: `CUS-${values?.customerName?.value}`,
              invoice_item: items,
            };
            mutateEditSalesInvoice(allData);
          } else {
            // 
            const allData = {
              sales_source: "normal",
              fiscal_year: props?.record?.fiscal_year,

              currency: values?.currency?.value,
              currency_rate: values.currencyRate,
              date_time: dateTime,
              description: values.description,
              warehouse: values?.warehouseName?.value,
              customer:
                props.type === "purchase" || props.type === "purchase_rej"
                  ? `SUP-${values?.supplierName?.value}`
                  : `CUS-${values?.customerName?.value}`,
              payment_summery: {
                ...payment,
                id: props?.record?.payment_summery?.id,
              },
              invoice_item: items,
              payment_cash: payCash?.currency ? payCash : undefined,
              expense_of_discount: null,
            };
            if (props.type !== "sales") {
              delete allData["sales_source"];
            }
            if (isSendOrder) {
              return;
            }
            isSendOrder = true;

            try {
              mutateEditSalesInvoice(allData);

              isSendOrder = false;
            } catch (info) {
              // 
              isSendOrder = false;
            }
          }
        }
      })
      .catch((info) => {
        
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
        setDebit(false);
        setEditingKey("");
        setCashReceive({});
        setLoading(false);
        setCount(1);

        setData([]);
        setCurrencyValue(baseCurrencyId);
        setSelectedRowKeys([]);
        setTotalOfItems(0);
        setTotalPrice(0);
        setRemainAmount(0);
        setDiscount(0);
        setExpense(0);
        setWarehouseName({ label: "", value: "" });
        setCurrencyName("");
        setAccount("");
        setDescription("");
        setResponse({});
        setShowHeader(true);
        setShowFooter(true);
        setCurrencySymbol(baseCurrencySymbol);
        setEditSpin(false);
        setPrevCashCurrency({ currency: "", amount: 0 });
      } else {
        const allData = await axiosInstance
          .get(
            `${props.baseUrl}${recordId}/?omit=created_by&expand=*,invoice_item.product.product_statistic,invoice_item.product.product_barcode,invoice_item.product.product_barcode.unit,customer,currency,warehouse,payment_summery.cash_fin.rec_by,payment_summery.cash_fin.pay_by,payment_summery.cash_fin.currency,payment_summery.cash_fin.currency_calc,payment_summery.expense_of_discount,invoice_item.product,invoice_item.unit,invoice_item.product.product_units,invoice_item.product.product_units.unit,invoice_item.product.price,invoice_item.product.unit_conversion,invoice_item.product.unit_conversion.unit,invoice_item.product.price.unit,invoice_item.warehouse`,
            { timeout: 0 }
          )
          .catch((error) => {
            
            setEditSpin(false);
          });

        if (allData?.data) {
          const { data } = allData;
          const statistic = [];
          const newData = data?.invoice_item?.map((item, index) => {
            // 
            const conversion = handleFindUnitConversionRate(
              item?.product?.unit_conversion,
              item?.unit?.id,
              item?.product_units
            );

            const productStatistic = {
              id: item?.product?.id,
              statistic: conversion * item?.qty,
              key: index + 1,
              warehouse: data?.warehouse?.id,
            };

            statistic.push(productStatistic);

            // const expireDate = item?.expire_date
            //   ? calenderCode === "gregory"
            //     ? moment(item?.expire_date, dateFormat)
            //     : dayjs(changeGToJ(item?.expire_date, dateFormat), {
            //         //@ts-ignore
            //         jalali: true,
            //       })
            //   : item?.expire_date;

            const expireDate =
              item?.expire_date && props?.type !== "sales"
                ? calenderCode === "gregory"
                  ? moment(item?.expire_date, dateFormat)
                  : dayjs(changeGToJ(item?.expire_date, dateFormat), {
                      //@ts-ignore
                      jalali: true,
                    })
                : item?.expire_date;

            const newItem = {
              ...item?.product,
              key: index + 1,
              serial: index + 1,
              product: { label: item?.product?.name, value: item?.product?.id },
              id: { label: item?.product?.id, value: item?.product?.id },
              currency: item?.currency,
              currency_rate: parseFloat(item?.currency_rate),
              unit: { value: item?.unit?.id, label: item?.unit?.name },
              qty: parseFloat(item?.qty),
              each_price: parseFloat(item?.each_price),
              total_price: parseFloat(item?.total_price),
              warehouse: {
                value: item?.warehouse?.id,
                label: item?.warehouse?.name,
              },
              expirationDate: expireDate,
              itemId: item?.id,
              description: item?.description,
            };
            return newItem;
          });

          setPrevStatistic(statistic);
          setCount(data?.invoice_item?.length + 1);
          // 
          // const data

          // setDiscount(data?.payment_summery?.coupon_amount);

          // setPaymentSummery(data?.payment_summery);
          // setCash(data?.payment_summery?.cash_fin?.rec_by?.id);
          const date =
            calenderCode === "gregory"
              ? moment(dateTime, dateFormat)
              : dayjs(changeGToJ(dateTime, dateFormat), {
                  //@ts-ignore
                  jalali: true,
                });

          const cashFin = data?.payment_summery?.cash_fin;
          // 
          const formData = {
            date: date,
            currency: {
              value: data?.currency?.id,
              label: data?.currency?.name,
            },
            currencyRate: data?.currency_rate,
            warehouseName: {
              value: data?.warehouse?.id,
              label: data?.warehouse?.name,
            },
            // warehouseId: data?.warehouse?.id,
            description: data?.description,

            remainAmount: data?.payment_summery?.remain ?? 0,
            receiveCash:
              cashFin?.amount &&
              `${parseFloat(cashFin?.amount)} ${cashFin?.currency?.symbol}`,
            phone:
              data?.customer?.content_object?.phone_number +
              "" +
              data?.customer?.content_object?.mobile_number,
            fax: data?.customer?.content_object?.fax_number,
            creditLimit: data?.customer?.content_object?.credit_limit,
            address: data?.customer?.content_object?.full_billing_address,
          };

          // 

          setPrevCashCurrency({
            currency: cashFin?.currency?.id,
            amount: parseFloat(cashFin?.amount),
          });
          const cashDateTime =
            calenderCode === "gregory"
              ? moment(cashFin?.date_time, dateFormat)
              : dayjs(changeGToJ(cashFin?.date_time, dateFormat), {
                  //@ts-ignore
                  jalali: true,
                });

          const cashReceive = {
            date_time: cashDateTime,
            description: cashFin?.description,
            currency: {
              value: cashFin?.currency?.id,
              label: cashFin?.currency?.name,
            },
            currency_rate: cashFin?.currency_rate,
            amount: parseFloat(cashFin?.amount),
            amount_calc: parseFloat(cashFin?.amount_calc),
            currency_calc: {
              value: cashFin?.currency_calc?.id,
              label: cashFin?.currency_calc?.name,
            },
            currency_rate_calc: cashFin?.currency_rate_calc,
            amount1: cashFin?.amount
              ? print(
                  math.evaluate(
                    `(${cashFin?.currency_rate}/${data?.currency_rate})*${cashFin?.amount}`
                  )
                )
              : 0,
            pay_by: {
              value: cashFin?.pay_by?.id,
              label: cashFin?.pay_by?.name,
            },
            rec_by: {
              value: cashFin?.rec_by?.id,
              label: cashFin?.rec_by?.name,
            },
          };

          if (props.type === "purchase" || props.type === "purchase_rej") {
            form.setFieldsValue({
              ...formData,
              // supplierId: data?.customer?.content_object?.id,
              supplierName: {
                value: data?.customer?.content_object?.id,
                label: data?.customer?.content_object?.full_name,
              },
              discount: data?.payment_summery?.discount
                ? data?.payment_summery?.discount
                : 0,
              expense: data?.payment_summery?.expense
                ? data?.payment_summery?.expense
                : 0,
              total: data?.payment_summery?.net_amount
                ? data?.payment_summery?.net_amount
                : 0,
            });
          } else {
            if (props.type === "quotation") {
              form.setFieldsValue({
                ...formData,
                // customerId: data?.customer?.content_object?.id,
                customerName: {
                  value: data?.customer?.content_object?.id,
                  label: data?.customer?.content_object?.full_name,
                },
                discount: data?.discount ? parseFloat(data?.discount) : 0,
                expense: data?.expense ? parseFloat(data?.expense) : 0,
                total: data?.net_amount ? parseFloat(data?.net_amount) : 0,
              });
            } else {
              form.setFieldsValue({
                ...formData,
                // customerId: data?.customer?.content_object?.id,
                customerName: {
                  value: data?.customer?.content_object?.id,
                  label: data?.customer?.content_object?.full_name,
                },
                discount: data?.payment_summery?.discount ?? 0,
                expense: data?.payment_summery?.expense ?? 0,
                total: data?.payment_summery?.net_amount ?? 0,
              });
            }
          }

          setAccount(data?.customer?.content_object?.full_name);
          setDiscount(
            data?.payment_summery?.discount
              ? parseFloat(data?.payment_summery?.discount)
              : 0
          );
          setExpense(
            data?.payment_summery?.expense
              ? parseFloat(data?.payment_summery?.expense)
              : 0
          );
          setCurrencyName(data?.currency?.name);
          setWarehouseName({
            label: data?.warehouse?.name,
            value: data?.warehouse?.id,
          });
          setDescription(data?.description);
          setRemainAmount(
            data?.payment_summery?.remain
              ? parseFloat(data?.payment_summery?.remain)
              : 0
          );
          setData(newData);
          setCashReceive(cashFin ? cashReceive : {});
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
      props.baseUrl,
      props.type,
      recordId,
      calenderCode,
      dateTime,
    ]
  );

  const handleDeleteReceiveCash = () => {
    setCashReceive({});
    form.setFieldsValue({ receiveCash: undefined });
  };

  const onClickBody = () => {};

  const onChangeDebit = (e) => {
    setDebit(e.target.checked);
    if (e.target.checked === true) {
      setCashReceive({});
      form.setFieldsValue({ receiveCash: undefined });
    }
  };

  const onFocusNumberInput = (e) => {
    e.target.select();
  };

  const printFilters = (
    <Descriptions
      layout="horizontal"
      style={{ width: "100%", paddingTop: "40px" }}
      column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
      size="small"
    >
      <Descriptions.Item label={t("Sales.All_sales.Invoice.Invoice_number")}>
        {response?.id ?? 0}
      </Descriptions.Item>
      <Descriptions.Item
        label={
          props?.type === "sales" ||
          props?.type === "sales_rej" ||
          props?.type === "quotation"
            ? t("Sales.Customers.Customer")
            : t("Expenses.Suppliers.Supplier")
        }
      >
        {account}
      </Descriptions.Item>

      <Descriptions.Item label={t("Warehouse.1")}>
        {warehouseName?.label}
      </Descriptions.Item>

      <Descriptions.Item
        label={t("Sales.Product_and_services.Inventory.Currency")}
      >
        {currencyName}
      </Descriptions.Item>
      {/* <Descriptions.Item label={t("Form.Description")}>
        {description}
      </Descriptions.Item> */}
    </Descriptions>
  );

  const onChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const footer = (
    <Descriptions
      layout="horizontal"
      style={{ width: "100%", paddingTop: "40px" }}
      column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
      size="small"
      bordered
    >
      <Descriptions.Item label={t("Sales.Customers.Discount.1")}>
        {discount ?? 0}
      </Descriptions.Item>

      <Descriptions.Item label={t("Expenses.1")}>
        {expense ?? 0}
      </Descriptions.Item>

      <Descriptions.Item label={t("Sales.Customers.Form.Total")}>
        {totalPrice ?? 0}
      </Descriptions.Item>
      {props?.type !== "quotation" && (
        <Descriptions.Item label={t("Sales.All_sales.Invoice.Cash_amount")}>
          {cashReceive?.amount ?? 0} {currencySymbol}
        </Descriptions.Item>
      )}
      {props?.type !== "quotation" && (
        <Descriptions.Item label={t("Sales.All_sales.Invoice.Remain_amount")}>
          {remainAmount ?? 0}
        </Descriptions.Item>
      )}
    </Descriptions>
  );

  return (
    <div onClick={onClickBody}>
      <div type="primary" shape="round" onClick={showDrawer} className="num">
        {props.title}
      </div>
      <Drawer
        maskClosable={false}
        mask={true}
        title={startCase(props.title)}
        height="100%"
        onClose={handelCancel}
        open={visible}
        destroyOnClose
        afterVisibleChange={handleAfterVisibleChange}
        placement="top"
        bodyStyle={{ paddingBottom: 10 }}
        footer={
          <Row justify="end">
            <Col>
              <Space size={10}>
                <Button
                  type="primary"
                  ghost
                  onClick={handelCancel}
                  disabled={response?.id}
                >
                  {t("Form.Cancel")}
                </Button>
                {/* <Button shape="round" disabled={!response?.id}>
                  {t("Form.Print")}
                </Button> */}
                <PrintInvoiceButton
                  disabled={!response?.id}
                  // domColumns={columns("print")}
                  title={startCase(props.title)}
                  dataSource={data}
                  type={props.type}
                  filters={printFilters}
                  footer={footer}
                />
                <Button
                  // shape="round"

                  onClick={handleSendOrder}
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  disabled={
                    editSpin
                      ? true
                      : editingKey !== "" || response?.id
                      ? true
                      : false
                  }
                >
                  {t("Form.Save")}
                </Button>
              </Space>
            </Col>
          </Row>
        }
      >
        <Form layout="vertical" hideRequiredMark form={form}>
          <Spin spinning={editSpin} size="large">
            <Row>
              {showHeader ? (
                <Col span={24}>
                  <Row>
                    <Col span={11}>
                      <Row gutter={10}>
                        <Col span={12}>
                          {props.type === "sales" ||
                          props.type === "sales_rej" ||
                          props.type === "quotation" ? (
                            <InfiniteListNameAndIdFormItem
                              name="customerName"
                              placeholder={t(
                                "Sales.All_sales.Invoice.Customer_name"
                              )}
                              queryKey="/customer_account/customer/invoice/"
                              baseUrl="/customer_account/customer/"
                              fields="id,full_name,mobile_number,phone_number,fax_number,credit_limit,full_billing_address&status=active"
                              style={styles.margin}
                              rules={[
                                {
                                  required: true,
                                  message: t(
                                    "Sales.All_sales.Invoice.Customer_name_required"
                                  ),
                                },
                              ]}
                              disabled={Boolean(response?.id)}
                              onChangeName={onChangeCustomerName}
                            />
                          ) : (
                            <InfiniteListNameAndIdFormItem
                              name="supplierName"
                              placeholder={t(
                                "Expenses.Suppliers.Supplier_name"
                              )}
                              baseUrl="/supplier_account/supplier/"
                              queryKey="/supplier_account/supplier/invoice/"
                              fields="id,full_name,mobile_number,phone_number,fax_number,credit_limit,full_billing_address&status=active"
                              style={styles.margin}
                              rules={[
                                {
                                  required: true,
                                  message: t(
                                    "Expenses.Suppliers.Supplier_name_required"
                                  ),
                                },
                              ]}
                              onChangeName={onChangeSupplierName}
                              disabled={Boolean(response?.id)}
                            />
                          )}
                        </Col>

                        <Col md={12} sm={12} xs={24}>
                          {" "}
                          <Form.Item name="phone" style={styles.margin}>
                            <Input
                              readOnly
                              placeholder={t(
                                "Sales.All_sales.Invoice.Mobile_and_phone"
                              )}
                            />
                          </Form.Item>
                        </Col>

                        <Col md={12} sm={12} xs={24}>
                          <Form.Item name="fax" style={styles.margin}>
                            <Input readOnly placeholder={t("Form.Fax")} />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="creditLimit" style={styles.margin}>
                            <Input
                              readOnly
                              placeholder={t(
                                "Sales.Customers.Form.Credit_limit"
                              )}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={12}>
                          <Form.Item
                            name="address"
                            // label="Address"
                            style={styles.margin}
                          >
                            <Input.TextArea
                              autoSize={{ minRows: 2, maxRows: 3 }}
                              readOnly
                              placeholder={t("Form.Address")}
                              showCount
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col offset={2} span={11}>
                      <Row gutter={10}>
                        <Col span={24}>
                          <InfiniteListNameAndIdFormItem
                            name="warehouseName"
                            placeholder={t("Warehouse.Warehouse_name")}
                            baseUrl="/inventory/warehouse/"
                            queryKey="/supplier_account/supplier/infinite/"
                            fields="id,name"
                            style={styles.margin}
                            rules={[
                              {
                                required: true,
                                message: t("Warehouse.Warehouse_name_required"),
                              },
                            ]}
                            onChangeName={onChangeWarehouseName}
                            disabled={Boolean(response?.id)}
                          />
                        </Col>

                        <Col span={24} style={{ marginBottom: "10px" }}>
                          <CurrencyProperties
                            currencyValue={currencyValue}
                            setCurrencyValue={setCurrencyValue}
                            form={form}
                            type="openAccount"
                            onChangeCurrency={onChangeCurrency}
                            onChangeCurrencyRate={onChangeCurrencyRate}
                            responseId={response?.id}
                          />
                        </Col>
                        {props?.type === "sales" && (
                          <Col span={12}>
                            <InfiniteScrollSelectFormItem
                              name="employee"
                              placeholder={t("Employees.Employee")}
                              style={styles.margin}
                              fields="full_name,id"
                              baseUrl="/staff_account/staff/"
                              rules={[
                                {
                                  required: true,
                                  message: t("Employees.Employee_required"),
                                },
                              ]}
                            />
                          </Col>
                        )}
                        <Col span={12}>
                          <DatePickerFormItem
                            placeholder={t("Sales.Customers.Form.Date")}
                            name="date"
                            label=""
                            showTime={true}
                            format="YYYY-MM-DD hh:mm a"
                            rules={[{ type: "object" }]}
                            style={styles.margin}
                            disabled={true}
                          />
                        </Col>
                        <Col span={12}>
                          <Form.Item name="description" style={styles.margin}>
                            <Input.TextArea
                              autoSize={{ minRows: 2, maxRows: 3 }}
                              placeholder={t("Form.Description")}
                              showCount
                              allowClear
                              onChange={onChangeDescription}
                              readOnly={Boolean(response?.id)}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              ) : null}
              <Col span={24}>
                <InvoiceTable
                  data={data}
                  setData={setData}
                  onHeaderCollapsed={onHeaderCollapsed}
                  showHeader={showHeader}
                  // onFooterCollapsed={onFooterCollapsed}
                  // showFooter={showFooter}
                  setCount={setCount}
                  count={count}
                  warehouse={warehouseName?.value}
                  place="edit"
                  prevStatistic={prevStatistic}
                  setSelectedRowKeys={setSelectedRowKeys}
                  selectedRowKeys={selectedRowKeys}
                  currency={baseCurrency?.data}
                  handleAddProduct={handleAddProduct}
                  type={props.type}
                  setEditingKey={setEditingKey}
                  editingKey={editingKey}
                  responseId={response?.id}
                />
              </Col>
              {showFooter && (
                <Col span={24}>
                  <Row>
                    <Col xxl={14} xl={11} lg={9} md={4}>
                      {" "}
                      {/* <Button
                        onClick={handleAddProduct}
                        type="primary"
                        style={{
                          marginBottom: 16,
                        }}
                        disabled={Boolean(response?.id)}
                      >
                        {t("Sales.All_sales.Invoice.Add_a_row")}
                      </Button> */}
                    </Col>
                    <Col xxl={10} xl={13} lg={15} md={20}>
                      <Row gutter={15} justify="end">
                        {props.type !== "quotation" && (
                          <Col span={8}>
                            {/* <Form.Item
                              name="previousAccount"
                              label={
                                <Trans
                                  i18nKey={
                                    "Sales.All_sales.Invoice.Previous_account"
                                  }
                                  components={{
                                    italic: <i />,
                                    bold: (
                                      <Typography.Text
                                        strong={true}
                                        type="danger"
                                      />
                                    ),
                                  }}
                                />
                              }
                              style={styles.totalInput}
                            >
                              <InputNumber
                                min={0}
                                type="number"
                                className="num"
                                inputMode="numeric"
                                readOnly
                              />
                            </Form.Item>
                            <Form.Item
                              name="remainAccount"
                              label={
                                <Trans
                                  i18nKey={
                                    "Sales.All_sales.Invoice.Remain_account"
                                  }
                                  components={{
                                    italic: <i />,
                                    bold: (
                                      <Typography.Text
                                        strong={true}
                                        type="danger"
                                      />
                                    ),
                                  }}
                                />
                              }
                              style={styles.totalInput}
                            >
                              <InputNumber
                                min={0}
                                type="number"
                                className="num"
                                inputMode="numeric"
                                readOnly
                                style={{ color: "red" }}
                              />
                            </Form.Item> */}
                          </Col>
                        )}
                        {props.type !== "quotation" && (
                          <Col span={8}>
                            <Form.Item
                              name="receiveCash"
                              label={
                                props.type === "sales" ||
                                props.type === "purchase_rej"
                                  ? t("Employees.Receive_cash")
                                  : t("Employees.Pay_cash")
                              }
                              style={styles.totalInput}
                            >
                              <Input
                                // type="number"
                                className="num"
                                // inputMode="numeric"

                                readOnly
                                allowClear
                                suffix={
                                  <Space size={8}>
                                    <ReceiveCash
                                      calenderCode={calenderCode}
                                      place={
                                        props.type === "sales" ||
                                        props.type === "sales_rej"
                                          ? "customerPayAndRecCash"
                                          : "supplierPayAndRecCash"
                                      }
                                      type={
                                        props.type === "sales" ||
                                        props.type === "purchase_rej"
                                          ? "recCash"
                                          : "payCash"
                                      }
                                      form={form}
                                      setCashReceive={setCashReceive}
                                      cashReceive={cashReceive}
                                      totalPrice={totalOfItems}
                                      setCurrencySymbol={setCurrencySymbol}
                                      currencySymbol={currencySymbol}
                                      debit={debit}
                                      prevCashCurrency={prevCashCurrency}
                                      actionType="edit"
                                      responseId={response?.id}
                                    />
                                    <Button
                                      icon={<CloseOutlined />}
                                      type="text"
                                      onClick={handleDeleteReceiveCash}
                                      danger
                                      shape="circle"
                                      size="small"
                                      disabled={Boolean(response?.id)}
                                    />
                                  </Space>
                                }
                              />
                            </Form.Item>

                            <Form.Item
                              name="remainAmount"
                              label={t("Sales.All_sales.Invoice.Remain_amount")}
                              style={styles.totalInput}
                            >
                              <InputNumber
                                readOnly
                                type="number"
                                className="num"
                                inputMode="numeric"
                              />
                            </Form.Item>
                            <Form.Item
                              name="debit"
                              valuePropName="checked"
                              style={styles.totalInput}
                            >
                              <Checkbox onChange={onChangeDebit}>
                                {t("Opening_accounts.Debit")}
                              </Checkbox>
                            </Form.Item>
                            <Row>
                              <Col xxl={7} xl={9} lg={11}></Col>
                              <Col
                                xxl={{ span: 16, offset: 1 }}
                                xl={{ span: 14, offset: 1 }}
                                lg={{ span: 12, offset: 1 }}
                              >
                                {/* <ReceiveCash
                              name="receiveCash"
                              place="customerPayAndRecCash"
                              type="recCash"
                              baseUrl="/pay_receive_cash/customer/"
                              form={form}
                              setCashReceive={setCashReceive}
                              cashReceive={cashReceive}
                              totalPrice={totalOfItems}
                            /> */}
                              </Col>
                            </Row>
                          </Col>
                        )}
                        <Col span={8}>
                          <Form.Item
                            name="discount"
                            label={t("Sales.Customers.Discount.1")}
                            style={styles.totalInput}
                          >
                            <InputNumber
                              min={0}
                              formatter={discountFormat}
                              parser={discountFormat}
                              type="number"
                              onFocus={onFocusNumberInput}
                              className="num"
                              onChange={(value) =>
                                handleChangeExpense(value, "discount")
                              }
                              inputMode="numeric"
                              readOnly={Boolean(response?.id)}
                            />
                          </Form.Item>
                          <Form.Item
                            name="expense"
                            label={t("Expenses.1")}
                            style={styles.totalInput}
                          >
                            <InputNumber
                              min={0}
                              type="number"
                              className="num"
                              formatter={expenseFormat}
                              onFocus={onFocusNumberInput}
                              parser={expenseFormat}
                              onChange={(value) =>
                                handleChangeExpense(value, "expense")
                              }
                              inputMode="numeric"
                              readOnly={Boolean(response?.id)}
                            />
                          </Form.Item>
                          <Form.Item
                            name="total"
                            label={t("Sales.Customers.Form.Total")}
                            labelAlign="right"
                            style={styles.totalInput}
                          >
                            <InputNumber
                              type="number"
                              className="num"
                              inputMode="numeric"
                              readOnly
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
          </Spin>
        </Form>
        {/* )} */}
      </Drawer>
    </div>
  );
};
const styles = {
  margin: { marginBottom: "8px" },
  totalInput: { marginBottom: "4px" },
  save: { width: "142%" },
  drop: { height: "100%", width: "100%" },
};
const mapStateToProps = (state) => {
  return {
    rtl: state.direction.rtl,
    ltr: state.direction.ltr,
  };
};

export default connect(mapStateToProps)(EditInvoice);
