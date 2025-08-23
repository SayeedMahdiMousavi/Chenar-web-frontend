import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import startCase from 'lodash/startCase';
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Space,
  Table,
  Descriptions,
  Typography,
  Spin,
} from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import axiosInstance from '../../ApiBaseUrl';
import PrintInvoiceButton from './MarketInvoiceComponents/PrintInvoiceButton';
import { useMemo } from 'react';
import { useReactToPrint } from 'react-to-print';
import { PrinterOutlined } from '@ant-design/icons';
import { print, math, fixedNumber } from '../../../Functions/math';
import PrintPosInvoice from './MarketInvoiceComponents/PrintPosInvoice';
import { Statistics } from '../../../components/antd';
import ShowDate from '../../SelfComponents/JalaliAntdComponents/ShowDate';
import InvoiceSummary from './Invoice/SalesInvoiceComponents/InvoiceSummary';
import CashPaymentTable from './Invoice/SalesInvoiceComponents/CashPaymentTable';
import { changeGToJ } from '../../../Functions/utcDate';
import { useGetCalender } from '../../../Hooks';

interface IProps {
  record: any;
  baseUrl: string;
  setVisible: (value: boolean) => void;
  type: string;
  title: string;
}
const dateFormat = 'YYYY-MM-DD';
const datePFormat = 'jYYYY/jM/jD';
const ReadonlyInvoiceItems = (props: IProps) => {
  const printRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posWithdraw, setPosWithdraw] = useState(0);
  const [couponTicket, setCouponTicket] = useState({});
  const [vipDiscount, setVipDiscount] = useState(0);
  const [headerData, setHeaderData] = useState([]);
  const [form] = Form.useForm();
  const [data, setData] = useState<any>([]);
  const [{ total, discount, expense, cashAmount }, setTotal] = useState({
    total: 0,
    discount: 0,
    expense: 0,
    cashAmount: 0,
  });
  const [cashPayment, setCashPayment] = useState([]);

  const showDrawer = () => {
    props.setVisible(false);
    setLoading(true);
    setVisible(true);
  };

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  const salesInvoiceType = props?.record?.sales_source;

  const globalColumns = useMemo(
    () => [
      {
        title: t('Table.Row').toUpperCase(),
        dataIndex: 'serial',
        align: 'center',
        width: 80,
        render: (_: any, __: any, index: number) => (
          <React.Fragment>{index + 1}</React.Fragment>
        ),
      },
      {
        title: t('Sales.Product_and_services.Product_id').toUpperCase(),
        dataIndex: 'id',
        fixed: 'left',
        width: 150,
        align: 'center',
        render: (text: { label: string }) =>
          salesInvoiceType === 'pos' ? text : text?.label,
      },
      {
        title: t('Sales.All_sales.Invoice.Product_name'),
        dataIndex: 'product',
        fixed: 'left',
        render: (text: { label: string }) =>
          salesInvoiceType === 'pos' ? text : text?.label,
      },
      {
        title: t('Sales.All_sales.Invoice.Quantity').toUpperCase(),
        dataIndex: 'qty',
        render: (text: any) => <Statistics value={text} />,
      },

      {
        title: t('Sales.Product_and_services.Units.Unit').toUpperCase(),
        dataIndex: 'unit',
        render: (text: any) => <React.Fragment>{text?.label}</React.Fragment>,
      },
    ],
    [salesInvoiceType, t],
  );

  const columns = useMemo(
    () => [
      ...globalColumns,
      {
        title: t('Warehouse.1').toUpperCase(),
        dataIndex: 'warehouse',
        render: (value: any) => value?.label,
      },
      {
        title: t('Sales.Product_and_services.Form.Price').toUpperCase(),
        dataIndex: 'each_price',
        render: (text: any) => {
          return <Statistics value={text} />;
        },
      },
      {
        title: t('Sales.Customers.Form.Total').toUpperCase(),
        dataIndex: 'total_price',
        render: (value: number) => value && <Statistics value={value} />,
      },

      {
        title: t('Discount_percent').toUpperCase(),
        dataIndex: 'discountPercent',
        render: (value: number) => value && <Statistics value={value} />,
      },
      {
        title: t('Sales.Customers.Discount.1').toUpperCase(),
        dataIndex: 'discount',
        render: (value: number) => value && <Statistics value={value} />,
      },
      {
        title: t(
          'Sales.Product_and_services.Inventory.Expiration_date',
        ).toUpperCase(),
        dataIndex: 'expirationDate',
        render: (value: any) => {
          const date =
            value && props.type !== 'sales' && value?.format(dateFormat);
          return date ? (
            date
          ) : (
            <ShowDate
              date={value}
              dateFormat={dateFormat}
              datePFormat={datePFormat}
            />
          );
        },
      },
      {
        title: t('Form.Description').toUpperCase(),
        dataIndex: 'description',
      },
    ],
    [globalColumns, props.type, t],
  );

  const productTransferColumns = useMemo(
    () => [
      ...globalColumns,

      {
        title: t(
          'Sales.Product_and_services.Inventory.Expiration_date',
        ).toUpperCase(),
        dataIndex: 'expirationDate',
        render: (value: any) =>
          value && (
            <ShowDate
              date={value}
              dateFormat={dateFormat}
              datePFormat={datePFormat}
            />
          ),
      },

      {
        title: t('Sales.All_sales.Invoice.Source_warehouse'),
        dataIndex: 'warehouse_out',
        render: (text: any) => text?.label,
      },

      {
        title: t('Sales.All_sales.Invoice.Destination_warehouse'),
        dataIndex: 'warehouse_in',
        render: (text: any) => text?.label,
      },
    ],
    [globalColumns, t],
  );

  const warehouseAdjustmentColumns = useMemo(
    () => [
      ...globalColumns,
      {
        title: t('Sales.Product_and_services.Form.Price').toUpperCase(),
        dataIndex: 'each_price',
        render: (value: any) => value && <Statistics value={value} />,
      },
      {
        title: t('Sales.Customers.Form.Total').toUpperCase(),
        dataIndex: 'total_price',
        render: (value: any) => value && <Statistics value={value} />,
      },
      {
        title: t(
          'Sales.Product_and_services.Inventory.Expiration_date',
        ).toUpperCase(),
        dataIndex: 'expirationDate',
        render: (value: any) =>
          value && (
            <ShowDate
              date={value}
              dateFormat={dateFormat}
              datePFormat={datePFormat}
            />
          ),
      },
      {
        title: t('Warehouse.1').toUpperCase(),
        dataIndex: 'warehouse',
        render: (value: any) => value?.label,
      },
      // {
      //   title: t("Sales.Product_and_services.Type").toUpperCase(),
      //   dataIndex: "type",
      //   render: (value: any) => value?.label,
      // },
    ],
    [globalColumns, t],
  );

  const handleAfterVisibleChange = async (visible: boolean) => {
    if (visible === false) {
      setLoading(false);
      form.resetFields();
      setData([]);
    } else {
      setLoading(true);
      const allData = await axiosInstance
        .get(
          `${props.baseUrl}${props?.record?.id}/?omit=created_by,customer.content_type,invoice_total,created,modified,
modified_by,order_invoice_finish,representative.content_type&expand=cash_payment.pay_by,
cash_payment.rec_by,cash_payment.currency,cash_payment.currency_calc,representative,
customer,currency,invoice_items.warehouse_out,invoice_items.warehouse_in,invoice_items.product.product_barcode
,invoice_items.product.product_barcode.unit,invoice_items.unit,invoice_items.product.product_units
,invoice_items.product.product_units.unit,invoice_items.product.price,invoice_items.product.price.unit
,invoice_items.product.unit_conversion,invoice_items.product.unit_conversion.unit`,
          { timeout: 0 },
        )
        .catch((error) => {
          setLoading(false);
          return error;
        });

      const data = allData?.data;

      if (props?.record?.sales_source === 'pos') {
        setPosWithdraw(data?.payment_summery?.expense_of_discount?.amount ?? 0);
        setCouponTicket({
          coupon_ticket: data?.coupon_ticket,
          id: props?.record?.id,
        });
        let vipDiscount = 0;
        const items = data?.invoice_items?.map((item: any) => {
          let each_price = item?.each_price;
          let total_price = item?.total_price;
          if (data?.vip_customer_card && item?.product?.is_have_vip_price) {
            const vipPrice = item?.product?.price?.find(
              (priceItem: any) => priceItem?.unit?.id === item?.unit?.id,
            );

            each_price = vipPrice?.sales_rate;
            total_price = vipPrice?.sales_rate * item?.qty;
          }
          vipDiscount = parseFloat(
            //@ts-ignore
            print(
              //@ts-ignore
              math.evaluate(
                `${vipDiscount}+(${total_price}-${item?.total_price})`,
              ),
            ),
          );
          return {
            ...item,
            product: item?.product?.name,
            unit: { value: item?.unit?.id, label: item?.unit?.name },
            expirationDate: item?.expire_date,
            vipPrice: parseFloat(item?.total_price),
            qty: parseFloat(item?.qty),
            each_price: parseFloat(each_price),
            total_price: parseFloat(total_price),
          };
        });
        setVipDiscount(vipDiscount);
        setData(items);
      } else {
        const adjustmentType = data?.invoice_items?.[0]?.warehouse_in
          ? t('Reports.Reward')
          : t('Reports.Waste');

        const newData = data?.invoice_items?.reduce(
          ({ items, totalOfItems, discount }: any, item: any) => {
            const totalPrice = parseFloat(
              //@ts-ignore
              print(
                //@ts-ignore
                math.evaluate(`${item?.each_price ?? 0} * ${item?.qty ?? 0}`),
              ),
            );

            const total = parseFloat(
              //@ts-ignore
              print(
                //@ts-ignore
                math.evaluate(`${totalOfItems ?? 0} + ${totalPrice ?? 0}`),
              ),
            );
            const newDiscount = parseFloat(
              //@ts-ignore
              print(
                //@ts-ignore
                math.evaluate(`${discount ?? 0} + ${item?.discount ?? 0}`),
              ),
            );

            const warehouse = Boolean(item?.warehouse_in)
              ? item?.warehouse_in
              : item?.warehouse_out;

            const expireDate =
              item?.expire_date && props?.type !== 'sales'
                ? calendarCode === 'gregory'
                  ? moment(item?.expire_date, dateFormat)
                  : dayjs(changeGToJ(item?.expire_date, dateFormat), {
                      //@ts-ignore
                      jalali: true,
                    })
                : item?.expire_date;

            const newItem = {
              ...item,
              total_price: totalPrice,
              id: { value: item?.product?.id, label: item?.product?.id },
              product: { value: item?.product?.id, label: item?.product?.name },
              unit: { value: item?.unit?.id, label: item?.unit?.name },
              expirationDate: expireDate,
              warehouse: {
                value: warehouse?.id,
                label: warehouse?.name,
              },
              warehouse_out: {
                value: item?.warehouse_out?.id,
                label: item?.warehouse_out?.name,
              },
              warehouse_in: {
                value: item?.warehouse_in?.id,
                label: item?.warehouse_in?.name,
              },
              discount: item?.discount ?? 0,
              discountPercent: parseFloat(
                //@ts-ignore
                print(
                  //@ts-ignore
                  math.evaluate(
                    `(100 * ${item?.discount ?? 0}) / ${totalPrice ?? 1}`,
                  ),
                ),
              ),
              type: adjustmentType,
            };
            return {
              items: [...items, newItem],
              totalOfItems: total,
              discount: newDiscount,
            };
          },
          { items: [], totalOfItems: 0, discount: 0 },
        );

        setData(newData?.items);
        setLoading(false);

        const filterData = [
          {
            label: t('Sales.All_sales.Invoice.Invoice_number'),
            value: props?.record?.id,
            name: 'id',
          },
          {
            label:
              props?.type === 'sales' ||
              props?.type === 'sales_rej' ||
              props?.type === 'quotation'
                ? t('Sales.Customers.Customer')
                : t('Expenses.Suppliers.Supplier'),
            value: props?.record?.customer?.content_object?.full_name,
            name: 'account',
          },
          // {
          //   label: t("Warehouse.1"),
          //   value: newData?.items?.[0]?.warehouse?.label,
          // },
          {
            label: t('Sales.Product_and_services.Status'),
            value: props?.record?.invoice_state,
          },
          {
            label: t('Sales.Product_and_services.Inventory.Currency'),
            value: props?.record?.currency?.name,
          },
          {
            label: t('Sales.Product_and_services.Currency.Currency_rate'),
            value: parseFloat(props?.record?.currency_rate),
          },
          {
            label: t('Sales.Customers.Form.Date'),
            name: 'date',
            value: <ShowDate date={props?.record?.date_time} />,
          },
        ];

        setHeaderData(
          //@ts-ignore
          props.type === 'productTransfer'
            ? filterData?.filter(
                (item) => item?.name === 'date' || item?.name === 'id',
              )
            : props.type === 'warehouseAdjustment'
              ? [
                  ...filterData?.filter(
                    (item) => item?.name === 'date' || item?.name === 'id',
                  ),
                  {
                    label: t('Invoice_type'),
                    value: adjustmentType,
                  },
                ]
              : filterData,
        );
        if (
          props?.type !== 'productTransfer' &&
          props?.type !== 'warehouseAdjustment'
        ) {
          const cashPayment = data?.cash_payment?.reduce(
            ({ items, cashAmount }: any, item: any) => {
              const newItem = {
                currency: { value: item?.currency?.id },
                currencySymbol: item?.currency?.symbol,
                amount: parseFloat(item?.amount),
                amount_calc: parseFloat(item?.amount_calc),
                currency_calc: { value: item?.currency_calc?.id },
                calCurrencySymbol: item?.currency_calc?.symbole,
                bank:
                  props?.type === 'sales' || props?.type === 'purchase_rej'
                    ? item?.rec_by?.name
                    : item?.pay_by?.name,
                key: item?.id,
              };

              const itemCashAmount = fixedNumber(
                print(
                  //@ts-ignore
                  math.evaluate(
                    `(${item?.currency_rate ?? 0} / ${
                      data?.currency_rate ?? 0
                    }) * ${item?.amount ?? 0}`,
                  ),
                ),
              );

              return {
                items: [...items, newItem],
                cashAmount: cashAmount + itemCashAmount,
              };
            },
            { items: [], cashAmount: 0 },
          );

          setCashPayment(cashPayment?.items);
          setTotal({
            total: parseFloat(newData?.totalOfItems),
            discount:
              parseFloat(data?.discount ?? 0) > 0
                ? parseFloat(data?.discount ?? 0)
                : parseFloat(newData?.discount),
            expense: parseFloat(data?.expense),
            cashAmount: cashPayment?.cashAmount,
          });
        }
      }
    }
  };

  const onClose = () => {
    setVisible(false);
  };

  const finalAmount = props?.record?.invoice_total;

  const remainAmount = useMemo(
    () =>
      fixedNumber(
        //@ts-ignore
        print(math.evaluate(`${finalAmount ?? 0} - ${cashAmount ?? 0}`)),
      ),
    [cashAmount, finalAmount],
  );

  const summary = useMemo(() => {
    const data = [
      [
        {
          label: t('Sales.Customers.Form.Total'),
          value: total,
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
            props.type === 'sales' || props.type === 'purchase_rej'
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
    return props.type === 'quotation' ? [data?.[0]] : data;
  }, [
    t,
    total,
    discount,
    expense,
    finalAmount,
    props.type,
    cashAmount,
    remainAmount,
  ]);

  const pageStyle = `@page{
    margin:0mm
  }`;
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    bodyClass: 'market_invoice',
    pageStyle: pageStyle,
  });

  return (
    <div ref={printRef}>
      <div onClick={showDrawer} className='num'>
        {t('Form.View')}
      </div>
      <Drawer
        maskClosable={false}
        mask={true}
        title={startCase(props?.title)}
        height='100%'
        onClose={onClose}
        open={visible}
        afterVisibleChange={handleAfterVisibleChange}
        destroyOnClose
        placement='top'
        footer={
          <Row justify='end'>
            <Col>
              <Space size='small'>
                <Button type='primary' ghost onClick={onClose}>
                  {t('Form.Close')}
                </Button>
                {props?.record?.sales_source === 'pos' && (
                  <Button
                    // shape="round"
                    type='primary'
                    ghost
                    onClick={() => handlePrint()}
                    icon={<PrinterOutlined />}
                    disabled={loading}
                  >
                    {t('Form.Print')}{' '}
                  </Button>
                )}
                {props?.type === 'sales' && (
                  <PrintInvoiceButton
                    disabled={!Boolean(props?.record?.id)}
                    title={startCase(t('Warehouse_remittance'))}
                    dataSource={data}
                    type='warehouseRemittance'
                    //@ts-ignore
                    summary={[]}
                    filters={headerData?.filter(
                      (item: any) =>
                        item?.name === 'date' || item?.name === 'account',
                    )}
                    cashPayment={[]}
                    id={props?.record?.id}
                    printText={t('Warehouse_remittance')}
                    isPrinted={true}
                  />
                )}
                <PrintInvoiceButton
                  disabled={!Boolean(props?.record?.id)}
                  title={startCase(props.title)}
                  dataSource={data}
                  type={props.type}
                  //@ts-ignore
                  summary={summary}
                  isPrinted={true}
                  filters={headerData}
                  cashPayment={cashPayment}
                  id={props?.record?.id}
                />
              </Space>
            </Col>
          </Row>
        }
      >
        <Spin spinning={loading} size='large'>
          <Typography.Title level={5}>
            {t('Custom_form_styles.Header')}
          </Typography.Title>
          <Space direction='vertical' size='large'>
            <Descriptions
              bordered
              size='small'
              style={styles.header}
              labelStyle={styles.headerLabel}
              column={1}
            >
              {props?.type !== 'productTransfer' &&
                props?.type !== 'warehouseAdjustment' && (
                  <React.Fragment>
                    <Descriptions.Item
                      label={
                        props.type === 'sales' ||
                        props.type === 'sales_rej' ||
                        props.type === 'quotation'
                          ? t('Sales.Customers.Customer')
                          : t('Expenses.Suppliers.Supplier')
                      }
                    >
                      {props?.record?.customer?.content_object?.full_name}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('Warehouse.1')}>
                      {data?.[0]?.warehouse?.label}
                    </Descriptions.Item>

                    {props?.type === 'sales' && (
                      <Descriptions.Item label={t('Representative')}>
                        {
                          props?.record?.representative?.content_object
                            ?.full_name
                        }
                      </Descriptions.Item>
                    )}
                    <Descriptions.Item
                      label={t('Sales.Product_and_services.Status')}
                    >
                      {props?.record?.invoice_state}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={t('Sales.Product_and_services.Inventory.Currency')}
                    >
                      {props?.record?.currency?.name}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={t(
                        'Sales.Product_and_services.Currency.Currency_rate',
                      )}
                    >
                      {parseFloat(props?.record?.currency_rate)}
                    </Descriptions.Item>
                  </React.Fragment>
                )}

              {props?.type === 'warehouseAdjustment' && (
                <Descriptions.Item label={t('Invoice_type')}>
                  {data?.[0]?.type}
                </Descriptions.Item>
              )}
              <Descriptions.Item
                label={t('Sales.All_sales.Invoice.Date_and_time')}
              >
                <ShowDate date={props?.record?.date_time} />
              </Descriptions.Item>
              <Descriptions.Item label={t('Form.Description')}>
                {props?.record?.description}
              </Descriptions.Item>
            </Descriptions>
            <div>
              <Typography.Title level={5}>
                {t('Sales.All_sales.Invoice.Invoice_items')}
              </Typography.Title>
              <Table
                bordered
                dataSource={data}
                rowKey={(record: any) => record.id}
                //@ts-ignore
                columns={
                  props?.type === 'productTransfer'
                    ? productTransferColumns
                    : props?.type === 'warehouseAdjustment'
                      ? warehouseAdjustmentColumns
                      : columns
                }
                pagination={false}
                scroll={{
                  x: 'max-content',
                  scrollToFirstRowOnChange: true,
                }}
                size='small'
              />
            </div>
            {props?.type !== 'productTransfer' &&
              props?.type !== 'warehouseAdjustment' && (
                <Row justify='space-between'>
                  <Col style={styles.cashPayment}>
                    {props?.type !== 'quotation' && (
                      <>
                        <CashPaymentTable
                          {...{
                            dataSource: cashPayment,
                            type: props?.type,
                          }}
                        />
                      </>
                    )}
                  </Col>

                  <Col style={styles.total}>
                    <Typography.Title level={5}>
                      {t('Invoice_total')}
                    </Typography.Title>
                    <InvoiceSummary
                      {...{
                        type: props?.type,
                        discount: discount,
                        expense: expense,
                        total: total,
                        finalAmount: props?.record?.invoice_total,
                        cashAmount: cashAmount,
                        remainAmount: remainAmount,
                        // cashCurrency: cash_fin?.currency?.symbol,
                      }}
                    />
                  </Col>
                </Row>
              )}
          </Space>
        </Spin>
      </Drawer>
    </div>
  );
};

const styles = {
  total: { width: '250px' },
  cashPayment: { width: '500px' },
  header: {
    width: '500px',
  },
  headerLabel: { width: '140px' },
};

export default ReadonlyInvoiceItems;
