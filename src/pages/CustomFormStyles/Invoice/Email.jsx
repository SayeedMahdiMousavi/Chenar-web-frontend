import React from "react";
import {
  Row,
  Col,
  Descriptions,
  Divider,
  Typography,
  Button,
  Space,
  Avatar,
} from "antd";
const { Title, Text, Paragraph } = Typography;
export default function Email(props) {
  return (
    <Row className="custom_form_style_pdf">
      <Col span={24} className="email_title_pdf">
        <Descriptions
          column={{ xxl: 1, xl: 1, lg: 3, md: 3, sm: 2, xs: 1 }}
          colon={false}
        >
          <Descriptions.Item label="Subject">
            {props.active === "1"
              ? `${props.emailData.standardSubject}`
              : `${props.emailData.reminderSubject}`}
          </Descriptions.Item>
          <Descriptions.Item label="Form">
            quickbooks@notification.intuit.com
          </Descriptions.Item>
        </Descriptions>
      </Col>
      <Divider style={styles.margin} />
      <Col span={24} className={"page-body-offline"}>
        <Row justify="middle">
          <Col span={22} offset={1} className="email_content_pdf">
            {/* <Divider className='email_divider_pdf' /> */}
            <Row>
              <Col span={24} className="text_align_center">
                {" "}
                <Text strong={true} type="secondary">
                  {props.details === "summary"
                    ? "TAX INVOICE 12345"
                    : "TAX INVOICE 12345 DETAILS"}
                </Text>
              </Col>
              <Col span={24}>
                <Row
                  justify="center"
                  align="middle"
                  className="email_content_title_pdf"
                >
                  <Col>
                    <Title level={4}> {props.edit.titleContent}</Title>{" "}
                  </Col>
                </Row>
              </Col>
              <Col span={22} offset={2}>
                <Paragraph>
                  {props.active === "1" ? (
                    <div>
                      {props.emailData.standardGreeting && (
                        <div>
                          {props.emailData.standardEmailTo} [customer{" "}
                          {props.emailData.standardCustomerGreeting}]
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {props.emailData.reminderGreeting && (
                        <div>
                          {props.emailData.reminderEmailTo} [customer{" "}
                          {props.emailData.reminderCustomerGreeting}]
                        </div>
                      )}
                    </div>
                  )}
                </Paragraph>

                <Paragraph>
                  {props.active === "1" ? (
                    <span>{props.emailData.standardCustomerMessage}</span>
                  ) : (
                    <span>{props.emailData.reminderCustomerMessage} </span>
                  )}
                </Paragraph>
              </Col>
              <Col span={24} className="email_content_amount_pdf">
                <Title level={4}>DUE 02/06/2018</Title>

                <Paragraph>
                  {" "}
                  <Title level={1}>AED776.25</Title>{" "}
                </Paragraph>
                <Paragraph>
                  <Button type="primary">Print or save</Button>
                </Paragraph>
                <Paragraph>
                  <Text className="email_power_pdf">Powered by Accounting</Text>
                </Paragraph>
              </Col>
            </Row>
            {props.details === "full" && (
              <Row>
                <Col span={24} className="email_content_bill_pdf">
                  <Row justify="space-around">
                    <Col span={20}>
                      <Row>
                        <Col span={9}>
                          {" "}
                          <Title level={4}>Bill to</Title>
                        </Col>
                        <Col span={15}>
                          <Paragraph>
                            {" "}
                            <Text strong={true}>
                              Smith Co.
                              <br /> 123 Main Street
                              <br /> City, CA 12345
                              <br /> VAT Registration No. GB987654321
                            </Text>
                          </Paragraph>{" "}
                        </Col>
                        <Divider dashed={true} />
                        <Col span={9}>
                          <Title level={4}>Terms</Title>
                        </Col>
                        <Col span={15}>
                          {" "}
                          <Paragraph>
                            {" "}
                            <Text strong={true}>Net 30</Text>
                          </Paragraph>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col span={24} className="email_content_item_name_pdf">
                  <Row justify="space-around">
                    <Col span={20}>
                      <Paragraph>
                        <Row>
                          <Col span={24}>01/07/2018</Col>
                          <Col span={24}>
                            <Row justify="space-between">
                              <Col>
                                <Title level={4}>Item name</Title>
                              </Col>
                              <Col>
                                {" "}
                                <Text strong={true}>AED450.00</Text>
                              </Col>
                            </Row>
                          </Col>
                          <Col span={24}>Description of the item</Col>
                          <Col span={24}>
                            2 X AED225.00 &nbsp; &nbsp;20.0% S
                          </Col>
                        </Row>
                      </Paragraph>

                      <Row>
                        <Col span={24}>01/07/2018</Col>
                        <Col span={24}>
                          <Row justify="space-between">
                            <Col>
                              <Title level={4}>Item name</Title>
                            </Col>
                            <Col>
                              {" "}
                              <Text strong={true}>AED450.00</Text>
                            </Col>
                          </Row>
                        </Col>

                        <Col span={24}>Description of the item</Col>
                        <Col span={24}>1 X AED225.00 &nbsp; &nbsp;5.0% R</Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Divider dashed={true} />
                <Col span={24} className="email_content_total_pdf">
                  <Row justify="space-around">
                    <Col span={20}>
                      <Row>
                        <Col span={12} offset={12}>
                          <Row justify="space-between">
                            <Col>
                              <Title level={4}>Subtotal</Title>{" "}
                              <Title level={4}>Total tax</Title>{" "}
                              <Title level={4}>Total</Title>{" "}
                              <Title level={4}>Balance due</Title>{" "}
                            </Col>
                            <Col>
                              <Title level={4}> AED675.00</Title>{" "}
                              <Title level={4}> AED675.00</Title>{" "}
                              <Title level={4}> AED675.00</Title>{" "}
                              <Title level={4}> AED675.00</Title>{" "}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col span={24} className="email_content_bill_pdf">
                  <Row justify="space-around">
                    <Col span={20}>
                      <Row>
                        <Col span={24}>
                          <Title level={4}>Tax summary</Title>
                        </Col>
                        <Col span={24}>
                          <Text strong={true}>20.0% S</Text>
                        </Col>
                        <Col span={24}>
                          <Row justify="space-between">
                            <Col>
                              <Paragraph>
                                <Text strong={true}>Net Aed450.00</Text>
                              </Paragraph>
                            </Col>
                            <Col>
                              <Text strong={true}>AED90.00</Text>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={24}>
                          <Text strong={true}>5.0% R</Text>
                        </Col>
                        <Col span={24}>
                          <Row justify="space-between">
                            <Col>
                              <Text strong={true}>Net Aed225.00</Text>
                            </Col>
                            <Col>
                              <Text strong={true}>AED11.25</Text>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col span={24} className="email_content_estimate_pdf">
                  <Row justify="space-around">
                    <Col span={20}>
                      <Row>
                        <Col span={24}>
                          <Title level={4}>Estimate summary</Title>
                        </Col>
                        <Col span={24}>
                          <Row justify="space-between">
                            <Col>
                              <Title level={4} style={styles.marginBottom}>
                                Estimate #1008
                              </Title>
                              <Text strong={true}>Invoice #1007</Text>
                              <br />

                              <Text strong={true}>This invoice #12345</Text>
                              <br />

                              <Text strong={true}>Total invoiced</Text>
                            </Col>
                            <Col>
                              <Title level={4} style={styles.marginBottom}>
                                AED200.00
                              </Title>
                              <Text strong={true}>AED776.25</Text>
                              <br />

                              <Text strong={true}>AED776.25</Text>
                              <br />

                              <Text strong={true}>AED776.25</Text>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col span={24} className="email_content_customer_message_pdf">
                  <Row justify="space-around">
                    <Col span={20}>
                      <Paragraph strong={true} style={styles.margin}>
                        {" "}
                        {props.edit.customerMessage}
                      </Paragraph>
                    </Col>
                  </Row>
                </Col>
                <Divider dashed={true} />
                <Col span={24}>
                  <Row justify="space-around">
                    <Col span={20}>
                      <Space direction="vertical" size="large">
                        <div>
                          <Paragraph strong={true} style={styles.margin}>
                            {props.edit.footerText}{" "}
                          </Paragraph>
                        </div>
                        <div className="text_align_center">
                          <Button type="primary">Print or save</Button>
                        </div>
                      </Space>
                    </Col>
                  </Row>
                </Col>
                <Divider dashed={true} />
              </Row>
            )}
            <Row>
              {props.details === "summary" && (
                <Divider dashed={true} className="email_content_divider_pdf" />
              )}
              <Col span={24}>
                <Row justify="space-around">
                  <Col span={20}>
                    <Space direction="vertical" size="large">
                      <div className="text_align_center">
                        {" "}
                        {props.edit.titleContent}
                      </div>
                      <div className="text_align_center">
                        {props.edit.phone} &nbsp; &nbsp;{props.edit.email}
                      </div>
                    </Space>
                  </Col>
                </Row>
              </Col>
              <Divider dashed={true} />
              <Col span={24}>
                <Row justify="space-around">
                  <Col span={20}>
                    <Paragraph>
                      If you receive an email that seems fraudulent, please
                      check with the business owner before paying.
                    </Paragraph>
                    <Row gutter={[0, 40]}>
                      <Col span={24} className="text_align_center">
                        <a href="#">
                          <Avatar src="images/logo.png" /> Accounting
                        </a>
                      </Col>
                      <Col span={24} className="text_align_center">
                        © Intuit, Inc. All rights reserved. &nbsp; &nbsp;{" "}
                        <a href="#">Privacy</a> |<a href="#"> Security</a> |
                        <a href="#"> Terms of Service</a>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
const styles = {
  margin: { margin: "0px" },
  marginBottom: { marginBottom: "2px" },
};
