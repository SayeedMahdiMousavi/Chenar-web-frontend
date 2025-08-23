import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Row,
  Col,
  Layout,
  Dropdown,
  Button,
  Menu,
  Divider,
  Typography,
  Statistic,
  Card,
} from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useMediaQuery } from '../MediaQurey';
import { Colors } from '../colors';
import TaxesBody from './TaxesBody';
import AddTax from './AddTax';
import EditSetting from './EditSetting';
const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const Taxes = (props) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width:425px)');
  const isMiniTablet = useMediaQuery('(max-width:576px)');
  // const isMiniMiniMobile = useMediaQuery("(max-width:336px)");
  const menu = (
    <Menu>
      <Menu.Item key='1'>
        <EditSetting />
      </Menu.Item>
      <Menu.Item key='2'>
        <Link to='/tax-rates'> {t('Taxes.Edit_rates')}</Link>
      </Menu.Item>
    </Menu>
  );
  return (
    <Layout>
      <Content className={ononline ? 'page-body' : 'page-body-offline'}>
        <Row justify='space-around'>
          <Col xl={23} md={23} xs={23} className='banner'>
            <Row className='tax_header' align='middle' justify='start'>
              <Col
                md={{ span: 10 }}
                sm={{ span: 11 }}
                xs={{ span: 12 }}
                className='Sales__content-3-body'
              >
                <Row>
                  <Col span={24}>
                    <span className='header'>
                      {t('Taxes.1')}
                      <br />
                    </span>
                  </Col>
                </Row>
              </Col>
              <Col
                xl={{ span: 6, offset: 8 }}
                lg={{ span: 7, offset: 7 }}
                md={{ span: 8, offset: 6 }}
                sm={{ span: 11, offset: 2 }}
                xs={isMobile ? { span: 10, offset: 2 } : { span: 8, offset: 4 }}
                style={styles.margin(isMiniTablet)}
              >
                <Row
                  justify={isMobile ? 'center' : 'space-between'}
                  gutter={[0, 10]}
                >
                  <Col xl={14} md={14} sm={14} xs={24}>
                    <Dropdown overlay={menu} trigger={['click']}>
                      <Button shape='round' className='num'>
                        {t('Taxes.Edit_tax_rate')}

                        <DownOutlined />
                      </Button>
                    </Dropdown>
                  </Col>
                  <Col xl={9} md={9} sm={9} xs={24}>
                    <AddTax />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className='tax_admin'>
              <Col sm={15} xs={24}>
                <Row gutter={[10, 10]} align='middle'>
                  <Col md={12} sm={24} xs={24}>
                    <Card
                      hoverable
                      className='customer_admin'
                      bordered={false}
                      bodyStyle={styles.card}
                    >
                      <Statistic
                        title={
                          <span style={{ color: 'white' }}>
                            01/01/2020 - 01/31/2020
                          </span>
                        }
                        value={0.0}
                        precision={2}
                        valueStyle={{ color: 'white' }}
                        // prefix={ <span>ESTIMATE</span>}
                        prefix={
                          <span style={{ color: 'white', fontSize: '1rem' }}>
                            {t('Taxes.Aed')}
                          </span>
                        }
                      />
                    </Card>
                  </Col>
                  <Col md={12} sm={24} xs={24}>
                    <Card
                      hoverable
                      bordered={false}
                      bodyStyle={{
                        background: '#08979c',
                        padding: '10px',
                      }}
                    >
                      <Statistic
                        title={
                          <span style={{ color: 'white' }}>
                            {t('Taxes.Collected_on_sales')}
                          </span>
                        }
                        value={0.0}
                        precision={2}
                        valueStyle={{ color: 'white' }}
                        // prefix='OPEN INVOICE'
                        prefix={
                          <span style={{ color: 'white', fontSize: '1rem' }}>
                            {t('Taxes.Aed')}
                          </span>
                        }
                      />
                    </Card>
                  </Col>
                  <Col md={12} sm={24} xs={24}>
                    <Card
                      hoverable
                      bordered={false}
                      bodyStyle={{
                        background: '#2ecc71',
                        padding: '10px',
                      }}
                    >
                      <Statistic
                        title={
                          <span style={{ color: 'white' }}>
                            {' '}
                            {t('Taxes.Paid_on_purchases')}
                          </span>
                        }
                        value={0.0}
                        precision={2}
                        customer_admin
                        valueStyle={{ color: 'white' }}
                        // prefix='PAID LAST 30 DAYS'
                        prefix={
                          <span style={{ color: 'white', fontSize: '1rem' }}>
                            {t('Taxes.Aed')}
                          </span>
                        }
                      />
                    </Card>
                  </Col>
                  <Col md={12} sm={24} xs={24}>
                    <Card
                      hoverable
                      bordered={false}
                      bodyStyle={{
                        background: '#fa8c16',
                        padding: '10px',
                      }}
                    >
                      <Statistic
                        title={
                          <span style={{ color: 'white' }}>
                            {' '}
                            {t('Taxes.Adjustments')}
                          </span>
                        }
                        value={0.0}
                        precision={2}
                        customer_admin
                        valueStyle={{ color: 'white' }}
                        // prefix='PAID LAST 30 DAYS'
                        prefix={
                          <span style={{ color: 'white', fontSize: '1rem' }}>
                            {t('Taxes.Aed')}
                          </span>
                        }
                      />
                    </Card>
                  </Col>
                </Row>
              </Col>
              <Col sm={1} xs={24}>
                <Divider
                  type={isMiniTablet ? 'horizontal' : 'vertical'}
                  style={{
                    height: '100%',
                    background: `${Colors.borderColor}`,
                  }}
                />
              </Col>
              <Col sm={8} xs={24}>
                <Row>
                  <Col xl={1} lg={2} md={3} sm={4} xs={1}>
                    <ExclamationCircleOutlined
                      className='font exclamation'
                      style={{ color: '#faad14' }}
                    />
                  </Col>
                  <Col xl={21} lg={20} md={19} sm={18} offset={1} xs={21}>
                    <Text strong={true}>{t('Taxes.Finish_strong')}</Text>
                    <br />
                    <Paragraph>
                      {t('Taxes.Finish_strong_description')}
                    </Paragraph>
                    <a href='#'>{t('Taxes.How_record_payments')}</a>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <TaxesBody />
      </Content>
    </Layout>
  );
};
const styles = {
  margin: (isMiniTablet) => ({ marginTop: isMiniTablet ? '15px' : '' }),
  lineHeight: { lineHeight: '2px' },
  card: { background: '#3498db', padding: '10px' },
};
const mapStateToProps = (state) => {
  return {
    rtl: state.direction.rtl,
    ltr: state.direction.ltr,
  };
};
export default connect(mapStateToProps)(Taxes);
