import React from 'react';
import Navbar from '../Navbar';
import { useTranslation } from 'react-i18next';
import { Title } from '../../SelfComponents/Title';
import { Row, Col, Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '../../MediaQurey';
import AddBankAccount from './AddBankAccount';
import BankingTable from './BankingTable';
import { PageMoreButton } from '../../../components';
import { BANK_M, MONEY_TRANSFER_M } from '../../../constants/permissions';
import { checkPermissionsModel } from '../../../Functions';

// const local = "حمل_ثور_جوزا_سرطان_اسد_سنبله_میزان_عقرب_قوس_جدی_دلو_حوت";
// const local1 = "حمل_ثور_جوزا_سرطان_اسد_سنبله_میزان_عقرب_قوس_جدی_دلو_حوت";

export const bankBaseUrl = '/banking/bank/';

interface IProps {}
const Banking: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const isMiniTablet = useMediaQuery('(max-width:485px)');
  const isMobile = useMediaQuery('(max-width:425px)');
  const isMiniMobile = useMediaQuery('(max-width:375px)');

  const menu = (
    <Menu>
      <Menu.Item key='4'>
        <Link to='/money-transfer/bank'>{t('Banking.Money_transfer')}</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Navbar />

      <Row className='categore-header' align='middle' justify='start'>
        <Col
          xl={{ span: 7 }}
          md={{ span: 8 }}
          sm={{ span: 10 }}
          xs={{ span: 13 }}
          className='Sales__content-3-body'
        >
          <Title value={t('Banking.1')} model={BANK_M} />
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
        >
          <Row justify={isMobile ? 'center' : 'space-around'} gutter={[0, 5]}>
            <Col xl={10} md={10} sm={9} xs={23}>
              <PageMoreButton permissions={[MONEY_TRANSFER_M]} overlay={menu} />
            </Col>
            <Col xl={13} md={12} sm={13} xs={24}>
              <AddBankAccount type='bank' baseUrl={bankBaseUrl} />
            </Col>
          </Row>
        </Col>
      </Row>

      {checkPermissionsModel(BANK_M) && <BankingTable baseUrl={bankBaseUrl} />}
    </Layout>
  );
};

export default Banking;
