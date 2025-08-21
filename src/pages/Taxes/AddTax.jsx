import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  Typography,
  Divider,
  InputNumber,
  Space,
} from 'antd';

import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useMediaQuery } from '../MediaQurey';
import { connect } from 'react-redux';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import i18n from '../../i18n';
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const AddTax = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState('add');
  const isTablet = useMediaQuery('(max-width:768px)');
  const isMobile = useMediaQuery('(max-width:576px)');
  const isSubMobile = useMediaQuery('(max-width:425px)');
  const [sales, setSales] = useState(false);
  const [purchases, setPurchases] = useState(false);
  const [salesRate, setSalesRate] = useState(false);
  const [purchasesRate, setPurchasesRate] = useState(false);
  const database = useDatabase();
  //tex rate section
  const onCheckSales = () => {
    setSales(!sales);
  };
  const onCheckPurchases = () => {
    setPurchases(!purchases);
  };
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
    setCurrent('add');
  };
  //custom tax section
  const onCheckSalesRate = () => {
    setSalesRate(!salesRate);
  };
  const onCheckPurchasesRate = () => {
    setPurchasesRate(!purchasesRate);
  };
  const onFinish = () => {
    form
      .validateFields()
      .then(async (values) => {
        let units = database.collections.get('units');
        database.action(async () => {
          await units.create((unit) => {
            unit.name = values.name;
            unit.symbol = values.symbol;
          });
        });
        setVisible(false);
        form.resetFields();
        message.info(`${t('Message.Add')} ${values.name}`);
      })
      .catch((info) => {
        message.error(`${info}`);
      });
    //
  };
  const onClickTaxRate = () => {
    setCurrent('tax rate');
  };
  const onClickGroupRate = () => {
    setCurrent('group rate');
  };
  const onClickCustomTax = () => {
    setCurrent('custom tax');
  };
  const onClickBack = () => {
    setCurrent('add');
  };
  return (
    <div>
      <Button type='primary' className='num' shape='round' onClick={showDrawer}>
        {t('Taxes.Add_tax')}
      </Button>
      <Drawer
        maskClosable={false}
        title={t('Taxes.Add_tax')}
        width={
          isSubMobile ? '100%' : isMobile ? '80%' : isTablet ? '60%' : '33%'
        }
        onClose={onClose}
        open={visible}
        placement={i18n.language === 'en' ? 'right' : 'left'}
        footer={
          <div style={styles.footer(props.rtl)}>
            <div>
              {' '}
              {current === 'add' ? (
                <Button onClick={onClose} shape='round' style={styles.cancel}>
                  {t('Form.Cancel')}
                </Button>
              ) : (
                <Button
                  onClick={onClickBack}
                  shape='round'
                  style={styles.cancel}
                >
                  {t('Form.Back')}
                </Button>
              )}
            </div>
            <div>
              <Button
                onClick={onFinish}
                htmlType='submit'
                shape='round'
                type='primary'
              >
                {t('Form.Save')}
              </Button>
            </div>
          </div>
        }
      >
        <Form layout='vertical' hideRequiredMark form={form}>
          {current === 'add' ? (
            <div>
              <Text strong={true}> {t('Taxes.Add_tax_description')}</Text>
              <Divider className='num' style={styles.divider} />
              <Row className='cursor' onClick={onClickTaxRate}>
                <Col span={24}>
                  {' '}
                  <Text strong={true}>{t('Taxes.Tax_rates.Tax_rate')}</Text>
                  <br />
                  <br />
                  <Paragraph>{t('Taxes.Tax_rate_description')}</Paragraph>
                </Col>
              </Row>
              <Divider className='num' style={styles.divider} />
              <Row className='cursor' onClick={onClickGroupRate}>
                <Col span={24}>
                  {' '}
                  <Text strong={true}>{t('Taxes.Group_rate')}</Text>
                  <br />
                  <br />
                  <Paragraph>{t('Taxes.Group_rate_description')}</Paragraph>
                </Col>
              </Row>
              <Divider className='num' style={styles.divider} />
              <Row className='cursor' onClick={onClickCustomTax}>
                <Col span={24}>
                  {' '}
                  <Text strong={true}> {t('Taxes.Custom_tax')}</Text>
                  <br />
                  <br />
                  <Paragraph>{t('Taxes.Custom_tax_description')}</Paragraph>
                </Col>
              </Row>
              <Divider className='num' style={styles.divider} />
              <a href='#'> {t('Taxes.Tax_rate_change')}</a>
            </div>
          ) : current === 'tax rate' ? (
            <div>
              {' '}
              <Text strong={true}>{t('Taxes.Tax_rates.Tax_rate')}</Text>
              <Divider className='num' style={styles.divider} />
              <Row>
                <Col span={24}>
                  <Paragraph>{t('Taxes.Tax_rates.Name_description')}</Paragraph>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name='name'
                    label={
                      <p>
                        {t('Form.Name')} <span className='star'>*</span>
                      </p>
                    }
                    style={styles.margin}
                    rules={[
                      { required: true, message: `${t('Form.Name_required')}` },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name='description' label={t('Form.Description')}>
                    <Input.TextArea showCount />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  {' '}
                  <Text strong={true}> {t('Taxes.Tax_rates.Tax_agency')}</Text>
                  <br />
                  <Text> {t('Taxes.Tax_rates.Tax_rate')}</Text>
                </Col>
                <Col span={24} className='Add_tax_agency'>
                  <Form.Item name='sales' style={styles.checked}>
                    <Checkbox
                      checked={sales}
                      onChange={onCheckSales}
                      style={styles.text}
                    >
                      {t('Sales.1')}
                    </Checkbox>
                  </Form.Item>
                  {sales && (
                    <Row className='num'>
                      <Col span={24}>
                        <Form.Item
                          label={t('Taxes.Tax_rates.Sales_rate')}
                          style={styles.margin}
                        >
                          <Form.Item name='salesRate' noStyle>
                            <InputNumber
                              min={0}
                              type='number'
                              inputMode='numeric'
                            />
                          </Form.Item>
                          <span className='ant-form-text'> %</span>
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          label={t('Accounting.Account')}
                          style={styles.margin}
                        >
                          <Select>
                            <Select.Option value='liability'>
                              {t('Taxes.Tax_rates.Liability')}
                            </Select.Option>
                            <Select.Option value='expense'>
                              {' '}
                              {t('Expenses.Expense')}
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          label={t(
                            'Taxes.Tax_rates.Show_tax_amount_on_return_line'
                          )}
                          style={styles.margin}
                        >
                          <Select>
                            <Select.Option value='Other adjustments'>
                              {t('Taxes.Tax_rates.Other_adjustments')}
                            </Select.Option>
                            <Select.Option value='Tax collected on sales'>
                              {t('Taxes.Tax_rates.Tax_collected_sales')}
                            </Select.Option>
                            <Select.Option value='Adjustments to tax on sales'>
                              {t('Taxes.Tax_rates.Adjustments_tax_sales')}
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          label={t('Taxes.Tax_rates.Show_amount_return_line')}
                          style={styles.margin}
                        >
                          <Select>
                            <Select.Option value='Total taxable sales in period, before tax'>
                              {t('Taxes.Tax_rates.Total_taxable_sales_period')}
                            </Select.Option>
                            <Select.Option value='Not applicable (N/A)'>
                              {t('Taxes.Tax_rates.Not_applicable')}
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                  <Form.Item name='purchases' style={styles.margin}>
                    <Checkbox
                      checked={purchases}
                      onChange={onCheckPurchases}
                      style={styles.text}
                    >
                      {t('Taxes.Tax_rates.Purchases')}
                    </Checkbox>
                  </Form.Item>
                  {purchases && (
                    <Row className='num'>
                      <Col span={24}>
                        <Form.Item
                          label={t('Taxes.Tax_rates.Purchases_rate')}
                          style={styles.margin}
                        >
                          <Form.Item name='Purchases rate' noStyle>
                            <InputNumber min={0} />
                          </Form.Item>
                          <span className='ant-form-text'> %</span>
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          label={t('Accounting.Account')}
                          style={styles.margin}
                        >
                          <Select>
                            <Select.Option value='liability'>
                              {t('Taxes.Tax_rates.Liability')}
                            </Select.Option>
                            <Select.Option value='expense'>
                              {t('Expenses.Expense')}
                            </Select.Option>
                            <Select.Option value='Not Tracking'>
                              {t('Taxes.Tax_rates.Not_tracking')}
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          label={t(
                            'Taxes.Tax_rates.Show_tax_amount_on_return_line'
                          )}
                          style={styles.margin}
                        >
                          <Select>
                            <Select.Option value='Tax reclaimable on purchases'>
                              {t('Taxes.Tax_rates.Tax_reclaimable_purchases')}
                            </Select.Option>
                            <Select.Option value='Adjustments to reclaimable tax on purchases'>
                              {t(
                                'Taxes.Tax_rates.Adjustments_reclaimable_tax_purchases'
                              )}
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          label={t('Taxes.Tax_rates.Show_amount_return_line')}
                          style={styles.margin}
                        >
                          <Select>
                            <Select.Option value='Total taxable purchases in period, before tax'>
                              {t(
                                'Taxes.Tax_rates.Total_taxable_purchases_period'
                              )}
                            </Select.Option>
                            <Select.Option value='Not applicable (N/A)'>
                              {t('Taxes.Tax_rates.Not_applicable')}
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                </Col>
              </Row>
            </div>
          ) : current === 'group rate' ? (
            <div>
              {' '}
              <Text strong={true}>{t('Taxes.Group_rate')}</Text>
              <Divider className='num' style={styles.divider} />
              <Row className='cursor'>
                <Col span={24}>
                  <Paragraph>
                    {t('Taxes.Group_rate_name_description')}
                  </Paragraph>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name='name'
                    label={
                      <p>
                        {t('Form.Name')} <span className='star'>*</span>
                      </p>
                    }
                    style={styles.margin}
                    rules={[
                      { required: true, message: `${t('Form.Name_required')}` },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name='description'
                    label={t('Form.Description')}
                    styles={styles.margin}
                  >
                    <Input.TextArea showCount />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.List name='textRate'>
                    {(fields, { add, remove }) => {
                      return (
                        <div>
                          <Row align='middle'>
                            <Col span={11}>
                              {' '}
                              <Form.Item
                                // {...field}
                                name='taxRate'
                                label={t('Taxes.Tax_rates.Tax_rate')}
                                fieldKey={[1, 'first']}
                                styles={styles.margin}
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true,
                                    message: `${t(
                                      'Taxes.Form.Required_tax_rate'
                                    )}`,
                                  },
                                ]}
                              >
                                <Select>
                                  <Select.Option value='Tax rate (Sales)'>
                                    {t('Taxes.Form.Tax_rate_sales')}
                                  </Select.Option>
                                  <Select.Option value='Tax rate (Purchases)'>
                                    {t('Taxes.Form.Tax_rate_purchases')}
                                  </Select.Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={11} offset={1}>
                              {' '}
                              <Form.Item
                                // {...field}
                                styles={styles.margin}
                                name='applicableOn'
                                fieldKey={[1, 'last']}
                                label={t('Taxes.Form.Applicable_on')}
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true,
                                    message: `${t(
                                      'Taxes.Form.Required_applicable_on'
                                    )}`,
                                  },
                                ]}
                              >
                                <Select>
                                  <Select.Option value='Net amount'>
                                    {t('Taxes.Form.Net_amount')}
                                  </Select.Option>
                                  <Select.Option value='Tax amount'>
                                    {t('Taxes.Form.Tax_amount')}
                                  </Select.Option>

                                  <Select.Option value='Net + Tax amount'>
                                    {t('Taxes.Form.Net_Tax_amount')}
                                  </Select.Option>
                                </Select>
                              </Form.Item>{' '}
                            </Col>
                            <Col span={1}>
                              {' '}
                              <MinusCircleOutlined
                                className='minus'
                                onClick={() => {}}
                              />
                            </Col>
                          </Row>
                          {fields?.map((field) => (
                            <Row className='num' key={field.key} align='middle'>
                              <Col span={11}>
                                {' '}
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'first']}
                                  label={t('Taxes.Tax_rates.Tax_rate')}
                                  fieldKey={[field.fieldKey, 'first']}
                                  styles={styles.margin}
                                  rules={[
                                    {
                                      required: true,
                                      whitespace: true,
                                      message: `${t(
                                        'Taxes.Form.Required_tax_rate'
                                      )}`,
                                    },
                                  ]}
                                >
                                  <Select>
                                    <Select.Option value='Tax rate (Sales)'>
                                      {t('Taxes.Form.Tax_rate_sales')}
                                    </Select.Option>
                                    <Select.Option value='Tax rate (Purchases)'>
                                      {t('Taxes.Form.Tax_rate_purchases')}
                                    </Select.Option>
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={11} offset={1}>
                                {' '}
                                <Form.Item
                                  {...field}
                                  styles={styles.margin}
                                  name={[field.name, 'last']}
                                  fieldKey={[field.fieldKey, 'last']}
                                  label={t('Taxes.Form.Applicable_on')}
                                  rules={[
                                    {
                                      required: true,
                                      whitespace: true,
                                      message: `${t(
                                        'Taxes.Form.Required_applicable_on'
                                      )}`,
                                    },
                                  ]}
                                >
                                  <Select>
                                    <Select.Option value='Net amount'>
                                      {t('Taxes.Form.Net_amount')}
                                    </Select.Option>
                                    <Select.Option value='Tax amount'>
                                      {t('Taxes.Form.Tax_amount')}
                                    </Select.Option>

                                    <Select.Option value='Net + Tax amount'>
                                      {t('Taxes.Form.Net_Tax_amount')}
                                    </Select.Option>
                                  </Select>
                                </Form.Item>{' '}
                              </Col>
                              <Col span={1}>
                                {' '}
                                <MinusCircleOutlined
                                  className='minus'
                                  onClick={() => {
                                    remove(field.name);
                                  }}
                                />
                              </Col>
                            </Row>
                          ))}
                          <Form.Item>
                            <Button
                              type='dashed'
                              onClick={() => {
                                add();
                              }}
                              block
                            >
                              <PlusOutlined />
                              {t('Taxes.Tax_rates.Add_tax_rate')}
                            </Button>
                          </Form.Item>
                        </div>
                      );
                    }}
                  </Form.List>
                </Col>
              </Row>
            </div>
          ) : current === 'custom tax' ? (
            <div>
              {' '}
              <Text strong={true}> {t('Taxes.Custom_tax')}</Text>
              <Divider className='num' style={styles.divider} />
              <Row className='cursor'>
                <Col span={24}>
                  <Paragraph>
                    {t('Taxes.Custom_tax_name_description')}
                  </Paragraph>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name='name'
                    label={
                      <p>
                        {t('Form.Name')} <span className='star'>*</span>
                      </p>
                    }
                    style={styles.margin}
                    rules={[
                      { required: true, message: `${t('Form.Name_required')}` },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name='description'
                    label={t('Form.Description')}
                    styles={{ marginBottom: '5px' }}
                  >
                    <Input.TextArea showCount />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name='taxAgencyName'
                    label={<p>{t('Taxes.Form.Tax_agency_name')}</p>}
                    style={styles.margin}
                    rules={[
                      { required: true, message: `${t('Form.Name_required')}` },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name='taxAgencyName'
                    label={
                      <p>
                        {/* {t("Form.Name")} */}
                        {t('Taxes.Form.Registration_number')}
                      </p>
                    }
                    style={styles.margin}
                  >
                    <InputNumber
                      className='num'
                      min={0}
                      type='number'
                      inputMode='numeric'
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label={t('Taxes.Form.Start_current_period')}
                    style={styles.margin}
                  >
                    <Select>
                      <Select.Option value='January'>
                        {' '}
                        {t('Months.January')}{' '}
                      </Select.Option>
                      <Select.Option value='February'>
                        {t('Months.February')}
                      </Select.Option>
                      <Select.Option value='March'>
                        {t('Months.March')}
                      </Select.Option>
                      <Select.Option value='April'>
                        {t('Months.April')}
                      </Select.Option>
                      <Select.Option value='May'>
                        {t('Months.May')}
                      </Select.Option>
                      <Select.Option value='June'>
                        {t('Months.June')}
                      </Select.Option>
                      <Select.Option value='July'>
                        {t('Months.July')}
                      </Select.Option>
                      <Select.Option value='August'>
                        {t('Months.August')}
                      </Select.Option>
                      <Select.Option value='September'>
                        {t('Months.September')}
                      </Select.Option>
                      <Select.Option value='October'>
                        {t('Months.October')}
                      </Select.Option>
                      <Select.Option value='November'>
                        {t('Months.November')}
                      </Select.Option>
                      <Select.Option value='December'>
                        {t('Months.December')}
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name='filingFrequency'
                    label={t('Taxes.Form.Filing_frequency')}
                    style={styles.margin}
                  >
                    <Select>
                      <Select.Option value='Monthly'>
                        {t('Months.Monthly')}
                      </Select.Option>
                      <Select.Option value='Quarterly'>
                        {t('Months.Quarterly')}
                      </Select.Option>
                      <Select.Option value='Half-yearly'>
                        {t('Months.Half-yearly')}
                      </Select.Option>
                      <Select.Option value='Yearly'>
                        {t('Months.Yearly')}
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name='reportingMethod'
                    label={t('Taxes.Form.Reporting_method')}
                    style={styles.margin}
                  >
                    <Select>
                      <Select.Option value='Accrual'>
                        {t('Taxes.Form.Accrual')}{' '}
                      </Select.Option>
                      <Select.Option value='Cash'>
                        {t('Taxes.Form.Cash')}{' '}
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  {' '}
                  <Form.Item name='salesRate' style={styles.checked}>
                    <Checkbox
                      checked={salesRate}
                      onChange={onCheckSalesRate}
                      style={styles.text}
                    >
                      {t('Taxes.Form.This_collected_sales')}
                    </Checkbox>
                  </Form.Item>
                </Col>

                {salesRate && (
                  <Col span={22} offset={2}>
                    <Form.Item
                      label={t('Taxes.Tax_rates.Sales_rate')}
                      style={styles.margin}
                    >
                      <Form.Item name={'Taxes.Form.Sales_rate'} noStyle>
                        <InputNumber />
                      </Form.Item>
                      <span className='ant-form-text'> %</span>
                    </Form.Item>
                  </Col>
                )}
                <Col span={24}>
                  <Form.Item name='purchasesRate' style={styles.checked}>
                    <Checkbox
                      checked={purchasesRate}
                      onChange={onCheckPurchasesRate}
                    >
                      {t('Taxes.Form.This_collected_purchases')}
                    </Checkbox>
                  </Form.Item>
                </Col>

                {purchasesRate && (
                  <Row>
                    {' '}
                    <Col span={22} offset={2}>
                      <Form.Item
                        label={t('Taxes.Tax_rates.Purchases_rate')}
                        style={styles.margin}
                      >
                        <Form.Item name='Purchases rate' noStyle>
                          <InputNumber />
                        </Form.Item>
                        <span className='ant-form-text'> %</span>
                      </Form.Item>
                    </Col>
                    <Col span={22} offset={2}>
                      <Form.Item name='purchasesRate' style={styles.margin}>
                        <Checkbox style={styles.text}>
                          {t('Taxes.Tax_rates.purchases_tax_reclaimable')}
                        </Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                )}
              </Row>
            </div>
          ) : (
            <div></div>
          )}
        </Form>
      </Drawer>
    </div>
  );
};
const styles = {
  margin: { marginBottom: '12px' },
  checked: { marginBottom: '0px' },
  cancel: { margin: ' 0 8px' },
  footer: (rtl) => ({
    // textAlign: rtl ? "left" : "right",
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }),
  divider: { margin: '13px 0' },
};
const mapStateToProps = (state) => ({
  products: state.products.products,
  rtl: state.direction.rtl,
});
export default connect(mapStateToProps)(AddTax);
