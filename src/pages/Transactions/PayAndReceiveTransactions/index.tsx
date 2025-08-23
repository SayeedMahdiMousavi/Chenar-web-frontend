import React from 'react';
import { Title } from '../../SelfComponents/Title';
import { Row, Col, Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import PayAndReceiveCash from './PayAndReceiveCash';
import TransactionsTable from '../TransactionsTable';
import Navbar from '../../Expenses/Navbar';
import { useTranslation } from 'react-i18next';
import { checkPermissions } from '../../../Functions';
import { PageBackIcon, PageMoreButton } from '../../../components';
import { WITHDRAW_TYPE_M } from '../../../constants/permissions';

interface IProps {
  title: string;
  baseUrl: string;
  backText: string;
  backUrl: string;
  place: string;
  modalTitle: string;
  model: string;
}

const PayAndReceiveTransactions: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const menu = (
    <Menu>
      <Menu.Item key='1'>
        <Link to='/withdraw-definition'>
          {t('Expenses.With_draw.With_definition')}
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      {props.place === 'withdrawPayAndRecCash' && <Navbar />}

      <Row className='categore-header' align='middle' justify='start'>
        <Col
          md={{ span: 10 }}
          sm={{ span: 11 }}
          xs={{ span: 14 }}
          className='Sales__content-3-body'
        >
          <Row>
            <Col span={24}>
              <Title value={props.title} model={props.model} />
            </Col>
            {props.place !== 'withdrawPayAndRecCash' && (
              <Col
                xl={{ span: 12, offset: 0 }}
                lg={{ span: 17, offset: 0 }}
                md={{ span: 18, offset: 0 }}
                xs={{ span: 17, offset: 0 }}
              >
                <PageBackIcon
                  previousPageName={props.backText}
                  url={props.backUrl}
                />
              </Col>
            )}
          </Row>
        </Col>
        {props.place === 'withdrawPayAndRecCash' ? (
          <Col
            xxl={{ span: 8, offset: 6 }}
            xl={{ span: 9, offset: 5 }}
            lg={{ span: 10, offset: 4 }}
            md={{ span: 11, offset: 3 }}
            sm={{ span: 13, offset: 1 }}
            xs={{ span: 14, offset: 1 }}
          >
            <Row gutter={10}>
              <Col span={8}>
                <PageMoreButton
                  permissions={[WITHDRAW_TYPE_M]}
                  overlay={menu}
                />
              </Col>
              {checkPermissions(`add_${props.model}`) && (
                <React.Fragment>
                  <Col span={8}>
                    <PayAndReceiveCash
                      model={props.model}
                      type='payCash'
                      baseUrl={props.baseUrl}
                      place={props.place}
                      title={t('Expenses.With_draw.Withdraw_information')}
                    />
                  </Col>
                  <Col span={8}>
                    <PayAndReceiveCash
                      model={props.model}
                      type='recCash'
                      baseUrl={props.baseUrl}
                      place={props.place}
                      title={t('Expenses.With_draw.Deposit_information')}
                    />
                  </Col>
                </React.Fragment>
              )}
            </Row>
          </Col>
        ) : (
          checkPermissions(`add_${props.model}`) && (
            <Col
              xxl={{ span: 6, offset: 8 }}
              xl={{ span: 7, offset: 7 }}
              lg={{ span: 8, offset: 6 }}
              md={{ span: 9, offset: 5 }}
              sm={{ span: 10, offset: 4 }}
              xs={{ span: 11, offset: 3 }}
            >
              {props.place === 'currencyExchange' ? (
                <Row gutter={10}>
                  <Col span={12}></Col>
                  <Col span={12}>
                    <PayAndReceiveCash
                      model={props.model}
                      type='payCash'
                      baseUrl={props.baseUrl}
                      place={props.place}
                      title={t('Reports.Currency_exchange_information')}
                    />
                  </Col>
                </Row>
              ) : (
                <Row gutter={10}>
                  <Col span={12}>
                    <PayAndReceiveCash
                      model={props.model}
                      type='payCash'
                      baseUrl={props.baseUrl}
                      place={props.place}
                      title={t('Employees.Pay_cash_information')}
                    />
                  </Col>
                  <Col span={12}>
                    <PayAndReceiveCash
                      model={props.model}
                      type='recCash'
                      baseUrl={props.baseUrl}
                      place={props.place}
                      title={t('Employees.Receive_cash_information')}
                    />
                  </Col>
                </Row>
              )}
            </Col>
          )
        )}
      </Row>

      <TransactionsTable
        baseUrl={props.baseUrl}
        modalTitle={props.modalTitle}
        place={props.place}
        title={props.title}
        model={props?.model}
      />
    </Layout>
  );
};

export default PayAndReceiveTransactions;
