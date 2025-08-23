import React from 'react';
import { useMediaQuery } from '../MediaQurey';
import { useTranslation } from 'react-i18next';
import { Form, Button, Col, Row, Input, Select, Typography } from 'antd';

const { Option } = Select;
const { Paragraph, Title } = Typography;

const UserBusiness = (props) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 585px)');
  const isMiddleMobile = useMediaQuery('(max-width: 374px)');
  const onClickNext = () => {
    props.done();
  };

  return (
    <div>
      <Row justify='space-around' style={{ paddingTop: '30px' }}>
        <Col md={16} sm={22} xs={isMiddleMobile ? 23 : isMobile ? 23 : 23}>
          <Title level={isMiddleMobile ? 4 : isMobile ? 3 : 2}>
            {t('Company.About_your_business')}
          </Title>
          <Row justify='space-around'>
            <Col md={22} sm={22} xs={isMiddleMobile ? 21 : isMobile ? 22 : 23}>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label={
                      <p style={styles.name}>
                        {t('Company.Form.Name_of_business')}
                        <span className='star'>*</span>
                      </p>
                    }
                    name='name'
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
                    name='type'
                    label={
                      <span>
                        {t('Company.Form.Type_of_business')}
                        <span className='star'>*</span>
                      </span>
                    }
                    rules={[
                      {
                        message: `${t('Company.Form.Required_type')}`,
                        required: true,
                        whitespace: true,
                      },
                    ]}
                  >
                    <Select allowClear>
                      <Option value='Sole trader'>
                        {t('Company.Form.Sole_trader')}
                      </Option>
                      <Option value='Partnership'>
                        {t('Company.Form.Partnership')}
                      </Option>
                      <Option value='Privet limited company'>
                        {t('Company.Form.Private_limited_company')}
                      </Option>
                      <Option value='Traded company or co-operative'>
                        {t('Company.Form.Traded_company')}
                      </Option>
                      <Option value='Charity of association'>
                        {t('Company.Form.Charity_of_association')}
                      </Option>
                      <Option value='Company'>{t('Company.1')}</Option>
                      <Option value='Something else'>
                        {t('Company.Form.Something_else')}
                      </Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name='timeLine'
                    label={<span>{t('Company.Form.Time_of_business')}</span>}
                  >
                    <Select allowClear>
                      <Option value='Less than 1 year'>
                        {t('Company.Form.Less_than_1_year')}
                      </Option>
                      <Option value='1-2 year'>
                        1-2 {t('Company.Form.Year')}
                      </Option>
                      <Option value=' 3-4 year'>
                        3-4 {t('Company.Form.Year')}
                      </Option>
                      <Option value='5-9 year'>
                        5-9 {t('Company.Form.Year')}
                      </Option>
                      <Option value=' 10-14 year'>
                        10-14
                        {t('Company.Form.Year')}
                      </Option>
                      <Option value='15+ year'>
                        15+ {t('Company.Form.Year')}
                      </Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name='describe'
                    label={
                      <span>
                        {t('Company.Form.Describe_of_business')}{' '}
                        <span className='star'>*</span>
                      </span>
                    }
                    rules={[
                      {
                        message: `${t('Company.Form.Required_description')}`,
                        required: true,
                        whitespace: true,
                      },
                    ]}
                    style={styles.margin}
                  >
                    <Select allowClear>
                      <Option value='Accommodation and Food Services'>
                        {t('Company.Form.Accommodation_food_services')}
                      </Option>
                      <Option value='Administration and Support Services'>
                        {t('Company.Form.Administration_support_services')}
                      </Option>
                      <Option value=' Arts and Recreation Services'>
                        {t('Company.Form.Arts_recreation_services')}
                      </Option>
                      <Option value='Construction/Builder'>
                        {t('Company.Form.Construction/Builder')}
                      </Option>
                      <Option value='Education and Training'>
                        {t('Company.Form.Education_training')}
                      </Option>
                      <Option value='Farming forestry and fishing'>
                        {t('Company.Form.Farming_forestry_fishing')}
                      </Option>
                      <Option value='Financial services & insurance'>
                        {t('Company.Form.Financial_insurance')}
                      </Option>
                      <Option value='Manufacturing'>
                        {t('Company.Form.Manufacturing')}
                      </Option>
                      <Option value='Medical / Health Care /Community service'>
                        {t('Company.Form.Medical')}
                      </Option>
                      <Option value='Personal ,Beauty ,wellbeing and other Service'>
                        {t('Company.Form.Personal_Beauty_wellbeing')}
                      </Option>
                      <Option value='Professional Services'>
                        {t('Company.Form.Professional')}
                      </Option>
                      <Option value='Property Operators and Real Estate Services'>
                        {t('Company.Form.Property_operators')}
                      </Option>
                      <Option value='Rental and Hiring  Service (no Real Estate  )'>
                        {t('Company.Form.Rental_Hiring')}
                      </Option>
                      <Option value='Repair and Maintenance(Automotive & Property )'>
                        {t('Company.Form.Repair_maintenance')}
                      </Option>
                      <Option value='Retail Trade '>
                        {t('Company.Form.Retail_Trade')}
                      </Option>
                      <Option value='Retail Trade & Ecommerce (No-Food  )'>
                        {t('Company.Form.Retail_Trade_Ecommerce')}
                      </Option>
                      <Option value='Technology /Telecommunication Services'>
                        {t('Company.Form.Technology')}
                      </Option>
                      <Option value='Trades Work'>
                        {t('Company.Form.Trades_work')}
                      </Option>
                      <Option value='Transport, Logistics,Postal,Warehousing'>
                        {t('Company.Form.Transport_logistics')}
                      </Option>
                      <Option value='Wholesale Trade'>
                        {t('Company.Form.Wholesale_trade')}{' '}
                      </Option>
                      <Option value='Other'>
                        {t('Sales.Customers.Other')}
                      </Option>
                    </Select>
                  </Form.Item>
                  <Paragraph type='secondary'>
                    {t('Company.Form.Description_for_describe_of_business')}
                  </Paragraph>
                  <Button type='primary' shape='round' onClick={onClickNext}>
                    {t('Step.Next')}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
const styles = {
  nav: (isMobileBased) => ({ height: isMobileBased ? '7vh' : '5vh' }),
  upload: { marginTop: '4rem' },
  margin: { marginBottom: '0rem' },
};

export default UserBusiness;
