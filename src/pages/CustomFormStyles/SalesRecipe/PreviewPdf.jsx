import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Row, Col, Avatar, Typography, List, Table, Divider } from 'antd';
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;
const { Column } = Table;

export default function PreviewPdf(props) {
  const { t } = useTranslation();
  const [activeDrags, setActiveDrags] = useState(0);
  const ref = useRef(null);

  const onStart = () => {
    setActiveDrags(activeDrags + 1);
  };

  const onStop = () => {
    setActiveDrags(activeDrags + 1);
  };
  const dragHandlers = { onStart: onStart, onStop: onStop };

  return (
    <div style={{ position: 'relative' }}>
      <div
        className='custom_form_style_pdf_content'
        style={styles.pdf_margin(
          props.top,
          props.right,
          props.bottom,
          props.left,
          props.fitWindow,
        )}
      >
        <Row>
          <Col span={24}>
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={props.drag.titleDrag}
              position={null}
              //   grid={[2, 25]}
              scale={1}
              bounds='parent'
              // onStart={handleStart}
              onDrag={props.drag.handleDragTitle}
              // onStop={handleStop}
              {...dragHandlers}
              nodeRef={ref}
            >
              <div ref={ref}>
                <Title level={4} className='header_pdf'>
                  {' '}
                  Microcies
                </Title>
              </div>
            </Draggable>
          </Col>

          <Col style={{ height: '365px' }} span={24}>
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={props.drag.phoneDrag}
              position={null}
              //   grid={[2, 25]}
              scale={1}
              bounds='parent'
              // onStart={handleStart}
              onDrag={props.drag.handleDragPhone}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <div
                className='header_pdf'
                style={styles.font(
                  props.fontSize,
                  props.fontFamily,
                  props.background,
                )}
              >
                {' '}
                +93 799773529
              </div>
            </Draggable>
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={props.drag.emailDrag}
              position={null}
              //   grid={[2, 25]}
              scale={1}
              bounds='parent'
              // onStart={handleStart}
              onDrag={props.drag.handleDragEmail}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <div
                className='header_pdf'
                style={styles.font(
                  props.fontSize,
                  props.fontFamily,
                  props.background,
                )}
              >
                {' '}
                mony@gmail.com
              </div>
            </Draggable>
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={props.drag.websiteDrag}
              position={null}
              //   grid={[2, 25]}
              scale={1}
              bounds='parent'
              // onStart={handleStart}
              onDrag={props.drag.handleDragWebsite}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <div
                className='header_pdf'
                style={styles.font(
                  props.fontSize,
                  props.fontFamily,
                  props.background,
                )}
              >
                www.google.net
              </div>
            </Draggable>
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={props.drag.companyDrag}
              position={null}
              //   grid={[2, 25]}
              scale={1}
              bounds='parent'
              // onStart={handleStart}
              onDrag={props.drag.handleDragCompany}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <div
                className='header_pdf'
                style={styles.font(
                  props.fontSize,
                  props.fontFamily,
                  props.background,
                )}
              >
                Company registration number 213891203712
              </div>
            </Draggable>
            {props.showLogo && (
              <Draggable
                //   axis='y'
                setCursor={true}
                defaultPosition={props.drag.logoDrag}
                position={null}
                //   grid={[2, 25]}
                scale={1}
                bounds='parent'
                // onStart={handleStart}
                onDrag={props.drag.handleDragLogo}
                // onStop={handleStop}
                {...dragHandlers}
              >
                <Avatar
                  shape='square'
                  alt={`${t('Company.Logo')}`}
                  size={props.size}
                  className='header_pdf'
                  style={{ cursor: 'move' }}
                  src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
                >
                  {t('Company.Logo')}
                </Avatar>
              </Draggable>
            )}
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={
                props.showLogo ? props.drag.taxDragLogo : props.drag.taxDrag
              }
              position={null}
              //   grid={[2, 25]}
              scale={1}
              // onStart={handleStart}
              onDrag={props.drag.handleDragTax}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <h5
                className='header_pdf'
                style={{ color: `${props.background}` }}
              >
                TAX INVOICE
              </h5>
            </Draggable>
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={
                props.showLogo ? props.drag.billDragLogo : props.drag.billDrag
              }
              position={null}
              handle='.list_pdf'
              //   grid={[2, 25]}
              scale={1}
              bounds='parent'
              // onStart={handleStart}
              onDrag={props.drag.handleDragBill}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <List
                itemLayout='horizontal'
                dataSource={props.data}
                className='list_pdf'
                size='small'
                split={false}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      // borderBottom: `1px solid ${gray} `,
                      wordWrap: ' break-word',
                      wordBreak: 'break-all',
                      fontSize: '9px',
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
            </Draggable>
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={
                props.showLogo ? props.drag.shipDragLogo : props.drag.shipDrag
              }
              position={null}
              handle='.list_pdf'
              //   grid={[2, 25]}
              scale={1}
              bounds='parent'
              // onStart={handleStart}
              onDrag={props.drag.handleDragShip}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <List
                itemLayout='horizontal'
                dataSource={props.data}
                className='list_pdf'
                size='small'
                split={false}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      // borderBottom: `1px solid ${gray} `,
                      wordWrap: ' break-word',
                      wordBreak: 'break-all',
                      fontSize: '9px',
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
            </Draggable>
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={
                props.showLogo
                  ? props.drag.shipDateDragLogo
                  : props.drag.shipDateDrag
              }
              position={null}
              handle='.list_pdf'
              //   grid={[2, 25]}
              scale={1}
              bounds='parent'
              // onStart={handleStart}
              onDrag={props.drag.handleDragShipDate}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <List
                itemLayout='horizontal'
                dataSource={props.data}
                className='list_pdf'
                size='small'
                split={false}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      // borderBottom: `1px solid ${gray} `,
                      wordWrap: ' break-word',
                      wordBreak: 'break-all',
                      fontSize: '9px',
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
            </Draggable>
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={
                props.showLogo
                  ? props.drag.taxInvoiceDragLogo
                  : props.drag.taxInvoiceDrag
              }
              position={null}
              handle='.list_pdf'
              //   grid={[2, 25]}
              scale={1}
              bounds='parent'
              // onStart={handleStart}
              onDrag={props.drag.handleDragTaxInvoice}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <List
                itemLayout='horizontal'
                dataSource={props.data}
                className='list_pdf'
                size='small'
                split={false}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      // borderBottom: `1px solid ${gray} `,
                      wordWrap: ' break-word',
                      wordBreak: 'break-all',
                      fontSize: '9px',
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
            </Draggable>
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={
                props.showLogo
                  ? props.drag.custom1DragLogo
                  : props.drag.custom1Drag
              }
              position={null}
              handle='.list_pdf'
              //   grid={[2, 25]}
              scale={1}
              bounds='parent'
              // onStart={handleStart}
              // onDrag={handleDrag}
              onStop={props.drag.handleStopCustom1}
              {...dragHandlers}
            >
              <Row className='list_pdf'>
                <Col xs={24}>
                  <Text type='secondary' strong={true}>
                    {' '}
                    ESTIMATE
                  </Text>{' '}
                </Col>
                <Col xs={24}>Custom-1</Col>
              </Row>
            </Draggable>
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={
                props.showLogo
                  ? props.drag.custom2DragLogo
                  : props.drag.custom2Drag
              }
              position={null}
              handle='.list_pdf'
              //   grid={[2, 25]}
              scale={1}
              bounds='parent'
              // onStart={handleStart}
              onDrag={props.drag.handleStopCustom2}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <Row className='list_pdf'>
                <Col xs={24}>
                  <Text type='secondary' strong={true}>
                    {' '}
                    MONA
                  </Text>{' '}
                </Col>
                <Col xs={24}>Custom-2</Col>
              </Row>
            </Draggable>
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={
                props.showLogo
                  ? props.drag.custom3DragLogo
                  : props.drag.custom3Drag
              }
              position={null}
              handle='.list_pdf'
              //   grid={[2, 25]}
              scale={1}
              bounds='parent'
              // onStart={handleStart}
              onDrag={props.drag.handleDrag.custom3}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <Row className='list_pdf'>
                <Col xs={24}>
                  <Text type='secondary' strong={true}>
                    {' '}
                    MOSA
                  </Text>{' '}
                </Col>
                <Col xs={24}>Custom-3</Col>
              </Row>
            </Draggable>
          </Col>
          <Col span={24} style={{ heigh: 'auto' }}>
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={props.drag.table1Drag}
              position={null}
              //   grid={[2, 25]}
              scale={1}
              bounds='parent'
              // onStart={handleStart}
              onDrag={props.drag.handleDragTable1}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <Row className='header_pdf'>
                <Col span={24}>
                  <Table
                    size='small'
                    tableLayout='fixed'
                    dataSource={props.dataSours}
                    pagination={false}
                    headerClassName='header_pdf1'
                  >
                    <Column
                      title={
                        <div style={styles.tableHeader(props.background)}>
                          Date
                        </div>
                      }
                      dataIndex='date'
                      key='date'
                      className='table_col_pdf'
                    />

                    <Column
                      title={
                        <div style={styles.tableHeader(props.background)}>
                          ACTIVITY
                        </div>
                      }
                      dataIndex='activity'
                      key='activity'
                      className='table_col_pdf'
                    />
                    <Column
                      title={
                        <div style={styles.tableHeader(props.background)}>
                          DESCRIPTION
                        </div>
                      }
                      dataIndex='description'
                      key='email'
                      className='table_col_pdf'
                    />
                    <Column
                      title={
                        <div style={styles.tableHeader(props.background)}>
                          TAX
                        </div>
                      }
                      dataIndex='tax'
                      key='tax'
                      className='table_col_pdf'
                    />
                    <Column
                      title={
                        <div style={styles.tableHeader(props.background)}>
                          QTY
                        </div>
                      }
                      dataIndex='qty'
                      key='qty'
                      className='table_col_pdf'
                    />
                    <Column
                      title={
                        <div style={styles.tableHeader(props.background)}>
                          RATE
                        </div>
                      }
                      dataIndex='rate'
                      key='rate'
                      className='table_col_pdf'
                    />
                    <Column
                      title={
                        <div style={styles.tableHeader(props.background)}>
                          AMOUNT
                        </div>
                      }
                      dataIndex='amount'
                      key='amount'
                      className='table_col_pdf'
                    />
                  </Table>
                </Col>
              </Row>
            </Draggable>
          </Col>
          <Col span={24}>
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={props.drag.deltaPosition}
              position={null}
              //   grid={[2, 25]}
              scale={1}
              bounds='parent'
              // onStart={handleStart}
              onDrag={props.drag.handleDrag}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <div className='footer_header_pdf'>
                message to customer{' '}
                {/* <div>
                  x: {deltaPosition.x.toFixed(0)}, y:{" "}
                  {deltaPosition.y.toFixed(0)}
                </div>{" "} */}
              </div>
            </Draggable>
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={props.drag.totalDrag}
              position={null}
              //   grid={[2, 25]}
              scale={1}
              bounds='parent'
              // onStart={handleStart}
              onDrag={props.drag.handleDragTotal}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <div className='footer_header_pdf'>
                {' '}
                <List
                  itemLayout='horizontal'
                  dataSource={props.data1}
                  size='small'
                  split={false}
                  renderItem={(item) => (
                    <List.Item
                      style={{
                        // borderBottom: `1px solid ${gray} `,
                        wordWrap: ' break-word',
                        wordBreak: 'break-all',
                        fontSize: '9px',
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
                <Row
                  style={{ width: '100%' }}
                  className='footer_list_pdf font_size_pdf'
                >
                  <Col xs={12}>BALANCE DUE</Col>
                  <Col xs={12}>AED776.25</Col>
                </Row>
              </div>
            </Draggable>
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={props.drag.estimateDrag}
              position={null}
              //   grid={[2, 25]}
              scale={1}
              bounds='parent'
              // onStart={handleStart}
              onDrag={props.drag.handleDragEstimate}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <Row className='footer_header_pdf num'>
                <Col xs={24} className='font_size_pdf num'>
                  {' '}
                  <Text style={styles.color(props.background)}>
                    {' '}
                    Estimate summary
                  </Text>
                  <Divider
                    style={{
                      margin: '3px 0px',
                    }}
                  />
                </Col>
                <List
                  itemLayout='horizontal'
                  dataSource={props.data2}
                  size='small'
                  className='num'
                  split={false}
                  renderItem={(item) => (
                    <List.Item
                      style={{
                        // borderBottom: `1px solid ${gray} `,
                        wordWrap: ' break-word',
                        wordBreak: 'break-all',
                        fontSize: '9px',
                        padding: '0px',
                      }}
                    >
                      <Row style={{ width: '100%' }} gutter={5}>
                        <Col span={12}>
                          <h4> {item.description}</h4>{' '}
                        </Col>
                        <Col span={12}>{item.content}</Col>
                      </Row>
                    </List.Item>
                  )}
                />
                <Divider
                  style={{
                    margin: '3px 0px 0px 0px',
                  }}
                />
              </Row>
            </Draggable>
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={props.drag.table2Drag}
              position={null}
              //   grid={[2, 25]}
              scale={1}
              bounds='parent'
              // onStart={handleStart}
              onDrag={props.drag.handleDragTable2}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <Row className='header_pdf'>
                <Col span={24}>
                  <Table
                    size='small'
                    tableLayout='fixed'
                    dataSource={props.dataSours1}
                    pagination={false}
                  >
                    <Column
                      title={
                        <div style={styles.tableHeader(props.background)}>
                          RATE
                        </div>
                      }
                      dataIndex='rate'
                      key='rate'
                      className='table_col_pdf'
                    />
                    <Column
                      title={
                        <div style={styles.tableHeader(props.background)}>
                          VAT
                        </div>
                      }
                      dataIndex='vat'
                      key='vat'
                      className='table_col_pdf'
                    />
                    <Column
                      title={
                        <div style={styles.tableHeader(props.background)}>
                          NET
                        </div>
                      }
                      dataIndex='net'
                      key='net'
                      className='table_col_pdf'
                    />
                  </Table>
                </Col>
              </Row>
            </Draggable>
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={props.drag.paymentDetailsDrag}
              position={null}
              //   grid={[2, 25]}
              scale={1}
              bounds='parent'
              // onStart={handleStart}
              onDrag={props.drag.handleDragPaymentDetails}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <Row>
                <Col
                  span={24}
                  className='footer_header_pdf'
                  style={styles.paymentDetails(props.background)}
                >
                  payment details
                </Col>
              </Row>
            </Draggable>
          </Col>
          <Col span={24}>
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={props.drag.footerDrag}
              position={null}
              //   grid={[2, 25]}
              scale={1}
              bounds='parent'
              // onStart={handleStart}
              onDrag={props.drag.handleDragFooter}
              // onStop={handleStop}
              {...dragHandlers}
              nodeRef={ref}
            >
              <Row className='header_pdf' ref={ref}>
                <Col span={24}>
                  footerText
                  <bt />
                </Col>
                <Col span={24}> Page 1 of 1</Col>
              </Row>
            </Draggable>
          </Col>
        </Row>
      </div>
    </div>
  );
}
const styles = {
  content: (background) => ({ background: `${background}` }),
  color: (background) => ({ color: `${background}` }),
  font: (fontSize, fontFamily, background) => ({
    fontSize: fontSize,
    fontFamily: fontFamily,
    // color: `${background}`,
  }),
  pdf_margin: (top, right, bottom, left, fitWindow) => ({
    padding: fitWindow ? '20px' : `${top}px ${right}px ${bottom}px ${left}px`,
  }),
  tableHeader: (background) => ({
    background: `${background}`,
    padding: '4px 8px',
  }),
  paymentDetails: (background) => ({
    background: `${background}`,
    padding: '2px 8px',
  }),
};
