import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import startCase from "lodash/startCase";
import ReceiveCash from "./SalesInvoiceComponents/ReceiveCash";
import { math, print } from "../../../../Functions/math";
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
  Dropdown,
  Menu,
  Modal,
  Typography,
  Descriptions,
} from "antd";
import { debounce } from "throttle-debounce";
import dayjs from "dayjs";
import { connect } from "react-redux";
import axiosInstance from "../../../ApiBaseUrl";
import { useMutation, useQueryClient } from "react-query";
import InvoiceTable from "./InvoiceTable";
import { CaretDownOutlined, CloseOutlined } from "@ant-design/icons";
import { CurrencyProperties } from "../../../Transactions/Components/CurrencyProperties";
import { DatePickerFormItem } from "../../../SelfComponents/JalaliAntdComponents/DatePickerFormItem";
import { InfiniteListNameAndIdFormItem } from "./SalesInvoiceComponents/InfiniteListNameAndIdFormItem";
import Checkbox from "antd/lib/checkbox/Checkbox";
import { changeGToJ, changeJToG, utcDate } from "../../../../Functions/utcDate";
import { memoizeFun } from "../../../../Functions/memoizeFun";
import useGetCalender from "../../../../Hooks/useGetCalender";
import useGetBaseCurrency from "../../../../Hooks/useGetBaseCurrency";
import PrintInvoiceButton from "../MarketInvoiceComponents/PrintInvoiceButton";
import useGetDefaultWarehouse from "../../../../Hooks/useGetDefaultWarehouse";
import {
  useGetDefaultCustomer,
  useGetDefaultSupplier,
} from "../../../../Hooks";

const fixedNumber = (value) => {
  const newValue = parseFloat(parseFloat(value).toFixed(20));
  return newValue;
};

