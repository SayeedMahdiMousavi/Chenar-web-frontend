import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Row, Col, Space, Divider, Image } from 'antd';
import {QRCodeSVG} from 'qrcode.react';
import MarketInvoiceItem from '../../sales/AllSales/MarketInvoiceComponents/MarketInvoiceItem';
import moment from 'moment';
import ShowDate from '../../SelfComponents/JalaliAntdComponents/ShowDate';
import { DefaultLogo } from '../../../components';

const Content = (props) => {
  const { t, i18n } = useTranslation();
  const data = [
    {
      name: t('Soft_drinks'),
      defaultUnit: t('Package'),
      number: '5',
      totalPrice: 300,
      price: '60',
    },
    {
      name: t('Cake'),
      defaultUnit: t('Seed'),
      number: '50',
      totalPrice: 500,
      price: '10',
    },
  ];
  return (
    <Row justify='center'>
      <Col
        style={{ width: '280px', padding: '20px' }}
        className='custom_form_style_pdf'
      >
        <Row>
          <Col span={24}>
            {props?.edit?.showLogo && (
              <Row justify='center'>
                <Col>
                  {props?.data?.logo ? (
                    <Image
                      width={props?.edit?.logoSize}
                      height={props?.edit?.logoSize}
                      preview={false}
                      src={props?.data?.logo}
                      fallback='data:image/png;base64,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'
                    />
                  ) : (
                    <DefaultLogo size={props?.edit?.logoSize} />
                  )}
                  {/* <Avatar
                    size={props?.edit?.logoSize}
                    src={`${props?.data?.logo}`}
                    shape="square"
                  /> */}
                </Col>
              </Row>
            )}
            {props.edit.titleShow && (
              <Row justify='center'>
                <Col>
                  <Typography.Title
                    level={props.edit.titleLevel}
                    style={{ margin: '0px' }}
                  >
                    {i18n.language === 'en'
                      ? props?.data?.en_name
                      : i18n.language === 'fa'
                      ? props?.data?.fa_name
                      : props?.data?.ps_name}
                  </Typography.Title>
                </Col>
              </Row>
            )}
            {props.edit.slogan && (
              <Row justify='center'>
                <Col
                  span={24}
                  className='market_invoice_description text_align_center'
                >
                  {props?.data?.slogan}
                </Col>
              </Row>
            )}

            {props?.data?.address?.address_list?.map((item, index) => (
              <Row key={index} style={index === 0 && styles.rowSpace}>
                <Col
                  span={24}
                  className='market_invoice_address text_align_center'
                >
                  {/* {props?.edit?.address?.includes(index + 1)
                    ? item?.fa_name
                    : null}{" "} */}
                  {/* {props?.edit?.address?.includes(index + 1) && ":"} */}
                  {props?.edit?.address?.includes(index + 1)
                    ? item?.address_place
                    : null}
                </Col>
              </Row>
            ))}

            {props?.edit?.phone?.length !== 0 && (
              <Row justify='center'>
                <Col className='market_invoice_description'>
                  {props?.edit?.phone?.includes(1) &&
                  props?.data?.mobile?.mobile_list?.[0]
                    ? props?.data?.mobile?.mobile_list?.[0]
                    : null}
                  {props?.edit?.phone?.includes(1) &&
                  props?.edit?.phone?.includes(2) &&
                  props?.data?.mobile?.mobile_list?.[0] &&
                  props?.data?.mobile?.mobile_list?.[1]
                    ? '-'
                    : null}
                  {props?.edit?.phone?.includes(2) &&
                    props?.data?.mobile?.mobile_list?.[1]}{' '}
                  {props?.edit?.phone?.includes(2) &&
                  props?.edit?.phone?.includes(3) &&
                  props?.data?.mobile?.mobile_list?.[1] &&
                  props?.data?.mobile?.mobile_list?.[3]
                    ? '-'
                    : null}
                  {props?.edit?.phone?.includes(3) &&
                    props?.data?.mobile_list?.[2]}
                </Col>
              </Row>
            )}
            <Row justify='center'>
              <Col className='market_invoice_description text_align_center'>
                {t('Sales.All_sales.Invoice.Product_change_message')}
              </Col>
            </Row>
            <Row justify='center' style={styles.rowSpace}>
              <Col
                span={24}
                className='market_invoice_description text_align_center'
              >
                {t('Sales.All_sales.Invoice.Factor_number')} : 12
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider
          dashed={true}
          style={{ margin: '5px', background: 'black' }}
          className='invoice_divider'
        />
        <Row>
          <Col span={24}>
            <table style={{ width: '100%' }}>
              <thead className='market_invoice_table_header'>
                <th className='table_column_title' style={{ width: '40%' }}>
                  {t('Form.Name')}
                </th>
                <th
                  className='table_column_title text_align_center'
                  style={{ width: '30%' }}
                >
                  {t('Sales.All_sales.Invoice.Qty')}
                </th>
                <th
                  className='table_column_title text_align_center'
                  style={{ width: '15%' }}
                >
                  {t('Sales.Product_and_services.Form.Price')}
                </th>
                <th
                  className='table_column_title text_align_center'
                  style={{ width: '15%' }}
                >
                  {t('Sales.All_sales.Invoice.Total')}
                </th>
              </thead>
              <tbody>
                {data?.map((item) => (
                  <tr key={item.id}>
                    <td className='table_column_title'>{item.name}</td>
                    <td className='table_column_title text_align_center'>
                      {' '}
                      {item.number}
                      &nbsp;
                      {item?.defaultUnit}
                    </td>
                    <td className='table_column_title text_align_center'>
                      {item.price}؋
                    </td>
                    <td className='table_column_title text_align_center'>
                      {item.totalPrice}؋
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Divider
              dashed={true}
              style={{ margin: '5px', background: 'black' }}
              className='invoice_divider'
            />

            <Row gutter={[0, 5]}>
              <Col span={24}>
                <MarketInvoiceItem
                  break={false}
                  name={t('Sales.Customers.Form.Total')}
                  value='800؋'
                  className='market_invoice_total_payable'
                />
              </Col>

              <Col span={24}>
                <MarketInvoiceItem break={false} />
                <Row justify='space-between'>
                  <Col span={17} className='text_align_end'>
                    <span className='market_invoice_description'>
                      {t('Sales.All_sales.Invoice.Discount')}
                    </span>
                  </Col>

                  <Col className='market_invoice_description'>20؋</Col>
                </Row>
                <Row justify='end'>
                  <Col span={20}>
                    <Divider
                      style={{ margin: '2px', background: 'black' }}
                      className='invoice_divider'
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row justify='space-between'>
                  <Col
                    span={17}
                    className='market_invoice_total_payable text_align_end'
                  >
                    {t('Sales.All_sales.Invoice.Pure_bell')}
                  </Col>

                  <Col className='market_invoice_total_payable'> 780؋</Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row justify='space-between'>
                  <Col
                    span={17}
                    className='market_invoice_description text_align_end'
                  >
                    {t('Sales.All_sales.Invoice.Pay_by_anar_pay')}
                  </Col>

                  <Col className='market_invoice_description'> 100؋</Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row justify='end'>
                  <Col span={20}>
                    <Divider
                      style={{ margin: '2px', background: 'black' }}
                      className='invoice_divider'
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row justify='space-between'>
                  <Col
                    span={17}
                    className='market_invoice_total_payable text_align_end'
                  >
                    {t('Employees.Pay_cash')}
                  </Col>

                  <Col className='market_invoice_total_payable'> 680؋</Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          {props.edit.showQr && (
            <Col span={24}>
              <br />
              <Row>
                <Col span={24}>
                  <Row justify='space-between' align='middle' gutter={10}>
                    <Col span={18}>
                      <Space size='small' direction='vertical'>
                        {props.edit.showQr && (
                          <Typography.Paragraph
                            style={styles.divider}
                            className='market_invoice_note'
                          >
                            {props.edit.qrMessage}
                          </Typography.Paragraph>
                        )}
                        <Row
                          gutter={5}
                          style={{ paddingInlineEnd: '5px' }}
                          // justify="center"
                        >
                          {props.edit.appStore && (
                            <Col span={12}>
                              <img
                                src='/images/appStore.png'
                                alt='app store'
                                width='100%'
                              ></img>
                            </Col>
                          )}
                          {props.edit.googlePlay && (
                            <Col span={12}>
                              <img
                                src='/images/googlePlay.png'
                                alt='app store'
                                width='100%'
                              ></img>
                            </Col>
                          )}
                        </Row>
                      </Space>
                    </Col>

                    <Col>
                      <QRCodeSVG
                        style={{ width: '50px', height: '50px' }}
                        value={
                          props?.edit?.qrValue ? props?.edit?.qrValue : 'ticket'
                        }
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          )}
          {props.edit.notes && (
            <Col
              span={24}
              className='market_invoice_description text_align_center'
            >
              <br />
              {props.edit.notesMessage}
            </Col>
          )}
          {props.edit.ticket && (
            <Col
              span={24}
              className='market_invoice_note'
              // style={{ marginTop: "22px" }}
            >
              <Divider dashed={true} style={{ backgroundColor: 'lightGray' }} />
              <Row gutter={10} align='middle' justify='space-between'>
                <Col span={16}>
                  <Typography.Paragraph style={styles.divider}>
                    {props.edit.ticketMessage}
                  </Typography.Paragraph>{' '}
                </Col>
                <Col>
                  {' '}
                  <QRCodeSVG
                    style={{ width: '70px', height: '70px' }}
                    value={'ticket'}
                  />
                </Col>
              </Row>
            </Col>
          )}

          <Col span={24} className='invoice_footer'>
            <br />
            <Row>
              <Col>{t('Sales.All_sales.Invoice.Chanar_accounting')} :</Col>
            </Row>
            <Row justify='space-between' gutter={5}>
              <Col>{t('Sales.All_sales.Invoice.Product_of_microcis')} </Col>
              <Col>
                <ShowDate
                  date={moment().format('YYYY-MM-DD')}
                  // date={moment().format("LT")}
                  dateFormat='YYYY/MM/DD'
                  datePFormat='jYYYY/jM/jD'
                />{' '}
                &nbsp; | &nbsp;
                <ShowDate
                  date={moment().format('YYYY-MM-DD HH:mm')}
                  // date={moment().format("l")}
                  dateFormat='HH:mm'
                  datePFormat='HH:mm'
                />
                &nbsp; | &nbsp;CAC 500
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

const styles = {
  rowSpace: { marginTop: '8px' },
  divider: { textAlign: 'justify', marginBottom: '0px' },
};
export default Content;
