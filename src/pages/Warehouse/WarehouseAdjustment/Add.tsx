import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import startCase from "lodash/startCase";
import { Drawer, Form, Col, Row, message, Space, Modal } from "antd";
import dayjs from "dayjs";
import axiosInstance from "../../ApiBaseUrl";
import { useMutation, useQueryClient } from "react-query";
import {
  changeGToJ,
  handlePrepareDateForServer,
  utcDate,
} from "../../../Functions/utcDate";
import { fixedNumber } from "../../../Functions/math";
import useGetCalender from "../../../Hooks/useGetCalender";
import useGetBaseCurrency from "../../../Hooks/useGetBaseCurrency";
import { ActionMessage } from "../../SelfComponents/TranslateComponents/ActionMessage";
import SaveDropdownButton from "../../../components/buttons/SaveDropdownButton";
import WarehouseAdjustmentEditableTable from "./EditableTable";
import { Key } from "antd/lib/table/interface";
import { CancelButton, PageNewButton, ResetButton } from "../../../components";
import { WAREHOUSE_ADJUSTMENT_M } from "../../../constants/permissions";
import { WAREHOUSE_ADJUSTMENT_INVOICE_LIST } from "../../../constants/routes";
// import { handleFindUnitConversionRate } from "../../../Functions";
import PrintInvoiceButton from "../../sales/AllSales/MarketInvoiceComponents/PrintInvoiceButton";
import ProductTransferHeader from "../../sales/AllSales/ProductTransfer/ProductTransferComponents/Header";

const dateFormat = "YYYY-MM-DD HH:mm";

