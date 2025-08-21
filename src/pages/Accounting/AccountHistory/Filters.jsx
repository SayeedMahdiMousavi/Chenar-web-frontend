import React, { useState, useEffect } from 'react';
import {
  // Checkbox,
  Row,
  Col,
  Select,
  // message,
  // Menu,
  Form,
  // Table,
  // Dropdown,
  Button,
  Input,
  // Modal,
  DatePicker,
} from 'antd';

import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
// import { useDatabase } from "@nozbe/watermelondb/hooks";
// import withObservables from "@nozbe/with-observables";
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};
const { Option } = Select;
const Filters = (props) => {
  const { t } = useTranslation();
  // const database = useDatabase();
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(props.customers);
  }, [props.customers]);
  const onFinish = async (fieldsValue) => {
    // const rangeValue = fieldsValue["range-picker"];
    // const values = {
    //   ...fieldsValue,
    //   "range-picker": [
    //     rangeValue[0].format("YYYY-MM-DD"),
    //     rangeValue[1].format("YYYY-MM-DD"),
    //   ],
    // };
    // await props.filter(values);
  };
  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form
      {...formItemLayout}
      layout='vertical'
      onFinish={onFinish}
      form={form}
      initialValues={{
        ['date']: 'all dates',

        ['reconcileStatus']: 'all',
        ['transactionType']: 'all',
        ['payee']: 'all',
      }}
      className='expenses_filter'
    >
      <Row gutter={[0, 11]} className='expenses_filter_row'>
        <Col offset={1} span={22}>
          <Form.Item
            name='find'
            label={
              <p style={styles.margin}> {t('Accounting.Bank_register.Find')}</p>
            }
            style={styles.margin}
          >
            <Input.Search />
          </Form.Item>
        </Col>

        <Col md={{ span: 9, offset: 1 }} xs={{ span: 22, offset: 1 }}>
          <Form.Item
            name='reconcileStatus'
            label='Reconcile Status'
            style={styles.margin}
          >
            <Select className='table__header1-select' allowClear>
              <Option value='all'>{t('Sales.Product_and_services.All')}</Option>
              <Option value='Reconciling'>
                {' '}
                {t('Accounting.Bank_register.Reconciling')}
              </Option>
              <Option value='Cleared'>
                {t('Accounting.Bank_register.Cleared')}
              </Option>
              <Option value='No status'>
                {t('Accounting.Bank_register.No_status')}
              </Option>
              <Option value='No reconciled'>
                {' '}
                {t('Accounting.Bank_register.No_reconciled')}
              </Option>
            </Select>
          </Form.Item>
        </Col>
        <Col md={{ span: 12, offset: 1 }} xs={{ span: 22, offset: 1 }}>
          <Form.Item
            name='transactionType'
            label={t('Accounting.Bank_register.Transaction_type')}
            style={styles.margin}
          >
            <Select className='table__header1-select' allowClear>
              <Option value='all'>
                {' '}
                {t('Sales.Product_and_services.All')}
              </Option>
              {items?.map((item) => (
                <Option value={item.name} key={item.id}>
                  {item.display_name}
                </Option>
              ))}
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
              <Option value='all dates'>
                {t('Sales.Customers.Table.All_dates')}
              </Option>
              <Option value='last 365 days'>
                {t('Expenses.Table.last_365_days')}
              </Option>
              <Option value='custom'>{t('Expenses.Table.Custom')}</Option>

              <Option value='tody'> {t('Sales.Customers.Table.Tody')}</Option>
              <Option value='yesterday'>
                {t('Sales.Customers.Table.Yesterday')}
              </Option>
              <Option value='this_week'>
                {t('Sales.Customers.Table.This_week')}
              </Option>
              <Option value='this_month'>
                {t('Sales.Customers.Table.This_month')}
              </Option>
              <Option value='this_quarter'>
                {t('Sales.Customers.Table.This_quarter')}
              </Option>

              <Option value='this_year'>
                {t('Sales.Customers.Table.This_year')}
              </Option>

              <Option value='last_week'>
                {t('Sales.Customers.Table.Last_week')}
              </Option>
              <Option value='last month'>
                {t('Sales.Customers.Table.Last_month')}
              </Option>
              <Option value='last quarter'>
                {t('Sales.Customers.Table.Last_quarter')}
              </Option>
              <Option value='last year'>
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
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
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
                <Button htmlType='reset' shape='round' onClick={onReset}>
                  {t('Form.Reset')}
                </Button>
              </Col>
              <Col
                xl={{ span: 5, offset: 13 }}
                md={{ span: 5, offset: 13 }}
                sm={{ span: 8, offset: 7 }}
                xs={{ span: 9, offset: 5 }}
              >
                <Button type='primary' htmlType='submit' shape='round'>
                  {t('Form.Apply')}
                </Button>
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
