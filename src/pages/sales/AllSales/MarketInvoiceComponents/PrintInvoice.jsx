import React from 'react';
import { Typography, Row, Col, Space, Divider, Image } from 'antd';
import { QRCodeSVG } from 'qrcode.react';
import parse from 'html-react-parser';
import moment from 'moment';
import MarketInvoiceItem from './MarketInvoiceItem';
import { fixedNumber, math, print } from '../../../../Functions/math';
import { arabicToIndian } from '../../../../Functions/arabicToIndian';
import ShowDate from '../../../SelfComponents/JalaliAntdComponents/ShowDate';

class PrintInvoice extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      loaded: false,
    };
  }

  render() {
    const getPageMargins = () => {
      return `@page { margin: -4mm 0mm !important; }`;
    };
    return (
      <div dir={this.props.language} className='num'>
        <style>{getPageMargins()}</style>.
        {this.props?.edit?.logo?.logo_show && (
          <Row justify='center'>
            <Col>
              <Image
                width={this?.props?.edit?.logo?.size}
                height={this?.props?.edit?.logo?.size}
                preview={false}
                src={this.props?.company?.logo}
                fallback='data:image/png;base64,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'
              />
              {/* <Avatar
                size={this?.props?.edit?.logo?.size}
                src={`${this.props?.company?.logo}`}
                shape="square"
              /> */}
            </Col>
          </Row>
        )}
        {this?.props?.edit?.company_name?.company_show && (
          <Row justify='center'>
            <Col>
              <Typography.Title
                level={this?.props?.edit?.company_name?.size_level}
                style={styles.margin}
              >
                {this.props.language === 'en'
                  ? this?.props?.company?.en_name
                  : this.props.language === 'fa'
                    ? this?.props?.company?.fa_name
                    : this?.props?.company?.ps_name}
              </Typography.Title>
            </Col>
          </Row>
        )}
        {this?.props?.edit?.slogan?.slogan_show && (
          <Row justify='center'>
            <Col
              span={24}
              style={{ ...styles.descriptionBody, textAlign: 'center' }}
            >
              {this?.props?.company?.slogan}
            </Col>
          </Row>
        )}
        {this.props.company?.address?.address_list?.map((item, index) => (
          <Row key={index} style={index === 0 && styles.rowSpace}>
            <Col span={24} style={{ ...styles.address, textAlign: 'center' }}>
              {/* {this.props?.edit?.address?.address_list?.includes(index + 1)
                ? item?.fa_name
                : null}
              {this.props?.edit?.address?.address_list?.includes(index + 1) &&
                " : "} */}
              {this.props?.edit?.address?.address_list?.includes(index + 1)
                ? item?.address_place
                : null}
            </Col>
          </Row>
        ))}
        {this?.props?.edit?.mobile?.mobile_list?.length !== 0 && (
          <Row justify='center'>
            <Col style={styles.descriptionBody}>
              {this?.props?.edit?.mobile?.mobile_list?.includes(1) &&
              this?.props?.company?.mobile?.mobile_list?.[0]
                ? this?.props?.company?.mobile?.mobile_list?.[0]
                : null}
              {this?.props?.edit?.mobile?.mobile_list?.includes(1) &&
              this?.props?.edit?.mobile?.mobile_list?.includes(2) &&
              this.props?.company?.mobile?.mobile_list?.[0] &&
              this.props?.company?.mobile?.mobile_list?.[1]
                ? '-'
                : null}
              {this?.props?.edit?.mobile?.mobile_list?.includes(2) &&
              this?.props?.company?.mobile?.mobile_list?.[1]
                ? this?.props?.company?.mobile?.mobile_list?.[1]
                : null}
              {this?.props?.edit?.mobile?.mobile_list?.includes(2) &&
              this?.props?.edit?.mobile?.mobile_list?.includes(3) &&
              this.props?.company?.mobile?.mobile_list?.[1] &&
              this.props?.company?.mobile?.mobile_list?.[2]
                ? '-'
                : null}
              {this?.props?.edit?.mobile?.mobile_list?.includes(3) &&
              this?.props?.company?.mobile?.mobile_list?.[2]
                ? this?.props?.company?.mobile?.mobile_list?.[2]
                : null}
            </Col>
          </Row>
        )}
        <Row justify='center'>
          <Col style={styles.descriptionBody}>
            {this?.props?.locals?.Product_change_message}
          </Col>
        </Row>
        <Row justify='center' style={styles.rowSpace}>
          <Col
            span={24}
            style={{ ...styles.descriptionBody, textAlign: 'center' }}
          >
            {this?.props?.locals?.factorNumber} : {this?.props?.response?.id}
            {this?.props?.locals?.edit && `(${this?.props?.locals?.edit})`}
            {/* {"بیل در وجه "}

            {this?.props?.customerData?.user?.firstName
              ? `${this?.props?.customerData?.user?.firstName}
                  ${this?.props?.customerData?.user?.lastName}`
              : "مشتری متفرقه"} */}
          </Col>
        </Row>
        {/* )} */}
        <Divider dashed={true} style={styles.divider1} />
        <table>
          <thead>
            <th style={{ ...styles.tableColumn, ...styles.tableHeaderName }}>
              {this.props.locals.name}
            </th>
            <th style={{ ...styles.tableColumn, ...styles.tableHeaderQty }}>
              {this.props.locals.qty}
            </th>
            <th style={{ ...styles.tableColumn, ...styles.tableHeaderPrice }}>
              {this.props.locals.price}
            </th>
            <th
              style={{ ...styles.tableColumn, ...styles.totalTableHeaderPrice }}
            >
              {this.props.locals.totalPrice}
            </th>
          </thead>
          <tbody>
            {this.props?.data?.map((item) => (
              <tr key={item?.id}>
                <td style={styles.tableColumn}>{item?.product}</td>
                <td style={{ ...styles.tableColumn, textAlign: 'center' }}>
                  <b>{fixedNumber(item?.qty, 3)}</b>
                  {/* &nbsp;
                  <span style={styles.unit}>{item?.unit?.label}</span> */}
                </td>
                <td
                  // style={{ textAlign: "center" }}
                  style={{ ...styles.tableColumn, ...styles.tablePrice }}
                >
                  {item?.each_price ? fixedNumber(item?.each_price, 0) : 0}؋
                </td>
                <td
                  style={{ ...styles.tableColumn, ...styles.totalTablePrice }}
                >
                  <Space
                    direction='vertical'
                    style={{ width: 'fit-content', margin: ' 0 auto 0 0' }}
                    size={-4}
                  >
                    <span>
                      {item?.total_price
                        ? fixedNumber(item?.total_price, 0)
                        : 0}
                      ؋
                    </span>
                    {item?.total_price - item?.vipPrice > 0.9 && (
                      <div
                        style={{
                          fontSize: '8px',
                          textAlign: 'center',
                        }}
                      >
                        {item?.total_price - item?.vipPrice}-
                      </div>
                    )}
                  </Space>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Divider dashed={true} style={styles.divider1} />
        <Row>
          <Col span={24}>
            <MarketInvoiceItem
              break={false}
              // name={"مجموعه"}
              name={this.props.locals.total}
              value={`${fixedNumber(this.props.totalPrice, 1)}؋`}
            />
          </Col>

          <Col span={24}>
            <MarketInvoiceItem break={false} />
            {/* {this?.props?.vipDiscount > 0 && ( */}
            <Row justify='space-between'>
              <Col span={17} style={{ textAlign: 'end' }}>
                <span style={styles.descriptionBody}>
                  {this.props.locals.discount}
                </span>
              </Col>

              <Col style={styles.descriptionBody}>
                {fixedNumber(this?.props?.vipDiscount, 0)}؋
              </Col>
            </Row>
            {/* )} */}
          </Col>
          <Col span={24}>
            {/* <MarketInvoiceItem break={false} />
            {this?.props?.discount > 0 && (
              <Row justify="space-between">
                <Col span={17} className="text_align_end">
                  <span className="market_invoice_description_title">
                    {this.props.locals.discount}
                  </span>
                  {this?.props?.customerData?.card?.cardDiscountType && (
                    <span className="market_invoice_discount_type">
                      (
                      {this?.props?.customerData?.card?.cardDiscountType ===
                        "ANAR_SHARE" && "Anar share"}
                      )
                    </span>
                  )}
                </Col>

                <Col className="market_invoice_description">
                  {fixedNumber(this?.props?.discount, 1)}؋
                </Col>
              </Row>
            )} */}
            <Row justify='end'>
              <Col span={20}>
                <Divider style={{ ...styles.divider1, width: '80%' }} />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row justify='space-between'>
              <Col span={17} style={styles.payableTotal}>
                {this.props.locals.pureBell}
              </Col>

              <Col style={styles.payableTotal}>
                {fixedNumber(
                  print(
                    math.evaluate(
                      `${this?.props?.totalPrice}-${this?.props?.vipDiscount}`,
                    ),
                  ),
                  2,
                )}
                ؋
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <MarketInvoiceItem break={false} />

            <Row justify='space-between'>
              <Col span={17} style={{ textAlign: 'end' }}>
                <span style={styles.descriptionBody}>
                  {this.props.locals.payByAnarPay}
                </span>
              </Col>

              <Col style={styles.descriptionBody}>
                {fixedNumber(this?.props?.discount, 1)}؋
              </Col>
            </Row>

            <Row justify='end'>
              <Col span={20}>
                <Divider style={{ ...styles.divider1, width: '80%' }} />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row justify='space-between'>
              <Col span={17} style={styles.payableTotal}>
                {this.props.locals.payCash}
              </Col>

              <Col style={styles.payableTotal}>
                {
                  // this.props.totalPrice &&
                  //   this.props.vipDiscount &&
                  //   this.props.discount &&
                  fixedNumber(
                    print(
                      math.evaluate(
                        `${this?.props?.totalPrice}-(${this?.props?.vipDiscount}+${this?.props?.discount})`,
                      ),
                    ),
                    2,
                  )
                }
                ؋
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            {this?.props?.edit?.qr_code?.qr_show && (
              <Row>
                <Col span={24}>
                  <br />
                  <br />
                  <Row justify='space-between' gutter={10}>
                    <Col span={18}>
                      <Space size='small' direction='vertical'>
                        {this?.props?.edit?.qr_code?.qr_show && (
                          <Typography.Paragraph style={styles.paragraph}>
                            {this?.props?.edit?.qr_code?.qr_message}
                          </Typography.Paragraph>
                        )}
                        <Row
                          gutter={5}
                          style={{ marginInlineEnd: '5px' }}
                          // justify="center"
                        >
                          {this?.props?.edit?.qr_code?.appstore_show && (
                            <Col span={12}>
                              <img
                                src='/images/appStore.png'
                                alt='app store'
                                style={{ width: '100%' }}
                              ></img>
                            </Col>
                          )}
                          {this?.props?.edit?.qr_code?.playstore_show && (
                            <Col span={12}>
                              <img
                                src='/images/googlePlay.png'
                                alt='app store'
                                style={{ width: '100%' }}
                              ></img>
                            </Col>
                          )}
                        </Row>
                      </Space>
                    </Col>

                    <Col style={styles.qrCode}>
                      <QRCodeSVG
                        style={{
                          width: '50px',
                          height: '50px',
                        }}
                        value={
                          this?.props?.edit?.qr_code?.qr_data
                            ? this?.props?.edit?.qr_code?.qr_data
                            : 'application url'
                        }
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            )}
          </Col>
          {/* <Col span={23}>
                <Row justify="center" align="middle" gutter={15}>
                  <Col span={18}>
                    <Space size="small" direction="vertical">
                      <div className="market_invoice_note">
                        تمامی محصولات را بصورت آنلاین هم میتوانید خریداری کنید
                      </div>
                      <Row gutter={5} style={{ paddingInlineEnd: "5px" }}>
                        <Col span={12}>
                          <img
                            src="/images/appStore.png"
                            alt="app store"
                            width="100%"
                          ></img>
                        </Col>
                        <Col span={12}>
                          <img
                            src="/images/googlePlay.png"
                            alt="app store"
                            width="100%"
                          ></img>
                        </Col>
                      </Row>
                    </Space>
                  </Col>
                  <Col
                    span={6}
                    style={{
                      paddingTop: "5px",
                    }}
                  >
                    <{QRCodeSVG}
                      style={{ width: "100%", height: "50px" }}
                      value={`${this.props?.company?.website}`}
                    />
                  </Col>
                </Row>
              </Col> 
                     //   </Row>
          // </Col>
            */}
          {this?.props?.edit?.note?.note_data && (
            <Col
              span={24}
              style={{ ...styles.descriptionBody, textAlign: 'center' }}
            >
              <br />
              {this?.props?.edit?.note?.note_data}
            </Col>
          )}
          {this.props?.edit?.ticket_qr_code?.qr_show && (
            <Col
              span={24}

              // style={{ marginTop: "10px" }}
            >
              <Divider dashed={true} style={styles.noteDivider} />
              <Row gutter={10} justify='space-between'>
                <Col span={16}>
                  {this.props?.edit?.ticket_note?.note_data && (
                    <Typography.Paragraph style={styles.paragraph}>
                      {this?.props?.response?.coupon_ticket?.discount_total > 0
                        ? parse(
                            this.props?.edit?.ticket_note?.note_data?.replace(
                              '$$',
                              `<b>${fixedNumber(
                                this?.props?.response?.coupon_ticket
                                  ?.discount_total,
                                1,
                              )}</b>`,
                            ),
                          )
                        : this.props?.edit?.ticket_note?.note_data.replace(
                            '$$',
                            '',
                          )}
                    </Typography.Paragraph>
                  )}
                </Col>

                <Col style={styles.qrCode}>
                  <QRCodeSVG
                    style={{ width: '70px', height: '70px' }}
                    value={
                      this?.props?.response?.coupon_ticket?.code
                        ? `anarج${this?.props?.response?.coupon_ticket?.code}`
                        : `anarج"sdfse"`
                    }
                  />
                </Col>
              </Row>
            </Col>
          )}

          <Col span={24}>
            <br />

            <Row>
              <Col style={styles.footer}>
                {' '}
                {this.props.locals.accounting_name} :
              </Col>
            </Row>
            <Row justify='space-between'>
              <Col style={styles.footer}>
                {this.props.locals.ProductOfMicrocis}
              </Col>

              <Col style={styles.footer}>
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
                &nbsp; | &nbsp;CAC{' '}
                {this?.props?.language === 'en'
                  ? this?.props?.userId
                  : arabicToIndian(this?.props?.userId)}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}
const styles = {
  rowSpace: { marginTop: '8px' },

  divider1: { margin: '5px', background: 'black' },
  qrCode: { paddingTop: '8px' },
  unit: { fontSize: '10px' },
  tablePrice: { textAlign: 'center', width: '15%' },
  tableHeaderPrice: {
    textAlign: 'center',
    width: '15%',
  },
  totalTablePrice: { textAlign: 'end', paddingInlineEnd: '0px', width: '15%' },
  totalTableHeaderPrice: {
    textAlign: 'end',
    width: '15%',
    paddingInlineEnd: '0px',
  },
  tableHeaderQty: { width: '10%', textAlign: 'center' },
  tableHeaderName: { width: '60%' },
  noteDivider: { backgroundColor: 'black' },
  margin: { margin: '0px' },
  footer: { fontSize: '7px', fontWeight: 'bold', color: 'black' },
  payableTotal: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'end',
  },
  descriptionTitle: { fontSize: '9px', fontWeight: 'bold', color: 'black' },
  address: { fontSize: '9px', paddingBottom: '0px', color: 'black' },
  tableColumn: { fontSize: '10px', padding: '1px 3px', color: 'black' },
  descriptionBody: { fontSize: '10px', color: 'black' },
  paragraph: {
    fontSize: '9px',
    color: 'black',
    textAlign: 'justify',
    marginBottom: '0px',
  },
};
export default PrintInvoice;
