import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import startCase from 'lodash/startCase';
import { Drawer, Form, Col, Row, message, Space, Modal, Spin } from 'antd';
import axiosInstance from '../../../ApiBaseUrl';
import { useMutation, useQueryClient } from 'react-query';
import ProductTransferTable from './ProductTransferTable';
import { ActionMessage } from '../../../SelfComponents/TranslateComponents/ActionMessage';
import {
  handlePrepareDateForDateField,
  handlePrepareDateForServer,
} from '../../../../Functions/utcDate';
import { fixedNumber } from '../../../../Functions/math';
import useGetCalender from '../../../../Hooks/useGetCalender';
import {
  expireProductsBaseUrl,
  productStatisticsBaseUrl,
} from '../../../Reports/AllReports/AllReports';
import PrintInvoiceButton from '../MarketInvoiceComponents/PrintInvoiceButton';
import { WAREHOUSE_PRODUCT_TRANSFER_LIST } from '../../../../constants/routes';
import { CancelButton, EditMenuItem, SaveButton } from '../../../../components';
import { PRODUCT_TRANSFER_INVOICE_M } from '../../../../constants/permissions';
import { handleFindUnitConversionRate } from '../../../../Functions';
import ProductTransferHeader from './ProductTransferComponents/Header';

let EditProductTransfer = ({
  recordCurrency,
  recordCurrencyRate,
  setVisible: setMenuVisible,
  handleClickEdit,
  recordId,
  ...rest
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [prevStatistic, setPrevStatistic] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [response, setResponse] = useState({});
  const [count, setCount] = useState(2);
  const [data, setData] = useState([
    {
      key: 1,
      row: `${1}`,
      id: { value: '', label: '' },
      serial: 1,
      product: { value: '', label: '' },
      unit: { value: '', label: '' },
      qty: 1,
      each_price: 0,
      total_price: 0,
      description: '',
    },
  ]);
  const [editSpin, setEditSpin] = useState(false);

  const showDrawer = () => {
    handleClickEdit();
    setVisible(true);
  };

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  const handleAddProduct = useCallback(async () => {
    const newData = {
      key: count,
      row: `${count}`,
      id: '',
      product: '',
      unit: '',
      qty: 1,
      each_price: 0,
      total_price: 0,
      description: '',
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

  const editProductTransfer = useCallback(
    async (value) => {
      return await axiosInstance
        .put(`${WAREHOUSE_PRODUCT_TRANSFER_LIST}${recordId}/`, value, {
          timeout: 0,
        })
        .then((res) => {
          setResponse(res?.data);
          message.success(
            <ActionMessage
              name={`${t('Sales.All_sales.Invoice.Invoice')} ${res?.data?.id}`}
              message='Message.Update'
            />,
          );

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
          }
          return error;
        });
    },
    [queryClient, recordId, t],
  );
  const { mutate: mutateEditProductTransfer, isLoading } =
    useMutation(editProductTransfer);

  const getPrice = useCallback((record, unitId) => {
    if (record?.price?.find((item) => item?.unit?.id === unitId)?.sales_rate) {
      return parseFloat(
        record?.price?.find((item) => item?.unit?.id === unitId)?.sales_rate,
      )?.toFixed(3);
    }
    return;
  }, []);

  const handleSendOrder = () => {
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
                unit_conversion_rate:
                  item?.unit?.value === item?.prevUnit
                    ? item?.unitConversionRate
                    : unitConversion,
                product: item?.id?.value,
                qty: parseFloat(parseFloat(item?.qty).toFixed(4)),
                each_price: price ? fixedNumber(price, 15) : 0,
                description: item?.description,
                warehouse_in: item?.warehouse_in?.value,
                warehouse_out: item?.warehouse_out?.value,
                expire_date: item?.expirationDate,
                id: item?.itemId,
              },
            ];
          } else {
            return items;
          }
        }, []);

        const updatedItems = items?.filter((item) => item?.id);
        const updatedItemsIds = items?.map((item) => item?.id);
        const createdItems = items?.filter((item) => !item?.id);
        const deletedItems = invoiceItems?.filter(
          (item) => !updatedItemsIds?.includes(item),
        );

        if (items?.length === 0) {
          Modal.warning({
            bodyStyle: { direction: t('Dir') },
            title: t('Sales.All_sales.Invoice.Invoice_no_data_message'),
          });
        } else {
          const allData = {
            date_time: handlePrepareDateForServer({
              date: values?.date,
              calendarCode,
            }),
            description: values.description,
            currency: recordCurrency,
            currency_rate: recordCurrencyRate,
            customer: 'CUS-103001',
            invoice_items: {
              created_items:
                createdItems?.length === 0 ? undefined : createdItems,
              deleted_items:
                deletedItems?.length === 0 ? undefined : deletedItems,
              updated_items:
                updatedItems?.length === 0 ? undefined : updatedItems,
            },
          };

          mutateEditProductTransfer(allData);
        }
      }
    });
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleAfterVisibleChange = useCallback(async () => {
    if (visible === false) {
      form.resetFields();
      setCount(2);
      setResponse({});
      setEditingKey('');
      setData([
        {
          key: 1,
          row: `${1}`,
          serial: 1,
          id: '',
          product: '',
          unit: '',
          qty: 1,
          each_price: 0,
          total_price: 0,
          description: '',
        },
      ]);

      setSelectedRowKeys([]);
    } else {
      setMenuVisible(false);
      setEditSpin(true);
      const allData = await axiosInstance
        .get(
          `${WAREHOUSE_PRODUCT_TRANSFER_LIST}${recordId}/?fields=date_time,description,invoice_items&omit=invoice_items.description&expand=*
,invoice_items.warehouse_in,invoice_items.warehouse_out,invoice_items.product,invoice_items.product.product_barcode,
invoice_items.product.product_barcode.unit,invoice_items.product.product_units,invoice_items.product.product_units.unit,
invoice_items.product.price,,invoice_items.product.price.unit,invoice_items.product.unit_conversion,
invoice_items.product.unit_conversion.unit,invoice_items.product.product_statistic,invoice_items.unit`,
          { timeout: 0 },
        )
        .catch((error) => {
          setEditSpin(false);
          return error;
        });

      if (allData?.data) {
        const { data } = allData;

        const newData = data?.invoice_items?.reduce(
          ({ items, statistic, itemsId }, item, index) => {
            const productStatistic = {
              id: item?.product?.id,
              statistic:
                parseFloat(item?.unit_conversion_rate) ??
                0 * parseFloat(item?.qty),
              key: index + 1,
              warehouse: item?.warehouse_out?.id,
            };

            const newItem = {
              ...item?.product,
              key: index + 1,
              serial: index + 1,
              product: { label: item?.product?.name, value: item?.product?.id },
              id: { label: item?.product?.id, value: item?.product?.id },
              unit: { value: item?.unit?.id, label: item?.unit?.name },
              expirationDate: item?.expire_date,
              warehouse_in: {
                label: item?.warehouse_in?.name,
                value: item?.warehouse_in?.id,
              },
              warehouse_out: {
                label: item?.warehouse_out?.name,
                value: item?.warehouse_out?.id,
              },
              qty: parseFloat(item?.qty),
              itemId: item?.id,
              prevUnit: item?.unit?.id,
              unitConversionRate: item?.unit_conversion_rate,
            };
            return {
              items: [...items, newItem],
              statistic: [...statistic, productStatistic],
              itemsId: [...itemsId, item?.id],
            };
          },
          { items: [], statistic: [], itemsId: [] },
        );

        const date = handlePrepareDateForDateField({
          date: data?.date_time,
          calendarCode,
        });
        form.setFieldsValue({
          date: date,
          description: data?.description,
        });
        setInvoiceItems(newData?.invoiceItemsIds);
        setPrevStatistic(newData?.statistic);
        setCount(data?.invoice_items?.length + 1);
        setData(newData?.items);
        setEditSpin(false);
      }
    }
  }, [calendarCode, form, recordId, setMenuVisible, visible]);

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
      <EditMenuItem
        {...rest}
        onClick={showDrawer}
        permission={PRODUCT_TRANSFER_INVOICE_M}
      />

      <Drawer
        maskClosable={false}
        mask={true}
        title={startCase(t('Sales.All_sales.Invoice.Edit_product_transfer'))}
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
                <PrintInvoiceButton
                  disabled={!responseId}
                  title={startCase(
                    t('Sales.All_sales.Invoice.Edit_product_transfer'),
                  )}
                  dataSource={data}
                  type='productTransfer'
                  form={form}
                  id={response?.id}
                  isPrinted={true}
                />

                <SaveButton
                  onClick={handleSendOrder}
                  loading={isLoading}
                  disabled={
                    editSpin
                      ? true
                      : responseId || editingKey !== ''
                        ? true
                        : false
                  }
                />
              </Space>
            </Col>
          </Row>
        }
      >
        <Form hideRequiredMark form={form}>
          <Spin spinning={editSpin} size='large'>
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
                  prevStatistic={prevStatistic}
                  type='edit'
                  setEditingKey={setEditingKey}
                  editingKey={editingKey}
                  setSelectedRowKeys={setSelectedRowKeys}
                  selectedRowKeys={selectedRowKeys}
                  handleAddProduct={handleAddProduct}
                  responseId={responseId}
                />
              </Col>
            </Row>
          </Spin>
        </Form>
      </Drawer>
    </div>
  );
};

EditProductTransfer = React.memo(EditProductTransfer);

export default EditProductTransfer;