export default function AddWarehouseAdjustment() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [editingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();
  const [response, setResponse] = useState<any>({});
  const [count, setCount] = useState(2);
  const [visibleDrop, setVisibleDrop] = useState(false);
  const [data, setData] = useState<any>([
    {
      key: 1,
      row: `${1}`,
    },
  ]);

  const showDrawer = () => {
    setVisible(true);
  };

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyId = baseCurrency?.data?.id;

  const handleAfterVisibleChange = useCallback(() => {
    form.resetFields();
    setCount(2);
    setResponse({});
    setEditingKey("");
    setData([
      {
        key: 1,
        row: `${1}`,
      },
    ]);
    setSelectedRowKeys([]);
  }, [form]);

  const messageKey = "addWarehouseAdjustment";
  const addWarehouseAdjustment = useCallback(
    async ({ value, type }) => {
      return await axiosInstance
        .post(WAREHOUSE_ADJUSTMENT_INVOICE_LIST, value, { timeout: 0 })
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
            handleAfterVisibleChange();
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
          queryClient.invalidateQueries(WAREHOUSE_ADJUSTMENT_INVOICE_LIST);

          return res;
        })
        .catch((error) => {
          if (error?.response?.data?.date_time?.[0]) {
            message.error(`${error?.response.data?.date_time?.[0]}`);
          } else if (error?.response?.data?.description?.[0]) {
            message.error(`${error?.response.data?.description?.[0]}`);
          } else if (error?.response?.data?.invoice_item?.[0]) {
            if (error?.response?.data?.invoice_item?.[0]?.product?.[0]) {
              message.error(
                `${error?.response.data?.invoice_item?.[0]?.product?.[0]}`
              );
            } else if (error?.response?.data?.invoice_item?.[0]?.qty?.[0]) {
              message.error(
                `${error?.response.data?.invoice_item?.[0]?.qty?.[0]}`
              );
            } else if (error?.response?.data?.invoice_item?.[0]?.unit?.[0]) {
              message.error(
                `${error?.response.data?.invoice_item?.[0]?.unit?.[0]}`
              );
            } else if (
              error?.response?.data?.invoice_item?.[0]?.expire_date?.[0]
            ) {
              message.error(
                `${error?.response.data?.invoice_item?.[0]?.expire_date?.[0]}`
              );
            } else if (
              error?.response?.data?.invoice_item?.[0]
                ?.unit_conversion_rate?.[0]
            ) {
              message.error(
                `${error?.response.data?.invoice_item?.[0]?.unit_conversion_rate?.[0]}`
              );
            } else if (
              error?.response?.data?.invoice_item?.[0]?.warehouse_in?.[0]
            ) {
              message.error(
                `${error?.response.data?.invoice_item?.[0]?.warehouse_in?.[0]}`
              );
            } else if (
              error?.response?.data?.invoice_item?.[0]?.warehouse_out?.[0]
            ) {
              message.error(
                `${error?.response.data?.invoice_item?.[0]?.warehouse_out?.[0]}`
              );
            }
          }
          return error;
        });
    },
    [handleAfterVisibleChange, queryClient, t]
  );

  const { mutate: mutateAddWarehouseAdjustment, isLoading } = useMutation(
    addWarehouseAdjustment
  );

  const handleSendOrder = (e: any) => {
    const submitType = e?.key;
    form.validateFields().then(async (values) => {
      if (data?.length > 0) {
        const items = data?.reduce((items: any, item: any) => {
          if (item?.product?.value) {
            const qty = fixedNumber(item?.qty);

            const newItem = {
              product: item?.product?.value,
              unit: item?.product_units?.find((item: any) => item?.base_unit)
                ?.unit?.id,
              unit_conversion_rate: 1,
              qty: qty,
              warehouse_in: item?.warehouse?.value,
              warehouse_out: item?.warehouse?.value,
              each_price: item?.each_price,
              expire_date: item?.expirationDate,
            };

            if (values?.type === "waste") {
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
          if (submitType === "0") {
            message.loading({
              content: t("Message.Loading"),
              key: messageKey,
            });
          }
          const allData = {
            date_time: handlePrepareDateForServer({
              date: values?.date,
              calendarCode,
            }),
            description: values.description,
            currency: baseCurrencyId,
            currency_rate: 1,
            invoice_items: items,
            customer: "CUS-103001",
          };
          // 
          mutateAddWarehouseAdjustment({ value: allData, type: submitType });
        }
      }
    });
  };

  const handleVisibleChange = (flag: boolean) => {
    setVisibleDrop(flag);
  };

  const onClose = () => {
    setVisible(false);
  };

  const responseId = Boolean(response?.id);

  return (
    <div>
      <PageNewButton onClick={showDrawer} model={WAREHOUSE_ADJUSTMENT_M} />

      <Drawer
        maskClosable={false}
        mask={true}
        title={startCase(t("Warehouse.Warehouse_adjustment_information"))}
        height="100%"
        onClose={onClose}
        open={visible}
        afterVisibleChange={handleAfterVisibleChange}
        destroyOnClose
        placement="top"
        bodyStyle={{ paddingBottom: 10 }}
        footer={
          <Row justify="end">
            <Col>
              <Space size="small">
                <CancelButton onClick={onClose} disabled={responseId} />
                <ResetButton ghost onClick={handleAfterVisibleChange} />
                <PrintInvoiceButton
                  disabled={!responseId}
                  title={startCase(
                    t("Warehouse.Warehouse_adjustment_information")
                  )}
                  dataSource={data}
                  type="warehouseAdjustment"
                  form={form}
                  id={response?.id}
                />

                <SaveDropdownButton
                  //@ts-ignore
                  onSubmit={handleSendOrder}
                  loading={isLoading}
                  dropdownProps={{
                    visible: visibleDrop,
                    onOpenChange: handleVisibleChange,
                    disabled: editingKey !== "" || responseId,
                  }}
                />
              </Space>
            </Col>
          </Row>
        }
      >
        <Form
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
            type: "waste",
          }}
        >
          <Row>
            <Col span={6}>
              <ProductTransferHeader type="adjustment" disabled={responseId} />
            </Col>

            <Col span={24}>
              <WarehouseAdjustmentEditableTable
                data={data}
                setData={setData}
                setCount={setCount}
                count={count}
                type="add"
                setEditingKey={setEditingKey}
                editingKey={editingKey}
                setSelectedRowKeys={setSelectedRowKeys}
                selectedRowKeys={selectedRowKeys}
                responseId={responseId}
              />
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
}
