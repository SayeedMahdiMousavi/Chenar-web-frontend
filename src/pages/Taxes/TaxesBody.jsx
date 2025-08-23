import React from 'react';
import { Tabs, Button, Row, Col, Menu, Typography, Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';
import ReturnTable from './Returns/ReturnTable';
import { Colors } from '../colors';
import PaymentsTable from './Payments/PaymentsTable';

const { TabPane } = Tabs;
const { Text } = Typography;

const TaxesBody = () => {
  const { t } = useTranslation();
  const menu = (
    <Menu>
      <Menu.Item key='1'>
        <Link to='/sales/categories'>
          <Text>Taxable Sales Summary</Text>
        </Link>
      </Menu.Item>
      <Menu.Item key='2'>
        <Link to='/sales/units'>
          <Text>Transactions without sales tax</Text>{' '}
        </Link>
      </Menu.Item>
      <Menu.Item key='3'>
        <Link to='/sales/units'>
          <Text>Profile and loss</Text>{' '}
        </Link>
      </Menu.Item>
    </Menu>
  );
  const operations = (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button shape='round' className='num'>
        {/* {t("Sales.Product_and_services.More")} */}
        <Text>View reports</Text>
        <DownOutlined />
      </Button>
    </Dropdown>
  );
  return (
    <Row justify='space-around'>
      <Col span={23}>
        <Row justify='space-around'>
          <Col span={24} className='banner'>
            <Tabs
              tabBarExtraContent={operations}
              tabBarStyle={styles.tabs}
              className='tabBar'
              animated={false}
            >
              <TabPane tab={t('Taxes.Returns')} key='1'>
                <ReturnTable />
              </TabPane>
              <TabPane tab='Payments' key='2'>
                <PaymentsTable />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
const styles = {
  tabs: {
    marginBottom: '0rem',
    background: `${Colors.white}`,
    // marginTop: "20px",/\
    padding: '10px  20px 0 20px',
  },
};
export default TaxesBody;
