import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Layout } from 'antd';
import Navbar from '../../../Accounting/Navbar';
import AddFinancialPeriod from './AddFinancialPeriod';
import FinancialTable from './FinancialTable';
import { Title } from '../../../SelfComponents/Title';
import { FISCAL_YEAR_M } from '../../../../constants/permissions';

const fiscalYearBaseUrl = '/system_setting/finance_period/';

const FinancialPeriod = (props) => {
  const { t } = useTranslation();

  return (
    <Layout>
      <Navbar />

      <Row className='categore-header' align='middle' justify='start'>
        <Col
          // md={{ span: 10 }}
          // sm={{ span: 11 }}
          xs={{ span: 12 }}
          className='Sales__content-3-body'
        >
          <Row>
            <Col span={24}>
              <Title
                value={t('Company.Financial_period')}
                model={FISCAL_YEAR_M}
              />
            </Col>
          </Row>
        </Col>
        <Col
          // xxl={{ span: 3, offset: 11 }}
          // xl={{ span: 4, offset: 10 }}
          // lg={{ span: 5, offset: 10 }}
          // md={{ span: 6, offset: 9 }}
          // sm={{ span: 5, offset: 8 }}
          xs={{ span: 12 }}
          style={{ textAlign: 'end' }}
        >
          <AddFinancialPeriod baseUrl={fiscalYearBaseUrl} />
        </Col>
      </Row>

      <FinancialTable baseUrl={fiscalYearBaseUrl} />
    </Layout>
  );
};

export default FinancialPeriod;
