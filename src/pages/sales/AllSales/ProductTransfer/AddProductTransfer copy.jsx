import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import startCase from "lodash/startCase";
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  message,
  Space,
  Modal,
  Descriptions,
} from "antd";
import dayjs from "dayjs";
import axiosInstance from "../../../ApiBaseUrl";
import { useMutation, useQueryClient } from "react-query";
import ProductTransferTable from "./ProductTransferTable";
import { DatePickerFormItem } from "../../../SelfComponents/JalaliAntdComponents/DatePickerFormItem";
import { changeGToJ, utcDate } from "../../../../Functions/utcDate";
import { fixedNumber } from "../../../../Functions/math";
import useGetCalender from "../../../../Hooks/useGetCalender";
import useGetBaseCurrency from "../../../../Hooks/useGetBaseCurrency";
import PrintInvoiceButton from "../MarketInvoiceComponents/PrintInvoiceButton";
import { ActionMessage } from "../../../SelfComponents/TranslateComponents/ActionMessage";
import SaveDropdownButton from "../../../../components/buttons/SaveDropdownButton";
import {
  expireProductsBaseUrl,
  productStatisticsBaseUrl,
} from "../../../Reports/AllReports/AllReports";
import { PageNewButton } from "../../../../components";
import { PRODUCT_TRANSFER_INVOICE_M } from "../../../../constants/permissions";
import { WAREHOUSE_PRODUCT_TRANSFER_LIST } from "../../../../constants/routes";
import { handleFindUnitConversionRate } from "../../../../Functions";

