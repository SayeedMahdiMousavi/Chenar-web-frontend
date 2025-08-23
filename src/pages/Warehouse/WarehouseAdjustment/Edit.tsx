import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import startCase from 'lodash/startCase';
import { Drawer, Form, Col, Row, message, Space, Modal, Spin } from 'antd';
import axiosInstance from '../../ApiBaseUrl';
import { useMutation, useQueryClient } from 'react-query';
import { fixedNumber, math, print } from '../../../Functions/math';
import useGetBaseCurrency from '../../../Hooks/useGetBaseCurrency';
import { ActionMessage } from '../../SelfComponents/TranslateComponents/ActionMessage';
import WarehouseAdjustmentEditableTable from './EditableTable';
import { Key } from 'antd/lib/table/interface';
import { CancelButton, EditMenuItem, SaveButton } from '../../../components';
import { WAREHOUSE_ADJUSTMENT_M } from '../../../constants/permissions';
import { WAREHOUSE_ADJUSTMENT_INVOICE_LIST } from '../../../constants/routes';
import { useGetCalender } from '../../../Hooks';
import {
  handlePrepareDateForDateField,
  handlePrepareDateForServer,
} from '../../../Functions/utcDate';
import PrintInvoiceButton from '../../sales/AllSales/MarketInvoiceComponents/PrintInvoiceButton';
import ProductTransferHeader from '../../sales/AllSales/ProductTransfer/ProductTransferComponents/Header';
import { manageErrors } from '../../../Functions';

interface IProps {
  recordCurrency: number;
  recordCurrencyRate: number;
  setVisible: (value: boolean) => void;
  handleClickEdit: () => void;
  recordDate: string;
  recordId: number;
}

