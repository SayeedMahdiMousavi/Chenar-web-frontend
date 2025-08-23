import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import startCase from 'lodash/startCase';
import { Drawer, Form, Col, Row, message, Space, Modal } from 'antd';
import dayjs from 'dayjs';
import axiosInstance from '../../../ApiBaseUrl';
import { useMutation, useQueryClient } from 'react-query';
import ProductTransferTable from './ProductTransferTable';
import {
  changeGToJ,
  handlePrepareDateForServer,
  utcDate,
} from '../../../../Functions/utcDate';
import { fixedNumber } from '../../../../Functions/math';
import useGetCalender from '../../../../Hooks/useGetCalender';
import useGetBaseCurrency from '../../../../Hooks/useGetBaseCurrency';
import PrintInvoiceButton from '../MarketInvoiceComponents/PrintInvoiceButton';
import { ActionMessage } from '../../../SelfComponents/TranslateComponents/ActionMessage';
import SaveDropdownButton from '../../../../components/buttons/SaveDropdownButton';
import {
  expireProductsBaseUrl,
  productStatisticsBaseUrl,
} from '../../../Reports/AllReports/AllReports';
import {
  CancelButton,
  PageNewButton,
  ResetButton,
} from '../../../../components';
import { PRODUCT_TRANSFER_INVOICE_M } from '../../../../constants/permissions';
import { WAREHOUSE_PRODUCT_TRANSFER_LIST } from '../../../../constants/routes';
import { handleFindUnitConversionRate } from '../../../../Functions';
import ProductTransferHeader from './ProductTransferComponents/Header';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const AddProductTransfer = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [response, setResponse] = useState({});
  const [count, setCount] = useState(2);
  const [visibleDrop, setVisibleDrop] = useState(false);
  const [data, setData] = useState([
    {
      key: 1,
      row: `${1}`,
      serial: 1,
      qty: 1,
    },
  ]);

  const showDrawer = () => {
    setVisible(true);
  };

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  const handleAddProduct = useCallback(async () => {
    const newData = {
      key: count,
      row: `${count}`,
      serial: 1,
      qty: 1,
    };

    const element = document?.getElementsByClassName('ant-table-body');
    element[0] &&
      element[0].lastElementChild.lastElementChild.lastElementChild.scrollIntoView(
        { behavior: 'smooth' },
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
    setCount(2);
    setResponse({});
    setEditingKey('');
    setData([
      {
        key: 1,
        row: `${1}`,
        serial: 1,

        qty: 1,
      },
    ]);
    setSelectedRowKeys([]);
  }, [form]);

  const messageKey = 'addProductTransfer';
  const addProductTransfer = useCallback(
    async ({ value, type }) => {
      return await axiosInstance
        .post(WAREHOUSE_PRODUCT_TRANSFER_LIST, value, { timeout: 0 })
        .then((res) => {
          if (type === '0') {
            message.destroy(messageKey);
            message.success(
              <ActionMessage
                name={`${t('Sales.All_sales.Invoice.Invoice')} ${
                  res?.data?.id
                }`}
                message='Message.Add'
              />,
            );
            handleAfterVisibleChange();
            setVisibleDrop(false);
          } else {
            setResponse(res.data);
            message.success(
              <ActionMessage
                name={`${t('Sales.All_sales.Invoice.Invoice')} ${
                  res?.data?.id
                }`}
                message='Message.Add'
              />,
            );
          }

          queryClient.invalidateQueries(WAREHOUSE_PRODUCT_TRANSFER_LIST);
          queryClient.invalidateQueries(expireProductsBaseUrl);
          queryClient.invalidateQueries(productStatisticsBaseUrl);
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
                `${error?.response.data?.invoice_item?.[0]?.product?.[0]}`,
              );
            } else if (error?.response?.data?.invoice_item?.[0]?.qty?.[0]) {
              message.error(
                `${error?.response.data?.invoice_item?.[0]?.qty?.[0]}`,
              );
            } else if (error?.response?.data?.invoice_item?.[0]?.unit?.[0]) {
              message.error(
                `${error?.response.data?.invoice_item?.[0]?.unit?.[0]}`,
              );
            } else if (
              error?.response?.data?.invoice_item?.[0]?.expire_date?.[0]
            ) {
              message.error(
                `${error?.response.data?.invoice_item?.[0]?.expire_date?.[0]}`,
              );
            } else if (
              error?.response?.data?.invoice_item?.[0]
                ?.unit_conversion_rate?.[0]
            ) {
              message.error(
                `${error?.response.data?.invoice_item?.[0]?.unit_conversion_rate?.[0]}`,
              );
            } else if (
              error?.response?.data?.invoice_item?.[0]?.warehouse_in?.[0]
            ) {
              message.error(
                `${error?.response.data?.invoice_item?.[0]?.warehouse_in?.[0]}`,
              );
            } else if (
              error?.response?.data?.invoice_item?.[0]?.warehouse_out?.[0]
            ) {
              message.error(
                `${error?.response.data?.invoice_item?.[0]?.warehouse_out?.[0]}`,
              );
            }
            return error;
          }
        });
    },
    [handleAfterVisibleChange, queryClient, t],
  );

  const { mutate: mutateAddProductTransfer, isLoading } =
    useMutation(addProductTransfer);

  const getPrice = useCallback((record, unitId) => {
    if (record?.price?.find((item) => item?.unit?.id === unitId)?.sales_rate) {
      return parseFloat(
        record?.price?.find((item) => item?.unit?.id === unitId)?.sales_rate,
      )?.toFixed(3);
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
              item?.product_units,
            );
            const price = getPrice(item, item?.unit.value);
            return [
              ...items,
              {
                unit: item?.unit?.value,
                unit_conversion_rate: unitConversion,
                product: item?.id?.value,
                qty: parseFloat(parseFloat(item?.qty).toFixed(4)),
                each_price: price ? fixedNumber(price, 15) : 0,
                description: item?.description,
                warehouse_in: item?.warehouse_in?.value,
                warehouse_out: item?.warehouse_out?.value,
                expire_date: item?.expirationDate,
              },
            ];
          } else {
            return items;
          }
        }, []);

        if (items?.length === 0) {
          Modal.warning({
            bodyStyle: { direction: t('Dir') },
            title: t('Sales.All_sales.Invoice.Invoice_no_data_message'),
          });
        } else {
          if (submitType === '0') {
            message.loading({
              content: t('Message.Loading'),
              key: messageKey,
            });
          } else {
            message.loading({
              content: t('Message.Loading'),
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
            customer: 'CUS-103001',
          };
          //
          mutateAddProductTransfer({ value: allData, type: submitType });
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

  // const printFilters = (
  //   <Descriptions
  //     layout="horizontal"
  //     style={{ width: "100%", paddingTop: "40px" }}
  //     column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
  //     size="small"
  //   >
  //     <Descriptions.Item label={t("Sales.All_sales.Invoice.Invoice_number")}>
  //       {response?.id ?? 0}
  //     </Descriptions.Item>
  //     {/* <Descriptions.Item label={t("Form.Description")}>
  //       <Typography.Paragraph>{description}</Typography.Paragraph>
  //     </Descriptions.Item> */}
  //   </Descriptions>
  // );
  const responseId = Boolean(response?.id);
  return (
    <div>
      <PageNewButton onClick={showDrawer} model={PRODUCT_TRANSFER_INVOICE_M} />

      <Drawer
        maskClosable={false}
        mask={true}
        title={startCase(t('Sales.All_sales.Invoice.Product_transfer'))}
        height='100%'
        onClose={onClose}
        open={visible}
        afterVisibleChange={handleAfterVisibleChange}
        destroyOnClose
        placement='top'
        bodyStyle={{ paddingBottom: 10 }}
        footer={
          <Row justify='end'>
            <Col>
              <Space size='small'>
                <CancelButton onClick={onClose} disabled={responseId} />

                <ResetButton onClick={handleAfterVisibleChange} />
                <PrintInvoiceButton
                  // disabled={false}
                  disabled={!responseId}
                  title={startCase(
                    t('Sales.All_sales.Invoice.Product_transfer'),
                  )}
                  dataSource={data}
                  type='productTransfer'
                  // summary={summary}
                  form={form}
                  id={response?.id}
                />

                <SaveDropdownButton
                  onSubmit={handleSendOrder}
                  loading={isLoading}
                  dropdownProps={{
                    visible: visibleDrop,
                    onOpenChange: handleVisibleChange,
                    disabled: editingKey !== '' || responseId,
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
              calendarCode === 'gregory'
                ? utcDate()
                : dayjs(changeGToJ(utcDate().format(dateFormat), dateFormat), {
                    //@ts-ignore
                    jalali: true,
                  }),
          }}
        >
          <Row>
            <Col span={6}>
              <ProductTransferHeader disabled={responseId} />
            </Col>

            <Col span={24}>
              <ProductTransferTable
                data={data}
                setData={setData}
                setCount={setCount}
                count={count}
                type='add'
                setEditingKey={setEditingKey}
                editingKey={editingKey}
                setSelectedRowKeys={setSelectedRowKeys}
                selectedRowKeys={selectedRowKeys}
                handleAddProduct={handleAddProduct}
                responseId={responseId}
              />
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default AddProductTransfer;
