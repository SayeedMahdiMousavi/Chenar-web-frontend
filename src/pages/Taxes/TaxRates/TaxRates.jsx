import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Layout } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
// import { useMediaQuery } from "../MediaQurey";
import TaxRatesTable from './TaxRatesTable';
import AddTaxRates from './AddTaxRates';
import i18n from '../../../i18n';
const { Content } = Layout;
const TaxRates = (props) => {
  const { t } = useTranslation();
  // const isMobile = useMediaQuery("(max-width:455px)");
  // const isMiniMobile = useMediaQuery("(max-width:390px)");
  // const isMiniMiniMobile = useMediaQuery("(max-width:336px)");

  return (
    <Layout>
      <Content className={ononline ? 'page-body' : 'page-body-offline'}>
        <Row justify='space-around'>
          <Col xl={23} md={23} xs={23} className='banner'>
            <Row className='categore-header' align='middle' justify='start'>
              <Col
                md={{ span: 10 }}
                sm={{ span: 11 }}
                xs={{ span: 14 }}
                className='Sales__content-3-body'
              >
                <Row>
                  <Col span={24}>
                    <Row>
                      <Col span={23} offset={1}>
                        <span className='header'>
                          {t('Taxes.Tax_rates.1')}
                          <br />
                        </span>
                      </Col>
                      <Col span={24}>
                        <Link to='/taxes' className='category__product'>
                          {i18n.language === 'en' ? (
                            <LeftOutlined />
                          ) : (
                            <RightOutlined />
                          )}

                          {t('Taxes.Tax_rates.Back_to_sales_tax_centre')}
                        </Link>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col
                xl={{ span: 3, offset: 11 }}
                lg={{ span: 3, offset: 11 }}
                md={{ span: 4, offset: 10 }}
                sm={{ span: 5, offset: 8 }}
                xs={{ span: 6, offset: 4 }}
              >
                <AddTaxRates />
              </Col>
            </Row>
          </Col>
        </Row>
        <TaxRatesTable />
      </Content>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    rtl: state.direction.rtl,
    ltr: state.direction.ltr,
  };
};
export default connect(mapStateToProps)(TaxRates);