export function EditWarehouseAdjustment({
  recordCurrency,
  recordCurrencyRate,
  setVisible: setMenuVisible,
  handleClickEdit,
  recordId,
  ...rest
}: IProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [response, setResponse] = useState<any>({});
  const [count, setCount] = useState(2);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [editSpin, setEditSpin] = useState(false);
  const [data, setData] = useState<any>([
    {
      key: 1,
      row: `${1}`,
      product: { value: '', label: '' },
    },
  ]);

  const showDrawer = () => {
    setVisible(true);
  };

  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyId = baseCurrency?.data?.id;

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  const editWarehouseAdjustment = useCallback(
    async (value: any) => {
      return await axiosInstance
        .put(`${WAREHOUSE_ADJUSTMENT_INVOICE_LIST}${recordId}/`, value, {
          timeout: 0,
        })
        .then((res) => {
          setResponse(res.data);
          message.success(
            <ActionMessage
              name={`${t('Sales.All_sales.Invoice.Invoice')} ${res?.data?.id}`}
              message='Message.Update'
            />,
          );

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

  const { mutate: mutateEditWarehouseAdjustment, isLoading } = useMutation(
    editWarehouseAdjustment,
  );

  const handleSendOrder = () => {
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
              warehouse_in:
                values?.type === 'waste' ? null : item?.warehouse?.value,
              warehouse_out:
                values?.type === 'waste' ? item?.warehouse?.value : null,
              each_price: item?.each_price,
              id: item?.itemId,
              expire_date: item?.expirationDate,
            };

            return [...items, newItem];
          } else {
            return items;
          }
        }, []);

        const updatedItems = items?.filter((item: any) => Boolean(item?.id));
        const updatedItemsIds = items?.map((item: any) => item?.id);
        const createdItems = items?.filter((item: any) => !Boolean(item?.id));
        const deletedItems = invoiceItems?.filter(
          (item) => !updatedItemsIds?.includes(item),
        );

        if (items?.length === 0) {
          Modal.warning({
            bodyStyle: {
              direction: t('Dir') as
                | 'ltr'
                | 'rtl'
                | 'inherit'
                | 'initial'
                | 'unset',
            },
            title: t('Sales.All_sales.Invoice.Invoice_no_data_message'),
          });
        } else {
          const allData = {
            date_time: handlePrepareDateForServer({
              date: values?.date,
              calendarCode,
            }),
            description: values.description,
            currency: baseCurrencyId,
            currency_rate: 1,
            invoice_items: {
              created_items:
                createdItems?.length === 0 ? undefined : createdItems,
              deleted_items:
                deletedItems?.length === 0 ? undefined : deletedItems,
              updated_items:
                updatedItems?.length === 0 ? undefined : updatedItems,
            },
            customer: 'CUS-103001',
          };

          mutateEditWarehouseAdjustment(allData);
        }
      }
    });
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
  //     <Descriptions.Item label={t("Form.Description")}>
  //       {/* <Typography.Paragraph>{description}</Typography.Paragraph> */}
  //     </Descriptions.Item>
  //   </Descriptions>
  // );

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
        },
      ]);

      setSelectedRowKeys([]);
    } else {
      setMenuVisible(false);
      setEditSpin(true);
      const allData = await axiosInstance
        .get(
          `${WAREHOUSE_ADJUSTMENT_INVOICE_LIST}${recordId}/?fields=date_time,description,invoice_items&omit=invoice_items.description
&expand=*,invoice_items.warehouse_in,invoice_items.warehouse_out,invoice_items.product,invoice_items.product.product_barcode,
invoice_items.product.product_barcode.unit,invoice_items.product.product_units,invoice_items.product.product_units.unit,
invoice_items.product.price,invoice_items.product.price.unit,invoice_items.product.product_statistic,invoice_items.unit`,
          { timeout: 0 },
        )
        .catch((error) => {
          setEditSpin(false);
          manageErrors(error);
          return error;
        });

      if (allData?.data) {
        const { data } = allData;

        const newData = data?.invoice_items?.reduce(
          ({ items, itemsId }: any, item: any, index: number) => {
            const warehouse = Boolean(item?.warehouse_in)
              ? item?.warehouse_in
              : item?.warehouse_out;

            const totalPrice = fixedNumber(
              print(
                //@ts-ignore
                math.evaluate(`${item?.each_price ?? 0} * ${item?.qty ?? 0}`),
              ),
            );
            const newItem = {
              ...item?.product,
              key: index + 1,
              serial: index + 1,
              product: { label: item?.product?.name, value: item?.product?.id },
              warehouse: {
                label: warehouse?.name,
                value: warehouse?.id,
              },
              unit: { value: item?.unit?.id, label: item?.unit?.name },
              qty: parseFloat(item?.qty),
              itemId: item?.id,
              type: Boolean(item?.warehouse_in)
                ? { value: 'add', label: t('Add') }
                : { value: 'minus', label: t('Minus') },
              each_price: parseFloat(item?.each_price),
              total_price: totalPrice,
              expirationDate: item?.expire_date,
            };
            return {
              items: [...items, newItem],
              itemsId: [...itemsId, item?.id],
            };
          },
          { items: [], itemsId: [] },
        );

        const date = handlePrepareDateForDateField({
          date: data?.date_time,
          calendarCode,
        });
        form.setFieldsValue({
          date: date,
          description: data?.description,
          type: data?.invoice_items?.[0]?.warehouse_in ? 'reward' : 'waste',
        });
        setInvoiceItems(newData?.invoiceItemsIds);
        setCount(data?.invoice_items?.length + 1);
        setData(newData?.items);
        setEditSpin(false);
      }
    }
  }, [calendarCode, form, recordId, setMenuVisible, t, visible]);

  const responseId = Boolean(response?.id);

  return (
    <div>
      <EditMenuItem
        {...rest}
        onClick={showDrawer}
        permission={WAREHOUSE_ADJUSTMENT_M}
      />

      <Drawer
        maskClosable={false}
        mask={true}
        title={startCase(t('Warehouse.Edit_warehouse_adjustment'))}
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
                  title={startCase(t('Warehouse.Edit_warehouse_adjustment'))}
                  dataSource={data}
                  type='warehouseAdjustment'
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
                <ProductTransferHeader
                  type='adjustment'
                  disabled={responseId}
                />
              </Col>

              <Col span={24}>
                <WarehouseAdjustmentEditableTable
                  data={data}
                  setData={setData}
                  setCount={setCount}
                  count={count}
                  type='add'
                  setEditingKey={setEditingKey}
                  editingKey={editingKey}
                  setSelectedRowKeys={setSelectedRowKeys}
                  selectedRowKeys={selectedRowKeys}
                  responseId={responseId}
                />
              </Col>
            </Row>
          </Spin>
        </Form>
      </Drawer>
    </div>
  );
}

//@ts-ignore
// eslint-disable-next-line no-func-assign
EditWarehouseAdjustment = React.memo(EditWarehouseAdjustment);

export default EditWarehouseAdjustment;
