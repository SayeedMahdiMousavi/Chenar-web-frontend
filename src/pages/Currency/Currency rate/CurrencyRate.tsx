import React from 'react';
import { Row, Col, Menu } from 'antd';
import { Title } from '../../SelfComponents/Title';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { checkPermissionsModel } from '../../../Functions';
import {
  CURRENCY_EXCHANGE_M,
  CURRENCY_M,
  CURRENCY_RATE_M,
} from '../../../constants/permissions';
import CurrencyRateTable from './Table';
import { PageMoreButton } from '../../../components';

export const currencyRateBaseUrl = '/currency/active_currency_rate/';

const baseUrl = currencyRateBaseUrl;
const CurrencyRate: React.FC = () => {
  const { t } = useTranslation();

  const menu = (
    <Menu>
      {checkPermissionsModel(CURRENCY_M) && (
        <Menu.Item key='1'>
          <Link to='/currency'>
            {t('Sales.Product_and_services.Currency.1')}
          </Link>
        </Menu.Item>
      )}
      {checkPermissionsModel(CURRENCY_EXCHANGE_M) && (
        <Menu.Item key='2'>
          <Link to='/currency-exchange'>{t('Reports.Currency_exchange')}</Link>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <>
      <Row className='categore-header' align='middle' justify='start'>
        <Col
          md={{ span: 10 }}
          sm={{ span: 11 }}
          xs={{ span: 14 }}
          className='Sales__content-3-body'
        >
          <Row>
            <Col span={24}>
              <Title
                value={t('Sales.Product_and_services.Currency.Currency_rate')}
              />
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
          <PageMoreButton
            permissions={[CURRENCY_M, CURRENCY_EXCHANGE_M]}
            overlay={menu}
          />
        </Col>
      </Row>

      {checkPermissionsModel(CURRENCY_RATE_M) && (
        <CurrencyRateTable baseUrl={baseUrl} />
      )}
    </>
  );
};

export default CurrencyRate;
