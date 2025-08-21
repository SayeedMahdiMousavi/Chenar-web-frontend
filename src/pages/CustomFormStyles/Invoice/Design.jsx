import React, { useState } from "react";
import Draggable from "react-draggable";
import { Row, Col, Avatar, Typography, List, Table, Divider } from "antd";
import { useTranslation } from "react-i18next";

const { Text, Title, Paragraph } = Typography;
const { Column } = Table;

export default function Design(props) {
  const { t } = useTranslation();
  const [activeDrags, setActiveDrags] = useState(0);

  // const eventLogger = (e, data) => {
  //   
  //   
  // };
  const onStart = () => {
    setActiveDrags(activeDrags + 1);
  };

  const onStop = () => {
    setActiveDrags(activeDrags + 1);
  };
  const dragHandlers = { onStart: onStart, onStop: onStop };
  const handleDrag = (e, ui) => {
    props.setDragData((prev) => {
      return {
        ...prev,
        deltaPosition: {
          x: props.drag.deltaPosition.x + ui.deltaX,
          y: props.drag.deltaPosition.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragTitle = (e, ui) => {
    props.drag.setDragData((prev) => {
      return {
        ...prev,
        titleDrag: {
          x: props.drag.titleDrag.x + ui.deltaX,
          y: props.drag.titleDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragPhone = (e, ui) => {
    props.drag.setDragData((prev) => {
      return {
        ...prev,
        phoneDrag: {
          x: props.drag.phoneDrag.x + ui.deltaX,
          y: props.drag.phoneDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragEmail = (e, ui) => {
    props.drag.setDragData((prev) => {
      return {
        ...prev,
        emailDrag: {
          x: props.drag.emailDrag.x + ui.deltaX,
          y: props.drag.emailDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragWebsite = (e, ui) => {
    props.drag.setDragData((prev) => {
      return {
        ...prev,
        websiteDrag: {
          x: props.drag.websiteDrag.x + ui.deltaX,
          y: props.drag.websiteDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragCompany = (e, ui) => {
    props.drag.setDragData((prev) => {
      return {
        ...prev,
        companyDrag: {
          x: props.drag.companyDrag.x + ui.deltaX,
          y: props.drag.companyDrag.y + ui.deltaY,
        },
      };
    });
  };

  const handleDragTax = (e, ui) => {
    props.drag.setDragData((prev) => {
      return {
        ...prev,
        taxDrag: {
          x: props.drag.taxDrag.x + ui.deltaX,
          y: props.drag.taxDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragBill = (e, ui) => {
    props.drag.setDragData((prev) => {
      return {
        ...prev,
        billDrag: {
          x: props.drag.billDrag.x + ui.deltaX,
          y: props.drag.billDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragShip = (e, ui) => {
    props.drag.setDragData((prev) => {
      return {
        ...prev,
        shipDrag: {
          x: props.drag.shipDrag.x + ui.deltaX,
          y: props.drag.shipDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragShipDate = (e, ui) => {
    props.drag.setDragData((prev) => {
      return {
        ...prev,
        shipDateDrag: {
          x: props.drag.shipDateDrag.x + ui.deltaX,
          y: props.drag.shipDateDrag.y + ui.deltaY,
        },
      };
    });
  };

  const handleDragTaxInvoice = (e, ui) => {
    props.drag.setDragData((prev) => {
      return {
        ...prev,
        taxInvoiceDrag: {
          x: props.drag.taxInvoiceDrag.x + ui.deltaX,
          y: props.drag.taxInvoiceDrag.y + ui.deltaY,
        },
      };
    });
  };
  // const handleDragCustom1 = (e, ui) => {
  //   props.drag.setDragData((prev) => {
  //     return {
  //       ...prev,
  //       custom1Drag: {
  //         x: props.drag.custom1Drag.x + ui.deltaX,
  //         y: props.drag.custom1Drag.y + ui.deltaY,
  //       },
  //     };
  //   });
  // };
  // const handleDragCustom2 = (e, ui) => {
  //   props.drag.setDragData((prev) => {
  //     return {
  //       ...prev,
  //       custom2Drag: {
  //         x: props.drag.custom2Drag.x + ui.deltaX,
  //         y: props.drag.custom2Drag.y + ui.deltaY,
  //       },
  //     };
  //   });
  // };
  // const handleDragCustom3 = (e, ui) => {
  //   props.drag.setDragData((prev) => {
  //     return {
  //       ...prev,
  //       custom3Drag: {
  //         x: props.drag.custom3Drag.x + ui.deltaX,
  //         y: props.drag.custom3Drag.y + ui.deltaY,
  //       },
  //     };
  //   });
  // };
  const handleDragTable1 = (e, ui) => {
    props.drag.setDragData((prev) => {
      return {
        ...prev,
        table1Drag: {
          x: props.drag.table1Drag.x + ui.deltaX,
          y: props.drag.table1Drag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragTable2 = (e, ui) => {
    props.drag.setDragData((prev) => {
      return {
        ...prev,
        table1Drag: {
          x: props.drag.table2Drag.x + ui.deltaX,
          y: props.drag.table2Drag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragTotal = (e, ui) => {
    props.drag.setDragData((prev) => {
      return {
        ...prev,
        totalDrag: {
          x: props.drag.totalDrag.x + ui.deltaX,
          y: props.drag.totalDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragEstimate = (e, ui) => {
    props.drag.setDragData((prev) => {
      return {
        ...prev,
        estimateDrag: {
          x: props.drag.estimateDrag.x + ui.deltaX,
          y: props.drag.estimateDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragPaymentDetails = (e, ui) => {
    props.drag.setDragData((prev) => {
      return {
        ...prev,
        paymentDetailsDrag: {
          x: props.drag.paymentDetailsDrag.x + ui.deltaX,
          y: props.drag.paymentDetailsDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragFooter = (e, ui) => {
    
    props.drag.setDragData((prev) => {
      return {
        ...prev,
        footerDrag: {
          x: props.drag.footerDrag.x + ui.deltaX,
          y: props.drag.footerDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragLogo = (e, ui) => {
    props.drag.setDragData((prev) => {
      return {
        ...prev,
        logoDrag: {
          x: props.drag.logoDrag.x + ui.deltaX,
          y: props.drag.logoDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragTaxSummary = (e, ui) => {
    props.drag.setDragData((prev) => {
      return {
        ...prev,
        taxSummaryDrag: {
          x: props.drag.taxSummaryDrag.x + ui.deltaX,
          y: props.drag.taxSummaryDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragShowInvoice = (e, ui) => {
    props.drag.setDragData((prev) => {
      return {
        ...prev,
        showInvoiceDrag: {
          x: props.drag.showInvoiceDrag.x + ui.deltaX,
          y: props.drag.showInvoiceDrag.y + ui.deltaY,
        },
      };
    });
  };
  return (
    <div style={{ position: "relative" }}>
      <div
        className="custom_form_style_pdf_content"
        style={styles.pdf_margin(
          props.top,
          props.right,
          props.bottom,
          props.left,
          props.fitWindow
        )}
      >
        <Row>
          {props.edit.titleShow && props.edit.phone && (
            <Col span={24}>
              <Draggable
                //   axis='y'
                setCursor={true}
                defaultPosition={props.drag.titleDrag}
                position={null}
                //   grid={[2, 25]}
                scale={1}
                bounds="parent"
                // onStart={handleStart}
                onDrag={handleDragTitle}
                // onStop={handleStop}
                {...dragHandlers}
              >
                <Title level={4} className="header_pdf">
                  {" "}
                  {props.edit.titleContent}
                </Title>
              </Draggable>
            </Col>
          )}
          <Col
            style={{ height: "290px", position: "relative" }}
            span={24}
            onClick={props.edit.onClickHeader}
            className="cursor"
          >
            <Draggable
              //   axis='y'
              handle=".header_pdf"
              defaultPosition={props.drag.phoneDrag}
              position={null}
              //   grid={[2, 25]}
              scale={1}
              bounds="parent"
              // onStart={handleStart}
              onDrag={handleDragPhone}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <div
                className="header_pdf"
                style={
                  !props.edit.phoneShow &&
                  !props.edit.phone && { cursor: "pointer", border: "none" }
                }
              >
                {props.edit.phoneShow && props.edit.phone && (
                  <div
                    style={styles.font(
                      props.fontSize,
                      props.fontFamily,
                      props.background
                    )}
                  >
                    {props.edit.phone}
                  </div>
                )}
              </div>
            </Draggable>

            {props.edit.emailShow && props.edit.email && (
              <Draggable
                //   axis='y'
                setCursor={true}
                defaultPosition={props.drag.emailDrag}
                position={null}
                //   grid={[2, 25]}
                scale={1}
                bounds="parent"
                // onStart={handleStart}
                onDrag={handleDragEmail}
                // onStop={handleStop}
                {...dragHandlers}
              >
                <div
                  className="header_pdf"
                  style={styles.font(
                    props.fontSize,
                    props.fontFamily,
                    props.background
                  )}
                >
                  {props.edit.email}
                </div>
              </Draggable>
            )}
            {props.edit.websiteShow && props.edit.website && (
              <Draggable
                //   axis='y'
                setCursor={true}
                // defaultPosition={}
                position={props.drag.websiteDrag}
                //   grid={[2, 25]}
                scale={1}
                bounds="parent"
                // onStart={handleStart}
                onDrag={handleDragWebsite}
                // onStop={handleStop}
                {...dragHandlers}
              >
                <div
                  className="header_pdf"
                  style={styles.font(
                    props.fontSize,
                    props.fontFamily,
                    props.background
                  )}
                >
                  {props.edit.website}
                </div>
              </Draggable>
            )}
            {props.edit.companyNoShow && props.edit.companyNo && (
              <Draggable
                //   axis='y'
                setCursor={true}
                defaultPosition={props.drag.companyDrag}
                position={null}
                //   grid={[2, 25]}
                scale={1}
                bounds="parent"
                // onStart={handleStart}
                onDrag={handleDragCompany}
                // onStop={handleStop}
                {...dragHandlers}
              >
                <div
                  className="header_pdf"
                  style={styles.font(
                    props.fontSize,
                    props.fontFamily,
                    props.background
                  )}
                >
                  Company registration number &nbsp;
                  {props.edit.companyNo}
                </div>
              </Draggable>
            )}

            <Draggable
              //   axis='y'
              setCursor={true}
              // defaultPosition={}
              position={props.drag.logoDrag}
              //   grid={[2, 25]}
              scale={1}
              bounds="parent"
              // onStart={handleStart}
              onDrag={handleDragLogo}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <div
                className="header_pdf"
                style={!props.showLogo && { cursor: "pointer", border: "none" }}
              >
                {props.showLogo && (
                  <Avatar
                    shape="square"
                    alt={`${t("Company.Logo")}`}
                    size={props.size}
                    // className='header_pdf'
                    style={{ cursor: "move" }}
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  >
                    {t("Company.Logo")}
                  </Avatar>
                )}
              </div>
            </Draggable>

            {props.edit.formNames && (
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
                onDrag={handleDragTax}
                // onStop={handleStop}
                {...dragHandlers}
              >
                <h5
                  className="header_pdf"
                  style={styles.color(
                    props.background,
                    props.fontSize,
                    props.fontFamily
                  )}
                >
                  {props.edit.taxInvoice.toUpperCase()}
                </h5>
              </Draggable>
            )}
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={
                props.showLogo ? props.drag.billDragLogo : props.drag.billDrag
              }
              position={null}
              handle=".list_pdf"
              //   grid={[2, 25]}
              scale={1}
              bounds="parent"
              // onStart={handleStart}
              onDrag={handleDragBill}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <List
                itemLayout="horizontal"
                dataSource={props.data}
                className="list_pdf"
                size="small"
                style={styles.font(props.fontSize, props.fontFamily)}
                split={false}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      // borderBottom: `1px solid ${gray} `,
                      wordWrap: " break-word",
                      wordBreak: "break-all",

                      padding: "0px",
                    }}
                  >
                    {item.show && (
                      <Row className="num" gutter={5}>
                        <Col xs={12}>
                          <h4> {item.description}</h4>{" "}
                        </Col>
                        <Col xs={12}>{item.content}</Col>
                      </Row>
                    )}
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
              handle=".list_pdf"
              //   grid={[2, 25]}
              scale={1}
              bounds="parent"
              // onStart={handleStart}
              onDrag={handleDragShip}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <div
                className="list_pdf"
                style={
                  !props.edit.shipping && {
                    cursor: "pointer",
                    border: "none",
                  }
                }
              >
                {props.edit.shipping && (
                  <List
                    itemLayout="horizontal"
                    dataSource={props.dataA}
                    size="small"
                    split={false}
                    style={styles.font(props.fontSize, props.fontFamily)}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          // borderBottom: `1px solid ${gray} `,
                          wordWrap: " break-word",
                          wordBreak: "break-all",

                          padding: "0px",
                        }}
                      >
                        <Row className="num" gutter={5}>
                          <Col xs={12}>
                            <h4> {item.description}</h4>{" "}
                          </Col>
                          <Col xs={12}>{item.content}</Col>
                        </Row>
                      </List.Item>
                    )}
                  />
                )}
              </div>
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
              handle=".list_pdf"
              //   grid={[2, 25]}
              scale={1}
              bounds="parent"
              // onStart={handleStart}
              onDrag={handleDragShipDate}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <div
                className="list_pdf"
                style={
                  !props.edit.shipping && {
                    cursor: "pointer",
                    border: "none",
                  }
                }
              >
                {props.edit.shipping && (
                  <List
                    itemLayout="horizontal"
                    dataSource={props.dataB}
                    size="small"
                    split={false}
                    style={styles.font(props.fontSize, props.fontFamily)}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          // borderBottom: `1px solid ${gray} `,
                          wordWrap: " break-word",
                          wordBreak: "break-all",

                          padding: "0px",
                        }}
                      >
                        <Row className="num" gutter={5}>
                          <Col xs={12}>
                            <h4> {item.description}</h4>{" "}
                          </Col>
                          <Col xs={12}>{item.content}</Col>
                        </Row>
                      </List.Item>
                    )}
                  />
                )}
              </div>
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
              handle=".list_pdf"
              //   grid={[2, 25]}
              scale={1}
              bounds="parent"
              // onStart={handleStart}
              onDrag={handleDragTaxInvoice}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <List
                itemLayout="horizontal"
                dataSource={props.dataC}
                className="list_pdf"
                size="small"
                split={false}
                style={styles.font(props.fontSize, props.fontFamily)}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      // borderBottom: `1px solid ${gray} `,
                      wordWrap: " break-word",
                      wordBreak: "break-all",

                      padding: "0px",
                    }}
                  >
                    {item.show && (
                      <Row className="num" gutter={5}>
                        <Col xs={12}>
                          <h4> {item.description}</h4>{" "}
                        </Col>
                        <Col xs={12}>{item.content}</Col>
                      </Row>
                    )}
                  </List.Item>
                )}
              />
            </Draggable>
            {props.edit.custom1Show && props.edit.custom1 && (
              <Draggable
                //   axis='y'
                setCursor={true}
                defaultPosition={
                  props.showLogo
                    ? props.drag.custom1DragLogo
                    : props.drag.custom1Drag
                }
                position={null}
                handle=".custom_pdf"
                //   grid={[2, 25]}
                scale={1}
                bounds="parent"
                // onStart={handleStart}
                // onDrag={
                onStop={props.drag.handleStopCustom1}
                {...dragHandlers}
              >
                <Row
                  className="custom_pdf"
                  style={styles.font(props.fontSize, props.fontFamily)}
                >
                  <Col xs={24}>
                    <Text type="secondary" strong={true}>
                      {props.edit.custom1}
                    </Text>{" "}
                  </Col>
                  <Col xs={24}>Custom-1</Col>
                </Row>
              </Draggable>
            )}
            {props.edit.custom2Show && props.edit.custom2 && (
              <Draggable
                //   axis='y'
                setCursor={true}
                defaultPosition={
                  props.showLogo
                    ? props.drag.custom2DragLogo
                    : props.drag.custom2Drag
                }
                position={null}
                handle=".custom_pdf"
                //   grid={[2, 25]}
                scale={1}
                bounds="parent"
                // onStart={handleStart}
                // onDrag={handleStopCustom2}
                // onStop={handleStop}
                {...dragHandlers}
              >
                <Row
                  className="custom_pdf"
                  style={styles.font(props.fontSize, props.fontFamily)}
                >
                  <Col xs={24}>
                    <Text type="secondary" strong={true}>
                      {props.edit.custom2}
                    </Text>{" "}
                  </Col>
                  <Col xs={24}>Custom-2</Col>
                </Row>
              </Draggable>
            )}
            {props.edit.custom3Show && props.edit.custom3 && (
              <Draggable
                //   axis='y'
                setCursor={true}
                defaultPosition={
                  props.showLogo
                    ? props.drag.custom3DragLogo
                    : props.drag.custom3Drag
                }
                position={null}
                handle=".custom_pdf"
                //   grid={[2, 25]}
                scale={1}
                bounds="parent"
                // onStart={handleStart}
                onDrag={handleDrag.custom3}
                // onStop={handleStop}
                {...dragHandlers}
              >
                <Row
                  className="custom_pdf"
                  style={styles.font(props.fontSize, props.fontFamily)}
                >
                  <Col xs={24}>
                    <Text type="secondary" strong={true}>
                      {" "}
                      {props.edit.custom3}
                    </Text>{" "}
                  </Col>
                  <Col xs={24}>Custom-3</Col>
                </Row>
              </Draggable>
            )}
          </Col>
          <Col span={24} style={{ heigh: "auto" }}>
            {props.edit.showInvoice && (
              <Draggable
                //   axis='y'
                setCursor={true}
                defaultPosition={props.drag.showInvoiceDrag}
                position={null}
                //   grid={[2, 25]}
                scale={1}
                bounds="parent"
                // onStart={handleStart}
                onDrag={handleDragShowInvoice}
                // onStop={handleStop}
                {...dragHandlers}
              >
                <Row
                  className="footer_page_number_pdf"
                  style={styles.font(props.fontSize, props.fontFamily)}
                >
                  <Col span={24}>
                    {" "}
                    ACCOUNT SUMMARY
                    <Divider style={{ margin: "3px " }} />
                  </Col>
                  <Col span={4}>01/07/2018</Col>
                  <Col span={16}>
                    {" "}
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
                  <Divider style={{ margin: "7px 0px " }} />
                </Row>
              </Draggable>
            )}
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={props.drag.table1Drag}
              position={null}
              //   grid={[2, 25]}
              scale={1}
              bounds="parent"
              // onStart={handleStart}
              onDrag={handleDragTable1}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <Row className="header_pdf">
                <Col span={24}>
                  <Table
                    size="small"
                    tableLayout="fixed"
                    dataSource={props.dataSours}
                    pagination={false}
                    headerClassName="header_pdf1"
                  >
                    {props.edit.date && (
                      <Column
                        title={
                          <div
                            style={styles.tableHeader(
                              props.background,
                              props.fontSize,
                              props.fontFamily
                            )}
                          >
                            Date
                          </div>
                        }
                        dataIndex="date"
                        key="date"
                        className="account_setting_drawer_hover"
                        render={(text, record) => {
                          return {
                            props: {
                              style: styles.font(
                                props.fontSize,
                                props.fontFamily
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
                              props.fontFamily
                            )}
                          >
                            ACTIVITY
                          </div>
                        }
                        dataIndex="activity"
                        key="activity"
                        className="account_setting_drawer_hover"
                        render={(text, record) => {
                          return {
                            props: {
                              style: styles.font(
                                props.fontSize,
                                props.fontFamily
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
                              props.fontFamily
                            )}
                          >
                            DESCRIPTION
                          </div>
                        }
                        width={100}
                        dataIndex="description"
                        key="email"
                        render={(text, record) => {
                          return {
                            props: {
                              style: styles.font(
                                props.fontSize,
                                props.fontFamily
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
                              props.fontFamily
                            )}
                          >
                            TAX
                          </div>
                        }
                        dataIndex="tax"
                        key="tax"
                        render={(text, record) => {
                          return {
                            props: {
                              style: styles.font(
                                props.fontSize,
                                props.fontFamily
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
                              props.fontFamily
                            )}
                          >
                            QTY
                          </div>
                        }
                        dataIndex="qty"
                        key="qty"
                        render={(text, record) => {
                          return {
                            props: {
                              style: styles.font(
                                props.fontSize,
                                props.fontFamily
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
                              props.fontFamily
                            )}
                          >
                            Due
                          </div>
                        }
                        dataIndex="due"
                        key="due"
                        render={(text, record) => {
                          return {
                            props: {
                              style: styles.font(
                                props.fontSize,
                                props.fontFamily
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
                              props.fontFamily
                            )}
                          >
                            RATE
                          </div>
                        }
                        dataIndex="rate"
                        key="rate"
                        render={(text, record) => {
                          return {
                            props: {
                              style: styles.font(
                                props.fontSize,
                                props.fontFamily
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
                              props.fontFamily
                            )}
                          >
                            AMOUNT
                          </div>
                        }
                        dataIndex="amount"
                        key="amount"
                        render={(text, record) => {
                          return {
                            props: {
                              style: styles.font(
                                props.fontSize,
                                props.fontFamily
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
                              props.fontFamily
                            )}
                          >
                            SKU
                          </div>
                        }
                        dataIndex="sku"
                        key="sku"
                        render={(text, record) => {
                          return {
                            props: {
                              style: styles.font(
                                props.fontSize,
                                props.fontFamily
                              ),
                            },
                            children: <div>{text}</div>,
                          };
                        }}
                      />
                    )}
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
              bounds="parent"
              // onStart={handleStart}
              onDrag={handleDrag}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <div
                className="footer_header_pdf"
                style={styles.font(props.fontSize, props.fontFamily)}
              >
                <Paragraph>{props.edit.customerMessage}</Paragraph>
              </div>
            </Draggable>
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={props.drag.totalDrag}
              position={null}
              //   grid={[2, 25]}
              scale={1}
              bounds="parent"
              // onStart={handleStart}
              onDrag={handleDragTotal}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <div className="footer_header_pdf">
                {" "}
                <List
                  itemLayout="horizontal"
                  dataSource={props.data1}
                  size="small"
                  split={false}
                  style={styles.font(props.fontSize, props.fontFamily)}
                  renderItem={(item) => (
                    <List.Item
                      style={{
                        // borderBottom: `1px solid ${gray} `,
                        wordWrap: " break-word",
                        wordBreak: "break-all",

                        padding: "0px",
                      }}
                    >
                      {item.show && (
                        <Row className="num" gutter={5}>
                          <Col xs={12}>
                            <h4> {item.description}</h4>{" "}
                          </Col>
                          <Col xs={12}>{item.content}</Col>
                        </Row>
                      )}
                    </List.Item>
                  )}
                />
                <Row
                  className="footer_list_pdf font_size_pdf"
                  style={styles.font(props.fontSize, props.fontFamily)}
                >
                  <Col xs={12}>BALANCE DUE</Col>
                  <Col xs={12}>AED776.25</Col>
                </Row>
              </div>
            </Draggable>
            {props.edit.estimateSummary && (
              <Draggable
                //   axis='y'
                setCursor={true}
                defaultPosition={props.drag.estimateDrag}
                position={null}
                //   grid={[2, 25]}
                scale={1}
                bounds="parent"
                // onStart={handleStart}
                onDrag={handleDragEstimate}
                // onStop={handleStop}
                {...dragHandlers}
              >
                <Row className="footer_header_pdf num">
                  <Col xs={24} className="num">
                    {" "}
                    <Text
                      style={styles.color(
                        props.background,
                        props.fontSize,
                        props.fontFamily
                      )}
                    >
                      {" "}
                      Estimate summary
                    </Text>
                    <Divider
                      style={{
                        margin: "3px 0px",
                      }}
                    />
                  </Col>
                  <List
                    itemLayout="horizontal"
                    dataSource={props.data2}
                    size="small"
                    className="num"
                    split={false}
                    style={styles.font(props.fontSize, props.fontFamily)}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          // borderBottom: `1px solid ${gray} `,
                          wordWrap: " break-word",
                          wordBreak: "break-all",

                          padding: "0px",
                        }}
                      >
                        <Row style={{ width: "100%" }} gutter={5}>
                          <Col span={12}>
                            <h4> {item.description}</h4>{" "}
                          </Col>
                          <Col span={12}>{item.content}</Col>
                        </Row>
                      </List.Item>
                    )}
                  />
                  <Divider
                    style={{
                      margin: "3px 0px 0px 0px",
                    }}
                  />
                </Row>
              </Draggable>
            )}
            {props.edit.taxSummary && (
              <Draggable
                //   axis='y'
                setCursor={true}
                defaultPosition={props.drag.taxSummaryDrag}
                position={null}
                //   grid={[2, 25]}
                scale={1}
                bounds="parent"
                // onStart={handleStart}
                onDrag={handleDragTaxSummary}
                // onStop={handleStop}
                {...dragHandlers}
              >
                <Row>
                  <Col
                    className="header_pdf"
                    style={styles.font(props.fontSize, props.fontFamily)}
                  >
                    Tax summary
                  </Col>
                </Row>
              </Draggable>
            )}
            <Draggable
              //   axis='y'
              setCursor={true}
              defaultPosition={props.drag.table2Drag}
              position={null}
              //   grid={[2, 25]}
              scale={1}
              bounds="parent"
              // onStart={handleStart}
              onDrag={handleDragTable2}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <Row className="header_pdf">
                <Col span={24}>
                  <Table
                    size="small"
                    tableLayout="fixed"
                    dataSource={props.dataSours1}
                    pagination={false}
                  >
                    <Column
                      render={(text, record) => {
                        return {
                          props: {
                            style: styles.font(
                              props.fontSize,
                              props.fontFamily
                            ),
                          },
                          children: <div>{text}</div>,
                        };
                      }}
                      title={
                        <div
                          style={styles.tableHeader(
                            props.background,
                            props.fontSize,
                            props.fontFamily
                          )}
                        >
                          RATE
                        </div>
                      }
                      dataIndex="rate"
                      key="rate"
                    />
                    <Column
                      render={(text, record) => {
                        return {
                          props: {
                            style: styles.font(
                              props.fontSize,
                              props.fontFamily
                            ),
                          },
                          children: <div>{text}</div>,
                        };
                      }}
                      title={
                        <div
                          style={styles.tableHeader(
                            props.background,
                            props.fontSize,
                            props.fontFamily
                          )}
                        >
                          VAT
                        </div>
                      }
                      dataIndex="vat"
                      key="vat"
                    />
                    <Column
                      render={(text, record) => {
                        return {
                          props: {
                            style: styles.font(
                              props.fontSize,
                              props.fontFamily
                            ),
                          },
                          children: <div>{text}</div>,
                        };
                      }}
                      title={
                        <div
                          style={styles.tableHeader(
                            props.background,
                            props.fontSize,
                            props.fontFamily
                          )}
                        >
                          NET
                        </div>
                      }
                      dataIndex="net"
                      key="net"
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
              bounds="parent"
              // onStart={handleStart}
              onDrag={handleDragPaymentDetails}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <Row style={styles.font(props.fontSize, props.fontFamily)}>
                <Col
                  span={24}
                  className="footer_header_pdf"
                  style={styles.paymentDetails(props.background)}
                >
                  {props.edit.paymentDetails}
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
              bounds="parent"
              // onStart={handleStart}
              onDrag={handleDragFooter}
              // onStop={handleStop}
              {...dragHandlers}
            >
              <Row
                className="header_pdf"
                style={styles.font(props.fontSize, props.fontFamily)}
              >
                <Col span={24}>
                  {props.edit.footerText}
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
    padding: fitWindow ? "20px" : `${top}px ${right}px ${bottom}px ${left}px`,
  }),
  tableHeader: (background, fontSize, fontFamily) => ({
    background: `${background}`,
    paddingInlineStart: "8px",
    paddingTop: "4px",
    paddingBottom: "4px",
    fontSize: fontSize,
    fontFamily: fontFamily,
  }),
  paymentDetails: (background) => ({
    background: `${background}`,
    padding: "2px 8px",
    marginBottom: "60px",
  }),
};
