import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  Checkbox,
  message,
  InputNumber,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useMediaQuery } from "../MediaQurey";
import { connect } from "react-redux";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import i18n from "../../i18n";

const { Option } = Select;

const EditSettings = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const isTablet = useMediaQuery("(max-width:768px)");
  const isMobile = useMediaQuery("(max-width:425px)");
  const database = useDatabase();
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onFinish = () => {
    form
      .validateFields()
      .then(async (values) => {
        let units = database.collections.get("units");
        database.action(async () => {
          await units.create((unit) => {
            unit.name = values.name;
            unit.symbol = values.symbol;
          });
        });
        setVisible(false);
        form.resetFields();
        message.info(`${t("Message.Add")} ${values.name}`);
      })
      .catch((info) => {
        message.error(`${info}`);
      });
    // 
  };

  return (
    <div>
      <span onClick={showDrawer}>
        {/* {t("Sales.Product_and_services.New")} */}
        {t("Taxes.Edit_settings")}
      </span>
      <Drawer
        maskClosable={false}
        title={t("Taxes.Edit_tax_rate_settings")}
        width={isMobile ? "80%" : isTablet ? "45%" : "30%"}
        onClose={onClose}
        open={visible}
        placement={i18n.language === "en" ? "right" : "left"}
        footer={
          <div style={styles.footer(props.rtl)}>
            <Button onClick={onClose} shape="round" style={styles.cancel}>
              {t("Form.Cancel")}
            </Button>
            <Button
              onClick={onFinish}
              htmlType="submit"
              shape="round"
              type="primary"
            >
              {t("Form.Save")}
            </Button>
          </div>
        }
      >
        <Form layout="vertical" hideRequiredMark form={form}>
          <Row>
            <Col span={24}>
              <Form.Item
                name="name"
                label={
                  <p>
                    {t("Taxes.Form.Tax_agency_name")}

                    <span className="star">*</span>
                  </p>
                }
                style={styles.margin}
                rules={[
                  { required: true, message: `${t("Form.Name_required")}` },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t("Taxes.Form.Start_of_tax_period")}
                style={styles.margin}
                name="startTaxPeriod"
              >
                <Select>
                  <Select.Option value="January">
                    {" "}
                    {t("Months.January")}{" "}
                  </Select.Option>
                  <Select.Option value="February">
                    {t("Months.February")}
                  </Select.Option>
                  <Select.Option value="March">
                    {t("Months.March")}
                  </Select.Option>
                  <Select.Option value="April">
                    {t("Months.April")}
                  </Select.Option>
                  <Select.Option value="May">{t("Months.May")}</Select.Option>
                  <Select.Option value="June">{t("Months.June")}</Select.Option>
                  <Select.Option value="July">{t("Months.July")}</Select.Option>
                  <Select.Option value="August">
                    {t("Months.August")}
                  </Select.Option>
                  <Select.Option value="September">
                    {t("Months.September")}
                  </Select.Option>
                  <Select.Option value="October">
                    {t("Months.October")}
                  </Select.Option>
                  <Select.Option value="November">
                    {t("Months.November")}
                  </Select.Option>
                  <Select.Option value="December">
                    {t("Months.December")}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="filingFrequency"
                label={t("Taxes.Form.Filing_frequency")}
                style={styles.margin}
              >
                <Select>
                  <Select.Option value="Monthly">
                    {t("Months.Monthly")}
                  </Select.Option>
                  <Select.Option value="Quarterly">
                    {t("Months.Quarterly")}
                  </Select.Option>
                  <Select.Option value="Half-yearly">
                    {t("Months.Half-yearly")}
                  </Select.Option>
                  <Select.Option value="Yearly">
                    {t("Months.Yearly")}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="reportingMethod"
                label={t("Taxes.Form.Reporting_method")}
                style={styles.margin}
              >
                <Select>
                  <Select.Option value="Accrual">
                    {t("Taxes.Form.Accrual")}{" "}
                  </Select.Option>
                  <Select.Option value="Cash">
                    {t("Taxes.Form.Cash")}{" "}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="businessIdNo"
                label={<p>{t("Expenses.Suppliers.Business_id_no")}</p>}
                style={styles.margin}
              >
                <InputNumber
                  className="num"
                  min={0}
                  type="number"
                  inputMode="numeric"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};
const styles = {
  margin: { marginBottom: "12px" },
  cancel: { margin: " 0 8px" },
  footer: (rtl) => ({
    textAlign: rtl ? "left" : "right",
  }),
};
const mapStateToProps = (state) => ({
  products: state.products.products,
  rtl: state.direction.rtl,
});
export default connect(mapStateToProps)(EditSettings);
