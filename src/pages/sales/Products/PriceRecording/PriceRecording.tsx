import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Layout } from 'antd';
import { connect } from 'react-redux';
import { Title } from '../../../SelfComponents/Title';
import FirstPeriodTable from './PriceRecordingTable';
import { PageBackIcon } from '../../../../components';
import { PRODUCT } from '../../../../constants/routes';
interface Props {
  rtl: string;
}
const PriceRecording: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  return (
    <Layout>
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
                value={t('Sales.Product_and_services.Price_recording.1')}
              />
            </Col>
            <Col
              xl={{ span: 12, offset: 0 }}
              lg={{ span: 17, offset: 0 }}
              md={{ span: 18, offset: 0 }}
              xs={{ span: 17, offset: 0 }}
            >
              <PageBackIcon
                previousPageName={t('Sales.Product_and_services.1')}
                url={PRODUCT}
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
        ></Col>
      </Row>

      <FirstPeriodTable />
    </Layout>
  );
};

const mapStateToProps = (state: any) => {
  return {
    rtl: state.direction.rtl,
    ltr: state.direction.ltr,
  };
};
export default connect(mapStateToProps)(PriceRecording);
