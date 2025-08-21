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
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useMediaQuery } from "../../MediaQurey";
import { connect } from "react-redux";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import i18n from "../../../i18n";
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const AddTaxRates = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const isTablet = useMediaQuery("(max-width:768px)");
  const isMobile = useMediaQuery("(max-width:425px)");
  const database = useDatabase();
  const [sales, setSales] = useState(false);
  const [purchases, setPurchases] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  //tex rate section
  const onCheckSales = () => {
    setSales(!sales);
  };
  const onCheckPurchases = () => {
    setPurchases(!purchases);
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
      <Button type="primary" shape="round" className="num" onClick={showDrawer}>
        {t("Sales.Product_and_services.New")}
      </Button>
      <Drawer
        maskClosable={false}
        title={t("Taxes.Tax_rates.Add_tax_rate")}
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
              <Paragraph>{t("Taxes.Tax_rates.Name_description")}</Paragraph>
            </Col>
            <Col span={24}>
              <Form.Item
                name="name"
                label={
                  <p>
                    {t("Form.Name")} <span className="star">*</span>
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
              <Form.Item name="description" label={t("Form.Description")}>
                <Input.TextArea showCount />
              </Form.Item>
            </Col>
            <Col span={24}>
              {" "}
              <Text strong={true}> {t("Taxes.Tax_rates.Tax_agency")}</Text>
              <br />
              <Text> {t("Taxes.Tax_rates.Tax_rate")}</Text>
            </Col>
            <Col span={24} className="Add_tax_agency">
              <Form.Item name="sales" style={styles.checked}>
                <Checkbox
                  checked={sales}
                  onChange={onCheckSales}
                  style={styles.text}
                >
                  {t("Sales.1")}
                </Checkbox>
              </Form.Item>
              {sales && (
                <Row className="num">
                  <Col span={24}>
                    <Form.Item
                      label={t("Taxes.Tax_rates.Sales_rate")}
                      style={styles.margin}
                    >
                      <Form.Item name="salesRate" noStyle>
                        <InputNumber
                          min={0}
                          type="number"
                          inputMode="numeric"
                        />
                      </Form.Item>
                      <span className="ant-form-text"> %</span>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label={t("Accounting.Account")}
                      style={styles.margin}
                    >
                      <Select>
                        <Select.Option value="liability">
                          {t("Taxes.Tax_rates.Liability")}
                        </Select.Option>
                        <Select.Option value="expense">
                          {" "}
                          {t("Expenses.Expense")}
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label={t(
                        "Taxes.Tax_rates.Show_tax_amount_on_return_line"
                      )}
                      style={styles.margin}
                    >
                      <Select>
                        <Select.Option value="Other adjustments">
                          {t("Taxes.Tax_rates.Other_adjustments")}
                        </Select.Option>
                        <Select.Option value="Tax collected on sales">
                          {t("Taxes.Tax_rates.Tax_collected_sales")}
                        </Select.Option>
                        <Select.Option value="Adjustments to tax on sales">
                          {t("Taxes.Tax_rates.Adjustments_tax_sales")}
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label={t("Taxes.Tax_rates.Show_amount_return_line")}
                      style={styles.margin}
                    >
                      <Select>
                        <Select.Option value="Total taxable sales in period, before tax">
                          {t("Taxes.Tax_rates.Total_taxable_sales_period")}
                        </Select.Option>
                        <Select.Option value="Not applicable (N/A)">
                          {t("Taxes.Tax_rates.Not_applicable")}
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              )}
              <Form.Item name="purchases" style={styles.margin}>
                <Checkbox
                  checked={purchases}
                  onChange={onCheckPurchases}
                  style={styles.text}
                >
                  {t("Taxes.Tax_rates.Purchases")}
                </Checkbox>
              </Form.Item>
              {purchases && (
                <Row className="num">
                  <Col span={24}>
                    <Form.Item
                      label={t("Taxes.Tax_rates.Purchases_rate")}
                      style={styles.margin}
                    >
                      <Form.Item name="Purchases rate" noStyle>
                        <InputNumber min={0} />
                      </Form.Item>
                      <span className="ant-form-text"> %</span>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label={t("Accounting.Account")}
                      style={styles.margin}
                    >
                      <Select>
                        <Select.Option value="liability">
                          {t("Taxes.Tax_rates.Liability")}
                        </Select.Option>
                        <Select.Option value="expense">
                          {t("Expenses.Expense")}
                        </Select.Option>
                        <Select.Option value="Not Tracking">
                          {t("Taxes.Tax_rates.Not_tracking")}
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label={t(
                        "Taxes.Tax_rates.Show_tax_amount_on_return_line"
                      )}
                      style={styles.margin}
                    >
                      <Select>
                        <Select.Option value="Tax reclaimable on purchases">
                          {t("Taxes.Tax_rates.Tax_reclaimable_purchases")}
                        </Select.Option>
                        <Select.Option value="Adjustments to reclaimable tax on purchases">
                          {t(
                            "Taxes.Tax_rates.Adjustments_reclaimable_tax_purchases"
                          )}
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label={t("Taxes.Tax_rates.Show_amount_return_line")}
                      style={styles.margin}
                    >
                      <Select>
                        <Select.Option value="Total taxable purchases in period, before tax">
                          {t("Taxes.Tax_rates.Total_taxable_purchases_period")}
                        </Select.Option>
                        <Select.Option value="Not applicable (N/A)">
                          {t("Taxes.Tax_rates.Not_applicable")}
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              )}
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
  checked: { marginBottom: "0px" },
};
const mapStateToProps = (state) => ({
  products: state.products.products,
  rtl: state.direction.rtl,
});
export default connect(mapStateToProps)(AddTaxRates);
