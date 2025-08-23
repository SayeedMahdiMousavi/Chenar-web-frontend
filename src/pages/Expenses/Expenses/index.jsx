import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Layout, Menu } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Title } from '../../SelfComponents/Title';
import { useMediaQuery } from '../../MediaQurey';
import ExpensesTable from './ExpensesTable';
import { Link } from 'react-router-dom';
import AddExpense from './AddExpense';
import { PageMoreButton } from '../../../components';
import {
  EXPENSE_CATEGORY_M,
  EXPENSE_TYPE_M,
} from '../../../constants/permissions';
import { checkPermissionsModel } from '../../../Functions';

export const expenseBaseUrl = '/expense_revenue/expense/';

const Expenses = (props) => {
  const { t, i18n } = useTranslation();
  const isMiniTablet = useMediaQuery('(max-width:485px)');
  const isMobile = useMediaQuery('(max-width:455px)');
  const isMiniMobile = useMediaQuery('(max-width:390px)');
  const menu = (
    <Menu>
      <Menu.Item key='1'>
        <Link to='/expense-categories'>
          {t('Sales.Product_and_services.Categories.1')}
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Row className='Sales__content-3' align='middle' justify='start'>
        <Col
          xl={{ span: 7 }}
          md={{ span: 8 }}
          sm={{ span: 10 }}
          xs={{ span: 13 }}
        >
          <Row>
            <Col span={24}>
              <Title
                value={t('Expenses.Expenses_definition')}
                model={EXPENSE_TYPE_M}
              />
            </Col>
            <Col
              xl={{ span: 12, offset: 0 }}
              lg={{ span: 17, offset: 0 }}
              md={{ span: 18, offset: 0 }}
              xs={{ span: 17, offset: 0 }}
            >
              <Link to={`/expense`} className='category__product'>
                {i18n.language === 'en' ? <LeftOutlined /> : <RightOutlined />}
                {t('Expenses.1')}
              </Link>
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
        >
          <Row justify={isMobile ? 'center' : 'space-around'} gutter={[0, 5]}>
            <Col xl={10} md={10} sm={9} xs={23}>
              <PageMoreButton
                permissions={[EXPENSE_CATEGORY_M]}
                overlay={menu}
              />
            </Col>
            <Col xl={13} md={12} sm={13} xs={24}>
              <AddExpense type='expense' baseUrl={expenseBaseUrl} />
            </Col>
          </Row>
        </Col>
      </Row>

      {checkPermissionsModel(EXPENSE_TYPE_M) && (
        <ExpensesTable baseUrl={expenseBaseUrl} />
      )}
    </Layout>
  );
};

export default Expenses;
