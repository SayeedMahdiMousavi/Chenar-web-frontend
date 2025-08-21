import React, { useState } from 'react';
import { Row, Col, Card, Menu, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { Colors } from '../colors';
import { useDarkMode } from '../../Hooks/useDarkMode';
// import {
//   red,
//   volcano,
//   gold,
//   yellow,
//   lime,
//   green,
//   cyan,
//   blue,
//   geekblue,
//   purple,
//   magenta,
//   grey,
//   generate,
// } from "@ant-design/colors";

export default function New() {
  const { t } = useTranslation();

  const [showMore, setShowMore] = useState(false);
  const [mode] = useDarkMode();

  const onChangeShowMore = () => {
    setShowMore(!showMore);
  };

  // console.log(blue); // ['#E6F7FF', '#BAE7FF', '#91D5FF', ''#69C0FF', '#40A9FF', '#1890FF', '#096DD9', '#0050B3', '#003A8C', '#002766']
  // console.log(blue.primary); // '#1890FF'
  // console.log(geekblue); // '#1890FF'
  // const colors = generate("#282E33");
  // const colors1 = generate("#002766");
  // console.log(colors); // '#1890FF'
  // console.log(colors1); // '#1890FF'
  //"#6c7173", "#606466", "#545759", "#484b4d", "#3c3e40", "#282e33", "#090b0d", "#000000", "#000000", "#000000"
  //"#959ea6", "#627e99", "#43678c", "#295080", "#123b73", "#002766", "#001640", "#00081a", "#000000", "#000000"
  const theme = mode;
  const cardTpe = mode === 'dark' ? undefined : 'inner';
  const cardStyle = mode === 'dark' ? styles.card1 : {};

  return (
    <Card
      actions={[
        <Row key="action-row">
          <Col
            key="action-col"
            // offset={1}
            span={showMore ? 24 : 12}
            style={styles.action(showMore)}
            onClick={onChangeShowMore}
          >
            {/* <a
              href="#"
              
              onClick={(e) => e.preventDefault()}
            >
              
            </a> */}
            <Button type='text' style={{ color: Colors.primaryColor }}>
              {showMore
                ? t('Sales.Product_and_services.Show_More')
                : t('Sales.Product_and_services.Show_less')}
            </Button>
          </Col>
        </Row>,
      ]}
      bordered={false}
      bodyStyle={styles.showLess(showMore)}
    >
      {showMore ? (
        <Card
          bordered={false}
          bodyStyle={styles.card}
          type={cardTpe}
          style={cardStyle}
        >
          {/* <QueueAnim
            duration={1000}
            component='li'
            delay={1000}
            className='queue-simple'
          > */}
          <Menu style={styles.menu} theme={theme} selectable={false}>
            <Menu.Item key='a'>
              {t('Sales.All_sales.Invoice.Invoice')}{' '}
            </Menu.Item>
            <Menu.Item key='b'>{t('Sales.Customers.Estimate')}</Menu.Item>
            <Menu.Item key='c'>{t('Expenses.1')}</Menu.Item>
            <Menu.Item key='d'>{t('Expenses.Cheque')}</Menu.Item>
          </Menu>
          {/* </QueueAnim> */}
        </Card>
      ) : (
        <Row className='plus_new'>
          <Col lg={6} sm={12} xs={24}>
            {' '}
            <Card
              // title="CUSTOMERS"
              title={t('Sales.Customers.1')}
              bordered={false}
              bodyStyle={styles.card}
              type={cardTpe}
              style={cardStyle}
            >
              <Menu style={styles.menu} selectable={false} theme={theme}>
                <Menu.Item style={styles.margin}>
                  {t('Sales.Customers.Details.Invoice')}
                </Menu.Item>
                <Menu.Item style={styles.margin}>
                  {'Accounting.Bank_register.Receive_payment'}
                </Menu.Item>
                <Menu.Item style={styles.margin}>
                  {t('Sales.Customers.Estimate')}
                </Menu.Item>
                <Menu.Item style={styles.margin}>
                  {t('Sales.Customers.Table.Credit_notes')}
                </Menu.Item>
                <Menu.Item style={styles.margin}>
                  {t('Sales.Sales_receipt')}
                </Menu.Item>
                <Menu.Item style={styles.margin}>Refund receipt</Menu.Item>
                <Menu.Item style={styles.margin}>Delayed credit</Menu.Item>
                <Menu.Item style={styles.margin}>
                  {t('Sales.Customers.Form.Details.Delayed_charge')}
                </Menu.Item>
              </Menu>
            </Card>
          </Col>
          <Col lg={6} sm={12} xs={24}>
            {' '}
            <Card
              title={t('Expenses.Suppliers.1')}
              bordered={false}
              bodyStyle={styles.card}
              type={cardTpe}
              style={cardStyle}
            >
              <Menu style={styles.menu} selectable={false} theme={theme}>
                <Menu.Item style={styles.margin}>{t('Expenses.1')}</Menu.Item>
                <Menu.Item style={styles.margin}>
                  {t('Expenses.Cheque')}
                </Menu.Item>
                <Menu.Item style={styles.margin}>Bill</Menu.Item>
                <Menu.Item style={styles.margin}>Pay bills</Menu.Item>
                <Menu.Item style={styles.margin}>
                  {t('Purchase_order')}
                </Menu.Item>
                <Menu.Item style={styles.margin}>
                  {t('Expenses.Supplier_credit')}
                </Menu.Item>
                <Menu.Item style={styles.margin}>credit card credit</Menu.Item>
              </Menu>
            </Card>
          </Col>
          <Col lg={6} sm={12} xs={24}>
            {' '}
            <Card
              title={t('Employees.1')}
              bordered={false}
              bodyStyle={styles.card}
              type={cardTpe}
              style={cardStyle}
            >
              <Menu style={styles.menu} selectable={false} theme={theme}>
                <Menu.Item style={styles.margin}>
                  Single time activity
                </Menu.Item>
                <Menu.Item style={styles.margin}>Weekly timesheet</Menu.Item>
              </Menu>
            </Card>
          </Col>
          <Col lg={6} sm={12} xs={24}>
            {' '}
            <Card
              title='OTHERS'
              bordered={false}
              bodyStyle={styles.card}
              type={cardTpe}
              style={cardStyle}
            >
              <Menu style={styles.menu} selectable={false} theme={theme}>
                <Menu.Item style={styles.margin}>Bank deposit</Menu.Item>
                <Menu.Item style={styles.margin}>
                  {t('Accounting.Bank_register.Transfer')}
                </Menu.Item>
                <Menu.Item style={styles.margin}>
                  {t('Accounting.Bank_register.Journal_entry')}
                </Menu.Item>
                <Menu.Item style={styles.margin}>
                  {t('Expenses.Pay_down_credit_card')}
                </Menu.Item>
              </Menu>
            </Card>
          </Col>
        </Row>
      )}
    </Card>
  );
}
const styles = {
  menu: {
    border: 'none',
    height: '100%',
  },
  card1: { height: '100%' },
  action: (showMore) => ({ textAlign: showMore ? 'center' : 'start' }),
  card: { padding: '0px', height: '100%' },
  row: { width: '75vw' },
  showLess: (showMore) => ({
    padding: 0,
    height: '100%',
  }),
  margin: { margin: '0rem' },
};
