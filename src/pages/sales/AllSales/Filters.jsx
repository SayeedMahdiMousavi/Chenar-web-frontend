import React, { useState, useEffect } from 'react';
import { Row, Col, Select, Form, Button, DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { ApplyButton, ResetButton } from '../../../components';

const { RangePicker } = DatePicker;

const { Option } = Select;
const Filters = (props) => {
  const { t } = useTranslation();
  // const database = useDatabase();
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(props.customers);
  }, [props.customers]);
  const onFinish = async (fieldsValue) => {};
  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form
      layout='vertical'
      onFinish={onFinish}
      form={form}
      initialValues={{
        ['date']: 'all dates',
        ['type']: 'all transactions',
        ['delivered_method']: 'any',
        ['status']: 'all statuses',
        ['payee']: 'all',
      }}
      className='expenses_filter'
    >
      <Row gutter={[0, 11]} className='expenses_filter_row'>
        <Col
          md={{ span: 9, offset: 1 }}
          xs={{ span: 22, offset: 1 }}
          style={{ padding: '0rem' }}
        >
          <Form.Item
            name='type'
            label={
              <p style={styles.margin}>
                {t('Sales.Product_and_services.Type')}
              </p>
            }
            style={styles.margin}
          >
            <Select className='table__header1-select' allowClear autoFocus>
              <Option value='all transactions'>
                {t('Sales.Product_and_services.All')}&nbsp;
                {t('Sales.Customers.Transactions').toLowerCase()}
              </Option>
              <Option value='expense'>{t('Expenses.Expense')}</Option>
              <Option value='bill payments'>
                {t('Expenses.Table.Bill_payments')}
              </Option>
              <Option value='open invoices'>{t('Expenses.Cheque')}</Option>
              <Option value='recently paid'>
                {t('Expenses.Table.Recently_paid')}
              </Option>
              <Option value='credit cart payment'>
                {t('Expenses.Table.Credit_cart_payment')}
              </Option>
            </Select>
          </Form.Item>
        </Col>
        <Col
          md={{ span: 13, offset: 1 }}
          xs={{ span: 22, offset: 1 }}
          className='expense_filter_view'
        >
          <Link to='/'> {t('Expenses.Table.View_deleted/voided')}</Link>
        </Col>
        <Col md={{ span: 9, offset: 1 }} xs={{ span: 22, offset: 1 }}>
          <Form.Item
            name='status'
            label={t('Sales.Product_and_services.Status')}
            style={styles.margin}
          >
            <Select className='table__header1-select' allowClear>
              <Option value='all statuses'>
                {t('Expenses.Table.All_statuses')}
              </Option>
              <Option value='tody'> {t('Sales.Customers.Table.Tody')}</Option>
              <Option value='open'>
                {
                  t('Sales.Customers.Details.Open')
                  // .split(" ")
                  // .map(
                  //   (w) => w?.[0]?.toUpperCase() + w?.substr(1)?.toLowerCase()
                  // )
                  // .join(" ")
                }
              </Option>
              <Option value='overdue'>
                {
                  t('Sales.Customers.Details.Overdue')
                  // .split(" ")
                  // .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
                  // .join(" ")
                }
              </Option>
              <Option value='paid'>{t('Expenses.Table.Paid')}</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col md={{ span: 12, offset: 1 }} xs={{ span: 22, offset: 1 }}>
          <Form.Item
            name='delivered_method'
            label={t('Expenses.Table.Delivered_method')}
            style={styles.margin}
          >
            <Select className='table__header1-select' allowClear>
              <Option value='any'> {t('Expenses.Table.Any')}</Option>
              <Option value='print later'>
                {t('Expenses.Table.Print_later')}
              </Option>
            </Select>
          </Form.Item>
        </Col>
        <Col md={{ span: 9, offset: 1 }} xs={{ span: 22, offset: 1 }}>
          <Form.Item
            name='date'
            label={t('Sales.Customers.Form.Date')}
            style={styles.margin}
          >
            <Select className='table__header1-select' allowClear>
              <Option value='allDates'>
                {t('Sales.Customers.Table.All_dates')}
              </Option>
              <Option value='last365Days'>
                {t('Expenses.Table.last_365_days')}
              </Option>
              <Option value='custom'>{t('Expenses.Table.Custom')}</Option>

              <Option value='tody'> {t('Sales.Customers.Table.Tody')}</Option>
              <Option value='yesterday'>
                {t('Sales.Customers.Table.Yesterday')}
              </Option>
              <Option value='thisWeek'>
                {t('Sales.Customers.Table.This_week')}
              </Option>
              <Option value='thisMonth'>
                {t('Sales.Customers.Table.This_month')}
              </Option>
              <Option value='thisQuarter'>
                {t('Sales.Customers.Table.This_quarter')}
              </Option>

              <Option value='thisYear'>
                {t('Sales.Customers.Table.This_year')}
              </Option>

              <Option value='last_week'>
                {t('Sales.Customers.Table.Last_week')}
              </Option>
              <Option value='lastMonth'>
                {t('Sales.Customers.Table.Last_month')}
              </Option>
              <Option value='lastQuarter'>
                {t('Sales.Customers.Table.Last_quarter')}
              </Option>
              <Option value='lastYear'>
                {t('Sales.Customers.Table.Last_year')}
              </Option>
            </Select>
          </Form.Item>
        </Col>
        <Col md={{ span: 12, offset: 1 }} xs={{ span: 22, offset: 1 }}>
          <Form.Item
            name='range-picker'
            label={
              <Row className='num'>
                <Col span={13}>{t('Expenses.Table.Start')}</Col>
                <Col span={11}>{t('Expenses.Table.End')}</Col>
              </Row>
            }
            style={styles.margin}
          >
            <RangePicker popupClassName='expenses_rangePicker' />
          </Form.Item>
        </Col>

        <Col md={{ span: 9, offset: 1 }} xs={{ span: 22, offset: 1 }}>
          <Form.Item
            name='payee'
            label={t('Expenses.Table.Payee')}
            style={styles.margin}
          >
            <Select
              className='table__header1-select'
              allowClear
              showSearch
              // dropdownRender={(menu) => <div>{menu}</div>}
            >
              <Option value='all'>{t('Sales.Product_and_services.All')}</Option>
              {items?.map((item) => (
                <Option value={item.name} key={item.id}>
                  {item.display_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24} className='unit__submit'>
          <Form.Item style={styles.margin}>
            <Row className='num unit__cancel'>
              <Col
                xl={{ span: 5, offset: 1 }}
                md={{ span: 5, offset: 1 }}
                sm={{ span: 8, offset: 1 }}
                xs={{ span: 8, offset: 1 }}
              >
                <ResetButton onClick={onReset} />
              </Col>
              <Col
                xl={{ span: 5, offset: 13 }}
                md={{ span: 5, offset: 13 }}
                sm={{ span: 8, offset: 7 }}
                xs={{ span: 9, offset: 5 }}
              >
                <ApplyButton />
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
const styles = {
  margin: { marginBottom: '0rem' },
};
const mapStateToProps = (state) => ({
  rtl: state.direction.rtl,
  ltr: state.direction.ltr,
});

// const enhancProduct = withObservables(["customers"], ({ database }) => ({
//   customers: database.collections.get("customers").query().observe(),
// }));

// export default connect(mapStateToProps)(withDatabase(enhancProduct(Filters)));
export default connect(mapStateToProps)(Filters);
