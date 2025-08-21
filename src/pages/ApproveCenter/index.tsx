import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Layout, Typography } from 'antd';
import { useMediaQuery } from '../MediaQurey';
import { Title } from '../SelfComponents/Title';
import ApproveCenterTable from './ApproveCenterTable';
import { SALES_INVOICE_LIST } from '../../constants/routes';

const baseUrl = SALES_INVOICE_LIST;
export default () => {
  const { t } = useTranslation();
  const isMiniMobile = useMediaQuery('(max-width:375px)');
  const isMiniTablet = useMediaQuery('(max-width:485px)');

  return (
    <Layout>
      <Row className='categore-header' align='middle' justify='start'>
        <Col
          xl={{ span: 7 }}
          md={{ span: 8 }}
          sm={{ span: 10 }}
          xs={{ span: 13 }}
          className='Sales__content-3-body'
        >
          <Row>
            <Col span={24}>
              <Title value={t('Approve_center.1')} />
            </Col>
          </Row>
        </Col>
        <Col
          xl={{ span: 6, offset: 11 }}
          md={{ span: 8, offset: 8 }}
          sm={{ span: 10, offset: 4 }}
          xs={
            isMiniMobile
              ? { span: 8, offset: 3 }
              : isMiniTablet
              ? { span: 7, offset: 4 }
              : { span: 6, offset: 5 }
          }
        ></Col>
      </Row>
      <Typography.Title
        level={4}
        style={{
          textAlign: 'center',
          margin: '10px',
        }}
      >
        {t('Sales_order')}
      </Typography.Title>
      <ApproveCenterTable baseUrl={baseUrl} />
      <Typography.Title
        level={4}
        style={{
          textAlign: 'center',
          margin: '10px',
        }}
      >
        {t('Purchase_order')}
      </Typography.Title>
      <ApproveCenterTable baseUrl={'/invoice/purchase_order'} />
    </Layout>
  );
};
