import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Col, Row, Typography, Statistic, Descriptions } from 'antd';

const { Paragraph, Text } = Typography;
export default function BillingAndSubscriptions() {
  const { t } = useTranslation();
  return (
    <div>
      <Row className='account_settings_company_id'>
        <Col xl={5} lg={6} md={7}>
          {' '}
          <Text strong={true}>{t('Company.Company_ID')}</Text>
        </Col>
        <Col xl={19} lg={18} md={17}>
          <Text strong={true}>9130 3486 2349 2966</Text>
        </Col>
      </Row>
      <Row style={styles.description}>
        <Col xl={9} lg={10} md={11}>
          <Descriptions bordered layout='vertical' style={{ height: '200px' }}>
            <Descriptions.Item
              className='num'
              label={t('Company.Accounting_plus')}
            >
              <Text>
                <a href='#'>{t('Company.Trial')}</a> {t('Company.End_in')}
              </Text>
              <br />
              <br />
              <Paragraph>{t('Company.Accounting_plus_description')}</Paragraph>
              <a href='#'> {t('Company.Downgrade_your_plan')}</a>
              <br />
              <a href='#'> {t('Company.Cancel_your_trial')}</a>
              <br />
              <br />
              <br />
              <br />
              <br />

              <Statistic
                title={t('Company.Subscribe_for')}
                value={31}
                precision={2}
                prefix='$'
                suffix='/mo'
              />
              <Row justify='space-between' align='middle'>
                <Col> {t('Company.Applicable_taxes')}</Col>
                <Col>
                  <Button type='primary'> {t('Company.Subscribe')}</Button>
                </Col>
              </Row>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </div>
  );
}
const styles = {
  description: { marginTop: '25px' },
};
