import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import startCase from "lodash/startCase";
import { fixedNumber, math, print } from "../../../../Functions/math";
import { Drawer, Form, Col, Row, message, Space, Modal } from "antd";
import { debounce } from "throttle-debounce";
import dayjs from "dayjs";
import axiosInstance from "../../../ApiBaseUrl";
import { useMutation, useQueryClient } from "react-query";
import InvoiceTable from "./InvoiceTable";
import {
  changeGToJ,
  handlePrepareDateForServer,
  utcDate,
} from "../../../../Functions/utcDate";
import useGetCalender from "../../../../Hooks/useGetCalender";
import useGetBaseCurrency from "../../../../Hooks/useGetBaseCurrency";
import PrintInvoiceButton from "../MarketInvoiceComponents/PrintInvoiceButton";
import SaveDropdownButton from "../../../../components/buttons/SaveDropdownButton";
import { ActionMessage } from "../../../SelfComponents/TranslateComponents/ActionMessage";
import {
  expireProductsBaseUrl,
  productStatisticsBaseUrl,
} from "../../../Reports/AllReports/AllReports";
import useGetDefaultWarehouse from "../../../../Hooks/useGetDefaultWarehouse";
import {
  useGetDefaultCustomer,
  useGetDefaultEmployee,
  useGetDefaultSupplier,
} from "../../../../Hooks";
import InvoicesFooter from "./SalesInvoiceComponents/Footer";
import InvoiceHeader from "./SalesInvoiceComponents/Header";
import MultipleCashPayment from "./SalesInvoiceComponents/MultipleCashPayment";
import { handleFindUnitConversionRate } from "../../../../Functions";
import { CancelButton, ResetButton } from "../../../../components";

const invoiceFixedNumber = (value) => {
  const newValue = fixedNumber(value, 20);
  return newValue;
};

