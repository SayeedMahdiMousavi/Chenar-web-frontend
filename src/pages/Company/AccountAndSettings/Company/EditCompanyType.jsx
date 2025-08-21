import React from "react";
import { useMediaQuery } from "../../../MediaQurey";
import { useTranslation } from "react-i18next";
import { Form, Button, Col, Row, Select, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Text } = Typography;
export default function EditCompanyType(props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const isTablet = useMediaQuery("(max-width: 575px)");
  const isMobile = useMediaQuery("(max-width: 425px)");
  const onTypeClick = () => {
    props.setInfo(false);
    props.setName(false);
    props.setAddress(false);
    props.setType(true);
  };
  const cancel = () => {
    props.setType(false);
  };
  const onFinish = () => {};
  return (
    <div>
      {props.type ? (
        <Form form={form} onFinish={onFinish}>
          <Row gutter={[5, 15]} className="account_setting_drawer_name">
            <Col lg={5} sm={6} xs={24} style={styles.title(isTablet)}>
              {" "}
              <Text strong={true}> {t("Company.Company_type")}</Text>
            </Col>
            <Col lg={7} sm={8} xs={isMobile ? 24 : 10}>
              {" "}
              <Text strong={true}> {t("Company.Company_type")}</Text>
            </Col>
            <Col lg={10} sm={12} xs={isMobile ? 24 : 14}>
              {" "}
              <Form.Item name="type" style={styles.margin}>
                <Select>
                  <Option value="Sole proprietor">
                    {t("Company.Form.Sole_proprietor")}
                  </Option>

                  <Option value="Partisanship of limited liability company">
                    {t("Company.Form.Partisanship_limited_liability_company")}
                  </Option>
                  <Option value="Small business corporation, two or more owners">
                    {t("Company.Form.Small_business_corporation")}
                  </Option>
                  <Option value="Corporation, one or more shareholders">
                    {t("Company.Form.Corporation")}
                  </Option>
                  <Option value="Non profile organization">
                    {t("Company.Form.Non_profile_organization")}
                  </Option>
                  <Option value="Limited liability">
                    {t("Company.Form.Limited_liability")}
                  </Option>
                  <Option value="No sure/Other/None">
                    {t("Company.Form.No_sure/Other/None")}
                  </Option>
                </Select>
              </Form.Item>{" "}
            </Col>
            {/* <Col lg={5} sm={0} xs={0}></Col> */}
            {/* <Col lg={5} sm={6} xs={0}></Col> */}
            {/* <Col lg={7} sm={8} xs={isMobile ? 24 : 10}>
              {" "}
              <Text strong={true}> {t("Company.Industry")}</Text>
            </Col>
            <Col lg={10} sm={12} xs={isMobile ? 24 : 14}>
              {" "}
              <Form.Item name='industry' style={styles.margin}>
                <Select dropdownMatchSelectWidth={false}>
                  <Option value='Accommodation and Food Services'>
                    {t("Company.Form.Accommodation_food_services")}
                  </Option>
                  <Option value='Administration and Support Services'>
                    {t("Company.Form.Administration_support_services")}
                  </Option>
                  <Option value=' Arts and Recreation Services'>
                    {t("Company.Form.Arts_recreation_services")}
                  </Option>
                  <Option value='Construction/Builder'>
                    {t("Company.Form.Construction/Builder")}
                  </Option>
                  <Option value='Education and Training'>
                    {t("Company.Form.Education_training")}
                  </Option>
                  <Option value='Farming forestry and fishing'>
                    {t("Company.Form.Farming_forestry_fishing")}
                  </Option>
                  <Option value='Financial services & insurance'>
                    {t("Company.Form.Financial_insurance")}
                  </Option>
                  <Option value='Manufacturing'>
                    {t("Company.Form.Manufacturing")}
                  </Option>
                  <Option value='Medical / Health Care /Community service'>
                    {t("Company.Form.Medical")}
                  </Option>
                  <Option value='Personal ,Beauty ,wellbeing and other Service'>
                    {t("Company.Form.Personal_Beauty_wellbeing")}
                  </Option>
                  <Option value='Professional Services'>
                    {t("Company.Form.Professional")}
                  </Option>
                  <Option value='Property Operators and Real Estate Services'>
                    {t("Company.Form.Property_operators")}
                  </Option>
                  <Option value='Rental and Hiring  Service (no Real Estate  )'>
                    {t("Company.Form.Rental_Hiring")}
                  </Option>
                  <Option value='Repair and Maintenance(Automotive & Property )'>
                    {t("Company.Form.Repair_maintenance")}
                  </Option>
                  <Option value='Retail Trade '>
                    {t("Company.Form.Retail_Trade")}
                  </Option>
                  <Option value='Retail Trade & Ecommerce (No-Food  )'>
                    {t("Company.Form.Retail_Trade_Ecommerce")}
                  </Option>
                  <Option value='Technology /Telecommunication Services'>
                    {t("Company.Form.Technology")}
                  </Option>
                  <Option value='Trades Work'>
                    {t("Company.Form.Trades_work")}
                  </Option>
                  <Option value='Transport, Logistics,Postal,Warehousing'>
                    {t("Company.Form.Transport_logistics")}
                  </Option>
                  <Option value='Wholesale Trade'>
                    {t("Company.Form.Wholesale_trade")}{" "}
                  </Option>
                  <Option value='Other'>{t("Sales.Customers.Other")}</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col lg={5} sm={0} xs={0}></Col> */}
            <Col lg={12} sm={14} xs={isMobile ? 0 : 10}></Col>
            <Col lg={12} sm={14} xs={isMobile ? 0 : 10}></Col>

            <Col lg={12} sm={10} xs={isMobile ? 24 : 14}>
              {" "}
              <Button htmlType="button" shape="round" onClick={cancel}>
                {t("Form.Cancel")}
              </Button>{" "}
              <Button
                type="primary"
                shape="round"
                htmlType="submit"
                style={styles.cancel}
              >
                {t("Form.Save")}
              </Button>
            </Col>
          </Row>
        </Form>
      ) : (
        <Row
          className="account_setting_drawer_hover line_height account_setting_drawer_name"
          onClick={onTypeClick}
        >
          <Col lg={5} sm={6} xs={24}>
            {" "}
            <Text strong={true}>{t("Company.Company_type")}</Text>
          </Col>
          <Col lg={7} sm={8} xs={10}>
            {" "}
            <Text>{t("Company.Company_type")}</Text>
            {/* <br />
            <Text> {t("Company.Industry")}</Text> */}
          </Col>
          <Col lg={12} sm={10} xs={14}>
            <Row justify="space-between">
              <Col>
                {" "}
                <Text> {props.data?.type}</Text>
                {/* <br />
                <Text>Wholesale Trade</Text> */}
              </Col>
              <Col>
                <EditOutlined className="font" />
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </div>
  );
}
const styles = {
  margin: { margin: "0rem" },
  cancel: { margin: "10px 10px" },
  title: (isTablet) => ({
    textAlign: isTablet ? "center" : "",
    padding: isTablet ? "23px 0px 23px 0px" : "",
  }),
};