const dateFormat = "YYYY-MM-DD HH:mm:ss";
const AddProductTransfer = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();
  const [response, setResponse] = useState({});
  const [count, setCount] = useState(2);
  const [description, setDescription] = useState("");
  const [visibleDrop, setVisibleDrop] = useState(false);
  const [data, setData] = useState([
    {
      key: 1,
      row: `${1}`,
      id: { value: "", label: "" },
      serial: 1,
      product: { value: "", label: "" },
      unit: { value: "", label: "" },
      qty: 1,
      each_price: 0,
      total_price: 0,
      description: "",
    },
  ]);

  const showDrawer = () => {
    setVisible(true);
  };

  //get current calender
  const userCalender = useGetCalender();

  const handleAddProduct = useCallback(async () => {
    const newData = {
      key: count,
      row: `${count}`,
      id: { value: "", label: "" },
      product: { value: "", label: "" },
      unit: { value: "", label: "" },
      qty: 1,
      each_price: 0,
      total_price: 0,
      description: "",
    };
    const element = document?.getElementsByClassName("ant-table-body");
    element[0] &&
      element[0].lastElementChild.lastElementChild.lastElementChild.scrollIntoView(
        { behavior: "smooth" }
      );
    // const rowKey = [newData.key];
    // props.setSelectedRowKeys(rowKey);
    // }, 200);
    setData((prev) => [...prev, newData]);
    setCount(count + 1);
  }, [count]);

  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyId = baseCurrency?.data?.id;

  const handleAfterVisibleChange = useCallback(() => {
    form.resetFields();
    setLoading(false);
    setCount(2);
    setResponse({});
    setEditingKey("");
    setDescription("");
    setData([
      {
        key: 1,
        row: `${1}`,
        serial: 1,
        id: { value: "", label: "" },
        product: { value: "", label: "" },
        unit: { value: "", label: "" },
        qty: 1,
        each_price: 0,
        total_price: 0,
        description: "",
      },
    ]);
    // setCurrencyValue(1);
    setSelectedRowKeys([]);
  }, [form]);

  const messageKey = "addProductTransfer";
  const addSalesInvoice = useCallback(
    async ({ value, type }) => {
      await axiosInstance
        .post(WAREHOUSE_PRODUCT_TRANSFER_LIST, value, { timeout: 0 })
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

          setLoading(false);

          queryClient.invalidateQueries(WAREHOUSE_PRODUCT_TRANSFER_LIST);
          queryClient.invalidateQueries(expireProductsBaseUrl);
          queryClient.invalidateQueries(productStatisticsBaseUrl);
        })
        .catch((error) => {
          setLoading(false);
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
        });
    },
    [handleAfterVisibleChange, queryClient, t]
  );

  const { mutate: mutateAddSalesInvoice } = useMutation(addSalesInvoice, {
    onSuccess: () => {
      // queryClient.invalidateQueries(`/invoice/warehouse_transfer_invoice/`);
    },
  });

  const getPrice = useCallback((record, unitId) => {
    if (record?.price?.find((item) => item?.unit?.id === unitId)?.sales_rate) {
      return parseFloat(
        record?.price?.find((item) => item?.unit?.id === unitId)?.sales_rate
      )?.toFixed(3);
    } else if (
      record?.unit_conversion?.find((item) => item?.from_unit?.id === unitId)
        ?.ratio ||
      record?.product_units?.find((item) => item?.base_unit === true)?.unit
        ?.id === unitId
    ) {
      // Modal.warning({
      //   title: "Price recording problem",
      //   content: "Please first add price recording of this unit",
      // });
      return;
    } else {
      // Modal.warning({
      //   title: "Unit conversion problem",
      //   content: "Please first add unit conversion of this unit",
      // });
      return;
    }
  }, []);

  const handleSendOrder = (e) => {
    const submitType = e?.key;
    form.validateFields().then(async (values) => {
      if (data?.length > 0) {
        const items = data?.reduce((items, item) => {
          if (item?.product?.value) {
            const unitConversion = handleFindUnitConversionRate(
              item?.unit_conversion,
              item?.unit.value,
              item?.product_units
            );
            const price = getPrice(item, item?.unit.value);
            // 
            return [
              ...items,
              {
                unit: item?.unit?.value,
                unit_conversion_rate: unitConversion,
                product: item?.id?.value,
                qty: parseFloat(parseFloat(item?.qty).toFixed(4)),
                total_price: price ? fixedNumber(price * item?.qty, 15) : 0,
                each_price: price ? fixedNumber(price, 15) : 0,
                description: item?.description,
                warehouse_in: item?.warehouse_in?.value,
                warehouse_out: item?.warehouse_out?.value,
                // expire_date: item?.expirationDate,
                // expire_date:
                //   item?.expirationDate &&
                //   item?.expirationDate?.format(dateFormat1),
              },
            ];
          } else {
            return items;
          }
        }, []);

        if (submitType === "0") {
          message.loading({
            content: t("Message.Loading"),
            key: messageKey,
          });
        } else {
          setLoading(true);
        }

        if (items?.length === 0) {
          Modal.warning({
            bodyStyle: { direction: t("Dir") },
            title: t("Sales.All_sales.Invoice.Invoice_no_data_message"),
          });
        } else {
          setLoading(true);
          const allData = {
            date_time: utcDate().format(dateFormat),
            description: values.description,
            currency: baseCurrencyId,
            currency_rate: 1,
            invoice_item: items,
          };
          // 
          mutateAddSalesInvoice({ value: allData, type: submitType });
        }
      }
    });
  };

  const handleVisibleChange = (flag) => {
    setVisibleDrop(flag);
  };

  const onClose = () => {
    setVisible(false);
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
      {/* <Descriptions.Item label={t("Form.Description")}>
        <Typography.Paragraph>{description}</Typography.Paragraph>
      </Descriptions.Item> */}
    </Descriptions>
  );

  const onChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  return (
    <div>
      <PageNewButton onClick={showDrawer} model={PRODUCT_TRANSFER_INVOICE_M} />

      <Drawer
        maskClosable={false}
        mask={true}
        // headerStyle={{ padding: ".8rem 0 .7rem 0 " }}
        title={startCase(t("Sales.All_sales.Invoice.Product_transfer"))}
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
                <Button
                  type="primary"
                  ghost
                  onClick={onClose}
                  disabled={response?.id}
                >
                  {t("Form.Cancel")}
                </Button>
                <Button
                  // shape="round"
                  type="primary"
                  ghost
                  onClick={handleAfterVisibleChange}
                  disabled={editingKey !== ""}
                >
                  {t("Form.Reset")}
                </Button>
                {/* <PrintInvoiceButton
                  disabled={!response?.id}
                  // domColumns={columns("print")}
                  title={startCase(
                    t("Sales.All_sales.Invoice.Product_transfer")
                  )}
                  dataSource={data}
                  type="productTransfer"
                  filters={printFilters}
                /> */}

                <div style={{ width: "130px" }}>
                  <Row>
                    <Col span={24}>
                      <SaveDropdownButton
                        onSubmit={handleSendOrder}
                        loading={loading}
                        dropdownProps={{
                          visible: visibleDrop,
                          onOpenChange: handleVisibleChange,
                          disabled: editingKey !== "" || response?.id,
                        }}
                      />
                    </Col>
                    {/* <Col span={17}>
                      <Button
                        shape="round"
                        onClick={handleSendOrder}
                        type="primary"
                        htmlType="submit"
                        loading={loading}
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
                    </Col> */}
                  </Row>
                </div>
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
              userCalender?.data?.user_calender?.code === "gregory"
                ? utcDate()
                : dayjs(changeGToJ(utcDate().format(dateFormat), dateFormat), {
                    //@ts-ignore
                    jalali: true,
                  }),
          }}
        >
          <Row>
            <Col span={6}>
              <Row gutter={10}>
                <Col span={24}>
                  <DatePickerFormItem
                    placeholder={t("Sales.Customers.Form.Date")}
                    name="date"
                    label=""
                    showTime={true}
                    format="YYYY-MM-DD hh:mm "
                    rules={[{ type: "object" }]}
                    style={styles.margin}
                    disabled={true}
                  />
                </Col>
                <Col span={24}>
                  <Form.Item name="description">
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

            <Col span={24}>
              <ProductTransferTable
                data={data}
                setData={setData}
                setCount={setCount}
                count={count}
                type="add"
                setEditingKey={setEditingKey}
                editingKey={editingKey}
                setSelectedRowKeys={setSelectedRowKeys}
                selectedRowKeys={selectedRowKeys}
                handleAddProduct={handleAddProduct}
                responseId={response?.id}
              />
            </Col>

            <Col span={24}>
              <Row>
                <Col span={12}>
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
              </Row>
            </Col>
          </Row>
        </Form>
        {/* )} */}
      </Drawer>
    </div>
  );
};

const styles = {
  margin: { marginBottom: "8px" },
  save: { width: "142%" },
  drop: { height: "100%", width: "100%" },
};

export default AddProductTransfer;