const dateFormat = "YYYY-MM-DD HH:mm:ss";
const dateFormat1 = "YYYY-MM-DD";
const AddInvoice = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [visibleDrop, setVisibleDrop] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [cashAmount, setCashAmount] = useState(0);
  const [form] = Form.useForm();
  const [count, setCount] = useState(2);
  const [response, setResponse] = useState({});
  const [totalOfItems, setTotalOfItems] = useState(0);
  const [currencyValue, setCurrencyValue] = useState(1);
  const [prevCurrency, setPrevCurrency] = useState(1);
  const [editingKey, setEditingKey] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [discount, setDiscount] = useState(0);
  const [expense, setExpense] = useState(0);
  const [warehouseId, setWarehouseId] = useState(0);
  const [data, setData] = useState([
    {
      key: 1,
      row: `${1}`,
      id: { value: "", label: "" },
      serial: 1,
      // product: { value: "", label: "" },
      // unit: { value: "", label: "" },
      qty: 10,
      // each_price: 0,
      // total_price: 0,
      description: "",
    },
  ]);
  const [{ globalDiscount, productDiscount }, setIsDiscount] = useState({
    globalDiscount: false,
    productDiscount: false,
  });

  const factorType =
    props.type === "purchase" || props.type === "purchase_rej"
      ? "purchase"
      : "sales";

  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyId = baseCurrency?.data?.id;
  const baseCurrencyName = baseCurrency?.data?.name;
  const baseCurrencySymbol = baseCurrency?.data?.symbol;

  //get default warehouse
  const defaultWarehouse = useGetDefaultWarehouse();
  const defaultWarehouseName = defaultWarehouse?.name;

  //get default supplier
  const defaultSupplier = useGetDefaultSupplier();
  const supplierName = defaultSupplier?.full_name;

  //get default employee
  const defaultEmployee = useGetDefaultEmployee();
  const employeeName = defaultEmployee?.full_name;

  //get default customer
  const defaultCustomer = useGetDefaultCustomer();
  const customerName = defaultCustomer?.full_name;

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  useEffect(() => {
    setCurrencySymbol(baseCurrencySymbol);
    setCurrencyValue(baseCurrencyId);

    form.setFieldsValue({
      currency: { label: baseCurrencyName, value: baseCurrencyId },
    });
  }, [baseCurrencyId, baseCurrencyName, baseCurrencySymbol, form]);

  useEffect(() => {
    form.setFieldsValue({
      warehouseName: { label: defaultWarehouseName, value: 106001 },
    });
  }, [defaultWarehouseName, form]);

  useEffect(() => {
    form.setFieldsValue({
      employee: { label: employeeName, value: 203001 },
    });
  }, [employeeName, form]);

  useEffect(() => {
    form.setFieldsValue({
      account:
        factorType === "sales"
          ? { label: customerName, value: 103001 }
          : { label: supplierName, value: 201001 },
    });
  }, [customerName, factorType, form, supplierName]);

  const showDrawer = () => {
    setVisible(true);
  };

  const onHeaderCollapsed = () => {
    setShowHeader(!showHeader);
  };

  const handleAddProduct = useCallback(async () => {
    const newData = {
      key: count,
      row: `${count}`,
      serial: count,
      id: { value: "", label: "" },
      // product: { value: "", label: "" },
      // unit: { value: "", label: "" },
      qty: 1,
      // each_price: 0,
      // total_price: 0,
      description: "",
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
            }`
          )
        );
        const discount = print(
          math.evaluate(
            `(${item?.discount ?? 0}*${currencyRate ?? 1})/${
              newCurrencyRate ?? 1
            }`
          )
        );

        return {
          ...item,
          each_price: eachPrice,
          total_price: invoiceFixedNumber(
            print(math.evaluate(`${item?.qty ?? 0}*${eachPrice ?? 0}`))
          ),
          discount,
        };
      });
      setData(newData);

      const cashList = form?.getFieldValue("cashList");
      if (cashList?.length) {
        const newData = cashList?.reduce(
          ({ newItems, cashAmount }, item) => {
            const newCashAmount = print(
              math.evaluate(
                `(${item?.cashAmount ?? 0}*${currencyRate ?? 1})/${
                  newCurrencyRate ?? 1
                }`
              )
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
          { newItems: [], cashAmount: 0 }
        );
        setCashAmount(newData?.cashAmount);
        form.setFieldsValue({ cashList: newData?.newItems });
      }

      const discountData = form.getFieldValue("discount");

      setExpense((prev) => {
        const newExpense = print(
          math.evaluate(
            `(${prev ?? 0}*${currencyRate ?? 1})/${newCurrencyRate ?? 1}`
          )
        );
        form.setFieldsValue({ expense: newExpense });
        return newExpense;
      });

      if (discountData && discountData > 0) {
        const newDiscount = print(
          math.evaluate(
            `(${discountData ?? 0}*${currencyRate ?? 1})/${
              newCurrencyRate ?? 1
            }`
          )
        );

        setDiscount(newDiscount);
        form.setFieldsValue({ discount: newDiscount });
      }
    },
    [form]
  );

  const onChangeCurrency = useCallback(
    (value) => {
      const currencyRate = form.getFieldValue("currencyRate");

      const newCurrencyRate = print(
        math.evaluate(`${value?.base_amount ?? 0}/${value?.equal_amount ?? 1}`)
      );

      setPrevCurrency(newCurrencyRate);

      handelChangeCurrencyChangeAllTotalPrice(
        data,
        currencyRate ?? 1,
        newCurrencyRate
      );

      setCurrencySymbol(value?.symbol);
    },
    [data, form, handelChangeCurrencyChangeAllTotalPrice]
  );

  const onChangeCurrencyRate = useCallback(
    (value) => {
      if (value !== "") {
        handelChangeCurrencyChangeAllTotalPrice(data, prevCurrency, value ?? 1);
        setPrevCurrency(value ?? 1);
      }
    },
    [data, handelChangeCurrencyChangeAllTotalPrice, prevCurrency]
  );

  const handleChangeExpense = (value, type) => {
    debounceExpenseFun(value, type);
  };

  const debounceExpenseFun = debounce(400, (value, type) => {
    const total = data?.reduce(
      (sum, item) => print(math.evaluate(`${sum}+${item?.total_price ?? 0}`)),
      0
    );

    setTotalOfItems(invoiceFixedNumber(total) ?? 0);
    const newValue = parseFloat(value ?? 0);
    if (type === "discount") {
      setDiscount(newValue ?? 0);
      setIsDiscount((prev) => ({
        ...prev,
        productDiscount: newValue > 0 ? true : false,
      }));
    } else {
      setExpense(newValue ?? 0);
    }
  });

  React.useEffect(() => {
    const row = form.getFieldsValue();
    const { total, discount } = (data || []).reduce(
      ({ total, discount }, item) => ({
        total: print(math.evaluate(`${total}+${item?.total_price ?? 0}`)),
        discount: print(math.evaluate(`${discount}+${item?.discount ?? 0}`)),
      }),
      { total: 0, discount: 0 }
    );
    const totalDataValue = invoiceFixedNumber(total) ?? 0;
    const newDiscount = fixedNumber(discount) ?? 0;
    if (parseFloat(totalDataValue) <= parseFloat(row.discount)) {
      const discount = fixedNumber(totalDataValue, 5);
      form.setFieldsValue({
        discount: discount,
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
    // const b = performance.now();
  }, [form, data]);
  const handleAfterVisibleChange = useCallback(
    (value) => {
      if (value === false) {
        form.resetFields();
        setPrevCurrency(1);
        setEditingKey("");
        setCashAmount(0);
        setCount(2);
        setData([
          {
            key: 1,
            row: `${1}`,
            serial: 1,
            id: { value: "", label: "" },
            // product: { value: "", label: "" },
            // unit: { value: "", label: "" },
            qty: 1,
            // each_price: 0,
            // total_price: 0,
            description: "",
          },
        ]);
        setCurrencyValue(baseCurrencyId);
        setSelectedRowKeys([]);
        setTotalOfItems(0);
        setResponse({});
        setShowHeader(true);
        setShowFooter(true);
        setCurrencySymbol(baseCurrencySymbol);
        setDiscount(0);
        setExpense(0);
        setIsDiscount({
          productDiscount: false,
          globalDiscount: false,
        });
        setWarehouseId(0);
        setVisibleDrop(false);
      }
    },
    [baseCurrencyId, baseCurrencySymbol, form]
  );

  const handleReset = useCallback(() => {
    form.resetFields();
    setPrevCurrency(1);
    setEditingKey("");
    setCashAmount(0);
    setCount(2);
    setData([
      {
        key: 1,
        row: `${1}`,
        serial: 1,
        id: { value: "", label: "" },
        // product: { value: "", label: "" },
        // unit: { value: "", label: "" },
        qty: 1,
        // each_price: 0,
        // total_price: 0,
        description: "",
      },
    ]);
    setCurrencyValue(baseCurrencyId);
    setSelectedRowKeys([]);
    setTotalOfItems(0);
    setResponse({});
    setShowHeader(true);
    setShowFooter(true);
    setCurrencySymbol(baseCurrencySymbol);
    setDiscount(0);
    setExpense(0);
    setIsDiscount({
      productDiscount: false,
      globalDiscount: false,
    });
    setWarehouseId(0);
    setVisibleDrop(false);
  }, [baseCurrencyId, baseCurrencySymbol, form]);

  const messageKey = "addInvoice";
  const addSalesInvoice = useCallback(
    async ({ value, type }) => {
      return await axiosInstance
        .post(props.baseUrl, value, { timeout: 0 })
        .then((res) => {
          if (type === "0") {
            message.destroy(messageKey);
            message.success(
              <ActionMessage
                name={`${t("Sales.All_sales.Invoice.Invoice")} ${
                  res?.data?.id
                }`}
                message="Message.Add"
              />
            );
            handleReset();
            setVisibleDrop(false);
          } else {
            setResponse(res.data);
            message.success(
              <ActionMessage
                name={`${t("Sales.All_sales.Invoice.Invoice")} ${
                  res?.data?.id
                }`}
                message="Message.Add"
              />
            );
          }
          queryClient.invalidateQueries(props.baseUrl);
          if (props?.type !== "quotation") {
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
          return error;
        });
    },
    [handleReset, props.baseUrl, props.type, queryClient, t]
  );

  const { mutate: mutateAddSalesInvoice, isLoading } =
    useMutation(addSalesInvoice);

  const finalAmount = useMemo(
    () =>
      fixedNumber(
        print(
          math.evaluate(
            `${totalOfItems ?? 0} + ${expense ?? 0} - ${discount ?? 0}`
          )
        )
      ),
    [discount, expense, totalOfItems]
  );

  const remainAmount = useMemo(
    () =>
      fixedNumber(
        print(math.evaluate(`${finalAmount ?? 0} - ${cashAmount ?? 0}`))
      ),
    [cashAmount, finalAmount]
  );

  const summary = useMemo(() => {
    const data = [
      [
        {
          label: t("Sales.Customers.Form.Total"),
          value: totalOfItems,
        },
        {
          label: t("Sales.Customers.Discount.1"),
          value: discount,
        },
        {
          label: t("Expenses.1"),
          value: expense,
        },
        { label: t("Final_amount"), value: finalAmount },
      ],

      [
        {
          label:
            props?.type === "sales" || props?.type === "purchase_rej"
              ? t("Employees.Receive_cash")
              : t("Employees.Pay_cash"),
          value: cashAmount,
        },
        {
          label: t("Sales.All_sales.Invoice.Remain_amount"),
          value: remainAmount,
        },
      ],
    ];
    return props?.type === "quotation" ? [data?.[0]] : data;
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

  const handleSendOrder = (e) => {
    const submitType = e?.key;
    form.validateFields().then(async (values) => {
      const items = data?.reduce((items, item) => {
        const expireDate =
          item?.expirationDate && props.type !== "sales"
            ? handlePrepareDateForServer({
                date: item?.expirationDate,
                calendarCode,
                dateFormat: dateFormat1,
              })
            : item?.expirationDate;

        const warehouse = item?.warehouse?.value
          ? item?.warehouse?.value
          : values?.warehouseName?.value;
        if (item?.product?.value) {
          const newItem = {
            unit: item?.unit?.value,
            unit_conversion_rate: handleFindUnitConversionRate(
              item?.unit_conversion,
              item?.unit?.value,
              item?.product_units
            ),
            product: item?.id?.value,
            qty: parseFloat(parseFloat(item?.qty).toFixed(4)),
            each_price: invoiceFixedNumber(item?.each_price),
            description: item.description,
            warehouse_out: warehouse,
            warehouse_in: warehouse,
            expire_date: expireDate,
          };
          if (
            props.type === "sales" ||
            props?.type === "purchase_rej" ||
            props?.type === "quotation"
          ) {
            delete newItem["warehouse_in"];
          } else {
            delete newItem["warehouse_out"];
          }

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
      } else {
        const cashList = form.getFieldValue("cashList");

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
          };
        });

        const invoiceData = {
          invoice_state: values?.status,
          representative: `STF-${values?.employee?.value}`,
          discount: invoiceFixedNumber(values?.discount),
          expense: invoiceFixedNumber(values?.expense),
          currency: values?.currency?.value,
          currency_rate: values.currencyRate,
          date_time: handlePrepareDateForServer({
            date: values?.date,
            calendarCode,
          }),
          description: values.description,
          customer: `${factorType === "purchase" ? "SUP" : "CUS"}-${
            values?.account?.value
          }`,
          invoice_items: items,
        };
        if (props.type !== "sales") {
          delete invoiceData["representative"];
        }
        if (props?.type === "quotation") {
          mutateAddSalesInvoice({ value: invoiceData, type: submitType });
        } else {
          const allData = {
            ...invoiceData,
            cash_payment: cashPayment ?? undefined,
          };

          if (cashAmount > finalAmount) {
            Modal.confirm({
              bodyStyle: { direction: t("Dir") },
              title: t("Invoice_final_amount_less_than_pay_cash_message"),
              onOk: () => {
                if (submitType === "0") {
                  message.loading({
                    content: t("Message.Loading"),
                    key: messageKey,
                  });
                }
                mutateAddSalesInvoice({ value: allData, type: submitType });
              },
            });
          } else {
            if (submitType === "0") {
              message.loading({
                content: t("Message.Loading"),
                key: messageKey,
              });
            }
            mutateAddSalesInvoice({ value: allData, type: submitType });
          }
        }
      }
    });
  };

  const handelCancel = () => {
    setVisible(false);
  };

  const handleVisibleChange = (flag) => {
    setVisibleDrop(flag);
  };

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
        // maskClosable={false}
        destroyOnClose
        afterVisibleChange={handleAfterVisibleChange}
        placement="top"
        bodyStyle={{ paddingBottom: 10 }}
        footer={
          <Row justify="end">
            <Col>
              <Space size={10}>
                <PrintInvoiceButton
                  // disabled={false}
                  disabled={!response?.id}
                  title={startCase(props.title)}
                  dataSource={data}
                  type={props.type}
                  summary={summary}
                  form={form}
                  id={response?.id}
                />
                {props?.type === "sales" && (
                  <PrintInvoiceButton
                    // disabled={false}
                    disabled={!response?.id}
                    title={startCase(t("Warehouse_remittance"))}
                    dataSource={data}
                    type="warehouseRemittance"
                    summary={[]}
                    form={form}
                    id={response?.id}
                    printText={t("Warehouse_remittance")}
                  />
                )}
                <CancelButton onClick={handelCancel} disabled={response?.id} />
                <ResetButton onClick={handleReset} />
                <SaveDropdownButton
                  onSubmit={handleSendOrder}
                  loading={isLoading}
                  dropdownProps={{
                    visible: visibleDrop,
                    onOpenChange: handleVisibleChange,
                    disabled: editingKey !== "" || response?.id,
                  }}
                />
              </Space>
            </Col>
          </Row>
        }
      >
        <Form
          layout="vertical"
          hideRequiredMark
          form={form}
          initialValues={{
            date:
              calendarCode === "gregory"
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
            account:
              factorType === "sales"
                ? { label: defaultCustomer?.full_name, value: 103001 }
                : { label: defaultSupplier?.full_name, value: 201001 },

            employee: { label: defaultEmployee?.full_name, value: 203001 },
            warehouseName: {
              value: 106001,
              label: defaultWarehouse?.name,
            },
            debit: false,
            status: "pending",
          }}
        >
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
                place="add"
                warehouseId={
                  warehouseId === 0 ? defaultWarehouse?.id : warehouseId
                }
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
                  {props?.type !== "quotation" && (
                    <MultipleCashPayment
                      {...{
                        form,
                        type: props?.type,
                        responseId: Boolean(response?.id),
                        calendarCode,
                        finalAmount,
                        currencySymbol,
                        setCashAmount,
                        actionType: "add",
                        cashAmount,
                      }}
                    />
                  )}
                </InvoicesFooter>
              </Col>
            )}
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default AddInvoice;
