import React from 'react';
import { useTranslation } from 'react-i18next';
// import Draggable from "react-draggable";
import { Row, Col, Typography, Avatar, List, Table, Divider } from 'antd';
import { EditOutlined } from '@ant-design/icons';
const { Text, Title, Paragraph } = Typography;
const { Column } = Table;
export default function Content(props) {
  const { t } = useTranslation();

  // const [activeDrags, setActiveDrags] = useState(0);
  // const eventLogger = (e, data) => {
  //
  //
  // };
  // const onStart = () => {
  //   setActiveDrags(activeDrags + 1);
  // };
  // const handleDrag = (data) => {
  //
  // };
  // const onStop = () => {
  //   setActiveDrags(activeDrags + 1);
  // };
  // const dragHandlers = { onStart: onStart, onStop: onStop };

  return (
    <div>
      <div
        className='custom_form_style_pdf'
        style={styles.pdf_margin(
          props.top,
          props.right,
          props.bottom,
          props.left,
          props.fitWindow,
        )}
      >
        <Row gutter={[0, 12]}>
          {props.edit.titleShow && props.edit.phone && (
            <Col
              span={24}
              onClick={props.edit.onClickTitle}
              className='account_setting_drawer_hover'
            >
              <Row justify='space-between'>
                <Col>
                  <Title
                    level={4}
                    style={styles.font(props.fontSize, props.fontFamily)}
                  >
                    {' '}
                    {props.edit.titleContent}
                  </Title>
                </Col>
                <Col>
                  <EditOutlined className='font' />
                </Col>
              </Row>
            </Col>
          )}
          <Col
            span={24}
            onClick={props.edit.onClickHeader}
            className='account_setting_drawer_hover'
          >
            <Row>
              <Col
                span={24}
                style={styles.font(props.fontSize, props.fontFamily)}
              >
                <Row className='num' justify='space-between'>
                  <Col>
                    <Paragraph>
                      {props.edit.phoneShow && props.edit.phone && (
                        <div>
                          <Text>{props.edit.phone}</Text>
                          <br />
                        </div>
                      )}
                      {props.edit.emailShow && props.edit.email && (
                        <div>
                          <Text> {props.edit.email}</Text>
                          <br />
                        </div>
                      )}
                      {props.edit.websiteShow && props.edit.website && (
                        <div>
                          {' '}
                          <Text>{props.edit.website}</Text>
                          <br />
                        </div>
                      )}

                      {props.edit.companyNoShow && props.edit.companyNo && (
                        <Text>
                          {' '}
                          Company registration number &nbsp;
                          {props.edit.companyNo}
                        </Text>
                      )}
                    </Paragraph>
                  </Col>
                  <Col>
                    {' '}
                    {props.showLogo && (
                      <Avatar
                        shape='square'
                        alt={`${t('Company.Logo')}`}
                        size={props.size}
                        // className='cursor'

                        src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
                      >
                        {t('Company.Logo')}
                      </Avatar>
                    )}
                    &nbsp;&nbsp;
                    <EditOutlined className='font' />
                  </Col>
                </Row>
              </Col>

              {/* <Col >
         
            </Col> */}
              {props.edit.formNames && (
                <Col span={24}>
                  <Text
                    strong={true}
                    style={styles.color(
                      props.background,
                      props.fontSize,
                      props.fontFamily,
                    )}
                  >
                    {props.edit.taxInvoice.toUpperCase()}
                  </Text>
                </Col>
              )}
              <Col span={24}>
                <Row gutter={5}>
                  <Col span={6}>
                    {' '}
                    <List
                      itemLayout='horizontal'
                      dataSource={props.data}
                      size='small'
                      split={false}
                      style={styles.font(props.fontSize, props.fontFamily)}
                      renderItem={(item) => (
                        <List.Item
                          style={{
                            // borderBottom: `1px solid ${gray} `,
                            wordWrap: ' break-word',
                            wordBreak: 'break-all',
                            // fontSize: "9px",
                            padding: '0px',
                          }}
                        >
                          {item.show && (
                            <Row className='num' gutter={5}>
                              <Col xs={12}>
                                <h4> {item.description}</h4>{' '}
                              </Col>
                              <Col xs={12}>{item.content}</Col>
                            </Row>
                          )}
                        </List.Item>
                      )}
                    />
                  </Col>
                  <Col span={6}>
                    {props.edit.shipping && (
                      <List
                        itemLayout='horizontal'
                        dataSource={props.dataA}
                        size='small'
                        style={styles.font(props.fontSize, props.fontFamily)}
                        split={false}
                        renderItem={(item) => (
                          <List.Item
                            style={{
                              // borderBottom: `1px solid ${gray} `,
                              wordWrap: ' break-word',
                              wordBreak: 'break-all',
                              // fontSize: "9px",
                              padding: '0px',
                            }}
                          >
                            <Row style={{ width: '100%' }} gutter={5}>
                              <Col xs={12}>
                                <h4> {item.description}</h4>{' '}
                              </Col>
                              <Col xs={12}>{item.content}</Col>
                            </Row>
                          </List.Item>
                        )}
                      />
                    )}
                  </Col>
                  <Col span={6}>
                    {props.edit.shipping && (
                      <List
                        itemLayout='horizontal'
                        dataSource={props.dataB}
                        size='small'
                        split={false}
                        style={styles.font(props.fontSize, props.fontFamily)}
                        renderItem={(item) => (
                          <List.Item
                            style={{
                              // borderBottom: `1px solid ${gray} `,
                              wordWrap: ' break-word',
                              wordBreak: 'break-all',
                              // fontSize: "9px",
                              padding: '0px',
                            }}
                          >
                            <Row style={{ width: '100%' }} gutter={5}>
                              <Col xs={12}>
                                <h4> {item.description}</h4>{' '}
                              </Col>
                              <Col xs={12}>{item.content}</Col>
                            </Row>
                          </List.Item>
                        )}
                      />
                    )}
                  </Col>
                  <Col span={6}>
                    {' '}
                    <List
                      itemLayout='horizontal'
                      dataSource={props.dataC}
                      size='small'
                      style={styles.font(props.fontSize, props.fontFamily)}
                      split={false}
                      renderItem={(item) => (
                        <List.Item
                          style={{
                            // borderBottom: `1px solid ${gray} `,
                            wordWrap: ' break-word',
                            wordBreak: 'break-all',
                            // fontSize: "9px",
                            padding: '0px',
                          }}
                        >
                          {item.show && (
                            <Row className='num' gutter={5}>
                              <Col xs={12}>
                                <h4> {item.description}</h4>{' '}
                              </Col>
                              <Col xs={12}>{item.content}</Col>
                            </Row>
                          )}
                        </List.Item>
                      )}
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row gutter={[0, 5]}>
                  {props.edit.custom1Show && props.edit.custom1 && (
                    <Col xs={6}>
                      <Text type='secondary' strong={true}>
                        {' '}
                        {props.edit.custom1}
                      </Text>
                      <br />
                      <Text>Custom-1</Text>
                    </Col>
                  )}
                  {props.edit.custom2Show && props.edit.custom2 && (
                    <Col xs={6}>
                      <Text type='secondary' strong={true}>
                        {' '}
                        {props.edit.custom2}
                      </Text>
                      <br />
                      <Text>Custom-2</Text>
                    </Col>
                  )}
                  {props.edit.custom3Show && props.edit.custom3 && (
                    <Col xs={6}>
                      <Text type='secondary' strong={true}>
                        {' '}
                        {props.edit.custom3}
                      </Text>
                      <br />
                      <Text>Custom-3</Text>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          </Col>
          <Col
            span={24}
            className='account_setting_drawer_hover'
            onClick={props.edit.onClickTable}
          >
            <Row
              style={styles.font(props.fontSize, props.fontFamily)}
              className='position-relative'
            >
              {props.edit.showInvoice && (
                <Col span={24}>
                  <Row>
                    <Col span={24}>
                      {' '}
                      ACCOUNT SUMMARY
                      <Divider style={{ margin: '3px ' }} />
                    </Col>
                    <Col span={4}>01/07/2018</Col>
                    <Col span={16}>
                      {' '}
                      Balance Forward
                      <br />
                      Payments and credits between 01/12/2016 and 12/01/2016
                      <br />
                      New charges (details below)
                      <br />
                      Total Amount Due
                    </Col>
                    <Col span={4}>
                      AED100.00
                      <br />
                      AED-50.00
                      <br />
                      AED665.00
                      <br />
                      AED715.00
                    </Col>
                  </Row>
                  <Divider style={{ margin: '7px 0px ' }} />
                </Col>
              )}
              <Col span={24}>
                <Table
                  size='small'
                  tableLayout='fixed'
                  dataSource={props.dataSours}
                  pagination={false}
                  style={styles.font(props.fontSize, props.fontFamily)}
                >
                  {props.edit.date && (
                    <Column
                      title={
                        <div
                          style={styles.tableHeader(
                            props.background,
                            props.fontSize,
                            props.fontFamily,
                          )}
                        >
                          Date
                        </div>
                      }
                      dataIndex='date'
                      key='date'
                      className='account_setting_drawer_hover'
                      render={(text, record) => {
                        return {
                          props: {
                            style: styles.font(
                              props.fontSize,
                              props.fontFamily,
                            ),
                          },
                          children: <div>{text}</div>,
                        };
                      }}
                    />
                  )}

                  {props.edit.productOrService && (
                    <Column
                      title={
                        <div
                          style={styles.tableHeader(
                            props.background,
                            props.fontSize,
                            props.fontFamily,
                          )}
                        >
                          ACTIVITY
                        </div>
                      }
                      dataIndex='activity'
                      key='activity'
                      className='account_setting_drawer_hover'
                      render={(text, record) => {
                        return {
                          props: {
                            style: styles.font(
                              props.fontSize,
                              props.fontFamily,
                            ),
                          },
                          children: <div>{text}</div>,
                        };
                      }}
                    />
                  )}
                  {props.edit.description && (
                    <Column
                      title={
                        <div
                          style={styles.tableHeader(
                            props.background,
                            props.fontSize,
                            props.fontFamily,
                          )}
                        >
                          DESCRIPTION
                        </div>
                      }
                      width={100}
                      dataIndex='description'
                      key='email'
                      render={(text, record) => {
                        return {
                          props: {
                            style: styles.font(
                              props.fontSize,
                              props.fontFamily,
                            ),
                          },
                          children: <div>{text}</div>,
                        };
                      }}
                    />
                  )}
                  {props.edit.tax && (
                    <Column
                      title={
                        <div
                          style={styles.tableHeader(
                            props.background,
                            props.fontSize,
                            props.fontFamily,
                          )}
                        >
                          TAX
                        </div>
                      }
                      dataIndex='tax'
                      key='tax'
                      render={(text, record) => {
                        return {
                          props: {
                            style: styles.font(
                              props.fontSize,
                              props.fontFamily,
                            ),
                          },
                          children: <div>{text}</div>,
                        };
                      }}
                    />
                  )}
                  {props.edit.quantity && (
                    <Column
                      title={
                        <div
                          style={styles.tableHeader(
                            props.background,
                            props.fontSize,
                            props.fontFamily,
                          )}
                        >
                          QTY
                        </div>
                      }
                      dataIndex='qty'
                      key='qty'
                      render={(text, record) => {
                        return {
                          props: {
                            style: styles.font(
                              props.fontSize,
                              props.fontFamily,
                            ),
                          },
                          children: <div>{text}</div>,
                        };
                      }}
                    />
                  )}
                  {props.edit.showProgress && (
                    <Column
                      title={
                        <div
                          style={styles.tableHeader(
                            props.background,
                            props.fontSize,
                            props.fontFamily,
                          )}
                        >
                          Due
                        </div>
                      }
                      dataIndex='due'
                      key='due'
                      render={(text, record) => {
                        return {
                          props: {
                            style: styles.font(
                              props.fontSize,
                              props.fontFamily,
                            ),
                          },
                          children: <div>{text}</div>,
                        };
                      }}
                    />
                  )}
                  {props.edit.rate && (
                    <Column
                      title={
                        <div
                          style={styles.tableHeader(
                            props.background,
                            props.fontSize,
                            props.fontFamily,
                          )}
                        >
                          RATE
                        </div>
                      }
                      dataIndex='rate'
                      key='rate'
                      render={(text, record) => {
                        return {
                          props: {
                            style: styles.font(
                              props.fontSize,
                              props.fontFamily,
                            ),
                          },
                          children: <div>{text}</div>,
                        };
                      }}
                    />
                  )}
                  {props.edit.amount && (
                    <Column
                      title={
                        <div
                          style={styles.tableHeader(
                            props.background,
                            props.fontSize,
                            props.fontFamily,
                          )}
                        >
                          AMOUNT
                        </div>
                      }
                      dataIndex='amount'
                      key='amount'
                      render={(text, record) => {
                        return {
                          props: {
                            style: styles.font(
                              props.fontSize,
                              props.fontFamily,
                            ),
                          },
                          children: <div>{text}</div>,
                        };
                      }}
                    />
                  )}
                  {props.edit.sku && (
                    <Column
                      title={
                        <div
                          style={styles.tableHeader(
                            props.background,
                            props.fontSize,
                            props.fontFamily,
                          )}
                        >
                          SKU
                        </div>
                      }
                      dataIndex='sku'
                      key='sku'
                      render={(text, record) => {
                        return {
                          props: {
                            style: styles.font(
                              props.fontSize,
                              props.fontFamily,
                            ),
                          },
                          children: <div>{text}</div>,
                        };
                      }}
                    />
                  )}
                </Table>
              </Col>
              <Col className='edit_pdf'>
                {' '}
                <EditOutlined className='font' />
              </Col>
            </Row>
          </Col>
          <Row
            className='account_setting_drawer_hover'
            onClick={props.edit.onClickFooter}
          >
            <Col span={24}>
              <Col span={24} style={{ height: 'auto' }}>
                <Row className='position-relative'>
                  <Col
                    span={11}
                    style={styles.font(props.fontSize, props.fontFamily)}
                  >
                    <Paragraph>{props.edit.customerMessage}</Paragraph>
                  </Col>
                  <Col span={12}>
                    <List
                      itemLayout='horizontal'
                      dataSource={props.data1}
                      size='small'
                      style={styles.font(props.fontSize, props.fontFamily)}
                      split={false}
                      renderItem={(item) => (
                        <List.Item
                          style={{
                            // borderBottom: `1px solid ${gray} `,
                            wordWrap: ' break-word',
                            wordBreak: 'break-all',

                            padding: '0px',
                          }}
                        >
                          {item.show && (
                            <Row className='num' gutter={5}>
                              <Col xs={12}>
                                <h4> {item.description}</h4>{' '}
                              </Col>
                              <Col xs={12}>{item.content}</Col>
                            </Row>
                          )}
                        </List.Item>
                      )}
                    />
                    <Divider
                      style={{
                        margin: '5px 0px',
                      }}
                    />
                    <Row gutter={[0, 10]}>
                      <Col
                        span={24}
                        style={styles.font(props.fontSize, props.fontFamily)}
                      >
                        {' '}
                        <Row className='num '>
                          <Col xs={12}>BALANCE DUE</Col>
                          <Col xs={12}>AED776.25</Col>
                        </Row>
                      </Col>
                      {props.edit.estimateSummary && (
                        <Col span={24}>
                          <Row>
                            <Col
                              xs={24}
                              className='font_size_pdf'
                              style={styles.font(
                                props.fontSize,
                                props.fontFamily,
                              )}
                            >
                              {' '}
                              <h5
                                style={styles.color(
                                  props.background,
                                  props.fontSize,
                                  props.fontFamily,
                                )}
                              >
                                {' '}
                                Estimate summary
                              </h5>
                              <Divider
                                style={{
                                  margin: '3px 0px',
                                }}
                              />
                            </Col>
                            <Col xs={24}>
                              {' '}
                              <List
                                itemLayout='horizontal'
                                dataSource={props.data2}
                                size='small'
                                split={false}
                                style={styles.font(
                                  props.fontSize,
                                  props.fontFamily,
                                )}
                                renderItem={(item) => (
                                  <List.Item
                                    style={{
                                      // borderBottom: `1px solid ${gray} `,
                                      wordWrap: ' break-word',
                                      wordBreak: 'break-all',

                                      padding: '0px',
                                    }}
                                  >
                                    <Row style={{ width: '100%' }} gutter={5}>
                                      <Col xs={12}>
                                        <h4> {item.description}</h4>{' '}
                                      </Col>
                                      <Col xs={12}>{item.content}</Col>
                                    </Row>
                                  </List.Item>
                                )}
                              />
                              <Divider
                                style={{
                                  margin: '5px 0px 0px 0px',
                                }}
                              />
                            </Col>
                          </Row>
                        </Col>
                      )}
                    </Row>
                  </Col>
                  <Col span={1} className='edit_pdf'>
                    {' '}
                    <EditOutlined className='font' />
                  </Col>
                </Row>
                <Row>
                  {props.edit.taxSummary && (
                    <Col span={24}>
                      <h4 style={styles.font(props.fontSize, props.fontFamily)}>
                        Tax summary
                      </h4>
                    </Col>
                  )}
                  <Col span={24}>
                    {' '}
                    <Table
                      size='small'
                      tableLayout='fixed'
                      dataSource={props.dataSours1}
                      pagination={false}
                    >
                      <Column
                        title={
                          <div
                            style={styles.tableHeader(
                              props.background,
                              props.fontSize,
                              props.fontFamily,
                            )}
                          >
                            RATE
                          </div>
                        }
                        dataIndex='rate'
                        key='rate'
                        render={(text, record) => {
                          return {
                            props: {
                              style: styles.font(
                                props.fontSize,
                                props.fontFamily,
                              ),
                            },
                            children: <div>{text}</div>,
                          };
                        }}
                      />
                      <Column
                        title={
                          <div
                            style={styles.tableHeader(
                              props.background,
                              props.fontSize,
                              props.fontFamily,
                            )}
                          >
                            VAT
                          </div>
                        }
                        dataIndex='vat'
                        key='vat'
                        render={(text, record) => {
                          return {
                            props: {
                              style: styles.font(
                                props.fontSize,
                                props.fontFamily,
                              ),
                            },
                            children: <div>{text}</div>,
                          };
                        }}
                      />
                      <Column
                        title={
                          <div
                            style={styles.tableHeader(
                              props.background,
                              props.fontSize,
                              props.fontFamily,
                            )}
                          >
                            NET
                          </div>
                        }
                        dataIndex='net'
                        key='net'
                        render={(text, record) => {
                          return {
                            props: {
                              style: styles.font(
                                props.fontSize,
                                props.fontFamily,
                              ),
                            },
                            children: <div>{text}</div>,
                          };
                        }}
                      />
                    </Table>
                  </Col>
                </Row>
              </Col>
              <Col span={24} style={styles.paymentDetails(props.background)}>
                <Text style={styles.font(props.fontSize, props.fontFamily)}>
                  {props.edit.paymentDetails}
                </Text>
              </Col>
              <Col
                span={24}
                style={styles.font(props.fontSize, props.fontFamily)}
                className='text_align_center'
              >
                <Paragraph style={{ margin: '0px' }}>
                  {props.edit.footerText}
                </Paragraph>
                <br />
                Page 1 of 1
              </Col>
            </Col>
          </Row>
        </Row>
      </div>
    </div>
  );
}
const styles = {
  color: (background, fontSize, fontFamily) => ({
    color: `${background}`,
    fontSize: fontSize,
    fontFamily: fontFamily,
  }),
  font: (fontSize, fontFamily) => ({
    fontSize: fontSize,
    fontFamily: fontFamily,
  }),
  pdf_margin: (top, right, bottom, left, fitWindow) => ({
    padding: fitWindow ? '20px' : `${top}px ${right}px ${bottom}px ${left}px`,
  }),
  tableHeader: (background, fontSize, fontFamily) => ({
    background: `${background}`,
    paddingInlineStart: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',
    fontSize: fontSize,
    fontFamily: fontFamily,
  }),
  paymentDetails: (background) => ({
    background: `${background}`,
    padding: '2px 8px',
    marginBottom: '60px',
  }),
};