const getTotal = (data) => {
  const total = data?.reduce(
    (sum, item) => print(math.evaluate(`${sum}+${item?.total_price}`)),
    0
  );

  return total ? fixedNumber(total) : 0;
};
const dateFormat = "YYYY-MM-DD HH:mm:ss";
const dateFormat1 = "YYYY-MM-DD";
const AddInvoice = (props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);
  const [visibleDrop, setVisibleDrop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [cashReceive, setCashReceive] = useState({});
  const [form] = Form.useForm();
  const [count, setCount] = useState(2);
  const [totalPrice, setTotalPrice] = useState(0);
  const [remainAmount, setRemainAmount] = useState(0);
  const [response, setResponse] = useState({});
  const [totalOfItems, setTotalOfItems] = useState(0);
  const [currencyValue, setCurrencyValue] = useState(1);
  const [prevCurrency, setPrevCurrency] = useState(1);
  const [editingKey, setEditingKey] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [debit, setDebit] = useState(false);
  const [account, setAccount] = useState("");
  const [warehouseName, setWarehouseName] = useState("");
  const [currencyName, setCurrencyName] = useState("");
  const [discount, setDiscount] = useState(0);
  const [expense, setExpense] = useState(0);
  const [description, setDescription] = useState("");

  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyId = baseCurrency?.data?.id;
  const baseCurrencyName = baseCurrency?.data?.name;
  const baseCurrencySymbol = baseCurrency?.data?.symbol;

  const [data, setData] = useState([
    {
      key: 1,
      row: `${1}`,
      id: "",
      serial: 1,
      product: "",
      unit: "",
      qty: 1,
      each_price: 0,
      total_price: 0,
      description: "",
    },
  ]);

  //get default warehouse
  const defaultWarehouse = useGetDefaultWarehouse();

  //get default supplier
  const defaultSupplier = useGetDefaultSupplier();

  //get default customer
  const defaultCustomer = useGetDefaultCustomer();

  //get current calender
  const userCalender = useGetCalender();

  useEffect(() => {
    setCurrencySymbol(baseCurrencySymbol);
  }, [baseCurrencySymbol]);

  React.useEffect(() => {
    setCurrencyValue(baseCurrencyId);
  }, [baseCurrencyId]);

  const showDrawer = () => {
    setVisible(true);
  };

  const onHeaderCollapsed = () => {
    setShowHeader(!showHeader);
  };

  const onChangeCustomerName = (value) => {
    setAccount(value?.full_name);
    form.setFieldsValue({
      customerId: value?.id,
      phone: value?.phone_number + "," + value?.mobile_number,
      fax: value?.fax_number,
      creditLimit: value?.credit_limit,
      address: value?.full_billing_address,
    });
  };

  const onChangeCustomerId = (value) => {
    setAccount(value?.full_name);
    form.setFieldsValue({
      customerName: {
        value: value?.id,
        label: value?.full_name,
      },
      phone: value?.phone_number + "," + value?.mobile_number,
      fax: value?.fax_number,
      creditLimit: value?.credit_limit,
      address: value?.full_billing_address,
    });
  };

  const onChangeSupplierName = (value) => {
    setAccount(value?.full_name);
    form.setFieldsValue({
      supplierId: value?.id,
      phone: value?.phone_number + "," + value?.mobile_number,
      fax: value?.fax_number,
      creditLimit: value?.credit_limit,
      address: value?.full_billing_address,
    });
  };
  const onChangeSupplierId = (value) => {
    setAccount(value?.full_name);
    form.setFieldsValue({
      supplierName: {
        value: value?.id,
        label: value?.full_name,
      },
      phone: value?.phone_number + "," + value?.mobile_number,
      fax: value?.fax_number,
      creditLimit: value?.credit_limit,
      address: value?.full_billing_address,
    });
  };

  const onChangeWarehouseName = (value) => {
    setWarehouseName(value?.name);
    form.setFieldsValue({
      warehouseId: value?.id,
    });
  };

  const onChangeWarehouseId = (value) => {
    setWarehouseName(value?.name);
    form.setFieldsValue({
      warehouseName: { value: value?.id, label: value?.name },
    });
  };

  const handleAddProduct = async () => {
    const newData = {
      key: count,
      row: `${count}`,
      serial: count,
      id: "",
      product: "",
      unit: "",
      qty: 1,
      each_price: 0,
      total_price: 0,
      description: "",
    };
    // const element = document?.getElementsByClassName("ant-table-tbody");
    // // 
    // element[0] && element[0].lastChild.scrollIntoView({ behavior: "smooth" });
    // &&
    //   element[0].lastElementChild.lastElementChild.lastElementChild.scrollIntoView(
    //     { behavior: "smooth" }
    //   );
    // const rowKey = [newData.key];
    // props.setSelectedRowKeys(rowKey);
    // }, 200);
    setData([...data, newData]);
    const neCount = count + 1;
    setCount(neCount);
  };

  const handelChangeCurrencyChangeAllTotalPrice = (
    data,
    currencyRate,
    newCurrencyRate
  ) => {
    const newData = data?.map((item) => {
      const eachPrice = print(
        math.evaluate(
          `(${item?.each_price}*${currencyRate})/${newCurrencyRate}`
        )
      );

      return {
        ...item,
        each_price: eachPrice,
        total_price: fixedNumber(
          print(math.evaluate(`${item?.qty}*${eachPrice}`))
        ),
      };
    });
    setData(newData);
  };

  const onChangeCurrency = (value) => {
    setCurrencyName(value?.name);
    const currencyRate = form.getFieldValue("currencyRate");
    const newCurrencyRate = print(
      math.evaluate(`${value?.base_amount}/${value?.equal_amount}`)
    );

    setPrevCurrency(newCurrencyRate);
    if (cashReceive?.amount1) {
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

    handelChangeCurrencyChangeAllTotalPrice(
      data,
      currencyRate,
      newCurrencyRate
    );

    setCurrencySymbol(value?.symbol);
  };
  const onChangeCurrencyRate = (value) => {
    handelChangeCurrencyChangeAllTotalPrice(data, prevCurrency, value);
    setPrevCurrency(value);

    if (cashReceive?.amount1) {
      setCashReceive((prev) => {
        const newAmount = print(
          math.evaluate(`(${prev?.currency_rate}/${value})*${prev?.amount}`)
        );
        const newCashReceive = { ...prev, amount1: newAmount };
        return newCashReceive;
      });
    }
  };

  const handleChangeExpense = (value, type) => {
    debounceExpenseFun(value, type);
  };

  const debounceExpenseFun = debounce(800, (value, type) => {
    const row = form.getFieldsValue();
    const totalValue = getTotal(data);
    const discount = row?.discount !== "" ? row?.discount ?? 0 : 0;
    const expense = row?.expense !== "" ? row?.expense ?? 0 : 0;

    const totalDataValue = totalValue ?? 0;
    const newTotal = print(
      math.evaluate(`(${fixedNumber(totalDataValue)}+${expense})-${discount}`)
    );

    const remainAmount = cashReceive?.amount1
      ? print(
          math.evaluate(
            `(${fixedNumber(
              totalDataValue
            )}+${expense})-(${discount}+${fixedNumber(cashReceive?.amount1)})`
          )
        )
      : print(
          math.evaluate(
            `(${fixedNumber(totalDataValue)}+${expense})-${discount}`
          )
        );

    form.setFieldsValue({
      total: fixedNumber(newTotal),
      remainAmount: fixedNumber(remainAmount),
    });
    setRemainAmount(fixedNumber(remainAmount));
    setTotalPrice(fixedNumber(newTotal));
    setTotalOfItems(fixedNumber(totalDataValue));
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
  const totalAmount = memoizeFun(getTotal);

  React.useEffect(() => {
    const row = form.getFieldsValue();

    const totalDataValue = totalAmount(data);
    if (parseFloat(totalDataValue) <= parseFloat(row.discount)) {
      const remainAmount = cashReceive?.amount1
        ? print(
            math.evaluate(
              `${row?.expense}-${fixedNumber(cashReceive?.amount1)}`
            )
          )
        : row?.expense;

      const discount = parseFloat(parseFloat(totalDataValue).toFixed(5));

      form.setFieldsValue({
        discount: discount,
        total: row?.expense,
        remainAmount: remainAmount,
      });

      setDiscount(discount);
      setRemainAmount(remainAmount);
      setTotalPrice(0);
      setTotalOfItems(discount);
    } else {
      const discount = row?.discount !== "" ? row?.discount ?? 0 : 0;
      const expense = row?.expense !== 0 ? row?.expense ?? 0 : 0;
      const total = fixedNumber(totalDataValue)
        ? fixedNumber(
            print(
              math.evaluate(
                `(${fixedNumber(totalDataValue)}+${expense})-${discount}`
              )
            )
          )
        : 0;

      const remainAmount =
        cashReceive?.amount1 && fixedNumber(cashReceive?.amount1) > 0
          ? fixedNumber(
              print(
                math.evaluate(
                  `(${fixedNumber(
                    totalDataValue
                  )}+${expense})-(${discount}+${fixedNumber(
                    cashReceive?.amount1
                  )})`
                )
              )
            )
          : fixedNumber(total);

      form.setFieldsValue({
        total: fixedNumber(total),
        remainAmount: fixedNumber(remainAmount),
      });
      setRemainAmount(fixedNumber(remainAmount));
      setTotalPrice(fixedNumber(total));
      setTotalOfItems(fixedNumber(totalDataValue));
    }
    // const b = performance.now();
  }, [cashReceive?.amount1, totalAmount(data)]);

  const handleAfterVisibleChange = () => {
    form.resetFields();
    setPrevCurrency(1);
    setDebit(false);
    setEditingKey("");
    setCashReceive({});
    setLoading(false);
    setCount(2);

    setData([
      {
        key: 1,
        row: `${1}`,
        serial: 1,
        id: "",
        product: "",
        unit: "",
        qty: 1,
        each_price: 0,
        total_price: 0,
        description: "",
      },
    ]);
    setCurrencyValue(baseCurrencyId);
    setSelectedRowKeys([]);
    setTotalOfItems(0);
    setTotalPrice(0);
    setResponse({});
    setShowHeader(true);
    setShowFooter(true);
    setCurrencySymbol(baseCurrencySymbol);
    setRemainAmount(0);
    setDiscount(0);
    setExpense(0);
    setWarehouseName("");
    setCurrencyName("");
    setAccount("");
    setDescription("");
  };

  const messageKey = "addInvoice";
  const addSalesInvoice = async ({ value, type }) => {
    await axiosInstance
      .post(`${props.baseUrl}`, value, { timeout: 0 })
      .then((res) => {
        if (type === "0") {
          message.destroy(messageKey);
          message.success(`${t("Sales.All_sales.Invoice.Save_message")}`);
          handleAfterVisibleChange();
          setVisibleDrop(false);
        } else {
          setResponse(res.data);
          message.success(`${t("Sales.All_sales.Invoice.Save_message")}`);
        }

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response?.data?.customer?.[0]) {
          message.error(`${error?.response.data?.customer?.[0]}`);
        } else if (error?.response?.data?.warehouse?.[0]) {
          message.error(`${error?.response.data?.warehouse?.[0]}`);
        } else if (error?.response?.data?.currency?.[0]) {
          message.error(`${error?.response?.data?.currency?.[0]}`);
        } else if (error?.response?.data?.date_time?.[0]) {
          message.error(`${error?.response?.data?.date_time?.[0]}`);
        } else if (error?.response?.data?.currency_rate?.[0]) {
          message.error(`${error?.response.data?.currency_rate?.[0]}`);
        } else if (error?.response?.data?.description?.[0]) {
          message.error(`${error?.response.data?.description?.[0]}`);
        } else if (error?.response?.data?.payment_summery) {
          if (error?.response?.data?.payment_summery?.discount?.[0]) {
            message.error(
              `${error?.response.data?.payment_summery?.discount?.[0]}`
            );
          } else if (error?.response?.data?.payment_summery?.expense?.[0]) {
            message.error(
              `${error?.response.data?.payment_summery?.expense?.[0]}`
            );
          } else if (error?.response?.data?.payment_summery?.net_amount?.[0]) {
            message.error(
              `${error?.response.data?.payment_summery?.net_amount?.[0]}`
            );
          } else if (error?.response?.data?.payment_summery?.remain?.[0]) {
            message.error(
              `${error?.response.data?.payment_summery?.remain?.[0]}`
            );
          }
        } else if (error?.response?.data?.payment_cash) {
          if (error?.response?.data?.payment_cash?.pay_by?.[0]) {
            message.error(`${error?.response.data?.payment_cash?.pay_by?.[0]}`);
          } else if (error?.response?.data?.payment_cash?.rec_by?.[0]) {
            message.error(`${error?.response.data?.payment_cash?.rec_by?.[0]}`);
          } else if (error?.response?.data?.payment_cash?.date_time?.[0]) {
            message.error(
              `${error?.response.data?.payment_cash?.date_time?.[0]}`
            );
          } else if (error?.response?.data?.payment_cash?.amount?.[0]) {
            message.error(`${error?.response.data?.payment_cash?.amount?.[0]}`);
          } else if (error?.response?.data?.payment_cash?.amount_calc?.[0]) {
            message.error(
              `${error?.response.data?.payment_cash?.amount_calc?.[0]}`
            );
          } else if (error?.response?.data?.payment_cash?.currency?.[0]) {
            message.error(
              `${error?.response.data?.payment_cash?.currency?.[0]}`
            );
          } else if (error?.response?.data?.payment_cash?.currency_calc?.[0]) {
            message.error(
              `${error?.response.data?.payment_cash?.currency_calc?.[0]}`
            );
          } else if (error?.response?.data?.payment_cash?.currency_rate?.[0]) {
            message.error(
              `${error?.response.data?.payment_cash?.currency_rate?.[0]}`
            );
          } else if (
            error?.response?.data?.payment_cash?.currency_rate_calc?.[0]
          ) {
            message.error(
              `${error?.response.data?.payment_cash?.currency_rate_calc?.[0]}`
            );
          }
        } else if (error?.response?.data?.invoice_item) {
          if (error?.response?.data?.invoice_item?.[0]?.product?.[0]) {
            message.error(
              `${error?.response.data?.invoice_item?.[0]?.product?.[0]}`
            );
          } else if (error?.response?.data?.invoice_item?.[0]?.qty?.[0]) {
            message.error(
              `${error?.response.data?.invoice_item?.[0]?.qty?.[0]}`
            );
          } else if (error?.response?.data?.invoice_item?.unit?.[0]) {
            message.error(
              `${error?.response?.data?.invoice_item?.[0]?.unit?.[0]}`
            );
          } else if (
            error?.response?.data?.invoice_item?.[0]?.unit_conversion_rate?.[0]
          ) {
            message.error(
              `${error?.response?.data?.invoice_item?.[0]?.unit_conversion_rate?.[0]}`
            );
          } else if (
            error?.response?.data?.invoice_item?.[0]?.each_price?.[0]
          ) {
            message.error(
              `${error?.response.data?.invoice_item?.[0]?.each_price?.[0]}`
            );
          } else if (
            error?.response?.data?.invoice_item?.[0]?.total_price?.[0]
          ) {
            message.error(
              `${error?.response.data?.invoice_item?.[0]?.total_price?.[0]}`
            );
          } else if (error?.response?.data?.invoice_item?.[0]?.warehouse?.[0]) {
            message.error(
              `${error?.response.data?.invoice_item?.[0]?.warehouse?.[0]}`
            );
          } else if (
            error?.response?.data?.invoice_item?.[0]?.expire_date?.[0]
          ) {
            message.error(
              `${error?.response.data?.invoice_item?.[0]?.expire_date?.[0]}`
            );
          } else if (
            error?.response?.data?.invoice_item?.[0]?.description?.[0]
          ) {
            message.error(
              `${error?.response.data?.invoice_item?.[0]?.description?.[0]}`
            );
          }
        } else if (props?.type === "quotation") {
          if (error?.response?.data?.discount?.[0]) {
            message.error(`${error?.response.data?.discount?.[0]}`);
          } else if (error?.response?.data?.expense?.[0]) {
            message.error(`${error?.response.data?.expense?.[0]}`);
          } else if (error?.response?.data?.net_amount?.[0]) {
            message.error(`${error?.response.data?.net_amount?.[0]}`);
          } else if (error?.response?.data?.remain?.[0]) {
            message.error(`${error?.response.data?.remain?.[0]}`);
          }
        }
      });
  };
  const { mutate: mutateAddSalesInvoice, isLoading } = useMutation(
    addSalesInvoice,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`${props.baseUrl}`);
        queryClient.invalidateQueries(`/pay_receive_cash/report/journal/`);
        queryClient.invalidateQueries(
          `/pay_receive_cash/report/journal/journal_result/`
        );
      },
    }
  );

  const findUnitConversion = (conversions, unit) => {
    if (conversions?.[0]) {
      const conversionRatio = conversions?.find(
        (item) => item?.from_unit?.id === unit
      )?.ratio;
      return conversionRatio;
    } else {
      return 1;
    }
  };
  let isSendOrder = false;
  const handleSendOrder = (e) => {
    const submitType = e?.key;
    form
      .validateFields()
      .then(async (values) => {
        const items = data?.reduce((items, item) => {
          // const expireDate = item?.expirationDate
          //   ? userCalender?.data?.user_calender?.code === "gregory"
          //     ? item?.expirationDate?.format(dateFormat1)
          //     : changeJToG(
          //         item?.expirationDate?.locale("fa")?.format(dateFormat1),
          //         dateFormat1
          //       )
          //   : item?.expirationDate;

          const expireDate =
            item?.expirationDate && props?.type !== "sales"
              ? userCalender?.data?.user_calender?.code === "gregory"
                ? item?.expirationDate?.format(dateFormat1)
                : changeJToG(
                    item?.expirationDate?.locale("fa")?.format(dateFormat1),
                    dateFormat1
                  )
              : item?.expirationDate;
          setLoading(true);
          if (item?.product) {
            const newItem = {
              currency: values?.currency?.value,
              currency_rate: values?.currencyRate,
              unit: item?.unit?.value,
              unit_conversion_rate:
                item?.product_units?.find((item) => item?.base_unit === true)
                  ?.unit?.id === item?.unit?.value
                  ? 1
                  : findUnitConversion(
                      item?.unit_conversion,
                      item?.unit?.value
                    ),
              product: item?.id,
              qty: parseFloat(parseFloat(item?.qty).toFixed(4)),
              each_price: fixedNumber(item?.each_price),
              total_price: fixedNumber(item?.total_price),
              description: item.description,
              warehouse: values?.warehouseId,
              // warehouse: item?.warehouse?.value
              //   ? item?.warehouse?.value
              //   : values?.warehouseId,
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
            };
            return [...items, newItem];
          } else {
            return items;
          }
        }, []);

        if (items?.length === 0) {
          Modal.warning({
            title: t("Sales.All_sales.Invoice.Invoice_no_data_message"),
          });
          setLoading(false);
        } else {
          setLoading(true);
          const payment = {
            discount: fixedNumber(values?.discount),
            expense: fixedNumber(values?.expense),
            net_amount: fixedNumber(values?.total),
            remain: fixedNumber(values?.remainAmount),
            invoice_type: props?.type,
          };
          const cashDateTime =
            userCalender?.data?.user_calender?.code === "gregory"
              ? cashReceive?.date_time?.format(dateFormat)
              : changeJToG(
                  cashReceive?.date_time?.locale("fa")?.format(dateFormat),
                  dateFormat
                );
          const payCash = {
            pay_by: cashReceive?.pay_by?.value,
            rec_by: cashReceive?.rec_by?.value,
            date_time: cashDateTime,
            description: cashReceive?.description,
            amount: cashReceive?.amount && fixedNumber(cashReceive?.amount),
            currency: cashReceive?.currency?.value,
            currency_rate: cashReceive?.currency_rate,
            amount_calc:
              cashReceive?.amount_calc && fixedNumber(cashReceive?.amount_calc),
            currency_calc: cashReceive?.currency_calc?.value,
            currency_rate_calc: cashReceive?.currency_rate_calc,
            transaction_type: "invoice",
            related_to:
              props.type === "purchase" || props.type === "purchase_rej"
                ? "supplier"
                : "customer",
          };
          if (submitType === "0") {
            message.loading({
              content: t("Message.Loading"),
              key: messageKey,
            });
          } else {
            setLoading(true);
          }
          if (props?.type === "quotation") {
            const allData = {
              ...payment,
              currency: values?.currency?.value,
              currency_rate: values?.currencyRate,
              date_time: utcDate()?.format(dateFormat),
              description: values?.description,
              warehouse: values?.warehouseId,
              customer: `CUS-${values?.customerId}`,
              invoice_item: items,
            };
            mutateAddSalesInvoice({ value: allData, type: submitType });
          } else {
            const allData = {
              sales_source: "normal",
              currency: values?.currency?.value,
              currency_rate: values.currencyRate,
              date_time: utcDate()?.format(dateFormat),
              description: values.description,
              warehouse: values?.warehouseId,
              customer:
                props.type === "purchase" || props.type === "purchase_rej"
                  ? `SUP-${values?.supplierId}`
                  : `CUS-${values?.customerId}`,
              payment_summery: payment,
              invoice_item: items,
              payment_cash: payCash?.currency ? payCash : undefined,
            };
            if (props.type !== "sales") {
              delete allData["sales_source"];
            }
            if (isSendOrder) {
              return;
            }
            isSendOrder = true;

            try {
              mutateAddSalesInvoice({ value: allData, type: submitType });
              isSendOrder = false;
            } catch (info) {
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

  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={handleSendOrder}>
        {t("Form.Save_and_new")}
      </Menu.Item>
    </Menu>
  );

  const handleVisibleChange = (flag) => {
    setVisibleDrop(flag);
  };

  const handleDeleteReceiveCash = () => {
    setCashReceive({});
    form.setFieldsValue({ receiveCash: undefined });
  };

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
        {account
          ? props?.type === "sales" ||
            props?.type === "sales_rej" ||
            props?.type === "quotation"
            ? defaultCustomer?.full_name
            : defaultSupplier?.full_name
          : account}
      </Descriptions.Item>

      <Descriptions.Item label={t("Warehouse.1")}>
        {warehouseName ? warehouseName : defaultWarehouse?.name}
      </Descriptions.Item>

      <Descriptions.Item
        label={t("Sales.Product_and_services.Inventory.Currency")}
      >
        {currencyName ? currencyName : baseCurrencyName}
      </Descriptions.Item>
      <Descriptions.Item label={t("Form.Description")}>
        {description}
      </Descriptions.Item>
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
    <div>
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
                <Button shape="round" onClick={handleAfterVisibleChange}>
                  {t("Form.Reset")}
                </Button>
                <Button
                  shape="round"
                  onClick={handelCancel}
                  disabled={response?.id}
                >
                  {t("Form.Cancel")}
                </Button>
                <PrintInvoiceButton
                  disabled={!response?.id}
                  // domColumns={columns("print")}
                  title={startCase(props.title)}
                  dataSource={data}
                  type={props.type}
                  filters={printFilters}
                  footer={footer}
                />
                {/* <Button shape="round" disabled={!response?.id}>
                  {t("Form.Print")}
                </Button> */}
                <div style={{ width: "130px" }}>
                  <Row>
                    <Col span={17}>
                      <Button
                        shape="round"
                        onClick={handleSendOrder}
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        style={styles.save}
                        disabled={editingKey !== "" || response?.id}
                      >
                        {t("Form.Save")}
                      </Button>
                    </Col>

                    <Col span={7}>
                      {" "}
                      <Dropdown
                        overlay={menu}
                        trigger={["click"]}
                        open={visibleDrop}
                        onOpenChange={handleVisibleChange}
                        disabled={editingKey !== "" || response?.id}
                      >
                        <Button
                          type="primary"
                          shape="round"
                          icon={<CaretDownOutlined />}
                          size="small"
                          style={styles.drop}
                        />
                      </Dropdown>
                    </Col>
                  </Row>
                </div>
              </Space>
            </Col>
          </Row>
        }
      >
        <Form
          layout="vertical"
          hideRequiredMark
          // labelAlign="right"
          form={form}
          // size="small"
          initialValues={{
            date:
              userCalender?.data?.user_calender?.code === "gregory"
                ? utcDate()
                : dayjs(changeGToJ(utcDate().format(dateFormat), dateFormat), {
                    //@ts-ignore
                    jalali: true,
                  }),
            currency: baseCurrency?.data && {
              value: baseCurrencyId,
              label: baseCurrencyName,
            },
            currencyRate: 1,
            discount: 0,
            expense: 0,
            total: 0,
            remainAmount: 0,
            previousAccount: 0,
            remainAccount: 0,
            customerId: 103001,
            customerName: { label: defaultCustomer?.full_name, value: 103001 },
            supplierId: 201001,
            supplierName: { label: defaultSupplier?.full_name, value: 201001 },
            warehouseId: 106001,
            warehouseName: {
              value: 106001,
              label: defaultWarehouse?.name,
            },
            debit: false,
          }}
        >
          <Row>
            {showHeader ? (
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Row gutter={10}>
                      <Col span={24}>
                        {props.type === "sales" ||
                        props.type === "sales_rej" ||
                        props.type === "quotation" ? (
                          <InfiniteListNameAndIdFormItem
                            nameField="customerName"
                            idField="customerId"
                            namePlaceholder={t(
                              "Sales.All_sales.Invoice.Customer_name"
                            )}
                            idPlaceholder={t("Sales.Customers.Customer_id")}
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
                            onChangeId={onChangeCustomerId}
                          />
                        ) : (
                          <InfiniteListNameAndIdFormItem
                            nameField="supplierName"
                            idField="supplierId"
                            namePlaceholder={t(
                              "Expenses.Suppliers.Supplier_name"
                            )}
                            idPlaceholder={t("Expenses.Suppliers.Supplier_id")}
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
                            onChangeId={onChangeSupplierId}
                            disabled={Boolean(response?.id)}
                          />
                        )}
                      </Col>

                      <Col md={12} sm={12} xs={24}>
                        {" "}
                        <Form.Item name="phone" style={styles.margin}>
                          <Input
                            disabled
                            placeholder={t(
                              "Sales.All_sales.Invoice.Mobile_and_phone"
                            )}
                          />
                        </Form.Item>
                      </Col>

                      <Col md={12} sm={12} xs={24}>
                        <Form.Item name="fax" style={styles.margin}>
                          <Input disabled placeholder={t("Form.Fax")} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="creditLimit" style={styles.margin}>
                          <Input
                            disabled
                            placeholder={t("Sales.Customers.Form.Credit_limit")}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item name="address" style={styles.margin}>
                          <Input.TextArea
                            autoSize={{ minRows: 2, maxRows: 3 }}
                            disabled
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
                          nameField="warehouseName"
                          idField="warehouseId"
                          namePlaceholder={t("Warehouse.Warehouse_name")}
                          idPlaceholder={t("Warehouse.Warehouse_id")}
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
                          onChangeId={onChangeWarehouseId}
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
                    <Button
                      onClick={handleAddProduct}
                      type="primary"
                      style={{
                        marginBottom: 16,
                      }}
                      disabled={Boolean(response?.id)}
                    >
                      {t("Sales.All_sales.Invoice.Add_a_row")}
                    </Button>
                  </Col>
                  <Col xxl={10} xl={13} lg={15} md={20}>
                    <Row gutter={15} justify="end">
                      {props.type !== "quotation" && (
                        <Col span={8}>
                          <Form.Item
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
                          </Form.Item>
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
                            //
                          >
                            <Input
                              className="num"
                              readOnly
                              allowClear
                              suffix={
                                <Space size={8}>
                                  <ReceiveCash
                                    userCalender={userCalender}
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
                                    baseUrl="/pay_receive_cash/customer/"
                                    form={form}
                                    setCashReceive={setCashReceive}
                                    cashReceive={cashReceive}
                                    totalPrice={totalOfItems}
                                    setCurrencySymbol={setCurrencySymbol}
                                    currencySymbol={currencySymbol}
                                    debit={debit}
                                    actionType="add"
                                    responseId={response?.id}
                                  />
                                  <Button
                                    icon={<CloseOutlined />}
                                    type="link"
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

export default connect(mapStateToProps)(AddInvoice);
