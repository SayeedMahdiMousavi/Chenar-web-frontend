import {
  Button,
  Col,
  Descriptions,
  Form,
  Progress,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { Card, ThemeButton } from "../../components";
import { Statistics } from "../../components/antd";
import { CalendarFillIcon, GlobalFillIcon } from "../../icons";
import { Colors } from "../colors";

const { Paragraph, Text } = Typography;
export default function LoginSetting() {
  const handleClickTheme = () => {};
  const languageList = [{ symbol: "xc", name: "English" }];
  const calendarList = [{ id: 1, name: "Gregory" }];
  return (
    <Row className="login__setting">
      <Col
        style={{
          backgroundColor: "white",
          height: "100vh",
          width: "400px",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Space align="start">
          <ThemeButton
            onClick={handleClickTheme}
            shape={undefined}
            type="default"
            // style={{ backgroundColor: "white" }}
          />
          <Form.Item name="language">
            <Select
              labelInValue
              style={{ width: "120px", borderRadius: "10px" }}
              optionLabelProp="label"
              placeholder={
                <React.Fragment>
                  <GlobalFillIcon />
                  &nbsp;
                </React.Fragment>
              }
            >
              {languageList?.map((item) => (
                <Select.Option
                  value={item?.symbol}
                  key={item?.symbol}
                  label={
                    <React.Fragment>
                      <GlobalFillIcon />
                      &nbsp;
                      {item?.name}
                    </React.Fragment>
                  }
                >
                  {item?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="calendar">
            <Select
              labelInValue
              style={{ width: "120px" }}
              optionLabelProp="label"
              placeholder={
                <React.Fragment>
                  <CalendarFillIcon />
                  &nbsp;
                </React.Fragment>
              }
            >
              {calendarList?.map((item) => (
                <Select.Option
                  value={item?.id}
                  key={item?.id}
                  label={
                    <React.Fragment>
                      <CalendarFillIcon />
                      &nbsp;
                      {item?.name}
                    </React.Fragment>
                  }
                >
                  {item?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Space>
        <div>
          <h2 className="box-layout__title" style={{ textAlign: "start" }}>
            Choose Fiscal Year
          </h2>
          <Form.Item name="fiscalYear" label="Fiscal Year">
            <Select labelInValue>
              {calendarList?.map((item) => (
                <Select.Option value={item?.id} key={item?.id}>
                  {item?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="branch"
            label="Branch"
            style={{ marginBottom: "24px" }}
          >
            <Select labelInValue>
              {calendarList?.map((item) => (
                <Select.Option value={item?.id} key={item?.id}>
                  {item?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="num"
              // loading={loading}
            >
              Log in
            </Button>
          </Form.Item>
        </div>
        <div style={{ height: "100px" }}></div>
      </Col>
      <Col
        span={18}
        style={{ width: "calc(100% - 400px)", padding: "45px 0px" }}
      >
        <Row justify="space-around">
          <Col
            span={16}
            style={{
              height: "600px",
              backgroundColor: "white",
              borderRadius: "15px",
              opacity: 0.7,
              padding: "32px",
            }}
          >
            <Space direction="vertical" size={25}>
              <div>
                <Text strong>Fiscal year</Text>
                <Paragraph>
                  <ul style={{ listStyle: "disc" }}>
                    <li>
                      دوره های مالی گذشته، صرفاً قابلیت مرور کردن را دارا
                      میباشد. نمیتوان هیچگونه تغییراتی در آن اعمال نمود
                    </li>
                    <li>
                      برای ایجاد دوره مالی جدید، به منوی حسابداری دوره مالی بستن
                      دوره مالی مراجعه نمایید
                    </li>
                  </ul>
                </Paragraph>
              </div>
              <div>
                <Text strong>Branches</Text>
                <Paragraph>
                  <ul style={{ listStyle: "disc" }}>
                    <li>
                      دوره های مالی گذشته، صرفاً قابلیت مرور کردن را دارا
                      میباشد. نمیتوان هیچگونه تغییراتی در آن اعمال نمود
                    </li>
                    <li>
                      برای ایجاد دوره مالی جدید، به منوی حسابداری دوره مالی بستن
                      دوره مالی مراجعه نمایید
                    </li>
                  </ul>
                </Paragraph>
              </div>
              <Row justify="center">
                <Col style={{ width: "390px", marginTop: "40px" }}>
                  <Space direction="vertical" size={15}>
                    <Row justify="space-between">
                      <Col>Active package</Col>
                      <Col>
                        <Link to="#">Renew the package</Link>
                      </Col>
                    </Row>

                    <Card
                      style={{
                        backgroundImage: `linear-gradient(to top right,#47DFCD,50%,#21C0AD)`,
                        height: "164px",
                        color: "white",
                      }}
                    >
                      <Space>
                        <Progress
                          percent={60}
                          strokeColor="#11B19E"
                          trailColor="#B1FFF5"
                          type="circle"
                          strokeWidth={10}
                          format={(percent) => (
                            <div style={styles.statistic}>{percent}%</div>
                          )}
                          style={styles.statistic}
                        />
                        <Space direction="vertical">
                          <Text strong style={styles.statistic}>
                            One year old bronze package
                          </Text>
                          <Descriptions
                            column={1}
                            size="small"
                            labelStyle={styles.statistic}
                          >
                            <Descriptions.Item label="Consumed">
                              <Statistics
                                value={238}
                                suffix="day"
                                valueStyle={styles.statistic}
                              />
                            </Descriptions.Item>
                            <Descriptions.Item label="left over">
                              <Statistics
                                value={127}
                                suffix="day"
                                valueStyle={styles.statistic}
                              />
                            </Descriptions.Item>
                          </Descriptions>
                        </Space>
                      </Space>
                    </Card>
                  </Space>
                </Col>
              </Row>
            </Space>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

const styles = {
  statistic: { color: Colors.white },
};
