import { useState } from 'react';
import { useMediaQuery } from '../MediaQurey';
import { useTranslation } from 'react-i18next';
import UserBusiness from './UserBusiness';
import {
  Layout,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  Typography,
  Descriptions,
  Checkbox,
  Radio,
} from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

const { Option } = Select;
const { Content } = Layout;
const { Paragraph, Title, Text } = Typography;

const AddCompany = () => {
  const { t } = useTranslation();
  const [chartOfAccounts, setChartOfAccounts] = useState(false);
  const [expense, setExpense] = useState(false);
  const [sales, setSales] = useState(false);
  const [retailSales, setRetailSales] = useState(false);
  const [employee, setEmployee] = useState(false);
  const [customer, setCustomer] = useState(false);
  const [supplier, setSupplier] = useState(false);
  const isTabletBased = useMediaQuery('(max-width: 576px)');
  const isMobile = useMediaQuery('(max-width: 585px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMiniTablet = useMediaQuery('(max-width: 615px)');
  const isMiniMobile = useMediaQuery('(max-width: 520px)');
  const isMiddleMobile = useMediaQuery('(max-width: 374px)');
  const [isUserBusiness, setIsUserBusiness] = useState('');
  //routs
  const onClickStart = () => {
    setIsUserBusiness('business');
  };
  const back = () => {
    setIsUserBusiness('business');
    setChartOfAccounts(false);
    setExpense(false);
    setSales(false);
    setRetailSales(false);
    setEmployee(false);
    setCustomer(false);
    setSupplier(false);
  };
  const done = () => {
    setIsUserBusiness('do');
  };
  //permissions
  const onChangeChartsOfAccounts = () => {
    setChartOfAccounts(!chartOfAccounts);
  };
  const onChangeExpense = () => {
    setExpense(!expense);
  };
  const onChangeSales = () => {
    setSales(!sales);
  };
  const onChangeRetailSales = () => {
    setRetailSales(!retailSales);
  };
  const onChangeEmployee = () => {
    setEmployee(!employee);
  };
  const onChangeCustomer = () => {
    setCustomer(!customer);
  };
  const onChangeSupplier = () => {
    setSupplier(!supplier);
  };
  const onChangeSetAll = () => {
    setChartOfAccounts(true);
    setExpense(true);
    setSales(true);
    setRetailSales(true);
    setEmployee(true);
    setCustomer(true);
    setSupplier(true);
  };

  const prefixSelector = (
    <Form.Item name='prefi' noStyle>
      <Select style={{ width: 50 }} initialvalue='+93' showarrow={'false'}>
        <Option value='+93'>+93</Option>
        <Option value='+87'>+85</Option>
      </Select>
    </Form.Item>
  );
  return (
    <Content style={{ height: '100vh', overflowY: 'auto' }}>
      <Form layout='vertical' requiredMark={false}>
        <PageHeader
          className='site-page-header'
          onBack={() => null}
          title={t('Company.Accounting')}
          avatar={{
            src: 'images/logo.png',
            width: '100px',
            shape: 'circle ',
            size: 'large',
          }}
          backIcon={<div></div>}
        />
        {isUserBusiness === 'business' ? (
          <UserBusiness done={done} />
        ) : isUserBusiness === 'do' ? (
          <div>
            <Row justify='space-around' style={{ paddingTop: '30px' }}>
              <Col
                xl={16}
                lg={19}
                md={21}
                sm={isMiniTablet ? 22 : 20}
                xs={isMiddleMobile ? 22 : isMiniMobile ? 21 : 23}
              >
                <Title level={isMiniMobile ? 4 : isTablet ? 3 : 2}>
                  {t('Company.What_you_work')}
                </Title>

                <Row justify='space-around'>
                  <Col
                    xl={22}
                    lg={22}
                    md={22}
                    sm={22}
                    xs={isMiddleMobile ? 19 : isMiniMobile ? 22 : 23}
                  >
                    <Text type='secondary' strong={true}>
                      {t('Company.What_you_work_description')}
                    </Text>
                    <Row>
                      <Col span={24}>
                        <Radio.Group
                          initialvalue='a'
                          style={{ marginTop: 16 }}
                          className='num'
                        >
                          <Row gutter={[10, 10]}>
                            <Col
                              md={6}
                              sm={8}
                              xs={isMiddleMobile ? 24 : isMiniMobile ? 12 : 8}
                            >
                              <div id='button'>
                                <input
                                  type='checkbox'
                                  checked={chartOfAccounts}
                                  onChange={onChangeChartsOfAccounts}
                                  className='check company_permission_chart_of_accounts'
                                />
                                <div className='company_permission_input_text'>
                                  <Text type='secondary'>
                                    {t('Company.Form.Send_and_track_invoices')}
                                  </Text>
                                </div>
                              </div>
                            </Col>
                            <Col
                              md={6}
                              sm={8}
                              xs={isMiddleMobile ? 24 : isMiniMobile ? 12 : 8}
                            >
                              <div id='button'>
                                <input
                                  type='checkbox'
                                  checked={expense}
                                  className='check company_permission_expense'
                                  onChange={onChangeExpense}
                                />
                                <div className='company_permission_input_text'>
                                  <Text type='secondary'>
                                    {t('Company.Form.Organize_your_expenses')}
                                  </Text>
                                </div>
                              </div>
                            </Col>
                            <Col
                              md={6}
                              sm={8}
                              xs={isMiddleMobile ? 24 : isMiniMobile ? 12 : 8}
                            >
                              <div id='button'>
                                <input
                                  type='checkbox'
                                  checked={sales}
                                  className='check company_permission_sales'
                                  onChange={onChangeSales}
                                />
                                <div className='company_permission_input_text'>
                                  <Text type='secondary'>
                                    {t('Company.Form.Track_your_sales_tax')}
                                  </Text>
                                </div>
                              </div>
                            </Col>
                            <Col
                              md={6}
                              xs={isMiddleMobile ? 24 : isMiniMobile ? 12 : 8}
                            >
                              <div id='button'>
                                <input
                                  type='checkbox'
                                  checked={retailSales}
                                  onChange={onChangeRetailSales}
                                  className='check company_permission_retail_sales'
                                />
                                <div className='company_permission_input_text'>
                                  <Text type='secondary'>
                                    {' '}
                                    {t('Company.Form.Track_your_retail_sales')}
                                  </Text>
                                </div>
                              </div>
                            </Col>
                            <Col
                              md={6}
                              sm={8}
                              xs={isMiddleMobile ? 24 : isMiniMobile ? 12 : 8}
                            >
                              <div id='button'>
                                <input
                                  type='checkbox'
                                  checked={employee}
                                  onChange={onChangeEmployee}
                                  className='check company_permission_employee'
                                />
                                <div className='company_permission_input_text'>
                                  <Text type='secondary'>
                                    {t('Company.Form.Pay_your_employees')}
                                  </Text>
                                </div>
                              </div>
                            </Col>
                            <Col
                              md={6}
                              sm={8}
                              xs={isMiddleMobile ? 24 : isMiniMobile ? 12 : 8}
                            >
                              <div id='button'>
                                <input
                                  type='checkbox'
                                  checked={customer}
                                  className='check company_permission_customer'
                                  onChange={onChangeCustomer}
                                />
                                <div className='company_permission_input_text'>
                                  <Text type='secondary'>
                                    {' '}
                                    {t('Company.Form.Manage_your')}
                                  </Text>
                                </div>
                              </div>
                            </Col>
                            <Col
                              md={6}
                              sm={8}
                              xs={isMiddleMobile ? 24 : isMiniMobile ? 12 : 8}
                            >
                              <div id='button'>
                                <input
                                  type='checkbox'
                                  checked={supplier}
                                  className='check company_permission_supplier'
                                  onChange={onChangeSupplier}
                                />
                                <div className='company_permission_input_text'>
                                  <Text type='secondary'>
                                    {' '}
                                    {t('Company.Form.Track_your_bills')}
                                  </Text>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Radio.Group>
                        <Button shape='round' onClick={back}>
                          Back
                        </Button>

                        <Button
                          type='primary'
                          shape='round'
                          style={{ margin: ' 0 8px' }}
                          onClick={onChangeSetAll}
                        >
                          {t('Company.All_set')}
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        ) : (
          <div>
            <Row justify='space-around'>
              <Col
                md={20}
                sm={21}
                xs={isMiddleMobile ? 21 : isMobile ? 20 : 23}
                className='add_company_body'
              >
                <Row>
                  <Col xs={isMobile ? 24 : 12} style={{ paddingTop: '30px' }}>
                    <Row justify='space-around'>
                      <Col
                        md={18}
                        sm={21}
                        xs={isMiddleMobile ? 21 : isMobile ? 20 : 22}
                      >
                        {isTabletBased ? (
                          <Text strong={true}>
                            {t('Company.sign_up_title')}
                            <br />
                            <br />
                          </Text>
                        ) : (
                          <Title level={4}> {t('Company.sign_up_title')}</Title>
                        )}
                        <Row>
                          <Col span={24}>
                            <Form.Item
                              label={
                                <p style={styles.name}>
                                  {t('Form.Name1')}
                                  <span className='star'>*</span>
                                </p>
                              }
                              name='name'
                              style={styles.marginBottom}
                              rules={[
                                {
                                  whitespace: true,
                                  message: `${t('Form.Name_required')}`,
                                  required: true,
                                },
                              ]}
                              hasFeedback
                            >
                              <Input />
                            </Form.Item>

                            <Form.Item
                              label={t('Form.Last_Name')}
                              name='last_name'
                              hasFeedback
                            >
                              <Input />
                            </Form.Item>

                            <Form.Item
                              name='email'
                              hasFeedback
                              label={
                                <span>
                                  {t('Form.Email')}{' '}
                                  <span className='star'>*</span>
                                </span>
                              }
                              rules={[
                                {
                                  type: 'email',
                                  message: `${t('Form.Email_Message')}`,
                                },
                                {
                                  required: true,
                                  whitespace: true,
                                  message: `${t(
                                    'Company.Form.Required_email',
                                  )}`,
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              name='phone'
                              onChange={(e) => {}}
                              label={
                                <span>
                                  {t('Form.Phone')}{' '}
                                  <span className='star'>*</span>
                                </span>
                              }
                              rules={[
                                {
                                  required: true,
                                  whitespace: true,
                                  message: `${t(
                                    'Company.Form.Required_phone',
                                  )}`,
                                },
                              ]}
                            >
                              <Input
                                addonBefore={prefixSelector}
                                style={styles.row}
                                maxLength={10}
                              />
                            </Form.Item>
                            <Form.Item
                              name='password'
                              label={
                                <span>
                                  {t('Company.Form.Password')}
                                  <span className='star'>*</span>
                                </span>
                              }
                              rules={[
                                {
                                  required: true,
                                  whitespace: true,
                                  message: `${t(
                                    'Company.Form.Required_password',
                                  )}`,
                                },
                              ]}
                              hasFeedback
                            >
                              <Input.Password />
                            </Form.Item>

                            <Form.Item
                              name='confirm'
                              label={
                                <span>
                                  {t('Company.Form.Confirm_password')}
                                  <span className='star'>*</span>
                                </span>
                              }
                              dependencies={['password']}
                              hasFeedback
                              rules={[
                                {
                                  required: true,
                                  whitespace: true,
                                  message: `${t(
                                    'Company.Form.Required_confirm',
                                  )}`,
                                },
                                ({ getFieldValue }) => ({
                                  validator(rule, value) {
                                    if (
                                      !value ||
                                      getFieldValue('password') === value
                                    ) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(
                                      `${t('Company.Form.Confirm_match')}`,
                                    );
                                  },
                                }),
                              ]}
                            >
                              <Input.Password />
                            </Form.Item>
                            <Form.Item
                              name='masterCart'
                              label={
                                <span>{t('Company.Form.Master_Cart')}</span>
                              }
                            >
                              <Input
                                placeholder={t(
                                  'Company.Form.Master_Cart_placeholder',
                                )}
                              />
                            </Form.Item>
                            <Form.Item name='sms' valuePropName='checked'>
                              <Checkbox>
                                {t('Company.Form.Helpful_marketing_email_sms')}
                              </Checkbox>
                            </Form.Item>
                            <Button
                              type='primary'
                              className='num'
                              onClick={onClickStart}
                              style={{ height: '40px' }}
                            >
                              {t('Company.Form.Start_accounting_system')}
                            </Button>
                            <br />
                            <br />
                            <Paragraph>
                              {t('Company.Privacy_statement_description')}
                            </Paragraph>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={isMobile ? 24 : 12}>
                    <Descriptions bordered layout='vertical'>
                      <Descriptions.Item
                        className='num'
                        label={t('Company.Accounting_plan')}
                      >
                        <Paragraph className='add_company_paragraph'>
                          <Text strong={true}>
                            {t('Company.Accounting_online')}
                          </Text>
                          <br />
                          <Paragraph>
                            <ul style={{ listStyleType: 'square' }}>
                              <li>{t('Company.Automatic_data')}</li>
                              <li>{t('Company.Bank_level_security')}</li>
                              <li>{t('Company.Access_data')}</li>
                            </ul>
                          </Paragraph>
                          {t('Company.Manage_multiple_company')}
                        </Paragraph>
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        )}
      </Form>
    </Content>
  );
};
const styles = {
  nav: (isMobileBased) => ({ height: isMobileBased ? '7vh' : '5vh' }),
  upload: { marginTop: '4rem' },
};

export default AddCompany;
