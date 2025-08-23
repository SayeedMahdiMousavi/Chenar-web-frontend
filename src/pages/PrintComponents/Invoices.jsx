import React, { useMemo } from 'react';
import {
  Row,
  Col,
  Table,
  Image,
  Typography,
  Descriptions,
  Divider,
} from 'antd';
import PrintComponent from './Print';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useGetCompanyInfo, useGetUserInfo } from '../../Hooks';
import { DefaultLogo } from '../../components';
import { Statistics } from '../../components/antd';
import CashPaymentTable from '../sales/AllSales/Invoice/SalesInvoiceComponents/CashPaymentTable';
import ShowDate from '../SelfComponents/JalaliAntdComponents/ShowDate';

const dateFormat = 'YYYY-MM-DD';
const datePFormat = 'jYYYY/jM/jD';
const { Title } = Typography;
const PrintInvoices = (props) => {
  const { t } = useTranslation();

  //get company information
  const { data } = useGetCompanyInfo();

  //get user information
  const useInfo = useGetUserInfo();

  const BodyTable = (props) => {
    return <thead {...props} style={{ fontSize: '11px' }} />;
  };

  const components = {
    header: {
      wrapper: BodyTable,
    },
  };

  const globalColumns = useMemo(
    () => [
      {
        title: t('Table.Row').toUpperCase(),
        dataIndex: 'serial',
        align: 'center',
        render: (_, __, index) => index + 1,
      },
      // {
      //   title: t("Sales.Product_and_services.Product_id").toUpperCase(),
      //   dataIndex: "id",
      //   render: (value) => value?.value,
      // },
      {
        title: t('Sales.All_sales.Invoice.Product_name'),
        dataIndex: 'product',
        render: (value) => value?.label,
      },
      {
        title: t('Sales.All_sales.Invoice.Quantity').toUpperCase(),
        dataIndex: 'qty',
        render: (value) => <Statistics value={value} />,
      },
      {
        title: t('Sales.Product_and_services.Units.Unit').toUpperCase(),
        dataIndex: 'unit',
        render: (value) => value?.label,
      },
    ],
    [t],
  );

  const columns = useMemo(() => {
    const data = [
      ...globalColumns,
      {
        title: t('Warehouse.1').toUpperCase(),
        dataIndex: 'warehouse',
        render: (value) => value?.label,
      },

      {
        title: t('Sales.Product_and_services.Form.Price').toUpperCase(),
        dataIndex: 'each_price',
        render: (value) => value && <Statistics value={value} />,
      },
      {
        title: t('Sales.Customers.Form.Total').toUpperCase(),
        dataIndex: 'total_price',
        render: (value) => value && <Statistics value={value} />,
      },
      // {
      //   title: t("Discount_percent").toUpperCase(),
      //   dataIndex: "discountPercent",
      //   render: (value) => value && <Statistics value={value} />,
      // },
      {
        title: t('Sales.Customers.Discount.1').toUpperCase(),
        dataIndex: 'discount',
        render: (value) => value && <Statistics value={value} />,
      },
      {
        title: t('Final_amount').toUpperCase(),
        dataIndex: 'finalAmount',
        render: (value, record) => (
          <Statistics
            value={
              parseFloat(record?.total_price) - parseFloat(record?.discount)
            }
          />
        ),
      },
      {
        title: t(
          'Sales.Product_and_services.Inventory.Expiration_date',
        ).toUpperCase(),
        dataIndex: 'expirationDate',
        render: (value) => {
          if (
            value &&
            props?.type !== 'sales' &&
            props?.type !== 'warehouseRemittance'
          ) {
            return value?.format(dateFormat);
          } else {
            return (
              value && (
                <ShowDate
                  date={value}
                  dateFormat={dateFormat}
                  datePFormat={datePFormat}
                />
              )
            );
          }
        },
      },
      {
        title: t('Form.Description').toUpperCase(),
        dataIndex: 'description',
      },
    ];
    return data;
  }, [globalColumns, t, props.type]);

  const warehouseRemittanceColumns = useMemo(
    () => [
      ...globalColumns,
      {
        title: t('Warehouse.1').toUpperCase(),
        dataIndex: 'warehouse',
        render: (value) => value?.label,
      },
      {
        title: t(
          'Sales.Product_and_services.Inventory.Expiration_date',
        ).toUpperCase(),
        dataIndex: 'expirationDate',
        render: (value) => {
          if (
            value &&
            props.type !== 'sales' &&
            props.type !== 'warehouseRemittance'
          ) {
            return value?.format(dateFormat);
          } else {
            return (
              value && (
                <ShowDate
                  date={value}
                  dateFormat={dateFormat}
                  datePFormat={datePFormat}
                />
              )
            );
          }
        },
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
        render: (value) =>
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
        render: (text) => text?.label,
      },

      {
        title: t('Sales.All_sales.Invoice.Destination_warehouse'),
        dataIndex: 'warehouse_in',
        render: (text) => text?.label,
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
        render: (value) => value && <Statistics value={value} />,
      },
      {
        title: t('Sales.Customers.Form.Total').toUpperCase(),
        dataIndex: 'total_price',
        render: (value) => value && <Statistics value={value} />,
      },
      {
        title: t(
          'Sales.Product_and_services.Inventory.Expiration_date',
        ).toUpperCase(),
        dataIndex: 'expirationDate',
        render: (value) =>
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
        render: (value) => value?.label,
      },
      // {
      //   title: t("Sales.Product_and_services.Type").toUpperCase(),
      //   dataIndex: "type",
      //   render: (value) => value?.label,
      // },
    ],
    [globalColumns, t],
  );

  const getPageMargins = () => {
    return `@page { margin: 4mm 7mm !important; }`;
  };

  return (
    <PrintComponent ref={props.printRef}>
      <div>
        <div className='page-footer' style={{ pageBreakAfter: 'always' }}>
          <Row
            justify='center'
            align='middle'
            style={{ width: '100%', height: '100%' }}
          >
            <Col>
              {' '}
              {t(
                'Sales.All_sales.Invoice.Chanar_accounting_product_of_microcis',
              )}{' '}
            </Col>
            {/* <Col span={8} style={{ textAlign: "center" }}>
              <span className="page-number">
                <span className="pageCounter"></span>
              </span>
            </Col>
            <Col span={8}></Col> */}
          </Row>
        </div>
        <table>
          <thead>
            <tr>
              <td>
                <div className='page-header-space'></div>
                <style>{getPageMargins()}</style>
              </td>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                <div>
                  <Row>
                    <Col span={9}>
                      <Descriptions
                        layout='horizontal'
                        style={{ width: '100%', paddingTop: '40px' }}
                        column={1}
                        size='small'
                      >
                        {props?.filters?.map((item) => (
                          <Descriptions.Item
                            label={item?.label}
                            key={item?.label}
                          >
                            {item?.value}
                          </Descriptions.Item>
                        ))}
                      </Descriptions>
                    </Col>

                    <Col span={6}>
                      <Row justify='center'>
                        <Col>
                          {data?.logo ? (
                            <Image
                              width={90}
                              src={data?.logo}
                              style={{
                                maxHeight: '90px',
                                marginBottom: '5px',
                              }}
                              fallback='data:image/png;base64,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'
                            />
                          ) : (
                            <DefaultLogo size={65} />
                          )}
                        </Col>
                      </Row>
                      <Row justify='center'>
                        <Col style={{ textAlign: 'center' }}>
                          <Title level={4} style={{ marginBottom: '0px' }}>
                            {props.title}
                          </Title>
                          {props?.isPrinted ? t('Reprinting') : ''}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={9}>
                      <Row justify='end'>
                        <Col>
                          <Descriptions
                            layout='horizontal'
                            style={
                              t('Dir') === 'ltr'
                                ? { width: '215px', paddingTop: '40px' }
                                : { width: '210px', paddingTop: '40px' }
                            }
                            column={1}
                            size='small'
                          >
                            <Descriptions.Item
                              label={t('Sales.All_sales.Invoice.Date_and_time')}
                            >
                              <ShowDate
                                date={moment().format('YYYY-MM-DD HH:mm')}
                              />
                            </Descriptions.Item>
                            <Descriptions.Item label={t('Form.Printed_by')}>
                              {useInfo?.data?.username}
                            </Descriptions.Item>
                          </Descriptions>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={24} style={{ padding: '30px 0px' }}>
                      <Typography.Title level={5}>
                        {t('Sales.All_sales.Invoice.Invoice_items')}
                      </Typography.Title>
                      <Table
                        dataSource={props?.dataSource}
                        pagination={false}
                        columns={
                          props?.type === 'productTransfer'
                            ? productTransferColumns
                            : props?.type === 'warehouseAdjustment'
                              ? warehouseAdjustmentColumns
                              : props?.type === 'warehouseRemittance'
                                ? warehouseRemittanceColumns
                                : columns
                        }
                        // tableLayout="fixed"
                        rowClassName={() => 'print-table-column'}
                        bordered
                        size='small'
                        components={components}
                        style={{ width: '100%' }}
                      >
                        {props?.domColumns}
                      </Table>
                    </Col>
                  </Row>
                  {props?.type !== 'productTransfer' &&
                    props?.type !== 'warehouseRemittance' &&
                    props?.type !== 'warehouseAdjustment' && (
                      <Row justify='space-between' className='page-break'>
                        <Col style={{ width: '400px' }}>
                          {props?.type !== 'quotation' && (
                            <CashPaymentTable
                              dataSource={props?.cashPayment}
                              type={props?.type}
                            />
                          )}
                        </Col>
                        <Col style={{ width: '270px' }}>
                          <Typography.Title level={5}>
                            {t('Invoice_total')}
                          </Typography.Title>
                          {props?.summary?.map((section, index) => (
                            <Descriptions
                              layout='horizontal'
                              style={{
                                paddingTop: index === 0 ? '0px' : '10px',
                              }}
                              column={{
                                xxl: 1,
                                xl: 1,
                                lg: 1,
                                md: 1,
                                sm: 1,
                                xs: 1,
                              }}
                              size='small'
                              bordered
                              labelStyle={styles.descriptionLabel}
                              contentStyle={styles.descriptionContent}
                              key={index}
                            >
                              {section?.map((item, index) => (
                                <Descriptions.Item
                                  label={item?.label}
                                  key={item?.label}
                                  contentStyle={
                                    index === section?.length - 1
                                      ? styles.total
                                      : {}
                                  }
                                  labelStyle={
                                    index === section?.length - 1
                                      ? styles.total
                                      : {}
                                  }
                                >
                                  <Statistics value={item?.value} />
                                </Descriptions.Item>
                              ))}
                            </Descriptions>
                          ))}
                        </Col>
                      </Row>
                    )}

                  {props?.type !== 'productTransfer' &&
                    props?.type !== 'quotation' &&
                    props?.type !== 'warehouseAdjustment' && (
                      <div
                        className='page-break'
                        style={{ paddingTop: '10px' }}
                      >
                        <Divider />
                        <Row>
                          <Col span={12} style={{ textAlign: 'center' }}>
                            {t('Sales.All_sales.Invoice.Seller_signature')}
                          </Col>
                          <Col span={12} style={{ textAlign: 'center' }}>
                            {t('Sales.All_sales.Invoice.Buyer_signature')}
                          </Col>
                        </Row>
                      </div>
                    )}
                </div>
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td>
                <div className='page-footer-space'></div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </PrintComponent>
  );
};

const styles = {
  descriptionLabel: { width: '135px' },
  descriptionContent: { textAlign: 'end', padding: '8px 10px' },
  total: { fontWeight: 'bold' },
};

export default PrintInvoices;
